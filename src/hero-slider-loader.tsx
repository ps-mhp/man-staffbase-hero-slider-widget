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
 * Die Bühne, sobald ihre News geladen sind.
 *
 * Steht zwischen `index.tsx` und `hero-slider.tsx`, damit die Leseansicht rein
 * bleibt: sie bekommt fertige Folien und weiß von Kanälen und Beiträgen
 * nichts. Nur wenn wirklich News im Spiel sind, wird dieser Umweg gegangen —
 * eine Bühne aus handgepflegten Folien steht weiterhin sofort und ohne Netz.
 */

import * as React from "react";
import { ReactElement } from "react";

import { HeroItem } from "./hero-items";
import { HeroSlider, HeroSliderProps } from "./hero-slider";
import { HeroSlidesSource, useHeroSlides } from "./use-hero-slides";

export type HeroSliderLoaderProps = Omit<HeroSliderProps, "slides"> & {
  items: HeroItem[];
  /** Vorgabe sind die echten Endpunkte; für Tests und Vorschau austauschbar. */
  source?: HeroSlidesSource;
};

export function HeroSliderLoader({
  items,
  source,
  ...options
}: HeroSliderLoaderProps): ReactElement | null {
  const slides = useHeroSlides(items, source);

  // Solange nichts aufgelöst ist, steht hier nichts — siehe `use-hero-slides`.
  if (slides === null) return null;

  return <HeroSlider slides={slides} {...options} />;
}
