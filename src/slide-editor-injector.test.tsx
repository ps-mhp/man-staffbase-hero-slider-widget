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

import { modalRoot, queryDeep, settleModal } from "@shared/ui/config-modal.testing";
import { encodeHeroItemsAttribute, parseHeroItems } from "./hero-items";
import { slideEditorShell, startSlideEditorInjector } from "./slide-editor-injector";
import { Slide } from "./slides-model";

const schema: JSONSchema7 = { properties: { slides: { type: "string", title: "Folien" } } };

const slide = (id: string): Slide => ({
  id,
  image: { url: `https://cdn.example.test/${id}.png`, alt: "" },
  headline: `Überschrift ${id}`,
});

const fieldValue = (container: HTMLElement): string =>
  container.querySelector<HTMLInputElement>("#root_slides")!.value;

/** Das Modal lädt nach, der Editor darin noch einmal: so oft warten, bis er da ist. */
async function settleEditor(): Promise<void> {
  for (let round = 0; round < 5 && modalRoot()?.querySelector('[data-testid="slide-editor"]') == null; round += 1) {
    await settleModal();
  }
}

async function open(slides: Slide[]): Promise<{ container: HTMLElement; stop: () => void }> {
  const { container } = render(
    <Form schema={schema} validator={validator} formData={{ slides: encodeHeroItemsAttribute(slides) }} />,
  );
  let stop = (): void => {};
  await act(async () => {
    stop = startSlideEditorInjector(container);
  });
  await settleEditor();
  return { container, stop };
}

/** Ein Klick wie von Hilfsmitteln: react-aria nimmt ihn als Druck an. */
async function click(element: Element | null): Promise<void> {
  if (element === null) throw new Error("Nichts zum Klicken gefunden");
  await act(async () => {
    (element as HTMLElement).click();
  });
}

const inModal = (selector: string): HTMLElement | null =>
  modalRoot()?.querySelector<HTMLElement>(selector) ?? null;

const buttonNamed = (name: string): HTMLElement | null =>
  Array.from(modalRoot()?.querySelectorAll<HTMLElement>("button") ?? []).find(
    (button) => button.textContent?.trim() === name || button.getAttribute("aria-label") === name,
  ) ?? null;

describe("startSlideEditorInjector", () => {
  it("öffnet den Folien-Editor im gemeinsamen Rahmen mit Vorschau-Umschalter", async () => {
    const { stop } = await open([slide("a")]);

    expect(modalRoot()!.textContent).toContain("Hero-Slider");
    expect(modalRoot()!.querySelector("h1")).toHaveTextContent("Folien bearbeiten");
    expect(inModal('[data-testid="slide-editor"]')).not.toBeNull();
    expect(inModal('[role="grid"][aria-label="Einträge"]')).not.toBeNull();
    expect(inModal('[aria-label="Ansicht"]')).not.toBeNull();

    await act(async () => stop());
  });

  it("übernimmt keine Folie ohne Bild und nennt sie im Status", async () => {
    const { container, stop } = await open([slide("a")]);
    const before = fieldValue(container);

    await click(buttonNamed("Neu"));
    await click(queryDeep(document, '[role="menuitem"]'));
    await click(inModal('[data-testid="config-shell-apply"]'));

    expect(fieldValue(container)).toBe(before);
    expect(inModal('[role="status"]')).toHaveTextContent("Folie 2: Bild fehlt");
    expect(inModal('[data-testid="slide-editor"]')).not.toBeNull();

    await act(async () => stop());
  });

  it("schreibt beim Übernehmen die neue Reihenfolge ins Feld", async () => {
    const { container, stop } = await open([slide("a"), slide("b")]);

    await click(buttonNamed("Eintrag nach unten"));
    await click(inModal('[data-testid="config-shell-apply"]'));

    expect(parseHeroItems(fieldValue(container)).map((item) => item.id)).toEqual(["b", "a"]);

    await act(async () => stop());
  });
});

describe("slideEditorShell", () => {
  it("prüft mit den Regeln der Einträge", () => {
    expect(slideEditorShell.validate?.([slide("a"), { ...slide("b"), image: { url: "", alt: "" } }])).toEqual([
      { id: "b", message: "Folie 2: Bild fehlt" },
    ]);
  });

  it("zählt im Status, was sich gegenüber dem übernommenen Stand geändert hat", () => {
    expect(slideEditorShell.statusText?.([slide("a"), slide("b")], [slide("a")])).toBe(
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
