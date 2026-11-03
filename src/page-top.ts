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
 * Wo die Seite anfängt — gemessen statt angenommen.
 *
 * Staffbase hält am `#wrapper` oben Platz für die festen Leisten frei. Der
 * Wert ist kein einzelner: `.desktop.with-mega-menu` führt 136px,
 * `.with-contextual-toolbar.wow-header-activated` `calc(136px + 44px)`,
 * `.is-content-document-page` wieder andere, und auf dem Telefon steht er auf
 * 0 (alles aus `resources/css/app.css`). Unter einer Bühne, die bis an den
 * Bildschirmrand läuft, bleibt davon ein Streifen Weissraum stehen, den es
 * auf man.eu nicht gibt.
 *
 * Bis zum 03.11.2026 stand hier ein fester Gegenwert von 155px. Er traf den
 * Fall ohne Brotkrumen und verfehlte den mit: die Brotkrumen liegen **aus dem
 * Fluss**, ihr Kasten (`div:has(#breadcrumbs)`) steht je nach Seitenzustand
 * auf `top: 100px`, `122px` oder `calc(136px + 30px)` — die Bühne begann bei
 * 155px und schob sich unter sie. Ein weiterer Festwert hätte nur eine andere
 * Seite verfehlt.
 *
 * Deshalb wird gemessen, wie es `full-bleed.ts` für die Breite tut:
 *
 * - Liegen Brotkrumen aus dem Fluss über der Seite, beginnt der Inhalt an
 *   **ihrer** Unterkante — die Bühne sitzt senkrecht unter ihnen.
 * - Gibt es keine (oder stehen sie im Fluss und schieben sich selbst), beginnt
 *   der Inhalt an der Unterkante der festen Kopf- und Menüleiste — die Bühne
 *   schliesst bündig an das Menü an.
 *
 * Beide Kanten sind von unserem eigenen Eingriff unberührt: der Innenabstand
 * des `#wrapper` verschiebt weder die festen Leisten noch den absolut
 * positionierten Kasten der Brotkrumen (dessen Bezug die Polsterkante des
 * `#wrapper` ist, und die liegt vor dem Innenabstand). Die Messung kann sich
 * deshalb nicht selbst hochschaukeln.
 */

import { useEffect } from "react";

/** Der Seitenrahmen, dessen Kopfabstand den Beginn des Inhalts setzt. */
export const WRAPPER_SELECTOR = "#wrapper";

/** Die Brotkrumen; am lebenden System über die Kennung, nicht über Klassen. */
export const BREADCRUMBS_SELECTOR = "#breadcrumbs";

/**
 * Die festen Leisten über der Seite — Kopfzeile, Megamenü und die
 * kontextuelle Werkzeugleiste. Dieselben Kennungen, die auch
 * `shared/content-modal/page-frame.tsx` ausblendet.
 */
export const CHROME_SELECTOR = "#header, #mega-menu, #contextual-action-toolbar";

/**
 * Über diesem Wert gilt das Gemessene nicht mehr als Kopfabstand.
 *
 * Eine mitten im Bildlauf schrumpfende Kopfzeile oder ein unerwartet tief
 * stehender Kasten lieferten sonst einen Wert, der die halbe Seite nach unten
 * schöbe. Im Zweifel bleibt der Abstand, den Staffbase selbst setzt.
 */
export const MAX_PLAUSIBLE_TOP = 320;

/** Sichtbar heisst: gerendert und mit eigener Höhe. */
function isVisible(element: HTMLElement): boolean {
  const style = getComputedStyle(element);
  if (style.display === "none" || style.visibility === "hidden") return false;
  return element.getBoundingClientRect().height > 0;
}

/**
 * Ob `element` zwischen sich und `wrapper` aus dem Fluss genommen ist.
 *
 * Der Unterschied entscheidet, was gemessen werden darf. Stehen die
 * Brotkrumen im Fluss, schieben sie den Inhalt selbst — dann ist ihre
 * Unterkante eine Folge des Kopfabstands, und sie zu messen hiesse, den
 * eigenen Eingriff zu messen. Liegen sie darüber, schiebt sie niemand, und
 * ihre Unterkante ist die einzige verlässliche Kante.
 */
function isOutOfFlow(element: HTMLElement, wrapper: HTMLElement): boolean {
  let node: HTMLElement | null = element;
  while (node !== null && node !== wrapper) {
    const { position } = getComputedStyle(node);
    if (position === "absolute" || position === "fixed") return true;
    node = node.parentElement;
  }
  return false;
}

/** Die Unterkante der tiefsten festen Leiste, oder `null`, wenn es keine gibt. */
function chromeBottom(doc: Document): number | null {
  let bottom: number | null = null;
  for (const node of doc.querySelectorAll<HTMLElement>(CHROME_SELECTOR)) {
    if (!isVisible(node)) continue;
    const { position } = getComputedStyle(node);
    // Nur was wirklich über der Seite steht. Eine Kopfzeile im Fluss braucht
    // keinen freigehaltenen Platz — sie nimmt ihn sich.
    if (position !== "fixed" && position !== "sticky") continue;
    const edge = node.getBoundingClientRect().bottom;
    bottom = bottom === null ? edge : Math.max(bottom, edge);
  }
  return bottom;
}

/**
 * Der Kopfabstand, den der `#wrapper` für diese Seite haben müsste.
 *
 * @returns den Wert in CSS-Pixeln, oder `null`, wenn nichts Verlässliches zu
 * messen war — dann bleibt der Abstand von Staffbase unangetastet. Ein
 * geratener Wert wäre schlechter als der fremde.
 */
