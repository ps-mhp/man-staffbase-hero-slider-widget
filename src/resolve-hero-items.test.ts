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

import { HeroItem, NewsChannelItem, NewsPostItem, SlideItem } from "./hero-items";
import { NewsPost } from "./news-client";
import { FETCH_LIMIT, MAX_SLIDES, ResolveDeps, resolveHeroItems } from "./resolve-hero-items";

const post = (id: string, over: Partial<NewsPost> = {}): NewsPost => ({
  id,
  contents: {
    de_DE: {
      title: `Titel ${id}`,
      teaser: `Teaser ${id}`,
      image: { wide_first: { url: `https://cdn.test/${id}.jpg`, width: 1900, height: 1069 } },
    },
  },
  ...over,
});

const slideItem = (id: string): SlideItem => ({
  id,
  image: { url: `https://cdn.test/${id}.png`, alt: "" },
  headline: `Folie ${id}`,
});

const postItem = (over: Partial<NewsPostItem> = {}): NewsPostItem => ({
  type: "news-post",
  id: "p",
  channelId: "c1",
  postId: "a",
  ...over,
});

const channelItem = (over: Partial<NewsChannelItem> = {}): NewsChannelItem => ({
  type: "news-channel",
  id: "k",
  channelId: "c1",
  count: 3,
  order: "newest",
  ...over,
});

const deps = (over: Partial<ResolveDeps> = {}): ResolveDeps => ({
  fetchPost: jest.fn(async (id: string) => post(id)),
  fetchChannelPosts: jest.fn(async () => []),
  locales: ["de_DE"],
  ...over,
});

const resolve = (items: HeroItem[], over: Partial<ResolveDeps> = {}) =>
  resolveHeroItems(items, deps(over));

