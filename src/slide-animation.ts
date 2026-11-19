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
 * Eine Animation als Hintergrund einer Folie — die dritte Sorte Medium neben
 * Bild und Video. Kein Datei-Medium: das Widget zeichnet sie selbst
 * (slide-animation-canvas.tsx), deshalb füllt sie jede Bühnengröße ohne
 * Beschnitt und lädt nichts nach.
 *
 * Frei von DOM und React.
 */

/**
 * Die Muster in MAN-Farben (src/shared/stylings/_man-tokens.scss): erst die
 * eckigen aus Quadraten, dann die runden aus Punkten und Linien.
 */
export const ANIMATION_PATTERNS = ["wave", "grid", "pulse", "dots", "lines", "rings", "flow"] as const;
export type AnimationPattern = (typeof ANIMATION_PATTERNS)[number];

/** Grundton: dunkel mit hellen Wellenkämmen oder weiß mit dunklen. */
export const ANIMATION_THEMES = ["dark", "light"] as const;
export type AnimationTheme = (typeof ANIMATION_THEMES)[number];

export const ANIMATION_SPEEDS = ["calm", "lively"] as const;
export type AnimationSpeed = (typeof ANIMATION_SPEEDS)[number];

export interface SlideAnimation {
  pattern: AnimationPattern;
  theme: AnimationTheme;
  speed: AnimationSpeed;
  /** Wenige rote Quadrate, die mitlaufen. */
  accent: boolean;
  /**
   * Deckkraft des Grundes, 0…1. Unter 1 scheint durch, was hinter der Bühne
   * liegt (Abschnittsfarbe, Seite); die Quadrate bleiben, wie sie sind.
   */
  opacity: number;
}

/** Die Stufen, die der Editor anbietet. */
export const ANIMATION_OPACITIES = [1, 0.75, 0.5, 0.25, 0] as const;

export const DEFAULT_ANIMATION: SlideAnimation = {
  pattern: "wave",
  theme: "dark",
  speed: "calm",
  accent: true,
  opacity: 1,
};

/** Auf 5 % gerundet und auf 0…1 begrenzt; alles andere ist deckend. */
export function parseOpacity(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 1;
  return Math.round(Math.min(1, Math.max(0, value)) * 20) / 20;
}

/** Sekunden je Durchlauf; jedes Muster ist darin periodisch, die Schleife nahtlos. */
export const ANIMATION_PERIOD: Record<AnimationSpeed, number> = { calm: 20, lively: 12 };

export const ANIMATION_LABELS: Record<AnimationPattern, string> = {
  wave: "Welle",
  grid: "Raster",
  pulse: "Module",
  dots: "Punkte",
  lines: "Linien",
  rings: "Ringe",
  flow: "Strömung",
};

export const ANIMATION_DESCRIPTIONS: Record<AnimationPattern, string> = {
  wave: "Feine Quadrate, durch die eine Welle läuft und sie anhebt.",
  grid: "Ruhiges Raster, über das ein Lichtband zieht.",
  pulse: "Locker verteilte Module, die langsam pulsieren.",
  dots: "Feine Punkte, die eine Kräuselung anhebt.",
  lines: "Fließende Höhenlinien, einzelne in Rot.",
  rings: "Punktringe, die sich ruhig von rechts ausbreiten.",
  flow: "Partikel, die auf kleinen Bahnen kreisen und driften.",
};

const pick = <T extends string>(list: readonly T[], value: unknown, fallback: T): T =>
  typeof value === "string" && (list as readonly string[]).includes(value) ? (value as T) : fallback;

/** Liest eine gespeicherte Animation; Unbekanntes fällt auf die Vorgabe zurück. */
export function parseAnimation(value: unknown): SlideAnimation {
  const record = value !== null && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    pattern: pick(ANIMATION_PATTERNS, record.pattern, DEFAULT_ANIMATION.pattern),
    theme: pick(ANIMATION_THEMES, record.theme, DEFAULT_ANIMATION.theme),
    speed: pick(ANIMATION_SPEEDS, record.speed, DEFAULT_ANIMATION.speed),
    accent: record.accent !== false,
    opacity: parseOpacity(record.opacity),
  };
}

/** Nur, was von der Vorgabe abweicht — das Attribut bleibt kurz. */
export function encodeAnimation(animation: SlideAnimation): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of ["pattern", "theme", "speed", "accent", "opacity"] as const) {
    if (animation[key] !== DEFAULT_ANIMATION[key]) out[key] = animation[key];
  }
  return out;
}
