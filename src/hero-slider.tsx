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
 * Die Leseansicht der Bühne.
 *
 * Sie bekommt fertige Slides und Einstellungen und rendert daraus das Markup
 * samt eigenem Stylesheet. Alles, was mit dem Wählen von Bildern oder dem
 * Konfigurationsdialog zu tun hat, liegt bewusst woanders: diese Komponente
 * ist das, was Leser:innen der Seite sehen, und soll nichts davon mitschleppen.
 */

import * as React from "react";
import { ReactElement, useCallback, useRef, useState } from "react";
import { useHotStyle } from "@shared/hot-style";
import { useFullBleed } from "./full-bleed";
import { Slide } from "./slides-model";
import { DEFAULT_AUTOPLAY_DELAY_MS, useSlider } from "./use-slider";
import heroSliderCss from "./styles/hero-slider.scss";

/** Die Höhenstufen aus der Konfiguration; `medium` folgt der CI-Spec 3.9. */
export type HeroHeight = "small" | "medium" | "large" | "viewport";

export const HERO_HEIGHTS: readonly HeroHeight[] = ["small", "medium", "large", "viewport"];

/** Unterhalb dieser Breite zeigt das `<picture>` den Hochkant-Zuschnitt. */
const PORTRAIT_MEDIA = "(orientation: portrait) and (max-width: 767px)";

export interface HeroSliderProps {
  slides: Slide[];
  height?: HeroHeight;
  /** Aus der Inhaltsspalte ausbrechen; Vorgabe an. */
  fullBleed?: boolean;
  /** Millisekunden je Slide; `0` schaltet das Weiterlaufen ab. */
  autoplayDelayMs?: number;
}

/** Das `<picture>` eines Slides samt Hochkant-Zuschnitt und Ladepriorität. */
function SlideImage({ slide, eager }: { slide: Slide; eager: boolean }): ReactElement {
  return (
    <picture>
      {slide.imagePortrait !== undefined && (
        <source media={PORTRAIT_MEDIA} srcSet={slide.imagePortrait.url} />
      )}
      <img
        className="man-hero__image"
        src={slide.image.url}
        alt={slide.image.alt}
        width={slide.image.width}
        height={slide.image.height}
        // Der erste Slide ist das grösste sichtbare Element der Seite und
        // bestimmt damit deren Ladezeit-Messwert; die übrigen liegen darunter
        // und dürfen warten.
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
      />
    </picture>
  );
}

