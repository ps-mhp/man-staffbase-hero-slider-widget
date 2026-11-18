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
 * Was ein Eintrag auf der Bühne ergeben wird – als Folien.
 *
 * Eine Folie ist das schon. Ein News-Eintrag wird es erst über denselben
 * Auflöser wie die Leseansicht: eine zweite Umrechnung wäre eine zweite
 * Wahrheit, und genau die Abweichung zwischen Vorschau und Ergebnis wäre der
 * Fehler, den niemand findet. Vorschau im Gerät und rechte Spalte teilen sich
 * diesen Haken.
 */

import { useEffect, useState } from "react";

import { HeroItem, isNewsChannelItem, isNewsPostItem, isSlideItem } from "../hero-items";
import { resolveHeroItems } from "../resolve-hero-items";
import { Slide } from "../slides-model";
import { NewsSource } from "./news-source";

export type ResolvedSlides =
  /** Es fehlt, woraus sich Folien ergäben: kein Eintrag, kein Beitrag, kein Kanal. */
  | { state: "idle" }
  | { state: "loading" }
  | { state: "ready"; slides: Slide[] };

const IDLE: ResolvedSlides = { state: "idle" };
const LOADING: ResolvedSlides = { state: "loading" };

/** Hat der News-Eintrag, was er zum Auflösen braucht? */
function isReady(item: HeroItem): boolean {
  if (isNewsPostItem(item)) return item.postId.trim() !== "";
  if (isNewsChannelItem(item)) return item.channelId.trim() !== "";
  return false;
}

export function useResolvedSlides(item: HeroItem | undefined, source: NewsSource): ResolvedSlides {
  const [resolved, setResolved] = useState<{ key: string; slides: Slide[] } | null>(null);
  const news = item !== undefined && !isSlideItem(item) && isReady(item);
  // Der Eintrag selbst ist bei jedem Tastendruck ein neues Objekt; seine
  // serialisierte Form ändert sich nur, wenn wirklich etwas anders ist.
  const key = news ? JSON.stringify(item) : "";

  useEffect(() => {
    if (key === "") return undefined;
    let cancelled = false;

    void (async () => {
      const locales = await source.locales();
      const slides = await resolveHeroItems([JSON.parse(key) as HeroItem], {
        fetchPost: source.post,
        fetchChannelPosts: source.posts,
        locales,
      });
      if (!cancelled) setResolved({ key, slides });
    })();

    return () => {
      cancelled = true;
    };
  }, [key, source]);

  if (item === undefined) return IDLE;
  if (isSlideItem(item)) return { state: "ready", slides: [item] };
  if (!news) return IDLE;
  // Ein Ergebnis zu einem älteren Stand des Eintrags gilt nicht mehr.
  return resolved?.key === key ? { state: "ready", slides: resolved.slides } : LOADING;
}
