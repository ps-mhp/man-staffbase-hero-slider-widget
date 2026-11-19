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
 * Die Bühne als Arbeitsfläche einer benutzerdefinierten Folie: jede der neun
 * Zonen nimmt Bausteine auf — aus dem Katalog im Panel rechts oder von einer
 * anderen Stelle der Bühne —, jeder Baustein lässt sich anklicken (seine
 * Einstellungen erscheinen rechts) und ziehen.
 *
 * Gezogen wird mit dem Drag-and-Drop des Browsers; was gezogen wird, steht
 * als JSON unter einem eigenen Typ im `dataTransfer`. Wer nicht ziehen kann
 * oder will, legt per Klick im Katalog an und wählt die Zone im Panel.
 */

import * as React from "react";
import { ReactElement, ReactNode, createContext, useContext, useState } from "react";
import { cn } from "@man/config-ui/primitives/utils";

import { insertBlock, moveBlock } from "../layout-ops";
import { BLOCK_LABELS, BlockType, SlideBlock, SlideLayout, ZONE_LABELS, ZoneId, newBlock } from "../slide-layout";

// --- Auswahl -----------------------------------------------------------------

/** Gewählt ist ein Baustein oder eine Zone — nie beides. */
export interface BlockSelection {
  selectedId: string | null;
  select: (id: string | null) => void;
  selectedZone: ZoneId | null;
  selectZone: (zone: ZoneId | null) => void;
}

const SelectionContext = createContext<BlockSelection>({
  selectedId: null,
  select: () => undefined,
  selectedZone: null,
  selectZone: () => undefined,
});

export const BlockSelectionProvider = SelectionContext.Provider;

/** Welcher Baustein der gewählten Folie gerade eingestellt wird. */
export const useBlockSelection = (): BlockSelection => useContext(SelectionContext);

// --- Ziehen ------------------------------------------------------------------

export const BLOCK_DRAG_TYPE = "application/x-man-hero-block";

export type BlockDrag = { kind: "new"; type: BlockType } | { kind: "move"; id: string };

export function startBlockDrag(event: React.DragEvent, drag: BlockDrag): void {
  event.dataTransfer.setData(BLOCK_DRAG_TYPE, JSON.stringify(drag));
  event.dataTransfer.effectAllowed = drag.kind === "new" ? "copy" : "move";
}

const carriesBlock = (event: React.DragEvent): boolean => Array.from(event.dataTransfer.types).includes(BLOCK_DRAG_TYPE);

function readBlockDrag(event: React.DragEvent): BlockDrag | null {
  try {
    const value = JSON.parse(event.dataTransfer.getData(BLOCK_DRAG_TYPE)) as BlockDrag;
    return value.kind === "new" || value.kind === "move" ? value : null;
  } catch {
    return null;
  }
}

/** Vor dem ersten Baustein, dessen Mitte unter dem Zeiger liegt; sonst ans Ende. */
function dropIndex(zone: HTMLElement, clientY: number): number {
  const blocks = Array.from(zone.querySelectorAll<HTMLElement>(":scope > .man-hero__block"));
  const before = blocks.findIndex((block) => {
    const box = block.getBoundingClientRect();
    return box.height > 0 && clientY < box.top + box.height / 2;
  });
  return before === -1 ? blocks.length : before;
}

/** Ob ein Baustein auf der Bühne nichts zeigen würde — dann steht im Editor sein Name. */
function isEmptyBlock(block: SlideBlock): boolean {
  if (block.type === "heading" || block.type === "text" || block.type === "label") return block.text.trim() === "";
  if (block.type === "buttons") return block.ctas.length === 0;
  if (block.type === "image") return block.image.url === "";
  return false;
}

// --- Die Arbeitsfläche ---------------------------------------------------------

export interface StageEditing {
  renderZone: (zone: ZoneId, children: ReactNode) => ReactNode;
  renderBlock: (block: SlideBlock, zone: ZoneId, content: ReactNode) => ReactNode;
}

