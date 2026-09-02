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

import { setPublicPathFromBundle } from "@shared/public-path";
// Muss vor jedem dynamischen `import()` laufen, damit nachgeladene Teile von
// dem CDN kommen, von dem das Bundle stammt, und nicht von der Wirtsseite.
setPublicPathFromBundle("hero-slider-widget.js");

import React from "react";
import ReactDOM from "react-dom/client";

import { BlockFactory, BlockDefinition, ExternalBlockDefinition, BaseBlock } from "widget-sdk";
import { startWidget } from "@shared/dev-mode/start-widget";
import {
  AUTOPLAY_DELAY_ATTRIBUTE,
  FULL_BLEED_ATTRIBUTE,
  HEIGHT_ATTRIBUTE,
  SLIDES_ATTRIBUTE,
  configurationSchema,
  uiSchema,
} from "./configuration-schema";
import { HERO_HEIGHTS, HeroHeight, HeroSlider } from "./hero-slider";
import { HeroSliderLoader } from "./hero-slider-loader";
import { startSlideEditorInjector } from "./slide-editor-injector";
import { DEFAULT_AUTOPLAY_DELAY_MS } from "./use-slider";
import { isSlideItem, parseHeroItems } from "./hero-items";
import icon from "../resources/hero-slider-widget.svg";
import pkg from "../package.json";

/** Die Attribute des Widgets; gespiegelt im Konfigurationsschema. */
const widgetAttributes: string[] = [
  SLIDES_ATTRIBUTE,
  HEIGHT_ATTRIBUTE,
  FULL_BLEED_ATTRIBUTE,
  AUTOPLAY_DELAY_ATTRIBUTE,
];

let stopInjector: (() => void) | null = null;

/**
 * Beendet die Beobachtung des Konfigurationsdialogs.
 *
 * Nur offengelegt, damit Tests sie beim Aufräumen wieder abbauen können —
 * jsdom baut sein `window` zwischen Testdateien ab, und ein danach noch
 * feuernder Beobachter würde werfen.
 */
export function stopSlideEditorInjector(): void {
  stopInjector?.();
  stopInjector = null;
}

/** Alles außer den bekannten Stufen bedeutet die Vorgabe — auch ein leeres oder veraltetes Attribut. */
function readHeight(raw: unknown): HeroHeight {
  return typeof raw === "string" && (HERO_HEIGHTS as readonly string[]).includes(raw)
    ? (raw as HeroHeight)
    : "medium";
}

/**
 * Der Ausbruch ist an, solange ihn niemand ausdrücklich abschaltet. Staffbase
 * liefert Wahrheitswerte je nach Weg als `boolean` oder als Zeichenkette; nur
 * ein echtes „aus" zählt, damit ein fehlendes Attribut die Vorgabe nicht kippt.
 */
function readFullBleed(raw: unknown): boolean {
  if (raw === false || raw === "false") return false;
  return true;
}

/** Sekunden aus dem Dialog in Millisekunden; alles Unbrauchbare fällt auf die Vorgabe zurück. */
function readAutoplayDelayMs(raw: unknown): number {
  const seconds = typeof raw === "number" ? raw : Number.parseFloat(String(raw ?? ""));
  if (!Number.isFinite(seconds) || seconds < 0) return DEFAULT_AUTOPLAY_DELAY_MS;
  return seconds * 1000;
}

const factory: BlockFactory = (BaseBlockClass, _widgetApi) => {
  /**
   * <hero-slider-widget slides='[{"id":"a","image":{"url":"…","alt":"…"},"headline":"…"}]'></hero-slider-widget>
   */
  return class HeroSliderWidgetBlock extends BaseBlockClass implements BaseBlock {
    private _root: ReactDOM.Root | null = null;

    public renderBlock(container: HTMLElement): void {
      const attrs = this.parseAttributes<Record<string, unknown>>();
      const items = parseHeroItems(
        typeof attrs[SLIDES_ATTRIBUTE] === "string" ? (attrs[SLIDES_ATTRIBUTE] as string) : "",
      );

      const options = {
        height: readHeight(attrs[HEIGHT_ATTRIBUTE]),
        fullBleed: readFullBleed(attrs[FULL_BLEED_ATTRIBUTE]),
        autoplayDelayMs: readAutoplayDelayMs(attrs[AUTOPLAY_DELAY_ATTRIBUTE]),
      };

      this._root ??= ReactDOM.createRoot(container);
      // Eine Buehne aus handgepflegten Folien steht sofort und ohne Netz; nur
      // wenn News im Spiel sind, wird ueber den Loader gegangen.
      this._root.render(
        items.every(isSlideItem) ? (
          <HeroSlider slides={items} {...options} />
        ) : (
          <HeroSliderLoader items={items} {...options} />
        ),
      );
    }

    public unmountBlock(_container: HTMLElement): void {
      this._root?.unmount();
      this._root = null;
    }

    public static get observedAttributes(): string[] {
      return widgetAttributes;
    }

    public attributeChangedCallback(...args: [string, string | undefined, string | undefined]): void {
      super.attributeChangedCallback.apply(this, args);
    }
  };
};

const blockDefinition: BlockDefinition = {
  name: "hero-slider-widget",
  factory: factory,
  attributes: widgetAttributes,
  blockLevel: "block",
  configurationSchema: configurationSchema,
  uiSchema: uiSchema,
  label: "Hero-Slider",
  iconUrl: icon,
};

const externalBlockDefinition: ExternalBlockDefinition = {
  blockDefinition,
  author: pkg.author,
  version: pkg.version,
};

/**
 * Meldet den Baustein bei der Wirtsseite an.
 *
 * Der Weg über `startWidget` fragt zuerst, ob ein lokaler
 * Entwicklungsserver dieses Widget ausliefert. In fast jedem Browser lautet
 * die Antwort nein, und es wird sofort angemeldet; auf dem Rechner der
 * Entwicklung übernimmt das lokale Bundle und meldet an seiner Stelle an.
 * Immer nur eines von beiden — ein Bausteinname lässt sich nicht zweimal
 * belegen.
 */
void startWidget({
  name: "hero-slider-widget",
  version: pkg.version,
  // Der Editor haengt am Anmelden, nicht am Laden. Auf Modulebene gestartet
  // belegte der Beobachter des installierten Bundles das `slides`-Feld,
  // bevor es ueberhaupt fragte, ob ein lokaler Server uebernimmt — der
  // Entwicklungsmodus lieferte dann die Ansicht, aber den Editor der
  // veroeffentlichten Fassung. Live nachgewiesen am 02.09.2026: eine Marke im
  // lokal ausgelieferten Bundle erschien im Dialog nicht.
  register: () => {
    stopInjector = startSlideEditorInjector();
    window.defineBlock(externalBlockDefinition);
  },
});
