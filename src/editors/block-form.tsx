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
 * Die Einstellungen eines Bausteins im Panel rechts: oben „Zurück zur Folie“
 * und die Aktionen (nach oben/unten, duplizieren, löschen), dann die Zone
 * als 3×3-Auswahl — derselbe Aufbau wie auf der Bühne —, die Felder seiner
 * Sorte und „Mobil ausblenden“.
 */

import * as React from "react";
import { ReactElement } from "react";
import { ArrowLeft } from "lucide-react";
import { Field } from "@man/config-ui/form/field";
import { FormSection } from "@man/config-ui/form/form-section";
import { SegmentedField } from "@man/config-ui/form/segmented-field";
import { SwitchRow } from "@man/config-ui/form/switch-row";
import { Input } from "@man/config-ui/primitives/input";
import { Textarea } from "@man/config-ui/primitives/textarea";
import { cn } from "@man/config-ui/primitives/utils";
import { ItemActions } from "@man/config-ui/sidebar/item-actions";

import { duplicateBlock, findBlock, moveBlock, nudgeBlock, removeBlock, updateBlock } from "../layout-ops";
import { CTA_ICON_COMPONENTS } from "../slide-ctas";
import {
  Align,
  BLOCK_LABELS,
  BlockColor,
  BlockSize,
  HeadingSize,
  SlideBlock,
  SlideLayout,
  ZONES,
  ZONE_LABELS,
  ZoneAlignments,
  ZoneId,
  alignOf,
  withAlign,
} from "../slide-layout";
import { CTA_ICONS } from "../slides-model";
import { CtaListForm } from "./cta-list-form";
import { NewsSource } from "./news-source";
import { useBlockSelection } from "./zone-stage";

const COLOR_OPTIONS = [
  { id: "auto", label: "Auto" },
  { id: "white", label: "Weiß" },
  { id: "slate", label: "Anthrazit" },
  { id: "red", label: "Rot" },
] as const satisfies readonly { id: BlockColor; label: string }[];

const HEADING_OPTIONS = [
  { id: "display", label: "Display" },
  { id: "h1", label: "H1" },
  { id: "h2", label: "H2" },
  { id: "h3", label: "H3" },
] as const satisfies readonly { id: HeadingSize; label: string }[];

const SIZE_OPTIONS = [
  { id: "s", label: "S" },
  { id: "m", label: "M" },
  { id: "l", label: "L" },
] as const satisfies readonly { id: BlockSize; label: string }[];

const X_OPTIONS = [
  { id: "start", label: "Links" },
  { id: "center", label: "Mitte" },
  { id: "end", label: "Rechts" },
] as const satisfies readonly { id: Align; label: string }[];

const Y_OPTIONS = [
  { id: "start", label: "Oben" },
  { id: "center", label: "Mitte" },
  { id: "end", label: "Unten" },
] as const satisfies readonly { id: Align; label: string }[];

/**
 * Wie die Bausteine einer Zone darin stehen — für die ganze Zone, nicht nur
 * einen Baustein. Vorgabe ist die Lage der Zone.
 */
export function ZoneAlignFields({
  zone,
  zoneAlign,
  onZoneAlign,
}: {
  zone: ZoneId;
  zoneAlign: ZoneAlignments | undefined;
  onZoneAlign: (next: ZoneAlignments) => void;
}): ReactElement {
  const align = alignOf(zoneAlign, zone);
  return (
    <>
      <SegmentedField
        label="Waagerecht in der Zone"
        hint={`Gilt für alle Bausteine der Zone „${ZONE_LABELS[zone]}“. Mobil: rechts wird links, Mitte bleibt.`}
        options={X_OPTIONS}
        value={align.x}
        onChange={(x) => onZoneAlign(withAlign(zoneAlign, zone, "x", x))}
      />
      <SegmentedField
        label="Senkrecht in der Zone"
        options={Y_OPTIONS}
        value={align.y}
        onChange={(y) => onZoneAlign(withAlign(zoneAlign, zone, "y", y))}
      />
    </>
  );
}

