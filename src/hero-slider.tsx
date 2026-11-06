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
import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { useHotStyle } from "@shared/hot-style";
import { useFullBleed } from "./full-bleed";
import { PageTopLayout, usePageTop } from "./page-top";
import { BottomSpacing, useBottomSpacing } from "./bottom-spacing";
import type { HeroPosition } from "./attributes";
import { isEditor } from "./editor-context";
import { Slide, SlideImage, firstFrameUrl, isVideo } from "./slides-model";
import { DEFAULT_AUTOPLAY_DELAY_MS, useSlider } from "./use-slider";
import heroSliderCss from "./styles/hero-slider.scss";

/** Die Höhenstufen aus der Konfiguration; `medium` folgt der CI-Spec 3.9. */
export type HeroHeight = "small" | "medium" | "large" | "viewport" | "section";

export const HERO_HEIGHTS: readonly HeroHeight[] = [
  "small",
  "medium",
  "large",
  "viewport",
  "section",
];

/** Unterhalb dieser Breite zeigt das `<picture>` den Hochkant-Zuschnitt. */
const PORTRAIT_MEDIA = "(orientation: portrait) and (max-width: 767px)";

export interface HeroSliderProps {
  slides: Slide[];
  height?: HeroHeight;
  /** Aus der Inhaltsspalte ausbrechen; Vorgabe an. */
  fullBleed?: boolean;
  /** Millisekunden je Slide; `0` schaltet das Weiterlaufen ab. */
  autoplayDelayMs?: number;
  /** Lage zu den Brotkrumen der Wirtsseite; Vorgabe ist darunter. */
  position?: HeroPosition;
  /** Pfeile und Striche zeigen; Vorgabe an. Wischen und Pfeiltasten bleiben. */
  controls?: boolean;
  /** Blockabstand der Seite unter der Bühne; Vorgabe ist der der Seite. */
  bottomSpacing?: BottomSpacing;
}

/** Ob eine Medienabfrage gerade zutrifft; ohne `matchMedia` nie. */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => globalThis.matchMedia?.(query).matches === true);

  useEffect(() => {
    const list = globalThis.matchMedia?.(query);
    if (!list) return undefined;
    const onChange = (): void => setMatches(list.matches);
    onChange();
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Das `<img>` eines Bühnenbilds samt Ladepriorität. */
function SlideImg({ image, eager }: { image: SlideImage; eager: boolean }): ReactElement {
  return (
    <img
      className="man-hero__image"
      src={image.url}
      alt={image.alt}
      width={image.width}
      height={image.height}
      // Der erste Slide ist das grösste sichtbare Element der Seite und
      // bestimmt damit deren Ladezeit-Messwert; die übrigen liegen darunter
      // und dürfen warten.
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
    />
  );
}

/** Das `<picture>` eines Slides samt Hochkant-Zuschnitt. */
function SlidePicture({ slide, eager }: { slide: Slide; eager: boolean }): ReactElement {
  return (
    <picture>
      {slide.imagePortrait !== undefined && (
        <source media={PORTRAIT_MEDIA} srcSet={slide.imagePortrait.url} />
      )}
      <SlideImg image={slide.image} eager={eager} />
    </picture>
  );
}

interface SlideVideoProps {
  video: SlideImage;
  /** Nur die vordere Folie spielt, und auch die nicht bei weniger Bewegung. */
  play: boolean;
  eager: boolean;
}

/**
 * Ein Video an der Stelle des Bühnenbilds: stumm, in Schleife und ohne
 * Bedienleiste, damit es dort steht wie ein Foto.
 *
 * Kein `autoPlay`: das Attribut liefe auf jeder Folie los, auch auf den
 * verborgenen, und fragte nicht nach weniger Bewegung. Der Effekt startet und
 * hält das Video stattdessen mit der Folie.
 */
function SlideVideo({ video, play, eager }: SlideVideoProps): ReactElement {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (element === null) return;
    // React setzt `muted` nicht als Attribut, und ein Video mit Ton spielt
    // kein Browser ohne Klick ab. Die Eigenschaft ist das, was zählt.
    element.muted = true;
    if (!play) {
      element.pause();
      return;
    }
    // Ein verweigertes Abspielen (Stromsparmodus, Browserregel) ist kein
    // Fehler der Seite: das erste Bild bleibt stehen wie ein Foto. Ältere
    // Browser geben gar kein Promise zurück.
    const started = element.play() as Promise<void> | undefined;
    started?.catch(() => undefined);
  }, [play, video.url]);

  const label = video.alt.trim();

  return (
    <video
      ref={ref}
      className="man-hero__image"
      src={firstFrameUrl(video.url)}
      muted
      loop
      playsInline
      // Ein Bühnenbild hat kein Bild-im-Bild und gehört nicht auf den Fernseher.
      disablePictureInPicture
      disableRemotePlayback
      // Wie beim Bild: der erste Slide darf sofort laden, die übrigen holen
      // nur, was für ihr erstes Bild nötig ist.
      preload={eager ? "auto" : "metadata"}
      // Ein Video hat kein `alt`. Mit Beschreibung tritt es als Bild auf —
      // ohne Rolle lesen Screenreader ein `<video>` ohne Bedienleiste gar
      // nicht vor —, ohne ist es Schmuck und für Hilfsmittel nicht vorhanden.
      role={label === "" ? undefined : "img"}
      aria-label={label === "" ? undefined : label}
      aria-hidden={label === "" ? true : undefined}
    />
  );
}

