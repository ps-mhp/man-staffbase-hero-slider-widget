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
 * Die runden Muster der Hintergrund-Animation — ohne Ecken:
 *  - Linien: fließende Höhenlinien, die eine Welle anhebt; einige rot;
 *  - Ringe: Punktringe, die sich von rechts aus ruhig ausbreiten;
 *  - Strömung: Partikel, die auf kleinen Bahnen kreisen und driften.
 *
 * Dieselben Regeln wie bei den Raster-Mustern (slide-animation-patterns.ts):
 * nahtlos in der Periode, Maske hält die Textseite frei, Rot nur voll
 * deckend und nur im vollen Feld.
 *
 * Frei von DOM und React.
 */

import { SlideAnimation } from "./slide-animation";
import { DotBatch, Paint, REFERENCE_HEIGHT, RED_SHARE, TOKENS, colorFor, maskAt, rng, smooth } from "./slide-animation-paint";

export const CURVE_PATTERNS = ["lines", "rings", "flow"] as const;
type CurvePattern = (typeof CURVE_PATTERNS)[number];

/** Rot zeigt sich erst, wo das Feld voll da ist — darunter wäre es durchscheinend. */
const RED_MASK = 0.7;

// --- Linien ------------------------------------------------------------------

interface Line {
  y: number;
  red: boolean;
  /** Stützstellen nur dort, wo die Linie zu sehen ist. */
  xs: number[];
  masks: number[];
}

function buildLines(width: number, height: number, accent: boolean): Line[] {
  const scale = height / REFERENCE_HEIGHT;
  const spacing = 9 * scale;
  const step = 7 * scale;
  const aspect = width / height;
  const random = rng(41);
  const lines: Line[] = [];
  for (let y = spacing / 2; y < height + 18 * scale; y += spacing) {
    const xs: number[] = [];
    const masks: number[] = [];
    for (let x = 0; x <= width + step; x += step) {
      const mask = maskAt(x / width, y / height, aspect);
      if (mask < 0.02) continue;
      xs.push(x);
      masks.push(mask);
    }
    if (xs.length > 1) lines.push({ y, red: false, xs, masks });
  }
  if (accent) {
    const pool = lines.filter((line) => line.masks.some((mask) => mask > RED_MASK));
    const count = Math.min(pool.length, Math.max(3, Math.round(pool.length * 0.07)));
    for (let n = 0; n < count; n += 1) pool.splice(Math.floor(random() * pool.length), 1)[0]!.red = true;
  }
  return lines;
}

function lineHeight(nx: number, ny: number, phi: number, aspect: number): number {
  const a = Math.sin(phi - (nx * 1.5 + ny * 0.8) * Math.PI);
  const b = Math.sin(2 * phi - Math.hypot(nx - aspect * 0.85, ny - 0.9) * 3.5 * Math.PI);
  const h = 0.55 * (0.5 + 0.5 * a) + 0.45 * (0.5 + 0.5 * b);
  return h * h * (3 - 2 * h);
}

/** Stücke von höchstens CHUNK Stützstellen, je mit eigener Farbe. */
const CHUNK = 5;

function drawLines(paint: Paint, width: number, height: number, animation: SlideAnimation, phi: number, lines: Line[]): number {
  const scale = height / REFERENCE_HEIGHT;
  const aspect = width / height;
  const lift = 32 * scale;
  const groups = new Map<string, { width: number; paths: number[][] }>();
  const add = (color: string, lineWidth: number, path: number[]): void => {
    const key = `${color}|${lineWidth}`;
    let group = groups.get(key);
    if (!group) {
      group = { width: lineWidth, paths: [] };
      groups.set(key, group);
    }
    group.paths.push(path);
  };
  for (const line of lines) {
    const ys = line.xs.map((x, at) => line.y - lift * lineHeight(x / height, line.y / height, phi, aspect) * line.masks[at]!);
    for (let start = 0; start < line.xs.length - 1; start += CHUNK) {
      const end = Math.min(line.xs.length - 1, start + CHUNK);
      const middle = Math.floor((start + end) / 2);
      const mask = line.masks[middle]!;
      const h = lineHeight(line.xs[middle]! / height, line.y / height, phi, aspect);
      const red = line.red && mask > RED_MASK;
      const path: number[] = [];
      for (let at = start; at <= end; at += 1) path.push(line.xs[at]!, ys[at]!);
      add(red ? TOKENS.red : colorFor(animation.theme, 0.15 + 0.85 * h, mask), (red ? 1.8 : 1.2) * scale, path);
    }
  }
  let drawn = 0;
  paint.lineCap = "round";
  const order = [...groups.entries()].sort(([a], [b]) => Number(a.startsWith(TOKENS.red)) - Number(b.startsWith(TOKENS.red)));
  for (const [key, group] of order) {
    paint.strokeStyle = key.split("|")[0]!;
    paint.lineWidth = group.width;
    paint.beginPath();
    for (const path of group.paths) {
      paint.moveTo(path[0]!, path[1]!);
      for (let at = 2; at < path.length; at += 2) paint.lineTo(path[at]!, path[at + 1]!);
      drawn += 1;
    }
    paint.stroke();
  }
  return drawn;
}

// --- Ringe -------------------------------------------------------------------

/** Ringe, die je Durchlauf am Zentrum entstehen — ganzzahlig, also nahtlos. */
const RINGS_PER_LOOP = 3;