export function HeroSlider({
  slides,
  height = "medium",
  fullBleed = true,
  autoplayDelayMs = DEFAULT_AUTOPLAY_DELAY_MS,
}: HeroSliderProps): ReactElement | null {
  const hotCss = useHotStyle(heroSliderCss, "hero-slider-widget", "styles/hero-slider.scss");
  // Der Anker bricht selbst nie aus — an ihm wird die ungestörte Kante der
  // Inhaltsspalte gemessen. Läge die Messung an der Bühne, misse sie ihre
  // eigene Verschiebung mit.
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const { index, playing, goTo, next, previous, setPaused, swipe } = useSlider({
    count: slides.length,
    delayMs: autoplayDelayMs,
  });

  const bleed = useFullBleed(anchor, fullBleed);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (slides.length < 2) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        previous();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
      }
    },
    [slides.length, next, previous],
  );

  // Ohne Slides gibt es nichts zu zeigen. Ein Platzhalter wäre hier falsch:
  // Leser:innen können nichts daran ändern, und ein leerer dunkler Block
  // mitten auf der Seite sieht aus wie ein Fehler der Seite.
  if (slides.length === 0) return null;

  const many = slides.length > 1;

  // Die Variablen tragen alles, was nur gemessen werden kann. `--man-hero-vw`
  // fehlt bewusst, solange kein Ausbruch zustande kam: dann greift die Klasse
  // `--bleed` gar nicht erst, und die Bühne bleibt in der Spalte statt an
  // beiden Rändern angeschnitten zu werden.
  const vars: React.CSSProperties & Record<string, string> = {} as React.CSSProperties &
    Record<string, string>;
  if (bleed !== null) {
    vars["--man-hero-vw"] = `${bleed.width}px`;
    vars["--man-hero-pull"] = `${bleed.pull}px`;
    vars["--man-hero-header"] = `${bleed.headerHeight}px`;
  }

  return (
    // Der äussere Kasten bleibt immer in der Inhaltsspalte; nur der innere
    // bricht aus. Ohne diese Trennung gäbe es keinen festen Punkt, an dem sich
    // die Kante der Spalte messen liesse.
    <div className="man-hero-host" ref={setAnchor}>
      <div
        className={[
          "man-hero",
          `man-hero--height-${height}`,
          many ? "man-hero--many" : "",
          bleed !== null ? "man-hero--bleed" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={vars}
        data-testid="hero-slider"
        aria-roledescription={many ? "carousel" : undefined}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onKeyDown={onKeyDown}
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          const start = touchStartX.current;
          touchStartX.current = null;
          if (start === null) return;
          const end = event.changedTouches[0]?.clientX;
          if (end !== undefined) swipe(end - start);
        }}
      >
      {/* Das Stylesheet kommt und geht mit der Komponente: die Bundles werden
          in fremde Seiten eingebettet und sollen dort nichts zurücklassen. */}
      <style>{hotCss}</style>

      <div className="man-hero__frame">
        <div className="man-hero__slides">
          {slides.map((slide, position) => {
            const active = position === index;
            return (
              <div
                key={slide.id}
                className={`man-hero__slide${active ? " man-hero__slide--active" : ""}`}
                data-testid={`hero-slide-${slide.id}`}
                role={many ? "tabpanel" : undefined}
                id={many ? `hero-slide-${slide.id}` : undefined}
                aria-roledescription={many ? "Folie" : undefined}
                aria-label={many ? `Folie ${position + 1} von ${slides.length}` : undefined}
                // Verborgene Slides sind für Hilfsmittel nicht vorhanden und
                // liegen nicht in der Tabreihenfolge — sonst führte die
                // Tabulatortaste in unsichtbare Schaltflächen.
                aria-hidden={active ? undefined : true}
                inert={active ? undefined : true}
              >
                <div className="man-hero__media">
                  <SlideImage slide={slide} eager={position === 0} />
                </div>

                <div className="man-hero__inner">
                  <div className="man-hero__body">
                    {slide.headline !== "" && (
                      <h2 className="man-hero__headline">{slide.headline}</h2>
                    )}
                    {slide.subline !== undefined && (
                      <p className="man-hero__subline">{slide.subline}</p>
                    )}
                    {slide.cta !== undefined && (
                      <a
                        className="man-hero__cta"
                        href={slide.cta.href}
                        target={slide.cta.newTab === true ? "_blank" : undefined}
                        // `noopener` gegen den Zugriff der Zielseite auf
                        // `window.opener`; `noreferrer` folgt der Hausordnung
                        // für externe Ziele.
                        rel={slide.cta.newTab === true ? "noopener noreferrer" : undefined}
                      >
                        {slide.cta.label}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {many && (
          <div className="man-hero__inner">
            <div className="man-hero__controls" role="tablist" aria-label="Folien der Bühne">
              <button
                type="button"
                className="man-hero__arrow man-hero__arrow--prev"
                data-testid="hero-prev"
                aria-label="Vorige Folie"
                onClick={previous}
              />

              <div className="man-hero__dots">
                {slides.map((slide, position) => (
                  <button
                    key={slide.id}
                    type="button"
                    className={`man-hero__dot${position === index ? " man-hero__dot--active" : ""}`}
                    data-testid={`hero-dot-${slide.id}`}
                    role="tab"
                    aria-selected={position === index}
                    aria-controls={`hero-slide-${slide.id}`}
                    aria-label={`Folie ${position + 1} von ${slides.length}`}
                    onClick={() => goTo(position)}
                  />
                ))}
              </div>

              <button
                type="button"
                className="man-hero__arrow man-hero__arrow--next"
                data-testid="hero-next"
                aria-label="Nächste Folie"
                onClick={next}
              />
            </div>
          </div>
        )}
      </div>

      {many && (
        // Die Ansage, welche Folie vorn liegt. Läuft die Bühne von selbst,
        // bleibt sie stumm: eine Meldung alle fünf Sekunden, die niemand
        // ausgelöst hat, wäre für Screenreader-Nutzer:innen eine Störung
        // ohne Anlass — so sieht es auch das APG-Karussellmuster vor.
        <div className="man-hero__live" aria-live="polite" data-testid="hero-live">
          {playing ? "" : `Folie ${index + 1} von ${slides.length}`}
        </div>
      )}
      </div>
    </div>
  );
}
