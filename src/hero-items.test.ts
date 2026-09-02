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
  HeroItem,
  NewsChannelItem,
  NewsPostItem,
  SlideItem,
  emptyNewsChannelItem,
  emptyNewsPostItem,
  encodeHeroItemsAttribute,
  heroItemType,
  parseHeroItems,
  serializeHeroItems,
} from "./hero-items";
import { emptySlide } from "./slides-model";

const slideWith = (over: Partial<SlideItem> = {}): SlideItem => ({
  id: "a",
  image: { url: "https://example.test/a.jpg", alt: "Ein Lkw" },
  headline: "Überschrift",
  ...over,
});

const postItem = (over: Partial<NewsPostItem> = {}): NewsPostItem => ({
  type: "news-post",
  id: "p1",
  channelId: "c1",
  postId: "6a5e6703cb02c92e74be1eaa",
  ...over,
});

const channelItem = (over: Partial<NewsChannelItem> = {}): NewsChannelItem => ({
  type: "news-channel",
  id: "k1",
  channelId: "c1",
  count: 3,
  order: "newest",
  ...over,
});

describe("parseHeroItems — Folien", () => {
  it.each([
    ["undefined", undefined],
    ["null", null],
    ["leerer String", ""],
    ["nur Leerraum", "   "],
    ["kaputtes JSON", "{nope"],
    ["ein Objekt statt einer Liste", '{"id":"a"}'],
    ["eine Zahl", "42"],
  ])("liefert für %s eine leere Liste statt zu werfen", (_name, raw) => {
    expect(parseHeroItems(raw as string | null | undefined)).toEqual([]);
  });

  it("liest eine Konfiguration ohne type-Feld weiterhin als Folien", () => {
    const items = parseHeroItems(
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

    expect(heroItemType(items[0])).toBe("slide");
    expect(items).toEqual([
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

  it("verwirft Folien ohne Bild — eine Bühne ohne Bild ist eine dunkle Fläche", () => {
    const items = parseHeroItems(
      JSON.stringify([
        { id: "a", headline: "Ohne Bild" },
        { id: "b", image: { url: "   ", alt: "leer" }, headline: "Leere URL" },
        { id: "c", image: { url: "https://example.test/c.jpg", alt: "" }, headline: "Mit Bild" },
      ]),
    );

    expect(items.map((item) => item.id)).toEqual(["c"]);
  });

  it("behält eine Folie ohne Überschrift — ein Bild allein ist ein zulässiger Hero", () => {
    const items = parseHeroItems(
      JSON.stringify([{ id: "a", image: { url: "https://example.test/a.jpg", alt: "Ein Lkw" } }]),
    );

    expect(items).toHaveLength(1);
    expect((items[0] as SlideItem).headline).toBe("");
  });

  it("verwirft eine halb ausgefüllte Schaltfläche, statt sie ins Leere zeigen zu lassen", () => {
    const items = parseHeroItems(
      JSON.stringify([
        { ...slideWith(), cta: { label: "Ohne Ziel", href: "" } },
        { ...slideWith({ id: "b" }), cta: { label: "", href: "https://example.test" } },
      ]),
    ) as SlideItem[];

    expect(items.map((item) => item.cta)).toEqual([undefined, undefined]);
  });

  it("vergibt eine Kennung, wenn keine dasteht", () => {
    const items = parseHeroItems(
      JSON.stringify([{ image: { url: "https://example.test/a.jpg", alt: "" } }]),
    );

    expect(items[0].id).not.toBe("");
  });

  it("ersetzt eine doppelte Kennung — zwei gleiche Keys lassen React Einträge verwechseln", () => {
    const items = parseHeroItems(
      JSON.stringify([slideWith({ id: "gleich" }), postItem({ id: "gleich" })]),
    );

    expect(items).toHaveLength(2);
    expect(items[0].id).toBe("gleich");
    expect(items[1].id).not.toBe("gleich");
  });

  it("ignoriert Einträge, die keine Objekte sind", () => {
    const items = parseHeroItems(JSON.stringify(["text", 7, null, slideWith()]));

    expect(items.map((item) => item.id)).toEqual(["a"]);
  });

  it("schneidet Leerraum an URL und Alt-Text ab", () => {
    const items = parseHeroItems(
      JSON.stringify([{ image: { url: "  https://example.test/a.jpg  ", alt: "  Ein Lkw  " } }]),
    ) as SlideItem[];

    expect(items[0].image).toMatchObject({ url: "https://example.test/a.jpg", alt: "Ein Lkw" });
  });

  it("verwirft unbrauchbare Maße, statt sie in die aspect-ratio zu tragen", () => {
    const items = parseHeroItems(
      JSON.stringify([
        { image: { url: "https://example.test/a.jpg", alt: "", width: 0, height: -3 } },
      ]),
    ) as SlideItem[];

    expect(items[0].image.width).toBeUndefined();
    expect(items[0].image.height).toBeUndefined();
  });
});

describe("parseHeroItems — News-Beiträge", () => {
  it("liest einen vollständigen News-Beitrag", () => {
    const items = parseHeroItems(
      JSON.stringify([
        {
          type: "news-post",
          id: "p1",
          channelId: "c1",
          postId: "6a5e6703cb02c92e74be1eaa",
          headline: "Eigene Überschrift",
          showTeaser: false,
          ctaLabel: "Zum Beitrag",
          imageOverride: { url: "https://example.test/b.jpg", alt: "Bühnenbild" },
          imagePortrait: { url: "https://example.test/b-hoch.jpg", alt: "Hochkant" },
        },
      ]),
    );

    expect(items[0]).toEqual({
      type: "news-post",
      id: "p1",
      channelId: "c1",
      postId: "6a5e6703cb02c92e74be1eaa",
      headline: "Eigene Überschrift",
      showTeaser: false,
      ctaLabel: "Zum Beitrag",
      imageOverride: { url: "https://example.test/b.jpg", alt: "Bühnenbild" },
      imagePortrait: { url: "https://example.test/b-hoch.jpg", alt: "Hochkant" },
    });
  });

  it("verwirft einen Beitrags-Eintrag ohne Beitragskennung", () => {
    const items = parseHeroItems(
      JSON.stringify([{ type: "news-post", id: "p1", channelId: "c1", postId: "  " }]),
    );

    expect(items).toEqual([]);
  });

  it("kommt ohne Kanalkennung aus — sie ist nur eine Bequemlichkeit des Editors", () => {
    const items = parseHeroItems(
      JSON.stringify([{ type: "news-post", id: "p1", postId: "abc" }]),
    );

    expect(items).toHaveLength(1);
    expect((items[0] as NewsPostItem).channelId).toBe("");
  });
});

describe("parseHeroItems — News-Kanäle", () => {
  it("liest einen vollständigen Kanal-Eintrag", () => {
    const items = parseHeroItems(
      JSON.stringify([
        {
          type: "news-channel",
          id: "k1",
          channelId: "c1",
          count: 4,
          order: "oldest",
          onlyHighlighted: true,
          requireImage: false,
          hashtags: ["#trucks", " bus ", ""],
          showTeaser: false,
          ctaLabel: "",
        },
      ]),
    );

    expect(items[0]).toEqual({
      type: "news-channel",
      id: "k1",
      channelId: "c1",
      count: 4,
      order: "oldest",
      onlyHighlighted: true,
      requireImage: false,
      hashtags: ["trucks", "bus"],
      showTeaser: false,
      ctaLabel: "",
    });
  });

  it("klemmt die Anzahl auf 1 bis 8", () => {
    const items = parseHeroItems(
      JSON.stringify([
        { type: "news-channel", id: "a", channelId: "c", count: 0 },
        { type: "news-channel", id: "b", channelId: "c", count: 99 },
        { type: "news-channel", id: "c", channelId: "c", count: "drei" },
      ]),
    ) as NewsChannelItem[];

    expect(items.map((item) => item.count)).toEqual([1, 8, 3]);
  });

  it("fällt bei unbekannter Reihenfolge auf die neuesten zurück", () => {
    const items = parseHeroItems(
      JSON.stringify([{ type: "news-channel", id: "a", channelId: "c", order: "zufall" }]),
    ) as NewsChannelItem[];

    expect(items[0].order).toBe("newest");
  });

  it("verwirft einen Kanal-Eintrag ohne Kanalkennung", () => {
    expect(parseHeroItems(JSON.stringify([{ type: "news-channel", id: "a" }]))).toEqual([]);
  });
});

describe("serializeHeroItems", () => {
  it("überlebt einen Round-Trip aller drei Sorten unverändert", () => {
    const items: HeroItem[] = [
      slideWith({
        imagePortrait: { url: "https://example.test/a-hoch.jpg", alt: "Hochkant" },
        subline: "Unterzeile",
        cta: { label: "Mehr", href: "https://example.test", newTab: true },
      }),
      postItem({ headline: "Eigen", showTeaser: false, ctaLabel: "Zum Beitrag" }),
      channelItem({ order: "oldest", onlyHighlighted: true, hashtags: ["trucks"] }),
    ];

    expect(parseHeroItems(serializeHeroItems(items))).toEqual(items);
  });

  it("schreibt Folien weiterhin ohne type — eine ältere Fassung soll sie noch lesen", () => {
    const encoded = JSON.parse(serializeHeroItems([slideWith()]));

    expect(encoded[0].type).toBeUndefined();
  });

  it("schreibt News-Einträge mit type", () => {
    const encoded = JSON.parse(serializeHeroItems([postItem(), channelItem()]));

    expect(encoded.map((entry: { type?: string }) => entry.type)).toEqual([
      "news-post",
      "news-channel",
    ]);
  });

  it("lässt Vorgabewerte weg, statt das Attribut aufzublähen", () => {
    const encoded = serializeHeroItems([postItem(), channelItem()]);

    expect(encoded).not.toContain("showTeaser");
    expect(encoded).not.toContain("requireImage");
    expect(encoded).not.toContain("onlyHighlighted");
    expect(encoded).not.toContain("hashtags");
  });

  it("lässt leere Felder einer Folie weg", () => {
    const encoded = serializeHeroItems([slideWith()]);

    expect(encoded).not.toContain("subline");
    expect(encoded).not.toContain("cta");
    expect(encoded).not.toContain("imagePortrait");
  });

  it("schreibt newTab nur, wenn es gesetzt ist", () => {
    const encoded = serializeHeroItems([
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
      { type: "news-channel", id: "k", channelId: "c", tickerSpeed: 3 },
    ]);

    const roundTripped = JSON.parse(serializeHeroItems(parseHeroItems(raw)));

    expect(roundTripped[0].videoUrl).toBe("https://example.test/a.mp4");
    expect(roundTripped[1].tickerSpeed).toBe(3);
  });

  it("lässt bekannte Felder gegen gleichnamige unbekannte gewinnen", () => {
    const encoded = JSON.parse(
      serializeHeroItems([slideWith({ unknown: { headline: "veraltet" } })]),
    );

    expect(encoded[0].headline).toBe("Überschrift");
  });

  it("macht aus einer leeren Liste ein leeres Array", () => {
    expect(serializeHeroItems([])).toBe("[]");
  });

  it("verwirft eine leere Folie, solange kein Bild gewählt ist", () => {
    expect(parseHeroItems(serializeHeroItems([emptySlide()]))).toEqual([]);
  });
});

describe("leere Einträge", () => {
  it("sind leer, aber unterscheidbar", () => {
    expect(emptyNewsPostItem().id).not.toBe(emptyNewsPostItem().id);
    expect(emptyNewsChannelItem().count).toBe(3);
    expect(emptyNewsChannelItem().order).toBe("newest");
  });
});

describe("encodeHeroItemsAttribute", () => {
  const items: HeroItem[] = [slideWith({ headline: 'Er sagte "hallo"' }), postItem(), channelItem()];

  it("schreibt einen Payload ohne Zeichen, an denen eine Re-Serialisierung abschneiden kann", () => {
    // Der Grund für diesen Test: Staffbase gibt beim Übersetzen die
    // Attributwerte des Artikels unescaped wieder aus. Rohes JSON endet
    // dadurch am ersten Anführungszeichen, und die Bühne bleibt leer.
    expect(encodeHeroItemsAttribute(items)).toMatch(/^b64:[A-Za-z0-9+/]*={0,2}$/);
  });

  it("überlebt einen Round-Trip", () => {
    expect(parseHeroItems(encodeHeroItemsAttribute(items))).toEqual(items);
  });

  it("liest weiterhin bestehendes rohes JSON", () => {
    expect(parseHeroItems(serializeHeroItems(items))).toEqual(items);
  });

  it("gibt bei einem kaputten Payload nichts zurück, statt ihn als JSON zu lesen", () => {
    expect(parseHeroItems("b64:kein base64!!")).toEqual([]);
  });
});
