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
 * Was in der Bühne stehen kann, und wie es in das eine Attribut kommt.
 *
 * Bis hierher waren Konfiguration und Darstellung dasselbe: was im Attribut
 * `slides` stand, wurde gezeigt. Mit den News-Einträgen fällt das auseinander
 * — ein Kanal-Eintrag ist eine Anweisung, keine Folie, und wird erst zur
 * Laufzeit zu mehreren. Dieses Modul beschreibt deshalb die
 * *Konfigurationsform* (`HeroItem`), `slides-model.ts` die *Darstellungsform*
 * (`Slide`), und `resolve-hero-items.ts` führt von der einen zur anderen.
 *
 * Alle drei Sorten liegen weiterhin in derselben Liste im Attribut `slides`.
 * Ein zweites Attribut würde die Reihenfolge zwischen ihnen verlieren, und
 * genau die soll die Redaktion bestimmen können.
 *
 * Frei von DOM und React, damit die Regeln ohne Renderer prüfbar bleiben.
 */

import { Slide, SlideCta, SlideImage, newSlideId } from "./slides-model";

export type HeroItemType = "slide" | "news-post" | "news-channel";

/**
 * Eine handgepflegte Folie.
 *
 * Das `type`-Feld ist optional und wird beim Schreiben **weggelassen**: ein
 * Eintrag ohne `type` ist eine Folie. So liest nicht nur diese Fassung jede
 * bestehende Konfiguration, sondern auch eine ältere Bundle-Fassung, die einem
 * Redakteur noch aus dem Cache serviert wird, die Folien weiterhin.
 */
export interface SlideItem extends Slide {
  type?: "slide";
}

/** Ein einzelner, von Hand ausgewählter News-Beitrag. */
export interface NewsPostItem {
  type: "news-post";
  /** Kennung des Eintrags — nicht die des Beitrags. */
  id: string;
  /**
   * Der Kanal des Beitrags. Steht hier, obwohl der Beitrag ihn selbst kennt:
   * ohne ihn müsste der Editor beim Öffnen erst den Beitrag laden, um die
   * Kanalauswahl vorzubelegen — ein Ladezustand für eine Angabe, die beim
   * Speichern längst bekannt war.
   */
  channelId: string;
  postId: string;
  /** Überschreibt den Titel des Beitrags. */
  headline?: string;
  /** Vorgabe `true`; der Teaser wird dann zur Unterzeile. */
  showTeaser?: boolean;
  /** Vorgabe {@link DEFAULT_CTA_LABEL}; leer heißt: keine Schaltfläche. */
  ctaLabel?: string;
  /**
   * Ein eigenes Bühnenbild. Das Beitragsbild ist fürs Feed-Format geschnitten
   * und trägt eine bildschirmhohe Bühne nicht immer.
   */
  imageOverride?: SlideImage;
  imagePortrait?: SlideImage;
  unknown?: Record<string, unknown>;
}

export type NewsOrder = "newest" | "oldest";

/** Ein ganzer Kanal; führt sich selbst nach. */
export interface NewsChannelItem {
  type: "news-channel";
  id: string;
  channelId: string;
  /** Wie viele Folien der Kanal beisteuert; 1 bis {@link MAX_CHANNEL_COUNT}. */
  count: number;
  order: NewsOrder;
  onlyHighlighted?: boolean;
  /** Vorgabe `true` — ein Beitrag ohne Bild wäre in dieser Bühne eine dunkle Fläche. */
  requireImage?: boolean;
  /** Leer heißt: kein Filter. Mehrere Schlagworte sind ODER-verknüpft. */
  hashtags?: string[];
  showTeaser?: boolean;
  ctaLabel?: string;
  unknown?: Record<string, unknown>;
}

export type HeroItem = SlideItem | NewsPostItem | NewsChannelItem;

/** Die Beschriftung der Schaltfläche, solange niemand eine eigene setzt. */
export const DEFAULT_CTA_LABEL = "Mehr erfahren";

/** Voreingestellte Zahl der Folien eines Kanal-Eintrags. */
export const DEFAULT_CHANNEL_COUNT = 3;

