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
 * Der Abstand unter der Bühne.
 *
 * Der Content Designer setzt unter jede Zeile einen Blockabstand (`mb-6`,
 * gemessen 32px). Unter einer Bühne, die bündig an der Seite klebt, soll er
 * sich abschalten lassen, damit der folgende Inhalt direkt anschliesst.
 *
 * Wie oben sitzt der Abstand jenseits der Schattengrenzen des Widgets, an
 * Kästen der Seite; eine Stilregel aus dem Widget erreicht ihn nicht. Er wird
 * deshalb an den Kästen weggenommen, die mit der Bühne enden — nur dort ist er
 * der Abstand *unter der Bühne*. Ein Kasten, der tiefer endet, trägt noch
 * anderes, und sein Abstand gehört der Seite.
 */

import { useEffect } from "react";

import { parentAcross } from "./host-boxes";

/** Wie der Abstand unter der Bühne aussieht. */
export type BottomSpacing = "default" | "none";

/** Rundung, keine fremde Regel — siehe `host-boxes.ts`. */
const EDGE_TOLERANCE = 1;

interface SavedMargin {
  element: HTMLElement;
  value: string;
  priority: string;
}

/** Die Kästen, die auf derselben Höhe enden wie `outer`, samt `outer` selbst. */
function flushBottomBoxes(outer: HTMLElement): HTMLElement[] {
  const doc = outer.ownerDocument;
  const bottom = outer.getBoundingClientRect().bottom;
  const boxes: HTMLElement[] = [outer];
  for (let node = parentAcross(outer); node !== null; node = parentAcross(node)) {
    if (!(node instanceof HTMLElement)) break;
    if (node.id === "wrapper" || node === doc.body) break;
    if (getComputedStyle(node).display === "contents") continue;
    if (Math.abs(node.getBoundingClientRect().bottom - bottom) > EDGE_TOLERANCE) break;
    boxes.push(node);
  }
  return boxes;
}

/**
 * Nimmt den Abstand unter der Bühne weg.
 *
 * Geschrieben wird nur, wo ein Abstand steht: ein `0` auf einem Kasten ohne
 * Abstand bewirkte nichts und stiesse sich an fremden Inline-Regeln — der
 * Vollbreiten-Ausbruch setzt `margin-bottom` am Widget-Element selbst.
 *
 * @returns stellt den Vorzustand wieder her.
 */
export function holdBottomSpacing(outer: HTMLElement): () => void {
  const saved: SavedMargin[] = [];
  for (const box of flushBottomBoxes(outer)) {
    const margin = Number.parseFloat(getComputedStyle(box).marginBottom);
    if (Number.isNaN(margin) || margin <= 0) continue;
    saved.push({
      element: box,
      value: box.style.getPropertyValue("margin-bottom"),
      priority: box.style.getPropertyPriority("margin-bottom"),
    });
    box.style.setProperty("margin-bottom", "0px", "important");
  }

  return () => {
    for (const { element, value, priority } of saved) {
      if (value === "") element.style.removeProperty("margin-bottom");
      else element.style.setProperty("margin-bottom", value, priority);
    }
  };
}

/**
 * Hängt `holdBottomSpacing` an die Lebensdauer der Bühne.
 *
 * Neu gesucht wird, wenn sich die Höhe des äusseren Kastens ändert: ein spät
 * geladenes Bild kann ihn über eine Nachbarspalte hinauswachsen lassen, und
 * dann enden andere Kästen mit ihm als beim ersten Bild.
 */
export function useBottomSpacing(outer: HTMLElement | null, spacing: BottomSpacing): void {
  useEffect(() => {
    if (outer === null || spacing !== "none") return undefined;

    let release = holdBottomSpacing(outer);
    const view = outer.ownerDocument.defaultView;
    if (view === null || typeof view.ResizeObserver === "undefined") return () => release();

    const observer = new view.ResizeObserver(() => {
      // Erst zurück, dann neu suchen: sonst fände die Suche die eigenen
      // Nullen und hielte sie für den Vorzustand.
      release();
      release = holdBottomSpacing(outer);
    });
    observer.observe(outer);
    return () => {
      observer.disconnect();
      release();
    };
  }, [outer, spacing]);
}
