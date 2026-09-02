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
  DEFAULT_CTA_LABEL,
  HeroItem,
  NewsChannelItem,
  NewsPostItem,
  SlideItem,
} from "./hero-items";
import {
  FIELD_ATTRIBUTE,
  applyTranslatedFields,
  heroItemsToTranslatableHtml,
  isTranslatedHeroHtml,
  readTranslatedFields,
} from "./translation-payload";

const slide = (over: Partial<SlideItem> = {}): SlideItem => ({
  id: "a",
  image: { url: "https://example.test/a.jpg", alt: "Ein Lkw" },
  headline: "Überschrift",
  ...over,
});

const post = (over: Partial<NewsPostItem> = {}): NewsPostItem => ({
  type: "news-post",
  id: "p",
  channelId: "c",
  postId: "b",
  ...over,
});

const channel = (over: Partial<NewsChannelItem> = {}): NewsChannelItem => ({
  type: "news-channel",
  id: "k",
  channelId: "c",
  count: 3,
  order: "newest",
  ...over,
});

/** Was der Dienst tut: Textknoten ersetzen, Attribute stehen lassen. */
const translateAll = (html: string, translate: (text: string) => string): string =>
  html.replace(/>([^<>]+)</g, (_, text: string) => `>${translate(text)}<`);

describe("heroItemsToTranslatableHtml", () => {
  it("gibt jedes Textfeld einer Folie mit seinem Schlüssel aus", () => {
    const html = heroItemsToTranslatableHtml([
      slide({
        subline: "Unterzeile",
        cta: { label: "Mehr", href: "https://example.test" },
        imagePortrait: { url: "https://example.test/h.jpg", alt: "Hochkant" },
      }),
    ]);

    expect(html).not.toBeNull();
    expect(readTranslatedFields(html as string)).toEqual(
      new Map([
        ["0.headline", "Überschrift"],
        ["0.subline", "Unterzeile"],
        ["0.cta", "Mehr"],
        ["0.alt", "Ein Lkw"],
        ["0.alt-portrait", "Hochkant"],
      ]),
    );
  });

  it("schickt den überschriebenen Titel und die Schaltfläche eines News-Beitrags mit", () => {
    const html = heroItemsToTranslatableHtml([post({ headline: "Eigen", ctaLabel: "Zum Beitrag" })]);

    expect(readTranslatedFields(html as string)).toEqual(
      new Map([
        ["0.headline", "Eigen"],
        ["0.cta", "Zum Beitrag"],
      ]),
    );
  });

  it("schickt die Vorgabe-Beschriftung mit, damit sie nicht deutsch stehen bleibt", () => {
    // Ohne dies stünde unter jeder News-Folie eines englischen Artikels
    // weiterhin "Mehr erfahren" — die Vorgabe steckt im Bundle, nicht im
    // Attribut, und käme deshalb nie an der Übersetzung vorbei.
    const html = heroItemsToTranslatableHtml([channel()]);

    expect(readTranslatedFields(html as string)).toEqual(new Map([["0.cta", DEFAULT_CTA_LABEL]]));
  });

  it("lässt eine ausdrücklich leere Beschriftung in Ruhe — sie heißt: keine Schaltfläche", () => {
    expect(heroItemsToTranslatableHtml([channel({ ctaLabel: "" })])).toBeNull();
  });

  it("gibt null zurück, wenn es nichts zu übersetzen gibt", () => {
    expect(heroItemsToTranslatableHtml([])).toBeNull();
  });

  it("maskiert Sonderzeichen, statt Markup entstehen zu lassen", () => {
    const html = heroItemsToTranslatableHtml([slide({ headline: '<b>"Ampel" & Co</b>' })]);

    expect(html).toContain("&lt;b&gt;");
    expect(readTranslatedFields(html as string).get("0.headline")).toBe('<b>"Ampel" & Co</b>');
  });

  it("hält die Einträge auseinander", () => {
    const html = heroItemsToTranslatableHtml([slide(), slide({ id: "b", headline: "Zweite" })]);

    expect(readTranslatedFields(html as string).get("1.headline")).toBe("Zweite");
  });
});

describe("isTranslatedHeroHtml", () => {
  it("erkennt die eigene Antwort", () => {
    expect(isTranslatedHeroHtml(heroItemsToTranslatableHtml([slide()]) as string)).toBe(true);
  });

  it("weist fremdes Markup ab", () => {
    expect(isTranslatedHeroHtml("<p>Irgendein Artikel</p>")).toBe(false);
  });
});

describe("applyTranslatedFields", () => {
  const items: HeroItem[] = [
    slide({ subline: "Unterzeile", cta: { label: "Mehr", href: "https://example.test" } }),
    post({ headline: "Eigen" }),
    channel(),
  ];

  const translated = (): HeroItem[] => {
    const html = heroItemsToTranslatableHtml(items) as string;
    const answer = translateAll(html, (text) => `EN:${text}`);
    return applyTranslatedFields(items, readTranslatedFields(answer));
  };

  it("übernimmt Überschrift, Unterzeile, Schaltfläche und Bildbeschreibung einer Folie", () => {
    const [first] = translated() as [SlideItem, NewsPostItem, NewsChannelItem];

    expect(first.headline).toBe("EN:Überschrift");
    expect(first.subline).toBe("EN:Unterzeile");
    expect(first.cta?.label).toBe("EN:Mehr");
    expect(first.image.alt).toBe("EN:Ein Lkw");
  });

  it("lässt alles außer dem Text unangetastet", () => {
    const [first] = translated() as [SlideItem, NewsPostItem, NewsChannelItem];

    expect(first.id).toBe("a");
    expect(first.image.url).toBe("https://example.test/a.jpg");
    expect(first.cta?.href).toBe("https://example.test");
  });

  it("übernimmt Titel und Beschriftung der News-Einträge", () => {
    const [, second, third] = translated() as [SlideItem, NewsPostItem, NewsChannelItem];

    expect(second.headline).toBe("EN:Eigen");
    expect(third.ctaLabel).toBe(`EN:${DEFAULT_CTA_LABEL}`);
    expect(third.channelId).toBe("c");
  });

  it("behält die Quellsprache, wenn der Dienst ein Feld leer zurückgibt", () => {
    const html = heroItemsToTranslatableHtml(items) as string;
    const answer = translateAll(html, () => " ");
    const [first] = applyTranslatedFields(items, readTranslatedFields(answer)) as [SlideItem];

    expect(first.headline).toBe("Überschrift");
  });

  it("behält die Quellsprache für Felder, die die Antwort gar nicht enthält", () => {
    const applied = applyTranslatedFields(items, new Map([["0.headline", "EN"]])) as [
      SlideItem,
      NewsPostItem,
      NewsChannelItem,
    ];

    expect(applied[0].subline).toBe("Unterzeile");
    expect(applied[1].headline).toBe("Eigen");
  });

  it("gibt die Einträge unverändert zurück, wenn nichts ankam", () => {
    expect(applyTranslatedFields(items, new Map())).toBe(items);
  });

  it("ordnet nichts falsch zu, wenn die Antwort die Reihenfolge ändert", () => {
    // Der Schlüssel im Attribut ist die einzige Zuordnung; die Stellung im
    // Dokument darf keine Rolle spielen.
    const html = heroItemsToTranslatableHtml(items) as string;
    const fields = readTranslatedFields(
      html.replace(new RegExp(`${FIELD_ATTRIBUTE}="0.headline"`), `${FIELD_ATTRIBUTE}="2.cta"`),
    );

    expect(fields.get("2.cta")).toBe("Überschrift");
  });
});