/** Neun Felder wie die Zonen der Bühne. */
function ZonePicker({ value, onChange }: { value: ZoneId; onChange: (zone: ZoneId) => void }): ReactElement {
  return (
    <Field label="Zone" hint="Mobil stehen die Zonen in Lesereihenfolge untereinander.">
      <div role="group" aria-label="Zone" className="grid w-36 grid-cols-3 gap-1">
        {ZONES.map((zone) => (
          <button
            key={zone}
            type="button"
            aria-pressed={zone === value}
            aria-label={ZONE_LABELS[zone]}
            title={ZONE_LABELS[zone]}
            data-testid={`zone-pick-${zone}`}
            onClick={() => onChange(zone)}
            className={cn(
              "h-8 rounded-sm border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              zone === value ? "border-primary bg-primary" : "border-border bg-background hover:border-foreground/40",
            )}
          />
        ))}
      </div>
    </Field>
  );
}

function IconPicker({ value, onChange }: { value: string; onChange: (icon: (typeof CTA_ICONS)[number]) => void }): ReactElement {
  return (
    <Field label="Icon">
      <div role="group" aria-label="Icon" className="grid grid-cols-5 gap-1">
        {CTA_ICONS.map((icon) => {
          const Icon = CTA_ICON_COMPONENTS[icon];
          return (
            <button
              key={icon}
              type="button"
              aria-pressed={icon === value}
              aria-label={icon}
              title={icon}
              onClick={() => onChange(icon)}
              className={cn(
                "flex h-9 items-center justify-center rounded-sm border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                icon === value ? "border-primary text-primary" : "border-border text-foreground hover:border-foreground/40",
              )}
            >
              <Icon className="size-4" aria-hidden />
            </button>
          );
        })}
      </div>
    </Field>
  );
}

interface FieldsProps {
  block: SlideBlock;
  set: (changes: Partial<SlideBlock>) => void;
  source: NewsSource;
  onPickImage: () => void;
}

function TypeFields({ block, set, source, onPickImage }: FieldsProps): ReactElement {
  switch (block.type) {
    case "heading":
      return (
        <>
          <Field label="Text">
            <Input type="text" data-testid="block-text" value={block.text} onChange={(event) => set({ text: event.target.value })} />
          </Field>
          <SegmentedField label="Größe" options={HEADING_OPTIONS} value={block.size} onChange={(size) => set({ size })} />
          <SegmentedField label="Farbe" options={COLOR_OPTIONS} value={block.color} onChange={(color) => set({ color })} />
        </>
      );
    case "text":
      return (
        <>
          <Field label="Text">
            <Textarea data-testid="block-text" rows={3} value={block.text} onChange={(event) => set({ text: event.target.value })} />
          </Field>
          <SegmentedField label="Größe" options={SIZE_OPTIONS} value={block.size} onChange={(size) => set({ size })} />
          <SegmentedField label="Farbe" options={COLOR_OPTIONS} value={block.color} onChange={(color) => set({ color })} />
        </>
      );
    case "label":
      return (
        <>
          <Field label="Text" hint="Kurz: ein, zwei Wörter über der Überschrift.">
            <Input type="text" data-testid="block-text" value={block.text} onChange={(event) => set({ text: event.target.value })} />
          </Field>
          <SegmentedField label="Farbe" options={COLOR_OPTIONS} value={block.color} onChange={(color) => set({ color })} />
        </>
      );
    case "icon":
      return (
        <>
          <IconPicker value={block.icon} onChange={(icon) => set({ icon })} />
          <SegmentedField label="Größe" options={SIZE_OPTIONS} value={block.size} onChange={(size) => set({ size })} />
          <SegmentedField label="Farbe" options={COLOR_OPTIONS} value={block.color} onChange={(color) => set({ color })} />
        </>
      );
    case "buttons":
      return <CtaListForm ctas={block.ctas} onChange={(ctas) => set({ ctas: ctas ?? [] })} source={source} />;
    case "image":
      return (
        <>
          <Field label="Bild oder Logo" hint="Freigestellt (PNG/SVG) wirkt auf jeder Bühne.">
            <div className="flex flex-col gap-2">
              {block.image.url !== "" && <img src={block.image.url} alt="" className="max-h-24 max-w-full self-start rounded-sm border border-border bg-muted object-contain" />}
              <button
                type="button"
                onClick={onPickImage}
                data-testid="block-image-pick"
                className="self-start rounded-md border border-border px-3 py-1.5 text-[13px] font-medium hover:border-foreground/40"
              >
                {block.image.url === "" ? "Aus der Mediathek wählen" : "Ersetzen"}
              </button>
              <Input
                type="url"
                placeholder="https://…"
                aria-label="Adresse des Bildes"
                data-testid="block-image-url"
                value={block.image.url}
                onChange={(event) => set({ image: { ...block.image, url: event.target.value.trim() } })}
              />
            </div>
          </Field>
          <Field label="Bildbeschreibung" hint="Leer lassen, wenn rein schmückend.">
            <Input type="text" value={block.image.alt} onChange={(event) => set({ image: { ...block.image, alt: event.target.value } })} />
          </Field>
          <SegmentedField label="Größe" options={SIZE_OPTIONS} value={block.size} onChange={(size) => set({ size })} />
        </>
      );
  }
}

