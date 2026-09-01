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
 * Der Redaktionsdialog der Bühne.
 *
 * Die Slides liegen als JSON in einem einzigen Attribut — in einem Textfeld
 * wären sie unbearbeitbar. Dieser Editor tritt an seine Stelle: links die
 * Liste der Slides, rechts die Felder des gewählten.
 *
 * Er schreibt nichts selbst zurück. Das Übergeben an das Formularfeld, die
 * Rückfrage bei ungesicherten Änderungen und das Wiederöffnen erledigt
 * `@shared/config-modal`; hier stehen nur die Felder.
 */

import * as React from "react";
import { ReactElement, useMemo, useState } from "react";
import { useHotStyle } from "@shared/hot-style";
import { MediaClient, createMediaClient } from "@shared/media/media-client";
import { MediaPicker, PickedImage } from "@shared/media/media-picker";
import { Slide, SlideImage, emptySlide, newSlideId } from "./slides-model";
import slideEditorCss from "./styles/slide-editor.scss";

/**
 * Mehr Slides trägt keine Bühne: sie werden nur nacheinander gezeigt, und was
 * hinter dem fünften steht, sieht im Autoplay niemand mehr.
 */
export const MAX_SLIDES = 8;

/** Welches der beiden Bilder eines Slides der Picker gerade füllt. */
type PickerTarget = "image" | "imagePortrait";

export interface SlideEditorProps {
  value: Slide[];
  onChange: (slides: Slide[]) => void;
  onSave: () => void;
  onClose: () => void;
  dirty: boolean;
  /** Vorgabe ist ein Client auf dieselbe Herkunft; für Tests austauschbar. */
  mediaClient?: MediaClient;
}