interface SlideMediaProps {
  slide: Slide;
  eager: boolean;
  play: boolean;
  /** Trifft {@link PORTRAIT_MEDIA} gerade zu? */
  portrait: boolean;
}

/**
 * Das Bühnenbild eines Slides.
 *
 * Reine Bilder bleiben ein `<picture>`, das den Zuschnitt selbst wählt. Ist
 * ein Video beteiligt, geht das nicht: `<picture>` wählt nur zwischen Bildern.
 * Dann fällt die Wahl hier, und es wird nur eins der beiden geladen.
 */
function SlideMedia({ slide, eager, play, portrait }: SlideMediaProps): ReactElement {
  const { image, imagePortrait } = slide;
  if (!isVideo(image) && (imagePortrait === undefined || !isVideo(imagePortrait))) {
    return <SlidePicture slide={slide} eager={eager} />;
  }

  const shown = portrait && imagePortrait !== undefined ? imagePortrait : image;
  return isVideo(shown) ? (
    <SlideVideo video={shown} play={play} eager={eager} />
  ) : (
    <SlideImg image={shown} eager={eager} />
  );
}

export function HeroSlider({
  slides,
  height = "section",
  fullBleed = true,
  autoplayDelayMs = DEFAULT_AUTOPLAY_DELAY_MS,
  position = "post",
  controls = true,
  bottomSpacing = "default",
}: HeroSliderProps): ReactElement | null {
  const hotCss = useHotStyle(heroSliderCss, "hero-slider-widget", "styles/hero-slider.scss");
  // Der Anker bricht selbst nie aus — an ihm wird die ungestörte Kante der
  // Inhaltsspalte gemessen. Läge die Messung an der Bühne, misse sie ihre
  // eigene Verschiebung mit.
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  // Gemessen werden zwei verschiedene Kästen, und das mit Absicht: der Anker
  // für die Breite der Inhaltsspalte, die Bühne für ihre Unterkante. Der
  // Anker enthält auch den Platzhalter für die verschobenen Brotkrumen —
  // hinge `usePageTop` an ihm, läge seine Unterkante um die Höhe des
  // Platzhalters zu tief, und die Brotkrumen rutschten um genau diese Höhe
  // unter die Bühne. Nicht zu einem Ref zusammenfassen.
  const [stage, setStage] = useState<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const { index, playing, goTo, next, previous, setPaused, swipe, reducedMotion } = useSlider({
    count: slides.length,
    delayMs: autoplayDelayMs,
  });

  const { metrics: bleed, filled } = useFullBleed(anchor, fullBleed, height === "section");
  const portrait = useMediaQuery(PORTRAIT_MEDIA);

  const [layout, setLayout] = useState<PageTopLayout>({
    applied: true,
    breadcrumbsHeight: 0,
  });

  // Gemeldet wird nach *jeder* Messung, und gemessen wird in jedem Bild, in
  // dem sich die Seite rührt. Ein neues Objekt je Meldung setzte den Zustand
  // auch dann neu, wenn sich nichts geändert hat — und jedes Neuzeichnen
  // löste die nächste Messung aus. Deshalb wird verglichen, nicht ersetzt.
  const onLayout = useCallback((next: PageTopLayout) => {
    setLayout((current) =>
      current.applied === next.applied && current.breadcrumbsHeight === next.breadcrumbsHeight
        ? current
        : next,
    );
  }, []);

  // Der Beginn der Seite, solange eine Bühne auf ihr liegt: unter den
  // Brotkrumen, wenn es welche gibt, sonst bündig am Menü — und im Modus
  // `pre` umgekehrt, mit den Brotkrumen unter der Bühne (siehe `page-top.ts`).
  //
  // Vor dem ersten Bildaufbau gibt es die Bühne noch nicht. Die Messung läuft
  // dann ohne Kasten und meldet zwangsläufig einen Rückfall — zugehört wird
  // erst, wenn es etwas zu messen gab. Sonst blitzte der Hinweis im Editor
  // bei jedem Aufbau einmal auf, auch dort, wo `pre` anschliessend zustande
  // kommt.
  usePageTop({
    position,
    host: stage,
    outerHost: anchor,
    onLayout: stage === null ? undefined : onLayout,
  });

  // Unter dem äusseren Kasten, weil er bei „vor den Brotkrumen“ auch den
  // Platz für sie trägt: der folgende Block schliesst dann an die Brotkrumen an.
  useBottomSpacing(anchor, bottomSpacing);

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

  // Ohne Bedienelemente ist die Bühne selbst die Station in der
  // Tabreihenfolge: der Fokus kam bisher nur über die Schaltflächen herein.
  const selfFocus = many && !controls;

  // Nur Redakteur:innen können an der Einstellung etwas ändern; auf der
  // fertigen Seite bleibt der Rückfall auf „nach den Brotkrumen“ stumm.
  const showNotice =
    position === "pre" && !layout.applied && anchor !== null && isEditor(anchor);

  // Die Variablen tragen alles, was nur gemessen werden kann. `--man-hero-vw`
  // fehlt bewusst, solange kein Ausbruch zustande kam: dann greift die Klasse
  // `--bleed` gar nicht erst, und die Bühne bleibt in der Spalte statt an
  // beiden Rändern angeschnitten zu werden.
  const vars: React.CSSProperties & Record<string, string> = {} as React.CSSProperties &
    Record<string, string>;
  if (bleed !== null) {
    vars["--man-hero-vw"] = `${bleed.width}px`;
    vars["--man-hero-pull"] = `${bleed.pull}px`;
    vars["--man-hero-inset-start"] = `${-bleed.pull}px`;
    vars["--man-hero-inset-end"] = `${bleed.insetEnd}px`;
    vars["--man-hero-header"] = `${bleed.headerHeight}px`;
  }

  // Der Platz für die verschobenen Brotkrumen — eine einzige Form für beide
  // Fälle, weil sich von aussen nicht entscheiden lässt, welcher gerade gilt.
  // `filled` sagt nur, dass es einen Abschnitt gibt (siehe `full-bleed.ts`),
  // nicht, dass er eine feste Höhe hat.
  //
  // Die Inline-Höhe sitzt deshalb an der Bühne (nicht am Wirtskasten) und der
  // Platzhalter steht immer darunter:
  //
  // * Hat der Elter eine feste Höhe (echtes `--fill`), schrumpft die Bühne um
  //   H, der Platzhalter nimmt H, zusammen füllen sie weiter 100% des
  //   Abschnitts. Ein Platzhalter allein liefe über die vorgegebene
  //   Unterkante hinaus, ein Aussenabstand ebenso: `stretchToSection` zwingt
  //   jedem Vorfahren zwischen Wirtskasten und Abschnitt `height: 100%
  //   !important` auf.
  // * Hat der Elter keine feste Höhe — der gemessene Normalfall, auch mit
  //   Abschnitt —, löst sich die ganze Kette aus `height: 100%` mangels
  //   bestimmter Bezugshöhe zu `auto` auf. Genau das tut dann auch unser
  //   `calc(100% - Hpx)`: ein Prozentanteil gegen eine unbestimmte Bezugshöhe
  //   ist `auto` (CSS 2.1 §10.5). Die Bühne behält ihre Inhaltshöhe, und der
  //   Platzhalter schlägt H auf sie auf. Nicht „vereinfachen": ohne ihn hielte
  //   dieser Fall nichts frei.
  //
  // Die Kette schaukelt sich nicht auf, obwohl die Inline-Höhe jetzt am
  // *gemessenen* Kasten sitzt: `placeBreadcrumbs` (siehe `page-top.ts`) liest
  // die Unterkante der Bühne nur, um das `top` des Brotkrumen-Kastens zu
  // setzen, und meldet zurück dessen *Höhe*. Die hängt nicht davon ab, wohin
  // er geschoben wurde, und damit auch nicht von der Höhe der Bühne. Die neue
  // Bühnenhöhe ist also eine reine Funktion des gemeldeten H und nie ihrer
  // eigenen vorigen Höhe: Durchlauf 2 meldet dasselbe H wie Durchlauf 1,
  // `onLayout` vergleicht beide Felder und setzt den Zustand nicht neu, und
  // Durchlauf 3 ändert nichts mehr. Auch die Nachkorrektur in
  // `placeBreadcrumbs` misst nur die Oberkante des aus dem Fluss genommenen
  // Kastens nach; sie rührt die Bühne nicht an. `measurePageTop("pre")` rechnet
  // mit den festen Leisten, `canPlacePreBreadcrumbs` mit der *Ober*kante der
  // Bühne — beide sehen die Verkürzung nach unten gar nicht.
  const crumbSpace = layout.breadcrumbsHeight;
  if (crumbSpace > 0) vars.height = `calc(100% - ${crumbSpace}px)`;

  return (
    // Der äussere Kasten bleibt immer in der Inhaltsspalte; nur der innere
    // bricht aus. Ohne diese Trennung gäbe es keinen festen Punkt, an dem sich
    // die Kante der Spalte messen liesse.
    <div
      className={`man-hero-host${filled ? " man-hero-host--fill" : ""}`}
      ref={setAnchor}
    >
      {showNotice && (
        <p className="man-hero__notice" role="status" data-testid="hero-position-notice">
          Lage „vor den Brotkrumen“ ist hier nicht anwendbar; die Bühne steht unter den
          Brotkrumen.
        </p>
      )}
      <div
        className={[
          "man-hero",
          `man-hero--height-${height}`,
          filled ? "man-hero--filled" : "",
          many ? "man-hero--many" : "",
          bleed !== null ? "man-hero--bleed" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={vars}
        ref={setStage}
        data-testid="hero-slider"
        aria-roledescription={many ? "carousel" : undefined}
        tabIndex={selfFocus ? 0 : undefined}
        role={selfFocus ? "group" : undefined}
        aria-label={
          selfFocus ? `Bühne, ${slides.length} Folien — mit den Pfeiltasten blättern` : undefined
        }
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
          {slides.map((slide, at) => {
            const active = at === index;
            return (
              <div
                key={slide.id}
                className={`man-hero__slide${active ? " man-hero__slide--active" : ""}`}
                data-testid={`hero-slide-${slide.id}`}
                // Ohne Tabliste wäre ein `tabpanel` verwaist; dann ist die
                // Folie eine Gruppe wie jede andere.
                role={many ? (controls ? "tabpanel" : "group") : undefined}
                id={many ? `hero-slide-${slide.id}` : undefined}
                aria-roledescription={many ? "Folie" : undefined}
                aria-label={many ? `Folie ${at + 1} von ${slides.length}` : undefined}
                // Verborgene Slides sind für Hilfsmittel nicht vorhanden und
                // liegen nicht in der Tabreihenfolge — sonst führte die
                // Tabulatortaste in unsichtbare Schaltflächen.
                aria-hidden={active ? undefined : true}
                inert={active ? undefined : true}
              >
                <div className="man-hero__media">
                  <SlideMedia
                    slide={slide}
                    eager={at === 0}
                    play={active && !reducedMotion}
                    portrait={portrait}
                  />
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
                        {/* Eigenes Element, damit die Beschriftung schmal
                            verborgen werden kann, ohne den Link selbst zu
                            verbergen: dort deckt er die ganze Folie ab und
                            macht sie zum Ziel, seinen Namen braucht er
                            trotzdem weiter (siehe `hero-slider.scss`). */}
                        <span className="man-hero__cta-label">{slide.cta.label}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {many && controls && (
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
                {slides.map((slide, at) => (
                  <button
                    key={slide.id}
                    type="button"
                    className={`man-hero__dot${at === index ? " man-hero__dot--active" : ""}`}
                    data-testid={`hero-dot-${slide.id}`}
                    role="tab"
                    aria-selected={at === index}
                    aria-controls={`hero-slide-${slide.id}`}
                    aria-label={`Folie ${at + 1} von ${slides.length}`}
                    onClick={() => goTo(at)}
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

      {crumbSpace > 0 && (
        // Die Brotkrumen liegen aus dem Fluss: verschoben überdecken sie den
        // Inhalt unter der Bühne, statt ihn zu schieben. Dieser Platzhalter
        // ist der Platz, den sie sich nicht selbst nehmen können.
        //
        // Immer, nicht nur ohne Abschnittshöhe: zusammen mit der Inline-Höhe
        // der Bühne trägt er beide Fälle (siehe `crumbSpace` oben).
        <div
          className="man-hero__crumb-space"
          style={{ height: `${crumbSpace}px` }}
          aria-hidden
        />
      )}
    </div>
  );
}
