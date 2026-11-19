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
 * Breite und Höhe einer Zone: wie viele Spalten und Zeilen des Rasters sie
 * zusammenfasst (zone-spans.ts). Angeboten wird nur, was geht — eine Größe,
 * die eine andere zusammengefasste Zone nur zum Teil träfe, fehlt.
 */

import * as React from "react";
import { ReactElement } from "react";
import { SegmentedField } from "@man/config-ui/form/segmented-field";

import { ZoneId } from "../slide-layout";
import { Resized, SPAN_SIZES, SpanAxis, SpanSize, ZoneState, resizeZone, spanOf } from "../zone-spans";

type SizeId = `${SpanSize}`;

const NOUNS: Record<SpanAxis, [one: string, many: string]> = {
  cols: ["Spalte", "Spalten"],
  rows: ["Zeile", "Zeilen"],
};

const HINTS: Record<SpanAxis, string> = {
  cols: "Fasst Zonen nebeneinander zusammen; ihre Bausteine kommen hierher.",
  rows: "Fasst Zonen übereinander zusammen. Mobil stehen die Zonen weiter in Lesereihenfolge untereinander.",
};

const BLOCKED = " Mehr geht nicht: dort liegt schon eine zusammengefasste Zone.";

function SpanField({ axis, label, zone, state, onResize }: { axis: SpanAxis; label: string; zone: ZoneId; state: ZoneState; onResize: (next: Resized) => void }): ReactElement {
  const current = spanOf(state.zoneSpan, zone)[axis];
  const possible = SPAN_SIZES.filter((size) => size === current || resizeZone(state, zone, axis, size) !== undefined);
  const [one, many] = NOUNS[axis];
  return (
    <SegmentedField<SizeId>
      label={label}
      hint={HINTS[axis] + (possible.length < SPAN_SIZES.length ? BLOCKED : "")}
      options={possible.map((size) => ({ id: `${size}`, label: `${size} ${size === 1 ? one : many}` }))}
      value={`${current}`}
      onChange={(id) => {
        const next = resizeZone(state, zone, axis, Number(id) as SpanSize);
        if (next !== undefined) onResize(next);
      }}
    />
  );
}

export function ZoneSpanFields(props: { zone: ZoneId; state: ZoneState; onResize: (next: Resized) => void }): ReactElement {
  return (
    <>
      <SpanField axis="cols" label="Breite" {...props} />
      <SpanField axis="rows" label="Höhe" {...props} />
    </>
  );
}