/** Mehr Folien trägt die Bühne nicht — dieselbe Zahl wie die Obergrenze der Liste. */
export const MAX_CHANNEL_COUNT = 8;

/** Die Felder, die eine Folie selbst belegt — alles andere ist `unknown`. */
const KNOWN_SLIDE_KEYS = new Set([
  "type",
  "id",
  "image",
  "imagePortrait",
  "headline",
  "subline",
  "cta",
]);

const KNOWN_POST_KEYS = new Set([
  "type",
  "id",
  "channelId",
  "postId",
  "headline",
  "showTeaser",
  "ctaLabel",
  "imageOverride",
  "imagePortrait",
]);

const KNOWN_CHANNEL_KEYS = new Set([
  "type",
  "id",
  "channelId",
  "count",
  "order",
  "onlyHighlighted",
  "requireImage",
  "hashtags",
  "showTeaser",
  "ctaLabel",
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asTrimmedString = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const asPositiveNumber = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) && value > 0 ? value : undefined;

const collectUnknown = (
  value: Record<string, unknown>,
  known: Set<string>,
): Record<string, unknown> | undefined => {
  const unknown: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (!known.has(key)) unknown[key] = entry;
  }
  return Object.keys(unknown).length > 0 ? unknown : undefined;
};

export const parseImage = (value: unknown): SlideImage | undefined => {
  if (!isRecord(value)) return undefined;
  const url = asTrimmedString(value.url);
  if (url === "") return undefined;
  const image: SlideImage = { url, alt: asTrimmedString(value.alt) };
  const width = asPositiveNumber(value.width);
  const height = asPositiveNumber(value.height);
  if (width !== undefined) image.width = width;
  if (height !== undefined) image.height = height;
  return image;
};

const parseCta = (value: unknown): SlideCta | undefined => {
  if (!isRecord(value)) return undefined;
  const label = asTrimmedString(value.label);
  const href = asTrimmedString(value.href);
  // Eine Schaltfläche ohne Ziel führt nirgendwohin, eine ohne Beschriftung ist
  // unsichtbar. Beides ist kein Fehler, den man melden müsste — es ist ein
  // halb ausgefülltes Formular, und die Folie steht auch ohne sie.
  if (label === "" || href === "") return undefined;
  const cta: SlideCta = { label, href };
  if (value.newTab === true) cta.newTab = true;
  return cta;
};

const parseSlideItem = (value: Record<string, unknown>): SlideItem | null => {
  const image = parseImage(value.image);
  // Ohne Bild gibt es keine Bühne — die Folie wäre eine leere dunkle Fläche.
  if (image === undefined) return null;

  const item: SlideItem = {
    id: asTrimmedString(value.id) || newSlideId(),
    image,
    headline: typeof value.headline === "string" ? value.headline : "",
  };

  const portrait = parseImage(value.imagePortrait);
  if (portrait !== undefined) item.imagePortrait = portrait;

  const subline = typeof value.subline === "string" ? value.subline : "";
  if (subline !== "") item.subline = subline;

  const cta = parseCta(value.cta);
  if (cta !== undefined) item.cta = cta;

  const unknown = collectUnknown(value, KNOWN_SLIDE_KEYS);
  if (unknown !== undefined) item.unknown = unknown;

  return item;
};

const parseNewsPostItem = (value: Record<string, unknown>): NewsPostItem | null => {
  const postId = asTrimmedString(value.postId);
  // Ein Eintrag ohne Beitrag zeigt nichts und lässt sich auch nicht mehr
  // zuordnen — er wäre eine leere Zeile in der Liste des Editors.
  if (postId === "") return null;

  const item: NewsPostItem = {
    type: "news-post",
    id: asTrimmedString(value.id) || newSlideId(),
    channelId: asTrimmedString(value.channelId),
    postId,
  };

  const headline = asTrimmedString(value.headline);
  if (headline !== "") item.headline = headline;
  if (value.showTeaser === false) item.showTeaser = false;
  if (typeof value.ctaLabel === "string") item.ctaLabel = value.ctaLabel.trim();

  const override = parseImage(value.imageOverride);
  if (override !== undefined) item.imageOverride = override;
  const portrait = parseImage(value.imagePortrait);
  if (portrait !== undefined) item.imagePortrait = portrait;

  const unknown = collectUnknown(value, KNOWN_POST_KEYS);
  if (unknown !== undefined) item.unknown = unknown;

  return item;
};

