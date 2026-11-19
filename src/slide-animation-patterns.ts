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
 * Die Muster der Hintergrund-Animation. Die Raster-Muster stehen hier: ein
 * Raster aus Quadraten oder Punkten, dessen Höhe `h` (0…1) je Muster und
 * Zeitpunkt anders schwingt. `h` hebt ein Element an, lässt es wachsen und
 * hellt es auf (dunkler Grundton) bzw. dunkelt es ab (heller Grundton).
 * Linien, Ringe und Strömung stehen in slide-animation-curves.ts.
 *
 * Jedes Muster ist in der Periode `T` geschlossen (nur ganzzahlige
 * Frequenzen), die Schleife also nahtlos. Rot bleibt immer voll deckend —
 * mit Transparenz über Anthrazit würde es Weinrot und verließe die CI —
 * und steht deshalb nur dort, wo das Feld voll da ist.
 *
 * Frei von DOM und React.
 */

import { ANIMATION_PERIOD, AnimationPattern, SlideAnimation } from "./slide-animation";
import { CURVE_PATTERNS, drawCurves } from "./slide-animation-curves";
import {
  DotBatch,
  LOOKS,
  Paint,
  REFERENCE_HEIGHT,
  RED_SHARE,
  TOKENS,
  backgroundWithOpacity,
  colorFor,
  maskAt,
  rng,
} from "./slide-animation-paint";

export { LOOKS, colorFor, maskAt };
export type { Paint };

type CellPattern = Exclude<AnimationPattern, (typeof CURVE_PATTERNS)[number]>;

interface Spec {
  shape: "square" | "dot";
  pitch: number;
  size: number;
  /** Wie weit ein ganz gehobenes Element nach oben rückt. */
  lift: number;
  /** Größe bei h = 0 und Zuwachs bis h = 1, als Anteil von `size`. */
  grow: [number, number];
  /** Faktor auf {@link RED_SHARE}: lockere Muster brauchen mehr Rot, damit man es sieht. */
  reds: number;
  seed: number;
  /** Ob an dieser Stelle ein Element steht (für lockere Muster). */
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

const SPECS: Record<CellPattern, Spec> = {
  // Welle mit Hebung: zwei überlagerte Wellen — diagonal einmal je Durchlauf,
  // kreisförmig von rechts unten zweimal.
  wave: {
    shape: "square",
    pitch: 8,
    size: 4.6,
    lift: 15,
    grow: [0.6, 0.6],
    reds: 1,
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
    shape: "square",
    pitch: 12,
    size: 7.5,
    lift: 0,
    grow: [0.92, 0.08],
    reds: 1.4,
    seed: 11,
    height: (cell, phi) => Math.pow(0.5 + 0.5 * Math.sin(phi - (cell.nx * 0.7 + cell.ny * 0.9) * 2 * Math.PI), 3),
  },
  // Module: locker verteilt, nach rechts dichter; jedes pulsiert in eigener Phase.
  pulse: {
    shape: "square",
    pitch: 20,
    size: 16,
    lift: 0,
    grow: [0.9, 0.1],
    reds: 2.5,
    seed: 7,
    occupied: (u, v, roll) => roll < Math.pow(u, 1.15) * (0.55 + 0.45 * v),
    height: (cell, phi) => (0.25 + 0.75 * cell.jitter) * (0.5 + 0.5 * Math.sin(phi + cell.phase)),
  },
  // Punkte: Kreise statt Quadrate; Kräuselung aus der Feldmitte rechts, dazu
  // eine flache diagonale Welle.
  dots: {
    shape: "dot",
    pitch: 10,
    size: 5,
    lift: 12,
    grow: [0.5, 0.7],
    reds: 2,
    seed: 31,
    height: (cell, phi, aspect) => {
      const a = Math.sin(phi - (cell.nx * 1.4 + cell.ny * 0.6) * Math.PI);
      const dist = Math.hypot(cell.nx - aspect * 0.78, cell.ny - 0.5);
      const b = Math.sin(2 * phi - dist * 5 * Math.PI);
      const h = 0.45 * (0.5 + 0.5 * a) + 0.55 * (0.5 + 0.5 * b);
      return h * h * (3 - 2 * h);
    },
  },
};

const isCellPattern = (pattern: AnimationPattern): pattern is CellPattern => pattern in SPECS;

/** Rote Elemente: ein Anteil der Elemente im vollen Feld, mindestens acht. */
export function redCount(strong: number, factor: number): number {
  return Math.min(strong, Math.max(8, Math.round(strong * RED_SHARE * factor)));
}

/** Die Elemente einer Bühnengröße — einmal je Größe berechnet, nicht je Bild. */
export function buildCells(pattern: CellPattern, width: number, height: number, accent: boolean): Cell[] {
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
    const count = redCount(strong.length, spec.reds);
    for (let n = 0; n < count && strong.length > 0; n += 1) {
      const [chosen] = strong.splice(Math.floor(random() * strong.length), 1);
      chosen!.red = true;
    }
  }
  return cells;
}

