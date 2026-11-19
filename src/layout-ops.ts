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
 * Was der Editor mit den Bausteinen einer benutzerdefinierten Folie tut —
 * jede Operation gibt ein neues Layout zurück, das alte bleibt unberührt.
 *
 * Frei von DOM und React.
 */

import { SlideBlock, SlideLayout, ZONES, ZoneId, newBlock } from "./slide-layout";
import { Slide, newSlideId } from "./slides-model";

/** Ein Layout ohne leere Zonen — so, wie es gespeichert wird. */
function tidy(layout: SlideLayout): SlideLayout {
  const out: SlideLayout = {};
  for (const zone of ZONES) {
    const blocks = layout[zone];
    if (blocks !== undefined && blocks.length > 0) out[zone] = blocks;
  }
  return out;
}

export function findBlock(layout: SlideLayout | undefined, id: string): { zone: ZoneId; index: number; block: SlideBlock } | undefined {
  for (const zone of ZONES) {
    const index = (layout?.[zone] ?? []).findIndex((block) => block.id === id);
    if (index >= 0) return { zone, index, block: layout![zone]![index]! };
  }
  return undefined;
}

/** Fügt ein; ohne Stelle ans Ende der Zone. */
export function insertBlock(layout: SlideLayout | undefined, zone: ZoneId, block: SlideBlock, at?: number): SlideLayout {
  const blocks = [...(layout?.[zone] ?? [])];
  blocks.splice(at === undefined ? blocks.length : Math.max(0, Math.min(at, blocks.length)), 0, block);
  return tidy({ ...layout, [zone]: blocks });
}

export function removeBlock(layout: SlideLayout | undefined, id: string): SlideLayout {
  const out: SlideLayout = {};
  for (const zone of ZONES) out[zone] = (layout?.[zone] ?? []).filter((block) => block.id !== id);
  return tidy(out);
}

/**
 * Verschiebt in eine Zone an eine Stelle. Die Stelle zählt im Ziel, wie es
 * vor dem Herausnehmen aussah — so meint ein Ablegen „vor diesem Baustein“
 * auch in derselben Zone das, was man sieht.
 */
export function moveBlock(layout: SlideLayout | undefined, id: string, zone: ZoneId, at?: number): SlideLayout {
  const found = findBlock(layout, id);
  if (found === undefined) return tidy({ ...layout });
  const shift = found.zone === zone && at !== undefined && found.index < at ? 1 : 0;
  return insertBlock(removeBlock(layout, id), zone, found.block, at === undefined ? undefined : at - shift);
}

/** Eine Stelle nach oben (−1) oder unten (+1) in der eigenen Zone. */
export function nudgeBlock(layout: SlideLayout | undefined, id: string, delta: -1 | 1): SlideLayout {
  const found = findBlock(layout, id);
  if (found === undefined) return tidy({ ...layout });
  const blocks = [...layout![found.zone]!];
  const target = found.index + delta;
  if (target < 0 || target >= blocks.length) return tidy({ ...layout });
  [blocks[found.index], blocks[target]] = [blocks[target]!, blocks[found.index]!];
  return tidy({ ...layout, [found.zone]: blocks });
}

export function updateBlock(layout: SlideLayout | undefined, id: string, changes: Partial<SlideBlock>): SlideLayout {
  const out: SlideLayout = {};
  for (const zone of ZONES) {
    out[zone] = (layout?.[zone] ?? []).map((block) => (block.id === id ? ({ ...block, ...changes } as SlideBlock) : block));
  }
  return tidy(out);
}

/** Eine Kopie mit neuer Kennung direkt darunter. */
export function duplicateBlock(layout: SlideLayout | undefined, id: string): { layout: SlideLayout; copy?: SlideBlock } {
  const found = findBlock(layout, id);
  if (found === undefined) return { layout: tidy({ ...layout }) };
  const copy = { ...(JSON.parse(JSON.stringify(found.block)) as SlideBlock), id: newSlideId() } as SlideBlock;
  return { layout: insertBlock(layout, found.zone, copy, found.index + 1), copy };
}

/**
 * Der Wechsel von „Fest“ zu „Benutzerdefiniert“ nimmt mit, was schon da ist:
 * Überschrift, Unterzeile und Buttons stehen danach unten links — dort, wo
 * sie die feste Folie zeigt.
 */
export function layoutFromFixed(slide: Pick<Slide, "headline" | "subline" | "ctas">): SlideLayout {
  const blocks: SlideBlock[] = [];
  if (slide.headline.trim() !== "") blocks.push({ ...newBlock("heading"), text: slide.headline, size: "display" } as SlideBlock);
  if (slide.subline !== undefined && slide.subline.trim() !== "") blocks.push({ ...newBlock("text"), text: slide.subline } as SlideBlock);
  if (slide.ctas !== undefined && slide.ctas.length > 0) blocks.push({ ...newBlock("buttons"), ctas: slide.ctas } as SlideBlock);
  return tidy({ "bottom-left": blocks });
}
