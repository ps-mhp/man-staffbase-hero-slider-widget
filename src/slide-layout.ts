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
 * Die benutzerdefinierte Folie: statt Überschrift, Unterzeile und Buttons an
 * fester Stelle legt die Redaktion Bausteine in neun Zonen — ein 3×3-Raster
 * auf der Fluchtlinie der Bühne (oben/Mitte/unten × links/Mitte/rechts).
 *
 * Die Zonen halten die Folie auf jedem Gerät richtig: Auf dem Desktop steht
 * jede Zone an ihrem Platz, die Bausteine einer Zone untereinander und nach
 * ihrer Spalte ausgerichtet. Auf dem Telefon stehen alle Zonen in
 * Lesereihenfolge (Zeile für Zeile, links nach rechts) untereinander; jeder
 * Baustein lässt sich dort ausblenden.
 *
 * Frei von DOM und React.
 */

import { CTA_ICONS, CtaIcon, SlideCta, SlideImage, newSlideId } from "./slides-model";

/** Die Zonen in Lesereihenfolge — so stehen sie auch mobil untereinander. */
export const ZONES = [
  "top-left",
  "top-center",
  "top-right",
  "middle-left",
  "middle-center",
  "middle-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
] as const;
export type ZoneId = (typeof ZONES)[number];

export const ZONE_LABELS: Record<ZoneId, string> = {
  "top-left": "oben links",
  "top-center": "oben Mitte",
  "top-right": "oben rechts",
  "middle-left": "Mitte links",
  "middle-center": "Mitte",
  "middle-right": "Mitte rechts",
  "bottom-left": "unten links",
  "bottom-center": "unten Mitte",
  "bottom-right": "unten rechts",
};

/** Schriftfarbe eines Bausteins; `auto` folgt der Folie (weiß oder anthrazit). */
export const BLOCK_COLORS = ["auto", "white", "slate", "red"] as const;
export type BlockColor = (typeof BLOCK_COLORS)[number];

export const HEADING_SIZES = ["display", "h1", "h2", "h3"] as const;
export type HeadingSize = (typeof HEADING_SIZES)[number];

export const SIZES = ["s", "m", "l"] as const;
export type BlockSize = (typeof SIZES)[number];

interface BlockBase {
  /** Stabil über Verschieben hinweg — React-Key und Ziel der Übersetzung. */
  id: string;
  /** Mobil nicht zeigen. */
  hideMobile?: boolean;
}

export interface HeadingBlock extends BlockBase {
  type: "heading";
  text: string;
  size: HeadingSize;
  color: BlockColor;
}

export interface TextBlock extends BlockBase {
  type: "text";
  text: string;
  size: BlockSize;
  color: BlockColor;
}

/** Kleine Zeile über einer Überschrift (Eyebrow). */
export interface LabelBlock extends BlockBase {
  type: "label";
  text: string;
  color: BlockColor;
}

export interface IconBlock extends BlockBase {
  type: "icon";
  icon: CtaIcon;
  size: BlockSize;
  color: BlockColor;
}

export interface ButtonsBlock extends BlockBase {
  type: "buttons";
  ctas: SlideCta[];
}

/** Ein freigestelltes Bild oder Logo, nicht das Bühnenbild. */
export interface ImageBlock extends BlockBase {
  type: "image";
  image: SlideImage;
  size: BlockSize;
}

export type SlideBlock = HeadingBlock | TextBlock | LabelBlock | IconBlock | ButtonsBlock | ImageBlock;
export type BlockType = SlideBlock["type"];

export const BLOCK_TYPES: readonly BlockType[] = ["heading", "text", "label", "buttons", "image", "icon"];

export const BLOCK_LABELS: Record<BlockType, string> = {
  heading: "Überschrift",
  text: "Text",
  label: "Label",
  buttons: "Buttons",
  image: "Bild oder Logo",
  icon: "Icon",
};

