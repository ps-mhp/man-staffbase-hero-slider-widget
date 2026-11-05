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
 * Ob die Bühne gerade bearbeitet oder gelesen wird.
 *
 * Der Unterschied entscheidet, wem ein Hinweis zu einer Einstellung zumutbar
 * ist: Redakteur:innen können etwas daran ändern, Leser:innen nicht. Ein
 * Streifen über dem Bild wäre für sie nur ein Fehler der Seite.
 *
 * Gefragt wird an zwei Stellen, weil Staffbase zwei Editoren hat: der
 * klassische bringt die kontextuelle Werkzeugleiste mit, der Content Designer
 * arbeitet unter einer eigenen Adresse.
 *
 * Nicht gefragt wird nach dem Abschnitt des Content Designers. Der sieht
 * zwar nach Editor aus, ist aber Teil der gespeicherten Seite und steht
 * genauso auf der fertigen Seite — `full-bleed.ts` baut im Lesemodus darauf.
 * Als Merkmal genommen, hielte er jede mit dem Designer gebaute Seite für
 * den Editor und zeigte den Hinweis ausgerechnet denen, die ihn nicht
 * gebrauchen können.
 */

/** Die Werkzeugleiste des klassischen Editors. */
export const EDITOR_TOOLBAR_SELECTOR = "#contextual-action-toolbar";

/**
 * Der Pfad des Studios, unter dem der Content Designer bearbeitet
 * (`/studio/content/page/…/edit`). Dieselbe Prüfung wie im Loader
 * (`loader/bootstrap.js`). Eine gelesene Seite liegt nie dort.
 */
const STUDIO_PATH = "/studio";

/** Steht `element` auf einer Seite, die gerade bearbeitet wird? */
export function isEditor(element: HTMLElement): boolean {
  const doc = element.ownerDocument;
  if (doc.querySelector(EDITOR_TOOLBAR_SELECTOR) !== null) return true;
  const path = doc.location?.pathname ?? "";
  return path === STUDIO_PATH || path.startsWith(`${STUDIO_PATH}/`);
}
