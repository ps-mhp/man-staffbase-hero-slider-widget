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

/** Die Adresse, unter der die Seite gerade steht. */
function at(path: string): void {
  window.history.pushState({}, "", path);
}

afterEach(() => {
  document.body.innerHTML = "";
  at("/");
});

describe("isEditor", () => {
  it("erkennt den klassischen Editor an seinem Zustand im Dokument", () => {
    const state = document.createElement("div");
    state.setAttribute("data-react-values", "{}");
    document.body.appendChild(state);

    expect(isEditor(place(false))).toBe(true);
  });

  it("erkennt den Content Designer an der Adresse des Studios", () => {
    at("/studio/content/page/6a6850edcb9e7d3876d306d4/edit");

    expect(isEditor(place(true))).toBe(true);
  });

  it("hält eine fertige Inhaltsseite nicht für den Editor", () => {
    // Dort darf kein Hinweis stehen: Leser:innen können an der Einstellung
    // nichts ändern, und ein Streifen über dem Bild sähe aus wie ein Fehler
    // der Seite.
    expect(isEditor(place(false))).toBe(false);
  });

  it("hält eine gelesene Seite aus dem Content Designer nicht für den Editor", () => {
    // Der Abschnitt taugt nicht als Merkmal: er gehört zur gespeicherten
    // Seite und steht auch dort, wo niemand mehr etwas bearbeitet.
    at("/content/page/6a6850edcb9e7d3876d306d4");

    expect(isEditor(place(true))).toBe(false);
  });

  it("hält die Werkzeugleiste der Leseansicht nicht für den Editor", () => {
    // Wer die Seite bearbeiten darf, sieht die Leiste auch beim blossen
    // Lesen. Als Merkmal genommen, stünde der Hinweis auf der fertigen Seite.
    const toolbar = document.createElement("div");
    toolbar.id = "contextual-action-toolbar";
    document.body.appendChild(toolbar);

    expect(isEditor(place(true))).toBe(false);
  });

  it("lässt sich von einer Seite, die nur so heisst, nicht täuschen", () => {
    at("/studioreise/content/page/1");

    expect(isEditor(place(false))).toBe(false);
  });
});
