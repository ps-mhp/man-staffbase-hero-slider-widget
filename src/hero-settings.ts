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
 * Die Einstellungen der Bühne – Höhe, Breite, Lage, Abstand, Sekunden je
 * Folie, Bedienelemente – im Attribut `slides`.
 *
 * Bis 0.4 standen sie nur als eigene Felder im Dialog von Staffbase. Deren
 * Auswahlfelder sind im Content Designer nicht lesbar, und das Modal, das
 * `slides` bearbeitet, konnte sie weder zeigen noch mit „Abbrechen“
 * zurücknehmen. Jetzt pflegt das Modal sie, und sie reisen mit den
 * Einträgen: als Eintrag `{ "type": "settings", … }` am Ende derselben
 * Liste.
 *
 * - Kein neues Attribut, also keine neue Anmeldung bei Staffbase, und das
 *   Modal schreibt weiter genau ein Feld.
 * - Eine ältere Fassung liest den Eintrag als Folie ohne Bild und lässt ihn
 *   weg (`parseHeroItems`): Ihre Bühne bleibt, es gelten die alten Felder.
 *
 * Jeder Schlüssel ist optional. Fehlt einer, gilt das alte Attribut des
 * Blocks, dann die Vorgabe ({@link resolveHeroOptions}). Geschrieben wird
 * ein Schlüssel erst, wenn ihn jemand im Modal einstellt: Ein unlesbares
 * altes Feld wird so nie mit einer Vorgabe überschrieben, und ohne
 * Einstellung bleibt das Attribut Zeichen für Zeichen, wie es war.
 */

import { encodePayload } from "@shared/payload";

import {
  HeroPosition,
  readAutoplayDelayMs,
  readBottomSpacing,
  readFlag,
  readHeight,
  readPosition,
} from "./attributes";
import type { BottomSpacing } from "./bottom-spacing";
import {
  AUTOPLAY_DELAY_ATTRIBUTE,
  BOTTOM_SPACING_ATTRIBUTE,
  CONTROLS_ATTRIBUTE,
  FULL_BLEED_ATTRIBUTE,
  HEIGHT_ATTRIBUTE,
  MAX_AUTOPLAY_DELAY_SECONDS,
  POSITION_ATTRIBUTE,
} from "./configuration-schema";
import {
  HeroItem,
  SETTINGS_ENTRY_TYPE,
  heroItemsToJson,
  isSettingsEntry,
  parseHeroEntries,
  readHeroEntries,
} from "./hero-items";
import { HERO_HEIGHTS, HeroHeight } from "./hero-slider";

/** Was das Modal einstellt; ein fehlender Schlüssel heißt „wie bisher“. */
export interface HeroSettings {
  height?: HeroHeight;
  fullBleed?: boolean;
  /** Sekunden je Folie; 0 hält die Bühne an. */
  autoplayDelay?: number;
  position?: HeroPosition;
  controls?: boolean;
  bottomSpacing?: BottomSpacing;
}

export type HeroSettingKey = keyof HeroSettings;

/**
 * Welches alte Attribut jede Einstellung ablöst. Die Reihenfolge ist die,
 * in der der Eintrag sie schreibt.
 */
export const LEGACY_ATTRIBUTE_OF: Readonly<Record<HeroSettingKey, string>> = {
  height: HEIGHT_ATTRIBUTE,
  fullBleed: FULL_BLEED_ATTRIBUTE,
  autoplayDelay: AUTOPLAY_DELAY_ATTRIBUTE,
  position: POSITION_ATTRIBUTE,
  controls: CONTROLS_ATTRIBUTE,
  bottomSpacing: BOTTOM_SPACING_ATTRIBUTE,
};

const SETTING_KEYS = Object.keys(LEGACY_ATTRIBUTE_OF) as HeroSettingKey[];

/** Ob Sekunden in den erlaubten Bereich fallen. */
export const isAutoplayDelay = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= MAX_AUTOPLAY_DELAY_SECONDS;

