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
 * Wie aus einem News-Beitrag eine Folie wird.
 *
 * Rein: kein `fetch`, kein `document`. Die Sprachen der lesenden Person kommen
 * als Parameter herein, damit dieselbe Abbildung im Editor (Vorschau) und in
 * der Leseansicht gilt und beide ohne Netz prüfbar bleiben.
 */

import { DEFAULT_CTA_LABEL } from "./hero-items";
import { NewsImageVariant, NewsPost, NewsPostContent } from "./news-client";
import { Slide, SlideImage } from "./slides-model";

/** Ab hier wird der Teaser zur Bleiwüste über dem Bild. */
export const TEASER_MAX = 240;

/**
 * Die Zuschnitte, aus denen ein Bühnenbild werden kann, in dieser Reihenfolge.
 *
 * `wide_first` ist der 16:9-Zuschnitt in 1900 px Breite und damit die einzige
 * Stufe, die dem „mindestens 1920 px breit“ der handgepflegten Folien nahe
 * kommt. `original` steht bewusst zuletzt: im Tenant gemessen sind das
 * 8192 × 5464 px — als Bühnenbild lädt das länger, als die Bühne sichtbar ist.
 */
const IMAGE_VARIANTS = ["wide_first", "original_scaled", "wide", "original"] as const;

export interface PostSlideOptions {
  /** Kennung der entstehenden Folie; vergibt der Auflöser. */
  slideId: string;
  /** Überschreibt den Titel des Beitrags. */
  headline?: string;
  /** Vorgabe `true`. */
  showTeaser?: boolean;
  /** Vorgabe {@link DEFAULT_CTA_LABEL}; leerer String heißt: keine Schaltfläche. */
  ctaLabel?: string;
  imageOverride?: SlideImage;
  imagePortrait?: SlideImage;
}

const asPositiveNumber = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) && value > 0 ? value : undefined;

/**
 * Die Sprachfassung, die gezeigt wird.
 *
 * Drei Durchgänge: die genaue Sprache, dann der Sprachteil allein (`de` nimmt
 * `de_DE`), dann irgendeine. Der letzte ist Absicht — ein Beitrag, den es nur
 * auf Englisch gibt, sollte für eine deutsche Leserin trotzdem sichtbar sein;
 * eine leere Folie wäre die schlechtere Antwort als die falsche Sprache.
 */
export function pickPostContent(
  contents: Record<string, NewsPostContent> | undefined,
  locales: string[],
): NewsPostContent | null {
  const keys = Object.keys(contents ?? {});
  if (contents === undefined || keys.length === 0) return null;

  for (const locale of locales) {
    const content = contents[locale];
    if (content !== undefined) return content;
  }

  for (const locale of locales) {
    const language = locale.split("_")[0].toLowerCase();
    const match = keys.find((key) => key.split("_")[0].toLowerCase() === language);
    if (match !== undefined) return contents[match];
  }

  return contents[keys[0]];
}

const toImage = (variant: NewsImageVariant | null | undefined): SlideImage | undefined => {
  if (variant === null || variant === undefined) return undefined;
  const url = typeof variant.url === "string" ? variant.url.trim() : "";
  if (url === "") return undefined;

  // Kein Alt-Text: die API liefert für Beitragsbilder keinen, und einer aus dem
  // Titel wäre keine Beschreibung des Bildes, sondern eine Behauptung darüber.
  const image: SlideImage = { url, alt: "" };
  const width = asPositiveNumber(variant.width);
  const height = asPositiveNumber(variant.height);
  if (width !== undefined) image.width = width;
  if (height !== undefined) image.height = height;
  return image;
};

/** Das größte brauchbare Bild des Beitrags, oder keins. */
export function pickPostImage(content: NewsPostContent | null): SlideImage | undefined {
  const variants = content?.image;
  if (variants === null || variants === undefined) return undefined;

  for (const name of IMAGE_VARIANTS) {
    const image = toImage(variants[name]);
    if (image !== undefined) return image;
  }
  return undefined;
}

/**
 * Kürzt den Teaser an der Wortgrenze.
 *
 * Mitten im Wort abzuschneiden sieht nach einem Fehler aus; ein Auslassungs-
 * zeichen sagt, dass da noch mehr steht — und der Knopf darunter führt hin.
 */
export function shortenTeaser(teaser: string, max: number = TEASER_MAX): string {
  const text = teaser.trim().replace(/\s+/g, " ");
  if (text.length <= max) return text;

  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const head = (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s.,;:!?-]+$/, "");
  return `${head}…`;
}

/**
 * Das Ziel der Schaltfläche.
 *
 * `links.detail_view.href` ist der Weg, den die App selbst benutzt (ein
 * `openlink`, das in der App bleibt und im Browser die Webansicht öffnet).
 * Fehlt er, bleibt der bekannte Pfad der Artikelansicht.
 */
const postHref = (post: NewsPost): string =>
  typeof post.links?.detail_view?.href === "string" && post.links.detail_view.href !== ""
    ? post.links.detail_view.href
    : `/content/news/article/${post.id}`;

/** Macht aus einem Beitrag die Folie, die die Bühne zeigt. */
export function postToSlide(
  post: NewsPost,
  options: PostSlideOptions,
  locales: string[],
): Slide {
  const content = pickPostContent(post.contents, locales);

  const image = options.imageOverride ?? pickPostImage(content) ?? { url: "", alt: "" };
  const headline = (options.headline ?? content?.title ?? "").trim();

  const slide: Slide = { id: options.slideId, image, headline };

  if (options.imagePortrait !== undefined) slide.imagePortrait = options.imagePortrait;

  const teaser = content?.teaser ?? "";
  if (options.showTeaser !== false && teaser.trim() !== "") {
    slide.subline = shortenTeaser(teaser);
  }

  const label = (options.ctaLabel ?? DEFAULT_CTA_LABEL).trim();
  // Ein Beitrag liegt im selben Tenant; ein neuer Tab wäre hier nur ein
  // verlorener Zurück-Knopf.
  if (label !== "") slide.cta = { label, href: postHref(post) };

  return slide;
}
