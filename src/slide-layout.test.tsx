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
import { render, screen } from "@testing-library/react";
import { decodePayload } from "@shared/payload";
import { HeroSlider } from "./hero-slider";
import { SlideItem, parseHeroItems, serializeHeroItems } from "./hero-items";
import { SlideLayout, blocksInReadingOrder, firstHeading, newBlock } from "./slide-layout";
import { applyTranslatedFields, heroItemsToTranslatableHtml, readTranslatedFields } from "./translation-payload";

const LAYOUT: SlideLayout = {
  "top-left": [{ id: "l1", type: "label", text: "Neu", color: "red" }],
  "bottom-left": [
    { id: "h1", type: "heading", text: "Große Überschrift", size: "display", color: "auto" },
    { id: "t1", type: "text", text: "Ein Satz dazu.", size: "l", color: "auto", hideMobile: true },
    { id: "b1", type: "buttons", ctas: [{ label: "Mehr", href: "https://example.test/a" }, { label: "Kontakt", href: "mailto:a@example.test", variant: "outline" }] },
  ],
  "middle-right": [
    { id: "i1", type: "image", image: { url: "https://example.test/logo.png", alt: "Logo" }, size: "s" },
    { id: "h2", type: "heading", text: "Zweite", size: "h3", color: "white" },
    { id: "c1", type: "icon", icon: "play", size: "l", color: "auto" },
  ],
};

const custom = (extra: Partial<SlideItem> = {}): SlideItem => ({
  id: "s",
  image: { url: "https://example.test/bg.jpg", alt: "" },
  headline: "",
  mode: "custom",
  layout: LAYOUT,
  ...extra,
});

const stored = (items: SlideItem[]): Record<string, unknown>[] => {
  const raw = serializeHeroItems(items);
  return JSON.parse(decodePayload(raw) ?? raw) as Record<string, unknown>[];
};

describe("slide-layout", () => {
  it("liest Bausteine in Lesereihenfolge der Zonen", () => {
    expect(blocksInReadingOrder(LAYOUT).map(({ block }) => block.id)).toEqual(["l1", "i1", "h2", "c1", "h1", "t1", "b1"]);
    expect(firstHeading(LAYOUT)).toBe("Zweite");
  });

  it("setzt neue Bausteine mit Vorgaben ein", () => {
    expect(newBlock("heading")).toMatchObject({ type: "heading", size: "h1", color: "auto" });
    expect(newBlock("buttons")).toMatchObject({ type: "buttons", ctas: [] });
    expect(newBlock("image")).toMatchObject({ type: "image", image: { url: "", alt: "" }, size: "m" });
  });
});

describe("Speichern und Laden", () => {
  it("übersteht den Weg ins Attribut und zurück", () => {
    const items = [custom({ headline: "Zweite" })];
    expect(parseHeroItems(serializeHeroItems(items))).toEqual(items);
  });

  it("speichert knapp und spiegelt die erste Überschrift als headline", () => {
    const [entry] = stored([custom()]);
    expect(entry!.mode).toBe("custom");
    expect(entry!.headline).toBe("Zweite");
    const layout = entry!.layout as Record<string, Record<string, unknown>[]>;
    expect(layout["bottom-left"]![0]).toEqual({ id: "h1", type: "heading", text: "Große Überschrift", size: "display" });
    expect(layout["bottom-left"]![1]).toEqual({ id: "t1", type: "text", text: "Ein Satz dazu.", hideMobile: true });
    expect(Object.keys(layout)).toEqual(["top-left", "middle-right", "bottom-left"]);
  });

  it("lässt unbekannte Bausteine und Zonen weg, ohne die Folie zu verlieren", () => {
    const raw = JSON.stringify([
      { id: "s", image: { url: "https://example.test/bg.jpg", alt: "" }, headline: "", mode: "custom", layout: { "top-left": [{ id: "x", type: "video" }, { id: "y", type: "label", text: "Hallo" }], nirgends: [{ type: "label", text: "?" }] } },
    ]);
    const [item] = parseHeroItems(raw) as SlideItem[];
    expect(item!.layout).toEqual({ "top-left": [{ id: "y", type: "label", text: "Hallo", color: "auto" }] });
  });

  it("lässt feste Folien Zeichen für Zeichen, wie sie waren", () => {
    const [entry] = stored([{ id: "f", image: { url: "https://example.test/bg.jpg", alt: "" }, headline: "Fest" }]);
    expect(entry).toEqual({ id: "f", image: { url: "https://example.test/bg.jpg", alt: "" }, headline: "Fest" });
  });
});

