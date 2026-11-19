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
 * Die rechte Spalte wie im Screen: das Panel „Widget“ mit Gestaltung
 * (Höhe, volle Breite, Lage, Abstand unten) und Verhalten (Sekunden pro
 * Folie, Bedienelemente). Es bleibt in den Geräteansichten stehen, damit
 * man die Wirkung in der Vorschau sieht.
 *
 * Gezeigt wird, was gilt: die Einstellung, sonst das alte Feld, soweit es
 * lesbar war. Ist beides unbekannt, sagt die Auswahl „Wie bisher“ und der
 * Schalter sagt es im Hinweis – eine Vorgabe vorzutäuschen hieße, beim
 * nächsten Übernehmen etwas anderes zu zeigen, als die Seite zeigt.
 * Geschrieben wird eine Einstellung erst, wenn jemand sie bedient.
 */

import * as React from "react";
import { ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import { Field } from "@man/config-ui/form/field";
import type { SegmentedOption } from "@man/config-ui/form/segmented";
import { SegmentedField } from "@man/config-ui/form/segmented-field";
import { SwitchRow } from "@man/config-ui/form/switch-row";
import { InspectorPanel } from "@man/config-ui/inspector/inspector-panel";
import { Input } from "@man/config-ui/primitives/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@man/config-ui/primitives/select";
import { useConfigShell } from "@man/config-ui/shell/shell-context";
import type { ShownIssues } from "@shared/config-modal";

import type { HeroPosition } from "../attributes";
import type { BottomSpacing } from "../bottom-spacing";
import { MAX_AUTOPLAY_DELAY_SECONDS } from "../configuration-schema";
import { AUTOPLAY_DELAY_ISSUE } from "../editor-value";
import { HeroSettingKey, HeroSettings, isAutoplayDelay } from "../hero-settings";
import type { HeroHeight } from "../hero-slider";
import { DEFAULT_AUTOPLAY_DELAY_MS } from "../use-slider";

/** Der Titel des Panels; auch Ziel von „Zurück“ einer Leiste darüber. */
export const WIDGET_PANEL_TITLE = "Widget";

/** Der Titel, sobald das Panel auch den gewählten Eintrag einstellt. */
export const SETTINGS_PANEL_TITLE = "Einstellungen";

/** Der erste Reiter: die Felder des gewählten Eintrags (Folie, Beitrag, Kanal). */
export interface EntryTab {
  label: string;
  content: ReactNode;
  badge?: ReactNode;
  /** Ändert sich der Wert (ein Baustein auf der Bühne gewählt), springt das Panel auf diesen Reiter. */
  focusKey?: string | null;
}

const HEIGHT_OPTIONS: readonly { id: HeroHeight; label: string }[] = [
  { id: "small", label: "Klein (320–420 px)" },
  { id: "medium", label: "Mittel (420–560 px)" },
  { id: "large", label: "Groß (560–720 px)" },
  { id: "viewport", label: "Bildschirmhöhe" },
  { id: "section", label: "Abschnittshöhe" },
];

const POSITION_OPTIONS: readonly { id: HeroPosition; label: string }[] = [
  { id: "post", label: "Nach den Brotkrumen" },
  { id: "pre", label: "Vor den Brotkrumen" },
];

const SPACING_OPTIONS: readonly SegmentedOption<BottomSpacing>[] = [
  { id: "default", label: "Standard" },
  { id: "none", label: "Keiner" },
];

const NOT_SET = "Noch nicht hier festgelegt: es gilt, was der Block bisher hatte.";

const DEFAULT_SECONDS = DEFAULT_AUTOPLAY_DELAY_MS / 1000;

/** Ein Satz Hinweis, um „noch nicht festgelegt“ ergänzt, wenn nichts bekannt ist. */
const hintFor = (hint: string, unknown: boolean): string => (unknown ? `${hint} ${NOT_SET}` : hint);

type Set = <K extends HeroSettingKey>(key: K, value: HeroSettings[K] | undefined) => void;

interface TabProps {
  /** Was gilt: Einstellung vor altem Feld; ein fehlender Schlüssel ist unbekannt. */
  known: HeroSettings;
  set: Set;
}

interface ChoiceProps<T extends string> {
  label: string;
  hint: string;
  options: readonly { id: T; label: string }[];
  value: T | undefined;
  onChange: (value: T) => void;
  testId: string;
}

/** Eine Auswahl, die „Wie bisher“ zeigt, solange ihr Wert unbekannt ist. */
function Choice<T extends string>({ label, hint, options, value, onChange, testId }: ChoiceProps<T>): ReactElement {
  return (
    // Leer zeigt Radix den Platzhalter.
    <Select value={value ?? ""} onValueChange={(next) => onChange(next as T)}>
      <Field label={label} hint={hintFor(hint, value === undefined)}>
        <SelectTrigger className="h-10 w-full cursor-pointer" data-testid={testId}>
          <SelectValue placeholder="Wie bisher" />
        </SelectTrigger>
      </Field>
      <SelectContent position="popper">
        {options.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function DesignTab({ known, set }: TabProps): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      <Choice
        label="Höhe"
        hint="Breite Bildschirme zeigen die Bühne 21:9, schmale 4:3, begrenzt durch die Stufe. „Abschnittshöhe“ füllt den Abschnitt."
        options={HEIGHT_OPTIONS}
        value={known.height}
        onChange={(height) => set("height", height)}
        testId="hero-setting-height"
      />
      <SwitchRow
        label="Volle Breite"
        hint={hintFor(
          "Das Bild läuft über die ganze Fensterbreite, der Text bleibt auf der Fluchtlinie. In schmalen Spalten abschalten.",
          known.fullBleed === undefined,
        )}
        checked={known.fullBleed ?? true}
        onCheckedChange={(fullBleed) => set("fullBleed", fullBleed)}
        data-testid="hero-setting-full-bleed"
      />
      <Choice
        label="Lage"
        hint="„Vor den Brotkrumen“ greift nur, wenn die Bühne oben auf der Seite steht und die Seite Brotkrumen hat."
        options={POSITION_OPTIONS}
        value={known.position}
        onChange={(position) => set("position", position)}
        testId="hero-setting-position"
      />
      <SegmentedField
        label="Abstand unten"
        hint={hintFor(
          "„Keiner“ lässt den folgenden Block direkt anschließen; der Innenabstand am Ende eines Abschnitts bleibt.",
          known.bottomSpacing === undefined,
        )}
        options={SPACING_OPTIONS}
        value={known.bottomSpacing ?? "default"}
        onChange={(bottomSpacing) => set("bottomSpacing", bottomSpacing)}
      />
    </div>
  );
}

/** „7“, „7,5“ oder „7.5“; leer heißt „keine eigene Angabe“, Unlesbares wird `NaN` und fällt der Prüfung auf. */
function readSeconds(text: string): number | undefined {
  const trimmed = text.trim();
  return trimmed === "" ? undefined : Number(trimmed.replace(",", "."));
}

const formatSeconds = (value: number | undefined): string =>
  value === undefined || Number.isNaN(value) ? "" : String(value).replace(".", ",");

interface SecondsFieldProps {
  /** Die eigene Angabe; ohne sie gilt `fallback`. */
  value: number | undefined;
  fallback: number | undefined;
  onChange: (value: number | undefined) => void;
}

/**
 * Sekunden pro Folie. Hält seinen Text selbst, damit „7,“ beim Tippen nicht
 * zu „7“ wird; neu gesetzt wird er nur, wenn der Wert sich von außen ändert
 * (Rückgängig). Was ohne eigene Angabe gilt, steht als Platzhalter darin.
 */
function SecondsField({ value, fallback, onChange }: SecondsFieldProps): ReactElement {
  const { issuesVisible } = useConfigShell();
  const [text, setText] = useState(() => formatSeconds(value));
  const [reported, setReported] = useState(value);
  if (!Object.is(value, reported)) {
    setReported(value);
    setText(formatSeconds(value));
  }
  const invalid = value !== undefined && !isAutoplayDelay(value);
  const hint = `0 bis ${MAX_AUTOPLAY_DELAY_SECONDS} · 0 = kein automatischer Wechsel.`;
  return (
    <Field
      label="Sekunden pro Folie"
      hint={value === undefined ? `${hint} Leer: wie bisher.` : hint}
      error={issuesVisible && invalid ? `Erlaubt sind 0 bis ${MAX_AUTOPLAY_DELAY_SECONDS} Sekunden.` : undefined}
      className="max-w-[200px]"
    >
      <Input
        type="text"
        inputMode="decimal"
        autoComplete="off"
        className="h-10"
        data-testid="hero-setting-autoplay-delay"
        placeholder={formatSeconds(fallback ?? DEFAULT_SECONDS)}
        value={text}
        onChange={(event) => {
          const next = readSeconds(event.target.value);
          setText(event.target.value);
          setReported(next);
          onChange(next);
        }}
      />
    </Field>
  );
}

function BehaviorTab({ known, set, own }: TabProps & { own: HeroSettings }): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      <SecondsField
        value={own.autoplayDelay}
        fallback={known.autoplayDelay}
        onChange={(seconds) => set("autoplayDelay", seconds)}
      />
      <SwitchRow
        label="Bedienelemente zeigen"
        hint={hintFor(
          "Pfeile und Striche. Ohne sie blättert man mit Wischen und den Pfeiltasten.",
          known.controls === undefined,
        )}
        checked={known.controls ?? true}
        onCheckedChange={(controls) => set("controls", controls)}
        data-testid="hero-setting-controls"
      />
    </div>
  );
}

