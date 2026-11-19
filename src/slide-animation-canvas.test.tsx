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
import { act, render, screen } from "@testing-library/react";
import { HeroSlider } from "./hero-slider";
import { DEFAULT_ANIMATION } from "./slide-animation";
import { SlideAnimationCanvas } from "./slide-animation-canvas";
import { Slide, animationMedium } from "./slides-model";

/** jsdom hat keine Leinwand: ein Zähler statt Zeichnen. */
let fills = 0;
let frames: FrameRequestCallback[] = [];

beforeEach(() => {
  fills = 0;
  frames = [];
  jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
    () =>
      ({
        fillStyle: "",
        fillRect: () => {
          fills += 1;
        },
        clearRect: () => undefined,
        beginPath: () => undefined,
        moveTo: () => undefined,
        lineTo: () => undefined,
        arc: () => undefined,
        fill: () => undefined,
        stroke: () => undefined,
      }) as unknown as CanvasRenderingContext2D,
  );
  jest.spyOn(globalThis, "requestAnimationFrame").mockImplementation((callback) => {
    frames.push(callback);
    return frames.length;
  });
  jest.spyOn(globalThis, "cancelAnimationFrame").mockImplementation(() => undefined);
});

afterEach(() => jest.restoreAllMocks());

/** Lässt die angeforderten Bilder laufen, wie es der Browser täte. */
const tick = (now: number): void => {
  const pending = frames;
  frames = [];
  act(() => pending.forEach((callback) => callback(now)));
};

describe("SlideAnimationCanvas", () => {
  it("zeichnet laufend, solange gespielt wird", () => {
    render(<SlideAnimationCanvas animation={DEFAULT_ANIMATION} play />);
    expect(frames).toHaveLength(1);
    const before = fills;
    tick(16);
    tick(32);
    expect(fills).toBeGreaterThan(before);
    expect(frames).toHaveLength(1);
  });

  it("steht ohne `play` still und zeigt trotzdem ein Bild", () => {
    render(<SlideAnimationCanvas animation={DEFAULT_ANIMATION} play={false} />);
    expect(frames).toHaveLength(0);
    expect(fills).toBeGreaterThan(0);
  });

  it("hält an, sobald die Folie nicht mehr spielt", () => {
    const { rerender } = render(<SlideAnimationCanvas animation={DEFAULT_ANIMATION} play />);
    rerender(<SlideAnimationCanvas animation={DEFAULT_ANIMATION} play={false} />);
    expect(cancelAnimationFrame).toHaveBeenCalled();
  });

  it("ist reiner Schmuck", () => {
    render(<SlideAnimationCanvas animation={DEFAULT_ANIMATION} play={false} />);
    expect(screen.getByTestId("hero-animation")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("Animation auf der Bühne", () => {
  const slide = (extra: Partial<Slide> = {}): Slide => ({
    id: "a",
    image: animationMedium({ ...DEFAULT_ANIMATION, theme: "light" }),
    headline: "Überschrift",
    ...extra,
  });

  it("zeigt die Leinwand statt eines Bildes und schaltet die Schrift auf hellen Grund", () => {
    const { container } = render(<HeroSlider slides={[slide()]} />);
    expect(screen.getByTestId("hero-animation")).toHaveAttribute("data-theme", "light");
    expect(container.querySelector("img")).toBeNull();
    const stage = screen.getByTestId("hero-slide-a");
    expect(stage).toHaveClass("man-hero__slide--animation");
    expect(stage).toHaveClass("man-hero__slide--light");
  });

  it("lässt bei dunklem Grund die Schrift weiß", () => {
    render(<HeroSlider slides={[slide({ image: animationMedium(DEFAULT_ANIMATION) })]} />);
    const stage = screen.getByTestId("hero-slide-a");
    expect(stage).toHaveClass("man-hero__slide--animation");
    expect(stage).not.toHaveClass("man-hero__slide--light");
  });

  it("legt bei durchscheinendem Grund keine eigene Fläche unter die Folie", () => {
    render(<HeroSlider slides={[slide({ image: animationMedium({ ...DEFAULT_ANIMATION, opacity: 0.5 }) })]} />);
    expect(screen.getByTestId("hero-slide-a")).toHaveClass("man-hero__slide--see-through");
    // Nur der Grund wird durchscheinend; die Leinwand selbst bleibt deckend.
    expect(screen.getByTestId("hero-animation")).not.toHaveStyle({ opacity: "0.5" });
  });

  it.each([
    ["dunkel, deckend", "dark", 1, false],
    ["dunkel, 25 % auf weißer Seite", "dark", 0.25, true],
    ["hell, deckend", "light", 1, true],
    ["hell, durchsichtig auf weißer Seite", "light", 0, true],
  ] as const)("wählt die Schrift nach dem sichtbaren Grund: %s", (_, theme, opacity, dark) => {
    render(<HeroSlider slides={[slide({ image: animationMedium({ ...DEFAULT_ANIMATION, theme, opacity }) })]} />);
    expect(screen.getByTestId("hero-slide-a").classList.contains("man-hero__slide--ink-dark")).toBe(dark);
  });

  it("misst den Hintergrund hinter der Bühne — dunkler Abschnitt, weiße Schrift", () => {
    const section = document.createElement("div");
    section.style.backgroundColor = "rgb(30, 40, 50)";
    document.body.appendChild(section);
    render(<HeroSlider slides={[slide({ image: animationMedium({ ...DEFAULT_ANIMATION, opacity: 0 }) })]} />, { container: section });
    expect(screen.getByTestId("hero-slide-a")).not.toHaveClass("man-hero__slide--ink-dark");
    section.remove();
  });

  it("ignoriert ein übrig gebliebenes Hochformat", () => {
    render(<HeroSlider slides={[slide({ imagePortrait: { url: "https://example.test/p.jpg", alt: "" } })]} />);
    expect(screen.getByTestId("hero-animation")).toBeInTheDocument();
    expect(document.querySelector("source")).toBeNull();
  });
});
