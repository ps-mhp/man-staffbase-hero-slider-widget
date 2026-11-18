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
 * Was das Modal bearbeitet: die Einträge, die Einstellungen der Bühne und –
 * nur zur Anzeige – was die alten Felder beim Öffnen trugen. Dazu Prüfung
 * und Status für den Rahmen.
 *
 * Liegt im Seitenbündel, weil der Injektor Prüfung und Status braucht,
 * bevor der Editor nachgeladen ist – deshalb nichts Schweres importieren.
 */

import type { ValidationIssue } from "@man/config-ui/shell/shell-context";

import { MAX_AUTOPLAY_DELAY_SECONDS } from "./configuration-schema";
import { changesStatus, validateHeroItems } from "./editor-entries";
import { HeroItem, serializeHeroItems } from "./hero-items";
import { HeroContent, HeroSettings, encodeHeroContent, isAutoplayDelay, parseHeroContent } from "./hero-settings";

export interface HeroEditorValue extends HeroContent {
  /**
   * Was die alten Felder des Dialogs beim Öffnen lesbar trugen. Nur zur
   * Anzeige dessen, was ohne Einstellung gilt; geschrieben wird es nie.
   */
  legacy: HeroSettings;
}

/** Kennung des Fehlers an „Sekunden pro Folie“. */
export const AUTOPLAY_DELAY_ISSUE = "autoplay-delay";

/** Liest das Feld samt dem, was die alten Felder gerade tragen. */
export function readEditorValue(raw: string, legacy: HeroSettings): HeroEditorValue {
  return { ...parseHeroContent(raw), legacy };
}

/** Schreibt das Feld; `legacy` bleibt draußen. */
export const writeEditorValue = ({ items, settings }: HeroEditorValue): string =>
  encodeHeroContent({ items, settings });

/** Die Fehler der Einträge, dann die der Einstellungen. */
export function validateHeroEditor({ items, settings }: HeroEditorValue): ValidationIssue[] {
  const { autoplayDelay } = settings;
  const delayIssue: ValidationIssue[] =
    autoplayDelay === undefined || isAutoplayDelay(autoplayDelay)
      ? []
      : [
          {
            id: AUTOPLAY_DELAY_ISSUE,
            message: `Sekunden pro Folie: erlaubt sind 0 bis ${MAX_AUTOPLAY_DELAY_SECONDS}`,
          },
        ];
  return [...validateHeroItems(items), ...delayIssue];
}

const sameSettings = (a: HeroSettings, b: HeroSettings): boolean =>
  encodeHeroContent({ items: [], settings: a }) === encodeHeroContent({ items: [], settings: b });

const sameItems = (a: HeroItem[], b: HeroItem[]): boolean => serializeHeroItems(a) === serializeHeroItems(b);

/**
 * Der Status, solange etwas offen ist: was sich an den Einträgen geändert
 * hat (`changesStatus`), und ob die Einstellungen anders sind.
 */
export function heroEditorStatus(draft: HeroEditorValue, saved: HeroEditorValue): string {
  const settingsChanged = !sameSettings(draft.settings, saved.settings);
  if (sameItems(draft.items, saved.items)) {
    return settingsChanged ? "Einstellungen geändert" : changesStatus(draft.items, saved.items);
  }
  const items = changesStatus(draft.items, saved.items);
  return settingsChanged ? `${items} · Einstellungen` : items;
}
