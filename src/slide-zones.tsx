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
 * Die Bausteine einer benutzerdefinierten Folie in ihren Zonen
 * (slide-layout.ts). Die Zonen sind ein 3×3-Raster auf der Fluchtlinie;
 * zusammengefasste Zonen reichen über mehrere Spalten oder Zeilen
 * (zone-spans.ts). Schmal stehen die Zonen in Lesereihenfolge ihrer Anker
 * untereinander (hero-slider.scss).
 *
 * Die erste Überschrift ist ein `<h2>` wie die feste Folie, weitere sind
 * `<h3>` — ihre Größe kommt aus `size`, nicht aus der Ebene.
 *
 * `renderBlock` lässt den Editor jeden Baustein umhüllen (Auswahl, Ziehen),
 * ohne das Markup der Bühne zu verdoppeln.
 */

import * as React from "react";
import { ReactElement, ReactNode } from "react";

import { CTA_ICON_COMPONENTS, SlideCtas } from "./slide-ctas";
import {
  Align,
  BlockColor,
  BlockSize,
  HeadingSize,
  SlideBlock,
  SlideLayout,
  ZoneAlignments,
  ZoneId,
  alignOf,
  blocksInReadingOrder,
} from "./slide-layout";
import { SpanSize, ZoneSpans, foldLayout, spanOf, visibleZones } from "./zone-spans";

/** Ausgeschrieben statt zusammengesetzt, damit jede Klasse im Quelltext auffindbar bleibt. */
const COLOR_CLASS: Record<BlockColor, string | undefined> = {
  auto: undefined,
  white: "man-hero__block--color-white",
  slate: "man-hero__block--color-slate",
  red: "man-hero__block--color-red",
};
const HEADING_CLASS: Record<HeadingSize, string> = {
  display: "man-hero__block-heading--display",
  h1: "man-hero__block-heading--h1",
  h2: "man-hero__block-heading--h2",
  h3: "man-hero__block-heading--h3",
};
const TEXT_CLASS: Record<BlockSize, string> = {
  l: "man-hero__block-text--l",
  m: "man-hero__block-text--m",
  s: "man-hero__block-text--s",
};
const ICON_CLASS: Record<BlockSize, string> = {
  s: "man-hero__block-icon--s",
  m: "man-hero__block-icon--m",
  l: "man-hero__block-icon--l",
};
const IMAGE_CLASS: Record<BlockSize, string> = {
  s: "man-hero__block-image--s",
  m: "man-hero__block-image--m",
  l: "man-hero__block-image--l",
};
const ZONE_CLASS: Record<ZoneId, string> = {
  "top-left": "man-hero__zone--top-left",
  "top-center": "man-hero__zone--top-center",
  "top-right": "man-hero__zone--top-right",
  "middle-left": "man-hero__zone--middle-left",
  "middle-center": "man-hero__zone--middle-center",
  "middle-right": "man-hero__zone--middle-right",
  "bottom-left": "man-hero__zone--bottom-left",
  "bottom-center": "man-hero__zone--bottom-center",
  "bottom-right": "man-hero__zone--bottom-right",
};
const ALIGN_X_CLASS: Record<Align, string> = {
  start: "man-hero__zone--x-start",
  center: "man-hero__zone--x-center",
  end: "man-hero__zone--x-end",
};
const ALIGN_Y_CLASS: Record<Align, string> = {
  start: "man-hero__zone--y-start",
  center: "man-hero__zone--y-center",
  end: "man-hero__zone--y-end",
};
const COLS_CLASS: Record<SpanSize, string | undefined> = {
  1: undefined,
  2: "man-hero__zone--cols-2",
  3: "man-hero__zone--cols-3",
};
const ROWS_CLASS: Record<SpanSize, string | undefined> = {
  1: undefined,
  2: "man-hero__zone--rows-2",
  3: "man-hero__zone--rows-3",
};
const colorClass = (color: BlockColor): string | undefined => COLOR_CLASS[color];

const join = (...classes: (string | false | undefined)[]): string => classes.filter(Boolean).join(" ");

function BlockContent({ block, firstHeading }: { block: SlideBlock; firstHeading: boolean }): ReactElement | null {
  switch (block.type) {
    case "heading": {
      const Tag = firstHeading ? "h2" : "h3";
      return block.text.trim() === "" ? null : (
        <Tag className={join("man-hero__block-heading", HEADING_CLASS[block.size], colorClass(block.color))}>{block.text}</Tag>
      );
    }
    case "text":
      return block.text.trim() === "" ? null : (
        <p className={join("man-hero__block-text", TEXT_CLASS[block.size], colorClass(block.color))}>{block.text}</p>
      );
    case "label":
      return block.text.trim() === "" ? null : (
        <p className={join("man-hero__block-label", colorClass(block.color))}>{block.text}</p>
      );
    case "icon": {
      const Icon = CTA_ICON_COMPONENTS[block.icon];
      return (
        <Icon
          className={join("man-hero__block-icon", ICON_CLASS[block.size], colorClass(block.color))}
          aria-hidden="true"
          focusable="false"
          strokeWidth={1.75}
        />
      );
    }
    case "buttons":
      return <SlideCtas ctas={block.ctas} inline />;
    case "image":
      return block.image.url === "" ? null : (
        <img
          className={join("man-hero__block-image", IMAGE_CLASS[block.size])}
          src={block.image.url}
          alt={block.image.alt}
          loading="lazy"
        />
      );
  }
}

export interface SlideZonesProps {
  layout: SlideLayout | undefined;
  /** Ausrichtung je Zone; ohne folgt sie der Lage der Zone. */
  zoneAlign?: ZoneAlignments;
  /** Zusammengefasste Zonen; ohne steht jede Zone in ihrer Zelle. */
  zoneSpan?: ZoneSpans;
  /** Der Editor umhüllt jeden Baustein; ohne steht er so, wie er ist. */
  renderBlock?: (block: SlideBlock, zone: ZoneId, content: ReactNode) => ReactNode;
  /** Der Editor füllt jede Zone, auch leere (Ablagefläche). */
  renderZone?: (zone: ZoneId, children: ReactNode) => ReactNode;
}

export function SlideZones({ layout, zoneAlign, zoneSpan, renderBlock, renderZone }: SlideZonesProps): ReactElement {
  const folded = foldLayout(layout, zoneSpan);
  const first = blocksInReadingOrder(folded).find(({ block }) => block.type === "heading")?.block.id;
  return (
    <div className="man-hero__inner">
      <div className="man-hero__zones" data-testid="hero-zones">
        {visibleZones(zoneSpan).map((zone) => {
          const blocks = folded[zone] ?? [];
          const span = spanOf(zoneSpan, zone);
          const align = alignOf(zoneAlign, zone);
          if (blocks.length === 0 && renderZone === undefined) return null;
          const children = blocks.map((block) => {
            const content = <BlockContent block={block} firstHeading={block.id === first} />;
            return (
              <div
                key={block.id}
                className={join("man-hero__block", `man-hero__block--${block.type}`, block.hideMobile === true && "man-hero__block--hide-mobile")}
                data-testid={`hero-block-${block.id}`}
              >
                {renderBlock === undefined ? content : renderBlock(block, zone, content)}
              </div>
            );
          });
          return (
            <div
              key={zone}
              className={join(
                "man-hero__zone",
                ZONE_CLASS[zone],
                COLS_CLASS[span.cols],
                ROWS_CLASS[span.rows],
                ALIGN_X_CLASS[align.x],
                ALIGN_Y_CLASS[align.y],
              )}
              data-zone={zone}
            >
              {renderZone === undefined ? children : renderZone(zone, children)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
