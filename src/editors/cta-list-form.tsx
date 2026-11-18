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
 * Die Buttons einer handgepflegten Folie, wie im Screen als Unterliste:
 * je Button eine Zeile („Zu den Terminen · Rot gefüllt · Seite …“), einer
 * aufgeklappt mit seinen Feldern, darunter „+ Button hinzufügen“.
 *
 * Nur hier: News-Folien bekommen ihren Button aus dem Beitrag, und ein
 * Kanal-Eintrag ist gar keine Folie, sondern eine Anweisung.
 *
 * Halb ausgefüllte Buttons bleiben im Zustand des Dialogs stehen. Erst das
 * Lesen des gespeicherten Attributs (`parseCta`) verwirft, was keine
 * Beschriftung oder kein brauchbares Ziel hat — sonst verschwände ein Knopf
 * unter den Händen, sobald man das erste Feld ausfüllt.
 */

import * as React from "react";
import { ReactElement, useState } from "react";
import { Plus } from "lucide-react";
import { Field } from "@man/config-ui/form/field";
import { FormSection } from "@man/config-ui/form/form-section";
import type { SegmentedOption } from "@man/config-ui/form/segmented";
import { SegmentedField } from "@man/config-ui/form/segmented-field";
import { SubList, type SubListItem } from "@man/config-ui/form/sub-list";
import { SwitchRow } from "@man/config-ui/form/switch-row";
import { Button } from "@man/config-ui/primitives/button";
import { Input } from "@man/config-ui/primitives/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@man/config-ui/primitives/select";
import { ItemActions } from "@man/config-ui/sidebar/item-actions";

import { CTA_ICONS, CTA_VARIANTS, CtaIcon, CtaIconPosition, CtaVariant, MAX_SLIDE_CTAS, SlideCta } from "../slides-model";
import {
  CtaTargetKind,
  ICON_LABELS,
  TARGET_LABELS,
  VARIANT_LABELS,
  ctaSummary,
  duplicateCta,
  emptyCta,
  moveCta,
  targetKindOf,
  withTargetKind,
  without,
} from "./cta-model";
import { CtaTarget } from "./cta-targets";
import { NewsSource } from "./news-source";

const TARGET_OPTIONS: readonly SegmentedOption<CtaTargetKind>[] = (["url", "page", "post"] as const).map((id) => ({
  id,
  label: TARGET_LABELS[id],
}));

const POSITION_OPTIONS: readonly SegmentedOption<CtaIconPosition>[] = [
  { id: "start", label: "Vor dem Text" },
  { id: "end", label: "Nach dem Text" },
];

/** Radix kennt keinen leeren Wert; „kein Symbol“ heißt in der Auswahl so. */
const NO_ICON = "none";

interface LookProps {
  cta: SlideCta;
  onChange: (cta: SlideCta) => void;
  testId: string;
}