/** Die rote Marke am Reiter, wenn darin ein gezeigter Fehler steht. */
function IssueBadge(): ReactElement {
  return (
    <>
      <span
        aria-hidden
        className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[11px] font-semibold text-white"
      >
        1
      </span>
      <span className="sr-only">, 1 Fehler</span>
    </>
  );
}

type TabId = "entry" | "design" | "behavior";

/**
 * Der offene Reiter: anfangs der Eintrag (falls es einen gibt), nach
 * gescheitertem Übernehmen der mit dem ersten Fehler.
 */
function useTab(shownIssues: ShownIssues | null, hasEntry: boolean): [TabId, (tab: string) => void] {
  const [tab, setTab] = useState<TabId>(hasEntry ? "entry" : "design");
  useEffect(() => {
    const first = shownIssues?.issues[0]?.id;
    if (first === AUTOPLAY_DELAY_ISSUE) setTab("behavior");
    else if (first !== undefined && hasEntry) setTab("entry");
  }, [shownIssues, hasEntry]);
  // Kommt der erste Eintrag hinzu (Dialog leer geöffnet, dann „Neu“), will man
  // ihn einstellen — nicht weiter die Gestaltung sehen.
  const hadEntry = useRef(hasEntry);
  useEffect(() => {
    if (hasEntry && !hadEntry.current) setTab("entry");
    hadEntry.current = hasEntry;
  }, [hasEntry]);
  // Verschwindet der Eintrag (letzter gelöscht), steht sonst ein leerer Reiter offen.
  const current = tab === "entry" && !hasEntry ? "design" : tab;
  return [current, (next) => setTab(next === "behavior" || next === "entry" ? next : "design")];
}

