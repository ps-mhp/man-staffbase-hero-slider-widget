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
 * Der Folien-Editor im gemeinsamen Rahmen von `@man/config-ui`: Kopf,
 * Status, Übernehmen und Rückfrage kommen vom Rahmen, die Prüfung und die
 * Hilfe vom Widget.
 */

import * as React from "react";
import { act, render } from "@testing-library/react";
import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import { JSONSchema7 } from "json-schema";

import { clickElement, modalRoot, queryDeep, queryInModal, settleEditor } from "@shared/ui/config-modal.testing";
import { encodeHeroItemsAttribute, parseHeroItems } from "./hero-items";
import { HeroEditorValue } from "./editor-value";
import { parseHeroContent } from "./hero-settings";
import { slideEditorShell, startSlideEditorInjector } from "./slide-editor-injector";
import { Slide } from "./slides-model";

const schema: JSONSchema7 = {
  properties: {
    slides: { type: "string", title: "Folien" },
    height: { type: "string", title: "Höhe", enum: ["small", "medium", "large", "viewport", "section"] },
    controls: { type: "boolean", title: "Bedienelemente zeigen" },
  },
};

const slide = (id: string): Slide => ({
  id,
  image: { url: `https://cdn.example.test/${id}.png`, alt: "" },
  headline: `Überschrift ${id}`,
});

const fieldValue = (container: HTMLElement): string =>
  container.querySelector<HTMLInputElement>("#root_slides")!.value;

async function open(
  slides: Slide[] | string,
  legacy: Record<string, unknown> = {},
): Promise<{ container: HTMLElement; stop: () => void }> {
  const raw = typeof slides === "string" ? slides : encodeHeroItemsAttribute(slides);
  const { container } = render(<Form schema={schema} validator={validator} formData={{ slides: raw, ...legacy }} />);
  let stop = (): void => {};
  await act(async () => {
    stop = startSlideEditorInjector(container);
  });
  await settleEditor('[data-testid="slide-editor"]', 5);
  return { container, stop };
}

const buttonNamed = (name: string): HTMLElement | null =>
  Array.from(modalRoot()?.querySelectorAll<HTMLElement>("button") ?? []).find(
    (button) => button.textContent?.trim() === name || button.getAttribute("aria-label") === name,
  ) ?? null;

