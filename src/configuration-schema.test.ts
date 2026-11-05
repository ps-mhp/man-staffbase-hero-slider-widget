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

import {
  AUTOPLAY_DELAY_ATTRIBUTE,
  CONTROLS_ATTRIBUTE,
  configurationSchema,
  FULL_BLEED_ATTRIBUTE,
  HEIGHT_ATTRIBUTE,
  POSITION_ATTRIBUTE,
  SLIDES_ATTRIBUTE,
  uiSchema,
} from "./configuration-schema";

const ATTRIBUTE_NAMES = [
  SLIDES_ATTRIBUTE,
  HEIGHT_ATTRIBUTE,
  FULL_BLEED_ATTRIBUTE,
  AUTOPLAY_DELAY_ATTRIBUTE,
  POSITION_ATTRIBUTE,
  CONTROLS_ATTRIBUTE,
];

describe("configurationSchema", () => {
  it("enthält für jedes Attribut einen Eintrag im Dialogschema", () => {
    // Genau dieser Abgleich fehlte: ein Attribut ohne Schema-Eintrag rendert
    // RJSF stillschweigend gar nicht erst.
    for (const name of ATTRIBUTE_NAMES) {
      expect(configurationSchema.properties).toHaveProperty([name]);
    }
  });

  it("gibt für die Lage zu den Brotkrumen den abwärtskompatiblen Vorgabewert an", () => {
    const property = configurationSchema.properties?.[POSITION_ATTRIBUTE];
    expect(property).toMatchObject({ default: "post" });
  });

  it("gibt für die Bedienelemente den abwärtskompatiblen Vorgabewert an", () => {
    const property = configurationSchema.properties?.[CONTROLS_ATTRIBUTE];
    expect(property).toMatchObject({ default: true });
  });
});

describe("uiSchema", () => {
  it("führt die neuen Attribute als eigenständige Einträge auf oberster Ebene", () => {
    // Die Verschachtelungslücke steckte genau hier: beide Einträge lagen
    // innerhalb von AUTOPLAY_DELAY_ATTRIBUTE statt daneben.
    expect(uiSchema).toHaveProperty([POSITION_ATTRIBUTE]);
    expect(uiSchema).toHaveProperty([CONTROLS_ATTRIBUTE]);
    expect(uiSchema[AUTOPLAY_DELAY_ATTRIBUTE]).not.toHaveProperty([
      POSITION_ATTRIBUTE,
    ]);
    expect(uiSchema[AUTOPLAY_DELAY_ATTRIBUTE]).not.toHaveProperty([
      CONTROLS_ATTRIBUTE,
    ]);
  });
});
