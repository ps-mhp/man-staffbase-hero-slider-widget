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

import { renderHook } from "@testing-library/react";

import {
  MAX_PLAUSIBLE_TOP,
  canPlacePreBreadcrumbs,
  holdPageTop,
  measurePageTop,
  usePageTop,
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

/**
 * Halter, die der Test nicht selbst freigibt. Der Zustand des Moduls überlebt
 * den einzelnen Test; ohne Aufräumen trüge ein gescheiterter Test seinen
 * Halter in den nächsten.
 */
const openReleases: (() => void)[] = [];

/** {@link holdPageTop} mit Freigabe am Testende. */
function hold(options: Parameters<typeof holdPageTop>[1]): () => void {
  const release = holdPageTop(document, options);
  openReleases.push(release);
  return release;
}

afterEach(() => {
  while (openReleases.length > 0) openReleases.pop()?.();
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

/**
 * Ein Aufbau, dessen Kanten aus unseren eigenen geschriebenen Werten folgen —
 * die Bühne beginnt am Innenabstand des Rahmens, der Brotkrumen-Kasten steht
 * dort, wo sein Inline-`top` ihn hinstellt.
 *
 * Die festen `setRect`-Kanten der übrigen Tests können eine Rückkopplung gar
 * nicht zeigen: sie ändern sich nie. Erst hier wird messbar, ob ein zweiter
 * Durchlauf dieselben Werte schreibt wie der erste.
 */
function addDerivedPage(): { wrapper: HTMLElement; box: HTMLElement; host: HTMLElement } {
  addChrome(136);
  const wrapper = addWrapper();

  const box = document.createElement("div");
  box.style.position = "absolute";
  const crumbs = document.createElement("nav");
  crumbs.id = "breadcrumbs";
  box.appendChild(crumbs);
  wrapper.appendChild(box);

  const host = document.createElement("div");
  host.className = "man-hero-host";
  wrapper.appendChild(host);

  const edge = (element: HTMLElement, property: string, fallback: number): number => {
    const inline = element.style.getPropertyValue(property);
    return inline === "" ? fallback : Number.parseFloat(inline);
  };
  const rect = (top: number, height: number): DOMRect =>
    ({
      top,
      bottom: top + height,
      height,
      left: 0,
      right: 0,
      width: 0,
      x: 0,
      y: top,
    }) as DOMRect;

  // Der Kasten hängt an dem `top`, das wir ihm schreiben; ohne unseres steht
  // er dort, wo Staffbase ihn stellt.
  const boxRect = (): DOMRect => rect(edge(box, "top", 166), 20);
  box.getBoundingClientRect = boxRect;
  crumbs.getBoundingClientRect = boxRect;
  // Die Bühne hängt am Innenabstand, den wir dem Rahmen schreiben.
  host.getBoundingClientRect = () => rect(edge(wrapper, "padding-top", 0), 500);

  return { wrapper, box, host };
}

/** Einen Nachmessdurchlauf auslösen, wie die Seite ihn auslöst: durch Umbau. */
async function triggerPass(): Promise<void> {
  document.body.appendChild(document.createElement("span"));
  await new Promise((resolve) => setTimeout(resolve, 50));
}

describe("holdPageTop — Rückkopplung", () => {
  it("schreibt im zweiten Durchlauf dieselben Werte wie im ersten", async () => {
    const { wrapper, box, host } = addDerivedPage();

    const release = hold({ position: "pre", host });

    const paddingAfterFirst = wrapper.style.getPropertyValue("padding-top");
    const topAfterFirst = box.style.getPropertyValue("top");
    expect(paddingAfterFirst).toBe("136px");
    expect(topAfterFirst).toBe("636px");

    await triggerPass();

    // Flösse ein geschriebener Wert in eine gemessene Kante zurück, wanderte
    // die Seite bei jedem Durchlauf ein Stück weiter nach unten.
    expect(wrapper.style.getPropertyValue("padding-top")).toBe(paddingAfterFirst);
    expect(box.style.getPropertyValue("top")).toBe(topAfterFirst);

    release();
    expect(box.style.getPropertyValue("top")).toBe("");
  });

  it("findet zurück, wenn die Lage wegfällt, während die Brotkrumen verschoben sind", async () => {
    const { wrapper, box, host } = addDerivedPage();

    const seen: { applied: boolean; breadcrumbsHeight: number }[] = [];
    const release = hold({
      position: "pre",
      host,
      onLayout: (layout) => seen.push(layout),
    });
    expect(box.style.getPropertyValue("top")).toBe("636px");

    // Über der Bühne taucht Inhalt auf: die Lage vor den Brotkrumen passt
    // nicht mehr. Gemessen werden dürfen die Brotkrumen erst, nachdem sie
    // zurückgestellt sind — sonst misst der Eingriff seinen eigenen Wert.
    host.getBoundingClientRect = () =>
      ({
        top: MAX_PLAUSIBLE_TOP + 100,
        bottom: MAX_PLAUSIBLE_TOP + 600,
        height: 500,
        left: 0,
        right: 0,
        width: 0,
        x: 0,
        y: MAX_PLAUSIBLE_TOP + 100,
      }) as DOMRect;
    await triggerPass();

    expect(box.style.getPropertyValue("top")).toBe("");
    expect(wrapper.style.getPropertyValue("padding-top")).toBe("186px");
    expect(seen.at(-1)).toEqual({ applied: false, breadcrumbsHeight: 0 });

    release();
  });
});

describe("holdPageTop — mehrere Bühnen", () => {
  it("gibt Modus und Bühne auf, sobald ihr Halter geht", async () => {
    addChrome(136);
    const wrapper = addWrapper();
    const { box } = addBreadcrumbs(wrapper, 186);
    const first = addHost(wrapper, 136, 636);
    const second = addHost(wrapper, 186, 686);

    const releaseFirst = hold({ position: "pre", host: first });
    const releaseSecond = hold({ position: "post", host: second });

    releaseFirst();
    // Eine abgehängte Bühne hat keinen Kasten mehr; ihr Rechteck ist leer.
    first.remove();
    setRect(first, {});
    await triggerPass();

    // Die zweite Bühne hat `post` angemeldet; der Modus der ersten darf sie
    // nicht überleben.
    expect(box.style.getPropertyValue("top")).toBe("");
    expect(wrapper.style.getPropertyValue("padding-top")).toBe("186px");

    releaseSecond();
  });

  it("verweigert die Lage bei einer Bühne ohne Höhe", () => {
    addChrome(136);
    const wrapper = addWrapper();
    addBreadcrumbs(wrapper, 186);
    const host = addHost(wrapper, 0, 0);

    // Vor dem ersten Bildaufbau oder unter einem ausgeblendeten Vorfahren ist
    // das Rechteck leer — das ist keine Bühne, unter die etwas rücken könnte.
    expect(canPlacePreBreadcrumbs(document, host)).toBe(false);
  });
});

describe("holdPageTop — ausgetauschter Brotkrumen-Kasten", () => {
  it("lässt auf keinem der beiden Kästen ein erzwungenes top zurück", async () => {
    addChrome(136);
    const wrapper = addWrapper();
    const { box: oldBox } = addBreadcrumbs(wrapper, 186);
    const host = addHost(wrapper, 136, 636);

    const release = hold({ position: "pre", host });
    expect(oldBox.style.getPropertyValue("top")).toBe("636px");

    // Die Einzelseitenanwendung tauscht den Kasten beim Seitenwechsel aus.
    oldBox.remove();
    const { box: newBox } = addBreadcrumbs(wrapper, 186);
    await triggerPass();
    expect(newBox.style.getPropertyValue("top")).toBe("636px");

    release();

    expect(newBox.style.getPropertyValue("top")).toBe("");
    expect(oldBox.style.getPropertyValue("top")).toBe("");
  });
});

describe("holdPageTop — ausgetauschter Seitenrahmen", () => {
  it("lässt auf keinem der beiden Rahmen einen erzwungenen Kopfabstand zurück", async () => {
    addChrome(136);
    const oldWrapper = addWrapper();

    const release = hold({});
    expect(oldWrapper.style.getPropertyValue("padding-top")).toBe("136px");

    // Die Einzelseitenanwendung tauscht den Rahmen beim Seitenwechsel aus.
    oldWrapper.remove();
    const newWrapper = addWrapper();
    await triggerPass();
    expect(newWrapper.style.getPropertyValue("padding-top")).toBe("136px");

    release();

    // Das Widget wird in fremde Seiten eingebettet und darf nichts
    // zurücklassen — schon gar kein `!important` auf einem Rahmen, den es
    // nicht mehr kennt.
    expect(newWrapper.style.getPropertyValue("padding-top")).toBe("");
    expect(oldWrapper.style.getPropertyValue("padding-top")).toBe("");
  });
});

describe("holdPageTop — Meldung je Bühne", () => {
  it("meldet die Höhe der Brotkrumen nur der Bühne, unter der sie liegen", () => {
    addChrome(136);
    const wrapper = addWrapper();
    addBreadcrumbs(wrapper, 186);
    const first = addHost(wrapper, 136, 636);
    const second = addHost(wrapper, 636, 1136);

    const seenFirst: { applied: boolean; breadcrumbsHeight: number }[] = [];
    const seenSecond: { applied: boolean; breadcrumbsHeight: number }[] = [];
    hold({ position: "pre", host: first, onLayout: (layout) => seenFirst.push(layout) });
    hold({ position: "pre", host: second, onLayout: (layout) => seenSecond.push(layout) });

    expect(seenFirst.at(-1)).toEqual({ applied: true, breadcrumbsHeight: 20 });
    // Die Brotkrumen liegen unter der ersten Bühne. Hielte die zweite
    // denselben Platz frei, stünde unter ihr ein Streifen Weissraum, hinter
    // dem nichts ist.
    expect(seenSecond.at(-1)).toEqual({ applied: false, breadcrumbsHeight: 0 });
  });

  it("meldet einer nachrangigen Bühne in post keinen Rückfall", () => {
    addChrome(136);
    const wrapper = addWrapper();
    addBreadcrumbs(wrapper, 186);
    const first = addHost(wrapper, 136, 636);
    const second = addHost(wrapper, 636, 1136);

    const seen: { applied: boolean; breadcrumbsHeight: number }[] = [];
    hold({ position: "pre", host: first });
    hold({ position: "post", host: second, onLayout: (layout) => seen.push(layout) });

    // Sie folgt dem Kopfabstand der ersten Bühne, wollte aber ohnehin nur
    // unter den Brotkrumen stehen — ein Rückfall ist das nicht.
    expect(seen.at(-1)).toEqual({ applied: true, breadcrumbsHeight: 0 });
  });

  it("meldet einer Bühne in post keinen Rückfall, wenn die Messung nichts ergibt", () => {
    // Ohne feste Leiste ist nichts zu messen; der Abstand von Staffbase
    // bleibt stehen.
    addWrapper();
    const seen: { applied: boolean; breadcrumbsHeight: number }[] = [];
    hold({ position: "post", onLayout: (layout) => seen.push(layout) });

    // `applied: false` heisst „`pre` angefordert und nicht bekommen". Wer
    // `post` angemeldet hat, bekommt genau das, was er wollte.
    expect(seen.at(-1)).toEqual({ applied: true, breadcrumbsHeight: 0 });
  });

  it("meldet den Rückfall auch auf einer Seite ohne Seitenrahmen", () => {
    // Ohne `#wrapper` greift der Eingriff nirgends — und gerade dort muss
    // eine Bühne in `pre` erfahren, dass sie ihre Lage nicht bekommt.
    // Schwiege die Messung, bliebe es bei der Anfangsannahme, und im Editor
    // käme kein Hinweis.
    addChrome(100);
    const seen: { applied: boolean; breadcrumbsHeight: number }[] = [];
    hold({ position: "pre", onLayout: (layout) => seen.push(layout) });

    expect(seen.at(-1)).toEqual({ applied: false, breadcrumbsHeight: 0 });
  });
});

/** Ein ResizeObserver, der nur meldet, was er auch beobachtet. */
class FakeResizeObserver {
  static instances: FakeResizeObserver[] = [];
  private readonly observed = new Set<Element>();
  constructor(private readonly callback: () => void) {
    FakeResizeObserver.instances.push(this);
  }
  observe(target: Element): void {
    this.observed.add(target);
  }
  unobserve(target: Element): void {
    this.observed.delete(target);
  }
  disconnect(): void {
    this.observed.clear();
  }
  /** Eine Grössenänderung, wie der Browser sie meldete. */
  static resize(target: Element): void {
    for (const instance of FakeResizeObserver.instances) {
      if (instance.observed.has(target)) instance.callback();
    }
  }
}

describe("holdPageTop — Beobachtung der Bühne", () => {
  beforeEach(() => {
    FakeResizeObserver.instances = [];
    (window as unknown as { ResizeObserver: unknown }).ResizeObserver = FakeResizeObserver;
  });

  afterEach(() => {
    delete (window as unknown as { ResizeObserver?: unknown }).ResizeObserver;
  });

  it("beobachtet die nachgerückte Bühne, wenn ihr Vorgänger geht", async () => {
    addChrome(136);
    const wrapper = addWrapper();
    const { box } = addBreadcrumbs(wrapper, 186);
    const first = addHost(wrapper, 136, 636);
    const second = addHost(wrapper, 136, 536);

    const releaseFirst = hold({ position: "pre", host: first });
    hold({ position: "pre", host: second });

    releaseFirst();
    expect(box.style.getPropertyValue("top")).toBe("536px");
    // Erst alles abwarten, was der Umbau selbst noch auslöst — sonst
    // schriebe ein fremder Durchlauf den Wert, den dieser Test prüft.
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Eine spät geladene Schrift oder ein Bild ändert die Höhe der Bühne,
    // ohne die Seite umzubauen. Bliebe der Beobachter an der abgemeldeten
    // Bühne, hingen die Brotkrumen auf der alten Kante fest.
    setRect(second, { top: 136, bottom: 700, height: 564 });
    FakeResizeObserver.resize(second);
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(box.style.getPropertyValue("top")).toBe("700px");

    // Umgekehrt darf die abgemeldete Bühne den Beobachter nicht mehr
    // beschäftigen: sie hängt nicht mehr am Dokument, und was sie meldet,
    // geht die Seite nichts mehr an.
    setRect(first, { top: 136, bottom: 900, height: 764 });
    FakeResizeObserver.resize(first);
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(box.style.getPropertyValue("top")).toBe("700px");
  });
});

describe("usePageTop", () => {
  it("baut den Halter nicht bei jedem Bildaufbau neu auf", () => {
    addChrome(136);
    const wrapper = addWrapper();
    const host = addHost(wrapper, 136, 636);

    let calls = 0;
    const { rerender, unmount } = renderHook(() =>
      usePageTop({ position: "post", host, onLayout: () => (calls += 1) }),
    );
    expect(calls).toBe(1);

    rerender();

    // Der natürliche Aufrufer übergibt eine frisch erzeugte Funktion; hinge
    // der Effekt daran, flackerte die Seite bei jedem Bildaufbau.
    expect(calls).toBe(1);
    expect(wrapper.style.getPropertyValue("padding-top")).toBe("136px");

    unmount();
  });
});
