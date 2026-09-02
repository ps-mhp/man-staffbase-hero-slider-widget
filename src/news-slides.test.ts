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

import { NewsPost } from "./news-client";
import {
  TEASER_MAX,
  pickPostContent,
  pickPostImage,
  postToSlide,
  shortenTeaser,
} from "./news-slides";

const post = (over: Partial<NewsPost> = {}): NewsPost => ({
  id: "6a5e6703cb02c92e74be1eaa",
  contents: {
    de_DE: {
      title: "Volvo kommuniziert 700 km Reichweite",
      teaser: "Eine Einordnung für das Kundengespräch.",
      image: {
        original: { url: "https://cdn.test/original.jpg", width: 8192, height: 5464 },
        original_scaled: { url: "https://cdn.test/scaled.jpg", width: 2000, height: 2000 },
        wide: { url: "https://cdn.test/wide.jpg", width: 700, height: 394 },
        wide_first: { url: "https://cdn.test/wide-first.jpg", width: 1900, height: 1069 },
        thumb: { url: "https://cdn.test/thumb.jpg", width: 240, height: 135 },
      },
    },
  },
  links: { detail_view: { href: "https://tenant.test/openlink/content/news/article/x" } },
  ...over,
});

describe("pickPostContent", () => {
  it("nimmt die genaue Sprache", () => {
    const contents = { de_DE: { title: "Deutsch" }, en_US: { title: "Englisch" } };

    expect(pickPostContent(contents, ["en_US", "de_DE"])?.title).toBe("Englisch");
  });

  it("nimmt den Sprachteil, wenn die genaue Fassung fehlt", () => {
    const contents = { de_AT: { title: "Österreich" } };

    expect(pickPostContent(contents, ["de_DE"])?.title).toBe("Österreich");
  });

  it("nimmt irgendeine Fassung — eine leere Folie wäre schlechter als die falsche Sprache", () => {
    const contents = { fi_FI: { title: "Suomi" } };

    expect(pickPostContent(contents, ["de_DE"])?.title).toBe("Suomi");
  });

  it("liefert null, wenn es keine Fassung gibt", () => {
    expect(pickPostContent(undefined, ["de_DE"])).toBeNull();
    expect(pickPostContent({}, ["de_DE"])).toBeNull();
  });
});

describe("pickPostImage", () => {
  it("nimmt den breiten Erstzuschnitt vor dem Original", () => {
    const content = pickPostContent(post().contents, ["de_DE"]);

    expect(pickPostImage(content)).toEqual({
      url: "https://cdn.test/wide-first.jpg",
      alt: "",
      width: 1900,
      height: 1069,
    });
  });

  it("steigt der Reihe nach ab, wenn Zuschnitte fehlen", () => {
    const content = { image: { wide: { url: "https://cdn.test/wide.jpg" } } };

    expect(pickPostImage(content)?.url).toBe("https://cdn.test/wide.jpg");
  });

  it("ignoriert Zuschnitte, die die Bühne nicht kennt", () => {
    expect(pickPostImage({ image: { thumb: { url: "https://cdn.test/thumb.jpg" } } })).toBeUndefined();
  });

  it("liefert kein Bild, wenn der Beitrag keins hat", () => {
    expect(pickPostImage({ image: null })).toBeUndefined();
    expect(pickPostImage(null)).toBeUndefined();
  });
});

describe("shortenTeaser", () => {
  it("lässt einen kurzen Teaser in Ruhe", () => {
    expect(shortenTeaser("  Kurz und gut.  ")).toBe("Kurz und gut.");
  });

  it("kürzt an der Wortgrenze und setzt ein Auslassungszeichen", () => {
    const teaser = `${"wort ".repeat(80)}ende`;

    const short = shortenTeaser(teaser);

    expect(short.length).toBeLessThanOrEqual(TEASER_MAX + 1);
    expect(short.endsWith("…")).toBe(true);
    expect(short).not.toContain("wor…");
  });

  it("macht aus Zeilenumbrüchen einfache Leerzeichen", () => {
    expect(shortenTeaser("Erste Zeile\n\nZweite Zeile")).toBe("Erste Zeile Zweite Zeile");
  });
});

describe("postToSlide", () => {
  it("macht aus Titel, Teaser und Bild eine Folie", () => {
    const slide = postToSlide(post(), { slideId: "s1" }, ["de_DE"]);

    expect(slide).toEqual({
      id: "s1",
      image: { url: "https://cdn.test/wide-first.jpg", alt: "", width: 1900, height: 1069 },
      headline: "Volvo kommuniziert 700 km Reichweite",
      subline: "Eine Einordnung für das Kundengespräch.",
      cta: {
        label: "Mehr erfahren",
        href: "https://tenant.test/openlink/content/news/article/x",
      },
    });
  });

  it("lässt die eigene Überschrift gewinnen", () => {
    const slide = postToSlide(post(), { slideId: "s1", headline: "Eigen" }, ["de_DE"]);

    expect(slide.headline).toBe("Eigen");
  });

  it("lässt das eigene Bühnenbild gewinnen — das Beitragsbild ist fürs Feed geschnitten", () => {
    const slide = postToSlide(
      post(),
      { slideId: "s1", imageOverride: { url: "https://cdn.test/eigen.jpg", alt: "Eigenes" } },
      ["de_DE"],
    );

    expect(slide.image).toEqual({ url: "https://cdn.test/eigen.jpg", alt: "Eigenes" });
  });

  it("lässt den Teaser weg, wenn er abgeschaltet ist", () => {
    const slide = postToSlide(post(), { slideId: "s1", showTeaser: false }, ["de_DE"]);

    expect(slide.subline).toBeUndefined();
  });

  it("lässt die Schaltfläche weg, wenn die Beschriftung leer ist", () => {
    const slide = postToSlide(post(), { slideId: "s1", ctaLabel: "  " }, ["de_DE"]);

    expect(slide.cta).toBeUndefined();
  });

  it("fällt ohne detail_view auf den Pfad der Artikelansicht zurück", () => {
    const slide = postToSlide(post({ links: undefined }), { slideId: "s1" }, ["de_DE"]);

    expect(slide.cta?.href).toBe("/content/news/article/6a5e6703cb02c92e74be1eaa");
  });

  it("öffnet nie einen neuen Tab — der Beitrag liegt im selben Tenant", () => {
    const slide = postToSlide(post(), { slideId: "s1" }, ["de_DE"]);

    expect(slide.cta?.newTab).toBeUndefined();
  });

  it("liefert eine Folie mit leerer Bild-URL, wenn der Beitrag kein Bild hat", () => {
    const bare = post({ contents: { de_DE: { title: "Ohne Bild" } } });

    expect(postToSlide(bare, { slideId: "s1" }, ["de_DE"]).image).toEqual({ url: "", alt: "" });
  });

  it("übernimmt den Hochkant-Zuschnitt aus der Konfiguration", () => {
    const portrait = { url: "https://cdn.test/hoch.jpg", alt: "Hochkant" };

    const slide = postToSlide(post(), { slideId: "s1", imagePortrait: portrait }, ["de_DE"]);

    expect(slide.imagePortrait).toEqual(portrait);
  });
});
