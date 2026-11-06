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

import { renderHook } from "@testing-library/react";

import { endsSection, hugSectionBottom, useSectionHug } from "./section-hug";

/**
 * Ein Abschnitt des Content Designers mit der Bühne darin, so wie
 * `custom-block.mjs` ab 10.0.12 ihn rendert: Abschnitt (24px unten), Rahmen
 * (40px), Container (`mb-6`, 32px), Block, Schattenwirt mit Attrappen und
 * dem Widget.
 */
function buildSection() {
  const section = document.createElement("div");
  section.dataset.c13yComponent = "section-block";
  section.style.padding = "48px 0 24px";
  const frame = document.createElement("div");
  frame.style.padding = "40px 20px";
  const container = document.createElement("div");
  container.dataset.c13yComponent = "container-block";
  container.style.marginBottom = "32px";
  const column = document.createElement("div");
  column.dataset.c13yComponent = "column-block";
  const block = document.createElement("div");
  const shadowHost = document.createElement("div");
  shadowHost.setAttribute("data-sb-custom-block-widget-host", "");
  const root = shadowHost.attachShadow({ mode: "open" });
  const copy = document.createElement("div");
  copy.dataset.c13yComponent = "section-block";
  copy.setAttribute("data-sb-c13y-ancestor-copy", "");
  copy.style.display = "contents";
  const widget = document.createElement("div");

  document.body.appendChild(section);
  section.appendChild(frame);
  frame.appendChild(container);
  container.appendChild(column);
  column.appendChild(block);
  block.appendChild(shadowHost);
  root.appendChild(copy);
  copy.appendChild(widget);
  return { section, frame, container, column, block, widget };
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("endsSection", () => {
  it("erkennt die Bühne als letzten Inhalt ihres Abschnitts", () => {
    const { widget } = buildSection();
    expect(endsSection(widget)).toBe(true);
  });

  it("sieht einen Block, der in derselben Spalte folgt", () => {
    const { column, widget } = buildSection();
    column.appendChild(document.createElement("div"));
    expect(endsSection(widget)).toBe(false);
  });

  it("sieht eine Zeile, die im selben Abschnitt folgt", () => {
    const { frame, widget } = buildSection();
    frame.appendChild(document.createElement("div"));
    expect(endsSection(widget)).toBe(false);
  });

  it("lässt sich von Vorangehendem nicht stören", () => {
    // Was über der Bühne steht, ändert nichts daran, wo der Abschnitt endet.
    const { frame, container, widget } = buildSection();
    frame.insertBefore(document.createElement("div"), container);
    expect(endsSection(widget)).toBe(true);
  });

  it("zählt Stile und Verborgenes nicht als Folgeinhalt", () => {
    const { column, widget } = buildSection();
    column.appendChild(document.createElement("style"));
    const hidden = document.createElement("div");
    hidden.style.display = "none";
    column.appendChild(hidden);
    expect(endsSection(widget)).toBe(true);
  });

  it("gilt ohne Abschnitt nicht", () => {
    const widget = document.createElement("div");
    document.body.appendChild(widget);
    expect(endsSection(widget)).toBe(false);
  });
});

describe("hugSectionBottom", () => {
  it("lässt den Abschnitt mit der Bühne enden", () => {
    const { section, frame, container, widget } = buildSection();

    const undo = hugSectionBottom(widget);

    expect(undo).not.toBeNull();
    expect(section.style.paddingBottom).toBe("0px");
    expect(frame.style.paddingBottom).toBe("0px");
    expect(container.style.marginBottom).toBe("0px");
    // Oben und seitlich bleibt alles, wie der Abschnitt es vorsieht.
    expect(section.style.paddingTop).toBe("48px");
    expect(frame.style.paddingLeft).toBe("20px");
  });

  it("rührt nichts an, wenn noch etwas folgt", () => {
    const { section, container, column, widget } = buildSection();
    column.appendChild(document.createElement("div"));

    expect(hugSectionBottom(widget)).toBeNull();
    expect(section.style.paddingBottom).toBe("24px");
    expect(container.style.marginBottom).toBe("32px");
  });

  it("stellt beim Zurücknehmen den Vorzustand her", () => {
    const { section, frame, container, widget } = buildSection();

    hugSectionBottom(widget)?.();

    expect(section.style.paddingBottom).toBe("24px");
    expect(frame.style.paddingBottom).toBe("40px");
    expect(container.style.marginBottom).toBe("32px");
  });
});

describe("useSectionHug", () => {
  it("greift nur, solange es verlangt ist, und meldet den Befund", () => {
    const { section, widget } = buildSection();

    const { result, rerender, unmount } = renderHook(
      ({ active }: { active: boolean }) => useSectionHug(widget, active),
      { initialProps: { active: false } },
    );
    expect(result.current).toBe(false);
    expect(section.style.paddingBottom).toBe("24px");

    rerender({ active: true });
    expect(result.current).toBe(true);
    expect(section.style.paddingBottom).toBe("0px");

    unmount();
    expect(section.style.paddingBottom).toBe("24px");
  });

  it("meldet nichts, solange es keinen Kasten gibt", () => {
    const { result } = renderHook(() => useSectionHug(null, true));
    expect(result.current).toBe(false);
  });
});
