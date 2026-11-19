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
 * Die Vorschau des gewählten Eintrags im Gerätrahmen des Studios.
 *
 * Eine Folie erscheint mit dem Markup und Stylesheet der echten Bühne, aber
 * ohne `HeroSlider`: der verschiebt die Brotkrumen der Seite, bricht aus der
 * Inhaltsspalte aus und misst Abschnitte. Im Studio läge darunter die echte
 * Seite, und die Vorschau verböge sie. Hier steht nur die Folie – kein
 * Autoplay, keine Bedienleiste, kein Messen.
 *
 * News-Einträge werden erst über den Auflöser der Leseansicht zu Folien
 * (`useResolvedSlides`); ein Kanal zeigt alle seine Folien untereinander.
 * Ohne News-Quelle (etwa im Test) bleibt ein ruhiger Platzhalter.
 */

import * as React from "react";
import { ReactElement } from "react";
import { Newspaper } from "lucide-react";
import { useConfigShell } from "@man/config-ui/shell/shell-context";
import { useHotStyle } from "@shared/hot-style";

import { entryKindName } from "./editor-entries";
import { NewsSource } from "./editors/news-source";
import { useResolvedSlides } from "./editors/use-resolved-slides";
import { SlideMedia, SlideText, slideClassName, useMediaQuery } from "./hero-slide-media";
import { HeroItem, isNewsPostItem, isSlideItem } from "./hero-items";
import { Slide, hasMedium, isAnimation } from "./slides-model";
import heroSliderCss from "./styles/hero-slider.scss";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** Gleiche Fläche für Folie, Platzhalter und Leere, damit die Vorschau beim Wechsel nicht springt. */
const STAGE_BOX = "flex aspect-[21/9] min-h-[320px] flex-col items-center justify-center gap-2 p-6 text-center";

/** Das Stylesheet der Bühne – einmal je Vorschau, nicht je Folie. */
function HeroStageStyle(): ReactElement {
  const css = useHotStyle(heroSliderCss, "hero-slider-widget", "styles/hero-slider.scss");
  return <style>{css}</style>;
}

/**
 * Die Folie, wie das gewählte Gerät sie zeigte. Die Bühne wählt den
 * Hochkant-Zuschnitt per Medienabfrage – die fragt aber das Fenster des
 * Studios, nicht den Gerätrahmen. Hier entscheidet deshalb die Ansicht.
 */
function forDevice(slide: Slide, mobile: boolean): Slide {
  const { imagePortrait, ...rest } = slide;
  // Eine Animation passt sich selbst an — ein Hochformat-Medium gibt es dafür nicht.
  if (isAnimation(slide.image)) return rest;
  return mobile && imagePortrait !== undefined ? { ...rest, image: imagePortrait } : rest;
}

/** Eine Folie im Markup der Bühne. Braucht {@link HeroStageStyle} darüber. */
function SlideStage({ slide }: { slide: Slide }): ReactElement {
  const { view } = useConfigShell();
  const reducedMotion = useMediaQuery(REDUCED_MOTION);
  const shown = forDevice(slide, view === "mobile");
  const hasImage = hasMedium(shown.image);

  return (
    // `inert`: Eine Schaltfläche der Vorschau führte sonst aus dem Studio
    // hinaus, und Tab wanderte durch Links, die hier nichts bedeuten.
    <div inert>
      <div className="man-hero man-hero--height-medium" data-testid="hero-slide-preview">
        <div className="man-hero__frame">
          <div className="man-hero__slides">
            <div className={slideClassName(shown, true)}>
              <div className="man-hero__media">
                {hasImage && <SlideMedia slide={shown} eager play={!reducedMotion} portrait={false} />}
              </div>
              <SlideText slide={shown} />
            </div>
          </div>
          {!hasImage && (
            <p className="absolute inset-x-0 top-4 text-center text-sm text-white/80">
              Ohne Bild wird diese Folie nicht gezeigt.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function NewsPlaceholder({ item, text }: { item: HeroItem; text: string }): ReactElement {
  return (
    <div data-testid="hero-news-preview" className={`${STAGE_BOX} bg-brand-ink text-white`}>
      <Newspaper className="size-8 opacity-80" aria-hidden />
      <p className="text-base font-semibold">{entryKindName(item)}</p>
      <p className="max-w-md text-sm text-white/75">{text}</p>
    </div>
  );
}

function NewsStages({ item, source }: { item: HeroItem; source: NewsSource }): ReactElement {
  const resolved = useResolvedSlides(item, source);
  if (resolved.state === "idle") {
    const text = isNewsPostItem(item) ? "Wähle einen Beitrag, dann steht er hier." : "Wähle einen Kanal, dann stehen seine Beiträge hier.";
    return <NewsPlaceholder item={item} text={text} />;
  }
  if (resolved.state === "loading") return <NewsPlaceholder item={item} text="Wird geladen …" />;
  const { slides } = resolved;
  if (slides.length === 0) {
    return <NewsPlaceholder item={item} text="Dazu gibt es nichts zu zeigen. Prüfe die Filter – Beiträge ohne Bild werden standardmäßig übersprungen." />;
  }
  return (
    <div className="flex flex-col gap-2">
      {slides.map((slide, position) => (
        <div key={slide.id}>
          {slides.length > 1 && <p className="px-6 py-2 text-[13px] text-muted-foreground">{`Folie ${position + 1} von ${slides.length}`}</p>}
          <SlideStage slide={slide} />
        </div>
      ))}
    </div>
  );
}

export interface HeroEntryPreviewProps {
  item: HeroItem | undefined;
  /** Woher News-Einträge ihre Beiträge holen; ohne bleibt es beim Platzhalter. */
  source?: NewsSource;
}

export function HeroEntryPreview({ item, source }: HeroEntryPreviewProps): ReactElement {
  if (item === undefined) {
    return <p className={`${STAGE_BOX} text-sm text-muted-foreground`}>Noch kein Eintrag gewählt</p>;
  }
  if (isSlideItem(item)) {
    return (
      <>
        <HeroStageStyle />
        <SlideStage slide={item} />
      </>
    );
  }
  if (source === undefined) {
    return <NewsPlaceholder item={item} text="Bild und Text kommen erst auf der Seite aus den News." />;
  }
  return (
    <>
      <HeroStageStyle />
      <NewsStages item={item} source={source} />
    </>
  );
}
