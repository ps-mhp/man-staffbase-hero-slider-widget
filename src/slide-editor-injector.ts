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

import * as React from "react";
import { GalleryHorizontalEnd } from "lucide-react";

import { FieldModalShellOptions, startFieldModalInjector } from "@shared/config-modal";
import { changesStatus, validateHeroItems } from "./editor-entries";
import { HeroItem, encodeHeroItemsAttribute, parseHeroItems } from "./hero-items";
import { SLIDE_EDITOR_HELP } from "./slide-editor-help";

/** Das Schemafeld, an dessen Stelle der Editor tritt. */
const FIELD_KEY = "slides";

/**
 * Der Editor kommt erst, wenn ein Dialog ihn zeigt: er baut auf
 * `@man/config-ui` und damit auf react-aria, und das hat im Seitenbündel,
 * das jede Leserin lädt, nichts verloren. Hier im Seitenbündel bleiben nur
 * Prüfung, Status und Hilfe – sie braucht der Rahmen, bevor der Editor da ist.
 */
const LazySlideEditor = React.lazy(() =>
  import("./slide-editor").then((module) => ({ default: module.SlideEditor })),
);

const LOADING = React.createElement(
  "p",
  { className: "p-6 text-sm text-muted-foreground" },
  "Editor wird geladen …",
);

/** Was der gemeinsame Rahmen vom Hero-Slider wissen muss. Offengelegt für Tests. */
export const slideEditorShell: FieldModalShellOptions<HeroItem[]> = {
  widgetName: "Hero-Slider",
  title: "Folien bearbeiten",
  icon: GalleryHorizontalEnd,
  preview: true,
  help: SLIDE_EDITOR_HELP,
  statusText: changesStatus,
  validate: validateHeroItems,
};

/**
 * Wartet auf den Konfigurationsdialog des Widgets und setzt den Folien-Editor
 * an die Stelle seines `slides`-Feldes.
 *
 * Alles, was das Überleben im fremden Dialog betrifft — Portal, Abfangen des
 * Schließens, Zurückschreiben über den nativen Setter —, liegt in
 * `@shared/config-modal`; Kopf, Übernehmen, Rückgängig und Rückfrage im
 * Rahmen von `@man/config-ui`. Hier bleibt nur die Zuordnung von Feld und
 * Editor.
 *
 * @param root der zu beobachtende Teilbaum; standardmäßig das Dokument.
 * Offengelegt, damit Tests den Beobachter auf einen losgelösten Container
 * begrenzen können.
 * @returns eine Funktion, die die Beobachtung beendet und den Editor abbaut.
 */
export function startSlideEditorInjector(root: ParentNode = document): () => void {
  return startFieldModalInjector<HeroItem[]>({
    fieldKey: FIELD_KEY,
    root,
    reopenLabel: "Folien bearbeiten",
    modalTestId: "slide-editor-modal",
    reopenTestId: "slide-editor-reopen",
    parse: parseHeroItems,
    serialize: encodeHeroItemsAttribute,
    shell: slideEditorShell,
    render: ({ value, onChange }) =>
      React.createElement(
        React.Suspense,
        { fallback: LOADING },
        React.createElement(LazySlideEditor, { value, onChange }),
      ),
  });
}
