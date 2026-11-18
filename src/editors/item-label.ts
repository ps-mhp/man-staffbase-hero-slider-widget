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
 * Einträgen nutzlos — deshalb werden Kanalname, Beitragstitel und
 * Beitragsbild nachgeladen. Bis sie da sind, steht die Kennung dort: ein
 * Ladezustand je Zeile wäre unruhiger als der kurze Wechsel des Textes.
 *
 * Die Unterzeile folgt dem Screen: Sorte, dann das, woran man den Eintrag
 * wiedererkennt („Folie · 2 Buttons“, „News-Beitrag · Kanal Produkte“,
 * „News-Kanal · 3 neueste“).
 */

import { useEffect, useState } from "react";

import {
  HeroItem,
  HeroItemType,
  NewsChannelItem,
  NewsPostItem,
  SlideItem,
  heroItemType,
  isNewsChannelItem,
  isNewsPostItem,
  isSlideItem,
} from "../hero-items";
import { documentLocales } from "@shared/staffbase/posts";
import type { NewsChannel } from "@shared/staffbase/channels";
import { entryKindName } from "../editor-entries";
import { pickPostContent, pickPostImage } from "../news-slides";
import { isVideo } from "../slides-model";
import { NewsSource, useNewsChannels } from "./news-source";

export interface ItemLabel {
  type: HeroItemType;
  /** Die Sorte ausgeschrieben, wie im Menü „Neu“. */
  kind: string;
  title: string;
  /** Sorte und Erkennungszeichen, etwa „Folie · 2 Buttons“. */
  description: string;
  thumbUrl: string | undefined;
  /** Zeigt `thumbUrl` auf ein Video? Dann braucht die Zeile ein `<video>`. */
  thumbVideo: boolean;
}

/** Was von einem Beitrag in der Liste steht. */
interface PostFacts {
  title?: string;
  imageUrl?: string;
}

const buttonCount = (count: number): string => (count === 1 ? "1 Button" : `${count} Buttons`);

function slideLabel(item: SlideItem, kind: string): Omit<ItemLabel, "type"> {
  const buttons = item.ctas?.length ?? 0;
  return {
    kind,
    title: item.headline.trim() === "" ? "Ohne Überschrift" : item.headline,
    description: buttons > 0 ? `${kind} · ${buttonCount(buttons)}` : kind,
    thumbUrl: item.image.url === "" ? undefined : item.image.url,
    thumbVideo: isVideo(item.image),
  };
}

function postLabel(item: NewsPostItem, kind: string, facts: PostFacts | undefined, channels: NewsChannel[]): Omit<ItemLabel, "type"> {
  const fallback = item.postId === "" ? "Kein Beitrag gewählt" : item.postId;
  const headline = item.headline?.trim();
  const channel = channels.find((entry) => entry.id === item.channelId)?.title;
  const override = item.imageOverride;
  return {
    kind,
    title: headline !== undefined && headline !== "" ? headline : (facts?.title ?? fallback),
    description: channel === undefined ? kind : `${kind} · Kanal ${channel}`,
    thumbUrl: override?.url ?? facts?.imageUrl,
    thumbVideo: override !== undefined && isVideo(override),
  };
}

function channelLabel(item: NewsChannelItem, kind: string, channels: NewsChannel[]): Omit<ItemLabel, "type"> {
  const channel = channels.find((entry) => entry.id === item.channelId);
  return {
    kind,
    title: channel?.title ?? (item.channelId === "" ? "Kein Kanal gewählt" : item.channelId),
    description: `${kind} · ${String(item.count)} ${item.order === "oldest" ? "älteste" : "neueste"}`,
    thumbUrl: undefined,
    thumbVideo: false,
  };
}

/** Titel und Bild der gewählten Beiträge, nachgeladen über ihre Kennungen. */
function usePostFacts(items: HeroItem[], source: NewsSource): Record<string, PostFacts> {
  const [facts, setFacts] = useState<Record<string, PostFacts>>({});

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
      const found: Record<string, PostFacts> = {};

      await Promise.all(
        ids.map(async (id) => {
          const post = await source.post(id);
          if (post === null) return;
          const content = pickPostContent(post.contents, locales);
          const title = content?.title?.trim();
          const imageUrl = pickPostImage(content)?.url;
          found[id] = {
            ...(title !== undefined && title !== "" ? { title } : {}),
            ...(imageUrl !== undefined ? { imageUrl } : {}),
          };
        }),
      );

      if (!cancelled) setFacts((known) => ({ ...known, ...found }));
    })();

    return () => {
      cancelled = true;
    };
  }, [postIds, source]);

  return facts;
}

export function useItemLabels(items: HeroItem[], source: NewsSource): ItemLabel[] {
  const needsChannels = items.some((item) => isNewsChannelItem(item) || (isNewsPostItem(item) && item.channelId !== ""));
  const channels = useNewsChannels(source, needsChannels).entries;
  const facts = usePostFacts(items, source);

  return items.map((item) => {
    const type = heroItemType(item);
    const kind = entryKindName(item);
    if (isSlideItem(item)) return { type, ...slideLabel(item, kind) };
    if (isNewsPostItem(item)) return { type, ...postLabel(item, kind, facts[item.postId], channels) };
    if (isNewsChannelItem(item)) return { type, ...channelLabel(item, kind, channels) };
    return { type, kind, title: "Unbekannter Eintrag", description: kind, thumbUrl: undefined, thumbVideo: false };
  });
}
