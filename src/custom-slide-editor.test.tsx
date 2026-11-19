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
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfigShellProvider, type ConfigShellState } from "@man/config-ui/shell/shell-context";
import { fakeDataTransfer } from "@man/config-ui/drop/drag-testing";
import { MediaClient } from "@shared/media/media-client";
import { SlideEditor } from "./slide-editor";
import { HeroItem, SlideItem } from "./hero-items";
import { BLOCK_DRAG_TYPE } from "./editors/zone-stage";
import { NewsSource } from "./editors/news-source";
import { blocksInReadingOrder } from "./slide-layout";

const shell: ConfigShellState = { view: "editor", setView: () => undefined, preview: true, issuesVisible: false };

const media = {
  listMedia: jest.fn(async () => ({ items: [], total: 0, nextOffset: null })),
  searchMedia: jest.fn(async () => ({ items: [], nextCursor: null })),
  uploadMedia: jest.fn(),
  ensurePublicImageUrl: jest.fn(async (m: { url: string }) => m.url),
  currentUserId: jest.fn(async () => null),
} as unknown as MediaClient;

const news: NewsSource = {
  channels: jest.fn(async () => []),
  posts: jest.fn(async () => []),
  post: jest.fn(async () => {
    throw new Error("kein Beitrag");
  }),
  locales: jest.fn(async () => ["de_DE"]),
  pages: jest.fn(async () => []),
};

const fixed: SlideItem = {
  id: "a",
  image: { url: "https://cdn.example.test/a.png", alt: "" },
  headline: "Willkommen",
  subline: "Eine Zeile",
  ctas: [{ label: "Los", href: "https://example.test/los" }],
};

/** Der Editor mit Wert im Zustand; `latest()` ist die jüngste Folie. */
function setup(items: HeroItem[]): { latest: () => SlideItem } {
  const changes: HeroItem[][] = [];
  function Harness(): React.ReactElement {
    const [value, setValue] = React.useState(items);
    return (
      <ConfigShellProvider value={shell}>
        <SlideEditor
          value={{ items: value, settings: {}, legacy: {} }}
          onChange={(next) => {
            changes.push(next.items);
            setValue(next.items);
          }}
          mediaClient={media}
          newsSource={news}
        />
      </ConfigShellProvider>
    );
  }
  render(<Harness />);
  return { latest: () => (changes.at(-1) ?? items)[0] as SlideItem };
}

const panel = (): HTMLElement => screen.getByRole("complementary", { name: "Einstellungen" });
const blocks = (slide: SlideItem) => blocksInReadingOrder(slide.layout).map(({ zone, block }) => ({ zone, type: block.type }));