/** Die Bausteine je Zone; leere Zonen fehlen. */
export type SlideLayout = Partial<Record<ZoneId, SlideBlock[]>>;

/** Ein neuer Baustein mit Vorgaben, wie ihn der Katalog einsetzt. */
export function newBlock(type: BlockType): SlideBlock {
  const id = newSlideId();
  switch (type) {
    case "heading":
      return { id, type, text: "Überschrift", size: "h1", color: "auto" };
    case "text":
      return { id, type, text: "Ein Satz, der erklärt, worum es geht.", size: "l", color: "auto" };
    case "label":
      return { id, type, text: "Label", color: "auto" };
    case "icon":
      return { id, type, icon: "info", size: "m", color: "auto" };
    case "buttons":
      return { id, type, ctas: [] };
    case "image":
      return { id, type, image: { url: "", alt: "" }, size: "m" };
  }
}

/** Alle Bausteine in Lesereihenfolge, mit ihrer Zone. */
export function blocksInReadingOrder(layout: SlideLayout | undefined): { zone: ZoneId; block: SlideBlock }[] {
  return ZONES.flatMap((zone) => (layout?.[zone] ?? []).map((block) => ({ zone, block })));
}

/**
 * Der Text der ersten Überschrift — als `headline` gespiegelt, damit ältere
 * Fassungen des Widgets und die Liste im Editor einen Titel haben.
 */
export function firstHeading(layout: SlideLayout | undefined): string {
  const found = blocksInReadingOrder(layout).find(({ block }) => block.type === "heading");
  return found?.block.type === "heading" ? found.block.text : "";
}

// --- Lesen und Schreiben -------------------------------------------------------

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const pick = <T extends string>(list: readonly T[], value: unknown, fallback: T): T =>
  typeof value === "string" && (list as readonly string[]).includes(value) ? (value as T) : fallback;

const text = (value: unknown): string => (typeof value === "string" ? value : "");

export interface BlockCodec {
  parseCta: (value: unknown) => SlideCta | undefined;
  encodeCta: (cta: SlideCta) => Record<string, unknown>;
  parseImage: (value: unknown) => SlideImage | undefined;
  encodeImage: (image: SlideImage) => Record<string, unknown>;
}

/** Liest einen Baustein; Unbekanntes (neuere Sorten) fällt weg. */
export function parseBlock(value: unknown, codec: BlockCodec): SlideBlock | undefined {
  if (!isRecord(value)) return undefined;
  const base = { id: text(value.id) || newSlideId(), ...(value.hideMobile === true ? { hideMobile: true } : {}) };
  const color = pick(BLOCK_COLORS, value.color, "auto");
  switch (value.type) {
    case "heading":
      return { ...base, type: "heading", text: text(value.text), size: pick(HEADING_SIZES, value.size, "h1"), color };
    case "text":
      return { ...base, type: "text", text: text(value.text), size: pick(SIZES, value.size, "l"), color };
    case "label":
      return { ...base, type: "label", text: text(value.text), color };
    case "icon":
      return { ...base, type: "icon", icon: pick(CTA_ICONS, value.icon, "info"), size: pick(SIZES, value.size, "m"), color };
    case "buttons": {
      const ctas = Array.isArray(value.ctas) ? value.ctas.map(codec.parseCta).filter((cta): cta is SlideCta => cta !== undefined) : [];
      return { ...base, type: "buttons", ctas };
    }
    case "image":
      return { ...base, type: "image", image: codec.parseImage(value.image) ?? { url: "", alt: "" }, size: pick(SIZES, value.size, "m") };
    default:
      return undefined;
  }
}

export function parseLayout(value: unknown, codec: BlockCodec): SlideLayout {
  if (!isRecord(value)) return {};
  const layout: SlideLayout = {};
  for (const zone of ZONES) {
    const list = value[zone];
    if (!Array.isArray(list)) continue;
    const blocks = list.map((entry) => parseBlock(entry, codec)).filter((block): block is SlideBlock => block !== undefined);
    if (blocks.length > 0) layout[zone] = blocks;
  }
  return layout;
}