describe("resolveHeroItems", () => {
  it("fasst eine reine Folienliste durch, ohne das Netz zu fragen", async () => {
    const dependencies = deps();

    const slides = await resolveHeroItems([slideItem("a"), slideItem("b")], dependencies);

    expect(slides.map((slide) => slide.id)).toEqual(["a", "b"]);
    expect(dependencies.fetchPost).not.toHaveBeenCalled();
    expect(dependencies.fetchChannelPosts).not.toHaveBeenCalled();
  });

  it("behält die Reihenfolge der Einträge, obwohl parallel geladen wird", async () => {
    const slides = await resolve(
      [postItem({ id: "p1", postId: "x" }), slideItem("a"), postItem({ id: "p2", postId: "y" })],
      {
        fetchPost: jest.fn(async (id: string) => {
          // Der erste Abruf antwortet später als der zweite; die Reihenfolge
          // der Folien darf davon nicht abhängen.
          if (id === "x") await new Promise((resolve) => setTimeout(resolve, 5));
          return post(id);
        }),
      },
    );

    expect(slides.map((slide) => slide.id)).toEqual(["p1:x", "a", "p2:y"]);
  });

  it("setzt die Folienkennung aus Eintrag und Beitrag zusammen", async () => {
    const slides = await resolve([postItem({ id: "eintrag", postId: "beitrag" })]);

    expect(slides[0].id).toBe("eintrag:beitrag");
  });

  it("lässt einen fehlgeschlagenen Beitrag die übrigen nicht mitreißen", async () => {
    const slides = await resolve([postItem({ id: "p1", postId: "weg" }), slideItem("a")], {
      fetchPost: jest.fn(async (id: string) => (id === "weg" ? null : post(id))),
    });

    expect(slides.map((slide) => slide.id)).toEqual(["a"]);
  });

  it("verwirft einen Beitrag ohne Bild — sonst bliebe eine dunkle Fläche", async () => {
    const slides = await resolve([postItem({ postId: "ohne" })], {
      fetchPost: jest.fn(async () => post("ohne", { contents: { de_DE: { title: "Ohne Bild" } } })),
    });

    expect(slides).toEqual([]);
  });

  it("zeigt einen Beitrag ohne Bild, wenn ein eigenes Bühnenbild gesetzt ist", async () => {
    const slides = await resolve(
      [postItem({ postId: "ohne", imageOverride: { url: "https://cdn.test/e.jpg", alt: "" } })],
      { fetchPost: jest.fn(async () => post("ohne", { contents: { de_DE: { title: "T" } } })) },
    );

    expect(slides).toHaveLength(1);
  });

  it("holt für einen Kanal mehr Beiträge, als er zeigt — gefiltert wird hier, nicht im Server", async () => {
    const fetchChannelPosts = jest.fn(async () => [post("a"), post("b")]);

    await resolve([channelItem({ count: 2 })], { fetchChannelPosts });

    expect(fetchChannelPosts).toHaveBeenCalledWith("c1", FETCH_LIMIT);
  });

  it("expandiert einen Kanal auf die eingestellte Zahl von Folien", async () => {
    const slides = await resolve([channelItem({ count: 2 })], {
      fetchChannelPosts: jest.fn(async () => [post("a"), post("b"), post("c")]),
    });

    expect(slides.map((slide) => slide.id)).toEqual(["k:a", "k:b"]);
  });

  it("dreht die Auswahl bei „älteste zuerst“", async () => {
    const slides = await resolve([channelItem({ count: 2, order: "oldest" })], {
      fetchChannelPosts: jest.fn(async () => [post("neu"), post("mittel"), post("alt")]),
    });

    expect(slides.map((slide) => slide.id)).toEqual(["k:alt", "k:mittel"]);
  });

  it("filtert auf hervorgehobene Beiträge", async () => {
    const slides = await resolve([channelItem({ onlyHighlighted: true })], {
      fetchChannelPosts: jest.fn(async () => [
        post("a"),
        post("b", { highlighted: true }),
      ]),
    });

    expect(slides.map((slide) => slide.id)).toEqual(["k:b"]);
  });

  it("filtert Beiträge ohne Bild heraus, solange niemand es abschaltet", async () => {
    const bare = post("ohne", { contents: { de_DE: { title: "Ohne Bild" } } });

    const slides = await resolve([channelItem()], {
      fetchChannelPosts: jest.fn(async () => [bare, post("mit")]),
    });

    expect(slides.map((slide) => slide.id)).toEqual(["k:mit"]);
  });

  it("zeigt Beiträge ohne Bild, wenn der Filter abgeschaltet ist", async () => {
    const bare = post("ohne", { contents: { de_DE: { title: "Ohne Bild" } } });

    const slides = await resolve([channelItem({ requireImage: false })], {
      fetchChannelPosts: jest.fn(async () => [bare]),
    });

    expect(slides.map((slide) => slide.id)).toEqual(["k:ohne"]);
  });

  it("filtert nach Schlagworten, ohne auf Raute und Groß-/Kleinschreibung zu achten", async () => {
    const slides = await resolve([channelItem({ hashtags: ["Trucks"] })], {
      fetchChannelPosts: jest.fn(async () => [
        post("a", { hashtags: ["#trucks"] }),
        post("b", { hashtags: ["bus"] }),
        post("c"),
      ]),
    });

    expect(slides.map((slide) => slide.id)).toEqual(["k:a"]);
  });

  it("kappt die Bühne bei acht Folien", async () => {
    const posts = Array.from({ length: 8 }, (_unused, index) => post(`p${index}`));

    const slides = await resolve([slideItem("a"), slideItem("b"), channelItem({ count: 8 })], {
      fetchChannelPosts: jest.fn(async () => posts),
    });

    expect(slides).toHaveLength(MAX_SLIDES);
    expect(slides.map((slide) => slide.id).slice(0, 3)).toEqual(["a", "b", "k:p0"]);
  });

  it("vergibt eindeutige Kennungen, auch wenn ein Beitrag zweimal vorkommt", async () => {
    const slides = await resolve([
      postItem({ id: "erst", postId: "a" }),
      postItem({ id: "zweit", postId: "a" }),
    ]);

    expect(new Set(slides.map((slide) => slide.id)).size).toBe(2);
  });

  it("verwirft eine Folie ohne Bild-URL", async () => {
    const slides = await resolve([{ id: "leer", image: { url: "", alt: "" }, headline: "" }]);

    expect(slides).toEqual([]);
  });
});
