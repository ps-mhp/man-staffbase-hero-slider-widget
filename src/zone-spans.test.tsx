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
import { render } from "@testing-library/react";
import { HeroSlider } from "./hero-slider";
import { SlideItem, parseHeroItems, serializeHeroItems } from "./hero-items";
import { SlideBlock, SlideLayout, ZoneId } from "./slide-layout";
import { ZoneSpans, foldLayout, ownerOf, parseZoneSpan, resizeZone, visibleZones, zoneName } from "./zone-spans";

const label = (id: string): SlideBlock => ({ id, type: "label", text: id, color: "auto" });
const ids = (layout: SlideLayout, zone: ZoneId): string[] => (layout[zone] ?? []).map((block) => block.id);

const TOP_ROW: ZoneSpans = { "top-left": { cols: 3 } };

describe("zusammengefasste Zonen", () => {
  it("zeigt nur Zonen, die keine andere überdeckt — der Anker steht für die ganze Fläche", () => {
    expect(visibleZones(TOP_ROW)).toEqual(["top-left", "middle-left", "middle-center", "middle-right", "bottom-left", "bottom-center", "bottom-right"]);
    expect(ownerOf(TOP_ROW, "top-right")).toBe("top-left");
    expect(ownerOf(TOP_ROW, "middle-right")).toBe("middle-right");
    expect(visibleZones(undefined)).toHaveLength(9);
  });

  it("benennt zusammengefasste Zonen nach ihrer Fläche", () => {
    expect(zoneName(TOP_ROW, "top-left")).toBe("oben, ganze Breite");
    expect(zoneName({ "top-left": { rows: 3 } }, "top-left")).toBe("links, ganze Höhe");
    expect(zoneName({ "top-left": { cols: 3, rows: 3 } }, "top-left")).toBe("ganze Folie");
    expect(zoneName({ "middle-left": { cols: 2 } }, "middle-left")).toBe("Mitte, links bis Mitte");
    expect(zoneName(TOP_ROW, "bottom-right")).toBe("unten rechts");
  });

  it("liest nur, was ins Raster passt und sich nicht überschneidet", () => {
    expect(
      parseZoneSpan({
        "top-left": { cols: 2 },
        // überschneidet oben links: fällt weg
        "top-center": { rows: 2 },
        // ragt rechts hinaus: fällt weg
        "middle-right": { cols: 2 },
        // 1 ist keine Zusammenfassung
        "bottom-left": { cols: 1, rows: 1 },
        "middle-left": { rows: 2, cols: 7 },
        nirgends: { cols: 2 },
      }),
    ).toEqual({ "top-left": { cols: 2 }, "middle-left": { rows: 2 } });
    expect(parseZoneSpan("quer")).toEqual({});
  });

  it("holt Bausteine aus überdeckten Zellen in den Anker, hinter seine eigenen", () => {
    const folded = foldLayout({ "top-left": [label("a")], "top-right": [label("b")], "bottom-left": [label("c")] }, TOP_ROW);
    expect(folded).toEqual({ "top-left": [label("a"), label("b")], "bottom-left": [label("c")] });
  });
});