export function measurePageTop(doc: Document = document): number | null {
  const wrapper = doc.querySelector<HTMLElement>(WRAPPER_SELECTOR);
  if (wrapper === null) return null;

  const scroller = doc.scrollingElement ?? doc.documentElement;
  // Der Bezugspunkt ist die Oberkante des Rahmens selbst; sein Innenabstand
  // ändert sie nicht, deshalb misst sich der Eingriff hier nicht selbst.
  const wrapperTop = wrapper.getBoundingClientRect().top + scroller.scrollTop;

  const crumbs = doc.querySelector<HTMLElement>(BREADCRUMBS_SELECTOR);
  const edge =
    crumbs !== null && isVisible(crumbs) && isOutOfFlow(crumbs, wrapper)
      ? crumbs.getBoundingClientRect().bottom + scroller.scrollTop
      : // Feste Leisten stehen im Fenster, nicht im Dokument: ihre Unterkante
        // ist bereits der Abstand vom Seitenanfang und darf nicht noch einmal
        // um den Bildlauf verschoben werden.
        chromeBottom(doc);

  if (edge === null) return null;

  const top = edge - wrapperTop;
  // Bündig heisst bündig: der Abstand zwischen Brotkrumen und Bühne ist 0,
  // die Luft darunter setzt die Bühne selbst (`.man-hero-host`).
  if (top < 0 || top > MAX_PLAUSIBLE_TOP) return null;
  return top;
}

/** Was vom Innenabstand des Rahmens vor dem Eingriff da war. */
interface SavedPadding {
  element: HTMLElement;
  value: string;
  priority: string;
}

/**
 * Wie viele Bühnen den Kopfabstand gerade halten.
 *
 * Zwei Bühnen auf einer Seite setzen denselben Wert; die erste, die geht,
 * darf ihn deshalb nicht zurücknehmen, solange die zweite noch steht.
 */
let holders = 0;
let saved: SavedPadding | null = null;
let resizeObserver: ResizeObserver | null = null;
let mutationObserver: MutationObserver | null = null;
let frame: number | null = null;
/**
 * Die angemeldete Messung — modulweit, nicht je Aufrufer: beim Abmelden des
 * Zuhörers muss dieselbe Funktion übergeben werden, die angemeldet wurde,
 * und das ist nicht zwingend die des letzten Halters.
 */
let scheduled: (() => void) | null = null;

function write(doc: Document): void {
  const wrapper = doc.querySelector<HTMLElement>(WRAPPER_SELECTOR);
  if (wrapper === null) return;

  const top = measurePageTop(doc);
  if (top === null) return;

  // Der Vorzustand wird beim ersten Schreiben gemerkt, nicht bei jedem —
  // sonst merkte sich der zweite Durchlauf unseren eigenen Wert.
  saved ??= {
    element: wrapper,
    value: wrapper.style.getPropertyValue("padding-top"),
    priority: wrapper.style.getPropertyPriority("padding-top"),
  };

  // `!important` ist nötig und unstrittig: der Gegner steht bei vier Klassen
  // und einer Kennung, führt seinen Wert aber ohne Nachdruck.
  wrapper.style.setProperty("padding-top", `${top}px`, "important");
}

function restore(): void {
  if (saved === null) return;
  const { element, value, priority } = saved;
  saved = null;
  // Ein leerer Wert heisst „stand nicht inline" — dann muss die Eigenschaft
  // ganz verschwinden, nicht auf `""` stehen bleiben.
  if (value === "") element.style.removeProperty("padding-top");
  else element.style.setProperty("padding-top", value, priority);
}

/**
 * Hält den Kopfabstand der Seite, solange die Bühne steht.
 *
 * Nachgemessen wird bei jeder Grössenänderung und bei jedem Umbau der Seite:
 * Staffbase trägt die Brotkrumen erst nach, und eine Bühne, die vor ihnen
 * steht, hätte sonst für immer bündig am Menü geklebt — mit den Brotkrumen
 * quer darüber. Mehrere Meldungen je Bild werden zu einer Messung
 * zusammengefasst.
 *
 * @returns gibt den Kopfabstand wieder frei; der letzte Halter stellt den
 * Zustand der Wirtsseite wieder her.
 */
export function holdPageTop(doc: Document = document): () => void {
  holders += 1;
  write(doc);

  const view = doc.defaultView;
  if (holders === 1 && view !== null) {
    const update = (): void => {
      if (frame !== null) return;
      frame = view.requestAnimationFrame(() => {
        frame = null;
        write(doc);
      });
    };
    scheduled = update;

    if (typeof view.ResizeObserver === "undefined") view.addEventListener("resize", update);
    else {
      resizeObserver = new view.ResizeObserver(update);
      resizeObserver.observe(doc.documentElement);
    }

    if (typeof view.MutationObserver !== "undefined") {
      mutationObserver = new view.MutationObserver(update);
      mutationObserver.observe(doc.documentElement, { childList: true, subtree: true });
    }
  }

  let released = false;
  return () => {
    if (released) return;
    released = true;
    holders -= 1;
    if (holders > 0) return;

    if (scheduled !== null) view?.removeEventListener("resize", scheduled);
    scheduled = null;
    resizeObserver?.disconnect();
    resizeObserver = null;
    mutationObserver?.disconnect();
    mutationObserver = null;
    if (frame !== null && view !== null) {
      view.cancelAnimationFrame(frame);
      frame = null;
    }
    restore();
  };
}

/** {@link holdPageTop} an der Lebensdauer einer Komponente. */
export function usePageTop(active = true): void {
  useEffect(() => {
    if (!active) return undefined;
    return holdPageTop(document);
  }, [active]);
}
