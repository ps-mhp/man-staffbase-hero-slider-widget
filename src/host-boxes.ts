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
 * Kästen des Wirts rund um das Widget.
 *
 * Das Widget steckt auf Content-Designer-Seiten hinter mehreren
 * Schattengrenzen (`custom-block.mjs` ab 10.0.12, siehe
 * `content-tabs/src/section-scan.ts`). Wer vom eigenen Kasten aus nach den
 * Kästen der Seite sucht, muss über diese Grenzen hinweg nach oben steigen.
 */

/**
 * Gemessene Kanten sind Bruchzahlen; ein Bildschirmpunkt Abweichung ist
 * Rundung, keine fremde Regel.
 */
const EDGE_TOLERANCE = 1;

/** Der Elternknoten, auch über eine Schattengrenze hinweg. */
export function parentAcross(node: Element): Element | null {
  if (node.parentElement !== null) return node.parentElement;
  const root = node.getRootNode();
  return "host" in root ? (root as ShadowRoot).host : null;
}

/**
 * Der Kasten, an dem der Ausgleich sitzen muss, damit er auch zu sehen ist.
 *
 * Der äussere Kasten des Widgets steckt auf Content-Designer-Seiten in einem
 * Block mit `overflow: hidden`. Zöge man ihn selbst hoch, ragte er über die
 * Oberkante dieses Blocks und würde beschnitten: gemessen stünde die Bühne
 * bündig, zu sehen bliebe der Weissraum (live belegt 06.11.2026 auf truck,
 * `6aec5e8f…`). Deshalb wird über Schattengrenzen hinweg der oberste Vorfahr
 * gesucht, der noch auf derselben Höhe beginnt — verschoben nimmt er alles
 * mit, was darin liegt, und beschneidet nichts davon.
 *
 * Wer höher beginnt, hat etwas über der Bühne; ihn zu verschieben zöge das
 * mit unter die Leisten. Kopien mit `display: contents` haben keinen Kasten
 * und werden übersprungen. Über den `#wrapper` geht es nie hinaus.
 */
export function flushTopBox(wrapper: HTMLElement, outer: HTMLElement): HTMLElement {
  const top = outer.getBoundingClientRect().top;
  let box = outer;
  for (let node = parentAcross(outer); node !== null; node = parentAcross(node)) {
    if (node === wrapper || node === wrapper.ownerDocument.body) break;
    if (!(node instanceof HTMLElement)) break;
    if (getComputedStyle(node).display === "contents") continue;
    if (Math.abs(node.getBoundingClientRect().top - top) > EDGE_TOLERANCE) break;
    box = node;
  }
  return box;
}

/** Ob der Kasten aus dem Fluss genommen ist und deshalb niemanden verdrängt. */
function outOfFlow(element: Element): boolean {
  const { position } = getComputedStyle(element);
  return position === "absolute" || position === "fixed";
}

/**
 * Ob `box` am Anfang des Inhalts im `#wrapper` steht: auf dem Weg nach oben
 * steht vor keinem Kasten ein Geschwister, das gerendert und im Fluss ist.
 *
 * Aus dem Fluss genommene Geschwister — der Brotkrumen-Kasten, Leisten —
 * verdrängen nichts und zählen nicht mit.
 */
export function startsContent(wrapper: HTMLElement, box: HTMLElement): boolean {
  for (let node: Element | null = box; node !== null && node !== wrapper; node = parentAcross(node)) {
    for (let sibling = node.previousElementSibling; sibling !== null; sibling = sibling.previousElementSibling) {
      if (outOfFlow(sibling)) continue;
      if (sibling.getBoundingClientRect().height > 0) return false;
    }
  }
  return true;
}
