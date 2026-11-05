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

import { isEditor } from "./editor-context";

/** Ein Element im `<body>`, wahlweise in einem Abschnitt des Designers. */
function place(inSection: boolean): HTMLElement {
  const host = document.createElement("div");
  if (inSection) {
    const section = document.createElement("div");
    section.setAttribute("data-c13y-component", "section-block");
    section.appendChild(host);
    document.body.appendChild(section);
  } else {
    document.body.appendChild(host);
  }
  return host;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("isEditor", () => {
  it("erkennt den klassischen Editor an der Werkzeugleiste", () => {
    const toolbar = document.createElement("div");
    toolbar.id = "contextual-action-toolbar";
    document.body.appendChild(toolbar);

    expect(isEditor(place(false))).toBe(true);
  });

  it("erkennt den Content Designer am Abschnitt um die Bühne", () => {
    expect(isEditor(place(true))).toBe(true);
  });

  it("hält eine fertige Inhaltsseite nicht für den Editor", () => {
    // Dort darf kein Hinweis stehen: Leser:innen können an der Einstellung
    // nichts ändern, und ein Streifen über dem Bild sähe aus wie ein Fehler
    // der Seite.
    expect(isEditor(place(false))).toBe(false);
  });
});
