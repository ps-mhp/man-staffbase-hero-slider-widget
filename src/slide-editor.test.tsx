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
 * Übernehmen, Abbrechen und Rückgängig gehören dem Rahmen aus
 * `@man/config-ui`; sie stehen in `slide-editor-injector.test.tsx`.
 */

import * as React from "react";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfigShell, ConfigShellProvider, type ConfigShellState } from "@man/config-ui";
import { fakeDataTransfer } from "@man/config-ui/drop/drag-testing";
import { MediaClient, MediaItem } from "@shared/media/media-client";
import { forgetDraggedForTests } from "@shared/media/media-drag";
import { MAX_ITEMS, SlideEditor } from "./slide-editor";
import { HeroItem, DEFAULT_CHANNEL_COUNT, NewsChannelItem, NewsPostItem } from "./hero-items";
import type { HeroEditorValue } from "./editor-value";
import type { Post as NewsPost } from "@shared/staffbase/posts";
import { NewsChannel } from "@shared/staffbase/channels";
import { NewsSource } from "./editors/news-source";
import { Slide, animationMedium } from "./slides-model";
import { DEFAULT_ANIMATION } from "./slide-animation";

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
  pages: jest.fn(async () => [
    { id: "pg1", title: "Fahrzeuge", href: "/content/page/6a5e6703cb02c92e74be1e01", menuId: "6a5e6703cb02c92e74be1e01" },
    { id: "pg2", title: "Service", href: "/content/page/6a5e6703cb02c92e74be1e02", menuId: "6a5e6703cb02c92e74be1e02" },
  ]),
  ...overrides,
});

interface Harness {
  onChange: jest.Mock<void, [HeroItem[]]>;
  /** Die Eintragsliste des jüngsten `onChange`. */
  latest: () => HeroItem[];
  /** Dieselbe Liste, aber als Folien getippt — die meisten Fälle prüfen Folien. */
  latestSlides: () => Slide[];
}

interface SetupOptions {
  newsSource?: NewsSource;
  /** Was der Rahmen meldet: Ansicht und ob Fehler schon gezeigt werden. */
  shell?: Partial<ConfigShellState>;
}

/** Der Stand des Rahmens, wie ihn `ConfigShell` im Studio liefert. */
const shellState = (overrides: Partial<ConfigShellState> = {}): ConfigShellState => ({
  view: "editor",
  setView: () => undefined,
  preview: true,
  issuesVisible: false,
  ...overrides,
});

/** Der Wert des Modals ohne Einstellungen: die Fälle hier prüfen die Einträge. */
const editorValue = (items: HeroItem[]): HeroEditorValue => ({ items, settings: {}, legacy: {} });

/** Die Zeile eines Eintrags in der Liste links, gefunden über ihren Titel. */
const row = (name: string | RegExp): HTMLElement => screen.getByRole("row", { name });

const rows = (): HTMLElement[] => within(screen.getByRole("grid", { name: "Einträge" })).getAllByRole("row");

/** Öffnet das Menü hinter „Neu" und wählt eine Sorte. */
const addVia = async (kind: RegExp): Promise<void> => {
  await userEvent.click(screen.getByRole("button", { name: "Neu" }));
  await userEvent.click(await screen.findByRole("menuitem", { name: kind }));
};

const action = (name: string): HTMLElement => screen.getByRole("button", { name });

/** Öffnet eine Auswahlliste und wählt eine Option. */
const choose = async (trigger: HTMLElement, option: string | RegExp): Promise<void> => {
  await userEvent.click(trigger);
  await userEvent.click(await screen.findByRole("option", { name: option }));
};

/**
 * Baut den Editor auf. `live` hält den Wert im Zustand: der Editor ist
 * kontrolliert, und mehrere Schritte hintereinander brauchen den jeweils
 * neuen Wert.
 */
const mount = (value: HeroItem[], live: boolean, options: SetupOptions): Harness => {
  const onChange = jest.fn<void, [HeroItem[]]>();
  const newsSource = options.newsSource ?? stubNewsSource();

  function Harnessed(): React.ReactElement {
    const [items, setItems] = React.useState(value);
    return (
      <ConfigShellProvider value={shellState(options.shell)}>
        <SlideEditor
          value={editorValue(live ? items : value)}
          onChange={(next) => {
            onChange(next.items);
            if (live) setItems(next.items);
          }}
          mediaClient={stubMediaClient()}
          newsSource={newsSource}
        />
      </ConfigShellProvider>
    );
  }

  render(<Harnessed />);
  const latest = (): HeroItem[] => onChange.mock.calls[onChange.mock.calls.length - 1]![0];
  return { onChange, latest, latestSlides: () => latest() as Slide[] };
};

const setup = (value: HeroItem[], options: SetupOptions = {}): Harness => mount(value, false, options);

const setupLive = (value: HeroItem[], options: SetupOptions = {}): Harness => mount(value, true, options);