const layouts = new Map<string, Cell[]>();

function cellsFor(pattern: CellPattern, accent: boolean, width: number, height: number): Cell[] {
  const key = `${pattern}:${accent}:${Math.round(width)}x${Math.round(height)}`;
  let cells = layouts.get(key);
  if (!cells) {
    cells = buildCells(pattern, width, height, accent);
    if (layouts.size > 8) layouts.clear();
    layouts.set(key, cells);
  }
  return cells;
}

function drawCells(paint: Paint, width: number, height: number, animation: SlideAnimation, phi: number): number {
  const pattern = animation.pattern as CellPattern;
  const spec = SPECS[pattern];
  const scale = height / REFERENCE_HEIGHT;
  const aspect = width / height;
  const pitch = spec.pitch * scale;
  const dots = spec.shape === "dot" ? new DotBatch() : null;
  // Quadrate je Farbe gesammelt: tausendfaches Umschalten von `fillStyle`
  // kostete mehr als das Zeichnen selbst.
  const squares = new Map<string, number[]>();
  for (const cell of cellsFor(pattern, animation.accent, width, height)) {
    const h = spec.height(cell, phi, aspect);
    const size = spec.size * scale * (spec.grow[0] + spec.grow[1] * h) * (0.55 + 0.45 * cell.mask);
    const cx = cell.x + pitch / 2;
    const cy = cell.y + pitch / 2 - spec.lift * scale * h * cell.mask;
    const color = cell.red
      ? TOKENS.red
      : colorFor(animation.theme, Math.pow(h, 2.2) * 0.92 + 0.04 + 0.04 * Math.sin(cell.i * 1.3 + cell.j * 0.7), cell.mask);
    if (dots) {
      dots.add(color, cx, cy, (size / 2) * (cell.red ? 1.3 : 1));
    } else {
      let group = squares.get(color);
      if (!group) {
        group = [];
        squares.set(color, group);
      }
      group.push(cx - size / 2, cy - size / 2, size);
    }
  }
  return dots ? dots.flush(paint) : flushSquares(paint, squares);
}

/** Rot zuletzt, damit es über allem liegt. */
function flushSquares(paint: Paint, squares: Map<string, number[]>): number {
  let drawn = 0;
  const order = [...squares.keys()].sort((a, b) => Number(a === TOKENS.red) - Number(b === TOKENS.red));
  for (const color of order) {
    const values = squares.get(color)!;
    paint.fillStyle = color;
    for (let at = 0; at < values.length; at += 3) {
      // Ohne Runden: ganze Pixel ließen langsame Bewegung in Stufen springen.
      paint.fillRect(values[at]!, values[at + 1]!, values[at + 2]!, values[at + 2]!);
      drawn += 1;
    }
  }
  return drawn;
}

/**
 * Zeichnet ein Bild der Animation zur Zeit `t` (Sekunden).
 * Gibt die Zahl der gezeichneten Elemente zurück (für Tests und Messungen).
 */
export function drawAnimation(paint: Paint, width: number, height: number, animation: SlideAnimation, t: number): number {
  const look = LOOKS[animation.theme];
  // Jedes Bild auf leerer Leinwand: bei durchscheinendem Grund bliebe sonst
  // das vorige stehen.
  paint.clearRect(0, 0, width, height);
  if (animation.opacity > 0) {
    paint.fillStyle = animation.opacity >= 1 ? look.background : backgroundWithOpacity(look.background, animation.opacity);
    paint.fillRect(0, 0, width, height);
  }
  if (width <= 0 || height <= 0) return 0;
  // Erst auf die Periode zurückführen: sonst weicht `t + T` im Fließkomma-Rest
  // von `t` ab, und Größen, die gerundet werden (Perlen je Ring), springen.
  const period = ANIMATION_PERIOD[animation.speed];
  const phi = (2 * Math.PI * (((t % period) + period) % period)) / period;
  return isCellPattern(animation.pattern)
    ? drawCells(paint, width, height, animation, phi)
    : drawCurves(paint, width, height, animation, phi);
}

/** Das Standbild bei weniger Bewegung und in Vorschaubildern: ein Moment mit sichtbarem Wellenkamm. */
export const STILL_TIME_RATIO = 0.18;
