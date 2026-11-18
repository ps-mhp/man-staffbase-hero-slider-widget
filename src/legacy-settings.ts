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
 * Die Felder älterer Fassungen im Dialog von Staffbase: Höhe, volle Breite,
 * Sekunden, Lage, Bedienelemente, Abstand unten.
 *
 * Sie bleiben im Schema, damit bestehende Blöcke ihre Werte behalten und die
 * Bühne sie weiter liest, wo das Modal nichts eingestellt hat. Zu sehen sind
 * sie im eigenen Dialog nicht mehr: Das Modal pflegt dieselben Werte, und
 * zwei Wege zum selben Wert laden zu Widersprüchen ein.
 *
 * Gelesen werden sie beim Öffnen nur, um im Modal zu zeigen, was gerade
 * gilt. Was sich nicht sicher lesen lässt – Auswahlfelder im Content
 * Designer –, fehlt im Ergebnis; das Modal sagt dann „wie bisher“, statt
 * eine Vorgabe vorzutäuschen. Geschrieben wird hier nie.
 */

import { legacyFieldsFromSchema, readLegacyFields, startHiddenFields } from "@shared/legacy-fields";

import { SLIDES_ATTRIBUTE, configurationSchema } from "./configuration-schema";
import { HeroSettingKey, HeroSettings, LEGACY_ATTRIBUTE_OF, parseHeroSettings } from "./hero-settings";

const KEYS = Object.keys(LEGACY_ATTRIBUTE_OF) as HeroSettingKey[];

/** Die alten Attribute, in der Reihenfolge der Einstellungen. */
export const LEGACY_ATTRIBUTES: readonly string[] = KEYS.map((key) => LEGACY_ATTRIBUTE_OF[key]);

/**
 * Wie jedes Feld zu lesen ist. Auswahlfelder streng: zuerst über die
 * angezeigte Beschriftung, und nur, wenn sie eindeutig ist.
 */
const FIELDS = legacyFieldsFromSchema(LEGACY_ATTRIBUTES, configurationSchema, {
  "full-bleed": { kind: "boolean" },
  controls: { kind: "boolean" },
  "autoplay-delay": { kind: "number" },
  height: { strict: true },
  position: { strict: true },
  "bottom-spacing": { strict: true },
});

/**
 * Was die alten Felder des eigenen Dialogs lesbar tragen, als Einstellungen;
 * leer ohne eigenen Dialog.
 * @param root der zu durchsuchende Teilbaum; offengelegt für Tests.
 */
export function readLegacySettings(root: ParentNode = document): HeroSettings {
  const { values } = readLegacyFields(FIELDS, SLIDES_ATTRIBUTE, root);
  return parseHeroSettings(Object.fromEntries(KEYS.map((key) => [key, values[LEGACY_ATTRIBUTE_OF[key]]])));
}

/**
 * Hält die Zeilen der alten Felder verborgen, solange der eigene Dialog sie
 * zeigt – nur dort: `height` hat auch das Diagramm.
 * @param root der zu beobachtende Teilbaum; offengelegt für Tests.
 * @returns eine Funktion, die aufhört und die Zeilen wieder zeigt.
 */
export function startHiddenLegacySettings(root: ParentNode = document): () => void {
  return startHiddenFields(LEGACY_ATTRIBUTES, SLIDES_ATTRIBUTE, root);
}
