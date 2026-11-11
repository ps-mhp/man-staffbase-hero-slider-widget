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
import { CtaListForm } from "./cta-list-form";
import { ImageField } from "./image-field";
import { NewsSource } from "./news-source";

/** Welches der beiden Bilder einer Folie der Picker gerade füllt. */
export type SlidePickerTarget = "image" | "imagePortrait";

export interface SlideFormProps {
  slide: SlideItem;
  onPatch: (changes: Partial<SlideItem>) => void;
  onPick: (target: SlidePickerTarget) => void;
  /** Für die Ziele der Schaltflächen: Seiten und Beiträge aus Staffbase. */
  source: NewsSource;
}

export function SlideForm({ slide, onPatch, onPick, source }: SlideFormProps): ReactElement {
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
        pickLabel="Bild oder Video wählen"
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
        pickLabel="Bild oder Video wählen"
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

      <CtaListForm
        ctas={slide.ctas ?? []}
        onChange={(ctas) => onPatch({ ctas })}
        source={source}
      />
    </>
  );
}
