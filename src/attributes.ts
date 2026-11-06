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
 * Vom Attribut zum Wert der Leseansicht.
 *
 * Staffbase reicht die Felder des Dialogs je nach Weg als Wert oder als
 * Zeichenkette durch, und Bestandsinhalte tragen neue Attribute gar nicht.
 * Jede Funktion hier beantwortet deshalb dieselbe Frage: was gilt, wenn nichts
 * Brauchbares dasteht? Die Antwort ist immer die Vorgabe — nie ein Fehler,
 * denn eine Bühne, die wegen eines unbekannten Attributwerts verschwindet,
 * wäre für Leser:innen unerklärlich.
 */

import type { BottomSpacing } from "./bottom-spacing";
import { HERO_HEIGHTS, HeroHeight } from "./hero-slider";
import { DEFAULT_AUTOPLAY_DELAY_MS } from "./use-slider";

/** Die Lage der Bühne zu den Brotkrumen der Wirtsseite. */
export type HeroPosition = "post" | "pre";

/**
 * Alles außer den bekannten Stufen bedeutet die Vorgabe — auch ein leeres oder
 * veraltetes Attribut.
 *
 * Die Vorgabe ist „Abschnittshöhe": im neuen Editor schliesst die Bühne damit
 * bündig mit ihrem Abschnitt ab, im klassischen fällt sie mangels Abschnitt
 * auf die Masse der CI-Spec 3.9 zurück.
 */
export function readHeight(raw: unknown): HeroHeight {
  return typeof raw === "string" && (HERO_HEIGHTS as readonly string[]).includes(raw)
    ? (raw as HeroHeight)
    : "section";
}

/**
 * Ein Wahrheitswert des Dialogs, der im Zweifel an ist.
 *
 * Gilt für „Über die volle Breite zeigen" und „Bedienelemente zeigen"
 * gleichermassen: beide sind eingeschaltet, solange sie niemand ausdrücklich
 * abschaltet. Nur ein echtes „aus" zählt, damit ein fehlendes Attribut die
 * Vorgabe nicht kippt — und Staffbase liefert es je nach Weg als Wert oder
 * als Zeichenkette.
 */
export function readFlag(raw: unknown): boolean {
  if (raw === false || raw === "false") return false;
  return true;
}

/** Sekunden aus dem Dialog in Millisekunden; alles Unbrauchbare fällt auf die Vorgabe zurück. */
export function readAutoplayDelayMs(raw: unknown): number {
  const seconds = typeof raw === "number" ? raw : Number.parseFloat(String(raw ?? ""));
  if (!Number.isFinite(seconds) || seconds < 0) return DEFAULT_AUTOPLAY_DELAY_MS;
  return seconds * 1000;
}

/**
 * Die Lage vor den Brotkrumen greift in die Wirtsseite ein und wird deshalb
 * nur auf ausdrückliche Ansage angenommen. Alles andere — fehlendes Attribut,
 * Tippfehler, veralteter Wert — bleibt beim heutigen Verhalten.
 */
export function readPosition(raw: unknown): HeroPosition {
  return raw === "pre" ? "pre" : "post";
}

/**
 * Der Blockabstand unter der Bühne fällt nur auf ausdrückliche Ansage weg.
 * Alles andere behält den Abstand, den die Seite zwischen ihre Blöcke setzt.
 */
export function readBottomSpacing(raw: unknown): BottomSpacing {
  return raw === "none" ? "none" : "default";
}
