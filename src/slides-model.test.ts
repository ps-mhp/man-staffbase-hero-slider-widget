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
  Slide,
  emptySlide,
  encodeSlidesAttribute,
  newSlideId,
  parseSlides,
} from "./slides-model";

const slideWith = (over: Partial<Slide> = {}): Slide => ({
  id: "a",
  image: { url: "https://example.test/a.jpg", alt: "Ein Lkw" },
  headline: "Überschrift",
  ...over,
});

describe("parseSlides", () => {
  it.each([
    ["undefined", undefined],
    ["null", null],
    ["leerer String", ""],
    ["nur Leerraum", "   "],
    ["kaputtes JSON", "{nope"],
    ["ein Objekt statt einer Liste", '{"id":"a"}'],
    ["eine Zahl", "42"],
  ])("liefert für %s eine leere Liste statt zu werfen", (_name, raw) => {
    expect(parseSlides(raw as string | null | undefined)).toEqual([]);
  });

  it("liest einen vollständigen Slide", () => {
    const slides = parseSlides(
      JSON.stringify([
        {
          id: "a",
          image: { url: "https://example.test/a.jpg", alt: "Ein Lkw", width: 1600, height: 900 },
          imagePortrait: { url: "https://example.test/a-hoch.jpg", alt: "Ein Lkw, hochkant" },
          headline: "Überschrift",
          subline: "Unterzeile",
          cta: { label: "Mehr", href: "https://example.test", newTab: true },
        },
      ]),
    );

    expect(slides).toEqual([
      {
        id: "a",
        image: { url: "https://example.test/a.jpg", alt: "Ein Lkw", width: 1600, height: 900 },
        imagePortrait: { url: "https://example.test/a-hoch.jpg", alt: "Ein Lkw, hochkant" },
        headline: "Überschrift",
        subline: "Unterzeile",
        cta: { label: "Mehr", href: "https://example.test", newTab: true },
      },
    ]);
  });

  it("verwirft Slides ohne Bild — eine Bühne ohne Bild ist eine dunkle Fläche", () => {
    const slides = parseSlides(
      JSON.stringify([
        { id: "a", headline: "Ohne Bild" },
        { id: "b", image: { url: "   ", alt: "leer" }, headline: "Leere URL" },
        { id: "c", image: { url: "https://example.test/c.jpg", alt: "" }, headline: "Mit Bild" },
      ]),
    );

    expect(slides.map((s) => s.id)).toEqual(["c"]);
  });

  it("behält einen Slide ohne Überschrift — ein Bild allein ist ein zulässiger Hero", () => {
    const slides = parseSlides(
      JSON.stringify([{ id: "a", image: { url: "https://example.test/a.jpg", alt: "Ein Lkw" } }]),
    );

    expect(slides).toHaveLength(1);
    expect(slides[0].headline).toBe("");
  });

  it("verwirft eine halb ausgefüllte Schaltfläche, statt sie ins Leere zeigen zu lassen", () => {
    const slides = parseSlides(
      JSON.stringify([
        { ...slideWith(), cta: { label: "Ohne Ziel", href: "" } },
        { ...slideWith({ id: "b" }), cta: { label: "", href: "https://example.test" } },
      ]),
    );

    expect(slides.map((s) => s.cta)).toEqual([undefined, undefined]);
  });

  it("vergibt eine Kennung, wenn keine dasteht", () => {
    const slides = parseSlides(
      JSON.stringify([{ image: { url: "https://example.test/a.jpg", alt: "" } }]),
    );

    expect(slides[0].id).not.toBe("");
  });

  it("ersetzt eine doppelte Kennung — zwei gleiche Keys lassen React Slides verwechseln", () => {
    const slides = parseSlides(
      JSON.stringify([slideWith({ id: "gleich" }), slideWith({ id: "gleich" })]),
    );

    expect(slides).toHaveLength(2);
    expect(slides[0].id).toBe("gleich");
    expect(slides[1].id).not.toBe("gleich");
  });

  it("ignoriert Einträge, die keine Objekte sind", () => {
    const slides = parseSlides(JSON.stringify(["text", 7, null, slideWith()]));

    expect(slides.map((s) => s.id)).toEqual(["a"]);
  });

  it("schneidet Leerraum an URL und Alt-Text ab", () => {
    const slides = parseSlides(
      JSON.stringify([{ image: { url: "  https://example.test/a.jpg  ", alt: "  Ein Lkw  " } }]),
    );

    expect(slides[0].image).toMatchObject({ url: "https://example.test/a.jpg", alt: "Ein Lkw" });
  });

  it("verwirft unbrauchbare Maße, statt sie in die aspect-ratio zu tragen", () => {
    const slides = parseSlides(
      JSON.stringify([
        { image: { url: "https://example.test/a.jpg", alt: "", width: 0, height: -3 } },
      ]),
    );

    expect(slides[0].image.width).toBeUndefined();
    expect(slides[0].image.height).toBeUndefined();
  });
});

