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
 * Zusammengefasste Zonen: eine Zone der benutzerdefinierten Folie kann über
 * mehrere Spalten (waagerecht) oder Zeilen (senkrecht) des 3×3-Rasters
 * reichen — etwa die ganze obere Reihe oder die linke Spalte.
 *
 * Gespeichert wird je zusammengefasster Zone ihre obere linke Zelle, der
 * Anker, mit der Zahl ihrer Spalten und Zeilen. Die überdeckten Zellen sind
 * keine eigenen Zonen mehr; ihre Bausteine stehen im Anker. Mobil steht die
 * Zone in Lesereihenfolge an der Stelle ihres Ankers.
 *
 * Frei von DOM und React.
 */

import { Align, SlideLayout, ZONES, ZONE_LABELS, ZoneAlignments, ZoneId, alignOf, withAlign } from "./slide-layout";

export const SPAN_SIZES = [1, 2, 3] as const;
export type SpanSize = (typeof SPAN_SIZES)[number];
export type SpanAxis = "cols" | "rows";

export interface ZoneSpan {
  cols: SpanSize;
  rows: SpanSize;
}

/** Nur zusammengefasste Zonen, je mit dem, was über eine Zelle hinausgeht. */
export type ZoneSpans = Partial<Record<ZoneId, Partial<ZoneSpan>>>;

const GRID = 3;

interface Rect {
  row: number;
  col: number;
  rows: number;
  cols: number;
}

export function zoneCell(zone: ZoneId): { row: number; col: number } {
  const index = ZONES.indexOf(zone);
  return { row: Math.floor(index / GRID), col: index % GRID };
}

const zoneAt = (row: number, col: number): ZoneId => ZONES[row * GRID + col]!;

export function spanOf(spans: ZoneSpans | undefined, zone: ZoneId): ZoneSpan {
  const entry = spans?.[zone];
  return { cols: entry?.cols ?? 1, rows: entry?.rows ?? 1 };
}

const rectOf = (spans: ZoneSpans | undefined, zone: ZoneId): Rect => ({ ...zoneCell(zone), ...spanOf(spans, zone) });

const fits = (rect: Rect): boolean => rect.row >= 0 && rect.col >= 0 && rect.row + rect.rows <= GRID && rect.col + rect.cols <= GRID;

/** Die Zellen einer Fläche in Lesereihenfolge — der Anker zuerst. */
function cells(rect: Rect): ZoneId[] {
  return ZONES.filter((zone) => {
    const { row, col } = zoneCell(zone);
    return row >= rect.row && row < rect.row + rect.rows && col >= rect.col && col < rect.col + rect.cols;
  });
}

export const cellsOf = (spans: ZoneSpans | undefined, zone: ZoneId): ZoneId[] => cells(rectOf(spans, zone));

const overlaps = (a: Rect, b: Rect): boolean => cells(a).some((zone) => cells(b).includes(zone));
const contains = (outer: Rect, inner: Rect): boolean => cells(inner).every((zone) => cells(outer).includes(zone));

/** Die Zonen, die es gibt: alle Anker und alle Zellen, die keine andere Zone überdeckt. */
export function visibleZones(spans: ZoneSpans | undefined): ZoneId[] {
  const covered = new Set(
    ZONES.filter((zone) => spans?.[zone] !== undefined).flatMap((anchor) => cellsOf(spans, anchor).filter((cell) => cell !== anchor)),
  );
  return ZONES.filter((zone) => !covered.has(zone));
}

/** Die Zone, zu der eine Zelle gehört — ihr Anker oder sie selbst. */
export function ownerOf(spans: ZoneSpans | undefined, zone: ZoneId): ZoneId {
  return visibleZones(spans).find((anchor) => cellsOf(spans, anchor).includes(zone)) ?? zone;
}

const ROW_NAMES = ["oben", "Mitte", "unten"] as const;
const COL_NAMES = ["links", "Mitte", "rechts"] as const;

function part(start: number, length: number, names: readonly string[], whole: string): string {
  if (length === GRID) return whole;
  return length === 1 ? names[start]! : `${names[start]!} bis ${names[start + length - 1]!}`;
}

/** „oben, ganze Breite“, „links, ganze Höhe“ — eine einzelne Zone heißt wie bisher. */
export function zoneName(spans: ZoneSpans | undefined, zone: ZoneId): string {
  const rect = rectOf(spans, zone);
  if (rect.rows === 1 && rect.cols === 1) return ZONE_LABELS[zone];
  if (rect.rows === GRID && rect.cols === GRID) return "ganze Folie";
  const rows = part(rect.row, rect.rows, ROW_NAMES, "ganze Höhe");
  const cols = part(rect.col, rect.cols, COL_NAMES, "ganze Breite");
  return rect.rows === GRID ? `${cols}, ${rows}` : `${rows}, ${cols}`;
}

/** Bausteine überdeckter Zellen stehen im Anker, hinter seinen eigenen. */
export function foldLayout(layout: SlideLayout | undefined, spans: ZoneSpans | undefined): SlideLayout {
  const out: SlideLayout = {};
  for (const anchor of visibleZones(spans)) {
    const blocks = cellsOf(spans, anchor).flatMap((cell) => layout?.[cell] ?? []);
    if (blocks.length > 0) out[anchor] = blocks;
  }
  return out;
}

