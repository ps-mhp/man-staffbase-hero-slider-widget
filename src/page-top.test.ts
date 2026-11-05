/*!
 * Copyright 2026, MHP Management und IT-Beratung GmbH and contributors.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  MAX_PLAUSIBLE_TOP,
  canPlacePreBreadcrumbs,
  holdPageTop,
  measurePageTop,
} from "./page-top";

/**
 * jsdom rechnet kein Layout: `getBoundingClientRect` liefert überall Nullen.
 * Die Kanten werden deshalb je Test gesetzt — geprüft wird die Entscheidung,
 * welche Kante zählt, nicht der Browser.
 */
function setRect(element: HTMLElement, rect: Partial<DOMRect>): void {
  element.getBoundingClientRect = () =>
    ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, ...rect }) as DOMRect;
}

/** Die feste Kopf- und Menüleiste über der Seite. */
function addChrome(bottom: number): HTMLElement {
  const menu = document.createElement("div");
  menu.id = "mega-menu";
  menu.style.position = "fixed";
  setRect(menu, { top: 0, bottom, height: bottom });
  document.body.appendChild(menu);
  return menu;
}

/** Der Seitenrahmen; seine Oberkante ist der Bezugspunkt jeder Messung. */
function addWrapper(top = 0): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.id = "wrapper";
  wrapper.style.position = "relative";
  setRect(wrapper, { top, bottom: top + 2000, height: 2000 });
  document.body.appendChild(wrapper);
  return wrapper;
}

/**
 * Die Brotkrumen in ihrem Kasten, so wie Staffbase sie stellt: der Kasten
 * absolut über der Seite, die Liste darin im Fluss.
 */
function addBreadcrumbs(
  wrapper: HTMLElement,
  bottom: number,
  positioned = true,
): { box: HTMLElement; crumbs: HTMLElement } {
  const box = document.createElement("div");
  if (positioned) box.style.position = "absolute";
  setRect(box, { top: bottom - 20, bottom, height: 20 });
  const crumbs = document.createElement("nav");
  crumbs.id = "breadcrumbs";
  setRect(crumbs, { top: bottom - 20, bottom, height: 20 });
  box.appendChild(crumbs);
  wrapper.appendChild(box);
  return { box, crumbs };
}

