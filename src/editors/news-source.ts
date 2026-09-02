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
 * Woher die News-Formulare ihre Daten beziehen.
 *
 * Zusammengefasst in einem Objekt, damit der Editor im Test ohne Netz läuft
 * und im Dialog gegen dieselben Endpunkte wie die Leseansicht.
 */

import { useEffect, useState } from "react";

import { NewsChannel, NewsPost, fetchChannelPosts, fetchNewsChannels, fetchPost, userLocales } from "../news-client";

export interface NewsSource {
  channels: () => Promise<NewsChannel[]>;
  /** Beiträge eines Kanals, neueste zuerst. */
  posts: (channelId: string, limit: number) => Promise<NewsPost[]>;
  post: (postId: string) => Promise<NewsPost | null>;
  locales: () => Promise<string[]>;
}

export const defaultNewsSource: NewsSource = {
  channels: fetchNewsChannels,
  posts: fetchChannelPosts,
  post: fetchPost,
  locales: userLocales,
};

/** Wie viele Beiträge die Auswahl eines Kanals anbietet. */
export const POST_OPTION_LIMIT = 50;

/**
 * Dieselbe Quelle, aber jede Frage nur einmal.
 *
 * Im Dialog fragen mehrere Stellen nach denselben Daten: die Liste links nach
 * den Kanalnamen, das Formular rechts nach derselben Liste, die Vorschau nach
 * denselben Beiträgen. Ohne diese Schicht wäre jeder Tastendruck im
 * Überschriftfeld ein neuer Netzaufruf. Gepuffert werden die Zusagen, nicht
 * die Ergebnisse — sonst liefen gleichzeitige Fragen doch wieder doppelt.
 *
 * Der Puffer lebt so lange wie der geöffnete Dialog. Beiträge, die währenddessen
 * im CMS entstehen, fehlen also in der Auswahl; das ist der Preis dafür, dass
 * der Dialog nicht bei jedem Zeichen ins Netz greift.
 */
export function cacheNewsSource(source: NewsSource): NewsSource {
  const channels = new Map<string, Promise<NewsChannel[]>>();
  const posts = new Map<string, Promise<NewsPost[]>>();
  const post = new Map<string, Promise<NewsPost | null>>();
  let locales: Promise<string[]> | undefined;

  const once = <T>(store: Map<string, Promise<T>>, key: string, make: () => Promise<T>): Promise<T> => {
    const known = store.get(key);
    if (known !== undefined) return known;
    const fresh = make();
    store.set(key, fresh);
    return fresh;
  };

  return {
    channels: () => once(channels, "", () => source.channels()),
    posts: (channelId, limit) =>
      once(posts, `${channelId}:${String(limit)}`, () => source.posts(channelId, limit)),
    post: (postId) => once(post, postId, () => source.post(postId)),
    locales: () => {
      locales ??= source.locales();
      return locales;
    },
  };
}

interface Loaded<T> {
  entries: T;
  loading: boolean;
}

/**
 * Die News-Kanäle des Tenants, einmal je geöffnetem Dialog.
 *
 * `enabled` ist kein Zierat: eine Bühne ganz ohne News-Einträge soll gar nicht
 * erst ins Netz greifen, nur weil die Liste links Namen anzeigen könnte.
 */
export function useNewsChannels(source: NewsSource, enabled = true): Loaded<NewsChannel[]> {
  const [entries, setEntries] = useState<NewsChannel[]>([]);
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);

    void (async () => {
      const channels = await source.channels();
      if (cancelled) return;
      setEntries(channels);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [source, enabled]);

  return { entries, loading };
}

/**
 * Die Beiträge eines Kanals für die Auswahl.
 *
 * Ohne Kanal wird gar nicht erst gefragt: eine Beitragsliste über alle Kanäle
 * wäre für die Auswahl unbrauchbar lang.
 */
export function useChannelPosts(source: NewsSource, channelId: string): Loaded<NewsPost[]> {
  const [entries, setEntries] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (channelId === "") {
      setEntries([]);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);

    void (async () => {
      const posts = await source.posts(channelId, POST_OPTION_LIMIT);
      if (cancelled) return;
      setEntries(posts);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [source, channelId]);

  return { entries, loading };
}
