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
 * Die Einträge liegen als JSON in einem einzigen Attribut — in einem Textfeld
 * wären sie unbearbeitbar. Dieser Editor tritt an seine Stelle: links die
 * Liste der Einträge, rechts die Felder des gewählten.
 *
 * Ein Eintrag ist entweder eine handgepflegte Folie oder ein Verweis auf die
 * News: ein einzelner Beitrag oder ein ganzer Kanal. Die Liste links behandelt
 * alle drei gleich — Reihenfolge, Duplizieren und Löschen gehören zum Eintrag,
 * nicht zu seiner Sorte. Nur die rechte Spalte wechselt.
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
import {
  HeroItem,
  NewsChannelItem,
  NewsPostItem,
  SlideItem,
  emptyNewsChannelItem,
  emptyNewsPostItem,
  isNewsChannelItem,
  isNewsPostItem,
  isSlideItem,
} from "./hero-items";
import { useItemLabels } from "./editors/item-label";
import { NewsChannelForm } from "./editors/news-channel-form";
import { NewsPostForm } from "./editors/news-post-form";
import { NewsSource, cacheNewsSource, defaultNewsSource } from "./editors/news-source";
import { SlideForm } from "./editors/slide-form";
import { SlideImage, emptySlide, newSlideId } from "./slides-model";
import slideEditorCss from "./styles/slide-editor.scss";

/**
 * Mehr Einträge trägt keine Bühne: sie werden nur nacheinander gezeigt, und
 * was hinter dem fünften steht, sieht im Autoplay niemand mehr. Ein
 * Kanaleintrag zählt hier als einer — wie viele Folien er tatsächlich
 * beisteuert, entscheidet erst `resolve-hero-items`, das dieselbe Acht ein
 * zweites Mal durchsetzt.
 */
export const MAX_ITEMS = 8;

/** Welches Bild eines Eintrags der Picker gerade füllt. */
type PickerTarget = "image" | "imagePortrait" | "imageOverride";

export interface SlideEditorProps {
  value: HeroItem[];
  onChange: (items: HeroItem[]) => void;
  onSave: () => void;
  onClose: () => void;
  dirty: boolean;
  /** Vorgabe ist ein Client auf dieselbe Herkunft; für Tests austauschbar. */
  mediaClient?: MediaClient;
  /** Vorgabe sind die echten News-Endpunkte; für Tests austauschbar. */
  newsSource?: NewsSource;
}

