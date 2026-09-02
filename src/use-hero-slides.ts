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
 * Das Auflösen als React-Hook.
 *
 * Die Bühne kann ihre Folien erst zeigen, wenn die News geladen sind. Solange
 * das läuft, liefert der Hook `null` — und die Aufrufer rendern nichts. Kein
 * Skelett: die Bühne ist das größte Element der Seite, und ein Platzhalter,
 * der nach 300 ms durch ein Bild ersetzt wird, springt sichtbarer als eine
 * Lücke, die sich füllt.
 */

import { useEffect, useMemo, useState } from "react";

import { HeroItem, encodeHeroItemsAttribute } from "./hero-items";
import { NewsPost, fetchChannelPosts, fetchPost, userLocales } from "./news-client";
import { ResolveDeps, resolveHeroItems } from "./resolve-hero-items";
import { Slide } from "./slides-model";

/** Was der Hook ans Netz gibt; in Tests und im Editor austauschbar. */
export interface HeroSlidesSource {
  fetchPost: (postId: string) => Promise<NewsPost | null>;
  fetchChannelPosts: (channelId: string, limit: number) => Promise<NewsPost[]>;
  locales: () => Promise<string[]>;
}

/** Die Vorgabe: die echten Endpunkte des Tenants. */
export const defaultHeroSlidesSource: HeroSlidesSource = {
  fetchPost,
  fetchChannelPosts,
  locales: userLocales,
};

/**
 * Löst die Einträge auf und liefert die Folien, sobald sie stehen.
 *
 * Neu aufgelöst wird, wenn sich die **Inhalte** der Einträge ändern, nicht bei
 * jeder neuen Array-Instanz: `renderBlock` baut die Liste bei jedem Rendern
 * neu auf, und eine Abhängigkeit auf die Instanz hieße eine Anfrage je
 * Rendervorgang.
 */
export function useHeroSlides(
  items: HeroItem[],
  source: HeroSlidesSource = defaultHeroSlidesSource,
): Slide[] | null {
  const key = useMemo(() => encodeHeroItemsAttribute(items), [items]);
  const [slides, setSlides] = useState<Slide[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const locales = await source.locales();
      const deps: ResolveDeps = {
        fetchPost: source.fetchPost,
        fetchChannelPosts: source.fetchChannelPosts,
        locales,
      };
      const resolved = await resolveHeroItems(items, deps);
      // Nach dem Abbau der Komponente — oder wenn inzwischen eine neue
      // Konfiguration läuft — wäre das Setzen ein Zustand, den niemand mehr
      // liest, und in React eine Warnung.
      if (!cancelled) setSlides(resolved);
    })();

    return () => {
      cancelled = true;
    };
    // `items` steckt in `key`; die Instanz selbst darf nicht auslösen.
  }, [key, source]);

  return slides;
}