describe("SlideEditor", () => {
  // Die verkleinerte Vorschau hält Videos an; jsdom kennt kein Abspielen.
  beforeAll(() => {
    jest.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
    jest.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(async () => undefined);
  });
  afterAll(() => jest.restoreAllMocks());

  describe("Eintragsliste", () => {
    it("erklärt bei leerer Liste, welche Sorten es gibt", () => {
      setup([]);
      expect(screen.getByText(/Noch kein Eintrag\./)).toBeInTheDocument();
      expect(screen.getByText(/lege einen neuen an/)).toBeInTheDocument();
    });

    it("steht als benannte Seitenleiste mit Anzahl und Grenze da", () => {
      setup([slide("a"), slide("b")]);

      expect(screen.getByRole("complementary", { name: "Einträge" })).toHaveTextContent(
        `2 von ${MAX_ITEMS}`,
      );
      expect(rows()).toHaveLength(2);
    });

    it("listet alle Folien mit ihrer Überschrift und Sorte", () => {
      setup([slide("a"), slide("b")]);
      expect(row("Überschrift a")).toHaveTextContent("Folie");
      expect(row("Überschrift b")).toBeInTheDocument();
      expect(row("Überschrift a")).toHaveAttribute("aria-selected", "true");
    });

    it("zeigt in der Liste das Vorschaubild der Folie", () => {
      setup([slide("a"), slide("b", { image: { url: "", alt: "" } })]);

      expect(row("Überschrift a").querySelector("img")).toHaveAttribute(
        "src",
        "https://cdn.example.test/a.png",
      );
      expect(row("Überschrift b").querySelector("img")).toBeNull();
    });

    it("beschriftet eine Folie ohne Überschrift erkennbar", () => {
      setup([slide("a", { headline: "  " })]);
      expect(row("Ohne Überschrift")).toBeInTheDocument();
    });

    it("nennt über dem Formular Sorte und Stelle des gewählten Eintrags", () => {
      setup([slide("a"), slide("b")]);
      expect(screen.getByRole("heading", { name: "Eintrag 1 von 2" })).toBeInTheDocument();
      expect(screen.getByTestId("entry-kind")).toHaveTextContent("Folie");
    });

    it("nennt in der Unterzeile einer Folie ihre Buttons", () => {
      setup([
        slide("a", { ctas: [{ label: "Eins", href: "https://example.test/1" }, { label: "Zwei", href: "" }] }),
        slide("b", { ctas: [{ label: "Eins", href: "https://example.test/1" }] }),
        slide("c"),
      ]);

      expect(row(/Überschrift a/)).toHaveTextContent("Folie · 2 Buttons");
      expect(row(/Überschrift b/)).toHaveTextContent("Folie · 1 Button");
      expect(row(/Überschrift c/)).toHaveTextContent(/Folie$/);
    });

    it("zeigt ohne Bild das Zeichen der Sorte statt einer leeren Kachel", () => {
      setup([slide("a", { image: { url: "", alt: "" } })]);
      expect(row(/Überschrift a/).querySelector("svg")).not.toBeNull();
    });

    it("wechselt per Klick in der Liste zum Formular des Eintrags", async () => {
      setup([slide("a"), slide("b")]);
      await userEvent.click(screen.getByText("Überschrift b"));

      expect(screen.getByRole("heading", { name: "Eintrag 2 von 2" })).toBeInTheDocument();
      expect(screen.getByTestId("slide-headline")).toHaveValue("Überschrift b");
      expect(row("Überschrift b")).toHaveAttribute("aria-selected", "true");
    });

    it("fügt eine leere Folie hinzu und wählt sie aus", async () => {
      const h = setupLive([slide("a")]);
      await addVia(/^Folie/);

      const slides = h.latestSlides();
      expect(slides).toHaveLength(2);
      expect(slides[1]!.image.url).toBe("");
      expect(screen.getByRole("heading", { name: "Eintrag 2 von 2" })).toBeInTheDocument();
    });

    it("verhindert mehr Folien als sinnvoll gezeigt werden können", () => {
      const many = Array.from({ length: MAX_ITEMS }, (_, i) => slide(`s${i}`));
      const h = setup(many);

      expect(screen.getByRole("button", { name: "Neu" })).toBeDisabled();
      // Gesperrt, nicht weggelassen: die Knöpfe springen nicht, und der Weg bleibt sichtbar.
      expect(action("Eintrag duplizieren")).toHaveAttribute("aria-disabled", "true");
      fireEvent.click(action("Eintrag duplizieren"));
      expect(h.onChange).not.toHaveBeenCalled();
    });

    it("dupliziert eine Folie mit eigener Kennung direkt dahinter", () => {
      const h = setup([slide("a"), slide("b")]);
      fireEvent.click(action("Eintrag duplizieren"));

      const slides = h.latestSlides();
      expect(slides.map((s) => s.headline)).toEqual([
        "Überschrift a",
        "Überschrift a",
        "Überschrift b",
      ]);
      expect(slides[1]!.id).not.toBe("a");
    });

    it("löscht die gewählte Folie und wählt die davor", async () => {
      const h = setupLive([slide("a"), slide("b"), slide("c")]);
      await userEvent.click(screen.getByText("Überschrift c"));
      fireEvent.click(action("Eintrag löschen"));

      expect(h.latest().map((s) => s.id)).toEqual(["a", "b"]);
      expect(screen.getByRole("heading", { name: "Eintrag 2 von 2" })).toBeInTheDocument();
      expect(screen.getByTestId("slide-headline")).toHaveValue("Überschrift b");
    });

    it("verschiebt eine Folie nach hinten, und die Auswahl geht mit", () => {
      const h = setupLive([slide("a"), slide("b")]);
      fireEvent.click(action("Eintrag nach unten"));

      expect(h.latest().map((s) => s.id)).toEqual(["b", "a"]);
      expect(screen.getByRole("heading", { name: "Eintrag 2 von 2" })).toBeInTheDocument();
      expect(screen.getByTestId("slide-headline")).toHaveValue("Überschrift a");
    });

    it("sperrt das Verschieben an den Rändern", () => {
      const h = setup([slide("a"), slide("b")]);

      expect(action("Eintrag nach oben")).toHaveAttribute("aria-disabled", "true");
      expect(action("Eintrag nach unten")).not.toHaveAttribute("aria-disabled", "true");
      fireEvent.click(action("Eintrag nach oben"));
      expect(h.onChange).not.toHaveBeenCalled();
    });

    it("markiert fehlerhafte Einträge, sobald der Rahmen Fehler zeigt", () => {
      setup([slide("a"), slide("b", { image: { url: "", alt: "" } })], {
        shell: { issuesVisible: true },
      });

      expect(within(row("Überschrift b")).getByText("Fehlerhaft")).toBeInTheDocument();
      expect(row("Überschrift b")).toHaveTextContent("Bild fehlt");
      expect(within(row("Überschrift a")).queryByText("Fehlerhaft")).toBeNull();
    });

    it("markiert nichts, solange der Rahmen keine Fehler zeigt", () => {
      setup([slide("b", { image: { url: "", alt: "" } })]);
      expect(within(row("Überschrift b")).queryByText("Fehlerhaft")).toBeNull();
    });

    it("zeichnet keine eigenen Knöpfe zum Übernehmen und Abbrechen", () => {
      setup([slide("a")]);

      expect(screen.queryByRole("button", { name: "Übernehmen" })).toBeNull();
      expect(screen.queryByRole("button", { name: "Abbrechen" })).toBeNull();
      expect(screen.queryByText("Ungesicherte Änderungen")).toBeNull();
    });
  });

  describe("Sortieren per Ziehen", () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    /** Ein Tastendruck am fokussierten Element, wie ihn der Drag-Manager erwartet. */
    const press = (key: string): void => {
      const target = document.activeElement ?? document.body;
      fireEvent.keyDown(target, { key });
      fireEvent.keyUp(target, { key });
      act(() => jest.runAllTimers());
    };

    it("schiebt die erste Folie hinter die zweite, und die Auswahl geht mit", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const h = setupLive([slide("a"), slide("b"), slide("c")]);
      // Erst ein Tab: so gilt die Tastatur als Eingabeweg, und Enter am Griff
      // beginnt das Ziehen statt einen Klick.
      await user.tab();
      const [handle] = screen.getAllByRole("button", { name: /Ziehen zum Sortieren/ });
      act(() => handle!.focus());
      press("Enter");
      press("ArrowDown");
      press("Enter");

      expect(h.latest().map((s) => s.id)).toEqual(["b", "a", "c"]);
      expect(screen.getByRole("heading", { name: "Eintrag 2 von 3" })).toBeInTheDocument();
    });
  });

  describe("Vorschau", () => {
    it("zeigt in der Geräteansicht die gewählte Folie im Aussehen der Bühne", async () => {
      setupLive([slide("a"), slide("b")], { shell: { view: "desktop" } });

      expect(screen.getByTestId("hero-slide-preview")).toHaveTextContent("Überschrift a");
      await userEvent.click(screen.getByText("Überschrift b"));
      expect(screen.getByTestId("hero-slide-preview")).toHaveTextContent("Überschrift b");
      // Die Liste bleibt stehen, und das Panel daneben stellt weiter die
      // gewählte Folie ein — dort stellt man ein, was man sieht.
      const panel = screen.getByRole("complementary", { name: "Einstellungen" });
      expect(within(panel).getByTestId("slide-headline")).toHaveValue("Überschrift b");
    });

    it("zeigt im Editor groß die Bühne und rechts Folie, Gestaltung und Verhalten", () => {
      setup([slide("a")]);

      expect(within(screen.getByTestId("entry-stage")).getByTestId("hero-slide-preview")).toHaveTextContent("Überschrift a");
      const panel = screen.getByRole("complementary", { name: "Einstellungen" });
      expect(within(panel).getAllByRole("tab").map((tab) => tab.textContent)).toEqual(["Folie", "Gestaltung", "Verhalten"]);
      expect(within(panel).getByRole("tab", { name: "Folie" })).toHaveAttribute("aria-selected", "true");
      expect(within(panel).getByTestId("slide-headline")).toBeInTheDocument();
    });

    it("öffnet nach dem ersten „Neu“ den Reiter der Folie", async () => {
      setupLive([]);
      expect(screen.getByRole("tab", { name: "Gestaltung" })).toHaveAttribute("aria-selected", "true");
      await addVia(/^Folie/);
      expect(screen.getByRole("tab", { name: "Folie" })).toHaveAttribute("aria-selected", "true");
    });

    it("nennt den Reiter nach der Sorte des Eintrags und zeigt ohne Eintrag nur das Widget", async () => {
      const h = setupLive([postItem("p")]);
      expect(screen.getByRole("tab", { name: "Beitrag" })).toBeInTheDocument();

      await userEvent.click(action("Eintrag löschen"));
      expect(h.latest()).toEqual([]);
      const panel = screen.getByRole("complementary", { name: "Widget" });
      expect(within(panel).getAllByRole("tab").map((tab) => tab.textContent)).toEqual(["Gestaltung", "Verhalten"]);
      expect(within(panel).getByRole("tab", { name: "Gestaltung" })).toHaveAttribute("aria-selected", "true");
    });

    it("zeigt in der Geräteansicht einen News-Beitrag als echte Folie", async () => {
      setup([postItem("p", { channelId: "c1", postId: "p1" })], { shell: { view: "desktop" } });

      await waitFor(() => expect(screen.getByTestId("hero-slide-preview")).toHaveTextContent("Beitrag p1"));
      expect(screen.getByTestId("hero-slide-preview").querySelector("img")).toHaveAttribute(
        "src",
        "https://cdn.example.test/post-p1.jpg",
      );
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

  describe("Schaltflächen", () => {
    it("legt eine Schaltfläche an und hält sie halb ausgefüllt fest", () => {
      const h = setupLive([slide("a")]);
      fireEvent.click(screen.getByTestId("slide-cta-add"));
      fireEvent.change(screen.getByTestId("slide-cta-0-label"), { target: { value: "Mehr" } });

      expect(h.latestSlides()[0]!.ctas).toEqual([{ label: "Mehr", href: "" }]);
    });

    it("legt ab der zweiten Schaltfläche eine Kontur an", () => {
      const h = setup([slide("a", { ctas: [{ label: "Eins", href: "https://example.test" }] })]);
      fireEvent.click(screen.getByTestId("slide-cta-add"));

      expect(h.latestSlides()[0]!.ctas?.[1]).toEqual({ label: "", href: "", variant: "outline" });
    });

    it("erlaubt höchstens drei Schaltflächen", () => {
      setup([
        slide("a", {
          ctas: [
            { label: "1", href: "https://example.test/1" },
            { label: "2", href: "https://example.test/2" },
            { label: "3", href: "https://example.test/3" },
          ],
        }),
      ]);

      expect(screen.getByTestId("slide-cta-add")).toBeDisabled();
    });

    it("entfernt die letzte Schaltfläche ganz, statt eine leere Liste zu speichern", () => {
      const h = setup([slide("a", { ctas: [{ label: "Mehr", href: "" }] })]);
      fireEvent.click(action("Button löschen"));

      expect(h.latestSlides()[0]!.ctas).toBeUndefined();
    });

    it("sortiert Schaltflächen um", async () => {
      const h = setup([
        slide("a", {
          ctas: [
            { label: "Eins", href: "https://example.test/1" },
            { label: "Zwei", href: "https://example.test/2" },
          ],
        }),
      ]);
      expect(action("Button nach oben")).toHaveAttribute("aria-disabled", "true");
      await userEvent.click(screen.getByRole("button", { name: /^Zwei/ }));
      expect(screen.getByRole("heading", { name: "Button 2 von 2" })).toBeInTheDocument();
      fireEvent.click(action("Button nach oben"));

      expect(h.latestSlides()[0]!.ctas?.map((cta) => cta.label)).toEqual(["Zwei", "Eins"]);
    });

    it("zeigt die Buttons als Liste mit Stil und Ziel, den ersten aufgeklappt", () => {
      setup([
        slide("a", {
          ctas: [
            { label: "Zu den Terminen", href: "/content/page/x", link: { kind: "page", pageId: "pg1", menuId: "x", title: "Termine" } },
            { label: "", href: "", variant: "outline" },
          ],
        }),
      ]);

      const list = screen.getByRole("list", { name: "Buttons" });
      const [first, second] = within(list).getAllByRole("button", { expanded: true }).concat(within(list).getAllByRole("button", { expanded: false }));
      expect(first).toHaveTextContent("Zu den Terminen");
      expect(first).toHaveTextContent("Rot gefüllt · Seite „Termine“");
      expect(second).toHaveTextContent("Button 2 ohne Beschriftung");
      expect(second).toHaveTextContent("Weiße Kontur · Ziel fehlt");
      expect(screen.getByRole("region", { name: "Buttons" })).toHaveTextContent("2 von 3");
    });

    it("dupliziert einen Button direkt dahinter und klappt die Kopie auf", () => {
      const h = setupLive([slide("a", { ctas: [{ label: "Mehr", href: "https://example.test" }] })]);
      fireEvent.click(action("Button duplizieren"));

      expect(h.latestSlides()[0]!.ctas).toEqual([
        { label: "Mehr", href: "https://example.test" },
        { label: "Mehr", href: "https://example.test" },
      ]);
      expect(screen.getByRole("heading", { name: "Button 2 von 2" })).toBeInTheDocument();
    });

    it("merkt sich Stil, Symbol, Symbolseite und neuen Tab", async () => {
      const h = setupLive([slide("a", { ctas: [{ label: "Mehr", href: "https://example.test" }] })]);
      await choose(screen.getByTestId("slide-cta-0-variant"), "Weiß gefüllt");
      // Ohne Symbol gibt es keine Seite, auf der es stünde.
      expect(screen.queryByRole("radiogroup", { name: "Symbol steht" })).toBeNull();
      await choose(screen.getByTestId("slide-cta-0-icon"), "Herunterladen");
      await userEvent.click(screen.getByRole("radio", { name: "Vor dem Text" }));
      fireEvent.click(screen.getByRole("switch", { name: "In neuem Tab öffnen" }));

      expect(h.latestSlides()[0]!.ctas).toEqual([
        {
          label: "Mehr",
          href: "https://example.test",
          variant: "secondary",
          icon: "download",
          iconPosition: "start",
          newTab: true,
        },
      ]);
    });

    it("schreibt den Vorgabestil nicht mit", async () => {
      const h = setup([
        slide("a", { ctas: [{ label: "Mehr", href: "https://example.test", variant: "link" }] }),
      ]);
      await choose(screen.getByTestId("slide-cta-0-variant"), "Rot gefüllt (Hauptaktion)");

      expect(h.latestSlides()[0]!.ctas).toEqual([{ label: "Mehr", href: "https://example.test" }]);
    });

    it("warnt vor einer Adresse, die nicht übernommen wird", () => {
      setup([slide("a", { ctas: [{ label: "Mehr", href: "javascript:alert(1)" }] })]);

      expect(screen.getByTestId("slide-cta-0-href-invalid")).toBeInTheDocument();
    });

    it("bittet bei einer Adresse ohne Schema um Prüfung, ohne sie zu verwerfen", () => {
      setup([slide("a", { ctas: [{ label: "MAN", href: "www.man.eu" }] })]);

      expect(screen.getByTestId("slide-cta-0-href-doubtful")).toBeInTheDocument();
      expect(screen.queryByTestId("slide-cta-0-href-invalid")).toBeNull();
    });

    it("verknüpft eine Seite aus Staffbase und bildet ihre Adresse", async () => {
      const h = setupLive([slide("a", { ctas: [{ label: "Mehr", href: "https://example.test" }] })]);
      await userEvent.click(screen.getByRole("radio", { name: "Seite" }));
      await waitFor(() => expect(screen.getByTestId("slide-cta-0-page")).toBeEnabled());
      await choose(screen.getByTestId("slide-cta-0-page"), "Service");

      expect(h.latestSlides()[0]!.ctas).toEqual([
        {
          label: "Mehr",
          href: "/content/page/6a5e6703cb02c92e74be1e02",
          link: { kind: "page", pageId: "pg2", menuId: "6a5e6703cb02c92e74be1e02", title: "Service" },
        },
      ]);
    });

    it("verknüpft einen News-Beitrag über Kanal und Beitrag", async () => {
      const h = setupLive([slide("a", { ctas: [{ label: "Lesen", href: "" }] })]);
      await userEvent.click(screen.getByRole("radio", { name: "News-Beitrag" }));
      await waitFor(() => expect(screen.getByTestId("slide-cta-0-channel")).toBeEnabled());
      await choose(screen.getByTestId("slide-cta-0-channel"), "Technik");
      await waitFor(() => expect(screen.getByTestId("slide-cta-0-post")).toBeEnabled());
      await choose(screen.getByTestId("slide-cta-0-post"), "Zweiter Beitrag");

      expect(h.latestSlides()[0]!.ctas).toEqual([
        {
          label: "Lesen",
          href: "https://tenant.example.test/news/p2",
          link: { kind: "post", postId: "p2", channelId: "c2", title: "Zweiter Beitrag" },
        },
      ]);
    });

    it("leert das Ziel beim Wechsel zurück zur freien Adresse", async () => {
      const h = setup([
        slide("a", {
          ctas: [
            {
              label: "Mehr",
              href: "/content/page/x",
              link: { kind: "page", pageId: "pg1", menuId: "x" },
            },
          ],
        }),
      ]);
      // Die Seitenliste kommt asynchron; erst danach steht das Formular still.
      await waitFor(() => expect(screen.getByTestId("slide-cta-0-page")).toHaveTextContent("Fahrzeuge"));
      await userEvent.click(screen.getByRole("radio", { name: "Adresse" }));

      expect(h.latestSlides()[0]!.ctas).toEqual([{ label: "Mehr", href: "" }]);
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

  describe("Bild oder Video per Adresse", () => {
    /** Das Adressfeld steht hinter „Adresse einfügen“; offen bleibt es offen. */
    const urlField = (field: string): HTMLElement => {
      const open = screen.queryByTestId(`${field}-url`);
      if (open !== null) return open;
      fireEvent.click(screen.getByTestId(`${field}-url-toggle`));
      return screen.getByTestId(`${field}-url`);
    };

    const typeUrl = (testId: string, url: string): void => {
      fireEvent.change(urlField(testId.replace(/-url$/, "")), { target: { value: url } });
    };

    it("bietet neben der Mediathek ein Adressfeld an", () => {
      setup([slide("a", { image: { url: "", alt: "" } })]);

      expect(screen.getByTestId("slide-image-pick")).toBeInTheDocument();
      const toggle = screen.getByRole("button", { name: "Bild oder Video: Adresse einfügen" });
      expect(toggle).toHaveAttribute("aria-expanded", "false");
      expect(screen.queryByTestId("slide-image-url")).toBeNull();

      fireEvent.click(toggle);
      expect(toggle).toHaveAttribute("aria-expanded", "true");
      expect(screen.getByTestId("slide-image-url")).toHaveValue("");
      expect(screen.getByTestId("slide-image-url")).toHaveFocus();
    });

    it("übernimmt ein Bild per Adresse", () => {
      const h = setup([slide("a", { image: { url: "", alt: "" } })]);
      typeUrl("slide-image-url", "https://cdn.example.test/neu.jpg");

      expect(h.latestSlides()[0]!.image).toEqual({ url: "https://cdn.example.test/neu.jpg", alt: "" });
    });

    it("erkennt ein Video an der Endung", () => {
      const h = setup([slide("a", { image: { url: "", alt: "" } })]);
      typeUrl("slide-image-url", "https://cdn.example.test/film.mp4");

      expect(h.latestSlides()[0]!.image).toEqual({
        url: "https://cdn.example.test/film.mp4",
        alt: "",
        kind: "video",
      });
    });

    it("zeigt ein Video in der Kachel und in der Liste als Video", () => {
      setup([
        slide("a", { image: { url: "https://cdn.example.test/film.mp4", alt: "", kind: "video" } }),
      ]);

      expect(screen.getByTestId("slide-image-thumb").tagName).toBe("VIDEO");
      expect(row("Überschrift a").querySelector("video")).toHaveAttribute(
        "src",
        "https://cdn.example.test/film.mp4#t=0.001",
      );
      expect(screen.getByText("Videobeschreibung")).toBeInTheDocument();
    });

    it("nimmt eine unvollständige oder unsichere Adresse nicht an und sagt warum", () => {
      const h = setup([slide("a")]);
      typeUrl("slide-image-url", "javascript:alert(1)");

      expect(h.onChange).not.toHaveBeenCalled();
      expect(screen.getByTestId("slide-image-url")).toHaveAttribute("aria-invalid", "true");
      expect(screen.getByTestId("slide-image-url")).toHaveAccessibleDescription(expect.stringContaining("Wird nicht übernommen"));
      expect(screen.getByTestId("slide-image-url-error")).toHaveTextContent("https://");
    });

    it("leert das Hauptbild, wenn die Adresse gelöscht wird", () => {
      const h = setup([slide("a")]);
      typeUrl("slide-image-url", "");

      expect(h.latestSlides()[0]!.image.url).toBe("");
    });

    it("entfernt das Hochformat, wenn seine Adresse gelöscht wird", () => {
      const h = setup([
        slide("a", { imagePortrait: { url: "https://cdn.example.test/hoch.png", alt: "" } }),
      ]);
      typeUrl("slide-portrait-url", "");

      expect(h.latestSlides()[0]!.imagePortrait).toBeUndefined();
    });

    it("setzt das Hochformat per Adresse", () => {
      const h = setup([slide("a")]);
      typeUrl("slide-portrait-url", "https://cdn.example.test/hoch.webm");

      expect(h.latestSlides()[0]!.imagePortrait).toEqual({
        url: "https://cdn.example.test/hoch.webm",
        alt: "",
        kind: "video",
      });
    });

    it("lässt die Sorte von Hand umschalten, wenn die Adresse keine Endung verrät", async () => {
      const h = setup([slide("a", { image: { url: "https://cdn.example.test/stream/7", alt: "" } })]);
      await userEvent.click(screen.getByRole("radio", { name: "Video" }));

      expect(h.latestSlides()[0]!.image.kind).toBe("video");
    });

    it("macht aus einem Mediathek-Bild nach einem Video wieder ein Bild", async () => {
      const h = setup([
        slide("a", { image: { url: "https://cdn.example.test/film.mp4", alt: "", kind: "video" } }),
      ]);
      fireEvent.click(screen.getByTestId("slide-image-replace"));
      fireEvent.click(await screen.findByAltText("a.png"));

      await waitFor(() => expect(h.onChange).toHaveBeenCalled());
      expect(h.latestSlides()[0]!.image.kind).toBeUndefined();
    });

    it("wählt ein Video aus der Mediathek in seiner abspielbaren Fassung", async () => {
      const film: MediaItem = {
        id: "film",
        url: "https://cdn.example.test/film.mp4",
        previewUrl: "https://cdn.example.test/t_preview/film.jpg",
        hasPreview: true,
        playbackUrl: "https://cdn.example.test/t_mp4/film.mp4",
        fileName: "film.mp4",
        type: "video",
        format: "mp4",
      };
      const onChange = jest.fn<void, [HeroItem[]]>();
      render(
        <SlideEditor
          value={editorValue([slide("a", { image: { url: "", alt: "" } })])}
          onChange={(next) => onChange(next.items)}
          mediaClient={stubMediaClient({
            listMedia: jest.fn(async () => ({ items: [film], total: 1, nextOffset: null })),
          })}
          newsSource={stubNewsSource()}
        />,
      );

      expect(screen.getByTestId("slide-image-pick")).toHaveTextContent("Bild oder Video wählen");
      fireEvent.click(screen.getByTestId("slide-image-pick"));
      fireEvent.click(await screen.findByTestId("media-picker-item-film"));

      await waitFor(() => expect(onChange).toHaveBeenCalled());
      const [picked] = onChange.mock.calls[onChange.mock.calls.length - 1]![0] as Slide[];
      expect(picked!.image).toMatchObject({
        url: "https://cdn.example.test/t_mp4/film.mp4",
        kind: "video",
      });
    });

    it("bietet für News-Beiträge weiter nur Bilder an", async () => {
      const film: MediaItem = { ...mediaItem("film"), type: "video", fileName: "film.mp4" };
      render(
        <SlideEditor
          value={editorValue([postItem("p", { channelId: "c1", postId: "p1" })])}
          onChange={jest.fn()}
          mediaClient={stubMediaClient({
            listMedia: jest.fn(async () => ({ items: [mediaItem("a"), film], total: 2, nextOffset: null })),
          })}
          newsSource={stubNewsSource()}
        />,
      );

      fireEvent.click(await screen.findByTestId("news-post-image-pick"));

      expect(await screen.findByTestId("media-picker-item-a")).toBeInTheDocument();
      expect(screen.queryByTestId("media-picker-item-film")).not.toBeInTheDocument();
    });

    it("zeigt nach dem Wechsel der Folie deren Adresse, nicht die verworfene Eingabe", async () => {
      setup([slide("a"), slide("b")]);
      typeUrl("slide-image-url", "kaputt");
      await userEvent.click(screen.getByText("Überschrift b"));

      expect(urlField("slide-image")).toHaveValue("https://cdn.example.test/b.png");
      expect(screen.queryByTestId("slide-image-url-error")).not.toBeInTheDocument();
    });
  });

  describe("Mediathek als Leiste im Rahmen", () => {
    const film: MediaItem = {
      ...mediaItem("film"),
      url: "https://cdn.example.test/film.mov",
      playbackUrl: "https://cdn.example.test/t_mp4/film.mp4",
      hasPreview: true,
      fileName: "film.mov",
      type: "video",
    };
    const library = (): MediaClient =>
      stubMediaClient({ listMedia: jest.fn(async () => ({ items: [mediaItem("a"), film], total: 2, nextOffset: null })) });

    /** Der Editor im echten Rahmen: dort dockt die Mediathek rechts an. */
    const mountInShell = (value: HeroItem[]): Harness & { closeShell: jest.Mock } => {
      const onChange = jest.fn<void, [HeroItem[]]>();
      const closeShell = jest.fn();
      const client = library();
      function InShell(): React.ReactElement {
        const [items, setItems] = React.useState(value);
        return (
          <ConfigShell widgetName="Hero-Slider" title="Folien" dirty={false} onApply={jest.fn()} onDiscard={jest.fn()} onClose={closeShell}>
            <SlideEditor
              value={editorValue(items)}
              onChange={(next) => {
                onChange(next.items);
                setItems(next.items);
              }}
              mediaClient={client}
              newsSource={stubNewsSource()}
            />
          </ConfigShell>
        );
      }
      render(<InShell />);
      const latest = (): HeroItem[] => onChange.mock.calls[onChange.mock.calls.length - 1]![0];
      return { onChange, latest, latestSlides: () => latest() as Slide[], closeShell };
    };

    const panelNamed = (name: string): HTMLElement => screen.getByRole("complementary", { name });

    beforeEach(() => forgetDraggedForTests());

    it("öffnet die Mediathek als Leiste und nennt das Ziel", async () => {
      mountInShell([slide("a", { image: { url: "", alt: "" } }), slide("b")]);
      await userEvent.click(screen.getByTestId("slide-image-pick"));

      expect(panelNamed("Bild für Folie 1")).toBeInTheDocument();
      expect(screen.queryByRole("dialog", { name: "Staffbase Medien" })).toBeNull();
      // Eine Folie nimmt auch Videos.
      expect(await within(panelNamed("Bild für Folie 1")).findByTestId("media-picker-item-film")).toBeInTheDocument();

      await userEvent.click(screen.getByTestId("slide-portrait-pick"));
      expect(panelNamed("Hochformat-Bild für Folie 1")).toBeInTheDocument();
    });

    it("nennt beim News-Beitrag das Bühnenbild und bietet nur Bilder an", async () => {
      mountInShell([postItem("p", { channelId: "c1", postId: "p1" })]);
      await userEvent.click(await screen.findByTestId("news-post-image-pick"));

      const panel = panelNamed("Bühnenbild für News-Beitrag 1");
      expect(await within(panel).findByTestId("media-picker-item-a")).toBeInTheDocument();
      expect(within(panel).queryByTestId("media-picker-item-film")).toBeNull();
    });

    it("übernimmt per Klick in die Folie, die gefragt hat – auch nach einem Wechsel der Auswahl", async () => {
      const h = mountInShell([slide("a", { image: { url: "", alt: "" } }), slide("b")]);
      await userEvent.click(screen.getByTestId("slide-image-pick"));
      const tile = await screen.findByTestId("media-picker-item-a");

      await userEvent.click(screen.getByText("Überschrift b"));
      await userEvent.click(tile);

      await waitFor(() => expect(h.onChange).toHaveBeenCalled());
      expect(h.latestSlides()[0]!.image).toMatchObject({ url: "https://cdn.example.test/a.png", width: 1920, height: 823 });
      expect(h.latestSlides()[1]!.image.url).toBe("https://cdn.example.test/b.png");
      expect(screen.queryByRole("complementary", { name: "Bild für Folie 1" })).toBeNull();
    });

    it("schließt die Leiste mit Escape, nicht den Rahmen", async () => {
      const h = mountInShell([slide("a")]);
      await userEvent.click(screen.getByTestId("slide-image-replace"));
      expect(panelNamed("Bild für Folie 1")).toBeInTheDocument();

      await userEvent.keyboard("{Escape}");

      expect(screen.queryByRole("complementary", { name: "Bild für Folie 1" })).toBeNull();
      expect(h.closeShell).not.toHaveBeenCalled();
    });

    it("nimmt ein Bild aus der Leiste per Ziehen an jedem Bildfeld an", async () => {
      const h = mountInShell([slide("a")]);
      await userEvent.click(screen.getByTestId("slide-image-replace"));
      const dataTransfer = fakeDataTransfer();
      fireEvent.dragStart(await screen.findByTestId("media-picker-item-a"), { dataTransfer });

      const portrait = screen.getByTestId("slide-portrait-drop");
      expect(portrait).toHaveAttribute("data-drop-state", "ready");
      fireEvent.dragEnter(portrait, { dataTransfer });
      expect(portrait).toHaveAttribute("data-drop-state", "over");
      fireEvent.drop(portrait, { dataTransfer });

      await waitFor(() => expect(h.latestSlides()[0]!.imagePortrait).toMatchObject({ url: "https://cdn.example.test/a.png", width: 1920 }));
      expect(h.latestSlides()[0]!.image.url).toBe("https://cdn.example.test/a.png");
    });

    it("legt ein Video in der abspielbaren Fassung als Folienbild ab", async () => {
      const h = mountInShell([slide("a")]);
      await userEvent.click(screen.getByTestId("slide-image-replace"));
      const dataTransfer = fakeDataTransfer();
      fireEvent.dragStart(await screen.findByTestId("media-picker-item-film"), { dataTransfer });
      fireEvent.drop(screen.getByTestId("slide-image-drop"), { dataTransfer });

      await waitFor(() => expect(h.latestSlides()[0]!.image).toMatchObject({ url: "https://cdn.example.test/t_mp4/film.mp4", kind: "video" }));
    });

    it("lässt ein Video am Bühnenbild eines News-Beitrags abprallen", async () => {
      const h = mountInShell([postItem("p", { channelId: "c1", postId: "p1" }), slide("s")]);
      // Die Leiste öffnet über die Folie; dort gibt es auch Videos zum Ziehen.
      await userEvent.click(screen.getByText("Überschrift s"));
      await userEvent.click(screen.getByTestId("slide-image-replace"));
      const dataTransfer = fakeDataTransfer();
      fireEvent.dragStart(await screen.findByTestId("media-picker-item-film"), { dataTransfer });
      await userEvent.click(within(screen.getByRole("grid", { name: "Einträge" })).getAllByRole("row")[0]!);

      const zone = await screen.findByTestId("news-post-image-drop");
      expect(zone).toHaveAttribute("data-drop-state", "idle");
      expect(fireEvent.dragEnter(zone, { dataTransfer })).toBe(true);
      expect(h.onChange).not.toHaveBeenCalled();
    });
  });

  describe("News-Einträge anlegen", () => {
    it("legt einen Beitrags-Eintrag an und wählt ihn aus", async () => {
      const h = setupLive([]);
      await addVia(/^News-Beitrag/);

      const items = h.latest();
      expect(items).toHaveLength(1);
      expect(items[0]).toMatchObject({ type: "news-post", channelId: "", postId: "" });
      expect(screen.getByRole("heading", { name: "Eintrag 1 von 1" })).toBeInTheDocument();
    });

    it("legt einen Kanal-Eintrag mit brauchbaren Vorgaben an", async () => {
      const h = setup([]);
      await addVia(/^News-Kanal/);

      expect(h.latest()[0]).toMatchObject({
        type: "news-channel",
        count: DEFAULT_CHANNEL_COUNT,
        order: "newest",
      });
    });

    it("bietet die drei Sorten mit ihrem Zweck erst an, wenn das Menü offen ist", async () => {
      setup([]);
      expect(screen.queryByRole("menu")).toBeNull();

      await userEvent.click(screen.getByRole("button", { name: "Neu" }));
      const menu = await screen.findByRole("menu");

      expect(within(menu).getAllByRole("menuitem")).toHaveLength(3);
      expect(menu).toHaveTextContent("Bild oder Video mit Text und Buttons");
      expect(menu).toHaveTextContent("Ein Beitrag aus einem Kanal");
      expect(menu).toHaveTextContent("Die neuesten Beiträge eines Kanals, je eine Folie");
    });

    it("schließt das Menü nach der Wahl", async () => {
      setup([]);
      await addVia(/^Folie/);
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    });

    it("schließt das Menü mit Escape", async () => {
      setup([]);
      await userEvent.click(screen.getByRole("button", { name: "Neu" }));
      await screen.findByRole("menu");
      await userEvent.keyboard("{Escape}");

      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    });

    it("sperrt das Anlegen, wenn die Bühne voll ist", async () => {
      setup(Array.from({ length: MAX_ITEMS }, (_, i) => slide(`s${i}`)));

      const add = screen.getByRole("button", { name: "Neu" });
      expect(add).toBeDisabled();
      await userEvent.click(add);
      expect(screen.queryByRole("menu")).toBeNull();
    });

    it("zeigt je Eintrag seine Sorte an", async () => {
      setup([slide("a"), postItem("p"), channelItem("c")]);

      const [first, second, third] = rows();
      expect(first).toHaveTextContent("Folie");
      expect(second).toHaveTextContent("News-Beitrag");
      expect(third).toHaveTextContent("News-Kanal · 3 neueste");

      // Der Kanalname wird nachgeladen; bis dahin steht dort die Kennung.
      expect(third).toHaveTextContent("c1");
      await waitFor(() => expect(rows()[2]).toHaveTextContent("Unternehmen"));
    });

    it("nennt beim Kanal die Reihenfolge", () => {
      setup([channelItem("c", { order: "oldest", count: 2 })]);
      expect(rows()[0]).toHaveTextContent("News-Kanal · 2 älteste");
    });

    it("holt Titel, Kanal und Bild eines gewählten Beitrags für die Liste nach", async () => {
      setup([postItem("p", { channelId: "c2", postId: "p1" })]);

      await waitFor(() => expect(rows()[0]).toHaveTextContent("Beitrag p1"));
      await waitFor(() => expect(rows()[0]).toHaveTextContent("News-Beitrag · Kanal Technik"));
      expect(rows()[0]!.querySelector("img")).toHaveAttribute("src", "https://cdn.example.test/post-p1.jpg");
    });

    it("zeigt beim Beitrag das eigene Bühnenbild vor dem Beitragsbild", async () => {
      setup([
        postItem("p", { channelId: "c1", postId: "p1", imageOverride: { url: "https://cdn.example.test/eigen.jpg", alt: "" } }),
      ]);

      await waitFor(() => expect(rows()[0]).toHaveTextContent("Beitrag p1"));
      expect(rows()[0]!.querySelector("img")).toHaveAttribute("src", "https://cdn.example.test/eigen.jpg");
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

      const channel = await screen.findByRole("combobox", { name: /Kanal/ });
      expect(channel).toHaveAttribute("data-testid", "news-post-channel");
      expect(screen.getByRole("combobox", { name: /Beitrag/ })).toBeDisabled();

      await choose(channel, "Unternehmen");
      expect(h.latest()[0]).toMatchObject({ channelId: "c1", postId: "" });
    });

    it("markiert Kanal und Beitrag als Pflicht und nennt den fehlenden Beitrag, sobald der Rahmen Fehler zeigt", async () => {
      setup([postItem("p", { channelId: "c1" })], { shell: { issuesVisible: true } });

      const post = await screen.findByRole("combobox", { name: /Beitrag/ });
      expect(post).toHaveAttribute("aria-required", "true");
      expect(post).toHaveAttribute("aria-invalid", "true");
      expect(post).toHaveAccessibleDescription(expect.stringContaining("Ohne Beitrag wird dieser Eintrag nicht gezeigt."));
      expect(screen.getByRole("combobox", { name: /Kanal/ })).toHaveAttribute("aria-required", "true");
    });

    it("lässt eine Kennung von Hand eingeben", async () => {
      const h = setup([postItem("p", { channelId: "c1" })]);

      await choose(await screen.findByRole("combobox", { name: /Beitrag/ }), "Andere Kennung eingeben …");
      const manual = screen.getByTestId("news-post-post-manual");
      expect(manual).toHaveFocus();
      fireEvent.change(manual, { target: { value: " 6a5e6703cb02c92e74be1eaa " } });

      expect(h.latest()[0]).toMatchObject({ postId: "6a5e6703cb02c92e74be1eaa" });
    });

    it("wirft den gewählten Beitrag weg, wenn der Kanal wechselt", async () => {
      const h = setup([postItem("p", { channelId: "c1", postId: "p1" })]);

      await waitFor(() => expect(screen.getByTestId("news-post-channel")).toHaveTextContent("Unternehmen"));
      await choose(screen.getByTestId("news-post-channel"), "Technik");

      expect(h.latest()[0]).toMatchObject({ channelId: "c2", postId: "" });
    });

    it("bietet die Beiträge des Kanals mit ihrem Titel an", async () => {
      setup([postItem("p", { channelId: "c1" })]);

      const select = await screen.findByTestId("news-post-post");
      await waitFor(() => expect(select).toBeEnabled());
      await userEvent.click(select);
      expect(await screen.findByRole("option", { name: "Erster Beitrag" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "Zweiter Beitrag" })).toBeInTheDocument();
    });

    it("tritt zur Seite, wenn die Kanalliste nicht erreichbar ist", async () => {
      setup([postItem("p")], { newsSource: stubNewsSource({ channels: jest.fn(async () => []) }) });

      const manual = await screen.findByTestId("news-post-channel-manual");
      expect(manual).toBeInTheDocument();
      expect(screen.queryByTestId("news-post-channel")).not.toBeInTheDocument();
    });

    it("sagt in der Vorschau, was fehlt, solange kein Beitrag gewählt ist", () => {
      setup([postItem("p")], { shell: { view: "desktop" } });
      expect(screen.getByTestId("hero-news-preview")).toHaveTextContent("Wähle einen Beitrag");
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

      const order = screen.getByRole("radiogroup", { name: "Reihenfolge" });
      expect(within(order).getByRole("radio", { name: "Neueste zuerst" })).toBeChecked();
      await userEvent.click(within(order).getByRole("radio", { name: "Älteste zuerst" }));
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

      const toggle = await screen.findByRole("switch", { name: "Nur Beiträge mit Bild" });
      expect(toggle).toBeChecked();
      expect(toggle).toHaveAccessibleDescription(expect.stringContaining("dunkle Fläche"));

      fireEvent.click(toggle);
      expect(h.latest()[0]).toMatchObject({ requireImage: false });
    });

    it("gliedert die Felder wie der Screen", () => {
      setup([channelItem("c")]);
      expect(screen.getAllByRole("region").map((region) => within(region).getAllByRole("heading")[0]!.textContent)).toEqual([
        "Quelle",
        "Auswahl",
        "Darstellung",
      ]);
    });

    it("blendet den Anrisstext per Schalter aus", () => {
      const h = setup([channelItem("c")]);
      fireEvent.click(screen.getByRole("switch", { name: "Anrisstext zeigen" }));
      expect(h.latest()[0]).toMatchObject({ showTeaser: false });
    });

    it("zeigt in der Vorschau eine Folie je Beitrag", async () => {
      setup([channelItem("c", { channelId: "c1", count: 2 })], { shell: { view: "desktop" } });

      await waitFor(() => expect(screen.getAllByTestId("hero-slide-preview")).toHaveLength(2));
      const [first, second] = screen.getAllByTestId("hero-slide-preview");
      expect(first).toHaveTextContent("Erster Beitrag");
      expect(second).toHaveTextContent("Zweiter Beitrag");
      expect(screen.getByText("Folie 2 von 2")).toBeInTheDocument();
    });

    it("sagt in der Vorschau, wenn die Filter nichts übrig lassen", async () => {
      setup([channelItem("c", { channelId: "c1" })], {
        shell: { view: "desktop" },
        newsSource: stubNewsSource({ posts: jest.fn(async () => []) }),
      });

      await waitFor(() => expect(screen.getByTestId("hero-news-preview")).toHaveTextContent("Dazu gibt es nichts zu zeigen"));
    });
  });
  describe("Animation als Hintergrund", () => {
    // Die Kacheln malen ein Standbild; jsdom hat keine Leinwand.
    beforeEach(() => {
      jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    });

    const option = (name: string): HTMLElement => screen.getByRole("radio", { name });

    it("wechselt von Bild oder Video zur Animation und wirft das Hochformat weg", async () => {
      const h = setupLive([slide("a", { imagePortrait: { url: "https://cdn.example.test/p.jpg", alt: "" } })]);
      await userEvent.click(option("Animation"));

      expect(h.latestSlides()[0]!.image).toEqual(animationMedium(DEFAULT_ANIMATION));
      expect(h.latestSlides()[0]!.imagePortrait).toBeUndefined();
      expect(screen.getByTestId("animation-field")).toBeInTheDocument();
      expect(screen.queryByTestId("slide-image-pick")).toBeNull();
    });

    it("stellt Muster, Grundton, Tempo, Akzente und Grund ein", async () => {
      const h = setupLive([slide("a", { image: animationMedium(DEFAULT_ANIMATION) })]);
      await userEvent.click(screen.getByTestId("animation-pattern-grid"));
      await userEvent.click(option("Hell"));
      await userEvent.click(option("Lebhaft"));
      await userEvent.click(screen.getByRole("switch", { name: /Rote Akzente/ }));

      await userEvent.click(option("50 %"));

      expect(h.latestSlides()[0]!.image.animation).toEqual({ pattern: "grid", theme: "light", speed: "lively", accent: false, opacity: 0.5 });
      expect(screen.getByTestId("animation-pattern-grid")).toHaveAttribute("aria-pressed", "true");
    });

    it("geht zurück zu einer leeren Datei", async () => {
      const h = setupLive([slide("a", { image: animationMedium(DEFAULT_ANIMATION) })]);
      await userEvent.click(option("Bild oder Video"));

      expect(h.latestSlides()[0]!.image).toEqual({ url: "", alt: "" });
      expect(screen.getByTestId("slide-image-pick")).toBeInTheDocument();
    });
  });
});
