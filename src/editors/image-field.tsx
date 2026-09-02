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
 * Die Bildkachel samt Wählen, Ersetzen und Entfernen.
 *
 * Steht in einer eigenen Datei, weil alle drei Formulare sie brauchen: die
 * Folie für ihr Bühnenbild, das News-Formular für das überschreibende.
 */

import * as React from "react";
import { ReactElement } from "react";

import { SlideImage } from "../slides-model";

export interface ImageFieldProps {
  label: string;
  hint: string;
  image: SlideImage | undefined;
  onPick: () => void;
  onClear?: () => void;
  onAltChange?: (alt: string) => void;
  testId: string;
}

export function ImageField({
  label,
  hint,
  image,
  onPick,
  onClear,
  onAltChange,
  testId,
}: ImageFieldProps): ReactElement {
  return (
    <div className="man-se__field">
      <span className="man-se__label">{label}</span>
      <p className="man-se__hint">{hint}</p>

      {image === undefined ? (
        <button
          type="button"
          className="man-se__pick"
          data-testid={`${testId}-pick`}
          onClick={onPick}
        >
          Bild wählen
        </button>
      ) : (
        <div className="man-se__thumb-row">
          <img className="man-se__thumb" src={image.url} alt="" data-testid={`${testId}-thumb`} />
          <div className="man-se__thumb-actions">
            <button
              type="button"
              className="man-se__button"
              data-testid={`${testId}-replace`}
              onClick={onPick}
            >
              Ersetzen
            </button>
            {onClear !== undefined && (
              <button
                type="button"
                className="man-se__button man-se__button--quiet"
                data-testid={`${testId}-clear`}
                onClick={onClear}
              >
                Entfernen
              </button>
            )}
          </div>
        </div>
      )}

      {image !== undefined && onAltChange !== undefined && (
        <label className="man-se__sub">
          <span className="man-se__label">Bildbeschreibung</span>
          {/* Kein Pflichtfeld, aber eines mit Folgen: ohne sie ist das Bild
              für Screenreader stumm. Rein schmückende Bilder bleiben leer —
              deshalb wird hier nicht erzwungen, sondern erklärt. */}
          <input
            type="text"
            className="man-se__input"
            data-testid={`${testId}-alt`}
            value={image.alt}
            onChange={(event) => onAltChange(event.target.value)}
            placeholder="Was ist zu sehen? Leer lassen, wenn rein schmückend."
          />
        </label>
      )}
    </div>
  );
}
