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
 * Der Weg von der Konfiguration zur Darstellung.
 *
 * Eine handgepflegte Folie ist schon eine; ein News-Beitrag wird zu einer, ein
 * Kanal zu mehreren. Diese Stelle ist die einzige, die das entscheidet —
 * Leseansicht und Editor-Vorschau benutzen dieselbe, weil zwei Umrechnungen
 * zwei Wahrheiten wären.
 *
 * Das I/O kommt als {@link ResolveDeps} herein statt importiert zu werden:
 * damit läuft der Auflöser im Test ohne Netz und im Editor gegen dieselben
 * Funktionen wie in der Leseansicht.
 */

import {
  HeroItem,
  NewsChannelItem,
  NewsPostItem,
  isNewsChannelItem,
  isNewsPostItem,
} from "./hero-items";
import { NewsPost } from "./news-client";
import { postToSlide } from "./news-slides";
import { Slide } from "./slides-model";

/**
 * Mehr Folien trägt die Bühne nicht: sie werden nur nacheinander gezeigt, und
 * was hinter der achten steht, sieht im Autoplay niemand mehr. Gezählt wird
 * **nach** dem Auflösen — ein Kanal hinter zwei Folien liefert also sechs.
 */
export const MAX_SLIDES = 8;

/**
 * Wie viele Beiträge ein Kanal-Eintrag heranzieht, um daraus seine `count`
 * Folien zu filtern.
 *
 * Muss größer sein als `count`, weil die API die Filter dieses Widgets nicht
 * kennt (gemessen: `highlighted`, `hashtags` und `q` werden ignoriert) und
 * deshalb hier gefiltert wird. Mehr als fünfzig wäre eine Suche über den
 * Kanal und gehört nicht in eine Bühne.
 */
export const FETCH_LIMIT = 50;

export interface ResolveDeps {
  fetchPost: (postId: string) => Promise<NewsPost | null>;
  fetchChannelPosts: (channelId: string, limit: number) => Promise<NewsPost[]>;
  /** Sprachen der lesenden Person, vertrauenswürdigste zuerst. */
  locales: string[];
}

/**
 * Die Folienkennung eines aufgelösten Beitrags.
 *
 * Aus Eintrag **und** Beitrag zusammengesetzt: derselbe Beitrag darf in zwei
 * Einträgen stehen (etwa als Einzelfolie und im Kanal), und zwei gleiche
 * React-Keys ließen die Bühne die Folien verwechseln.
 */
const slideId = (itemId: string, postId: string): string => `${itemId}:${postId}`;

const hasImage = (post: NewsPost, locales: string[]): boolean => {
  const slide = postToSlide(post, { slideId: "probe", ctaLabel: "" }, locales);
  return slide.image.url !== "";
};

const matchesHashtags = (post: NewsPost, hashtags: string[]): boolean => {
  const own = (post.hashtags ?? []).map((tag) => tag.replace(/^#/, "").toLowerCase());
  return hashtags.some((tag) => own.includes(tag.toLowerCase()));
};

const resolveNewsPost = async (
  item: NewsPostItem,
  deps: ResolveDeps,
): Promise<Slide[]> => {
  const post = await deps.fetchPost(item.postId);
  // Ein gelöschter oder nicht lesbarer Beitrag nimmt nur seine eigene Folie
  // mit; die Bühne steht weiter.
  if (post === null) return [];

  const slide = postToSlide(
    post,
    {
      slideId: slideId(item.id, post.id),
      headline: item.headline,
      showTeaser: item.showTeaser,
      ctaLabel: item.ctaLabel,
      imageOverride: item.imageOverride,
      imagePortrait: item.imagePortrait,
    },
    deps.locales,
  );

  // Ohne Bild gäbe es nichts zu sehen außer dem Verlauf. Bei einer
  // handgepflegten Folie verwirft das schon das Modell; hier steht die
  // gleiche Regel, weil das Bild erst jetzt bekannt ist.
  return slide.image.url === "" ? [] : [slide];
};

const resolveNewsChannel = async (
  item: NewsChannelItem,
  deps: ResolveDeps,
): Promise<Slide[]> => {
  const posts = await deps.fetchChannelPosts(item.channelId, FETCH_LIMIT);

  let selected = posts;
  if (item.onlyHighlighted === true) {
    selected = selected.filter((post) => post.highlighted === true);
  }
  if (item.requireImage !== false) {
    selected = selected.filter((post) => hasImage(post, deps.locales));
  }
  if (item.hashtags !== undefined && item.hashtags.length > 0) {
    const hashtags = item.hashtags;
    selected = selected.filter((post) => matchesHashtags(post, hashtags));
  }

  // Die API liefert nur absteigend (`published_ASC` antwortet mit HTTP 400),
  // also wird hier gedreht — und zwar erst nach dem Filtern, damit „älteste
  // zuerst" die ältesten *passenden* Beiträge meint.
  if (item.order === "oldest") selected = [...selected].reverse();

  return selected.slice(0, item.count).map((post) =>
    postToSlide(
      post,
      {
        slideId: slideId(item.id, post.id),
        showTeaser: item.showTeaser,
        ctaLabel: item.ctaLabel,
      },
      deps.locales,
    ),
  );
};

/**
 * Löst alle Einträge zu den Folien auf, die die Bühne zeigt.
 *
 * Die Einträge werden parallel geholt und danach in ihrer Reihenfolge
 * zusammengesetzt: nacheinander wären fünf Einträge fünf Umläufe Wartezeit,
 * und die Bühne zeigt bis zum Ende gar nichts.
 */
export async function resolveHeroItems(
  items: HeroItem[],
  deps: ResolveDeps,
): Promise<Slide[]> {
  const resolved = await Promise.all(
    items.map(async (item): Promise<Slide[]> => {
      if (isNewsPostItem(item)) return resolveNewsPost(item, deps);
      if (isNewsChannelItem(item)) return resolveNewsChannel(item, deps);
      return item.image.url === "" ? [] : [item];
    }),
  );

  return resolved.flat().slice(0, MAX_SLIDES);
}
