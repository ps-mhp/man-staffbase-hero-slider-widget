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
 * Auswahl und Änderungen der Eintragsliste im Folien-Editor.
 *
 * Die Auswahl hängt an der Kennung, nicht an der Stelle: nach dem Ziehen,
 * nach ↑ ↓ und nach Rückgängig im Rahmen bleibt derselbe Eintrag gewählt.
 * Die Stelle wird nur mitgeführt für den Fall, dass der Eintrag
 * verschwindet — gelöscht oder per Rückgängig zurückgenommen. Dann bleibt
 * die Auswahl, so weit es geht, an derselben Stelle stehen.
 */

import { useState } from "react";
import type { PickedMedia } from "@shared/media/media-picker";

import {
  MAX_ITEMS,
  duplicateEntry,
  moveEntry,
  removeEntry,
  reorderEntries,
} from "./editor-entries";
import { HeroItem } from "./hero-items";
import { SlideImage } from "./slides-model";

/** Welches Bild eines Eintrags der Picker gerade füllt. */
export type PickerTarget = "image" | "imagePortrait" | "imageOverride";

interface Selection {
  id: string | null;
  index: number;
}

export interface Entries {
  /** Stelle des gewählten Eintrags, `-1` bei leerer Liste. */
  index: number;
  item: HeroItem | undefined;
  /** Die Bühne ist voll: kein Anlegen, kein Duplizieren. */
  full: boolean;
  select: (id: string) => void;
  add: (fresh: HeroItem) => void;
  duplicate: () => void;
  remove: () => void;
  move: (delta: number) => void;
  reorder: (ids: string[]) => void;
  patch: (changes: Partial<HeroItem>) => void;
}

function resolveIndex(items: readonly HeroItem[], selection: Selection): number {
  const found = items.findIndex((item) => item.id === selection.id);
  if (found >= 0) return found;
  return items.length === 0 ? -1 : Math.min(Math.max(selection.index, 0), items.length - 1);
}

export function useEntries(value: HeroItem[], onChange: (items: HeroItem[]) => void): Entries {
  const [selection, setSelection] = useState<Selection>(() => ({ id: value[0]?.id ?? null, index: 0 }));
  const index = resolveIndex(value, selection);
  const item = index >= 0 ? value[index] : undefined;
  const full = value.length >= MAX_ITEMS;

  const selectAt = (items: readonly HeroItem[], at: number): void =>
    setSelection({ id: items[at]?.id ?? null, index: at });
  const commit = (next: HeroItem[], at: number): void => {
    onChange(next);
    selectAt(next, at);
  };

  return {
    index,
    item,
    full,
    select: (id) => selectAt(value, value.findIndex((entry) => entry.id === id)),
    add: (fresh) => (full ? undefined : commit([...value, fresh], value.length)),
    duplicate: () => (full || item === undefined ? undefined : commit(duplicateEntry(value, index), index + 1)),
    remove: () => (item === undefined ? undefined : commit(removeEntry(value, index), Math.max(index - 1, 0))),
    move: (delta) => {
      const next = moveEntry(value, index, index + delta);
      if (next !== value) commit(next, index + delta);
    },
    // Die Auswahl folgt der Kennung von selbst.
    reorder: (ids) => onChange(reorderEntries(value, ids)),
    patch: (changes) => {
      if (item === undefined) return;
      onChange(value.map((entry, at) => (at === index ? ({ ...entry, ...changes } as HeroItem) : entry)));
    },
  };
}

/** Das gewählte Medium als Bild der Folie, ohne leere Felder. */
export function pickedImage(picked: PickedMedia): SlideImage {
  return {
    url: picked.url,
    alt: picked.alt ?? "",
    ...(picked.width === undefined ? {} : { width: picked.width }),
    ...(picked.height === undefined ? {} : { height: picked.height }),
    ...(picked.type === "video" ? { kind: "video" as const } : {}),
  };
}

/**
 * Wohin das gewählte Medium gehört. Die vorhandene Beschreibung überlebt
 * einen Bildwechsel nicht: sie beschriebe das alte Motiv und wäre damit
 * schlechter als keine.
 */
export function patchForPick(target: PickerTarget, image: SlideImage): Partial<HeroItem> {
  if (target === "image") return { image };
  if (target === "imageOverride") return { imageOverride: image };
  return { imagePortrait: image };
}
