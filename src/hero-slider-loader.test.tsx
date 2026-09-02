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

import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";

import { HeroItem, NewsChannelItem, NewsPostItem } from "./hero-items";
import { HeroSliderLoader } from "./hero-slider-loader";
import { NewsPost } from "./news-client";
import { HeroSlidesSource } from "./use-hero-slides";

const post = (id: string): NewsPost => ({
  id,
  contents: {
    de_DE: {
      title: `Titel ${id}`,
      teaser: `Teaser ${id}`,
      image: { wide_first: { url: `https://cdn.test/${id}.jpg`, width: 1900, height: 1069 } },
    },
  },
});

const postItem: NewsPostItem = {
  type: "news-post",
  id: "p",
  channelId: "c1",
  postId: "a",
};

const channelItem: NewsChannelItem = {
  type: "news-channel",
  id: "k",
  channelId: "c1",
  count: 2,
  order: "newest",
};

const source = (over: Partial<HeroSlidesSource> = {}): HeroSlidesSource => ({
  fetchPost: jest.fn(async (id: string) => post(id)),
  fetchChannelPosts: jest.fn(async () => [post("x"), post("y")]),
  locales: jest.fn(async () => ["de_DE"]),
  ...over,
});

const renderLoader = (items: HeroItem[], over: Partial<HeroSlidesSource> = {}) =>
  render(<HeroSliderLoader items={items} source={source(over)} autoplayDelayMs={0} />);

describe("HeroSliderLoader", () => {
  it("zeigt vor dem Auflösen nichts — ein Platzhalter spränge sichtbarer als eine Lücke", async () => {
    const { container } = renderLoader([postItem]);

    expect(container).toBeEmptyDOMElement();
    // Das Auflösen zu Ende laufen lassen, sonst schlägt die Zustandsänderung
    // erst nach dem Test auf und React meldet ein fehlendes `act`.
    await screen.findByTestId("hero-slider");
  });

  it("zeigt die Bühne, sobald der Beitrag geladen ist", async () => {
    renderLoader([postItem]);

    expect(await screen.findByTestId("hero-slider")).toBeInTheDocument();
    expect(screen.getByText("Titel a")).toBeInTheDocument();
  });

  it("macht aus einem Kanal so viele Folien wie eingestellt", async () => {
    renderLoader([channelItem]);

    await screen.findByTestId("hero-slider");
    expect(screen.getByTestId("hero-slide-k:x")).toBeInTheDocument();
    expect(screen.getByTestId("hero-slide-k:y")).toBeInTheDocument();
  });

  it("zeigt nichts, wenn kein Eintrag eine Folie ergibt", async () => {
    const { container } = renderLoader([postItem], { fetchPost: jest.fn(async () => null) });

    await waitFor(() => {
      expect(container.querySelector("[data-testid='hero-slider']")).toBeNull();
    });
  });

  it("setzt nach dem Abbau keinen Zustand mehr", async () => {
    const warn = jest.spyOn(console, "error").mockImplementation(() => undefined);
    let release = (): void => undefined;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });

    const { unmount } = renderLoader([postItem], {
      fetchPost: jest.fn(async (id: string) => {
        await gate;
        return post(id);
      }),
    });

    unmount();
    release();
    await gate;

    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});
