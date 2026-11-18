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
 * Die Felder eines ganzen News-Kanals, wie im Screen: Quelle, Auswahl,
 * Darstellung.
 *
 * Anders als beim einzelnen Beitrag steht hier nicht fest, was auf der Bühne
 * landet: der Eintrag ist eine Anweisung, keine Folie. Was die Filter übrig
 * lassen, zeigt die rechte Spalte daneben (`entry-preview.tsx`).
 */

import * as React from "react";
import { ReactElement } from "react";
import { Field } from "@man/config-ui/form/field";
import { FormSection } from "@man/config-ui/form/form-section";
import type { SegmentedOption } from "@man/config-ui/form/segmented";
import { SegmentedField } from "@man/config-ui/form/segmented-field";
import { SwitchRow } from "@man/config-ui/form/switch-row";
import { Input } from "@man/config-ui/primitives/input";
import { useConfigShell } from "@man/config-ui/shell/shell-context";

import { DEFAULT_CTA_LABEL, MAX_CHANNEL_COUNT, NewsChannelItem } from "../hero-items";
import { IdSelect } from "./id-select";
import { NewsSource, useNewsChannels } from "./news-source";

export interface NewsChannelFormProps {
  item: NewsChannelItem;
  onPatch: (changes: Partial<NewsChannelItem>) => void;
  source: NewsSource;
}

type ChannelOrder = NewsChannelItem["order"];

const ORDER_OPTIONS: readonly SegmentedOption<ChannelOrder>[] = [
  { id: "newest", label: "Neueste zuerst" },
  { id: "oldest", label: "Älteste zuerst" },
];

/** „#a, b“ wird zu `["a", "b"]`; leere Angaben fallen weg. */
export function parseHashtagInput(raw: string): string[] {
  return raw
    .split(",")
    .map((tag) => tag.trim().replace(/^#/, ""))
    .filter((tag) => tag !== "");
}

function SourceSection({ item, onPatch, source }: NewsChannelFormProps): ReactElement {
  const { issuesVisible } = useConfigShell();
  const channels = useNewsChannels(source);
  return (
    <FormSection title="Quelle">
      <IdSelect
        label="Kanal"
        required
        hint="Jeder Beitrag dieses Kanals wird eine eigene Folie."
        error={issuesVisible && item.channelId.trim() === "" ? "Ohne Kanal wird dieser Eintrag nicht gezeigt." : undefined}
        value={item.channelId}
        options={channels.entries.map((channel) => ({ id: channel.id, title: channel.title }))}
        loading={channels.loading}
        placeholder="Kanal wählen …"
        unavailableNotice="Die Kanalliste ist hier nicht erreichbar. Trage die Kennung des Kanals ein."
        onChange={(channelId) => onPatch({ channelId })}
        testId="news-channel-channel"
      />
      <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
        <Field
          label="Anzahl Beiträge"
          hint={`1 bis ${MAX_CHANNEL_COUNT}; mit den übrigen Einträgen zeigt die Bühne nie mehr als ${MAX_CHANNEL_COUNT} Folien.`}
        >
          <Input
            type="number"
            inputMode="numeric"
            data-testid="news-channel-count"
            min={1}
            max={MAX_CHANNEL_COUNT}
            value={item.count}
            onChange={(event) => {
              const count = Number.parseInt(event.target.value, 10);
              if (!Number.isFinite(count)) return;
              onPatch({ count: Math.min(Math.max(count, 1), MAX_CHANNEL_COUNT) });
            }}
          />
        </Field>
        <SegmentedField
          label="Reihenfolge"
          options={ORDER_OPTIONS}
          value={item.order}
          onChange={(order) => onPatch({ order })}
        />
      </div>
    </FormSection>
  );
}

function SelectionSection({ item, onPatch }: Omit<NewsChannelFormProps, "source">): ReactElement {
  return (
    <FormSection title="Auswahl">
      <SwitchRow
        label="Nur hervorgehobene Beiträge"
        data-testid="news-channel-highlighted"
        checked={item.onlyHighlighted === true}
        onCheckedChange={(checked) => onPatch({ onlyHighlighted: checked ? true : undefined })}
      />
      <SwitchRow
        label="Nur Beiträge mit Bild"
        hint="Ohne Bild bleibt von der Folie nur eine dunkle Fläche mit Text."
        data-testid="news-channel-require-image"
        checked={item.requireImage !== false}
        onCheckedChange={(checked) => onPatch({ requireImage: checked ? undefined : false })}
      />
      <Field
        label="Hashtags"
        hint="Mehrere durch Komma trennen; ein Beitrag genügt, wenn er einen davon trägt. Leer = alle Beiträge des Kanals."
      >
        <Input
          type="text"
          data-testid="news-channel-hashtags"
          value={(item.hashtags ?? []).join(", ")}
          onChange={(event) => {
            const hashtags = parseHashtagInput(event.target.value);
            onPatch({ hashtags: hashtags.length > 0 ? hashtags : undefined });
          }}
          placeholder="trucks, elektro"
        />
      </Field>
    </FormSection>
  );
}

function DisplaySection({ item, onPatch }: Omit<NewsChannelFormProps, "source">): ReactElement {
  return (
    <FormSection title="Darstellung">
      <SwitchRow
        label="Anrisstext zeigen"
        hint="Als Unterzeile unter der Überschrift."
        data-testid="news-channel-teaser"
        checked={item.showTeaser !== false}
        onCheckedChange={(checked) => onPatch({ showTeaser: checked ? undefined : false })}
      />
      <Field
        className="max-w-[360px]"
        label="Beschriftung des Buttons"
        hint="Gilt für alle Folien dieses Kanals. Leer lassen, um den Button wegzulassen."
      >
        <Input
          type="text"
          data-testid="news-channel-cta"
          value={item.ctaLabel ?? DEFAULT_CTA_LABEL}
          onChange={(event) => onPatch({ ctaLabel: event.target.value })}
        />
      </Field>
    </FormSection>
  );
}

export function NewsChannelForm({ item, onPatch, source }: NewsChannelFormProps): ReactElement {
  return (
    <>
      <SourceSection item={item} onPatch={onPatch} source={source} />
      <SelectionSection item={item} onPatch={onPatch} />
      <DisplaySection item={item} onPatch={onPatch} />
    </>
  );
}
