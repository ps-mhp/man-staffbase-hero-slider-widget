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

import { LEGACY_ATTRIBUTES, readLegacySettings, startHiddenLegacySettings } from "./legacy-settings";

function row(key: string, input: string): string {
  return `<div data-row="${key}"><label for="root_${key}">${key}</label>${input}</div>`;
}

const text = (key: string, value: string): string => row(key, `<input id="root_${key}" value="${value}">`);
const checkbox = (key: string, checked: boolean): string =>
  row(key, `<input id="root_${key}" type="checkbox"${checked ? " checked" : ""}>`);
const select = (key: string, options: string[], selected: string): string =>
  row(
    key,
    `<select id="root_${key}">${options
      .map((option) => `<option value="${option}"${option === selected ? " selected" : ""}>${option}</option>`)
      .join("")}</select>`,
  );

/** Der eigene Dialog, wie RJSF ihn baut: `slides` und die alten Felder. */
const ownDialog = (fields: string): string => `<form>${text("slides", "[]")}${fields}</form>`;

afterEach(() => {
  document.body.innerHTML = "";
});

describe("readLegacySettings", () => {
  it("liest, was die alten Felder lesbar tragen", () => {
    document.body.innerHTML = ownDialog(
      select("height", ["small", "medium", "large", "viewport", "section"], "large") +
        checkbox("full-bleed", false) +
        text("autoplay-delay", "8") +
        select("position", ["post", "pre"], "pre") +
        checkbox("controls", true) +
        select("bottom-spacing", ["default", "none"], "none"),
    );

    expect(readLegacySettings()).toEqual({
      height: "large",
      fullBleed: false,
      autoplayDelay: 8,
      position: "pre",
      controls: true,
      bottomSpacing: "none",
    });
  });

  // Im Content Designer trägt eine Auswahl keinen lesbaren Wert. Dann fehlt
  // die Einstellung, statt mit einer Vorgabe zu erscheinen.
  it("lässt weg, was sich nicht sicher lesen lässt", () => {
    document.body.innerHTML = ownDialog(
      row("height", '<div id="root_height" role="combobox"></div>') + text("autoplay-delay", ""),
    );

    expect(readLegacySettings()).toEqual({});
  });

  it("liest nichts aus dem Dialog eines anderen Widgets", () => {
    document.body.innerHTML = `<form>${text("chart", "{}")}${text("height", "large")}</form>`;

    expect(readLegacySettings()).toEqual({});
  });
});

describe("startHiddenLegacySettings", () => {
  it("blendet die alten Felder nur im eigenen Dialog aus", () => {
    document.body.innerHTML =
      ownDialog(text("height", "large") + checkbox("controls", true)) +
      `<form id="chart">${text("chart", "{}")}${text("height", "300")}</form>`;

    const stop = startHiddenLegacySettings();

    const rows = (selector: string): HTMLElement[] => Array.from(document.querySelectorAll<HTMLElement>(selector));
    expect(rows('form:not(#chart) [data-row="height"], form:not(#chart) [data-row="controls"]').map((el) => el.style.display)).toEqual([
      "none",
      "none",
    ]);
    expect(rows('#chart [data-row="height"]')[0]!.style.display).toBe("");
    expect(rows('[data-row="slides"]')[0]!.style.display).toBe("");

    stop();
    expect(rows('[data-row="height"]').every((el) => el.style.display === "")).toBe(true);
  });

  it("nennt alle sechs alten Felder", () => {
    expect(LEGACY_ATTRIBUTES).toEqual(["height", "full-bleed", "autoplay-delay", "position", "controls", "bottom-spacing"]);
  });
});
