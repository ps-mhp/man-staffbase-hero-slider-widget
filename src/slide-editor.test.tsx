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
 * Prüfungen des Redaktionsdialogs.
 *
 * Der Editor schreibt nichts selbst zurück — er meldet jede Änderung über
 * `onChange`. Geprüft wird deshalb durchweg, welche Folienliste dort ankommt.
 */

import * as React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MediaClient, MediaItem } from "@shared/media/media-client";
import { MAX_ITEMS, SlideEditor } from "./slide-editor";
import { HeroItem, DEFAULT_CHANNEL_COUNT, NewsChannelItem, NewsPostItem } from "./hero-items";
import { NewsChannel, NewsPost } from "./news-client";
import { NewsSource } from "./editors/news-source";
import { Slide } from "./slides-model";

const mediaItem = (id: string): MediaItem => ({
  id,
  url: `https://cdn.example.test/${id}.png`,
  previewUrl: `https://cdn.example.test/${id}-preview.png`,
  fileName: `${id}.png`,
  type: "image",
  width: 1920,
  height: 823,
});

/** Ein Media-Client, der nur das kann, was der Editor von ihm verlangt. */
const stubMediaClient = (overrides: Partial<MediaClient> = {}): MediaClient =>
  ({
    listMedia: jest.fn(async () => ({ items: [mediaItem("a")], total: 1, nextOffset: null })),
    searchMedia: jest.fn(async () => ({ items: [], nextCursor: null })),
    uploadMedia: jest.fn(async () => mediaItem("up")),
    ensurePublicImageUrl: jest.fn(async (m: MediaItem) => m.url),
    currentUserId: jest.fn(async () => null),
    ...overrides,
  }) as unknown as MediaClient;

const slide = (id: string, extra: Partial<Slide> = {}): Slide => ({
  id,
  image: { url: `https://cdn.example.test/${id}.png`, alt: `Bild ${id}` },
  headline: `Überschrift ${id}`,
  ...extra,
});

const newsChannel = (id: string, title: string): NewsChannel => ({ id, title });

const postItem = (id: string, extra: Partial<NewsPostItem> = {}): NewsPostItem => ({
  type: "news-post",
  id,
  channelId: "",
  postId: "",
  ...extra,
});

const channelItem = (id: string, extra: Partial<NewsChannelItem> = {}): NewsChannelItem => ({
  type: "news-channel",
  id,
  channelId: "c1",
  count: DEFAULT_CHANNEL_COUNT,
  order: "newest",
  ...extra,
});

const newsPost = (id: string, title: string, extra: Partial<NewsPost> = {}): NewsPost => ({
  id,
  published: "2026-01-01T10:00:00.000Z",
  highlighted: false,
  hashtags: [],
  contents: {
    de_DE: {
      title,
      teaser: `Teaser ${id}`,
      image: { original: { url: `https://cdn.example.test/post-${id}.jpg` } },
    },
  },
  links: { detail_view: { href: `https://tenant.example.test/news/${id}` } },
  ...extra,
});
/** Eine News-Quelle ohne Netz; die Rückgaben stehen im Test fest. */
const stubNewsSource = (overrides: Partial<NewsSource> = {}): NewsSource => ({
  channels: jest.fn(async () => [newsChannel("c1", "Unternehmen"), newsChannel("c2", "Technik")]),
  posts: jest.fn(async () => [newsPost("p1", "Erster Beitrag"), newsPost("p2", "Zweiter Beitrag")]),
  post: jest.fn(async (id: string) => newsPost(id, `Beitrag ${id}`)),
  locales: jest.fn(async () => ["de_DE"]),
  ...overrides,
});

interface Harness {
  onChange: jest.Mock<void, [HeroItem[]]>;
  onSave: jest.Mock;
  onClose: jest.Mock;
  /** Die Eintragsliste des jüngsten `onChange`. */
  latest: () => HeroItem[];
  /** Dieselbe Liste, aber als Folien getippt — die meisten Fälle prüfen Folien. */
  latestSlides: () => Slide[];
}

const setup = (value: HeroItem[], dirty = false, newsSource = stubNewsSource()): Harness => {
  const onChange = jest.fn<void, [HeroItem[]]>();
  const onSave = jest.fn();
  const onClose = jest.fn();

  render(
    <SlideEditor
      value={value}
      onChange={onChange}
      onSave={onSave}
      onClose={onClose}
      dirty={dirty}
      mediaClient={stubMediaClient()}
      newsSource={newsSource}
    />,
  );

  const latest = (): HeroItem[] => onChange.mock.calls[onChange.mock.calls.length - 1]![0];

  return {
    onChange,
    onSave,
    onClose,
    latest,
    latestSlides: () => latest() as Slide[],
  };
};

