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
 * Die rechte Spalte im Editor: was der gewählte Eintrag auf die Bühne
 * bringt, verkleinert neben den Feldern.
 *
 * Bei einem News-Eintrag steht hier, was sonst nirgends zu sehen ist: welche
 * Beiträge die Filter übrig lassen und wie ihr Anrisstext gekürzt wird –
 * deshalb unter jeder Folie Titel und Anrisstext in lesbarer Größe. Eine
 * Folie zeigt nur sich selbst; ihren Text hat man daneben im Formular.
 *
 * Die Folien sind die echte Bühne (`SlideStage`) in Desktop-Breite, als
 * Ganzes verkleinert (`zoom`) – derselbe Weg wie im Gerätrahmen, damit
 * Zuschnitt und Lage des Texts stimmen.
 */

import * as React from "react";
import { ReactElement, useLayoutEffect, useRef, useState } from "react";

import { HeroItem, isNewsPostItem, isSlideItem } from "../hero-items";
import { HeroStageStyle, SlideStage } from "../hero-slide-preview";
import { Slide } from "../slides-model";
import { NewsSource } from "./news-source";
import { useResolvedSlides } from "./use-resolved-slides";

/** Die Breite, in der die Bühne gesetzt und dann verkleinert wird – wie „Desktop“. */
const STAGE_WIDTH = 1280;
/** Bis zur ersten Messung: die Spalte des Inspektors ist 320 px breit. */
const FALLBACK_SCALE = 0.25;

const HINT = "text-[13px] text-muted-foreground";

/** Verkleinerung auf die Breite des Behälters. */
function useFitScale(ref: React.RefObject<HTMLElement | null>): number {
  const [scale, setScale] = useState(FALLBACK_SCALE);
  useLayoutEffect(() => {
    const box = ref.current;
    if (box === null || typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry?.contentRect.width ?? 0;
      if (width > 0) setScale(Math.floor((width / STAGE_WIDTH) * 1000) / 1000);
    });
    observer.observe(box);
    return () => observer.disconnect();
  }, [ref]);
  return scale;
}

function MiniStage({ slide }: { slide: Slide }): ReactElement {
  const ref = useRef<HTMLDivElement | null>(null);
  const scale = useFitScale(ref);
  return (
    <div ref={ref} className="overflow-hidden rounded-md border bg-stage">
      <div style={{ width: `${STAGE_WIDTH}px`, zoom: scale }}>
        <SlideStage slide={slide} play={false} testId="hero-mini-preview" />
      </div>
    </div>
  );
}

function NewsSlideCard({ slide }: { slide: Slide }): ReactElement {
  return (
    <li className="flex flex-col gap-2" data-testid={`news-preview-${slide.id}`}>
      <MiniStage slide={slide} />
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-sm font-semibold text-foreground">
          {slide.headline.trim() === "" ? "Ohne Titel" : slide.headline}
        </span>
        {/* Der Anrisstext darf zwei Zeilen brauchen: hier sieht man, ob die
            Kürzung mitten im Wort endet. */}
        {slide.subline !== undefined && <span className={`${HINT} line-clamp-2`}>{slide.subline}</span>}
      </div>
    </li>
  );
}

const IDLE_HINTS = {
  post: "Wähle einen Beitrag, dann steht hier, was auf der Bühne erscheint.",
  channel: "Wähle einen Kanal, dann steht hier, welche Beiträge auf die Bühne kommen.",
} as const;

function NewsSlides({ item, source }: { item: HeroItem; source: NewsSource }): ReactElement {
  const resolved = useResolvedSlides(item, source);
  if (resolved.state === "idle") return <p className={HINT}>{IDLE_HINTS[isNewsPostItem(item) ? "post" : "channel"]}</p>;
  if (resolved.state === "loading") return <p className={HINT}>Wird geladen …</p>;
  const { slides } = resolved;
  if (slides.length === 0) {
    return (
      <p className={HINT}>
        Dazu gibt es nichts zu zeigen. Prüfe die Filter – Beiträge ohne Bild werden standardmäßig übersprungen.
      </p>
    );
  }
  return (
    <>
      <p className={HINT}>{slides.length === 1 ? "1 Folie" : `${slides.length} Folien`}</p>
      <ul aria-label="Folien dieses Eintrags" className="flex flex-col gap-5">
        {slides.map((slide) => (
          <NewsSlideCard key={slide.id} slide={slide} />
        ))}
      </ul>
    </>
  );
}

export interface EntryPreviewProps {
  item: HeroItem | undefined;
  source: NewsSource;
}

export function EntryPreview({ item, source }: EntryPreviewProps): ReactElement {
  return (
    <div className="flex flex-col gap-3" data-testid="entry-preview">
      <HeroStageStyle />
      {item === undefined && <p className={HINT}>Noch kein Eintrag gewählt.</p>}
      {item !== undefined && isSlideItem(item) && <MiniStage slide={item} />}
      {item !== undefined && !isSlideItem(item) && <NewsSlides item={item} source={source} />}
      <p className={HINT}>Desktop, verkleinert. Tablet und Mobil zeigt die Ansicht oben.</p>
    </div>
  );
}
