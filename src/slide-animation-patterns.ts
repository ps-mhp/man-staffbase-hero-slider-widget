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
 * Die Muster der Hintergrund-Animation: ein Raster aus Quadraten, dessen
 * Höhe `h` (0…1) je Muster und Zeitpunkt anders schwingt. `h` hebt ein
 * Quadrat an, lässt es wachsen und hellt es auf (dunkler Grundton) bzw.
 * dunkelt es ab (heller Grundton).
 *
 * Eine Maske hält die Textseite frei und blendet zu jedem Rand hin aus — so
 * gibt es keine harte Kante, egal wie breit oder hoch die Bühne gerade ist:
 *  - quer: Feld über die rechten ~2/3, links ruhig für Überschrift und Text;
 *  - hochkant (Telefon): Feld oben, unten ruhig, wo dort der Text steht.
 *
 * Jedes Muster ist in der Periode `T` geschlossen (nur ganzzahlige
 * Frequenzen), die Schleife also nahtlos. Rot bleibt immer voll deckend —
 * mit Transparenz über Anthrazit würde es Weinrot und verließe die CI.
 *
 * Ausgeblendet wird über die Deckkraft der Quadrate, nicht über eine
 * Mischung mit der Grundfarbe: auf deckendem Grund sieht beides gleich aus,
 * auf durchscheinendem (`opacity` < 1) zeigen die Ränder sonst den Grund als
 * Saum.
 *
 * Frei von DOM und React; gezeichnet wird auf alles mit `fillStyle` und
 * `fillRect` (in Tests ein Zähler).
 */

import { ANIMATION_PERIOD, AnimationPattern, AnimationTheme, SlideAnimation } from "./slide-animation";

/** Die MAN-Tokens, die hier vorkommen (Werte aus _man-tokens.scss). */
const TOKENS = {
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
  /** Vom ruhenden zum gehobenen Quadrat. */
  stops: readonly string[];
}

export const LOOKS: Record<AnimationTheme, Look> = {
  dark: { background: TOKENS.slate900, stops: [TOKENS.slate700, TOKENS.slate, TOKENS.muted, TOKENS.slate200] },
  light: { background: TOKENS.white, stops: [TOKENS.grey200, TOKENS.slate200, TOKENS.muted, TOKENS.slate] },
};

export interface Paint {
  fillStyle: string | CanvasGradient | CanvasPattern;
  fillRect(x: number, y: number, width: number, height: number): void;
  clearRect(x: number, y: number, width: number, height: number): void;
}

/** Bühnenmaße in Pixeln, auf die sich alle Größen beziehen (Höhe 600 = Faktor 1). */
const REFERENCE_HEIGHT = 600;

interface Spec {
  pitch: number;
  size: number;
  /** Wie weit ein ganz gehobenes Quadrat nach oben rückt. */
  lift: number;
  /** Größe bei h = 0 und Zuwachs bis h = 1, als Anteil von `size`. */
  grow: [number, number];
  reds: number;
  seed: number;
  /** Ob an dieser Stelle ein Quadrat steht (für lockere Muster). */
  occupied?: (u: number, v: number, roll: number) => boolean;
  height: (cell: Cell, phi: number, aspect: number) => number;
}

export interface Cell {
  x: number;
  y: number;
  /** Lage relativ zur Bühnenhöhe — Muster sehen breit und schmal gleich aus. */
  nx: number;
  ny: number;
  i: number;
  j: number;
  mask: number;
  phase: number;
  jitter: number;
  red: boolean;
}

const smooth = (a: number, b: number, x: number): number => {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
};

function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Wie stark ein Quadrat an dieser Stelle zu sehen ist (0 = gar nicht). */
export function maskAt(xn: number, yn: number, aspect: number): number {
  if (aspect >= 1.3) {
    const edgeY = smooth(0, 0.05, yn) * (1 - smooth(0.95, 1, yn));
    return smooth(0.25, 0.42, xn) * (1 - smooth(0.9, 1, xn)) * edgeY;
  }
  const edgeX = smooth(0, 0.06, xn) * (1 - smooth(0.94, 1, xn));
  return (1 - smooth(0.32, 0.62, yn)) * smooth(0, 0.05, yn) * edgeX;
}

const SPECS: Record<AnimationPattern, Spec> = {
  // Welle mit Hebung: zwei überlagerte Wellen — diagonal einmal je Durchlauf,
  // kreisförmig von rechts unten zweimal.
  wave: {
    pitch: 8,
    size: 4.6,
    lift: 15,
    grow: [0.6, 0.6],
    reds: 12,
    seed: 23,
    height: (cell, phi, aspect) => {
      const a = Math.sin(phi - (cell.nx * 2.4 + cell.ny * 1.1) * Math.PI);
      const dist = Math.hypot(cell.nx - aspect, cell.ny - 1.1);
      const b = Math.sin(2 * phi - dist * 4.5 * Math.PI);
      const h = 0.65 * (0.5 + 0.5 * a) + 0.35 * (0.5 + 0.5 * b);
      return h * h * (3 - 2 * h);
    },
  },
  // Raster: ruhend, ein schmales Lichtband zieht diagonal hindurch.
  grid: {
    pitch: 12,
    size: 7.5,
    lift: 0,
    grow: [0.92, 0.08],
    reds: 6,
    seed: 11,
    height: (cell, phi) => Math.pow(0.5 + 0.5 * Math.sin(phi - (cell.nx * 0.7 + cell.ny * 0.9) * 2 * Math.PI), 3),
  },
  // Module: locker verteilt, nach rechts dichter; jedes pulsiert in eigener Phase.
  pulse: {
    pitch: 20,
    size: 16,
    lift: 0,
    grow: [0.9, 0.1],
    reds: 6,
    seed: 7,
    occupied: (u, v, roll) => roll < Math.pow(u, 1.15) * (0.55 + 0.45 * v),
    height: (cell, phi) => (0.25 + 0.75 * cell.jitter) * (0.5 + 0.5 * Math.sin(phi + cell.phase)),
  },
};

