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
 * Die Naht zwischen Dialog und Bühne.
 *
 * Geprüft wird, was der Baustein anmeldet und was er aus den Attributen an
 * die Bühne weiterreicht. Ein Attribut, das gelesen, aber nicht beobachtet
 * wird, greift erst nach dem Neuladen der Seite — die Vorschau des Dialogs
 * bliebe stumm stehen, ohne Fehlermeldung. Deshalb steht hier die Menge der
 * Attribute als Ganzes auf dem Prüfstand.
 */

import type { BlockDefinition, ExternalBlockDefinition } from "widget-sdk";

import {
  AUTOPLAY_DELAY_ATTRIBUTE,
  CONTROLS_ATTRIBUTE,
  FULL_BLEED_ATTRIBUTE,
  HEIGHT_ATTRIBUTE,
  POSITION_ATTRIBUTE,
  SLIDES_ATTRIBUTE,
} from "./configuration-schema";
import { DEFAULT_AUTOPLAY_DELAY_MS } from "./use-slider";

const mockStartWidget = jest.fn().mockResolvedValue(undefined);
const mockStartInjector = jest.fn(() => () => undefined);
const mockRegisterTranslation = jest.fn(() => () => undefined);
const mockHeroSlider = jest.fn((_props: Record<string, unknown>) => null);
const mockHeroSliderLoader = jest.fn((_props: Record<string, unknown>) => null);

jest.mock("@shared/dev-mode/start-widget", () => ({ startWidget: mockStartWidget }));
jest.mock("@shared/translation/registry", () => ({
  getTranslationRegistry: () => ({ register: mockRegisterTranslation }),
}));
jest.mock("./slide-editor-injector", () => ({ startSlideEditorInjector: mockStartInjector }));
jest.mock("./hero-slider", () => ({
  ...jest.requireActual("./hero-slider"),
  HeroSlider: (props: Record<string, unknown>) => mockHeroSlider(props),
}));
jest.mock("./hero-slider-loader", () => ({
  HeroSliderLoader: (props: Record<string, unknown>) => mockHeroSliderLoader(props),
}));

interface Host {
  defineBlock: jest.Mock;
}

/** Lädt das Modul frisch und löst die Anmeldung aus, wie es `startWidget` täte. */
async function loadAndRegister(): Promise<BlockDefinition> {
  const host = window as unknown as Host;
  host.defineBlock = jest.fn();
  mockStartWidget.mockClear();
  mockHeroSlider.mockClear();
  mockHeroSliderLoader.mockClear();

  jest.resetModules();
  await import("./index");

  const options = mockStartWidget.mock.calls[0][0] as { name: string; register: () => void };
  expect(options.name).toBe("hero-slider-widget");
  options.register();

  const external = host.defineBlock.mock.calls[0][0] as ExternalBlockDefinition;
  return external.blockDefinition;
}

/** Zählt die Namen der Probe-Elemente hoch: ein Name lässt sich nur einmal belegen. */
let probeCount = 0;

/**
 * Baut den Baustein auf und gibt die Angaben zurück, mit denen die Bühne
 * gerufen wurde.
 */
async function renderWith(
  definition: BlockDefinition,
  attrs: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  // Ein Stellvertreter der Basisklasse des SDK: liefert die Attribute so,
  // wie `parseAttributes` sie liefert — Wahrheitswerte schon umgewandelt.
  class FakeBase extends HTMLElement {
    public parseAttributes(): Record<string, unknown> {
      return attrs;
    }
    public attributeChangedCallback(): void {}
  }
  const Block = definition.factory(
    FakeBase as unknown as Parameters<BlockDefinition["factory"]>[0],
    {} as Parameters<BlockDefinition["factory"]>[1],
  );
  customElements.define(`hero-slider-probe-${(probeCount += 1)}`, Block);
  const element = new Block() as HTMLElement & { renderBlock(container: HTMLElement): void };

  // `act` aus der React-Instanz, die das frisch geladene Modul benutzt: nach
  // `jest.resetModules()` ist das nicht mehr die von Testing Library.
  const { act } = await import("react");
  const container = document.createElement("div");
  await act(async () => element.renderBlock(container));

  const call = mockHeroSlider.mock.calls.at(-1);
  if (call === undefined) throw new Error("Die Bühne wurde nicht gebaut");
  return call[0];
}