export interface WidgetSettingsPanelProps {
  settings: HeroSettings;
  /** Was die alten Felder lesbar trugen. */
  legacy: HeroSettings;
  onChange: (settings: HeroSettings) => void;
  /** Das letzte gescheiterte Übernehmen; siehe `@shared/config-modal`. */
  shownIssues?: ShownIssues | null;
  /** Felder des gewählten Eintrags als erster Reiter; ohne Eintrag nur das Widget. */
  entryTab?: EntryTab;
}

export function WidgetSettingsPanel({
  settings,
  legacy,
  onChange,
  shownIssues = null,
  entryTab,
}: WidgetSettingsPanelProps): ReactElement {
  const { issuesVisible } = useConfigShell();
  const [tab, setTab] = useTab(shownIssues, entryTab !== undefined);
  const focusKey = entryTab?.focusKey ?? null;
  useEffect(() => {
    // Gemeint ist nur der Wechsel des Schlüssels; `setTab` ist je Rendern neu.
    if (focusKey !== null) setTab("entry");
  }, [focusKey]);
  const known: HeroSettings = { ...legacy, ...settings };
  const set: Set = (key, value) => {
    // Leer heißt „wie bisher“: dann fällt der Schlüssel weg, statt `undefined` zu tragen.
    const rest = Object.fromEntries(Object.entries(settings).filter(([name]) => name !== key)) as HeroSettings;
    onChange(value === undefined ? rest : { ...rest, [key]: value });
  };
  const delayInvalid = settings.autoplayDelay !== undefined && !isAutoplayDelay(settings.autoplayDelay);

  return (
    <InspectorPanel
      title={entryTab === undefined ? WIDGET_PANEL_TITLE : SETTINGS_PANEL_TITLE}
      selectedTab={tab}
      onTabChange={setTab}
      tabs={[
        ...(entryTab === undefined ? [] : [{ id: "entry", label: entryTab.label, content: entryTab.content, badge: entryTab.badge }]),
        { id: "design", label: "Gestaltung", content: <DesignTab known={known} set={set} /> },
        {
          id: "behavior",
          label: "Verhalten",
          badge: issuesVisible && delayInvalid ? <IssueBadge /> : undefined,
          content: <BehaviorTab known={known} own={settings} set={set} />,
        },
      ]}
    />
  );
}
