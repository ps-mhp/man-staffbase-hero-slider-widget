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
 * Wie der Inhalt dieses Widgets durch Staffbases Inhaltsübersetzung reist.
 *
 * Die Einträge liegen im Attribut `slides`, weil ein Attribut die einzige
 * Ablage ist, die das Widget-SDK anbietet — und `POST /api/translations`
 * übersetzt Textknoten und lässt Attribute unangetastet. Die geteilte
 * Registry schickt den Text deshalb als eigene Anfrage neben der des Editors
 * los und schreibt das Ergebnis ins Attribut zurück, bevor der Editor die
 * Antwort überhaupt sieht.
 *
 * Der Rückweg baut das Attribut zudem aus dem Tag der *Anfrage* neu auf. Das
 * ist hier nicht nur Vorsicht: die Antwort des Dienstes enthält die
 * Attributwerte unescaped, und ohne diesen Weg käme die Bühne in jeder
 * Übersetzung leer an.
 */

import { TranslationProvider } from "@shared/translation/carriers";

import { SLIDES_ATTRIBUTE } from "./configuration-schema";
import { encodeHeroItemsAttribute, parseHeroItems } from "./hero-items";
import {
  applyTranslatedFields,
  heroItemsToTranslatableHtml,
  isTranslatedHeroHtml,
  readTranslatedFields,
} from "./translation-payload";

/** Muss dem Tag entsprechen, unter dem `index.tsx` das Widget anmeldet. */
export const HERO_SLIDER_TAG = "hero-slider-widget";

export const heroSliderTranslationProvider: TranslationProvider = {
  id: HERO_SLIDER_TAG,
  label: "Hero-Slider",
  ref: { tagName: HERO_SLIDER_TAG, attribute: SLIDES_ATTRIBUTE },

  // Eine leere Bühne hat keinen Text; eine Anfrage dafür wäre nur Lärm.
  toTranslatable: (stored) => (stored ? heroItemsToTranslatableHtml(parseHeroItems(stored)) : null),

  fromTranslated: (html, stored) =>
    encodeHeroItemsAttribute(
      applyTranslatedFields(parseHeroItems(stored), readTranslatedFields(html)),
    ),

  acceptsTranslated: isTranslatedHeroHtml,
};
