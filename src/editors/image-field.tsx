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
 *
 * Wer `onUrlChange` mitgibt, bekommt darunter ein Adressfeld: das Medium kommt
 * dann wahlweise aus der Mediathek oder von einer https-Adresse, und es darf
 * auch ein Video sein.
 */

import * as React from "react";
import { ReactElement, useEffect, useState } from "react";

import { MediaKind, SlideImage, firstFrameUrl, isVideo, parseMediaUrl } from "../slides-model";

export interface ImageFieldProps {
  label: string;
  hint: string;
  image: SlideImage | undefined;
  onPick: () => void;
  onClear?: () => void;
  onAltChange?: (alt: string) => void;
  /** Eine geprüfte Adresse, oder `""`, wenn das Feld geleert wurde. */
  onUrlChange?: (url: string) => void;
  onKindChange?: (kind: MediaKind) => void;
  testId: string;
}

interface UrlFieldProps {
  url: string;
  onUrlChange: (url: string) => void;
  testId: string;
}

/**
 * Das Adressfeld.
 *
 * Es hält die Eingabe selbst und reicht nur weiter, was `parseMediaUrl`
 * annimmt: Zwischenstände beim Tippen — `https:/`, ein Rechnername ohne
 * Punkt — landeten sonst in der Folie und nähmen ihr das Bild, das sie gerade
 * noch hatte. Ändert sich die Adresse von außen (Mediathek), zieht die
 * Eingabe nach.
 */
function UrlField({ url, onUrlChange, testId }: UrlFieldProps): ReactElement {
  const [draft, setDraft] = useState(url);

  useEffect(() => {
    setDraft((current) => (current.trim() === url ? current : url));
  }, [url]);

  const invalid = draft.trim() !== "" && parseMediaUrl(draft) === null;
  const errorId = `${testId}-url-error`;

  return (
    <label className="man-se__sub">
      <span className="man-se__label">Oder Adresse eines Bildes oder Videos</span>
      <input
        type="url"
        className="man-se__input"
        data-testid={`${testId}-url`}
        value={draft}
        placeholder="https://…/bild.jpg oder …/film.mp4"
        aria-invalid={invalid ? true : undefined}
        aria-describedby={invalid ? errorId : undefined}
        onChange={(event) => {
          const text = event.target.value;
          setDraft(text);
          if (text.trim() === "") {
            onUrlChange("");
            return;
          }
          const parsed = parseMediaUrl(text);
          if (parsed !== null) onUrlChange(parsed);
        }}
      />
      {invalid ? (
        <p className="man-se__hint man-se__hint--warning" id={errorId} data-testid={errorId}>
          Wird nicht übernommen: nur vollständige Adressen mit https://.
        </p>
      ) : (
        <p className="man-se__hint">
          Videos (MP4, WebM) laufen stumm in Schleife, solange ihre Folie vorn steht.
        </p>
      )}
    </label>
  );
}

/** Die Vorschau in der Kachel — ein Video zeigt dort sein erstes Bild. */
function Thumb({ image, testId }: { image: SlideImage; testId: string }): ReactElement {
  return isVideo(image) ? (
    <video
      className="man-se__thumb"
      src={firstFrameUrl(image.url)}
      muted
      preload="metadata"
      data-testid={`${testId}-thumb`}
    />
  ) : (
    <img className="man-se__thumb" src={image.url} alt="" data-testid={`${testId}-thumb`} />
  );
}

export function ImageField({
  label,
  hint,
  image,
  onPick,
  onClear,
  onAltChange,
  onUrlChange,
  onKindChange,
  testId,
}: ImageFieldProps): ReactElement {
  const video = image !== undefined && isVideo(image);

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
          <Thumb image={image} testId={testId} />
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

      {onUrlChange !== undefined && (
        <UrlField url={image?.url ?? ""} onUrlChange={onUrlChange} testId={testId} />
      )}

      {image !== undefined && onKindChange !== undefined && (
        <label className="man-se__sub">
          <span className="man-se__label">Art</span>
          {/* Die Endung entscheidet von selbst; von Hand nur dann, wenn eine
              Adresse keine trägt. */}
          <select
            className="man-se__input man-se__select"
            data-testid={`${testId}-kind`}
            value={video ? "video" : "image"}
            onChange={(event) => onKindChange(event.target.value === "video" ? "video" : "image")}
          >
            <option value="image">Bild</option>
            <option value="video">Video</option>
          </select>
        </label>
      )}

      {image !== undefined && onAltChange !== undefined && (
        <label className="man-se__sub">
          <span className="man-se__label">{video ? "Videobeschreibung" : "Bildbeschreibung"}</span>
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
