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
 * Der Zugang zu den News des Tenants.
 *
 * Das einzige Modul der Bühne, das `fetch` benutzt — damit bleibt alles
 * andere ohne Netz prüfbar. Alle Anfragen laufen mit
 * `credentials: "same-origin"`, tragen also die Sitzung der lesenden Person:
 * die Bühne kann niemandem etwas zeigen, das er nicht ohnehin sehen dürfte.
 *
 * Keine Funktion hier wirft. Die Bühne wird in fremde Seiten eingebettet, und
 * ein abgewiesener Abruf darf weder den Konfigurationsdialog noch die Seite
 * mitreißen; ein fehlender Kanal ist eine leere Liste, ein fehlender Beitrag
 * ist `null`.
 *
 * Live gegen https://www.onetruck.man geprüft (02.09.2026):
 * `GET /api/channels`, `GET /api/channels/<id>/posts?limit&sort=published_DESC`,
 * `GET /api/posts/<id>`. Der Parameter `sort` kennt **nur** `published_DESC`;
 * `published_ASC` antwortet mit HTTP 400. Unbekannte Query-Parameter
 * (`highlighted`, `hashtags`, `q`) werden stillschweigend ignoriert — deshalb
 * filtert `resolve-hero-items.ts` selbst und nicht der Server.
 */

import { pickLocalizedTitle } from "@shared/entity-picker/localized-title";

/** Ein News-Kanal, wie ihn die Auswahl im Editor braucht. */
export interface NewsChannel {
  id: string;
  title: string;
}

/** Eine Zuschnittstufe eines Beitragsbildes. */
export interface NewsImageVariant {
  url?: unknown;
  width?: unknown;
  height?: unknown;
}

/** Eine Sprachfassung eines Beitrags, so weit die Bühne sie braucht. */
export interface NewsPostContent {
  title?: string;
  teaser?: string;
  image?: Record<string, NewsImageVariant | null> | null;
}

export interface NewsPost {
  id: string;
  channelID?: string;
  published?: string;
  highlighted?: boolean;
  hashtags?: string[];
  contents?: Record<string, NewsPostContent>;
  links?: { detail_view?: { href?: string } };
}

/**
 * Wie viele Kanäle die Auswahl höchstens anbietet. Wer mehr hat, erreicht den
 * Rest über die Eingabe der Kennung.
 */
export const CHANNEL_LIMIT = 100;

const jsonRequest: RequestInit = {
  credentials: "same-origin",
  headers: { Accept: "application/json" },
};

const getJson = async <T>(url: string): Promise<T | null> => {
  try {
    const response = await fetch(url, jsonRequest);
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

interface RawChannel {
  id?: unknown;
  pluginID?: unknown;
  config?: { localization?: Record<string, { title?: unknown }> };
}

/**
 * Die News-Kanäle dieses Tenants.
 *
 * `/api/channels` listet die Installationen aller Kanal-Plugins; die Bühne
 * kann nur mit `news` etwas anfangen, ein Wiki- oder Formular-Kanal in der
 * Auswahl wäre eine Sackgasse.
 */
export async function fetchNewsChannels(): Promise<NewsChannel[]> {
  const body = await getJson<{ data?: RawChannel[] }>(
    `/api/channels?limit=${CHANNEL_LIMIT}`,
  );
  if (body === null) return [];

  const channels: NewsChannel[] = [];
  for (const entry of body.data ?? []) {
    if (typeof entry?.id !== "string" || entry.id === "") continue;
    if (entry.pluginID !== "news") continue;
    channels.push({
      id: entry.id,
      title: pickLocalizedTitle(entry.config?.localization) ?? entry.id,
    });
  }
  return channels;
}

/**
 * Die jüngsten Beiträge eines Kanals.
 *
 * Immer absteigend nach Veröffentlichung — die andere Richtung kennt die API
 * nicht (HTTP 400) und wird deshalb beim Auflösen gedreht.
 */
export async function fetchChannelPosts(channelId: string, limit: number): Promise<NewsPost[]> {
  if (channelId === "") return [];
  const query = new URLSearchParams({ limit: String(limit), sort: "published_DESC" });
  const body = await getJson<{ data?: NewsPost[] }>(
    `/api/channels/${encodeURIComponent(channelId)}/posts?${query}`,
  );
  if (body === null) return [];
  return (body.data ?? []).filter(
    (post): post is NewsPost => typeof post?.id === "string" && post.id !== "",
  );
}

/** Ein einzelner Beitrag; `null`, wenn es ihn nicht (mehr) gibt. */
export async function fetchPost(postId: string): Promise<NewsPost | null> {
  if (postId === "") return null;
  const post = await getJson<NewsPost>(`/api/posts/${encodeURIComponent(postId)}`);
  return post !== null && typeof post.id === "string" ? post : null;
}

/**
 * Die Sprachen des Dokuments, vertrauenswürdigste zuerst, in der Schreibweise
 * der API (`de_DE`).
 */
export function documentLocales(): string[] {
  const meta = document.querySelector('meta[http-equiv="content-language"]');
  const candidates = [
    document.documentElement.getAttribute("lang"),
    meta?.getAttribute("content"),
    navigator.language,
  ];

  const locales: string[] = [];
  for (const candidate of candidates) {
    const locale = candidate?.trim().replace("-", "_");
    if (locale !== undefined && locale !== "" && !locales.includes(locale)) locales.push(locale);
  }
  return locales;
}

/**
 * Die Sprachen der lesenden Person, die im App-Profil eingestellte zuerst.
 *
 * `/api/users/me` trägt unter `config.locale` die Sprache, die jemand *in der
 * App* gewählt hat; `<html lang>` sagt nur, in welcher Sprache die Seite
 * gerendert wurde — auf einer englischen Hülle ist das auch für eine spanische
 * Leserin `en`. Ein fehlgeschlagener Abruf ist deshalb kein Fehler, sondern
 * nur eine schlechtere Antwort.
 */
export async function userLocales(): Promise<string[]> {
  const fallback = documentLocales();
  const user = await getJson<{ config?: { locale?: string } }>("/api/users/me");
  const locale = user?.config?.locale?.trim().replace("-", "_");
  return locale !== undefined && locale !== ""
    ? [locale, ...fallback.filter((other) => other !== locale)]
    : fallback;
}
