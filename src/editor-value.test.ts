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
  AUTOPLAY_DELAY_ISSUE,
  HeroEditorValue,
  heroEditorStatus,
  readEditorValue,
  validateHeroEditor,
  writeEditorValue,
} from "./editor-value";
import { encodeHeroItemsAttribute } from "./hero-items";
import { Slide } from "./slides-model";

const slide = (id: string, headline = `Überschrift ${id}`): Slide => ({
  id,
  image: { url: `https://cdn.example.test/${id}.png`, alt: "" },
  headline,
});

const value = (overrides: Partial<HeroEditorValue> = {}): HeroEditorValue => ({
  items: [slide("a"), slide("b")],
  settings: {},
  legacy: {},
  ...overrides,
});

describe("Lesen und Schreiben", () => {
  it("schreibt nie, was die alten Felder trugen", () => {
    const raw = encodeHeroItemsAttribute([slide("a")]);
    const read = readEditorValue(raw, { height: "large", controls: false });

    expect(read).toEqual({ items: [slide("a")], settings: {}, legacy: { height: "large", controls: false } });
    expect(writeEditorValue(read)).toBe(raw);
  });
});

describe("validateHeroEditor", () => {
  it("prüft Einträge und Sekunden", () => {
    expect(validateHeroEditor(value())).toEqual([]);
    expect(validateHeroEditor(value({ settings: { autoplayDelay: 30 } }))).toEqual([]);
    expect(validateHeroEditor(value({ settings: { autoplayDelay: 31 } }))).toEqual([
      { id: AUTOPLAY_DELAY_ISSUE, message: "Sekunden pro Folie: erlaubt sind 0 bis 30" },
    ]);
  });

  it("nennt die Fehler der Einträge zuerst", () => {
    const issues = validateHeroEditor(
      value({ items: [{ ...slide("a"), image: { url: "", alt: "" } }], settings: { autoplayDelay: -2 } }),
    );

    expect(issues.map((issue) => issue.id)).toEqual(["a", AUTOPLAY_DELAY_ISSUE]);
  });
});

describe("heroEditorStatus", () => {
  it("nennt geänderte Einstellungen allein", () => {
    expect(heroEditorStatus(value({ settings: { height: "small" } }), value())).toBe("Einstellungen geändert");
  });

  it("hängt sie an die geänderten Einträge an", () => {
    const draft = value({ items: [slide("a", "Neu"), slide("b")], settings: { controls: false } });

    expect(heroEditorStatus(draft, value())).toBe("1 Eintrag geändert · Einstellungen");
    expect(heroEditorStatus({ ...draft, settings: {} }, value())).toBe("1 Eintrag geändert");
  });
});
