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
 * Was alle Muster der Hintergrund-Animation teilen: Farben aus den
 * MAN-Tokens, die Maske, die die Textseite frei hält, die Zeichenfläche und
 * ein Sammler, der Kreise gleicher Farbe in einem Pfad füllt.
 *
 * Frei von DOM und React.
 */

import { AnimationTheme } from "./slide-animation";

/** Die MAN-Tokens, die hier vorkommen (Werte aus _man-tokens.scss). */
export const TOKENS = {
  red: "#e40045",
  slate900: "#121b23",
  slate700: "#1e2832",
  slate: "#303c49",
  muted: "#5b6f85",
  slate200: "#abb6c3",
  grey200: "#e5e5e5",
  white: "#ffffff",
} as const;

interface Look {
  background: string;
  /** Vom ruhenden zum gehobenen Element. */
  stops: readonly string[];
}

export const LOOKS: Record<AnimationTheme, Look> = {
  dark: { background: TOKENS.slate900, stops: [TOKENS.slate700, TOKENS.slate, TOKENS.muted, TOKENS.slate200] },
  light: { background: TOKENS.white, stops: [TOKENS.grey200, TOKENS.slate200, TOKENS.muted, TOKENS.slate] },
};

/** Was die Muster von einer Leinwand brauchen — in Tests ein Zähler. */
export interface Paint {
  fillStyle: string | CanvasGradient | CanvasPattern;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  lineWidth: number;
  lineCap: CanvasLineCap;
  fillRect(x: number, y: number, width: number, height: number): void;
  clearRect(x: number, y: number, width: number, height: number): void;
  beginPath(): void;
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  arc(x: number, y: number, radius: number, start: number, end: number): void;
  fill(): void;
  stroke(): void;
}

/** Bühnenhöhe in Pixeln, auf die sich alle Größen beziehen (600 = Faktor 1). */
export const REFERENCE_HEIGHT = 600;

/** Anteil der Elemente im vollen Feld, die rot werden (bei „Rote Akzente“). */
export const RED_SHARE = 0.011;

export const smooth = (a: number, b: number, x: number): number => {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
};

export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Wie stark ein Element an dieser Stelle zu sehen ist (0 = gar nicht):
 * quer ein Feld über die rechten ~2/3, hochkant oben; zu jedem Rand hin aus.
 */
export function maskAt(xn: number, yn: number, aspect: number): number {
  if (aspect >= 1.3) {
    const edgeY = smooth(0, 0.05, yn) * (1 - smooth(0.95, 1, yn));
    return smooth(0.25, 0.42, xn) * (1 - smooth(0.9, 1, xn)) * edgeY;
  }
  const edgeX = smooth(0, 0.06, xn) * (1 - smooth(0.94, 1, xn));
  return (1 - smooth(0.32, 0.62, yn)) * smooth(0, 0.05, yn) * edgeX;
}

const hexRgb = (hex: string): number[] => [1, 3, 5].map((at) => parseInt(hex.slice(at, at + 2), 16));

/** Farben auf Stufen gerundet und zwischengespeichert — sonst je Element ein neuer String. */
const LEVELS = 48;
const palettes = new Map<AnimationTheme, Map<number, string>>();

/**
 * Farbe der Stufe `level` (0 ruhend … 1 gehoben) mit Deckkraft `mask`.
 * Ausgeblendet wird über die Deckkraft, nicht über eine Mischung mit dem
 * Grund — auf durchscheinendem Grund gäbe das sonst einen Saum.
 */
export function colorFor(theme: AnimationTheme, level: number, mask: number): string {
  let cache = palettes.get(theme);
  if (!cache) {
    cache = new Map();
    palettes.set(theme, cache);
  }
  const k = Math.round(Math.min(1, Math.max(0, level)) * (LEVELS - 1));
  const m = Math.round(Math.min(1, Math.max(0, mask)) * 23);
  const key = k * 24 + m;
  const hit = cache.get(key);
  if (hit) return hit;
  const look = LOOKS[theme];
  const x = (k / (LEVELS - 1)) * (look.stops.length - 1);
  const at = Math.min(look.stops.length - 2, Math.floor(x));
  const from = hexRgb(look.stops[at]);
  const to = hexRgb(look.stops[at + 1]);
  const color = from.map((v, n) => Math.round(v + (to[n] - v) * (x - at)));
  const value = `rgba(${color.join(",")},${Math.round((m / 23) * 1000) / 1000})`;
  cache.set(key, value);
  return value;
}

export const backgroundWithOpacity = (hex: string, opacity: number): string => `rgba(${hexRgb(hex).join(",")},${opacity})`;

/**
 * Sammelt Kreise je Farbe und füllt jede Farbe in einem Pfad — tausende
 * einzelne `fill()` kosteten ein Vielfaches.
 */
export class DotBatch {
  private readonly groups = new Map<string, number[]>();

  add(color: string, x: number, y: number, radius: number): void {
    let group = this.groups.get(color);
    if (!group) {
      group = [];
      this.groups.set(color, group);
    }
    group.push(x, y, radius);
  }

  /** Rot zuletzt, damit es über allem liegt. Gibt die Zahl der Kreise zurück. */
  flush(paint: Paint): number {
    let count = 0;
    const order = [...this.groups.keys()].sort((a, b) => Number(a === TOKENS.red) - Number(b === TOKENS.red));
    for (const color of order) {
      const values = this.groups.get(color)!;
      paint.fillStyle = color;
      paint.beginPath();
      for (let at = 0; at < values.length; at += 3) {
        paint.moveTo(values[at]! + values[at + 2]!, values[at + 1]!);
        paint.arc(values[at]!, values[at + 1]!, values[at + 2]!, 0, Math.PI * 2);
        count += 1;
      }
      paint.fill();
    }
    this.groups.clear();
    return count;
  }
}