export interface BlockFormProps {
  layout: SlideLayout | undefined;
  blockId: string;
  onLayout: (layout: SlideLayout) => void;
  zoneAlign: ZoneAlignments | undefined;
  onZoneAlign: (next: ZoneAlignments) => void;
  source: NewsSource;
  onPickImage: (blockId: string) => void;
}

export function BlockForm({ layout, blockId, onLayout, zoneAlign, onZoneAlign, source, onPickImage }: BlockFormProps): ReactElement | null {
  const { select } = useBlockSelection();
  const found = findBlock(layout, blockId);
  if (found === undefined) return null;
  const { block, zone, index } = found;
  const count = layout?.[zone]?.length ?? 0;
  const set = (changes: Partial<SlideBlock>): void => onLayout(updateBlock(layout, block.id, changes));

  return (
    <div className="flex flex-col gap-6" data-testid="block-form">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => select(null)}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[13px] font-medium text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Zurück zur Folie
        </button>
        <ItemActions
          className="ml-auto"
          noun="Baustein"
          onMoveBack={() => onLayout(nudgeBlock(layout, block.id, -1))}
          onMoveForward={() => onLayout(nudgeBlock(layout, block.id, 1))}
          canMoveBack={index > 0}
          canMoveForward={index < count - 1}
          onDuplicate={() => {
            const { layout: next, copy } = duplicateBlock(layout, block.id);
            onLayout(next);
            if (copy !== undefined) select(copy.id);
          }}
          onDelete={() => {
            onLayout(removeBlock(layout, block.id));
            select(null);
          }}
        />
      </div>
      <FormSection title={BLOCK_LABELS[block.type]}>
        <ZonePicker value={zone} onChange={(next) => onLayout(moveBlock(layout, block.id, next))} />
        <ZoneAlignFields zone={zone} zoneAlign={zoneAlign} onZoneAlign={onZoneAlign} />
        <TypeFields block={block} set={set} source={source} onPickImage={() => onPickImage(block.id)} />
        <SwitchRow
          label="Mobil ausblenden"
          hint="Auf schmalen Bildschirmen fehlt dieser Baustein."
          checked={block.hideMobile === true}
          onCheckedChange={(hide) => set({ hideMobile: hide ? true : undefined })}
        />
      </FormSection>
    </div>
  );
}
