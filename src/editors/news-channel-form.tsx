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
 * Die Felder eines ganzen News-Kanals.
 *
 * Anders als beim einzelnen Beitrag steht hier nicht fest, was auf der Bühne
 * landet: der Eintrag ist eine Anweisung, keine Folie. Die Vorschau ist
 * deshalb kein Zierat, sondern die einzige Stelle, an der man sieht, was die
 * Filter übrig lassen.
 */

import * as React from "react";
import { ReactElement } from "react";

import { DEFAULT_CTA_LABEL, MAX_CHANNEL_COUNT, NewsChannelItem } from "../hero-items";
import { IdSelect } from "./id-select";
import { NewsPreview } from "./news-preview";
import { NewsSource, useNewsChannels } from "./news-source";

export interface NewsChannelFormProps {
  item: NewsChannelItem;
  onPatch: (changes: Partial<NewsChannelItem>) => void;
  source: NewsSource;
}

/** „#a, b“ wird zu `["a", "b"]`; leere Angaben fallen weg. */
export function parseHashtagInput(raw: string): string[] {
  return raw
    .split(",")
    .map((tag) => tag.trim().replace(/^#/, ""))
    .filter((tag) => tag !== "");
}

export function NewsChannelForm({
  item,
  onPatch,
  source,
}: NewsChannelFormProps): ReactElement {
  const channels = useNewsChannels(source);

  return (
    <>
      <IdSelect
        label="Kanal"
        hint="Alle Beiträge dieses Kanals kommen als eigene Folien auf die Bühne."
        value={item.channelId}
        options={channels.entries.map((channel) => ({ id: channel.id, title: channel.title }))}
        loading={channels.loading}
        placeholder="Kanal wählen …"
        unavailableNotice="Die Kanalliste ist hier nicht erreichbar. Trage die Kennung des Kanals ein."
        onChange={(channelId) => onPatch({ channelId })}
        testId="news-channel-channel"
      />

      <label className="man-se__field">
        <span className="man-se__label">Anzahl der Folien</span>
        <p className="man-se__hint">
          Höchstens {MAX_CHANNEL_COUNT}; zusammen mit den übrigen Einträgen zeigt die Bühne nie
          mehr als {MAX_CHANNEL_COUNT} Folien.
        </p>
        <input
          type="number"
          className="man-se__input"
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
      </label>

      <label className="man-se__field">
        <span className="man-se__label">Reihenfolge</span>
        <select
          className="man-se__input man-se__select"
          data-testid="news-channel-order"
          value={item.order}
          onChange={(event) =>
            onPatch({ order: event.target.value === "oldest" ? "oldest" : "newest" })
          }
        >
          <option value="newest">Neueste zuerst</option>
          <option value="oldest">Älteste zuerst</option>
        </select>
      </label>

      <fieldset className="man-se__field man-se__fieldset">
        <legend className="man-se__label">Filter</legend>

        <label className="man-se__check">
          <input
            type="checkbox"
            data-testid="news-channel-highlighted"
            checked={item.onlyHighlighted === true}
            onChange={(event) =>
              onPatch({ onlyHighlighted: event.target.checked ? true : undefined })
            }
          />
          Nur hervorgehobene Beiträge
        </label>

        <label className="man-se__check">
          <input
            type="checkbox"
            data-testid="news-channel-require-image"
            checked={item.requireImage !== false}
            onChange={(event) =>
              onPatch({ requireImage: event.target.checked ? undefined : false })
            }
          />
          Nur Beiträge mit Bild
        </label>
        <p className="man-se__hint">
          Ohne Bild bleibt von der Folie nur eine dunkle Fläche mit Text. Abschalten nur, wenn das
          gewollt ist.
        </p>

        <label className="man-se__sub">
          <span className="man-se__label">Schlagworte (optional)</span>
          <p className="man-se__hint">
            Mehrere durch Komma trennen. Ein Beitrag genügt, wenn er eines davon trägt.
          </p>
          <input
            type="text"
            className="man-se__input"
            data-testid="news-channel-hashtags"
            value={(item.hashtags ?? []).join(", ")}
            onChange={(event) => {
              const hashtags = parseHashtagInput(event.target.value);
              onPatch({ hashtags: hashtags.length > 0 ? hashtags : undefined });
            }}
            placeholder="trucks, elektro"
          />
        </label>
      </fieldset>

      <label className="man-se__check">
        <input
          type="checkbox"
          data-testid="news-channel-teaser"
          checked={item.showTeaser !== false}
          onChange={(event) => onPatch({ showTeaser: event.target.checked ? undefined : false })}
        />
        Teaser als Unterzeile zeigen
      </label>

      <label className="man-se__field">
        <span className="man-se__label">Beschriftung der Schaltfläche</span>
        <p className="man-se__hint">
          Gilt für alle Folien dieses Kanals. Leer lassen, um die Schaltfläche wegzulassen.
        </p>
        <input
          type="text"
          className="man-se__input"
          data-testid="news-channel-cta"
          value={item.ctaLabel ?? DEFAULT_CTA_LABEL}
          onChange={(event) => onPatch({ ctaLabel: event.target.value })}
        />
      </label>

      <NewsPreview
        item={item}
        source={source}
        ready={item.channelId !== ""}
        emptyHint="Wähle einen Kanal, dann steht hier, welche Beiträge auf die Bühne kommen."
      />
    </>
  );
}
