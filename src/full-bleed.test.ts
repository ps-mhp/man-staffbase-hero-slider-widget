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

import { FALLBACK_HEADER_HEIGHT, measureBleed, openClippingAncestors } from "./full-bleed";

/**
 * jsdom rechnet kein Layout: `getBoundingClientRect` liefert überall Nullen
 * und `scrollHeight`/`clientHeight` sind fest 0. Beides wird deshalb je Test
 * gesetzt — geprüft wird die Entscheidungslogik, nicht der Browser.
 */
function setRect(element: HTMLElement, rect: Partial<DOMRect>): void {
  element.getBoundingClientRect = () =>
    ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, ...rect }) as DOMRect;
}

function setScrollSize(element: HTMLElement, scrollHeight: number, clientHeight: number): void {
  Object.defineProperty(element, "scrollHeight", { value: scrollHeight, configurable: true });
  Object.defineProperty(element, "clientHeight", { value: clientHeight, configurable: true });
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("openClippingAncestors", () => {
  it("öffnet einen clippenden Vorfahren, der selbst nicht scrollt", () => {
    const clipper = document.createElement("div");
    clipper.style.overflowX = "hidden";
    clipper.style.overflowY = "hidden";
    setScrollSize(clipper, 800, 800);
    const child = document.createElement("div");
    clipper.appendChild(child);
    document.body.appendChild(clipper);

    const restore = openClippingAncestors(child);

    expect(restore).not.toBeNull();
    expect(clipper.style.overflowX).toBe("visible");
    // Beide Achsen, sonst dreht der Browser `overflow-x` wieder auf `auto`.
    expect(clipper.style.overflowY).toBe("visible");
  });

  it("bricht ab, wenn ein Vorfahr wirklich scrollt", () => {
    const scroller = document.createElement("div");
    scroller.style.overflowX = "auto";
    setScrollSize(scroller, 2000, 800);
    const child = document.createElement("div");
    scroller.appendChild(child);
    document.body.appendChild(scroller);

    // Eine an beiden Rändern angeschnittene Bühne wäre schlimmer als gar kein
    // Ausbruch — und ein echter Scroll-Container darf nicht entkernt werden.
    expect(openClippingAncestors(child)).toBeNull();
    expect(scroller.style.overflowX).toBe("auto");
  });

  it("nimmt bereits geöffnete Vorfahren zurück, wenn weiter oben einer scrollt", () => {
    const scroller = document.createElement("div");
    scroller.style.overflowX = "hidden";
    setScrollSize(scroller, 2000, 800);
    const clipper = document.createElement("div");
    clipper.style.overflowX = "hidden";
    setScrollSize(clipper, 400, 400);
    const child = document.createElement("div");

    clipper.appendChild(child);
    scroller.appendChild(clipper);
    document.body.appendChild(scroller);

    expect(openClippingAncestors(child)).toBeNull();
    expect(clipper.style.overflowX).toBe("hidden");
  });

  it("stellt beim Zurücknehmen den vorherigen Inline-Wert her", () => {
    const clipper = document.createElement("div");
    clipper.style.overflowX = "hidden";
    setScrollSize(clipper, 300, 300);
    const child = document.createElement("div");
    clipper.appendChild(child);
    document.body.appendChild(clipper);

    const restore = openClippingAncestors(child);
    restore?.();

    // Das Widget wird in fremde Seiten eingebettet und darf beim Verschwinden
    // nichts an ihnen zurücklassen.
    expect(clipper.style.overflowX).toBe("hidden");
  });

  it("lässt nicht clippende Vorfahren unangetastet", () => {
    const plain = document.createElement("div");
    const child = document.createElement("div");
    plain.appendChild(child);
    document.body.appendChild(plain);

    expect(openClippingAncestors(child)).not.toBeNull();
    expect(plain.style.overflowX).toBe("");
  });
});

describe("measureBleed", () => {
  it("zieht das Element um die gemessene linke Kante nach links", () => {
    const anchor = document.createElement("div");
    document.body.appendChild(anchor);
    setRect(anchor, { left: 150, top: 175 });

    // Kein `calc(50% - 50vw)`: die Spalte liegt links auf 150 und rechts auf
    // 160, ist also nicht zentriert.
    expect(measureBleed(anchor).pull).toBe(-150);
  });

  it("nimmt die Fensterbreite ohne Scrollbar", () => {
    const anchor = document.createElement("div");
    document.body.appendChild(anchor);
    setRect(anchor, { left: 0, top: 0 });

    expect(measureBleed(anchor).width).toBe(document.documentElement.clientWidth);
  });

  it("misst die Kopfzeile, statt sie zu raten", () => {
    const anchor = document.createElement("div");
    document.body.appendChild(anchor);
    setRect(anchor, { left: 150, top: 175 });

    // Auf onetruck 175px — nicht die 95px der man.eu-Kopfzeile.
    expect(measureBleed(anchor).headerHeight).toBe(175);
  });

  it("verwirft eine unglaubwürdige Kopfzeilenhöhe", () => {
    const anchor = document.createElement("div");
    document.body.appendChild(anchor);
    setRect(anchor, { left: 150, top: 1400 });

    // Steht die Bühne mitten auf einer langen Seite, misst der Abstand den
    // Inhalt darüber; eine Bühne von wenigen Pixeln Höhe wäre die Folge.
    expect(measureBleed(anchor).headerHeight).toBe(FALLBACK_HEADER_HEIGHT);
  });

  it("verwirft eine negative Kopfzeilenhöhe", () => {
    const anchor = document.createElement("div");
    document.body.appendChild(anchor);
    setRect(anchor, { left: 0, top: -600 });

    expect(measureBleed(anchor).headerHeight).toBe(FALLBACK_HEADER_HEIGHT);
  });
});