describe("startSlideEditorInjector", () => {
  it("öffnet den Folien-Editor im gemeinsamen Rahmen mit Vorschau-Umschalter", async () => {
    const { stop } = await open([slide("a")]);

    expect(modalRoot()!.textContent).toContain("Hero-Slider");
    expect(modalRoot()!.querySelector("h1")).toHaveTextContent("Folien bearbeiten");
    expect(queryInModal('[data-testid="slide-editor"]')).not.toBeNull();
    expect(queryInModal('[role="grid"][aria-label="Einträge"]')).not.toBeNull();
    expect(queryInModal('[aria-label="Ansicht"]')).not.toBeNull();

    await act(async () => stop());
  });

  it("übernimmt keine Folie ohne Bild und nennt sie im Status", async () => {
    const { container, stop } = await open([slide("a")]);
    const before = fieldValue(container);

    await clickElement(buttonNamed("Neu"));
    await clickElement(queryDeep(document, '[role="menuitem"]'));
    await clickElement(queryInModal('[data-testid="config-shell-apply"]'));

    expect(fieldValue(container)).toBe(before);
    expect(queryInModal('[role="status"]')).toHaveTextContent("Folie 2: Bild fehlt");
    expect(queryInModal('[data-testid="slide-editor"]')).not.toBeNull();

    await act(async () => stop());
  });

  it("schreibt beim Übernehmen die neue Reihenfolge ins Feld", async () => {
    const { container, stop } = await open([slide("a"), slide("b")]);

    await clickElement(buttonNamed("Eintrag nach unten"));
    await clickElement(queryInModal('[data-testid="config-shell-apply"]'));

    expect(parseHeroItems(fieldValue(container)).map((item) => item.id)).toEqual(["b", "a"]);

    await act(async () => stop());
  });

  it("schreibt nichts, wer öffnet und gleich übernimmt – auch nicht an alten Bühnen", async () => {
    // Rohes JSON wie vor dem Base64-Umschlag; jedes Schreiben machte daraus `b64:`.
    const raw = JSON.stringify([{ id: "a", image: { url: "https://cdn.example.test/a.png", alt: "" }, headline: "A" }]);
    const { container, stop } = await open(raw, { height: "large", controls: false });

    await clickElement(queryInModal('[data-testid="config-shell-apply"]'));

    expect(fieldValue(container)).toBe(raw);
    await act(async () => stop());
  });

  it("zeigt rechts die Einstellungen und blendet die alten Felder im Dialog aus", async () => {
    const { container, stop } = await open([slide("a")], { height: "large", controls: false });

    expect(queryInModal('[aria-label="Einstellungen"]')).not.toBeNull();
    // Offen ist zuerst der Reiter der Folie; die Höhe steht unter „Gestaltung“.
    await clickElement(queryInModal('[role="tab"][data-key="design"]'));
    expect(queryInModal('[data-testid="hero-setting-height"]')).toHaveTextContent("Groß");
    /** Ob eine Zeile um das Feld verborgen ist. */
    const hidden = (key: string): boolean => {
      for (let node = container.querySelector<HTMLElement>(`[id="root_${key}"]`); node !== null; node = node.parentElement) {
        if (node.style.display === "none") return true;
      }
      return false;
    };
    expect(hidden("height")).toBe(true);
    expect(hidden("controls")).toBe(true);

    await act(async () => stop());
  });

  it("schreibt eine bediente Einstellung ins Feld slides, die alten Felder bleiben", async () => {
    const { container, stop } = await open([slide("a")], { height: "large", controls: true });

    await clickElement(queryInModal('[role="tab"][data-key="design"]'));
    await clickElement(queryInModal('[role="switch"][data-testid="hero-setting-full-bleed"]'));
    expect(queryInModal('[role="status"]')).toHaveTextContent("Einstellungen geändert");
    await clickElement(queryInModal('[data-testid="config-shell-apply"]'));

    expect(parseHeroContent(fieldValue(container))).toEqual({ items: [slide("a")], settings: { fullBleed: false } });
    expect(container.querySelector<HTMLSelectElement>("#root_height")!.value).not.toBe("");
    await act(async () => stop());
  });
});

describe("slideEditorShell", () => {
  const editorValue = (items: Slide[], settings: HeroEditorValue["settings"] = {}): HeroEditorValue => ({
    items,
    settings,
    legacy: {},
  });

  it("prüft mit den Regeln der Einträge und der Einstellungen", () => {
    expect(
      slideEditorShell.validate?.(editorValue([slide("a"), { ...slide("b"), image: { url: "", alt: "" } }], { autoplayDelay: 99 })),
    ).toEqual([
      { id: "b", message: "Folie 2: Bild fehlt" },
      { id: "autoplay-delay", message: "Sekunden pro Folie: erlaubt sind 0 bis 30" },
    ]);
  });

  it("zählt im Status, was sich gegenüber dem übernommenen Stand geändert hat", () => {
    expect(slideEditorShell.statusText?.(editorValue([slide("a"), slide("b")]), editorValue([slide("a")]))).toBe(
      "1 Eintrag geändert",
    );
  });

  it("erklärt in der Hilfe die drei Sorten und die Reihenfolge", () => {
    const { container } = render(<>{slideEditorShell.help}</>);

    expect(container).toHaveTextContent("Folie");
    expect(container).toHaveTextContent("News-Beitrag");
    expect(container).toHaveTextContent("News-Kanal");
    expect(container).toHaveTextContent("Reihenfolge");
    expect(container.querySelectorAll("li").length).toBeLessThanOrEqual(8);
  });
});
