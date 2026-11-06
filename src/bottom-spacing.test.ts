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

import { holdBottomSpacing, useBottomSpacing } from "./bottom-spacing";

function setRect(element: HTMLElement, top: number, bottom: number): void {
  element.getBoundingClientRect = () =>
    ({ top, bottom, left: 0, right: 0, width: 0, height: bottom - top, x: 0, y: top }) as DOMRect;
}

/**
 * Ein Content-Designer-Block: der Container der Zeile mit dem Blockabstand
 * (`mb-6`), der Block-Kasten (`last:mb-0`), dahinter der Schattenwirt mit
 * Attrappen (`display: contents`) und der äussere Kasten des Widgets.
 */
function addBlock(bottom = 800) {
  const wrapper = document.createElement("div");
  wrapper.id = "wrapper";
  const section = document.createElement("div");
  section.style.paddingBottom = "24px";
  const container = document.createElement("div");
  container.style.marginBottom = "32px";
  const block = document.createElement("div");
  const shadowHost = document.createElement("div");
  const root = shadowHost.attachShadow({ mode: "open" });
  const copy = document.createElement("div");
  copy.style.display = "contents";
  const outer = document.createElement("div");

  document.body.appendChild(wrapper);
  wrapper.appendChild(section);
  section.appendChild(container);
  container.appendChild(block);
  block.appendChild(shadowHost);
  root.appendChild(copy);
  copy.appendChild(outer);

  setRect(section, 100, bottom + 32 + 300);
  for (const el of [container, block, shadowHost, outer]) setRect(el, 200, bottom);
  return { wrapper, section, container, block, outer };
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("holdBottomSpacing", () => {
  it("nimmt den Blockabstand unter der Bühne weg", () => {
    const { container, outer } = addBlock();

    const release = holdBottomSpacing(outer);

    expect(container.style.getPropertyValue("margin-bottom")).toBe("0px");
    expect(container.style.getPropertyPriority("margin-bottom")).toBe("important");
    release();
  });

  it("rührt keinen Kasten an, der tiefer endet als die Bühne", () => {
    // Der Abschnitt endet unterhalb weiterer Blöcke. Sein Abstand gehört zur
    // Seite, nicht zur Bühne.
    const { section, outer } = addBlock();
    section.style.marginBottom = "40px";

    const release = holdBottomSpacing(outer);

    expect(section.style.getPropertyValue("margin-bottom")).toBe("40px");
    expect(section.style.getPropertyPriority("margin-bottom")).toBe("");
    release();
  });

  it("lässt Kästen ohne Abstand unberührt", () => {
    // Der Block-Kasten hat keinen Abstand; ein geschriebenes `0` darauf wäre
    // ein Eingriff ohne Wirkung — und kollidierte mit Regeln, die andere dort
    // setzen.
    const { block, outer } = addBlock();

    const release = holdBottomSpacing(outer);

    expect(block.getAttribute("style")).toBeNull();
    release();
  });

  it("stellt beim Freigeben den Vorzustand wieder her", () => {
    const { container, outer } = addBlock();
    container.style.setProperty("margin-bottom", "32px");

    const release = holdBottomSpacing(outer);
    release();

    expect(container.style.getPropertyValue("margin-bottom")).toBe("32px");
    expect(container.style.getPropertyPriority("margin-bottom")).toBe("");
  });

  it("steigt nicht über den Seitenrahmen hinaus", () => {
    const { wrapper, outer } = addBlock();
    wrapper.style.marginBottom = "16px";
    setRect(wrapper, 0, 800);

    const release = holdBottomSpacing(outer);

    expect(wrapper.style.getPropertyValue("margin-bottom")).toBe("16px");
    release();
  });
});

describe("useBottomSpacing", () => {
  it("greift nur bei „kein Abstand“", () => {
    const { container, outer } = addBlock();

    const { rerender, unmount } = renderHook(
      ({ spacing }: { spacing: "default" | "none" }) => useBottomSpacing(outer, spacing),
      { initialProps: { spacing: "default" as "default" | "none" } },
    );
    expect(container.style.getPropertyValue("margin-bottom")).toBe("32px");

    rerender({ spacing: "none" });
    expect(container.style.getPropertyValue("margin-bottom")).toBe("0px");

    unmount();
    expect(container.style.getPropertyValue("margin-bottom")).toBe("32px");
  });

  it("wartet auf den Kasten", () => {
    const { unmount } = renderHook(() => useBottomSpacing(null, "none"));
    unmount();
  });
});

describe("useBottomSpacing — nach Grössenänderungen", () => {
  let callback: (() => void) | null = null;
  let disconnected = false;

  beforeEach(() => {
    callback = null;
    disconnected = false;
    (window as unknown as { ResizeObserver: unknown }).ResizeObserver = class {
      constructor(cb: () => void) {
        callback = cb;
      }
      observe(): void {}
      disconnect(): void {
        disconnected = true;
      }
    };
  });

  afterEach(() => {
    delete (window as unknown as { ResizeObserver?: unknown }).ResizeObserver;
  });

  it("sucht neu, wenn die Bühne über die Nachbarspalte hinauswächst", () => {
    const { section, container, outer } = addBlock();
    section.style.marginBottom = "40px";

    const { unmount } = renderHook(() => useBottomSpacing(outer, "none"));
    expect(container.style.getPropertyValue("margin-bottom")).toBe("0px");
    expect(section.style.getPropertyValue("margin-bottom")).toBe("40px");

    // Ein spät geladenes Bild: jetzt endet auch der Abschnitt mit der Bühne.
    setRect(section, 100, 800);
    callback?.();

    expect(container.style.getPropertyValue("margin-bottom")).toBe("0px");
    expect(section.style.getPropertyValue("margin-bottom")).toBe("0px");

    unmount();
    expect(disconnected).toBe(true);
    expect(container.style.getPropertyValue("margin-bottom")).toBe("32px");
    expect(section.style.getPropertyValue("margin-bottom")).toBe("40px");
  });
});
