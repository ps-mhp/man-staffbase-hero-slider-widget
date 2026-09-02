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
 * Die Felder eines einzelnen News-Beitrags.
 *
 * Zuerst Kanal, dann Beitrag: die Beitragsliste eines ganzen Tenants wäre für
 * eine Auswahl unbrauchbar lang, und Redakteur:innen denken ohnehin vom Kanal
 * her.
 */

import * as React from "react";
import { ReactElement } from "react";

import { DEFAULT_CTA_LABEL, NewsPostItem } from "../hero-items";
import { documentLocales } from "../news-client";
import { pickPostContent } from "../news-slides";
import { ImageField } from "./image-field";
import { IdSelect, IdSelectOption } from "./id-select";
import { NewsPreview } from "./news-preview";
import { NewsSource, useChannelPosts, useNewsChannels } from "./news-source";

/** Welches Bild eines News-Eintrags der Picker gerade füllt. */
export type NewsPickerTarget = "imageOverride" | "imagePortrait";

export interface NewsPostFormProps {
  item: NewsPostItem;
  onPatch: (changes: Partial<NewsPostItem>) => void;
  onPick: (target: NewsPickerTarget) => void;
  source: NewsSource;
}

export function NewsPostForm({
  item,
  onPatch,
  onPick,
  source,
}: NewsPostFormProps): ReactElement {
  const channels = useNewsChannels(source);
  const posts = useChannelPosts(source, item.channelId);

  const postOptions: IdSelectOption[] = posts.entries.map((post) => {
    // Die Titel der Auswahl folgen der Sprache der Seite, nicht der der
    // lesenden Person: der Dialog steht vor der Redaktion, nicht vor ihr.
    const title = pickPostContent(post.contents, documentLocales())?.title?.trim();
    return { id: post.id, title: title === undefined || title === "" ? post.id : title };
  });

  return (
    <>
      <IdSelect
        label="Kanal"
        hint="Bestimmt, welche Beiträge zur Auswahl stehen."
        value={item.channelId}
        options={channels.entries.map((channel) => ({ id: channel.id, title: channel.title }))}
        loading={channels.loading}
        placeholder="Kanal wählen …"
        unavailableNotice="Die Kanalliste ist hier nicht erreichbar. Trage die Kennung des Kanals ein."
        // Der Beitrag gehört zum alten Kanal; ihn stehen zu lassen hieße, eine
        // Auswahl anzuzeigen, die zur Liste darunter nicht passt.
        onChange={(channelId) => onPatch({ channelId, postId: "" })}
        testId="news-post-channel"
      />

      <IdSelect
        label="Beitrag"
        hint="Die fünfzig jüngsten Beiträge des Kanals, neueste zuerst."
        value={item.postId}
        options={postOptions}
        loading={posts.loading}
        disabled={item.channelId === ""}
        placeholder={item.channelId === "" ? "Erst einen Kanal wählen …" : "Beitrag wählen …"}
        unavailableNotice="Die Beitragsliste ist hier nicht erreichbar. Trage die Kennung des Beitrags ein."
        onChange={(postId) => onPatch({ postId })}
        testId="news-post-post"
      />

      <NewsPreview
        item={item}
        source={source}
        ready={item.postId !== ""}
        emptyHint="Wähle einen Beitrag, dann steht hier, was auf der Bühne erscheint."
      />

      <label className="man-se__field">
        <span className="man-se__label">Überschrift überschreiben (optional)</span>
        <p className="man-se__hint">Leer lassen, um den Titel des Beitrags zu übernehmen.</p>
        <input
          type="text"
          className="man-se__input"
          data-testid="news-post-headline"
          value={item.headline ?? ""}
          onChange={(event) =>
            onPatch({ headline: event.target.value === "" ? undefined : event.target.value })
          }
        />
      </label>

      <label className="man-se__check">
        <input
          type="checkbox"
          data-testid="news-post-teaser"
          checked={item.showTeaser !== false}
          onChange={(event) => onPatch({ showTeaser: event.target.checked ? undefined : false })}
        />
        Teaser als Unterzeile zeigen
      </label>

      <label className="man-se__field">
        <span className="man-se__label">Beschriftung der Schaltfläche</span>
        <p className="man-se__hint">
          Leer lassen, um die Schaltfläche wegzulassen. Das Ziel ist immer der Beitrag selbst.
        </p>
        <input
          type="text"
          className="man-se__input"
          data-testid="news-post-cta"
          value={item.ctaLabel ?? DEFAULT_CTA_LABEL}
          onChange={(event) => onPatch({ ctaLabel: event.target.value })}
        />
      </label>

      <ImageField
        label="Bühnenbild überschreiben (optional)"
        hint="Das Beitragsbild ist fürs Feed geschnitten. Für eine hohe Bühne lohnt ein eigenes, quer und mindestens 1920 px breit."
        image={item.imageOverride}
        onPick={() => onPick("imageOverride")}
        onClear={() => onPatch({ imageOverride: undefined })}
        onAltChange={(alt) =>
          onPatch({
            imageOverride:
              item.imageOverride === undefined ? undefined : { ...item.imageOverride, alt },
          })
        }
        testId="news-post-image"
      />

      <ImageField
        label="Bild für Hochformat (optional)"
        hint="Wird auf schmalen, stehenden Bildschirmen gezeigt."
        image={item.imagePortrait}
        onPick={() => onPick("imagePortrait")}
        onClear={() => onPatch({ imagePortrait: undefined })}
        onAltChange={(alt) =>
          onPatch({
            imagePortrait:
              item.imagePortrait === undefined ? undefined : { ...item.imagePortrait, alt },
          })
        }
        testId="news-post-portrait"
      />
    </>
  );
}