describe("Darstellung", () => {
  const slide = { id: "s", image: { url: "https://example.test/bg.jpg", alt: "" }, headline: "", mode: "custom" as const, layout: LAYOUT };

  it("legt die Bausteine in ihre Zonen", () => {
    const { container } = render(<HeroSlider slides={[slide]} />);
    const zones = [...container.querySelectorAll("[data-zone]")].map((zone) => zone.getAttribute("data-zone"));
    expect(zones).toEqual(["top-left", "middle-right", "bottom-left"]);
    expect(container.querySelector(".man-hero__zone--bottom-left")).toContainElement(screen.getByText("Große Überschrift"));
  });

  it("macht die erste Überschrift zum h2, weitere zu h3 — die Größe kommt aus dem Baustein", () => {
    render(<HeroSlider slides={[slide]} />);
    expect(screen.getByRole("heading", { level: 2, name: "Zweite" })).toHaveClass("man-hero__block-heading--h3");
    expect(screen.getByRole("heading", { level: 3, name: "Große Überschrift" })).toHaveClass("man-hero__block-heading--display");
  });

  it("zeigt Buttons auch schmal als Buttons und markiert, was mobil fehlt", () => {
    render(<HeroSlider slides={[slide]} />);
    const link = screen.getByRole("link", { name: "Mehr" });
    expect(link).not.toHaveClass("man-hero__cta--lead");
    expect(link.closest(".man-hero__ctas")).toHaveClass("man-hero__ctas--inline");
    expect(screen.getByTestId("hero-block-t1")).toHaveClass("man-hero__block--hide-mobile");
  });

  it("zeigt Bild, Icon und ausdrückliche Farben", () => {
    render(<HeroSlider slides={[slide]} />);
    expect(screen.getByRole("img", { name: "Logo" })).toHaveClass("man-hero__block-image--s");
    expect(screen.getByTestId("hero-block-c1").querySelector("svg")).toHaveClass("man-hero__block-icon--l");
    expect(screen.getByText("Neu")).toHaveClass("man-hero__block--color-red");
  });
});

describe("Übersetzung", () => {
  it("schickt die Texte der Bausteine mit und setzt die Übersetzung zurück", () => {
    const items = [custom()];
    const html = heroItemsToTranslatableHtml(items)!;
    expect(html).toContain('data-hs-field="0.block-h1">Große Überschrift</h2>');
    expect(html).toContain('data-hs-field="0.block-b1-cta-1">Kontakt</p>');
    expect(html).toContain('data-hs-field="0.block-i1-alt">Logo</p>');

    const translated = html.replace("Große Überschrift", "Big headline").replace(">Kontakt<", ">Contact<").replace(">Logo<", ">Brand<");
    const [item] = applyTranslatedFields(items, readTranslatedFields(translated)) as SlideItem[];
    const blocks = Object.fromEntries(blocksInReadingOrder(item!.layout).map(({ block }) => [block.id, block]));
    expect(blocks.h1).toMatchObject({ text: "Big headline", size: "display" });
    expect(blocks.b1).toMatchObject({ ctas: [{ label: "Mehr" }, { label: "Contact", href: "mailto:a@example.test" }] });
    expect(blocks.i1).toMatchObject({ image: { url: "https://example.test/logo.png", alt: "Brand" } });
  });
});