const parseCount = (value: unknown): number => {
  const count = typeof value === "number" ? Math.round(value) : Number.NaN;
  if (!Number.isFinite(count)) return DEFAULT_CHANNEL_COUNT;
  return Math.min(Math.max(count, 1), MAX_CHANNEL_COUNT);
};

const parseHashtags = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value)) return undefined;
  const tags = value
    .map((entry) => asTrimmedString(entry).replace(/^#/, ""))
    .filter((entry) => entry !== "");
  return tags.length > 0 ? tags : undefined;
};

const parseNewsChannelItem = (value: Record<string, unknown>): NewsChannelItem | null => {
  const channelId = asTrimmedString(value.channelId);
  if (channelId === "") return null;

  const item: NewsChannelItem = {
    type: "news-channel",
    id: asTrimmedString(value.id) || newSlideId(),
    channelId,
    count: parseCount(value.count),
    order: value.order === "oldest" ? "oldest" : "newest",
  };

  if (value.onlyHighlighted === true) item.onlyHighlighted = true;
  // `requireImage` ist an, solange es niemand ausdrücklich abschaltet.
  if (value.requireImage === false) item.requireImage = false;
  const hashtags = parseHashtags(value.hashtags);
  if (hashtags !== undefined) item.hashtags = hashtags;
  if (value.showTeaser === false) item.showTeaser = false;
  if (typeof value.ctaLabel === "string") item.ctaLabel = value.ctaLabel.trim();

  const unknown = collectUnknown(value, KNOWN_CHANNEL_KEYS);
  if (unknown !== undefined) item.unknown = unknown;

  return item;
};

/** Welche Sorte ein Eintrag ist; ein fehlendes `type` bedeutet „Folie“. */
export function heroItemType(item: HeroItem): HeroItemType {
  const type = (item as { type?: unknown }).type;
  return type === "news-post" || type === "news-channel" ? type : "slide";
}

export function isSlideItem(item: HeroItem): item is SlideItem {
  return heroItemType(item) === "slide";
}

export function isNewsPostItem(item: HeroItem): item is NewsPostItem {
  return heroItemType(item) === "news-post";
}

export function isNewsChannelItem(item: HeroItem): item is NewsChannelItem {
  return heroItemType(item) === "news-channel";
}

/** Ein leerer Eintrag je Sorte, wie ihn der Editor beim Hinzufügen einsetzt. */
export function emptyNewsPostItem(): NewsPostItem {
  return { type: "news-post", id: newSlideId(), channelId: "", postId: "" };
}

export function emptyNewsChannelItem(): NewsChannelItem {
  return {
    type: "news-channel",
    id: newSlideId(),
    channelId: "",
    count: DEFAULT_CHANNEL_COUNT,
    order: "newest",
  };
}

/**
 * Liest das `slides`-Attribut.
 *
 * Gibt bei allem, was nicht als Liste von Einträgen lesbar ist, eine leere
 * Liste zurück statt zu werfen: das Attribut kommt aus einem Textfeld, in dem
 * jemand mit den besten Absichten etwas anderes stehen lassen kann, und eine
 * kaputte Bühne darf die Seite nicht mitreißen.
 */
export function parseHeroItems(raw: string | null | undefined): HeroItem[] {
  if (raw === null || raw === undefined || raw.trim() === "") return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) return [];

  const items: HeroItem[] = [];
  const usedIds = new Set<string>();
  for (const entry of parsed) {
    if (!isRecord(entry)) continue;

    let item: HeroItem | null;
    if (entry.type === "news-post") item = parseNewsPostItem(entry);
    else if (entry.type === "news-channel") item = parseNewsChannelItem(entry);
    // Unbekannte `type`-Werte werden wie eine Folie gelesen: sie stammen
    // entweder aus einer neueren Fassung — dann fehlt ihnen das Bild und sie
    // fallen ohnehin weg — oder es ist gar keins da, und dann ist es eine.
    else item = parseSlideItem(entry);

    if (item === null) continue;
    // Doppelte Kennungen entstehen beim Duplizieren, wenn eine ältere
    // Editor-Fassung die Kennung mitkopiert hat. Zwei gleiche Keys lassen
    // React Einträge verwechseln, deshalb wird die zweite ersetzt.
    if (usedIds.has(item.id)) item.id = newSlideId();
    usedIds.add(item.id);
    items.push(item);
  }
  return items;
}