function drawRings(paint: Paint, width: number, height: number, animation: SlideAnimation, phi: number): number {
  const scale = height / REFERENCE_HEIGHT;
  const aspect = width / height;
  const landscape = aspect >= 1.3;
  const cx = landscape ? 0.78 * width : 0.5 * width;
  const cy = landscape ? 0.58 * height : 0.22 * height;
  const spacing = 24 * scale;
  const bead = 8 * scale;
  const reach = Math.max(Math.hypot(cx - 0.25 * width, cy), Math.hypot(cx - 0.25 * width, height - cy), Math.hypot(width - cx, cy));
  const count = Math.ceil(reach / spacing) + 1;
  const shift = (phi / (2 * Math.PI)) * RINGS_PER_LOOP;
  const dots = new DotBatch();
  for (let k = 0; k < count; k += 1) {
    const r = ((((k + shift) % count) + count) % count) * spacing;
    const life = smooth(0, 3 * spacing, r) * (1 - smooth(0.55 * reach, reach, r));
    if (life < 0.02) continue;
    const red = animation.accent && k % 6 === 0;
    const beads = Math.max(12, Math.round((2 * Math.PI * r) / bead));
    const turn = k * 0.37;
    for (let n = 0; n < beads; n += 1) {
      const angle = (n / beads) * 2 * Math.PI + turn;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (x < -bead || y < -bead || x > width + bead || y > height + bead) continue;
      const mask = maskAt(x / width, y / height, aspect) * life;
      if (mask < 0.02) continue;
      const radius = (0.9 + 0.9 * life) * scale;
      if (red && mask > RED_MASK) dots.add(TOKENS.red, x, y, radius * 1.15);
      else dots.add(colorFor(animation.theme, 0.25 + 0.7 * life, mask), x, y, radius);
    }
  }
  return dots.flush(paint);
}

// --- Strömung ----------------------------------------------------------------

interface Particle {
  x: number;
  y: number;
  mask: number;
  phase: number;
  orbit: number;
  turns: 1 | 2;
  size: number;
  red: boolean;
}

function buildParticles(width: number, height: number, accent: boolean): Particle[] {
  const scale = height / REFERENCE_HEIGHT;
  const spacing = 11 * scale;
  const aspect = width / height;
  const random = rng(53);
  const particles: Particle[] = [];
  for (let y = spacing / 2; y < height; y += spacing) {
    for (let x = spacing / 2; x < width; x += spacing) {
      const jx = x + (random() - 0.5) * spacing;
      const jy = y + (random() - 0.5) * spacing;
      const mask = maskAt(jx / width, jy / height, aspect);
      const phase = random() * Math.PI * 2;
      const orbit = (6 + 14 * random()) * scale;
      const turns = random() < 0.7 ? 1 : 2;
      const size = (1.2 + 1.6 * random()) * scale;
      const redRoll = random();
      if (mask < 0.03) continue;
      particles.push({ x: jx, y: jy, mask, phase, orbit, turns, size, red: accent && mask > RED_MASK && redRoll < RED_SHARE * 2.5 });
    }
  }
  return particles;
}

function drawFlow(paint: Paint, width: number, height: number, animation: SlideAnimation, phi: number, particles: Particle[]): number {
  const scale = height / REFERENCE_HEIGHT;
  const dots = new DotBatch();
  for (const particle of particles) {
    const angle = particle.turns * phi + particle.phase;
    const nx = particle.x / height;
    const ny = particle.y / height;
    // Kreisen auf der eigenen Bahn, dazu ein gemeinsames Strömungsfeld, das
    // benachbarte Partikel in dieselbe Richtung biegt.
    const x = particle.x + particle.orbit * Math.cos(angle) + 14 * scale * Math.sin(phi + ny * 3);
    const y = particle.y + particle.orbit * 0.6 * Math.sin(angle) + 10 * scale * Math.sin(phi + nx * 2);
    const h = Math.pow(0.5 + 0.5 * Math.sin(phi - nx * Math.PI + particle.phase * 0.2), 1.5);
    const radius = particle.size * (0.75 + 0.5 * h);
    if (particle.red) dots.add(TOKENS.red, x, y, radius * 1.2);
    else dots.add(colorFor(animation.theme, 0.2 + 0.8 * h, particle.mask), x, y, radius);
  }
  return dots.flush(paint);
}

// --- Verteiler ---------------------------------------------------------------

const cache = new Map<string, Line[] | Particle[]>();

function prepared<T extends Line[] | Particle[]>(key: string, build: () => T): T {
  let value = cache.get(key) as T | undefined;
  if (!value) {
    value = build();
    if (cache.size > 8) cache.clear();
    cache.set(key, value);
  }
  return value;
}

export function drawCurves(paint: Paint, width: number, height: number, animation: SlideAnimation, phi: number): number {
  const pattern = animation.pattern as CurvePattern;
  const key = `${pattern}:${animation.accent}:${Math.round(width)}x${Math.round(height)}`;
  if (pattern === "lines") return drawLines(paint, width, height, animation, phi, prepared(key, () => buildLines(width, height, animation.accent)));
  if (pattern === "rings") return drawRings(paint, width, height, animation, phi);
  return drawFlow(paint, width, height, animation, phi, prepared(key, () => buildParticles(width, height, animation.accent)));
}