/** Nur, was von der Vorgabe abweicht — das Attribut bleibt kurz. */
export function encodeBlock(block: SlideBlock, codec: BlockCodec): Record<string, unknown> {
  const out: Record<string, unknown> = { id: block.id, type: block.type };
  if (block.hideMobile === true) out.hideMobile = true;
  if ("color" in block && block.color !== "auto") out.color = block.color;
  switch (block.type) {
    case "heading":
      out.text = block.text;
      if (block.size !== "h1") out.size = block.size;
      break;
    case "text":
      out.text = block.text;
      if (block.size !== "l") out.size = block.size;
      break;
    case "label":
      out.text = block.text;
      break;
    case "icon":
      out.icon = block.icon;
      if (block.size !== "m") out.size = block.size;
      break;
    case "buttons":
      out.ctas = block.ctas.map(codec.encodeCta);
      break;
    case "image":
      out.image = codec.encodeImage(block.image);
      if (block.size !== "m") out.size = block.size;
      break;
  }
  return out;
}

export function encodeLayout(layout: SlideLayout, codec: BlockCodec): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const zone of ZONES) {
    const blocks = layout[zone] ?? [];
    if (blocks.length > 0) out[zone] = blocks.map((block) => encodeBlock(block, codec));
  }
  return out;
}

// --- Ausrichtung je Zone ---------------------------------------------------------

/** Ausrichtung in einer Zone: waagerecht (x) links/Mitte/rechts, senkrecht (y) oben/Mitte/unten. */
export const ALIGNS = ["start", "center", "end"] as const;
export type Align = (typeof ALIGNS)[number];

export interface ZoneAlign {
  x: Align;
  y: Align;
}

/** Abweichungen von der Vorgabe je Zone; was fehlt, folgt der Lage der Zone. */
export type ZoneAlignments = Partial<Record<ZoneId, Partial<ZoneAlign>>>;

/** Die Vorgabe: so, wie die Zone liegt — „unten links“ steht unten links. */
export function defaultAlign(zone: ZoneId): ZoneAlign {
  const [row, col] = zone.split("-") as [string, string];
  return {
    x: col === "left" ? "start" : col === "center" ? "center" : "end",
    y: row === "top" ? "start" : row === "middle" ? "center" : "end",
  };
}

export function alignOf(alignments: ZoneAlignments | undefined, zone: ZoneId): ZoneAlign {
  return { ...defaultAlign(zone), ...(alignments?.[zone] ?? {}) };
}

/**
 * Setzt eine Achse; was danach der Vorgabe entspricht, fällt weg — so bleibt
 * gespeichert nur, was die Redaktion wirklich geändert hat.
 */
export function withAlign(alignments: ZoneAlignments | undefined, zone: ZoneId, axis: keyof ZoneAlign, value: Align): ZoneAlignments {
  const fallback = defaultAlign(zone);
  const next: Partial<ZoneAlign> = { ...(alignments?.[zone] ?? {}), [axis]: value };
  for (const key of ["x", "y"] as const) if (next[key] === fallback[key]) delete next[key];
  const out: ZoneAlignments = { ...alignments };
  if (Object.keys(next).length > 0) out[zone] = next;
  else delete out[zone];
  return out;
}

export function parseZoneAlign(value: unknown): ZoneAlignments {
  if (!isRecord(value)) return {};
  let out: ZoneAlignments = {};
  for (const zone of ZONES) {
    const entry = value[zone];
    if (!isRecord(entry)) continue;
    for (const axis of ["x", "y"] as const) {
      if (typeof entry[axis] === "string" && (ALIGNS as readonly string[]).includes(entry[axis] as string)) {
        out = withAlign(out, zone, axis, entry[axis] as Align);
      }
    }
  }
  return out;
}
