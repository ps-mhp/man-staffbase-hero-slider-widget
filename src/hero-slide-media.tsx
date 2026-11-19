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
 * Was eine einzelne Folie zeigt: Bühnenbild (Bild, Zuschnitt oder Video) und
 * Text samt Schaltflächen.
 *
 * Aus `hero-slider.tsx` herausgelöst, damit die Vorschau im Studio
 * (`hero-slide-preview.tsx`) dieselbe Folie zeigen kann, ohne die Bühne
 * selbst zu bauen: die verschiebt Brotkrumen und misst Abschnitte der Seite,
 * und das darf im Studio nicht geschehen. Hier steht nur Markup und das
 * Abspielen des Videos – nichts, was über die eigene Folie hinausgreift.
 */

import * as React from "react";
import { ReactElement, useEffect, useRef, useState } from "react";
import { SlideCtas } from "./slide-ctas";
import { SlideAnimationCanvas } from "./slide-animation-canvas";
import { SlideZones } from "./slide-zones";
import { Rgb, WHITE_RGB, prefersDarkInk, visibleBackground } from "./slide-animation-paint";
import { Slide, SlideImage, firstFrameUrl, isAnimation, isVideo } from "./slides-model";

/** Unterhalb dieser Breite zeigt das `<picture>` den Hochkant-Zuschnitt. */
export const PORTRAIT_MEDIA = "(orientation: portrait) and (max-width: 767px)";

/** Ob eine Medienabfrage gerade zutrifft; ohne `matchMedia` nie. */
export function useMediaQuery(query: string): boolean {
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
export function SlideMedia({ slide, eager, play, portrait }: SlideMediaProps): ReactElement {
  const { image, imagePortrait } = slide;
  // Die Animation zeichnet in jeder Größe selbst — kein Hochformat nötig.
  if (isAnimation(image)) return <SlideAnimationCanvas animation={image.animation} play={play} />;
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

/**
 * Die Klassen einer Folie. Eine Animation braucht keinen Verlauf darüber
 * (ihre Textseite ist ruhig). Die Schrift wird anthrazit (`--ink-dark`), wenn
 * das auf dem sichtbaren Grund besser lesbar ist — bei durchscheinendem Grund
 * gemischt aus Grundton und dem, was hinter der Bühne liegt (`backdrop`).
 */
export function slideClassName(slide: Slide, active: boolean, backdrop: Rgb = WHITE_RGB): string {
  const classes = ["man-hero__slide"];
  if (active) classes.push("man-hero__slide--active");
  if (isAnimation(slide.image)) {
    const { theme, opacity } = slide.image.animation;
    classes.push("man-hero__slide--animation");
    if (theme === "light" && opacity >= 1) classes.push("man-hero__slide--light");
    if (opacity < 1) classes.push("man-hero__slide--see-through");
    if (prefersDarkInk(visibleBackground(theme, opacity, backdrop))) classes.push("man-hero__slide--ink-dark");
  }
  return classes.join(" ");
}

/** `rgb(…)`/`rgba(…)` → Kanäle und Deckkraft; sonst nichts. */
function parseCssColor(value: string): { rgb: Rgb; alpha: number } | null {
  const parts = /rgba?\(([^)]+)\)/.exec(value)?.[1]?.split(/[\s,/]+/).filter(Boolean).map(Number);
  if (!parts || parts.length < 3 || parts.some((part) => Number.isNaN(part))) return null;
  return { rgb: [parts[0]!, parts[1]!, parts[2]!], alpha: parts[3] ?? 1 };
}

/**
 * Die Farbe hinter der Bühne: der erste Vorfahr mit eigener Fläche, auch über
 * die Grenze eines Shadow Root hinweg. Ohne einen gilt Weiß (die Seite).
 */
export function backdropOf(element: Element | null): Rgb {
  let node: Element | null = element;
  while (node !== null) {
    const color = parseCssColor(getComputedStyle(node).backgroundColor);
    if (color !== null && color.alpha >= 0.5) return color.rgb;
    const parent: Element | null = node.parentElement;
    node = parent ?? ((node.getRootNode() as ShadowRoot).host ?? null);
  }
  return WHITE_RGB;
}

/** {@link backdropOf} als Zustand: gemessen, sobald es das Element gibt. */
export function useBackdrop(element: HTMLElement | null): Rgb {
  const [backdrop, setBackdrop] = useState<Rgb>(WHITE_RGB);
  useEffect(() => {
    if (element === null) return;
    const next = backdropOf(element.parentElement ?? element);
    setBackdrop((current) => (current.every((value, at) => value === next[at]) ? current : next));
  }, [element]);
  return backdrop;
}

/**
 * Überschrift, Unterzeile und Schaltflächen über dem Bühnenbild — oder bei
 * einer benutzerdefinierten Folie ihre Bausteine in Zonen.
 */
export function SlideText({ slide }: { slide: Slide }): ReactElement {
  if (slide.mode === "custom") return <SlideZones layout={slide.layout} />;
  return (
    <div className="man-hero__inner">
      <div className="man-hero__body">
        {slide.headline !== "" && <h2 className="man-hero__headline">{slide.headline}</h2>}
        {slide.subline !== undefined && <p className="man-hero__subline">{slide.subline}</p>}
        <SlideCtas ctas={slide.ctas} />
      </div>
    </div>
  );
}
