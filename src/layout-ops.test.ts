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

import { duplicateBlock, findBlock, insertBlock, layoutFromFixed, moveBlock, nudgeBlock, removeBlock, updateBlock } from "./layout-ops";
import { SlideBlock, SlideLayout } from "./slide-layout";

const label = (id: string): SlideBlock => ({ id, type: "label", text: id, color: "auto" });
const ids = (layout: SlideLayout, zone: keyof SlideLayout): string[] => (layout[zone] ?? []).map((block) => block.id);

const BASE: SlideLayout = { "top-left": [label("a"), label("b"), label("c")], "bottom-right": [label("d")] };

describe("layout-ops", () => {
  it("fügt an einer Stelle oder am Ende ein und lässt das Original unberührt", () => {
    expect(ids(insertBlock(BASE, "top-left", label("x"), 1), "top-left")).toEqual(["a", "x", "b", "c"]);
    expect(ids(insertBlock(BASE, "middle-center", label("x")), "middle-center")).toEqual(["x"]);
    expect(ids(BASE, "top-left")).toEqual(["a", "b", "c"]);
  });

  it("verschiebt in derselben Zone an die Stelle, die man sieht", () => {
    // „vor c“ heißt im Ziel vor dem Herausnehmen: Stelle 2.
    expect(ids(moveBlock(BASE, "a", "top-left", 2), "top-left")).toEqual(["b", "a", "c"]);
    expect(ids(moveBlock(BASE, "c", "top-left", 0), "top-left")).toEqual(["c", "a", "b"]);
  });

  it("verschiebt in eine andere Zone und lässt keine leere zurück", () => {
    const moved = moveBlock(BASE, "d", "top-left", 0);
    expect(ids(moved, "top-left")).toEqual(["d", "a", "b", "c"]);
    expect(Object.keys(moved)).toEqual(["top-left"]);
  });

  it("rückt eine Stelle hoch oder runter, nicht über den Rand", () => {
    expect(ids(nudgeBlock(BASE, "b", -1), "top-left")).toEqual(["b", "a", "c"]);
    expect(ids(nudgeBlock(BASE, "c", 1), "top-left")).toEqual(["a", "b", "c"]);
  });

  it("ändert, löscht und dupliziert mit neuer Kennung direkt darunter", () => {
    expect(findBlock(updateBlock(BASE, "b", { text: "neu" } as Partial<SlideBlock>), "b")?.block).toMatchObject({ text: "neu" });
    expect(ids(removeBlock(BASE, "b"), "top-left")).toEqual(["a", "c"]);
    const { layout, copy } = duplicateBlock(BASE, "a");
    expect(copy?.id).not.toBe("a");
    expect(ids(layout, "top-left")).toEqual(["a", copy!.id, "b", "c"]);
  });

  it("baut aus einer festen Folie Bausteine unten links", () => {
    const layout = layoutFromFixed({ headline: "Titel", subline: "Zeile", ctas: [{ label: "Los", href: "https://example.test" }] });
    expect(layout["bottom-left"]?.map((block) => block.type)).toEqual(["heading", "text", "buttons"]);
    expect(layout["bottom-left"]?.[0]).toMatchObject({ text: "Titel", size: "display" });
    expect(layoutFromFixed({ headline: "  " })).toEqual({});
  });
});
