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

import { UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

export const SLIDES_ATTRIBUTE = "slides";
export const HEIGHT_ATTRIBUTE = "height";
export const FULL_BLEED_ATTRIBUTE = "full-bleed";
export const AUTOPLAY_DELAY_ATTRIBUTE = "autoplay-delay";
export const POSITION_ATTRIBUTE = "position";
export const CONTROLS_ATTRIBUTE = "controls";
export const BOTTOM_SPACING_ATTRIBUTE = "bottom-spacing";

/**
 * Das Schema des Konfigurationsdialogs.
 *
 * `slides` steht hier als gewöhnliches Textfeld, obwohl es niemand von Hand
 * ausfüllen soll: Staffbase rendert den Dialog selbst und kennt nur die
 * Feldtypen von RJSF. Der Folien-Editor tritt zur Laufzeit an seine Stelle
 * (`slide-editor-injector.ts`) und blendet das Feld aus. Fällt er aus — etwa
 * weil der Dialog anders aufgebaut wird als erwartet —, bleibt das Textfeld
 * sichtbar und die Konfiguration damit reparierbar statt unerreichbar.
 *
 * @see https://rjsf-team.github.io/react-jsonschema-form/docs/
 */
export const configurationSchema: JSONSchema7 = {
  properties: {
    [SLIDES_ATTRIBUTE]: {
      type: "string",
      title: "Einträge",
      default: "[]",
    },
    [HEIGHT_ATTRIBUTE]: {
      type: "string",
      title: "Höhe",
      default: "section",
      oneOf: [
        { const: "small", title: "Niedrig (320–420 px)" },
        { const: "medium", title: "Mittel (420–560 px)" },
        { const: "large", title: "Hoch (560–720 px)" },
        { const: "viewport", title: "Bildschirmhoch" },
        { const: "section", title: "Abschnittshöhe (Vorgabe)" },
      ],
    },
    [FULL_BLEED_ATTRIBUTE]: {
      type: "boolean",
      title: "Über die volle Breite zeigen",
      default: true,
    },
    [AUTOPLAY_DELAY_ATTRIBUTE]: {
      type: "number",
      title: "Sekunden je Folie",
      default: 5,
      minimum: 0,
      maximum: 30,
    },
    [POSITION_ATTRIBUTE]: {
      type: "string",
      title: "Lage zu den Brotkrumen",
      default: "post",
      oneOf: [
        { const: "post", title: "Nach den Brotkrumen (Vorgabe)" },
        { const: "pre", title: "Vor den Brotkrumen" },
      ],
    },
    [CONTROLS_ATTRIBUTE]: {
      type: "boolean",
      title: "Bedienelemente zeigen",
      default: true,
    },
    [BOTTOM_SPACING_ATTRIBUTE]: {
      type: "string",
      title: "Abstand nach unten",
      default: "default",
      oneOf: [
        { const: "default", title: "Standard (Vorgabe)" },
        { const: "none", title: "Kein Abstand" },
      ],
    },
  },
};

/**
 * @see https://rjsf-team.github.io/react-jsonschema-form/docs/api-reference/uiSchema
 */
export const uiSchema: UiSchema = {
  [SLIDES_ATTRIBUTE]: {
    "ui:help":
      "Die Einträge der Bühne: eigene Folien, einzelne News-Beiträge oder ein ganzer " +
      "News-Kanal. Der Editor öffnet sich von selbst; das Textfeld dahinter ist die " +
      "Rohfassung und muss nicht angefasst werden.",
  },
  [HEIGHT_ATTRIBUTE]: {
    "ui:help":
      "Die Bühne ist auf breiten Bildschirmen 21:9 und auf schmalen 4:3, begrenzt durch die gewählte Stufe. " +
      "„Bildschirmhoch“ füllt die sichtbare Seite abzüglich der Kopfzeile. " +
      "Die Vorgabe „Abschnittshöhe“ lässt die Bühne im neuen Editor oben und unten bündig mit dem " +
      "Abschnitt abschliessen und dessen Höhe einnehmen; steht noch etwas anderes im selben Abschnitt, " +
      "rückt es ohne Abstand an die Bühne, und die Bühne behält ihr Seitenverhältnis. Im klassischen " +
      "Editor gibt es keinen Abschnitt — dort verhält sie sich wie „Mittel“.",
  },
  [FULL_BLEED_ATTRIBUTE]: {
    "ui:help":
      "Das Bild läuft über die volle Fensterbreite, der Text bleibt auf der Fluchtlinie der Seite. " +
      "Abschalten, wenn die Bühne in einer schmalen Spalte steht.",
  },
  [AUTOPLAY_DELAY_ATTRIBUTE]: {
    "ui:help":
      "0 hält die Bühne an; dann wird nur über Pfeile und Striche geblättert. " +
      "Wer im System weniger Bewegung eingestellt hat, sieht ohnehin keinen Wechsel von selbst.",
  },
  [POSITION_ATTRIBUTE]: {
    "ui:help":
      "„Vor den Brotkrumen“ setzt die Bühne bündig unter das Menü; die Brotkrumen rücken " +
      "darunter. Das greift nur, wenn die Bühne oben auf der Seite steht und die Seite " +
      "überhaupt Brotkrumen hat — sonst verhält sie sich wie „nach den Brotkrumen“.",
  },
  [CONTROLS_ATTRIBUTE]: {
    "ui:help":
      "Blendet Pfeile und Striche aus. Geblättert wird weiter mit Wischen und den " +
      "Pfeiltasten, und die eingestellte Zeit je Folie läuft unverändert.",
  },
  [BOTTOM_SPACING_ATTRIBUTE]: {
    "ui:help":
      "„Standard“ hält unter der Bühne den Abstand, den die Seite zwischen ihre Blöcke setzt. " +
      "„Kein Abstand“ lässt den folgenden Block direkt anschliessen — bei „vor den Brotkrumen“ " +
      "direkt unter den Brotkrumen. Der Innenabstand am Ende eines Abschnitts bleibt.",
  },
};
