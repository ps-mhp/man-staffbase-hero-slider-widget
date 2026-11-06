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

/**
 * Die Naht zwischen Bühne und Abschnitt: welche Höhenstufe welchen Eingriff
 * auslöst. Die Eingriffe selbst prüfen `section-hug.test.ts` und
 * `full-bleed.test.ts`.
 */

import * as React from "react";
import { render } from "@testing-library/react";

import { HeroSlider, HeroHeight } from "./hero-slider";
import { Slide } from "./slides-model";

const slides: Slide[] = [
  { id: "a", image: { url: "https://example.test/a.jpg", alt: "Bild a" }, headline: "A" },
];

/** Ein Abschnitt des Content Designers mit 24px Innenabstand unten. */
function mountInSection(height: HeroHeight) {
  const section = document.createElement("div");
  section.dataset.c13yComponent = "section-block";
  section.style.paddingBottom = "24px";
  const frame = document.createElement("div");
  frame.style.paddingBottom = "40px";
  const container = document.createElement("div");
  section.appendChild(frame);
  frame.appendChild(container);
  document.body.appendChild(section);
  const view = render(<HeroSlider slides={slides} height={height} fullBleed={false} />, { container });
  return { section, frame, view };
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Bühne und Abschnitt", () => {
  it("lässt den Abschnitt bei fester Stufe mit der Bühne enden", () => {
    const { section, frame, view } = mountInSection("medium");

    expect(section.style.paddingBottom).toBe("0px");
    expect(frame.style.paddingBottom).toBe("0px");

    view.unmount();
    expect(section.style.paddingBottom).toBe("24px");
  });

  it("überlässt den Abschnitt bei „Abschnittshöhe“ dem Füllen", () => {
    const { section } = mountInSection("section");

    // Auch hier fällt der Innenabstand — aber durch `stretchToSection`, nicht
    // doppelt. Geprüft wird nur, dass am Ende kein Abstand steht.
    expect(section.style.paddingBottom).toBe("0px");
  });
});