describe("encodeSlidesAttribute", () => {
  it("überlebt einen Round-Trip unverändert", () => {
    const slides: Slide[] = [
      {
        id: "a",
        image: { url: "https://example.test/a.jpg", alt: "Ein Lkw", width: 1600, height: 900 },
        imagePortrait: { url: "https://example.test/a-hoch.jpg", alt: "Hochkant" },
        headline: "Überschrift",
        subline: "Unterzeile",
        cta: { label: "Mehr", href: "https://example.test", newTab: true },
      },
    ];

    expect(parseSlides(encodeSlidesAttribute(slides))).toEqual(slides);
  });

  it("lässt leere Felder weg, statt das Attribut mit Leerstrings aufzublähen", () => {
    const encoded = encodeSlidesAttribute([slideWith()]);

    expect(encoded).not.toContain("subline");
    expect(encoded).not.toContain("cta");
    expect(encoded).not.toContain("imagePortrait");
  });

  it("schreibt newTab nur, wenn es gesetzt ist", () => {
    const encoded = encodeSlidesAttribute([
      slideWith({ cta: { label: "Mehr", href: "https://example.test" } }),
    ]);

    expect(encoded).not.toContain("newTab");
  });

  it("bewahrt Felder einer neueren Version über einen Round-Trip", () => {
    const raw = JSON.stringify([
      {
        id: "a",
        image: { url: "https://example.test/a.jpg", alt: "Ein Lkw" },
        headline: "Überschrift",
        videoUrl: "https://example.test/a.mp4",
      },
    ]);

    const roundTripped = JSON.parse(encodeSlidesAttribute(parseSlides(raw)));

    expect(roundTripped[0].videoUrl).toBe("https://example.test/a.mp4");
  });

  it("lässt bekannte Felder gegen gleichnamige unbekannte gewinnen", () => {
    const encoded = JSON.parse(
      encodeSlidesAttribute([slideWith({ unknown: { headline: "veraltet" } })]),
    );

    expect(encoded[0].headline).toBe("Überschrift");
  });

  it("macht aus einer leeren Liste ein leeres Array", () => {
    expect(encodeSlidesAttribute([])).toBe("[]");
  });
});

describe("emptySlide", () => {
  it("ist leer, aber unterscheidbar", () => {
    const first = emptySlide();
    const second = emptySlide();

    expect(first.headline).toBe("");
    expect(first.image.url).toBe("");
    expect(first.id).not.toBe(second.id);
  });

  it("wird von parseSlides verworfen, solange kein Bild gewählt ist", () => {
    expect(parseSlides(encodeSlidesAttribute([emptySlide()]))).toEqual([]);
  });
});

describe("newSlideId", () => {
  it("kommt ohne Web-Crypto aus — in unsicherem Kontext gibt es die API nicht", () => {
    const original = globalThis.crypto;
    // `randomUUID` fehlt auf http-Seiten; die Kennung muss trotzdem entstehen.
    Object.defineProperty(globalThis, "crypto", { value: undefined, configurable: true });
    try {
      expect(newSlideId()).not.toBe("");
      expect(newSlideId()).not.toBe(newSlideId());
    } finally {
      Object.defineProperty(globalThis, "crypto", { value: original, configurable: true });
    }
  });
});
