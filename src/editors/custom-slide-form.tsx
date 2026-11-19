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
 * Das Panel einer benutzerdefinierten Folie, solange kein Baustein gewählt
 * ist: der Katalog der Bausteine (auf die Bühne ziehen oder anklicken) und
 * die Liste dessen, was schon auf der Folie steht — nach Zonen, zum Wählen
 * auch ohne Maus. Ist ein Baustein gewählt, zeigt das Panel seine
 * Einstellungen (block-form.tsx).
 */

import * as React from "react";
import { ReactElement } from "react";
import { Heading, Image as ImageIcon, MousePointerClick, Shapes, Tag, Type } from "lucide-react";
import { FormSection } from "@man/config-ui/form/form-section";

import { findBlock, insertBlock } from "../layout-ops";
import { SlideItem } from "../hero-items";
import { BLOCK_LABELS, BLOCK_TYPES, BlockType, SlideBlock, SlideLayout, ZONES, ZONE_LABELS, ZoneId, newBlock } from "../slide-layout";
import { BlockForm } from "./block-form";
import { NewsSource } from "./news-source";
import { CatalogTile, useBlockSelection } from "./zone-stage";

const TILE_ICONS: Record<BlockType, ReactElement> = {
  heading: <Heading className="size-5" />,
  text: <Type className="size-5" />,
  label: <Tag className="size-5" />,
  buttons: <MousePointerClick className="size-5" />,
  image: <ImageIcon className="size-5" />,
  icon: <Shapes className="size-5" />,
};

/** Wohin ein angeklickter Baustein kommt: dorthin, wo die feste Folie ihren Text hat. */
const CLICK_ZONE: ZoneId = "bottom-left";

/** Was ein Eintrag der Liste zeigt: der Text, sonst die Sorte. */
function blockSummary(block: SlideBlock): string {
  if (block.type === "heading" || block.type === "text" || block.type === "label") return block.text.trim() || BLOCK_LABELS[block.type];
  if (block.type === "buttons") return block.ctas.map((cta) => cta.label).filter(Boolean).join(" · ") || BLOCK_LABELS.buttons;
  if (block.type === "image") return block.image.alt.trim() || BLOCK_LABELS.image;
  return `${BLOCK_LABELS.icon}: ${block.icon}`;
}

function BlockList({ layout }: { layout: SlideLayout | undefined }): ReactElement {
  const { select } = useBlockSelection();
  const zones = ZONES.filter((zone) => (layout?.[zone] ?? []).length > 0);
  if (zones.length === 0) return <p className="text-sm text-muted-foreground">Noch keine Bausteine.</p>;
  return (
    <ul className="flex flex-col gap-3" data-testid="block-list">
      {zones.map((zone) => (
        <li key={zone}>
          <p className="mb-1 text-xs font-semibold text-muted-foreground">{ZONE_LABELS[zone]}</p>
          <ul className="flex flex-col gap-1">
            {(layout?.[zone] ?? []).map((block) => (
              <li key={block.id}>
                <button
                  type="button"
                  onClick={() => select(block.id)}
                  className="flex w-full items-baseline gap-2 rounded-md border border-border px-2.5 py-1.5 text-left text-[13px] hover:border-foreground/40 focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <span className="shrink-0 font-semibold text-foreground">{BLOCK_LABELS[block.type]}</span>
                  <span className="min-w-0 truncate text-muted-foreground">{blockSummary(block)}</span>
                </button>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export interface CustomSlideFormProps {
  slide: SlideItem;
  onPatch: (changes: Partial<SlideItem>) => void;
  source: NewsSource;
  onPickBlockImage: (blockId: string) => void;
}

export function CustomSlideForm({ slide, onPatch, source, onPickBlockImage }: CustomSlideFormProps): ReactElement {
  const { selectedId, select } = useBlockSelection();
  const onLayout = (layout: SlideLayout): void => onPatch({ layout });

  // Ein gewählter Baustein, den es nicht mehr gibt (Rückgängig), führt zurück zur Folie.
  if (selectedId !== null && findBlock(slide.layout, selectedId) !== undefined) {
    return <BlockForm layout={slide.layout} blockId={selectedId} onLayout={onLayout} source={source} onPickImage={onPickBlockImage} />;
  }

  return (
    <>
      <FormSection title="Bausteine">
        <p className="text-[13px] text-muted-foreground">
          Auf eine Zone der Bühne ziehen — oder anklicken, dann steht er unten links. Ein Klick auf einen Baustein der Bühne öffnet seine Einstellungen.
        </p>
        <div className="grid grid-cols-3 gap-2" data-testid="block-catalog">
          {BLOCK_TYPES.map((type) => (
            <CatalogTile
              key={type}
              type={type}
              icon={TILE_ICONS[type]}
              onAdd={() => {
                const block = newBlock(type);
                onLayout(insertBlock(slide.layout, CLICK_ZONE, block));
                select(block.id);
              }}
            />
          ))}
        </div>
      </FormSection>
      <FormSection title="Auf der Folie">
        <BlockList layout={slide.layout} />
      </FormSection>
    </>
  );
}