/** Die Bühne selbst; im Modus `pre` trägt ihre Unterkante die Brotkrumen. */
function addHost(wrapper: HTMLElement, top: number, bottom: number): HTMLElement {
  const host = document.createElement("div");
  host.className = "man-hero-host";
  setRect(host, { top, bottom, height: bottom - top });
  wrapper.appendChild(host);
  return host;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("measurePageTop", () => {
  it("setzt die Bühne unter die Brotkrumen, wenn es welche gibt", () => {
    addChrome(136);
    const wrapper = addWrapper();
    // `top: calc(136px + 30px)` plus 20px Höhe, wie am lebenden System.
    addBreadcrumbs(wrapper, 186);

    // Nicht 136 (die Menükante): die Brotkrumen liegen aus dem Fluss, eine
    // Bühne ab 136px läge quer unter ihnen.
    expect(measurePageTop(document)).toBe(186);
  });

  it("setzt die Bühne bündig ans Menü, wenn die Seite keine Brotkrumen hat", () => {
    addChrome(136);
    addWrapper();

    expect(measurePageTop(document)).toBe(136);
  });

  it("übergeht ausgeblendete Brotkrumen", () => {
    addChrome(136);
    const wrapper = addWrapper();
    const { crumbs } = addBreadcrumbs(wrapper, 186);
    setRect(crumbs, { top: 0, bottom: 0, height: 0 });

    // Ein Kasten ohne Höhe ist keine Zeile, unter die etwas rücken müsste.
    expect(measurePageTop(document)).toBe(136);
  });

  it("misst Brotkrumen im Fluss nicht, sondern lässt sie selbst schieben", () => {
    addChrome(136);
    const wrapper = addWrapper();
    addBreadcrumbs(wrapper, 186, false);

    // Stehen sie im Fluss, ist ihre Unterkante eine Folge des Kopfabstands:
    // sie zu messen hiesse, den eigenen Eingriff zu messen. Der Inhalt
    // beginnt am Menü, und die Brotkrumen schieben die Bühne von dort aus
    // selbst nach unten.
    expect(measurePageTop(document)).toBe(136);
  });

  it("rechnet die Kante der Brotkrumen auf den Seitenanfang um", () => {
    addChrome(136);
    // Eine gescrollte Seite: der Rahmen steht im Fenster bei -200, im
    // Dokument aber weiterhin bei 0.
    const wrapper = addWrapper(-200);
    Object.defineProperty(document.documentElement, "scrollTop", {
      value: 200,
      configurable: true,
    });
    addBreadcrumbs(wrapper, -14);

    expect(measurePageTop(document)).toBe(186);

    Object.defineProperty(document.documentElement, "scrollTop", {
      value: 0,
      configurable: true,
    });
  });

  it("fasst nichts an, wenn keine feste Leiste zu messen ist", () => {
    addWrapper();

    expect(measurePageTop(document)).toBeNull();
  });

  it("fasst nichts an, wenn die Kopfzeile im Fluss steht", () => {
    const menu = addChrome(136);
    menu.style.position = "static";
    addWrapper();

    // Eine Leiste im Fluss nimmt sich ihren Platz selbst; freigehalten
    // werden muss nichts.
    expect(measurePageTop(document)).toBeNull();
  });

  it("verwirft einen unglaubwürdig tiefen Messwert", () => {
    addChrome(MAX_PLAUSIBLE_TOP + 1);
    addWrapper();

    // Im Zweifel bleibt der Abstand, den Staffbase selbst setzt — er ist
    // nur unschön, nicht kaputt.
    expect(measurePageTop(document)).toBeNull();
  });

  it("fasst nichts an, wenn es den Seitenrahmen nicht gibt", () => {
    addChrome(136);

    expect(measurePageTop(document)).toBeNull();
  });
});

describe("holdPageTop", () => {
  it("setzt den Kopfabstand mit Nachdruck und nimmt ihn wieder zurück", () => {
    addChrome(136);
    const wrapper = addWrapper();

    const release = holdPageTop(document);

    expect(wrapper.style.getPropertyValue("padding-top")).toBe("136px");
    // Der Gegner steht bei vier Klassen und einer Kennung.
    expect(wrapper.style.getPropertyPriority("padding-top")).toBe("important");

    release();

    // Das Widget wird in fremde Seiten eingebettet und darf beim Verschwinden
    // nichts zurücklassen.
    expect(wrapper.style.getPropertyValue("padding-top")).toBe("");
  });

  it("gibt den Abstand erst frei, wenn die letzte Bühne geht", () => {
    addChrome(136);
    const wrapper = addWrapper();

    const first = holdPageTop(document);
    const second = holdPageTop(document);

    first();
    expect(wrapper.style.getPropertyValue("padding-top")).toBe("136px");

    second();
    expect(wrapper.style.getPropertyValue("padding-top")).toBe("");
  });

  it("stellt einen vorgefundenen Inline-Wert wieder her", () => {
    addChrome(136);
    const wrapper = addWrapper();
    wrapper.style.setProperty("padding-top", "42px");

    holdPageTop(document)();

    expect(wrapper.style.getPropertyValue("padding-top")).toBe("42px");
  });

  it("misst nach, wenn die Seite die Brotkrumen nachträgt", async () => {
    addChrome(136);
    const wrapper = addWrapper();

    const release = holdPageTop(document);
    expect(wrapper.style.getPropertyValue("padding-top")).toBe("136px");

    // Staffbase trägt die Brotkrumen erst nach dem ersten Bildaufbau ein;
    // ohne Nachmessen klebte die Bühne für immer am Menü und die Brotkrumen
    // lägen quer darüber.
    addBreadcrumbs(wrapper, 186);
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(wrapper.style.getPropertyValue("padding-top")).toBe("186px");

    release();
  });
});

describe("measurePageTop — Lage vor den Brotkrumen", () => {
  it("setzt die Bühne bündig ans Menü, obwohl es Brotkrumen gibt", () => {
    addChrome(136);
    const wrapper = addWrapper();
    addBreadcrumbs(wrapper, 186);

    // Genau der Unterschied zum Modus `post`: dort wäre es 186.
    expect(measurePageTop(document, "pre")).toBe(136);
  });

  it("verwirft auch hier einen unglaubwürdig tiefen Messwert", () => {
    addChrome(MAX_PLAUSIBLE_TOP + 1);
    const wrapper = addWrapper();
    addBreadcrumbs(wrapper, MAX_PLAUSIBLE_TOP + 1);

    expect(measurePageTop(document, "pre")).toBeNull();
  });
});

describe("canPlacePreBreadcrumbs", () => {
  it("lässt die Lage zu, wenn Brotkrumen aus dem Fluss über der Bühne liegen", () => {
    addChrome(136);
    const wrapper = addWrapper();
    addBreadcrumbs(wrapper, 186);
    const host = addHost(wrapper, 136, 636);

    expect(canPlacePreBreadcrumbs(document, host)).toBe(true);
  });

  it("verweigert sie ohne Brotkrumen", () => {
    addChrome(136);
    const wrapper = addWrapper();
    const host = addHost(wrapper, 136, 636);

    // Ohne Brotkrumen gibt es nichts zu verschieben; die Bühne steht ohnehin
    // am Menü, und die Lage ist eine Unterscheidung ohne Unterschied.
    expect(canPlacePreBreadcrumbs(document, host)).toBe(false);
  });

  it("verweigert sie bei Brotkrumen im Fluss", () => {
    addChrome(136);
    const wrapper = addWrapper();
    addBreadcrumbs(wrapper, 186, false);
    const host = addHost(wrapper, 186, 686);

    // Stehen sie im Fluss, schieben sie den Inhalt selbst. Ihnen ein `top` zu
    // schreiben bliebe folgenlos.
    expect(canPlacePreBreadcrumbs(document, host)).toBe(false);
  });

  it("verweigert sie, wenn die Bühne nicht oben auf der Seite steht", () => {
    addChrome(136);
    const wrapper = addWrapper();
    addBreadcrumbs(wrapper, 186);
    const host = addHost(wrapper, MAX_PLAUSIBLE_TOP + 100, MAX_PLAUSIBLE_TOP + 600);

    // Die Brotkrumen unter eine Bühne zu schieben, über der schon Inhalt
    // steht, ergäbe eine Zeile mitten auf der Seite.
    expect(canPlacePreBreadcrumbs(document, host)).toBe(false);
  });

  it("verweigert sie ohne bekannte Bühne", () => {
    addChrome(136);
    const wrapper = addWrapper();
    addBreadcrumbs(wrapper, 186);

    // Ohne Unterkante der Bühne gibt es kein Ziel für die Brotkrumen.
    expect(canPlacePreBreadcrumbs(document, null)).toBe(false);
  });
});

describe("holdPageTop — Lage vor den Brotkrumen", () => {
  it("setzt die Bühne ans Menü und die Brotkrumen unter sie", () => {
    addChrome(136);
    const wrapper = addWrapper();
    const { box } = addBreadcrumbs(wrapper, 186);
    const host = addHost(wrapper, 136, 636);

    const release = holdPageTop(document, { position: "pre", host });

    expect(wrapper.style.getPropertyValue("padding-top")).toBe("136px");
    expect(box.style.getPropertyValue("top")).toBe("636px");
    // Der Gegner führt seinen Wert bei hoher Spezifität.
    expect(box.style.getPropertyPriority("top")).toBe("important");

    release();

    // Das Widget wird in fremde Seiten eingebettet und darf nichts zurücklassen.
    expect(wrapper.style.getPropertyValue("padding-top")).toBe("");
    expect(box.style.getPropertyValue("top")).toBe("");
  });

  it("stellt ein vorgefundenes Inline-top der Brotkrumen wieder her", () => {
    addChrome(136);
    const wrapper = addWrapper();
    const { box } = addBreadcrumbs(wrapper, 186);
    box.style.setProperty("top", "122px");
    const host = addHost(wrapper, 136, 636);

    holdPageTop(document, { position: "pre", host })();

    expect(box.style.getPropertyValue("top")).toBe("122px");
  });

  it("meldet die Höhe der Brotkrumen, damit die Bühne Platz freihält", () => {
    addChrome(136);
    const wrapper = addWrapper();
    addBreadcrumbs(wrapper, 186);
    const host = addHost(wrapper, 136, 636);

    const seen: { applied: boolean; breadcrumbsHeight: number }[] = [];
    const release = holdPageTop(document, {
      position: "pre",
      host,
      onLayout: (layout) => seen.push(layout),
    });

    expect(seen.at(-1)).toEqual({ applied: true, breadcrumbsHeight: 20 });

    release();
  });

  it("fällt still auf die Lage unter den Brotkrumen zurück, wenn sie nicht geht", () => {
    addChrome(136);
    const wrapper = addWrapper();
    addBreadcrumbs(wrapper, 186);
    // Die Bühne steht nicht oben auf der Seite.
    const host = addHost(wrapper, MAX_PLAUSIBLE_TOP + 100, MAX_PLAUSIBLE_TOP + 600);

    const seen: { applied: boolean; breadcrumbsHeight: number }[] = [];
    const release = holdPageTop(document, {
      position: "pre",
      host,
      onLayout: (layout) => seen.push(layout),
    });

    expect(seen.at(-1)).toEqual({ applied: false, breadcrumbsHeight: 0 });
    // Der Innenabstand folgt dann der Regel von `post`.
    expect(wrapper.style.getPropertyValue("padding-top")).toBe("186px");

    release();
  });

  it("meldet im Modus post nichts Freizuhaltendes", () => {
    addChrome(136);
    const wrapper = addWrapper();
    const { box } = addBreadcrumbs(wrapper, 186);
    const host = addHost(wrapper, 186, 686);

    const seen: { applied: boolean; breadcrumbsHeight: number }[] = [];
    const release = holdPageTop(document, {
      position: "post",
      host,
      onLayout: (layout) => seen.push(layout),
    });

    expect(seen.at(-1)).toEqual({ applied: true, breadcrumbsHeight: 0 });
    // Im Modus `post` bleiben die Brotkrumen unangetastet.
    expect(box.style.getPropertyValue("top")).toBe("");

    release();
  });

  it("gibt die Brotkrumen erst frei, wenn die letzte Bühne geht", () => {
    addChrome(136);
    const wrapper = addWrapper();
    const { box } = addBreadcrumbs(wrapper, 186);
    const host = addHost(wrapper, 136, 636);

    const first = holdPageTop(document, { position: "pre", host });
    const second = holdPageTop(document, { position: "pre", host });

    first();
    expect(box.style.getPropertyValue("top")).toBe("636px");

    second();
    expect(box.style.getPropertyValue("top")).toBe("");
  });
});
