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

import { SLIDES_ATTRIBUTE } from "./configuration-schema";
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
    cta: { label: "Mehr", href: "https://example.test", newTab: true },
  },
  { type: "news-channel", id: "k", channelId: "c", count: 3, order: "newest" },
];

const stored = encodeHeroItemsAttribute(items);

describe("heroSliderTranslationProvider", () => {
  it("zeigt auf das Attribut, in dem die Einträge wirklich stehen", () => {
    expect(provider.ref).toEqual({ tagName: "hero-slider-widget", attribute: SLIDES_ATTRIBUTE });
  });

  it("macht aus dem gespeicherten Wert Markup, das der Dienst übersetzt", () => {
    const html = provider.toTranslatable(stored) as string;

    expect(html).toContain("Überschrift");
    expect(provider.acceptsTranslated(html)).toBe(true);
  });

  it("überspringt eine Bühne ohne Wert", () => {
    expect(provider.toTranslatable(null)).toBeNull();
    expect(provider.toTranslatable("")).toBeNull();
  });

  it("überspringt eine Bühne, die keinen Text hat", () => {
    expect(provider.toTranslatable(encodeHeroItemsAttribute([]))).toBeNull();
  });

  it("schreibt den übersetzten Text zurück und kodiert das Attribut neu", () => {
    const html = provider.toTranslatable(stored) as string;
    const answer = html.replace("Überschrift", "Headline").replace("Mehr", "More");

    const next = provider.fromTranslated(answer, stored) as string;
    const [slide, channel] = parseHeroItems(next) as [SlideItem, NewsChannelItem];

    expect(next.startsWith("b64:")).toBe(true);
    expect(slide.headline).toBe("Headline");
    expect(slide.cta).toEqual({ label: "More", href: "https://example.test", newTab: true });
    expect(slide.image.alt).toBe("Ein Lkw");
    expect(channel).toEqual({ ...items[1], ctaLabel: DEFAULT_CTA_LABEL });
  });

  it("weist eine Antwort ab, die nicht von dieser Anfrage stammt", () => {
    expect(provider.acceptsTranslated("<p>Ein Artikel</p>")).toBe(false);
  });
});