const isHeight = (value: unknown): value is HeroHeight =>
  typeof value === "string" && (HERO_HEIGHTS as readonly string[]).includes(value);

/** Wie jede Einstellung geprüft wird; was nicht passt, fällt weg. */
const ACCEPTS: Readonly<Record<HeroSettingKey, (value: unknown) => boolean>> = {
  height: isHeight,
  fullBleed: (value) => typeof value === "boolean",
  autoplayDelay: isAutoplayDelay,
  position: (value) => value === "post" || value === "pre",
  controls: (value) => typeof value === "boolean",
  bottomSpacing: (value) => value === "default" || value === "none",
};

/**
 * Die Einstellungen aus einem Objekt mit ihren Schlüsseln. Unbrauchbares
 * fällt weg, statt die Bühne zu stören – dann gilt das alte Attribut.
 */
export function parseHeroSettings(entry: Readonly<Record<string, unknown>>): HeroSettings {
  const accepted = SETTING_KEYS.filter((key) => ACCEPTS[key](entry[key])).map((key) => [key, entry[key]]);
  return Object.fromEntries(accepted) as HeroSettings;
}

/** Der Eintrag für die Liste, oder `null`, wenn nichts eingestellt ist. */
function settingsEntry(settings: HeroSettings): Record<string, unknown> | null {
  const set = SETTING_KEYS.filter((key) => settings[key] !== undefined);
  if (set.length === 0) return null;
  return Object.fromEntries([["type", SETTINGS_ENTRY_TYPE], ...set.map((key) => [key, settings[key]])]);
}

/** Alles, was im Attribut `slides` steht. */
export interface HeroContent {
  items: HeroItem[];
  settings: HeroSettings;
}

/**
 * Liest das Attribut `slides` mit Einstellungen. Stehen mehrere
 * Einstellungs-Einträge darin, gilt der letzte.
 */
export function parseHeroContent(raw: string | null | undefined): HeroContent {
  const entries = readHeroEntries(raw);
  const found = entries.filter(isSettingsEntry);
  const last = found[found.length - 1];
  return { items: parseHeroEntries(entries), settings: last === undefined ? {} : parseHeroSettings(last) };
}

/**
 * Schreibt das Attribut `slides`. Ohne Einstellungen genau das, was
 * `encodeHeroItemsAttribute` schreibt.
 */
export function encodeHeroContent({ items, settings }: HeroContent): string {
  const entry = settingsEntry(settings);
  const list = heroItemsToJson(items);
  return encodePayload(JSON.stringify(entry === null ? list : [...list, entry]));
}

/** Was die Bühne zum Zeichnen braucht. */
export interface HeroOptions {
  height: HeroHeight;
  fullBleed: boolean;
  autoplayDelayMs: number;
  position: HeroPosition;
  controls: boolean;
  bottomSpacing: BottomSpacing;
}

/**
 * Was gilt: je Einstellung zuerst das Modal, dann das alte Attribut, dann
 * die Vorgabe (die kennen die `read…`-Funktionen in `attributes.ts`).
 */
export function resolveHeroOptions(settings: HeroSettings, attrs: Readonly<Record<string, unknown>>): HeroOptions {
  return {
    height: settings.height ?? readHeight(attrs[HEIGHT_ATTRIBUTE]),
    fullBleed: settings.fullBleed ?? readFlag(attrs[FULL_BLEED_ATTRIBUTE]),
    autoplayDelayMs:
      settings.autoplayDelay === undefined
        ? readAutoplayDelayMs(attrs[AUTOPLAY_DELAY_ATTRIBUTE])
        : settings.autoplayDelay * 1000,
    position: settings.position ?? readPosition(attrs[POSITION_ATTRIBUTE]),
    controls: settings.controls ?? readFlag(attrs[CONTROLS_ATTRIBUTE]),
    bottomSpacing: settings.bottomSpacing ?? readBottomSpacing(attrs[BOTTOM_SPACING_ATTRIBUTE]),
  };
}
