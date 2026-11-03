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

import { MAX_PLAUSIBLE_TOP, holdPageTop, measurePageTop } from "./page-top";

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
function addBreadcrumbs(wrapper: HTMLElement, bottom: number, positioned = true): HTMLElement {
  const box = document.createElement("div");
  if (positioned) box.style.position = "absolute";
  const crumbs = document.createElement("nav");
  crumbs.id = "breadcrumbs";
  setRect(crumbs, { top: bottom - 20, bottom, height: 20 });
  box.appendChild(crumbs);
  wrapper.appendChild(box);
  return crumbs;
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
    const crumbs = addBreadcrumbs(wrapper, 186);
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
