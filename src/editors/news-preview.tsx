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
 * Was ein News-Eintrag auf der Bühne ergeben wird.
 *
 * Die Vorschau läuft über denselben Auflöser wie die Leseansicht — eine
 * zweite Umrechnung wäre eine zweite Wahrheit, und genau die Abweichung
 * zwischen Vorschau und Ergebnis wäre der Fehler, den niemand findet.
 */

import * as React from "react";
import { ReactElement, useEffect, useState } from "react";

import { HeroItem } from "../hero-items";
import { resolveHeroItems } from "../resolve-hero-items";
import { Slide } from "../slides-model";
import { NewsSource } from "./news-source";

export interface NewsPreviewProps {
  item: HeroItem;
  source: NewsSource;
  /** Steht statt der Vorschau da, solange nichts ausgewählt ist. */
  emptyHint: string;
  ready: boolean;
}

export function NewsPreview({ item, source, emptyHint, ready }: NewsPreviewProps): ReactElement {
  const [slides, setSlides] = useState<Slide[] | null>(null);

  // Der Eintrag selbst ist bei jedem Tastendruck ein neues Objekt; seine
  // serialisierte Form ändert sich nur, wenn wirklich etwas anders ist.
  const key = JSON.stringify(item);

  useEffect(() => {
    if (!ready) {
      setSlides(null);
      return undefined;
    }

    let cancelled = false;
    setSlides(null);

    void (async () => {
      const locales = await source.locales();
      const resolved = await resolveHeroItems([JSON.parse(key) as HeroItem], {
        fetchPost: source.post,
        fetchChannelPosts: source.posts,
        locales,
      });
      if (!cancelled) setSlides(resolved);
    })();

    return () => {
      cancelled = true;
    };
  }, [key, ready, source]);

  return (
    <div className="man-se__field" data-testid="news-preview">
      <span className="man-se__label">Vorschau</span>

      {!ready && <p className="man-se__hint">{emptyHint}</p>}
      {ready && slides === null && <p className="man-se__hint">Wird geladen …</p>}
      {ready && slides !== null && slides.length === 0 && (
        <p className="man-se__hint">
          Dazu gibt es nichts zu zeigen. Prüfe die Filter — Beiträge ohne Bild werden
          standardmäßig übersprungen.
        </p>
      )}

      {slides !== null && slides.length > 0 && (
        <ul className="man-se__preview">
          {slides.map((slide) => (
            <li className="man-se__preview-item" key={slide.id} data-testid={`news-preview-${slide.id}`}>
              {slide.image.url !== "" ? (
                <img className="man-se__preview-thumb" src={slide.image.url} alt="" />
              ) : (
                <span className="man-se__preview-thumb man-se__preview-thumb--empty" aria-hidden="true" />
              )}
              <span className="man-se__preview-text">
                <span className="man-se__preview-title">
                  {slide.headline.trim() === "" ? "Ohne Titel" : slide.headline}
                </span>
                {slide.subline !== undefined && (
                  <span className="man-se__preview-teaser">{slide.subline}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
