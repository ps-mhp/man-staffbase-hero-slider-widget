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
 * Wie ein Eintrag in der Liste links heißt.
 *
 * Eine Folie trägt ihre Überschrift bei sich; ein News-Eintrag trägt nur
 * Kennungen. „Beitrag 6a5e6703cb02c92e74be1eaa" wäre in einer Liste von acht
 * Einträgen nutzlos — deshalb werden Kanalname und Beitragstitel nachgeladen.
 * Bis sie da sind, steht die Kennung dort: ein Ladezustand je Zeile wäre
 * unruhiger als der kurze Wechsel des Textes.
 */

import { useEffect, useState } from "react";

import { HeroItem, heroItemType, isNewsChannelItem, isNewsPostItem, isSlideItem } from "../hero-items";
import { documentLocales } from "../news-client";
import { pickPostContent } from "../news-slides";
import { NewsSource, useNewsChannels } from "./news-source";

export interface ItemLabel {
  /** Kurzwort für die Sorte, steht als Marke in der Zeile. */
  kind: string;
  title: string;
  thumbUrl: string | undefined;
}

const KIND_TEXT: Record<string, string> = {
  slide: "Folie",
  "news-post": "Post",
  "news-channel": "Kanal",
};

export function useItemLabels(items: HeroItem[], source: NewsSource): ItemLabel[] {
  const channels = useNewsChannels(source, items.some(isNewsChannelItem));
  const [postTitles, setPostTitles] = useState<Record<string, string>>({});

  // Die Kennungen, nicht die Einträge: sonst liefe der Effekt bei jedem
  // Tastendruck in einem anderen Feld erneut.
  const postIds = items
    .filter(isNewsPostItem)
    .map((item) => item.postId)
    .filter((id) => id !== "")
    .join(",");

  useEffect(() => {
    if (postIds === "") return undefined;

    let cancelled = false;

    void (async () => {
      const ids = [...new Set(postIds.split(","))];
      const locales = documentLocales();
      const found: Record<string, string> = {};

      await Promise.all(
        ids.map(async (id) => {
          const post = await source.post(id);
          if (post === null) return;
          const title = pickPostContent(post.contents, locales)?.title?.trim();
          if (title !== undefined && title !== "") found[id] = title;
        }),
      );

      if (!cancelled) setPostTitles((known) => ({ ...known, ...found }));
    })();

    return () => {
      cancelled = true;
    };
  }, [postIds, source]);

  return items.map((item) => {
    const kind = KIND_TEXT[heroItemType(item)] ?? "Eintrag";

    if (isSlideItem(item)) {
      return {
        kind,
        title: item.headline.trim() === "" ? "Ohne Überschrift" : item.headline,
        thumbUrl: item.image.url === "" ? undefined : item.image.url,
      };
    }

    if (isNewsPostItem(item)) {
      const fallback = item.postId === "" ? "Kein Beitrag gewählt" : item.postId;
      const headline = item.headline?.trim();
      return {
        kind,
        title:
          headline !== undefined && headline !== ""
            ? headline
            : (postTitles[item.postId] ?? fallback),
        thumbUrl: item.imageOverride?.url,
      };
    }

    if (isNewsChannelItem(item)) {
      const channel = channels.entries.find((entry) => entry.id === item.channelId);
      const name =
        channel?.title ?? (item.channelId === "" ? "Kein Kanal gewählt" : item.channelId);
      return {
        kind,
        title: `${name} · ${String(item.count)} Beiträge`,
        thumbUrl: undefined,
      };
    }

    return { kind, title: "Unbekannter Eintrag", thumbUrl: undefined };
  });
}
