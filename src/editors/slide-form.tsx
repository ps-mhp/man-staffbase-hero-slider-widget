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
 * Die Felder einer handgepflegten Folie.
 *
 * Aus `slide-editor.tsx` herausgelöst, als die beiden News-Formulare
 * dazukamen: drei Formulare in einer Datei wären das Doppelte an Zeilen und
 * keine davon mehr auffindbar.
 */

import * as React from "react";
import { ReactElement } from "react";

import { SlideItem } from "../hero-items";
import { mediaFromUrl, withMediaKind } from "../slides-model";
import { ImageField } from "./image-field";

/** Welches der beiden Bilder einer Folie der Picker gerade füllt. */
export type SlidePickerTarget = "image" | "imagePortrait";

export interface SlideFormProps {
  slide: SlideItem;
  onPatch: (changes: Partial<SlideItem>) => void;
  onPick: (target: SlidePickerTarget) => void;
}

export function SlideForm({ slide, onPatch, onPick }: SlideFormProps): ReactElement {
  const cta = slide.cta;

  /**
   * Setzt ein Feld der Schaltfläche. Beide Werte müssen erhalten bleiben,
   * solange der Dialog offen ist — sonst verschwände die halb ausgefüllte
   * Schaltfläche unter den Händen, weil das Modell sie verwirft.
   */
  const patchCta = (changes: { label?: string; href?: string; newTab?: boolean }): void => {
    const merged = {
      label: changes.label ?? cta?.label ?? "",
      href: changes.href ?? cta?.href ?? "",
      newTab: changes.newTab ?? cta?.newTab ?? false,
    };
    if (merged.label === "" && merged.href === "") {
      onPatch({ cta: undefined });
      return;
    }
    onPatch({
      cta: merged.newTab
        ? { label: merged.label, href: merged.href, newTab: true }
        : { label: merged.label, href: merged.href },
    });
  };

  // Das Hauptbild ist nie `undefined` — eine leere Folie trägt `url: ""`.
  // Für die Kachel und das Adressfeld heißt das dasselbe: noch kein Medium.
  const image = slide.image.url === "" ? undefined : slide.image;
  const portrait = slide.imagePortrait;

  return (
    <>
      <ImageField
        label="Bild oder Video"
        hint="Quer, mindestens 1920 px breit. Ohne Bild oder Video wird die Folie nicht gezeigt."
        image={image}
        onPick={() => onPick("image")}
        onAltChange={(alt) => onPatch({ image: { ...slide.image, alt } })}
        onUrlChange={(url) =>
          onPatch({ image: url === "" ? { url: "", alt: "" } : mediaFromUrl(image, url) })
        }
        onKindChange={(kind) => onPatch({ image: withMediaKind(slide.image, kind) })}
        testId="slide-image"
      />

      <ImageField
        label="Bild oder Video für Hochformat (optional)"
        hint="Wird auf schmalen, stehenden Bildschirmen gezeigt. Ohne wird überall der Querzuschnitt verwendet."
        image={portrait}
        onPick={() => onPick("imagePortrait")}
        onClear={() => onPatch({ imagePortrait: undefined })}
        onAltChange={(alt) =>
          onPatch({ imagePortrait: portrait === undefined ? undefined : { ...portrait, alt } })
        }
        onUrlChange={(url) =>
          onPatch({ imagePortrait: url === "" ? undefined : mediaFromUrl(portrait, url) })
        }
        onKindChange={(kind) =>
          onPatch({
            imagePortrait: portrait === undefined ? undefined : withMediaKind(portrait, kind),
          })
        }
        testId="slide-portrait"
      />

      <label className="man-se__field">
        <span className="man-se__label">Überschrift</span>
        <p className="man-se__hint">
          Kurz halten — bis etwa 24 Zeichen bleibt sie einzeilig.
        </p>
        <input
          type="text"
          className="man-se__input"
          data-testid="slide-headline"
          value={slide.headline}
          onChange={(event) => onPatch({ headline: event.target.value })}
        />
      </label>

      <label className="man-se__field">
        <span className="man-se__label">Unterzeile (optional)</span>
        <textarea
          className="man-se__input man-se__input--area"
          data-testid="slide-subline"
          rows={2}
          value={slide.subline ?? ""}
          onChange={(event) =>
            onPatch({ subline: event.target.value === "" ? undefined : event.target.value })
          }
        />
      </label>

      <fieldset className="man-se__field man-se__fieldset">
        <legend className="man-se__label">Schaltfläche (optional)</legend>
        <p className="man-se__hint">Erscheint nur, wenn Beschriftung und Ziel ausgefüllt sind.</p>

        <input
          type="text"
          className="man-se__input"
          data-testid="slide-cta-label"
          value={cta?.label ?? ""}
          onChange={(event) => patchCta({ label: event.target.value })}
          placeholder="Beschriftung"
          aria-label="Beschriftung der Schaltfläche"
        />
        <input
          type="url"
          className="man-se__input"
          data-testid="slide-cta-href"
          value={cta?.href ?? ""}
          onChange={(event) => patchCta({ href: event.target.value })}
          placeholder="https://…"
          aria-label="Ziel der Schaltfläche"
        />
        <label className="man-se__check">
          <input
            type="checkbox"
            data-testid="slide-cta-newtab"
            checked={cta?.newTab === true}
            onChange={(event) => patchCta({ newTab: event.target.checked })}
          />
          In neuem Tab öffnen
        </label>
      </fieldset>
    </>
  );
}