// --- Lesen ---------------------------------------------------------------------

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const sizeOf = (value: unknown): SpanSize => (value === 2 || value === 3 ? value : 1);

/** Nur, was über eine Zelle hinausgeht. */
function compact(span: ZoneSpan): Partial<ZoneSpan> {
  return { ...(span.cols > 1 ? { cols: span.cols } : {}), ...(span.rows > 1 ? { rows: span.rows } : {}) };
}

/** Was nicht ins Raster passt oder eine frühere Zone überschneidet, fällt weg. */
export function parseZoneSpan(value: unknown): ZoneSpans {
  if (!isRecord(value)) return {};
  const out: ZoneSpans = {};
  for (const zone of ZONES) {
    const entry = value[zone];
    if (!isRecord(entry)) continue;
    const span: ZoneSpan = { cols: sizeOf(entry.cols), rows: sizeOf(entry.rows) };
    if (span.cols === 1 && span.rows === 1) continue;
    const rect: Rect = { ...zoneCell(zone), ...span };
    const taken = ZONES.filter((anchor) => out[anchor] !== undefined).flatMap((anchor) => cellsOf(out, anchor));
    if (!fits(rect) || cells(rect).some((cell) => taken.includes(cell))) continue;
    out[zone] = compact(span);
  }
  return out;
}

// --- Vergrößern und verkleinern ------------------------------------------------

/** Was eine benutzerdefinierte Folie an Zonen trägt. */
export interface ZoneState {
  layout?: SlideLayout;
  zoneAlign?: ZoneAlignments;
  zoneSpan?: ZoneSpans;
}

export interface Resized {
  layout: SlideLayout;
  zoneAlign: ZoneAlignments;
  zoneSpan: ZoneSpans;
  /** Der Anker danach — er kann wandern, wenn die Zone nach links oder oben wächst. */
  zone: ZoneId;
}

/**
 * Wo die Zone auf einer Achse beginnen kann, die liebste Lage zuerst.
 * Wachsen: erst nach rechts/unten, dann nach links/oben. Schrumpfen: die
 * Seite behalten, an der die Bausteine stehen.
 */
function starts(start: number, length: number, target: number, align: Align): number[] {
  if (target === length) return [start];
  if (target < length) {
    const last = start + length - target;
    if (align === "start") return [start];
    return [align === "end" ? last : start + Math.floor((length - target) / 2)];
  }
  const out: number[] = [];
  for (let at = start; at >= start + length - target; at -= 1) {
    if (at >= 0 && at + target <= GRID) out.push(at);
  }
  return out;
}

/**
 * Stellt die Zahl der Spalten oder Zeilen einer Zone ein. Einzelne Zonen,
 * die die neue Fläche trifft, gehen in ihr auf — mit ihren Bausteinen hinter
 * den eigenen; zusammengefasste Zonen nur, wenn die Fläche sie ganz enthält.
 * Schnitte sie eine an, geht es nicht: `undefined`.
 *
 * Die Bausteine behalten ihre Ausrichtung, auch wenn der Anker wandert.
 */
export function resizeZone(state: ZoneState, zone: ZoneId, axis: SpanAxis, size: SpanSize): Resized | undefined {
  const spans = state.zoneSpan ?? {};
  const current = rectOf(spans, zone);
  const align = alignOf(state.zoneAlign, zone);
  const candidates =
    axis === "cols"
      ? starts(current.col, current.cols, size, align.x).map((col): Rect => ({ ...current, col, cols: size }))
      : starts(current.row, current.rows, size, align.y).map((row): Rect => ({ ...current, row, rows: size }));
  const others = visibleZones(spans).filter((other) => other !== zone);
  const rect = candidates.find((candidate) =>
    others.every((other) => {
      const area = rectOf(spans, other);
      return !overlaps(candidate, area) || contains(candidate, area);
    }),
  );
  if (rect === undefined) return undefined;

  const anchor = zoneAt(rect.row, rect.col);
  const merged = [zone, ...others.filter((other) => contains(rect, rectOf(spans, other)))];
  const cleared = new Set(merged.flatMap((owner) => cellsOf(spans, owner)));
  const blocks = merged.flatMap((owner) => cellsOf(spans, owner).flatMap((cell) => state.layout?.[cell] ?? []));

  const layout: SlideLayout = {};
  for (const cell of ZONES) {
    const kept = cleared.has(cell) ? [] : (state.layout?.[cell] ?? []);
    if (kept.length > 0) layout[cell] = kept;
  }
  if (blocks.length > 0) layout[anchor] = blocks;

  const without = <T>(entries: Partial<Record<ZoneId, T>> | undefined): Partial<Record<ZoneId, T>> =>
    Object.fromEntries(Object.entries(entries ?? {}).filter(([key]) => !merged.includes(key as ZoneId))) as Partial<Record<ZoneId, T>>;

  const zoneAlign = withAlign(withAlign(without(state.zoneAlign), anchor, "x", align.x), anchor, "y", align.y);
  const span = compact({ cols: rect.cols as SpanSize, rows: rect.rows as SpanSize });
  const zoneSpan: ZoneSpans = { ...without(spans), ...(Object.keys(span).length > 0 ? { [anchor]: span } : {}) };
  return { layout, zoneAlign, zoneSpan, zone: anchor };
}