/** Was die Bühne zum Bearbeiten braucht; `onLayout` schreibt in die Folie. */
export function useStageEditing(layout: SlideLayout | undefined, onLayout: (layout: SlideLayout) => void): StageEditing {
  const { selectedId, select, selectedZone, selectZone } = useBlockSelection();
  const [over, setOver] = useState<ZoneId | null>(null);

  const drop = (zone: ZoneId, at: number, drag: BlockDrag): void => {
    if (drag.kind === "new") {
      const block = newBlock(drag.type);
      onLayout(insertBlock(layout, zone, block, at));
      select(block.id);
    } else {
      onLayout(moveBlock(layout, drag.id, zone, at));
    }
  };

  return {
    renderZone: (zone, children) => (
      <div
        className={cn("man-se__zone", over === zone && "man-se__zone--over", selectedZone === zone && "man-se__zone--selected")}
        data-testid={`stage-zone-${zone}`}
        aria-label={`Zone ${ZONE_LABELS[zone]}`}
        role="group"
        onDragOver={(event) => {
          if (!carriesBlock(event)) return;
          event.preventDefault();
          if (over !== zone) setOver(zone);
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOver(null);
        }}
        onDrop={(event) => {
          setOver(null);
          const drag = readBlockDrag(event);
          if (drag === null) return;
          event.preventDefault();
          drop(zone, dropIndex(event.currentTarget, event.clientY), drag);
        }}
        onClick={(event) => {
          // Die leere Fläche einer Zone wählt die Zone: rechts steht dann ihre Ausrichtung.
          if (event.target === event.currentTarget) selectZone(zone);
        }}
      >
        <button
          type="button"
          className="man-se__zone-label"
          aria-pressed={selectedZone === zone}
          aria-label={`Zone ${ZONE_LABELS[zone]} ausrichten`}
          data-testid={`stage-zone-label-${zone}`}
          onClick={(event) => {
            event.stopPropagation();
            selectZone(zone);
          }}
        >
          {ZONE_LABELS[zone]}
        </button>
        {children}
      </div>
    ),
    renderBlock: (block, _zone, content) => (
      <div
        className={cn("man-se__block", selectedId === block.id && "man-se__block--selected")}
        data-testid={`stage-block-${block.id}`}
        draggable
        role="button"
        tabIndex={0}
        aria-pressed={selectedId === block.id}
        aria-label={`${BLOCK_LABELS[block.type]} bearbeiten`}
        onDragStart={(event) => startBlockDrag(event, { kind: "move", id: block.id })}
        onClick={(event) => {
          // Ein Klick auf einen Button der Folie wählt den Baustein, statt das Studio zu verlassen.
          event.preventDefault();
          event.stopPropagation();
          select(block.id);
        }}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          select(block.id);
        }}
      >
        {isEmptyBlock(block) ? <span className="man-se__block-placeholder">{BLOCK_LABELS[block.type]}</span> : content}
      </div>
    ),
  };
}

/** Eine Kachel des Katalogs: ziehen legt ab, wo man loslässt; klicken legt in `fallbackZone`. */
export function CatalogTile({ type, icon, onAdd }: { type: BlockType; icon: ReactNode; onAdd: () => void }): ReactElement {
  return (
    <button
      type="button"
      draggable
      onDragStart={(event) => startBlockDrag(event, { kind: "new", type })}
      onClick={onAdd}
      data-testid={`catalog-${type}`}
      className="flex cursor-grab flex-col items-center gap-1.5 rounded-md border border-border bg-background px-2 py-3 text-[13px] font-medium text-foreground transition-colors hover:border-foreground/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:cursor-grabbing"
    >
      <span className="text-muted-foreground" aria-hidden>
        {icon}
      </span>
      {BLOCK_LABELS[type]}
    </button>
  );
}