describe("Zone vergrößern und verkleinern", () => {
  it("wächst nach rechts, nimmt die Bausteine der Nachbarn mit und vergisst deren Ausrichtung", () => {
    const next = resizeZone(
      { layout: { "top-left": [label("a")], "top-center": [label("b")], "top-right": [label("c")] }, zoneAlign: { "top-center": { y: "end" } } },
      "top-left",
      "cols",
      3,
    )!;
    expect(next.zone).toBe("top-left");
    expect(next.zoneSpan).toEqual(TOP_ROW);
    expect(ids(next.layout, "top-left")).toEqual(["a", "b", "c"]);
    expect(Object.keys(next.layout)).toEqual(["top-left"]);
    expect(next.zoneAlign).toEqual({});
  });

  it("wächst nach links, wenn rechts kein Platz ist, und behält, wo die Bausteine standen", () => {
    const next = resizeZone({ layout: { "top-left": [label("a")], "top-right": [label("c")] } }, "top-right", "cols", 3)!;
    expect(next.zone).toBe("top-left");
    expect(next.zoneSpan).toEqual(TOP_ROW);
    // Die eigenen Bausteine zuerst, dann die der übernommenen Zonen.
    expect(ids(next.layout, "top-left")).toEqual(["c", "a"]);
    // Rechts bündig wie vorher — jetzt als Abweichung am neuen Anker.
    expect(next.zoneAlign).toEqual({ "top-left": { x: "end" } });
  });

  it("fasst senkrecht zusammen: die linke Spalte von unten aus", () => {
    const next = resizeZone({ layout: { "bottom-left": [label("a")] } }, "bottom-left", "rows", 3)!;
    expect(next.zone).toBe("top-left");
    expect(next.zoneSpan).toEqual({ "top-left": { rows: 3 } });
    expect(ids(next.layout, "top-left")).toEqual(["a"]);
    expect(next.zoneAlign).toEqual({ "top-left": { y: "end" } });
  });

  it("behält beim Verkleinern die Seite, an der die Bausteine stehen", () => {
    const state = { layout: { "top-left": [label("a")] }, zoneAlign: { "top-left": { x: "end" as const } }, zoneSpan: TOP_ROW };
    const next = resizeZone(state, "top-left", "cols", 1)!;
    expect(next.zone).toBe("top-right");
    expect(next.zoneSpan).toEqual({});
    expect(ids(next.layout, "top-right")).toEqual(["a"]);
    // Rechts ist die Vorgabe oben rechts — keine Abweichung mehr.
    expect(next.zoneAlign).toEqual({});
  });

  it("schluckt eine zusammengefasste Zone ganz, schneidet aber keine an", () => {
    const state = { layout: { "top-center": [label("b")], "top-left": [label("a")] }, zoneSpan: { "top-center": { rows: 2 } } as ZoneSpans };
    // Die obere Reihe träfe nur die obere Hälfte von „oben Mitte, zwei Zeilen“.
    expect(resizeZone(state, "top-left", "cols", 3)).toBeUndefined();
    const tall = resizeZone(state, "top-left", "rows", 2)!;
    const wide = resizeZone(tall, "top-left", "cols", 3)!;
    expect(wide.zoneSpan).toEqual({ "top-left": { cols: 3, rows: 2 } });
    expect(ids(wide.layout, "top-left")).toEqual(["a", "b"]);
  });

  it("lässt das Original unberührt", () => {
    const layout = { "top-left": [label("a")], "top-center": [label("b")] };
    resizeZone({ layout }, "top-left", "cols", 2);
    expect(ids(layout, "top-center")).toEqual(["b"]);
  });
});

describe("zusammengefasste Zonen auf der Seite", () => {
  const slide = (extra: Partial<SlideItem>): SlideItem => ({
    id: "s",
    image: { url: "https://example.test/bg.jpg", alt: "" },
    headline: "",
    mode: "custom",
    layout: {},
    ...extra,
  });

  it("übersteht Speichern und Laden", () => {
    const items = [slide({ layout: { "top-left": [label("a")] }, zoneSpan: TOP_ROW })];
    expect(parseHeroItems(serializeHeroItems(items))).toEqual(items);
  });

  it("holt beim Laden Bausteine aus überdeckten Zellen in die Zone", () => {
    const raw = JSON.stringify([{ ...slide({}), layout: { "top-right": [{ id: "b", type: "label", text: "b" }] }, zoneSpan: TOP_ROW }]);
    const [item] = parseHeroItems(raw) as SlideItem[];
    expect(ids(item!.layout!, "top-left")).toEqual(["b"]);
  });

  it("spannt die Zone über Spalten und Zeilen und hält mobil die Lesereihenfolge der Anker", () => {
    const { container } = render(
      <HeroSlider
        slides={[
          slide({
            layout: { "top-right": [label("a")], "middle-left": [label("b")], "bottom-center": [label("c")] },
            zoneSpan: { "middle-left": { rows: 2 } },
          }),
        ]}
      />,
    );
    const zones = [...container.querySelectorAll("[data-zone]")].map((zone) => zone.getAttribute("data-zone"));
    expect(zones).toEqual(["top-right", "middle-left", "bottom-center"]);
    expect(container.querySelector(".man-hero__zone--middle-left")).toHaveClass("man-hero__zone--rows-2");
    expect(container.querySelector(".man-hero__zone--middle-left")).not.toHaveClass("man-hero__zone--cols-2");
  });
});
