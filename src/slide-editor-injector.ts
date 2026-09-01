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

import { startFieldModalInjector } from "@shared/config-modal";
import { SlideEditor } from "./slide-editor";
import { Slide, encodeSlidesAttribute, parseSlides } from "./slides-model";

/** Das Schemafeld, an dessen Stelle der Editor tritt. */
const FIELD_KEY = "slides";

/**
 * Wartet auf den Konfigurationsdialog des Widgets und setzt den Folien-Editor
 * an die Stelle seines `slides`-Feldes.
 *
 * Alles, was das Überleben im fremden Dialog betrifft — Portal, Abfangen des
 * Schließens, Zurückschreiben über den nativen Setter —, liegt in
 * `@shared/config-modal`; hier bleibt nur die Zuordnung von Feld und Editor.
 *
 * @param root der zu beobachtende Teilbaum; standardmäßig das Dokument.
 * Offengelegt, damit Tests den Beobachter auf einen losgelösten Container
 * begrenzen können.
 * @returns eine Funktion, die die Beobachtung beendet und den Editor abbaut.
 */
export function startSlideEditorInjector(root: ParentNode = document): () => void {
  return startFieldModalInjector<Slide[]>({
    fieldKey: FIELD_KEY,
    root,
    reopenLabel: "Folien bearbeiten",
    modalTestId: "slide-editor-modal",
    reopenTestId: "slide-editor-reopen",
    parse: parseSlides,
    serialize: encodeSlidesAttribute,
    // Der Editor zeichnet seinen eigenen Rahmen: Liste, Formular und Fußzeile
    // teilen sich Kanten, die der Formular-Innenabstand des Panels nur von
    // ihnen wegschöbe.
    panelStyle: { padding: "0px" },
    render: ({ value, onChange, onSave, onClose, dirty }) =>
      React.createElement(SlideEditor, { value, onChange, onSave, onClose, dirty }),
  });
}
