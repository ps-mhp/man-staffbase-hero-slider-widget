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
 * Die Vorschau im Studio: eine Folie im Aussehen der Bühne, aber ohne jeden
 * Eingriff in die Seite, auf der das Studio läuft.
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import { ConfigShellProvider, type ConfigView } from "@man/config-ui";

import { HeroEntryPreview } from "./hero-slide-preview";
import { HeroItem, NewsChannelItem, NewsPostItem } from "./hero-items";
import { Slide } from "./slides-model";

const slide = (extra: Partial<Slide> = {}): Slide => ({
  id: "a",
  image: { url: "https://cdn.example.test/quer.jpg", alt: "Ein LKW" },
  headline: "Der neue TGX",
  subline: "Effizient auf der Langstrecke",
  ctas: [{ label: "Mehr erfahren", href: "https://example.test/tgx" }],
  ...extra,
});

const post: NewsPostItem = { type: "news-post", id: "p", channelId: "c1", postId: "p1" };
const channel: NewsChannelItem = {
  type: "news-channel",
  id: "c",
  channelId: "c1",
  count: 3,
  order: "newest",
};

function renderPreview(item: HeroItem | undefined, view: ConfigView = "desktop"): void {
  render(
    <ConfigShellProvider value={{ view, setView: () => undefined, preview: true, issuesVisible: false }}>
      <HeroEntryPreview item={item} />
    </ConfigShellProvider>,
  );
}

describe("HeroEntryPreview", () => {
  it("zeigt die Folie mit Bild, Überschrift, Unterzeile und Schaltfläche", () => {
    renderPreview(slide());

    const stage = screen.getByTestId("hero-slide-preview");
    expect(stage).toHaveClass("man-hero");
    expect(screen.getByRole("heading", { name: "Der neue TGX" })).toBeInTheDocument();
    expect(stage).toHaveTextContent("Effizient auf der Langstrecke");
    expect(screen.getByTestId("hero-cta-0")).toHaveTextContent("Mehr erfahren");
    expect(stage.querySelector("img")).toHaveAttribute("src", "https://cdn.example.test/quer.jpg");
  });

  it("ist nicht bedienbar: ein Klick auf die Schaltfläche verließe sonst das Studio", () => {
    renderPreview(slide());

    expect(screen.getByTestId("hero-slide-preview").closest("[inert]")).not.toBeNull();
  });

  it("zeigt in der Mobilansicht den Hochkant-Zuschnitt", () => {
    renderPreview(
      slide({ imagePortrait: { url: "https://cdn.example.test/hoch.jpg", alt: "Hochkant" } }),
      "mobile",
    );

    const images = screen.getByTestId("hero-slide-preview").querySelectorAll("img");
    expect(images).toHaveLength(1);
    expect(images[0]).toHaveAttribute("src", "https://cdn.example.test/hoch.jpg");
  });

  it("bleibt auf dem Desktop beim Querformat, auch wenn es ein Hochformat gibt", () => {
    renderPreview(slide({ imagePortrait: { url: "https://cdn.example.test/hoch.jpg", alt: "" } }));

    const stage = screen.getByTestId("hero-slide-preview");
    expect(stage.querySelector("img")).toHaveAttribute("src", "https://cdn.example.test/quer.jpg");
    expect(stage.querySelector("source")).toBeNull();
  });

  it("sagt bei einer Folie ohne Bild, dass sie so nicht gezeigt wird", () => {
    renderPreview(slide({ image: { url: "", alt: "" } }));

    const stage = screen.getByTestId("hero-slide-preview");
    expect(stage.querySelector("img")).toBeNull();
    expect(stage).toHaveTextContent("Ohne Bild wird diese Folie nicht gezeigt.");
  });

  it("zeigt für News einen ruhigen Platzhalter statt etwas nachzuladen", () => {
    renderPreview(post);
    expect(screen.getByTestId("hero-news-preview")).toHaveTextContent(
      "News-Beitrag – Vorschau nach dem Laden",
    );
  });

  it("nennt beim Kanal die Sorte im Platzhalter", () => {
    renderPreview(channel);
    expect(screen.getByTestId("hero-news-preview")).toHaveTextContent(
      "News-Kanal – Vorschau nach dem Laden",
    );
  });

  it("hat ohne Eintrag nichts zu zeigen und sagt das", () => {
    renderPreview(undefined);
    expect(screen.getByText("Noch kein Eintrag gewählt")).toBeInTheDocument();
  });

  it("rührt Brotkrumen und Seitenrahmen der Wirtsseite nicht an", () => {
    // Die Bühne der Seite verschiebt die Brotkrumen und misst Abschnitte.
    // Im Studio stünde das Modal über einer echten Seite – die Vorschau darf
    // dort nichts bewegen.
    document.body.innerHTML =
      '<div id="wrapper"><div id="breadcrumbs">Start</div><section class="section"></section></div>';
    const wrapper = document.getElementById("wrapper")!;
    const crumbs = document.getElementById("breadcrumbs")!;

    renderPreview(slide());

    expect(wrapper.getAttribute("style")).toBeNull();
    expect(crumbs.getAttribute("style")).toBeNull();
    expect(screen.getByTestId("hero-slide-preview")).not.toHaveClass("man-hero--bleed");
  });
});