function VariantSelect({ cta, onChange, testId }: LookProps): ReactElement {
  return (
    <Select
      value={cta.variant ?? "primary"}
      onValueChange={(value) => {
        const variant = value as CtaVariant;
        const rest = without(cta, "variant");
        onChange(variant === "primary" ? rest : { ...rest, variant });
      }}
    >
      <Field label="Stil">
        <SelectTrigger className="w-full cursor-pointer" data-testid={`${testId}-variant`}>
          <SelectValue />
        </SelectTrigger>
      </Field>
      <SelectContent position="popper">
        {CTA_VARIANTS.map((variant) => (
          <SelectItem key={variant} value={variant}>
            {VARIANT_LABELS[variant]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function IconSelect({ cta, onChange, testId }: LookProps): ReactElement {
  return (
    <Select
      value={cta.icon ?? NO_ICON}
      onValueChange={(value) => {
        const rest = without(cta, "icon", "iconPosition");
        if (value === NO_ICON) {
          onChange(rest);
          return;
        }
        onChange({ ...rest, icon: value as CtaIcon, ...(cta.iconPosition === "start" ? { iconPosition: "start" } : {}) });
      }}
    >
      <Field label="Symbol">
        <SelectTrigger className="w-full cursor-pointer" data-testid={`${testId}-icon`}>
          <SelectValue />
        </SelectTrigger>
      </Field>
      <SelectContent position="popper" className="max-h-80">
        <SelectItem value={NO_ICON}>Kein Symbol</SelectItem>
        {CTA_ICONS.map((icon) => (
          <SelectItem key={icon} value={icon}>
            {ICON_LABELS[icon]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** Stil, Symbol und – nur mit Symbol – seine Seite. */
function CtaLook({ cta, onChange, testId }: LookProps): ReactElement {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
        <VariantSelect cta={cta} onChange={onChange} testId={testId} />
        <IconSelect cta={cta} onChange={onChange} testId={testId} />
      </div>
      {cta.icon !== undefined && (
        <SegmentedField
          label="Symbol steht"
          options={POSITION_OPTIONS}
          value={cta.iconPosition ?? "end"}
          onChange={(position) => {
            const rest = without(cta, "iconPosition");
            onChange(position === "start" ? { ...rest, iconPosition: "start" } : rest);
          }}
        />
      )}
    </>
  );
}

interface CtaFieldsProps {
  cta: SlideCta;
  position: number;
  count: number;
  onChange: (cta: SlideCta) => void;
  onMove: (by: -1 | 1) => void;
  onDuplicate: () => void;
  onRemove: () => void;
  source: NewsSource;
}

function CtaFields({ cta, position, count, onChange, onMove, onDuplicate, onRemove, source }: CtaFieldsProps): ReactElement {
  const testId = `slide-cta-${position}`;
  return (
    <div className="flex flex-col gap-4" data-testid={testId}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h4 className="text-[15px] font-semibold text-foreground">{`Button ${position + 1} von ${count}`}</h4>
        <ItemActions
          className="ml-auto"
          noun="Button"
          onMoveBack={() => onMove(-1)}
          onMoveForward={() => onMove(1)}
          canMoveBack={position > 0}
          canMoveForward={position < count - 1}
          onDuplicate={onDuplicate}
          canDuplicate={count < MAX_SLIDE_CTAS}
          onDelete={onRemove}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
        <Field label="Beschriftung">
          <Input type="text" data-testid={`${testId}-label`} value={cta.label} onChange={(event) => onChange({ ...cta, label: event.target.value })} />
        </Field>
        <SegmentedField label="Ziel" options={TARGET_OPTIONS} value={targetKindOf(cta)} onChange={(kind) => onChange(withTargetKind(cta, kind))} />
      </div>
      <CtaTarget cta={cta} onChange={onChange} source={source} testId={testId} />
      <CtaLook cta={cta} onChange={onChange} testId={testId} />
      <SwitchRow
        label="In neuem Tab öffnen"
        data-testid={`${testId}-newtab`}
        checked={cta.newTab === true}
        onCheckedChange={(checked) => {
          const rest = without(cta, "newTab");
          onChange(checked ? { ...rest, newTab: true } : rest);
        }}
      />
    </div>
  );
}

const listItems = (ctas: SlideCta[]): SubListItem[] =>
  ctas.map((cta, position) => ({
    id: String(position),
    label: cta.label.trim() === "" ? `Button ${position + 1} ohne Beschriftung` : cta.label,
    description: ctaSummary(cta),
  }));

export interface CtaListFormProps {
  ctas: SlideCta[];
  onChange: (ctas: SlideCta[] | undefined) => void;
  source: NewsSource;
}

export function CtaListForm({ ctas, onChange, source }: CtaListFormProps): ReactElement {
  // Der erste ist offen, wie im Screen; die Folie bringt ihre eigene
  // Instanz mit (`key`), also auch ihren eigenen offenen Button.
  const [open, setOpen] = useState<number | null>(ctas.length > 0 ? 0 : null);
  // Eine leere Liste wird nicht gespeichert: das Attribut bliebe sonst mit
  // `"ctas": []` stehen, wo vorher gar nichts stand.
  const commit = (next: SlideCta[], openAt: number | null): void => {
    onChange(next.length === 0 ? undefined : next);
    setOpen(openAt);
  };
  const full = ctas.length >= MAX_SLIDE_CTAS;

  return (
    <FormSection
      title="Buttons"
      aside={`${ctas.length} von ${MAX_SLIDE_CTAS}`}
      description="Ein Button erscheint nur mit Beschriftung und Ziel. Auf dem Telefon wird der erste zur Fläche der ganzen Folie."
    >
      <SubList
        aria-label="Buttons"
        items={listItems(ctas)}
        openId={open === null ? null : String(open)}
        onOpenChange={(id) => setOpen(id === null ? null : Number(id))}
        emptyState="Noch kein Button."
        renderItem={(_, position) => (
          <CtaFields
            cta={ctas[position]!}
            position={position}
            count={ctas.length}
            source={source}
            onChange={(next) => commit(ctas.map((entry, at) => (at === position ? next : entry)), position)}
            onMove={(by) => commit(moveCta(ctas, position, by), Math.min(Math.max(position + by, 0), ctas.length - 1))}
            onDuplicate={() => commit(duplicateCta(ctas, position), position + 1)}
            onRemove={() => commit(ctas.filter((_, at) => at !== position), ctas.length > 1 ? Math.max(position - 1, 0) : null)}
          />
        )}
        footer={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            data-testid="slide-cta-add"
            disabled={full}
            title={full ? `Höchstens ${MAX_SLIDE_CTAS}` : undefined}
            onClick={() => commit([...ctas, emptyCta(ctas.length)], ctas.length)}
          >
            <Plus aria-hidden />
            Button hinzufügen
          </Button>
        }
      />
    </FormSection>
  );
}
