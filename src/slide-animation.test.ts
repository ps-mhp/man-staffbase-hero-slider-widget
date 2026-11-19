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

import { decodePayload } from "@shared/payload";
import { missingPart } from "./editor-entries";
import { parseHeroItems, serializeHeroItems, SlideItem } from "./hero-items";
import { DEFAULT_ANIMATION, encodeAnimation, parseAnimation } from "./slide-animation";
import { animationMedium, hasMedium, isAnimation, withMediaKind } from "./slides-model";

const animated = (extra: Partial<SlideItem> = {}): SlideItem => ({
  id: "a",
  image: animationMedium({ pattern: "grid", theme: "light", speed: "lively", accent: false, opacity: 0.5 }),
  headline: "Mit Animation",
  ...extra,
});

const stored = (items: SlideItem[]): unknown[] => {
  const raw = serializeHeroItems(items);
  return JSON.parse(decodePayload(raw) ?? raw) as unknown[];
};

describe("parseAnimation", () => {
  it("nimmt bekannte Werte und fällt sonst auf die Vorgabe zurück", () => {
    expect(parseAnimation({ pattern: "pulse", theme: "light", speed: "lively", accent: false, opacity: 0.25 })).toEqual({
      pattern: "pulse",
      theme: "light",
      speed: "lively",
      accent: false,
      opacity: 0.25,
    });
    expect(parseAnimation({ pattern: "laser", theme: 3 })).toEqual(DEFAULT_ANIMATION);
    expect(parseAnimation(undefined)).toEqual(DEFAULT_ANIMATION);
  });

  it("begrenzt die Deckkraft des Grundes auf 0…1 in 5-%-Schritten", () => {
    expect(parseAnimation({ opacity: 1.7 }).opacity).toBe(1);
    expect(parseAnimation({ opacity: -1 }).opacity).toBe(0);
    expect(parseAnimation({ opacity: 0 }).opacity).toBe(0);
    expect(parseAnimation({ opacity: 0.333 }).opacity).toBe(0.35);
    expect(parseAnimation({ opacity: "halb" }).opacity).toBe(1);
  });
});

describe("encodeAnimation", () => {
  it("schreibt nur, was von der Vorgabe abweicht", () => {
    expect(encodeAnimation(DEFAULT_ANIMATION)).toEqual({});
    expect(encodeAnimation({ ...DEFAULT_ANIMATION, theme: "light" })).toEqual({ theme: "light" });
  });
});

describe("Animation als Medium", () => {
  it("zählt als Medium, obwohl es keine Adresse gibt", () => {
    const image = animationMedium();
    expect(isAnimation(image)).toBe(true);
    expect(hasMedium(image)).toBe(true);
    expect(hasMedium({ url: " ", alt: "" })).toBe(false);
    expect(missingPart(animated())).toBeUndefined();
  });

  it("wird beim Wechsel zu Bild oder Video wieder eine Datei", () => {
    expect(withMediaKind(animationMedium(), "image")).toEqual({ url: "", alt: "" });
  });

  it("übersteht Speichern und Laden, ohne Adresse und ohne die Folie zu verlieren", () => {
    const items = [animated()];
    const entries = stored(items);
    expect(entries[0]).toMatchObject({
      image: { url: "", alt: "", kind: "animation", animation: { pattern: "grid", theme: "light", speed: "lively", accent: false, opacity: 0.5 } },
    });
    expect(parseHeroItems(serializeHeroItems(items))).toEqual(items);
  });

  it("speichert die Standard-Animation knapp", () => {
    const entries = stored([animated({ image: animationMedium() })]);
    expect(entries[0]).toMatchObject({ image: { kind: "animation", animation: {} } });
  });

  it("lässt Bilder und Videos Zeichen für Zeichen, wie sie waren", () => {
    const items: SlideItem[] = [
      { id: "b", image: { url: "https://cdn.example.test/b.jpg", alt: "B" }, headline: "Bild" },
      { id: "v", image: { url: "https://cdn.example.test/v.mp4", alt: "", kind: "video" }, headline: "Video" },
    ];
    const entries = stored(items) as Record<string, Record<string, unknown>>[];
    expect(entries[0]!.image).toEqual({ url: "https://cdn.example.test/b.jpg", alt: "B" });
    expect(entries[1]!.image).toEqual({ url: "https://cdn.example.test/v.mp4", alt: "", kind: "video" });
  });
});
