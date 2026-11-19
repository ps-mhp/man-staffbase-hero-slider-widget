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
import { RED_SHARE } from "./slide-animation-paint";
import { LOOKS, Paint, buildCells, colorFor, drawAnimation, maskAt, redCount } from "./slide-animation-patterns";

/** Ein gezeichnetes Element: Rechteck, Kreis oder Linienpunkt, mit seiner Farbe. */
interface Mark {
  kind: "rect" | "dot" | "line";
  color: string;
  x: number;
  y: number;
  /** Kantenlänge, Radius oder Linienbreite. */
  size: number;
}

/** Schreibt alles Gezeichnete mit — statt einer Leinwand. */
function recorder(): Paint & { marks: Mark[]; clears: number } {
  const marks: Mark[] = [];
  const paint = {
    fillStyle: "" as Paint["fillStyle"],
    strokeStyle: "" as Paint["strokeStyle"],
    lineWidth: 1,
    lineCap: "butt" as CanvasLineCap,
    marks,
    clears: 0,
    fillRect(x: number, y: number, w: number) {
      marks.push({ kind: "rect", color: String(paint.fillStyle), x, y, size: w });
    },
    clearRect() {
      paint.clears += 1;
    },
    beginPath() {},
    moveTo(x: number, y: number) {
      marks.push({ kind: "line", color: String(paint.strokeStyle), x, y, size: paint.lineWidth });
    },
    lineTo(x: number, y: number) {
      marks.push({ kind: "line", color: String(paint.strokeStyle), x, y, size: paint.lineWidth });
    },
    arc(x: number, y: number, radius: number) {
      // `moveTo` vor jedem Kreis ist kein Linienpunkt.
      marks.pop();
      marks.push({ kind: "dot", color: String(paint.fillStyle), x, y, size: radius });
    },
    fill() {},
    stroke() {},
  };
  return paint;
}

const draw = (animation: SlideAnimation, t: number, width = 1920, height = 600): Mark[] => {
  const paint = recorder();
  drawAnimation(paint, width, height, animation, t);
  return paint.marks;
};

const RED = "#e40045";
const ALL = ANIMATION_PATTERNS.map((pattern) => ({ ...DEFAULT_ANIMATION, pattern }));

describe("drawAnimation", () => {
  it.each(ANIMATION_PATTERNS)("%s: malt zuerst den Grund, dann viele feine Elemente", (pattern) => {
    const marks = draw({ ...DEFAULT_ANIMATION, pattern }, 3);
    expect(marks[0]).toEqual({ kind: "rect", color: LOOKS.dark.background, x: 0, y: 0, size: 1920 });
    expect(marks.length).toBeGreaterThan(500);
  });

  it.each(ANIMATION_PATTERNS)("%s: schließt nach einer Periode nahtlos an", (pattern) => {
    const animation = { ...DEFAULT_ANIMATION, pattern };
    const period = ANIMATION_PERIOD[animation.speed];
    const start = draw(animation, 1.25);
    const after = draw(animation, 1.25 + period);
    expect(after.length).toBe(start.length);
    after.forEach((mark, at) => {
      expect(mark.color).toBe(start[at]!.color);
      expect(mark.x).toBeCloseTo(start[at]!.x, 5);
      expect(mark.y).toBeCloseTo(start[at]!.y, 5);
    });
  });

  it.each(ANIMATION_PATTERNS)("%s: bewegt sich", (pattern) => {
    const a = draw({ ...DEFAULT_ANIMATION, pattern }, 0);
    const b = draw({ ...DEFAULT_ANIMATION, pattern }, 5);
    expect(a.map((mark) => mark.x + mark.y)).not.toEqual(b.map((mark) => mark.x + mark.y));
  });

  it("hält quer die linke Textseite frei", () => {
    for (const animation of ALL) {
      expect(draw(animation, 2).slice(1).every((mark) => mark.x + mark.size > 0.22 * 1920)).toBe(true);
    }
  });

  it("hält hochkant die untere Textseite frei", () => {
    for (const animation of ALL) {
      expect(draw(animation, 2, 400, 500).slice(1).every((mark) => mark.y < 0.66 * 500)).toBe(true);
    }
  });

  it("ist bei allen Mustern fein", () => {
    for (const animation of ALL) {
      for (const mark of draw(animation, 2).slice(1)) {
        const limit = { rect: 18, dot: 6, line: 2 }[mark.kind];
        expect(mark.size).toBeLessThanOrEqual(limit);
      }
    }
  });

  it("zeigt in jedem Muster Rot, nur voll deckend und nur mit Akzenten", () => {
    for (const animation of ALL) {
      const marks = draw(animation, 2);
      expect(marks.some((mark) => mark.color === RED)).toBe(true);
      expect(marks.some((mark) => /rgba\(228,0,69/.test(mark.color))).toBe(false);
      expect(draw({ ...animation, accent: false }, 2).some((mark) => mark.color === RED)).toBe(false);
    }
  });

  it("malt hell auf weißem Grund", () => {
    expect(draw({ ...DEFAULT_ANIMATION, theme: "light" }, 2)[0]!.color).toBe("#ffffff");
  });

  it("malt bei leerer Fläche nur den Grund", () => {
    expect(draw(DEFAULT_ANIMATION, 0, 0, 0)).toHaveLength(1);
  });

  it("leert die Leinwand vor jedem Bild und malt den Grund durchscheinend", () => {
    const paint = recorder();
    drawAnimation(paint, 1920, 600, { ...DEFAULT_ANIMATION, opacity: 0.5 }, 2);
    expect(paint.clears).toBe(1);
    expect(paint.marks[0]!.color).toBe("rgba(18,27,35,0.5)");
  });

  it("malt ohne Grund, wenn er durchsichtig ist — die Elemente bleiben", () => {
    const marks = draw({ ...DEFAULT_ANIMATION, opacity: 0 }, 2);
    expect(marks.some((mark) => mark.kind === "rect" && mark.size === 1920)).toBe(false);
    expect(marks.length).toBeGreaterThan(100);
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

describe("Rote Akzente", () => {
  it("richten sich nach der Fläche, mindestens acht", () => {
    expect(redCount(100, 1)).toBe(8);
    expect(redCount(10000, 1)).toBe(Math.round(10000 * RED_SHARE));
    expect(redCount(5, 1)).toBe(5);
  });

  it("stehen in der Welle zahlreich und nur dort, wo das Feld voll da ist", () => {
    const reds = buildCells("wave", 1920, 600, true).filter((cell) => cell.red);
    expect(reds.length).toBeGreaterThan(40);
    expect(reds.every((cell) => cell.mask > 0.7)).toBe(true);
  });
});
