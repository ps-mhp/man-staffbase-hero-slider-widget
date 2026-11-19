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

import { ANIMATION_PATTERNS, ANIMATION_PERIOD, DEFAULT_ANIMATION, SlideAnimation } from "./slide-animation";
import { LOOKS, Paint, buildCells, colorFor, drawAnimation, maskAt } from "./slide-animation-patterns";

interface Rect {
  color: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Schreibt jedes Rechteck mit seiner Farbe mit — statt einer Leinwand. */
function recorder(): Paint & { rects: Rect[]; clears: number } {
  const rects: Rect[] = [];
  const paint = {
    fillStyle: "" as Paint["fillStyle"],
    rects,
    clears: 0,
    fillRect(x: number, y: number, w: number, h: number) {
      rects.push({ color: String(paint.fillStyle), x, y, w, h });
    },
    clearRect() {
      paint.clears += 1;
    },
  };
  return paint;
}

const frame = (animation: SlideAnimation, t: number, width = 1920, height = 600): Rect[] => {
  const paint = recorder();
  drawAnimation(paint, width, height, animation, t);
  return paint.rects;
};

const RED = "#e40045";

describe("drawAnimation", () => {
  it.each(ANIMATION_PATTERNS)("%s: malt zuerst den Grund, dann Quadrate", (pattern) => {
    const rects = frame({ ...DEFAULT_ANIMATION, pattern }, 3);
    expect(rects[0]).toEqual({ color: LOOKS.dark.background, x: 0, y: 0, w: 1920, h: 600 });
    expect(rects.length).toBeGreaterThan(20);
  });

  it.each(ANIMATION_PATTERNS)("%s: schließt nach einer Periode nahtlos an", (pattern) => {
    const animation = { ...DEFAULT_ANIMATION, pattern };
    const period = ANIMATION_PERIOD[animation.speed];
    const start = frame(animation, 1.25);
    const after = frame(animation, 1.25 + period);
    expect(after.length).toBe(start.length);
    after.forEach((rect, at) => {
      expect(rect.color).toBe(start[at]!.color);
      expect(rect.x).toBeCloseTo(start[at]!.x, 6);
      expect(rect.y).toBeCloseTo(start[at]!.y, 6);
    });
  });

  it("bewegt sich: zwei Zeitpunkte sehen verschieden aus", () => {
    const a = frame(DEFAULT_ANIMATION, 0);
    const b = frame(DEFAULT_ANIMATION, 5);
    expect(a.map((rect) => rect.y)).not.toEqual(b.map((rect) => rect.y));
  });

  it("hält quer die linke Textseite frei", () => {
    const rects = frame(DEFAULT_ANIMATION, 2).slice(1);
    expect(rects.every((rect) => rect.x + rect.w > 0.25 * 1920)).toBe(true);
  });

  it("hält hochkant die untere Textseite frei", () => {
    const rects = frame(DEFAULT_ANIMATION, 2, 400, 500).slice(1);
    expect(rects.every((rect) => rect.y < 0.62 * 500)).toBe(true);
  });

  it("zeigt Rot nur voll deckend und nur mit Akzenten", () => {
    const withAccent = frame(DEFAULT_ANIMATION, 2);
    expect(withAccent.filter((rect) => rect.color === RED).length).toBeGreaterThan(0);
    expect(withAccent.some((rect) => /rgb\(2\d\d,0,/.test(rect.color))).toBe(false);
    expect(frame({ ...DEFAULT_ANIMATION, accent: false }, 2).some((rect) => rect.color === RED)).toBe(false);
  });

  it("malt hell auf weißem Grund", () => {
    expect(frame({ ...DEFAULT_ANIMATION, theme: "light" }, 2)[0]!.color).toBe("#ffffff");
  });

  it("malt bei leerer Fläche nur den Grund", () => {
    expect(frame(DEFAULT_ANIMATION, 0, 0, 0)).toHaveLength(1);
  });

  it("leert die Leinwand vor jedem Bild und malt den Grund durchscheinend", () => {
    const paint = recorder();
    drawAnimation(paint, 1920, 600, { ...DEFAULT_ANIMATION, opacity: 0.5 }, 2);
    expect(paint.clears).toBe(1);
    expect(paint.rects[0]!.color).toBe("rgba(18,27,35,0.5)");
  });

  it("malt ohne Grund, wenn er durchsichtig ist — die Quadrate bleiben", () => {
    const rects = frame({ ...DEFAULT_ANIMATION, opacity: 0 }, 2);
    expect(rects.some((rect) => rect.w === 1920 && rect.h === 600)).toBe(false);
    expect(rects.length).toBeGreaterThan(100);
  });

  it("ist bei allen Mustern deutlich feiner als ein Bühnenpixel-Raster von 12 px", () => {
    for (const pattern of ANIMATION_PATTERNS) {
      const sizes = frame({ ...DEFAULT_ANIMATION, pattern }, 2).slice(1).map((rect) => rect.w);
      expect(Math.max(...sizes)).toBeLessThanOrEqual(18);
    }
  });
});

describe("maskAt", () => {
  it("blendet zu jedem Rand aus — keine harte Kante", () => {
    for (const aspect of [3.2, 0.8]) {
      expect(maskAt(1, 0.3, aspect)).toBe(0);
      expect(maskAt(0.7, 0, aspect)).toBe(0);
      expect(maskAt(0, 0.3, aspect)).toBe(0);
    }
    expect(maskAt(0.7, 0.5, 3.2)).toBe(1);
  });
});

describe("colorFor", () => {
  it("blendet über die Deckkraft aus, nicht über die Grundfarbe", () => {
    expect(colorFor("dark", 0, 0)).toBe("rgba(30,40,50,0)");
    expect(colorFor("dark", 0, 1)).toBe("rgba(30,40,50,1)");
    expect(colorFor("light", 1, 1)).toBe("rgba(48,60,73,1)");
  });
});

describe("buildCells", () => {
  it("setzt je Muster einige rote Quadrate, nur dort, wo das Feld voll da ist", () => {
    const cells = buildCells("wave", 1920, 600, true);
    const reds = cells.filter((cell) => cell.red);
    expect(reds).toHaveLength(12);
    expect(reds.every((cell) => cell.mask > 0.7)).toBe(true);
  });
});
