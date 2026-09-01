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
 * Wächter über die Stylesheets der Bühne.
 *
 * jsdom rechnet weder Layout noch Kaskade — beides fällt in Tests nie auf und
 * erst auf der echten Seite. Diese Prüfungen sichern deshalb die zwei Regeln,
 * die dort schon einmal gebrochen sind: die Bindung an die MAN-Tokens und die
 * Durchsetzung gegen Staffbases eigene Textregeln.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const read = (file: string): string => readFileSync(join(__dirname, "styles", file), "utf8");

describe("Stylesheets", () => {
  describe("Bindung an die MAN-Tokens", () => {
    it("schreibt keine Farbe als Literal", () => {
      // Ein `rgba(18, 23, 28, …)` ist derselbe Wert wie `surface-invers`, aber
      // ein Tenant, der den Token ändert, erreicht es nicht mehr — und beim
      // Lesen ist nicht zu erkennen, dass es überhaupt ein Token sein sollte.
      // `man()` und `man-alpha()` erzwingen beides.
      const literals = /(rgba?\([^)]*\)|#[0-9a-fA-F]{3,8}\b)/g;
      const found = read("hero-slider.scss").match(literals) ?? [];

      expect(found).toEqual([]);
    });

    it("verwendet im Editor die Studio-Palette statt der MAN-Tokens", () => {
      // Der Folien-Editor steht im Konfigurationsdialog von Staffbase und soll
      // dort nicht auffallen. MAN-Rot wäre hier falsch, so richtig es auf der
      // Bühne ist.
      const css = read("slide-editor.scss");
      const literals = /(rgba?\([^)]*\)|#[0-9a-fA-F]{3,8}\b)/g;

      expect(css.match(literals) ?? []).toEqual([]);
      expect(css).toContain("chrome.$");
    });
  });

  describe("Durchsetzung gegen die Wirtsseite", () => {
    it("schreibt die Farbe der Unterzeile mit erhöhter Spezifität", () => {
      // Staffbase färbt jedes `p` im Inhaltsbereich mit `!important` und vier
      // Klassen Spezifität ein. Eine einzelne Klasse verliert dagegen, auch
      // mit `!important` — die Unterzeile stand deshalb dunkelgrau auf dem
      // Bild. `man-outshine-host` wiederholt den Selektor, bis er gewinnt.
      expect(read("hero-slider.scss")).toMatch(
        /\.man-hero__subline\s*\{[\s\S]*?@include man-outshine-host/,
      );
    });

    it("setzt die Bühnenschrift der Überschrift mit erhöhter Spezifität", () => {
      // Dieselbe Falle wie bei der Unterzeile: `.page h2` der Wirtsseite steht
      // mit `!important` auf 26px. Ohne `man-outshine-host` kam von den 56px
      // der Bühnenschrift nichts an.
      expect(read("hero-slider.scss")).toMatch(
        /\.man-hero__headline\s*\{[\s\S]*?@include man-outshine-host[\s\S]*?display-xl/,
      );
    });

    it("setzt die Schaltfläche mit erhöhter Spezifität in MAN-Rot", () => {
      // Der Themenblock von Staffbase färbt Fläche und Schrift jedes `a.button`
      // im selben Dunkelgrau — der Knopf wäre unlesbar.
      expect(read("hero-slider.scss")).toMatch(
        /\.man-hero__cta\s*\{[\s\S]*?@include man-outshine-host[\s\S]*?background:\s*man\("red"\)\s*!important/,
      );
    });

    it("setzt die Masse der Striche mit erhöhter Spezifität", () => {
      // Die Wirtsseite gibt jedem `button` im Inhaltsbereich `padding:
      // 10px 24px` mit zwei Klassen Spezifität. Ohne Gegenwehr wurde der
      // Strich 88px statt 40px breit und riss jeden Abstand der Leiste auf.
      expect(read("hero-slider.scss")).toMatch(
        /\.man-hero__dot\s*\{[\s\S]*?@include man-outshine-host[\s\S]*?padding:\s*0\s*!important/,
      );
    });

    it("zeichnet die Pfeile mit der Symbolschrift der Marke", () => {
      // Der Pfeil ist das Zeichen von man.eu (\e953/\e939 aus `man-icon`),
      // nicht Staffbases Chevron. Ohne Nachdruck auf der Familie gewinnt die
      // Schriftregel der Wirtsseite und es erscheint ein leeres Kästchen.
      const css = read("hero-slider.scss");

      expect(css).toMatch(
        /\.man-hero__arrow::after\s*\{[^}]*font-family:\s*man\("font-icon"\)\s*!important/,
      );
      expect(css).toContain('content: "\\e953"');
      expect(css).toContain('content: "\\e939"');
    });
  });
});
