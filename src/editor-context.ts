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
 * klassische hält seinen Zustand in `[data-react-values]`, der Content
 * Designer arbeitet unter einer eigenen Adresse.
 *
 * Zwei naheliegende Merkmale taugen ausdrücklich **nicht**. Der Abschnitt des
 * Content Designers (`[data-c13y-component="section-block"]`) gehört zur
 * gespeicherten Seite und steht genauso auf der fertigen — `full-bleed.ts`
 * baut im Lesemodus gerade darauf. Und die kontextuelle Werkzeugleiste
 * (`#contextual-action-toolbar`) ist Teil der Leseansicht: wer die Seite
 * bearbeiten darf, sieht sie auch beim blossen Lesen (siehe
 * `shared/content-modal/page-frame.tsx` und `CHROME_SELECTOR` in
 * `page-top.ts`). Beide hielten gewöhnliche Seiten für den Editor und
 * zeigten den Hinweis denen, die ihn nicht gebrauchen können.
 */

/**
 * Der Zustand des klassischen Editors. Keine veröffentlichte Seite trägt
 * ihn — dasselbe Merkmal nutzt `content-tabs` (`EDITOR_MARKER_SELECTOR` in
 * dessen `bootstrap.tsx`).
 */
export const EDITOR_MARKER_SELECTOR = "[data-react-values]";

/**
 * Der Pfad des Studios, unter dem der Content Designer bearbeitet
 * (`/studio/content/page/…/edit`). Eine gelesene Seite liegt nie dort; der
 * Loader (`loader/bootstrap.js`) prüft sie ebenso.
 */
const STUDIO_PATH = "/studio";

/** Steht `element` auf einer Seite, die gerade bearbeitet wird? */
export function isEditor(element: HTMLElement): boolean {
  const doc = element.ownerDocument;
  if (doc.querySelector(EDITOR_MARKER_SELECTOR) !== null) return true;
  const path = doc.location?.pathname ?? "";
  return path === STUDIO_PATH || path.startsWith(`${STUDIO_PATH}/`);
}