/** Die Bildkachel samt Wählen, Ersetzen und Entfernen. */
function ImageField({
  label,
  hint,
  image,
  onPick,
  onClear,
  onAltChange,
  testId,
}: {
  label: string;
  hint: string;
  image: SlideImage | undefined;
  onPick: () => void;
  onClear?: () => void;
  onAltChange?: (alt: string) => void;
  testId: string;
}): ReactElement {
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

export function SlideEditor({
  value,
  onChange,
  onSave,
  onClose,
  dirty,
  mediaClient,
}: SlideEditorProps): ReactElement {
  const css = useHotStyle(slideEditorCss, "hero-slider-widget", "styles/slide-editor.scss");
  const client = useMemo(() => mediaClient ?? createMediaClient(), [mediaClient]);

  const [selected, setSelected] = useState(0);
  const [pickerTarget, setPickerTarget] = useState<PickerTarget | null>(null);

  // Nach dem Löschen des letzten Slides zeigt der Index ins Leere. Klemmen
  // statt beim Löschen nachzuführen: so kann kein Pfad ihn ungültig lassen.
  const index = Math.min(selected, Math.max(value.length - 1, 0));
  const slide: Slide | undefined = value[index];

  const patch = (changes: Partial<Slide>): void => {
    if (slide === undefined) return;
    onChange(value.map((entry, i) => (i === index ? { ...entry, ...changes } : entry)));
  };

  const addSlide = (): void => {
    if (value.length >= MAX_SLIDES) return;
    onChange([...value, emptySlide()]);
    setSelected(value.length);
  };

  const duplicateSlide = (): void => {
    if (slide === undefined || value.length >= MAX_SLIDES) return;
    const copy: Slide = { ...slide, id: newSlideId() };
    onChange([...value.slice(0, index + 1), copy, ...value.slice(index + 1)]);
    setSelected(index + 1);
  };

  const removeSlide = (): void => {
    onChange(value.filter((_, i) => i !== index));
    setSelected(Math.max(index - 1, 0));
  };

  /** Verschiebt den gewählten Slide um eine Stelle; am Rand passiert nichts. */
  const move = (delta: number): void => {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    const [moved] = next.splice(index, 1);
    if (moved === undefined) return;
    next.splice(target, 0, moved);
    onChange(next);
    setSelected(target);
  };

  const handlePick = (picked: PickedImage): void => {
    const target = pickerTarget;
    setPickerTarget(null);
    if (slide === undefined || target === null) return;

    const image: SlideImage = { url: picked.url, alt: picked.alt ?? "" };
    if (picked.width !== undefined) image.width = picked.width;
    if (picked.height !== undefined) image.height = picked.height;

    if (target === "image") {
      // Die vorhandene Beschreibung überlebt einen Bildwechsel nicht: sie
      // beschriebe das alte Motiv und wäre damit schlechter als keine.
      patch({ image });
    } else {
      patch({ imagePortrait: image });
    }
  };

  const cta = slide?.cta;

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
      patch({ cta: undefined });
      return;
    }
    patch({
      cta: merged.newTab
        ? { label: merged.label, href: merged.href, newTab: true }
        : { label: merged.label, href: merged.href },
    });
  };

  return (
    <div className="man-se" data-testid="slide-editor">
      <style>{css}</style>

      <div className="man-se__body">
        <div className="man-se__list-pane">
          <div className="man-se__list" role="list" data-testid="slide-list">
            {value.map((entry, position) => (
              <button
                key={entry.id}
                type="button"
                role="listitem"
                className={`man-se__item${position === index ? " man-se__item--active" : ""}`}
                data-testid={`slide-item-${entry.id}`}
                aria-current={position === index}
                onClick={() => setSelected(position)}
              >
                <span className="man-se__item-index">{position + 1}</span>
                {entry.image.url !== "" ? (
                  <img className="man-se__item-thumb" src={entry.image.url} alt="" />
                ) : (
                  <span className="man-se__item-thumb man-se__item-thumb--empty" aria-hidden="true" />
                )}
                <span className="man-se__item-title">
                  {entry.headline.trim() === "" ? "Ohne Überschrift" : entry.headline}
                </span>
              </button>
            ))}

            {value.length === 0 && (
              <p className="man-se__empty">
                Noch keine Folie. Jede Folie braucht mindestens ein Bild.
              </p>
            )}
          </div>

          <div className="man-se__list-actions">
            <button
              type="button"
              className="man-se__button"
              data-testid="slide-add"
              onClick={addSlide}
              disabled={value.length >= MAX_SLIDES}
            >
              Folie hinzufügen
            </button>
            {value.length >= MAX_SLIDES && (
              <p className="man-se__hint">Mehr als {MAX_SLIDES} Folien sieht niemand.</p>
            )}
          </div>
        </div>

        <div className="man-se__form-pane">
          {slide === undefined ? (
            <p className="man-se__empty">Wähle links eine Folie oder lege eine neue an.</p>
          ) : (
            <>
              <div className="man-se__toolbar">
                <button
                  type="button"
                  className="man-se__button"
                  data-testid="slide-up"
                  onClick={() => move(-1)}
                  disabled={index === 0}
                  aria-label="Folie nach vorn"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="man-se__button"
                  data-testid="slide-down"
                  onClick={() => move(1)}
                  disabled={index >= value.length - 1}
                  aria-label="Folie nach hinten"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="man-se__button"
                  data-testid="slide-duplicate"
                  onClick={duplicateSlide}
                  disabled={value.length >= MAX_SLIDES}
                >
                  Duplizieren
                </button>
                <button
                  type="button"
                  className="man-se__button man-se__button--danger"
                  data-testid="slide-remove"
                  onClick={removeSlide}
                >
                  Löschen
                </button>
              </div>

              <ImageField
                label="Bild"
                hint="Quer, mindestens 1920 px breit. Ohne Bild wird die Folie nicht gezeigt."
                image={slide.image.url === "" ? undefined : slide.image}
                onPick={() => setPickerTarget("image")}
                onAltChange={(alt) => patch({ image: { ...slide.image, alt } })}
                testId="slide-image"
              />

              <ImageField
                label="Bild für Hochformat (optional)"
                hint="Wird auf schmalen, stehenden Bildschirmen gezeigt. Ohne dieses Bild wird überall der Querzuschnitt verwendet."
                image={slide.imagePortrait}
                onPick={() => setPickerTarget("imagePortrait")}
                onClear={() => patch({ imagePortrait: undefined })}
                onAltChange={(alt) =>
                  patch({
                    imagePortrait:
                      slide.imagePortrait === undefined
                        ? undefined
                        : { ...slide.imagePortrait, alt },
                  })
                }
                testId="slide-portrait"
              />

              <label className="man-se__field">
                <span className="man-se__label">Überschrift</span>
                <p className="man-se__hint">
                  Wird in Versalien gesetzt. Kurz halten — bis etwa 24 Zeichen bleibt sie einzeilig.
                </p>
                <input
                  type="text"
                  className="man-se__input"
                  data-testid="slide-headline"
                  value={slide.headline}
                  onChange={(event) => patch({ headline: event.target.value })}
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
                    patch({ subline: event.target.value === "" ? undefined : event.target.value })
                  }
                />
              </label>

              <fieldset className="man-se__field man-se__fieldset">
                <legend className="man-se__label">Schaltfläche (optional)</legend>
                <p className="man-se__hint">
                  Erscheint nur, wenn Beschriftung und Ziel ausgefüllt sind.
                </p>

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
          )}
        </div>
      </div>

      <div className="man-se__footer">
        <span className="man-se__footer-note">
          {dirty ? "Ungesicherte Änderungen" : "Keine Änderungen"}
        </span>
        <button
          type="button"
          className="man-se__button"
          data-testid="slide-editor-cancel"
          onClick={onClose}
        >
          Abbrechen
        </button>
        <button
          type="button"
          className="man-se__button man-se__button--primary"
          data-testid="slide-editor-save"
          onClick={onSave}
        >
          Übernehmen
        </button>
      </div>

      {pickerTarget !== null && (
        <MediaPicker
          client={client}
          onSelect={handlePick}
          onClose={() => setPickerTarget(null)}
        />
      )}
    </div>
  );
}