/** Die Quadrate einer Bühnengröße — einmal je Größe berechnet, nicht je Bild. */
export function buildCells(pattern: AnimationPattern, width: number, height: number, accent: boolean): Cell[] {
  const spec = SPECS[pattern];
  const scale = height / REFERENCE_HEIGHT;
  const pitch = spec.pitch * scale;
  const aspect = width / height;
  const random = rng(spec.seed);
  const cells: Cell[] = [];
  const cols = Math.ceil(width / pitch) + 1;
  const rows = Math.ceil((height + spec.lift * scale) / pitch) + 1;
  for (let j = 0; j < rows; j += 1) {
    for (let i = 0; i < cols; i += 1) {
      const x = i * pitch;
      const y = j * pitch + spec.lift * scale * 0.5;
      const roll = random();
      const phase = random() * Math.PI * 2;
      const jitter = random();
      const mask = maskAt((x + pitch / 2) / width, (y + pitch / 2) / height, aspect);
      if (mask < 0.02) continue;
      if (spec.occupied && !spec.occupied(mask, y / height, roll)) continue;
      cells.push({ x, y, nx: x / height, ny: y / height, i, j, mask, phase, jitter, red: false });
    }
  }
  if (accent) {
    const strong = cells.filter((cell) => cell.mask > 0.7);
    for (let n = 0; n < spec.reds && strong.length > 0; n += 1) {
      const [chosen] = strong.splice(Math.floor(random() * strong.length), 1);
      chosen.red = true;
    }
  }
  return cells;
}

const hexRgb = (hex: string): number[] => [1, 3, 5].map((at) => parseInt(hex.slice(at, at + 2), 16));

/** Farben auf Stufen gerundet und zwischengespeichert — sonst je Quadrat ein neuer String. */
const LEVELS = 48;
const palettes = new Map<AnimationTheme, Map<number, string>>();

/** Farbe der Stufe `level` (0 ruhend … 1 gehoben), Deckkraft `mask`. */
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

const backgroundWithOpacity = (hex: string, opacity: number): string => `rgba(${hexRgb(hex).join(",")},${opacity})`;

const layouts = new Map<string, Cell[]>();

function cellsFor(animation: SlideAnimation, width: number, height: number): Cell[] {
  const key = `${animation.pattern}:${animation.accent}:${Math.round(width)}x${Math.round(height)}`;
  let cells = layouts.get(key);
  if (!cells) {
    cells = buildCells(animation.pattern, width, height, animation.accent);
    if (layouts.size > 8) layouts.clear();
    layouts.set(key, cells);
  }
  return cells;
}

/**
 * Zeichnet ein Bild der Animation zur Zeit `t` (Sekunden).
 * Gibt die Zahl der gezeichneten Quadrate zurück (für Tests und Messungen).
 */
export function drawAnimation(paint: Paint, width: number, height: number, animation: SlideAnimation, t: number): number {
  const spec = SPECS[animation.pattern];
  const look = LOOKS[animation.theme];
  // Jedes Bild auf leerer Leinwand: bei durchscheinendem Grund bliebe sonst
  // das vorige stehen.
  paint.clearRect(0, 0, width, height);
  if (animation.opacity > 0) {
    paint.fillStyle = animation.opacity >= 1 ? look.background : backgroundWithOpacity(look.background, animation.opacity);
    paint.fillRect(0, 0, width, height);
  }
  if (width <= 0 || height <= 0) return 0;

  const scale = height / REFERENCE_HEIGHT;
  const aspect = width / height;
  const pitch = spec.pitch * scale;
  const phi = (2 * Math.PI * t) / ANIMATION_PERIOD[animation.speed];
  let drawn = 0;
  for (const cell of cellsFor(animation, width, height)) {
    const h = spec.height(cell, phi, aspect);
    const size = spec.size * scale * (spec.grow[0] + spec.grow[1] * h) * (0.55 + 0.45 * cell.mask);
    const cx = cell.x + pitch / 2;
    const cy = cell.y + pitch / 2 - spec.lift * scale * h * cell.mask;
    paint.fillStyle = cell.red
      ? TOKENS.red
      : colorFor(animation.theme, Math.pow(h, 2.2) * 0.92 + 0.04 + 0.04 * Math.sin(cell.i * 1.3 + cell.j * 0.7), cell.mask);
    // Ohne Runden: ganze Pixel ließen langsame Bewegung in Stufen springen.
    paint.fillRect(cx - size / 2, cy - size / 2, size, size);
    drawn += 1;
  }
  return drawn;
}

/** Das Standbild bei weniger Bewegung und in Vorschaubildern: ein Moment mit sichtbarem Wellenkamm. */
export const STILL_TIME_RATIO = 0.18;