export function SlideEditor({
  value,
  onChange,
  onSave,
  onClose,
  dirty,
  mediaClient,
  newsSource,
}: SlideEditorProps): ReactElement {
  const css = useHotStyle(slideEditorCss, "hero-slider-widget", "styles/slide-editor.scss");
  const client = useMemo(() => mediaClient ?? createMediaClient(), [mediaClient]);
  const source = useMemo(() => cacheNewsSource(newsSource ?? defaultNewsSource), [newsSource]);

  const [selected, setSelected] = useState(0);
  const [pickerTarget, setPickerTarget] = useState<PickerTarget | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Nach dem Löschen des letzten Eintrags zeigt der Index ins Leere. Klemmen
  // statt beim Löschen nachzuführen: so kann kein Pfad ihn ungültig lassen.
  const index = Math.min(selected, Math.max(value.length - 1, 0));
  const item: HeroItem | undefined = value[index];
  const labels = useItemLabels(value, source);
  const full = value.length >= MAX_ITEMS;

  const patch = (changes: Partial<HeroItem>): void => {
    if (item === undefined) return;
    onChange(value.map((entry, i) => (i === index ? ({ ...entry, ...changes } as HeroItem) : entry)));
  };

  const add = (fresh: HeroItem): void => {
    setMenuOpen(false);
    if (full) return;
    onChange([...value, fresh]);
    setSelected(value.length);
  };

  const duplicate = (): void => {
    if (item === undefined || full) return;
    // Eine neue Kennung, keine geerbte: zwei Einträge mit derselben wären als
    // React-Schlüssel und beim Auflösen der Folien nicht zu unterscheiden.
    const copy = { ...item, id: newSlideId() } as HeroItem;
    onChange([...value.slice(0, index + 1), copy, ...value.slice(index + 1)]);
    setSelected(index + 1);
  };

  const remove = (): void => {
    onChange(value.filter((_, i) => i !== index));
    setSelected(Math.max(index - 1, 0));
  };

  /** Verschiebt den gewählten Eintrag um eine Stelle; am Rand passiert nichts. */
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
    if (item === undefined || target === null) return;

    const image: SlideImage = { url: picked.url, alt: picked.alt ?? "" };
    if (picked.width !== undefined) image.width = picked.width;
    if (picked.height !== undefined) image.height = picked.height;

    // Die vorhandene Beschreibung überlebt einen Bildwechsel nicht: sie
    // beschriebe das alte Motiv und wäre damit schlechter als keine.
    if (target === "image") patch({ image } as Partial<SlideItem>);
    else if (target === "imageOverride") patch({ imageOverride: image } as Partial<NewsPostItem>);
    else patch({ imagePortrait: image } as Partial<SlideItem>);
  };

  return (
    <div className="man-se" data-testid="slide-editor">
      <style>{css}</style>

      <div className="man-se__body">
        <div className="man-se__list-pane">
          <div className="man-se__list-head">
            {/* Der Blur des ganzen Blocks schließt das Menü: ein Klick daneben
                nimmt ihm den Fokus. Ein Lauscher am Dokument wäre die zweite
                Stelle, an der aufgeräumt werden muss. */}
            <div
              className="man-se__menu"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setMenuOpen(false);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") setMenuOpen(false);
              }}
            >
              <button
                type="button"
                className="man-se__button man-se__button--primary"
                data-testid="item-add"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                disabled={full}
                onClick={() => setMenuOpen((open) => !open)}
              >
                Neu<span className="man-se__add-plus" aria-hidden="true">+</span>
              </button>

              {menuOpen && (
                <div className="man-se__menu-list" role="menu" data-testid="item-add-menu">
                  <button
                    type="button"
                    role="menuitem"
                    className="man-se__menu-item"
                    data-testid="slide-add"
                    onClick={() => add(emptySlide())}
                  >
                    Folie
                    <span className="man-se__menu-note">Bild und Text selbst pflegen</span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="man-se__menu-item"
                    data-testid="news-post-add"
                    onClick={() => add(emptyNewsPostItem())}
                  >
                    News-Beitrag
                    <span className="man-se__menu-note">Ein bestimmter Beitrag</span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="man-se__menu-item"
                    data-testid="news-channel-add"
                    onClick={() => add(emptyNewsChannelItem())}
                  >
                    News-Kanal
                    <span className="man-se__menu-note">Eine Folie je Beitrag</span>
                  </button>
                </div>
              )}
            </div>

            {full && <p className="man-se__hint">Mehr als {MAX_ITEMS} Einträge sieht niemand.</p>}
          </div>

          <div className="man-se__list" role="list" data-testid="slide-list">
            {value.map((entry, position) => {
              const label = labels[position];
              return (
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
                  {label?.thumbUrl !== undefined ? (
                    <img className="man-se__item-thumb" src={label.thumbUrl} alt="" />
                  ) : (
                    <span
                      className="man-se__item-thumb man-se__item-thumb--empty"
                      aria-hidden="true"
                    />
                  )}
                  <span className="man-se__item-text">
                    <span className="man-se__item-kind">{label?.kind ?? "Eintrag"}</span>
                    <span className="man-se__item-title">{label?.title ?? ""}</span>
                  </span>
                </button>
              );
            })}

            {value.length === 0 && (
              <p className="man-se__empty">
                Noch kein Eintrag. Lege über <strong>Neu</strong> eine eigene Folie an oder hole
                einen Beitrag aus den News.
              </p>
            )}
          </div>
        </div>

        <div className="man-se__form-pane">
          {item === undefined ? (
            <p className="man-se__empty">Wähle links einen Eintrag oder lege einen neuen an.</p>
          ) : (
            <div className="man-se__form">
              <div className="man-se__toolbar">
                <button
                  type="button"
                  className="man-se__button"
                  data-testid="slide-up"
                  onClick={() => move(-1)}
                  disabled={index === 0}
                  aria-label="Eintrag nach vorn"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="man-se__button"
                  data-testid="slide-down"
                  onClick={() => move(1)}
                  disabled={index >= value.length - 1}
                  aria-label="Eintrag nach hinten"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="man-se__button"
                  data-testid="slide-duplicate"
                  onClick={duplicate}
                  disabled={full}
                >
                  Duplizieren
                </button>
                <button
                  type="button"
                  className="man-se__button man-se__button--danger"
                  data-testid="slide-remove"
                  onClick={remove}
                >
                  Löschen
                </button>
              </div>

              {isSlideItem(item) && (
                <SlideForm
                  slide={item}
                  onPatch={(changes: Partial<SlideItem>) => patch(changes)}
                  onPick={(target) => setPickerTarget(target)}
                />
              )}

              {isNewsPostItem(item) && (
                <NewsPostForm
                  item={item}
                  onPatch={(changes: Partial<NewsPostItem>) => patch(changes)}
                  onPick={(target) => setPickerTarget(target)}
                  source={source}
                />
              )}

              {isNewsChannelItem(item) && (
                <NewsChannelForm
                  item={item}
                  onPatch={(changes: Partial<NewsChannelItem>) => patch(changes)}
                  source={source}
                />
              )}
            </div>
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
        <MediaPicker client={client} onSelect={handlePick} onClose={() => setPickerTarget(null)} />
      )}
    </div>
  );
}
