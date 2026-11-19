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
 * Die Einstellungen einer Hintergrund-Animation: Muster als Kacheln mit
 * Standbild, darunter Grundton, Tempo, Deckkraft und rote Akzente — alles
 * untereinander, für das schmale Panel rechts. Bewegt sieht man die
 * Animation groß auf der Bühne in der Mitte.
 */

import * as React from "react";
import { ReactElement } from "react";
import { Field } from "@man/config-ui/form/field";
import { SegmentedField } from "@man/config-ui/form/segmented-field";
import { SwitchRow } from "@man/config-ui/form/switch-row";
import { cn } from "@man/config-ui/primitives/utils";

import {
  ANIMATION_DESCRIPTIONS,
  ANIMATION_OPACITIES,
  ANIMATION_LABELS,
  ANIMATION_PATTERNS,
  AnimationPattern,
  AnimationSpeed,
  AnimationTheme,
  SlideAnimation,
} from "../slide-animation";
import { animationThumbnail } from "../slide-animation-canvas";

export interface AnimationFieldProps {
  animation: SlideAnimation;
  onChange: (animation: SlideAnimation) => void;
}

const THEME_OPTIONS = [
  { id: "dark", label: "Dunkel" },
  { id: "light", label: "Hell" },
] as const satisfies readonly { id: AnimationTheme; label: string }[];

const SPEED_OPTIONS = [
  { id: "calm", label: "Ruhig" },
  { id: "lively", label: "Lebhaft" },
] as const satisfies readonly { id: AnimationSpeed; label: string }[];

/** „100 %“ … „25 %“ — die Kennung ist der Wert als Text. */
const OPACITY_OPTIONS = ANIMATION_OPACITIES.map((value) => ({ id: String(value), label: `${Math.round(value * 100)} %` }));

function PatternCard({
  pattern,
  animation,
  selected,
  onSelect,
}: {
  pattern: AnimationPattern;
  animation: SlideAnimation;
  selected: boolean;
  onSelect: () => void;
}): ReactElement {
  const thumb = animationThumbnail({ ...animation, pattern });
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      data-testid={`animation-pattern-${pattern}`}
      className={cn(
        "flex flex-col gap-1.5 rounded-md border p-1.5 text-left transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        selected ? "border-primary ring-1 ring-primary" : "border-border hover:border-foreground/40",
      )}
    >
      <span className="block aspect-video w-full overflow-hidden rounded-sm bg-muted">
        {thumb !== undefined && <img src={thumb} alt="" className="block size-full object-cover" />}
      </span>
      <span className="px-0.5 text-sm font-medium text-foreground">{ANIMATION_LABELS[pattern]}</span>
      <span className="px-0.5 pb-0.5 text-xs text-muted-foreground">{ANIMATION_DESCRIPTIONS[pattern]}</span>
    </button>
  );
}

export function AnimationField({ animation, onChange }: AnimationFieldProps): ReactElement {
  const set = <K extends keyof SlideAnimation>(key: K, value: SlideAnimation[K]): void =>
    onChange({ ...animation, [key]: value });

  return (
    <div className="flex flex-col gap-4" data-testid="animation-field">
      <Field label="Muster" hint="In MAN-Farben, die Textseite links bleibt ruhig.">
        <div role="group" aria-label="Muster" className="grid grid-cols-2 gap-2">
          {ANIMATION_PATTERNS.map((pattern) => (
            <PatternCard
              key={pattern}
              pattern={pattern}
              animation={animation}
              selected={animation.pattern === pattern}
              onSelect={() => set("pattern", pattern)}
            />
          ))}
        </div>
      </Field>
      <div className="flex flex-col gap-4">
        <SegmentedField
          label="Grundton"
          hint="Auf hellem Grund steht die Schrift anthrazit."
          options={THEME_OPTIONS}
          value={animation.theme}
          onChange={(theme) => set("theme", theme)}
        />
        <SegmentedField
          label="Tempo"
          hint="Ein Durchlauf dauert 20 bzw. 12 Sekunden."
          options={SPEED_OPTIONS}
          value={animation.speed}
          onChange={(speed) => set("speed", speed)}
        />
      </div>
      <SegmentedField
        label="Deckkraft"
        hint="Unter 100 % wird die ganze Animation durchscheinend, auch das Rot; dahinter liegt der Abschnitt. Die Schriftfarbe folgt dem Grundton — passend zum Hintergrund wählen."
        options={OPACITY_OPTIONS}
        value={String(animation.opacity)}
        onChange={(value) => set("opacity", Number(value))}
      />
      <SwitchRow
        label="Rote Akzente"
        hint="Einige rote Quadrate laufen mit."
        checked={animation.accent}
        onCheckedChange={(accent) => set("accent", accent)}
      />
    </div>
  );
}
