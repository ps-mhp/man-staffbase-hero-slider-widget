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
 * Der Abschnitt endet mit der Bühne.
 *
 * Bei „Abschnittshöhe" nimmt die Bühne die Höhe ihres Abschnitts ein
 * (`stretchToSection`). Bei jeder festen Stufe ist es umgekehrt: der Abschnitt
 * soll sich der Bühne anpassen. Der Content Designer stapelt unter dem letzten
 * Block aber Abstände, die ihm gehören — `mb-6` am Container (32px), den
 * Innenabstand des Rahmens (40px) und des Abschnitts (24px) —, dazu die eigene
 * Luft der Bühne (`.man-hero-host`, 32px). Zusammen gemessen 06.11.2026 auf
 * truck: gut 100px Weiss zwischen Bühne und nächstem Abschnitt.
 *
 * Steht die Bühne als Letztes in ihrem Abschnitt, fallen diese Abstände.
 * Folgt noch etwas, bleibt alles stehen: der Abstand zum nächsten Block ist
 * dann der der Seite, und den regelt „Abstand nach unten".
 */

import { useEffect, useState } from "react";

import { findSection, isNeighbour } from "./full-bleed";
import { parentAcross } from "./host-boxes";

/**
 * Ob nach der Bühne in ihrem Abschnitt nichts mehr kommt: auf dem Weg nach
 * oben folgt keinem Kasten ein Geschwister, das Platz einnimmt.
 *
 * Gezählt wird, was im DOM steht, nicht was schon eine Höhe hat — ein Block,
 * der noch lädt, wäre beim ersten Bild 0px hoch und hinterher trotzdem da.
 */
export function endsSection(element: HTMLElement): boolean {
  const section = findSection(element);
  if (section === null) return false;
  let child: Element = element;
  for (let node = parentAcross(element); node !== null; node = parentAcross(node)) {
    for (let next = child.nextElementSibling; next !== null; next = next.nextElementSibling) {
      if (isNeighbour(next)) return false;
    }
    if (node === section) return true;
    child = node;
  }
  return false;
}

/** Setzt `property` mit Nachdruck und merkt sich den Vorzustand. */
function force(undos: Array<() => void>, node: HTMLElement, property: string, value: string): void {
  const previousValue = node.style.getPropertyValue(property);
  const previousPriority = node.style.getPropertyPriority(property);
  undos.push(() => {
    if (previousValue === "") node.style.removeProperty(property);
    else node.style.setProperty(property, previousValue, previousPriority);
  });
  // `!important`, weil der Editor `mb-6` und den Innenabstand des Abschnitts
  // selbst mit Nachdruck führt (siehe `stretchToSection`).
  node.style.setProperty(property, value, "important");
}

/** Ob an `node` ein Abstand nach unten steht, der zu nehmen ist. */
function hasBottom(node: HTMLElement, property: "margin-bottom" | "padding-bottom"): boolean {
  const value = Number.parseFloat(getComputedStyle(node).getPropertyValue(property));
  return !Number.isNaN(value) && value > 0;
}

/**
 * Nimmt die Abstände unter der Bühne bis zur Unterkante ihres Abschnitts weg.
 *
 * @returns nimmt den Eingriff zurück — oder `null`, wenn die Bühne nicht das
 * Letzte in ihrem Abschnitt ist und deshalb nichts angefasst wurde.
 */
export function hugSectionBottom(element: HTMLElement): (() => void) | null {
  if (!endsSection(element)) return null;
  const section = findSection(element) as HTMLElement;
  const undos: Array<() => void> = [];

  for (let node: Element | null = element; node !== null && node !== section; node = parentAcross(node)) {
    if (!(node instanceof HTMLElement)) continue;
    if (getComputedStyle(node).display === "contents") continue;
    if (hasBottom(node, "margin-bottom")) force(undos, node, "margin-bottom", "0px");
    if (hasBottom(node, "padding-bottom")) force(undos, node, "padding-bottom", "0px");
  }
  if (hasBottom(section, "padding-bottom")) force(undos, section, "padding-bottom", "0px");

  return () => {
    for (const undo of undos.reverse()) undo();
  };
}

/**
 * Hängt `hugSectionBottom` an die Lebensdauer der Bühne.
 *
 * @param active nur bei einer festen Stufe — bei „Abschnittshöhe" übernimmt
 * `stretchToSection` die Abstände.
 * @returns ob der Abschnitt mit der Bühne endet.
 */
export function useSectionHug(anchor: HTMLElement | null, active: boolean): boolean {
  const [hugging, setHugging] = useState(false);
  useEffect(() => {
    if (anchor === null || !active) {
      setHugging(false);
      return undefined;
    }
    const undo = hugSectionBottom(anchor);
    setHugging(undo !== null);
    return () => undo?.();
  }, [anchor, active]);
  return hugging;
}
