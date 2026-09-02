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
 * Der ganze Weg einmal durch: so, wie die geteilte Registry ihn geht, wenn im
 * Studio eine Übersetzung angelegt wird.
 *
 * Der Test bildet dabei die beiden Eigenheiten des Dienstes nach, an denen die
 * Bühne bisher gescheitert ist: er übersetzt **nur Textknoten**, und er gibt
 * die Attributwerte des Artikels **unescaped** wieder aus.
 */

import { carrierFor } from "@shared/translation/carriers";
import { findWidgetTags } from "@shared/translation/widget-html";

import {
  DEFAULT_CTA_LABEL,
  HeroItem,
  NewsChannelItem,
  SlideItem,
  encodeHeroItemsAttribute,
  parseHeroItems,
} from "./hero-items";
import { heroSliderTranslationProvider as provider } from "./translation-provider";

const items: HeroItem[] = [
  {
    id: "a",
    image: { url: "https://example.test/a.jpg", alt: "Ein Lkw" },
    headline: "Überschrift",
    subline: "Unterzeile",
    cta: { label: "Mehr", href: "https://example.test" },
  },
  { type: "news-channel", id: "k", channelId: "c", count: 3, order: "newest" },
];

const stored = encodeHeroItemsAttribute(items);
const article = (slides: string): string =>
  `<p>Ein Absatz</p><hero-slider-widget slides="${slides}" height="tall"></hero-slider-widget>`;

/** Was der Dienst mit dem Artikel macht: Textknoten ersetzen, Attribute nicht. */
const translateTextNodes = (html: string): string =>
  html.replace(/>([^<>]+)</g, (_, text: string) => `>EN:${text}<`);

const slidesOf = (body: unknown): string | null =>
  findWidgetTags((body as { html: string }).html, provider.ref)[0]?.value ?? null;

describe("Rundweg durch die Inhaltsübersetzung", () => {
  it("liefert die Bühne übersetzt und vollständig zurück", () => {
    const request = { html: article(stored) };
    const carrier = carrierFor(request, provider);

    expect(carrier).not.toBeNull();
    const units = (carrier as NonNullable<typeof carrier>).units;
    expect(units[0]).toContain("Überschrift");

    // Der Dienst antwortet mit dem übersetzten Artikel — und schreibt den
    // Attributwert dabei so zurück, wie er ihn für richtig hält.
    const answer = {
      html: translateTextNodes(article(stored)).replace(stored, `{"id":"a","headline":"kaputt`),
    };
    const translated = units.map((unit) => (unit === null ? null : translateTextNodes(unit)));

    const patched = (carrier as NonNullable<typeof carrier>).patch(answer, translated);
    expect(patched).not.toBeNull();

    const [slide, channel] = parseHeroItems(slidesOf(patched?.body)) as [SlideItem, NewsChannelItem];

    expect(slide.headline).toBe("EN:Überschrift");
    expect(slide.subline).toBe("EN:Unterzeile");
    expect(slide.cta).toEqual({ label: "EN:Mehr", href: "https://example.test" });
    expect(slide.image).toEqual({ url: "https://example.test/a.jpg", alt: "EN:Ein Lkw" });
    expect(channel).toEqual({ ...items[1], ctaLabel: `EN:${DEFAULT_CTA_LABEL}` });
  });

  it("behält die übrigen Attribute des Bausteins", () => {
    const request = { html: article(stored) };
    const carrier = carrierFor(request, provider) as NonNullable<
      ReturnType<typeof carrierFor>
    >;
    const patched = carrier.patch({ html: article(stored) }, carrier.units);

    expect((patched?.body as { html: string }).html).toContain('height="tall"');
  });

  it("fasst einen Artikel ohne Bühne nicht an", () => {
    expect(carrierFor({ html: "<p>Nur Text</p>" }, provider)).toBeNull();
  });
});