describe("SlideEditor", () => {
  describe("Eintragsliste", () => {
    it("erklärt bei leerer Liste, welche Sorten es gibt", () => {
      setup([]);
      expect(screen.getByText(/Noch kein Eintrag/i)).toBeInTheDocument();
    });

    it("listet alle Folien mit ihrer Überschrift", () => {
      setup([slide("a"), slide("b")]);
      expect(screen.getByTestId("slide-item-a")).toHaveTextContent("Überschrift a");
      expect(screen.getByTestId("slide-item-b")).toHaveTextContent("Überschrift b");
    });

    it("beschriftet eine Folie ohne Überschrift erkennbar", () => {
      setup([slide("a", { headline: "  " })]);
      expect(screen.getByTestId("slide-item-a")).toHaveTextContent("Ohne Überschrift");
    });

    it("fügt eine leere Folie hinzu", () => {
      const h = setup([slide("a")]);
      fireEvent.click(screen.getByTestId("slide-add"));

      const slides = h.latestSlides();
      expect(slides).toHaveLength(2);
      expect(slides[1]!.image.url).toBe("");
    });

    it("verhindert mehr Folien als sinnvoll gezeigt werden können", () => {
      const many = Array.from({ length: MAX_ITEMS }, (_, i) => slide(`s${i}`));
      setup(many);

      expect(screen.getByTestId("slide-add")).toBeDisabled();
      expect(screen.getByTestId("slide-duplicate")).toBeDisabled();
    });

    it("dupliziert eine Folie mit eigener Kennung direkt dahinter", () => {
      const h = setup([slide("a"), slide("b")]);
      fireEvent.click(screen.getByTestId("slide-duplicate"));

      const slides = h.latestSlides();
      expect(slides.map((s) => s.headline)).toEqual([
        "Überschrift a",
        "Überschrift a",
        "Überschrift b",
      ]);
      expect(slides[1]!.id).not.toBe("a");
    });

    it("löscht die gewählte Folie", () => {
      const h = setup([slide("a"), slide("b")]);
      fireEvent.click(screen.getByTestId("slide-remove"));

      expect(h.latest().map((s) => s.id)).toEqual(["b"]);
    });

    it("verschiebt eine Folie nach hinten", () => {
      const h = setup([slide("a"), slide("b")]);
      fireEvent.click(screen.getByTestId("slide-down"));

      expect(h.latest().map((s) => s.id)).toEqual(["b", "a"]);
    });

    it("sperrt das Verschieben an den Rändern", () => {
      setup([slide("a"), slide("b")]);
      expect(screen.getByTestId("slide-up")).toBeDisabled();
      expect(screen.getByTestId("slide-down")).toBeEnabled();
    });
  });

  describe("Felder", () => {
    it("übernimmt eine geänderte Überschrift", () => {
      const h = setup([slide("a")]);
      fireEvent.change(screen.getByTestId("slide-headline"), { target: { value: "Neu" } });

      expect(h.latestSlides()[0]!.headline).toBe("Neu");
    });

    it("löscht eine geleerte Unterzeile aus der Folie", () => {
      const h = setup([slide("a", { subline: "Alt" })]);
      fireEvent.change(screen.getByTestId("slide-subline"), { target: { value: "" } });

      expect(h.latestSlides()[0]!.subline).toBeUndefined();
    });

    it("ändert die Bildbeschreibung ohne das Bild anzutasten", () => {
      const h = setup([slide("a")]);
      fireEvent.change(screen.getByTestId("slide-image-alt"), { target: { value: "Ein LKW" } });

      expect(h.latestSlides()[0]!.image).toEqual({
        url: "https://cdn.example.test/a.png",
        alt: "Ein LKW",
      });
    });
  });

  describe("Schaltfläche", () => {
    it("hält eine halb ausgefüllte Schaltfläche fest, statt sie zu verwerfen", () => {
      const h = setup([slide("a")]);
      fireEvent.change(screen.getByTestId("slide-cta-label"), { target: { value: "Mehr" } });

      expect(h.latestSlides()[0]!.cta).toEqual({ label: "Mehr", href: "" });
    });

    it("entfernt die Schaltfläche, sobald beide Felder leer sind", () => {
      const h = setup([slide("a", { cta: { label: "Mehr", href: "" } })]);
      fireEvent.change(screen.getByTestId("slide-cta-label"), { target: { value: "" } });

      expect(h.latestSlides()[0]!.cta).toBeUndefined();
    });

    it("merkt sich das Öffnen in neuem Tab", () => {
      const h = setup([
        slide("a", { cta: { label: "Mehr", href: "https://example.test" } }),
      ]);
      fireEvent.click(screen.getByTestId("slide-cta-newtab"));

      expect(h.latestSlides()[0]!.cta).toEqual({
        label: "Mehr",
        href: "https://example.test",
        newTab: true,
      });
    });
  });

  describe("Bildauswahl", () => {
    it("bietet für eine Folie ohne Bild eine leere Kachel an", () => {
      setup([slide("a", { image: { url: "", alt: "" } })]);
      expect(screen.getByTestId("slide-image-pick")).toBeInTheDocument();
      expect(screen.queryByTestId("slide-image-thumb")).not.toBeInTheDocument();
    });

    it("übernimmt ein gewähltes Bild samt Maßen", async () => {
      const h = setup([slide("a", { image: { url: "", alt: "" } })]);
      fireEvent.click(screen.getByTestId("slide-image-pick"));

      const tile = await screen.findByAltText("a.png");
      fireEvent.click(tile);

      await waitFor(() => expect(h.onChange).toHaveBeenCalled());
      expect(h.latestSlides()[0]!.image).toMatchObject({
        url: "https://cdn.example.test/a.png",
        width: 1920,
        height: 823,
      });
    });

    it("entfernt das Hochformat-Bild wieder", () => {
      const h = setup([
        slide("a", { imagePortrait: { url: "https://cdn.example.test/hoch.png", alt: "" } }),
      ]);
      fireEvent.click(screen.getByTestId("slide-portrait-clear"));

      expect(h.latestSlides()[0]!.imagePortrait).toBeUndefined();
    });

    it("bietet für das Hauptbild kein Entfernen an — ohne Bild gibt es keine Folie", () => {
      setup([slide("a")]);
      expect(screen.queryByTestId("slide-image-clear")).not.toBeInTheDocument();
    });
  });

  describe("Fußzeile", () => {
    it("benennt ungesicherte Änderungen", () => {
      setup([slide("a")], true);
      expect(screen.getByText("Ungesicherte Änderungen")).toBeInTheDocument();
    });

    it("reicht Übernehmen und Abbrechen weiter", () => {
      const h = setup([slide("a")]);

      fireEvent.click(screen.getByTestId("slide-editor-save"));
      expect(h.onSave).toHaveBeenCalled();

      fireEvent.click(screen.getByTestId("slide-editor-cancel"));
      expect(h.onClose).toHaveBeenCalled();
    });
  });

  describe("News-Einträge anlegen", () => {
    it("legt einen Beitrags-Eintrag an und wählt ihn aus", () => {
      const h = setup([]);
      fireEvent.click(screen.getByTestId("news-post-add"));

      const items = h.latest();
      expect(items).toHaveLength(1);
      expect(items[0]).toMatchObject({ type: "news-post", channelId: "", postId: "" });
    });

    it("legt einen Kanal-Eintrag mit brauchbaren Vorgaben an", () => {
      const h = setup([]);
      fireEvent.click(screen.getByTestId("news-channel-add"));

      expect(h.latest()[0]).toMatchObject({
        type: "news-channel",
        count: DEFAULT_CHANNEL_COUNT,
        order: "newest",
      });
    });

    it("sperrt alle drei Knöpfe, wenn die Bühne voll ist", () => {
      setup(Array.from({ length: MAX_ITEMS }, (_, i) => slide(`s${i}`)));

      expect(screen.getByTestId("slide-add")).toBeDisabled();
      expect(screen.getByTestId("news-post-add")).toBeDisabled();
      expect(screen.getByTestId("news-channel-add")).toBeDisabled();
    });

    it("zeigt je Eintrag seine Sorte an", async () => {
      setup([slide("a"), postItem("p"), channelItem("c")]);

      expect(screen.getByTestId("slide-item-a")).toHaveTextContent("Folie");
      expect(screen.getByTestId("slide-item-p")).toHaveTextContent("Post");
      expect(screen.getByTestId("slide-item-c")).toHaveTextContent("Kanal");

      // Der Kanalname wird nachgeladen; bis dahin steht dort die Kennung.
      await waitFor(() =>
        expect(screen.getByTestId("slide-item-c")).toHaveTextContent("Unternehmen · 3 Beiträge"),
      );
    });

    it("holt den Titel eines gewählten Beitrags für die Liste nach", async () => {
      setup([postItem("p", { postId: "p1" })]);
      await waitFor(() =>
        expect(screen.getByTestId("slide-item-p")).toHaveTextContent("Beitrag p1"),
      );
    });
  });

  describe("Formular eines Beitrags", () => {
    it("zeigt die Beitragsfelder statt der Folienfelder", async () => {
      setup([postItem("p")]);

      expect(screen.queryByTestId("slide-headline")).not.toBeInTheDocument();
      expect(await screen.findByTestId("news-post-channel")).toBeInTheDocument();
    });

    it("füllt die Beitragsauswahl erst, wenn ein Kanal gewählt ist", async () => {
      const h = setup([postItem("p")]);

      const channel = await screen.findByTestId("news-post-channel");
      expect(screen.getByTestId("news-post-post")).toBeDisabled();

      fireEvent.change(channel, { target: { value: "c1" } });
      expect(h.latest()[0]).toMatchObject({ channelId: "c1", postId: "" });
    });

    it("wirft den gewählten Beitrag weg, wenn der Kanal wechselt", async () => {
      const h = setup([postItem("p", { channelId: "c1", postId: "p1" })]);

      const channel = await screen.findByTestId("news-post-channel");
      fireEvent.change(channel, { target: { value: "c2" } });

      expect(h.latest()[0]).toMatchObject({ channelId: "c2", postId: "" });
    });

    it("bietet die Beiträge des Kanals mit ihrem Titel an", async () => {
      setup([postItem("p", { channelId: "c1" })]);

      const select = await screen.findByTestId("news-post-post");
      await waitFor(() => expect(select).toHaveTextContent("Erster Beitrag"));
      expect(select).toHaveTextContent("Zweiter Beitrag");
    });

    it("tritt zur Seite, wenn die Kanalliste nicht erreichbar ist", async () => {
      setup([postItem("p")], false, stubNewsSource({ channels: jest.fn(async () => []) }));

      const manual = await screen.findByTestId("news-post-channel-manual");
      expect(manual).toBeInTheDocument();
      expect(screen.queryByTestId("news-post-channel")).not.toBeInTheDocument();
    });

    it("zeigt eine Vorschau des gewählten Beitrags", async () => {
      setup([postItem("p", { channelId: "c1", postId: "p1" })]);
      const preview = await screen.findByTestId("news-preview");
      await waitFor(() => expect(preview).toHaveTextContent("Beitrag p1"));
    });

    it("übernimmt eine überschriebene Überschrift", async () => {
      const h = setup([postItem("p", { channelId: "c1", postId: "p1" })]);

      fireEvent.change(await screen.findByTestId("news-post-headline"), {
        target: { value: "Eigene Zeile" },
      });
      expect(h.latest()[0]).toMatchObject({ headline: "Eigene Zeile" });
    });
  });

  describe("Formular eines Kanals", () => {
    it("klemmt die Anzahl auf das Machbare", async () => {
      const h = setup([channelItem("c")]);

      fireEvent.change(await screen.findByTestId("news-channel-count"), {
        target: { value: "99" },
      });
      expect(h.latest()[0]).toMatchObject({ count: MAX_ITEMS });
    });

    it("kehrt die Reihenfolge um", async () => {
      const h = setup([channelItem("c")]);

      fireEvent.change(await screen.findByTestId("news-channel-order"), {
        target: { value: "oldest" },
      });
      expect(h.latest()[0]).toMatchObject({ order: "oldest" });
    });

    it("zerlegt die Schlagworte in eine Liste", async () => {
      const h = setup([channelItem("c")]);

      fireEvent.change(await screen.findByTestId("news-channel-hashtags"), {
        target: { value: " #trucks , elektro ,, " },
      });
      expect(h.latest()[0]).toMatchObject({ hashtags: ["trucks", "elektro"] });
    });

    it("verlangt standardmäßig ein Bild und lässt das abschalten", async () => {
      const h = setup([channelItem("c")]);

      const check = await screen.findByTestId("news-channel-require-image");
      expect(check).toBeChecked();

      fireEvent.click(check);
      expect(h.latest()[0]).toMatchObject({ requireImage: false });
    });

    it("zeigt in der Vorschau eine Folie je Beitrag", async () => {
      setup([channelItem("c", { channelId: "c1", count: 2 })]);

      const preview = await screen.findByTestId("news-preview");
      await waitFor(() => expect(preview).toHaveTextContent("Erster Beitrag"));
      expect(preview).toHaveTextContent("Zweiter Beitrag");
    });
  });
});
