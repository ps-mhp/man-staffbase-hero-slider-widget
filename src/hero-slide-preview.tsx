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
 * Seite, und die Vorschau verböge sie. Hier steht nur die eine Folie – kein
 * Autoplay, keine Bedienleiste, kein Messen.
 *
 * News-Einträge werden erst auf der Seite zu Folien, aus Beiträgen, die das
 * Netz liefert. Die Vorschau lädt dafür nichts nach und zeigt einen ruhigen
 * Platzhalter in Bühnengröße.
 */

import * as React from "react";
import { ReactElement } from "react";
import { Newspaper } from "lucide-react";
import { useConfigShell } from "@man/config-ui/shell/shell-context";
import { useHotStyle } from "@shared/hot-style";

import { entryKindName } from "./editor-entries";
import { SlideMedia, SlideText, useMediaQuery } from "./hero-slide-media";
import { HeroItem, isSlideItem } from "./hero-items";
import { Slide } from "./slides-model";
import heroSliderCss from "./styles/hero-slider.scss";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** Gleiche Fläche für Folie, Platzhalter und Leere, damit die Vorschau beim Wechsel nicht springt. */
const STAGE_BOX = "flex aspect-[21/9] min-h-[320px] flex-col items-center justify-center gap-2 p-6 text-center";

/**
 * Die Folie, wie das gewählte Gerät sie zeigte. Die Bühne wählt den
 * Hochkant-Zuschnitt per Medienabfrage – die fragt aber das Fenster des
 * Studios, nicht den Gerätrahmen. Hier entscheidet deshalb die Ansicht.
 */
function forDevice(slide: Slide, mobile: boolean): Slide {
  const { imagePortrait, ...rest } = slide;
  return mobile && imagePortrait !== undefined ? { ...rest, image: imagePortrait } : rest;
}

function SlideStage({ slide }: { slide: Slide }): ReactElement {
  const css = useHotStyle(heroSliderCss, "hero-slider-widget", "styles/hero-slider.scss");
  const { view } = useConfigShell();
  const reducedMotion = useMediaQuery(REDUCED_MOTION);
  const shown = forDevice(slide, view === "mobile");
  const hasImage = shown.image.url.trim() !== "";

  return (
    // `inert`: Eine Schaltfläche der Vorschau führte sonst aus dem Studio
    // hinaus, und Tab wanderte durch Links, die hier nichts bedeuten.
    <div inert>
      <div className="man-hero man-hero--height-medium" data-testid="hero-slide-preview">
        <style>{css}</style>
        <div className="man-hero__frame">
          <div className="man-hero__slides">
            <div className="man-hero__slide man-hero__slide--active">
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

function NewsPlaceholder({ item }: { item: HeroItem }): ReactElement {
  return (
    <div data-testid="hero-news-preview" className={`${STAGE_BOX} bg-brand-ink text-white`}>
      <Newspaper className="size-8 opacity-80" aria-hidden />
      <p className="text-base font-semibold">{entryKindName(item)} – Vorschau nach dem Laden</p>
      <p className="max-w-md text-sm text-white/75">
        Bild und Text kommen erst auf der Seite aus den News.
      </p>
    </div>
  );
}

export interface HeroEntryPreviewProps {
  item: HeroItem | undefined;
}

export function HeroEntryPreview({ item }: HeroEntryPreviewProps): ReactElement {
  if (item === undefined) {
    return <p className={`${STAGE_BOX} text-sm text-muted-foreground`}>Noch kein Eintrag gewählt</p>;
  }
  return isSlideItem(item) ? <SlideStage slide={item} /> : <NewsPlaceholder item={item} />;
}