describe("Benutzerdefinierte Folie im Editor", () => {
  beforeEach(() => {
    jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  });
  afterEach(() => jest.restoreAllMocks());

  it("nimmt beim Wechsel Überschrift, Unterzeile und Buttons als Bausteine mit", async () => {
    const h = setup([fixed]);
    await userEvent.click(within(panel()).getByRole("radio", { name: "Benutzerdefiniert" }));

    expect(h.latest().mode).toBe("custom");
    expect(blocks(h.latest())).toEqual([
      { zone: "bottom-left", type: "heading" },
      { zone: "bottom-left", type: "text" },
      { zone: "bottom-left", type: "buttons" },
    ]);
    // Die Bühne ist Arbeitsfläche: neun Zonen, der Inhalt in seiner.
    expect(screen.getAllByTestId(/^stage-zone-(?!label)/)).toHaveLength(9);
    expect(within(screen.getByTestId("stage-zone-bottom-left")).getByText("Willkommen")).toBeInTheDocument();
    expect(within(panel()).getByTestId("block-catalog")).toBeInTheDocument();
  });

  it("legt per Klick im Katalog an, wählt den Baustein und stellt ihn ein", async () => {
    const h = setup([{ ...fixed, mode: "custom", layout: {} }]);
    await userEvent.click(within(panel()).getByTestId("catalog-label"));

    expect(blocks(h.latest())).toEqual([{ zone: "bottom-left", type: "label" }]);
    const form = within(panel()).getByTestId("block-form");
    fireEvent.change(within(form).getByTestId("block-text"), { target: { value: "Neu" } });
    await userEvent.click(within(form).getByRole("button", { name: "oben rechts" }));
    await userEvent.click(within(form).getByRole("switch", { name: /Mobil ausblenden/ }));

    expect(blocks(h.latest())).toEqual([{ zone: "top-right", type: "label" }]);
    expect(h.latest().layout?.["top-right"]?.[0]).toMatchObject({ text: "Neu", hideMobile: true });
    expect(within(screen.getByTestId("stage-zone-top-right")).getByText("Neu")).toBeInTheDocument();
  });

  it("legt einen gezogenen Baustein in der Zone ab, über der man loslässt", () => {
    const h = setup([{ ...fixed, mode: "custom", layout: {} }]);
    const dataTransfer = fakeDataTransfer();
    fireEvent.dragStart(within(panel()).getByTestId("catalog-image"), { dataTransfer });
    const zone = screen.getByTestId("stage-zone-middle-center");
    fireEvent.dragOver(zone, { dataTransfer });
    expect(zone).toHaveClass("man-se__zone--over");
    fireEvent.drop(zone, { dataTransfer });

    expect(blocks(h.latest())).toEqual([{ zone: "middle-center", type: "image" }]);
    expect(within(panel()).getByTestId("block-image-pick")).toBeInTheDocument();
  });

  it("verschiebt einen Baustein der Bühne per Ziehen in eine andere Zone", () => {
    const h = setup([{ ...fixed, mode: "custom", layout: { "top-left": [{ id: "x", type: "label", text: "Hallo", color: "auto" }] } }]);
    const dataTransfer = fakeDataTransfer();
    fireEvent.dragStart(screen.getByTestId("stage-block-x"), { dataTransfer });
    expect(JSON.parse(dataTransfer.getData(BLOCK_DRAG_TYPE))).toEqual({ kind: "move", id: "x" });
    fireEvent.drop(screen.getByTestId("stage-zone-bottom-right"), { dataTransfer });

    expect(blocks(h.latest())).toEqual([{ zone: "bottom-right", type: "label" }]);
  });

  it("öffnet per Klick auf der Bühne die Einstellungen, zurück führt zum Katalog, löschen entfernt", async () => {
    const h = setup([{ ...fixed, mode: "custom", layout: { "top-left": [{ id: "x", type: "label", text: "Hallo", color: "auto" }] } }]);
    await userEvent.click(screen.getByRole("tab", { name: "Gestaltung" }));
    await userEvent.click(screen.getByTestId("stage-block-x"));

    // Das Panel springt auf den Reiter der Folie.
    expect(screen.getByRole("tab", { name: "Folie" })).toHaveAttribute("aria-selected", "true");
    expect(within(panel()).getByTestId("block-text")).toHaveValue("Hallo");
    await userEvent.click(within(panel()).getByRole("button", { name: "Zurück zur Folie" }));
    expect(within(panel()).getByTestId("block-catalog")).toBeInTheDocument();

    // Die Liste „Auf der Folie“ wählt auch ohne Bühne.
    await userEvent.click(within(within(panel()).getByTestId("block-list")).getByRole("button", { name: /^Label/ }));
    await userEvent.click(within(panel()).getByRole("button", { name: "Baustein löschen" }));
    expect(h.latest().layout).toEqual({});
    expect(within(panel()).getByTestId("block-catalog")).toBeInTheDocument();
  });

  it("führt ein Klick auf einen Button der Bühne nicht aus dem Studio, sondern wählt ihn", async () => {
    setup([{ ...fixed, mode: "custom", layout: { "bottom-left": [{ id: "b", type: "buttons", ctas: [{ label: "Los", href: "https://example.test/los" }] }] } }]);
    const link = within(screen.getByTestId("stage-block-b")).getByRole("link", { name: "Los" });
    const click = new MouseEvent("click", { bubbles: true, cancelable: true });
    act(() => {
      link.dispatchEvent(click);
    });

    expect(click.defaultPrevented).toBe(true);
    expect(await within(panel()).findByTestId("block-form")).toBeInTheDocument();
  });

  it("richtet eine Zone aus: Klick auf ihren Namen, x und y im Panel", async () => {
    const h = setup([{ ...fixed, mode: "custom", layout: { "top-left": [{ id: "x", type: "label", text: "Hallo", color: "auto" }] } }]);
    await userEvent.click(screen.getByTestId("stage-zone-label-top-left"));

    const form = within(panel()).getByTestId("zone-form");
    expect(within(form).getByRole("radio", { name: "Links" })).toBeChecked();
    await userEvent.click(within(form).getByRole("radio", { name: "Rechts" }));
    await userEvent.click(within(form).getAllByRole("radio", { name: "Mitte" })[1]!);

    expect(h.latest().zoneAlign).toEqual({ "top-left": { x: "end", y: "center" } });
    const zone = screen.getByTestId("stage-zone-top-left").closest(".man-hero__zone")!;
    expect(zone).toHaveClass("man-hero__zone--x-end", "man-hero__zone--y-center");
    // Aus der Zone direkt zu ihrem Baustein.
    await userEvent.click(within(form).getByRole("button", { name: /^Label/ }));
    expect(within(panel()).getByTestId("block-form")).toBeInTheDocument();
  });

  it("wählt die Zone auch über ihre leere Fläche und richtet sie aus dem Baustein heraus aus", async () => {
    const h = setup([{ ...fixed, mode: "custom", layout: { "bottom-left": [{ id: "x", type: "label", text: "Hallo", color: "auto" }] } }]);
    await userEvent.click(screen.getByTestId("stage-zone-middle-center"));
    expect(within(panel()).getByTestId("zone-form")).toHaveTextContent("Zone Mitte");

    await userEvent.click(screen.getByTestId("stage-block-x"));
    await userEvent.click(within(within(panel()).getByTestId("block-form")).getByRole("radio", { name: "Rechts" }));
    expect(h.latest().zoneAlign).toEqual({ "bottom-left": { x: "end" } });
  });

  it("fasst die obere Reihe zu einer Zone zusammen und trennt sie wieder", async () => {
    const label = (id: string) => ({ id, type: "label" as const, text: id, color: "auto" as const });
    const h = setup([{ ...fixed, mode: "custom", layout: { "top-left": [label("a")], "top-right": [label("b")] } }]);
    await userEvent.click(screen.getByTestId("stage-zone-label-top-left"));
    await userEvent.click(within(within(panel()).getByTestId("zone-form")).getByRole("radio", { name: "3 Spalten" }));

    expect(h.latest().zoneSpan).toEqual({ "top-left": { cols: 3 } });
    expect(blocks(h.latest())).toEqual([
      { zone: "top-left", type: "label" },
      { zone: "top-left", type: "label" },
    ]);
    // Die Bühne folgt: sieben Zonen, die obere über die ganze Breite.
    expect(screen.getAllByTestId(/^stage-zone-(?!label)/)).toHaveLength(7);
    expect(screen.getByTestId("stage-zone-top-left").closest(".man-hero__zone")).toHaveClass("man-hero__zone--cols-3");
    expect(screen.getByTestId("stage-zone-label-top-left")).toHaveTextContent("oben, ganze Breite");
    expect(within(panel()).getByTestId("zone-form")).toHaveTextContent("Zone oben, ganze Breite");

    await userEvent.click(within(within(panel()).getByTestId("zone-form")).getByRole("radio", { name: "1 Spalte" }));
    expect(h.latest().zoneSpan).toBeUndefined();
    expect(screen.getAllByTestId(/^stage-zone-(?!label)/)).toHaveLength(9);
  });

  it("wächst von rechts nach links, die Wahl folgt dem Anker; was eine Zone anschnitte, fehlt", async () => {
    const h = setup([{ ...fixed, mode: "custom", layout: {}, zoneSpan: { "top-left": { cols: 2 } } }]);
    await userEvent.click(screen.getByTestId("stage-zone-label-bottom-right"));
    await userEvent.click(within(within(panel()).getByTestId("zone-form")).getByRole("radio", { name: "3 Zeilen" }));
    // Oben rechts liegt außerhalb von „oben, links bis Mitte“ — die Spalte rechts geht ganz.
    expect(h.latest().zoneSpan).toEqual({ "top-left": { cols: 2 }, "top-right": { rows: 3 } });
    expect(within(panel()).getByTestId("zone-form")).toHaveTextContent("Zone rechts, ganze Höhe");

    // Mitte Mitte kann nicht nach oben: dort läge die halbe zusammengefasste Zone.
    await userEvent.click(screen.getByTestId("stage-zone-label-middle-center"));
    const form = within(within(panel()).getByTestId("zone-form"));
    expect(form.getByRole("radio", { name: "2 Zeilen" })).toBeInTheDocument();
    expect(form.queryByRole("radio", { name: "3 Zeilen" })).toBeNull();
  });

  it("bietet im Baustein nur die Zonen an, die es gibt", async () => {
    setup([{ ...fixed, mode: "custom", layout: { "top-left": [{ id: "x", type: "label", text: "Hallo", color: "auto" }] }, zoneSpan: { "top-left": { rows: 3 } } }]);
    await userEvent.click(screen.getByTestId("stage-block-x"));
    const form = within(within(panel()).getByTestId("block-form"));
    expect(form.getByRole("button", { name: "links, ganze Höhe" })).toHaveAttribute("aria-pressed", "true");
    expect(form.queryByRole("button", { name: "unten links" })).toBeNull();
  });

  it("macht beim Wechsel zurück zu „Fest“ die erste Überschrift zur Überschrift", async () => {
    const h = setup([
      { ...fixed, headline: "Alt", mode: "custom", layout: { "top-left": [{ id: "h", type: "heading", text: "Neu gestaltet", size: "h1", color: "auto" }] } },
    ]);
    await userEvent.click(within(panel()).getByRole("radio", { name: "Fest" }));

    expect(h.latest().mode).toBeUndefined();
    expect(h.latest().headline).toBe("Neu gestaltet");
    expect(within(panel()).getByTestId("slide-headline")).toHaveValue("Neu gestaltet");
  });
});