const encodeSlideItem = (item: SlideItem): Record<string, unknown> => {
  const image: Record<string, unknown> = { url: item.image.url, alt: item.image.alt };
  if (item.image.width !== undefined) image.width = item.image.width;
  if (item.image.height !== undefined) image.height = item.image.height;

  // Unbekannte Felder zuerst, damit die bekannten sie bei Namensgleichheit
  // überschreiben und nicht umgekehrt.
  const out: Record<string, unknown> = {
    ...(item.unknown ?? {}),
    id: item.id,
    image,
    headline: item.headline,
  };

  if (item.imagePortrait !== undefined) {
    out.imagePortrait = { url: item.imagePortrait.url, alt: item.imagePortrait.alt };
  }
  if (item.subline !== undefined && item.subline !== "") out.subline = item.subline;
  if (item.cta !== undefined) {
    out.cta =
      item.cta.newTab === true
        ? { label: item.cta.label, href: item.cta.href, newTab: true }
        : { label: item.cta.label, href: item.cta.href };
  }
  return out;
};

const encodeImage = (image: SlideImage): Record<string, unknown> => {
  const out: Record<string, unknown> = { url: image.url, alt: image.alt };
  if (image.width !== undefined) out.width = image.width;
  if (image.height !== undefined) out.height = image.height;
  return out;
};

const encodeNewsPostItem = (item: NewsPostItem): Record<string, unknown> => {
  const out: Record<string, unknown> = {
    ...(item.unknown ?? {}),
    type: "news-post",
    id: item.id,
    channelId: item.channelId,
    postId: item.postId,
  };
  if (item.headline !== undefined && item.headline !== "") out.headline = item.headline;
  if (item.showTeaser === false) out.showTeaser = false;
  if (item.ctaLabel !== undefined) out.ctaLabel = item.ctaLabel;
  if (item.imageOverride !== undefined) out.imageOverride = encodeImage(item.imageOverride);
  if (item.imagePortrait !== undefined) out.imagePortrait = encodeImage(item.imagePortrait);
  return out;
};

const encodeNewsChannelItem = (item: NewsChannelItem): Record<string, unknown> => {
  const out: Record<string, unknown> = {
    ...(item.unknown ?? {}),
    type: "news-channel",
    id: item.id,
    channelId: item.channelId,
    count: item.count,
    order: item.order,
  };
  if (item.onlyHighlighted === true) out.onlyHighlighted = true;
  if (item.requireImage === false) out.requireImage = false;
  if (item.hashtags !== undefined && item.hashtags.length > 0) out.hashtags = item.hashtags;
  if (item.showTeaser === false) out.showTeaser = false;
  if (item.ctaLabel !== undefined) out.ctaLabel = item.ctaLabel;
  return out;
};

/**
 * Schreibt das `slides`-Attribut.
 *
 * Leere Felder werden weggelassen, damit das Attribut nicht mit
 * `"subline": ""` aufläuft. Folien bekommen ausdrücklich **kein** `type`:
 * damit bleibt das Attribut Zeichen für Zeichen das, was frühere Fassungen
 * geschrieben haben, solange keine News im Spiel sind.
 */
export function encodeHeroItemsAttribute(items: HeroItem[]): string {
  return JSON.stringify(
    items.map((item) => {
      if (isNewsPostItem(item)) return encodeNewsPostItem(item);
      if (isNewsChannelItem(item)) return encodeNewsChannelItem(item);
      return encodeSlideItem(item);
    }),
  );
}
