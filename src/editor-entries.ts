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
 * Die Regeln der Eintragsliste im Folien-Editor, frei von React.
 *
 * Getrennt vom Editor, weil zwei Stellen sie brauchen: der Editor selbst
 * (Liste, Aktionen, Fehlermarken) und der Injektor, der dem Rahmen Prüfung
 * und Status mitgibt. Der Injektor liegt im Seitenbündel, der Editor wird
 * nachgeladen – hier steht nichts, was das Seitenbündel schwerer machte.
 *
 * Jede Operation gibt eine neue Liste zurück und lässt die alte stehen: der
 * Entwurf im Rahmen führt Rückgängig über genau diese Stände.
 */

import type { ValidationIssue } from "@man/config-ui/shell/shell-context";

import {
  HeroItem,
  HeroItemType,
  heroItemType,
  isNewsChannelItem,
  isNewsPostItem,
  serializeHeroItems,
} from "./hero-items";
import { newSlideId } from "./slides-model";

/**
 * Mehr Einträge trägt keine Bühne: sie werden nur nacheinander gezeigt, und
 * was hinter dem fünften steht, sieht im Autoplay niemand mehr. Ein
 * Kanaleintrag zählt hier als einer — wie viele Folien er tatsächlich
 * beisteuert, entscheidet erst `resolve-hero-items`, das dieselbe Acht ein
 * zweites Mal durchsetzt.
 */
export const MAX_ITEMS = 8;

/** Die Namen der Sorten wie im Menü „Neu“ – ausgeschrieben, nicht die Kurzmarke der Liste. */
const KIND_NAMES: Readonly<Record<HeroItemType, string>> = {
  slide: "Folie",
  "news-post": "News-Beitrag",
  "news-channel": "News-Kanal",
};

export function entryKindName(item: HeroItem): string {
  return KIND_NAMES[heroItemType(item)];
}

/**
 * Was einem Eintrag fehlt, damit er auf der Bühne erscheint – oder
 * `undefined`. Es sind genau die Fälle, die `parseHeroItems` beim nächsten
 * Lesen still verwirft: ohne Meldung verschwände der Eintrag nach dem
 * Speichern, und niemand wüsste warum.
 */
export function missingPart(item: HeroItem): string | undefined {
  if (isNewsPostItem(item)) return item.postId.trim() === "" ? "Beitrag fehlt" : undefined;
  if (isNewsChannelItem(item)) return item.channelId.trim() === "" ? "Kanal fehlt" : undefined;
  return item.image.url.trim() === "" ? "Bild fehlt" : undefined;
}

/** Die Fehler des Entwurfs, gezählt wie die Liste: „Folie 3: Bild fehlt“. */
export function validateHeroItems(items: readonly HeroItem[]): ValidationIssue[] {
  return items.flatMap((item, position) => {
    const missing = missingPart(item);
    return missing === undefined
      ? []
      : [{ id: item.id, message: `${entryKindName(item)} ${position + 1}: ${missing}` }];
  });
}

/** Die Zahl der Einträge in Worten – der Rückfall, wenn sich nichts zählen lässt. */
export function entriesStatus(items: readonly HeroItem[]): string {
  if (items.length === 0) return "Keine Einträge";
  return items.length === 1 ? "1 Eintrag" : `${items.length} Einträge`;
}

const written = (item: HeroItem): string => serializeHeroItems([item]);

/**
 * Der Text am Status, solange etwas nicht übernommen ist: wie viele Einträge
 * sich vom übernommenen Stand unterscheiden – geändert, neu oder gelöscht.
 * Verglichen wird über die Kennung und die geschriebene Form, also genau das,
 * was „Übernehmen“ ins Feld schriebe. Ist nur verschoben, heißt es so.
 */
export function changesStatus(draft: readonly HeroItem[], saved: readonly HeroItem[]): string {
  const before = new Map(saved.map((item) => [item.id, written(item)]));
  const kept = new Set(draft.map((item) => item.id));
  const changed = draft.filter((item) => before.get(item.id) !== written(item)).length;
  const removed = saved.filter((item) => !kept.has(item.id)).length;
  const count = changed + removed;
  if (count > 0) return `${count} ${count === 1 ? "Eintrag" : "Einträge"} geändert`;
  const moved = draft.some((item, index) => item.id !== saved[index]?.id);
  return moved ? "Reihenfolge geändert" : entriesStatus(draft);
}

/** Verschiebt einen Eintrag; am Rand kommt dieselbe Liste zurück, damit kein leerer Schritt entsteht. */
export function moveEntry(items: HeroItem[], from: number, to: number): HeroItem[] {
  const moved = items[from];
  if (moved === undefined || from === to || to < 0 || to >= items.length) return items;
  const rest = items.filter((_, index) => index !== from);
  return [...rest.slice(0, to), moved, ...rest.slice(to)];
}

/**
 * Setzt eine Kopie direkt hinter den Eintrag. Mit neuer Kennung, keiner
 * geerbten: zwei Einträge mit derselben wären als React-Schlüssel und beim
 * Auflösen der Folien nicht zu unterscheiden.
 */
export function duplicateEntry(items: HeroItem[], index: number): HeroItem[] {
  const original = items[index];
  if (original === undefined) return items;
  const copy = { ...original, id: newSlideId() } as HeroItem;
  return [...items.slice(0, index + 1), copy, ...items.slice(index + 1)];
}

export function removeEntry(items: HeroItem[], index: number): HeroItem[] {
  return items.filter((_, position) => position !== index);
}

/**
 * Ordnet die Einträge nach einer Folge von Kennungen, wie sie die Liste
 * nach dem Ziehen meldet. Was die Folge nicht nennt, bleibt hinten stehen:
 * ein verlorener Eintrag wäre schlimmer als ein falsch einsortierter.
 */
export function reorderEntries(items: HeroItem[], ids: readonly string[]): HeroItem[] {
  const byId = new Map(items.map((item) => [item.id, item]));
  const ordered = ids.flatMap((id) => byId.get(id) ?? []);
  const named = new Set(ordered.map((item) => item.id));
  return [...ordered, ...items.filter((item) => !named.has(item.id))];
}