const slides = JSON.stringify([
  { id: "a", image: { url: "https://example.test/a.jpg", alt: "Bild a" }, headline: "Überschrift a" },
]);

describe("Anmeldung des Widgets", () => {
  it("meldet den Baustein unter seinem Namen und auf Blockebene an", async () => {
    const definition = await loadAndRegister();

    expect(definition).toMatchObject({
      name: "hero-slider-widget",
      label: "Hero-Slider",
      blockLevel: "block",
    });
  });

  it("führt genau die Attribute, die der Baustein auch liest", async () => {
    const definition = await loadAndRegister();

    // Als Menge geprüft: ein zusätzliches Attribut wird nie gelesen, ein
    // fehlendes nie gespeichert.
    expect(new Set(definition.attributes)).toEqual(
      new Set([
        SLIDES_ATTRIBUTE,
        HEIGHT_ATTRIBUTE,
        FULL_BLEED_ATTRIBUTE,
        AUTOPLAY_DELAY_ATTRIBUTE,
        POSITION_ATTRIBUTE,
        CONTROLS_ATTRIBUTE,
      ]),
    );
    expect(definition.attributes).toHaveLength(6);
  });

  it("beobachtet genau die angemeldeten Attribute", async () => {
    const definition = await loadAndRegister();
    const Block = definition.factory(
      class extends HTMLElement {} as unknown as Parameters<BlockDefinition["factory"]>[0],
      {} as Parameters<BlockDefinition["factory"]>[1],
    );

    // Ein gelesenes, aber unbeobachtetes Attribut greift erst nach dem
    // Neuladen — die Vorschau des Dialogs bliebe stehen.
    expect(new Set((Block as unknown as { observedAttributes: string[] }).observedAttributes)).toEqual(
      new Set(definition.attributes),
    );
  });
});

describe("Attribute an der Bühne", () => {
  it("nimmt ohne jedes Attribut die dokumentierten Vorgaben", async () => {
    const definition = await loadAndRegister();

    const props = await renderWith(definition, { [SLIDES_ATTRIBUTE]: slides });

    expect(props).toMatchObject({
      height: "section",
      fullBleed: true,
      autoplayDelayMs: DEFAULT_AUTOPLAY_DELAY_MS,
      position: "post",
      controls: true,
    });
  });

  it("reicht Lage, Bedienelemente und die übrigen Werte durch", async () => {
    const definition = await loadAndRegister();

    const props = await renderWith(definition, {
      [SLIDES_ATTRIBUTE]: slides,
      [HEIGHT_ATTRIBUTE]: "large",
      [FULL_BLEED_ATTRIBUTE]: false,
      [AUTOPLAY_DELAY_ATTRIBUTE]: 0,
      [POSITION_ATTRIBUTE]: "pre",
      [CONTROLS_ATTRIBUTE]: false,
    });

    expect(props).toMatchObject({
      height: "large",
      fullBleed: false,
      autoplayDelayMs: 0,
      position: "pre",
      controls: false,
    });
  });

  it("hält Lage und Bedienelemente auseinander", async () => {
    // Beide lesen heute aus verschiedenen Attributen. Würde eines davon am
    // falschen Attribut hängen, bliebe der Test oben grün.
    const definition = await loadAndRegister();

    const props = await renderWith(definition, {
      [SLIDES_ATTRIBUTE]: slides,
      [POSITION_ATTRIBUTE]: "pre",
      [CONTROLS_ATTRIBUTE]: true,
    });

    expect(props).toMatchObject({ position: "pre", controls: true });
  });
});
