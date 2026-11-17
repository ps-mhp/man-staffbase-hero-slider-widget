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
 * Was die Bildfelder brauchen, um Medien aus der Mediathek-Leiste
 * anzunehmen: Client, erlaubte Medienart und wohin ein abgelegtes Medium
 * gehört.
 *
 * Als Kontext statt als Eigenschaften, weil drei Formulare mit vier
 * Bildfeldern dazwischen liegen; ohne Kontext (Formular allein im Test)
 * bleiben die Felder einfache Kacheln ohne Ablegen.
 */

import { createContext, useContext } from "react";
import type { MediaClient } from "@shared/media/media-client";
import type { MediaAccept, PickedMedia } from "@shared/media/media-picker";

import type { PickerTarget } from "../use-entries";

export interface EditorMedia {
  client: MediaClient;
  /** Was die Felder des gewählten Eintrags nehmen. */
  accept: MediaAccept;
  /** Ein abgelegtes Medium in das Feld `target` des Eintrags `itemId`. */
  drop: (itemId: string, target: PickerTarget, media: PickedMedia) => void;
}

export const EditorMediaContext = createContext<EditorMedia | null>(null);

/** Was ein einzelnes Bildfeld zum Ablegen braucht. */
export interface FieldMedia {
  client: MediaClient;
  accept: MediaAccept;
  onPick: (media: PickedMedia) => void;
}

/** Das Ablegen für ein Feld eines Eintrags, oder `undefined` ohne Editor drumherum. */
export function useFieldMedia(itemId: string, target: PickerTarget): FieldMedia | undefined {
  const media = useContext(EditorMediaContext);
  if (media === null) return undefined;
  return { client: media.client, accept: media.accept, onPick: (picked) => media.drop(itemId, target, picked) };
}
