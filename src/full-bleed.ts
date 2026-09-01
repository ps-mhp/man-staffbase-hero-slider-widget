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
 * Der Ausbruch aus der Inhaltsspalte — gemessen statt angenommen.
 *
 * Die verbreitete Rechnung `margin-inline: calc(50% - 50vw)` unterstellt zwei
 * Dinge, die in Staffbase beide nicht zutreffen. Erstens sei die Inhaltsspalte
 * im Fenster zentriert; tatsächlich ist sie auf onetruck 1290 px breit bei
 * 150 px links und 160 px rechts (Scrollbar-Reserve), was den Ausbruch um
 * 5 px verschiebt und den Text neben die Fluchtlinie setzt. Zweitens dürfe
 * ein Element über seinen Container hinausragen; tatsächlich liegt über der
 * Seite ein `div.scroller` mit `overflow: hidden`, der jeden Ausbruch wieder
 * auf die Spaltenbreite zurückschneidet — gemessen am 01/09/26 auf
 * /content/page/6a86c0a90744e5683d6d66b0.
 *
 * Dieses Modul misst deshalb die tatsächliche Kante und räumt die clippenden
 * Vorfahren aus dem Weg — und zwar nur die, bei denen das nachweislich
 * folgenlos ist. Gelingt das nicht vollständig, findet **kein** Ausbruch
 * statt: eine Bühne in Spaltenbreite ist richtig, eine an beiden Rändern
 * angeschnittene ist kaputt.
 */

import { useEffect, useState } from "react";

/** Was die Bühne für den Ausbruch braucht; alle Werte in CSS-Pixeln. */
export interface BleedMetrics {
  /** Der negative linke Rand, der das Element an den Fensterrand zieht. */
  pull: number;
  /** Die Fensterbreite **ohne** Scrollbar — anders als `100vw`. */
  width: number;
  /**
   * Der Abstand vom Seitenanfang bis zur Bühne, also die Höhe von allem, was
   * über ihr steht. Nur für die Höhenstufe „bildschirmhoch" gebraucht.
   */
  headerHeight: number;
}

/**
 * Was als Clipping zählt. `visible` ist der einzige Wert, der nichts
 * abschneidet; `clip` und `hidden` schneiden ab, `auto` und `scroll` ebenso
 * (sie fügen nur eine Bildlaufleiste hinzu).
 */
const CLIPS = /^(hidden|clip|auto|scroll)$/;

/**
 * Über diesem Wert gilt der gemessene Abstand nicht mehr als Kopfzeile.
 *
 * Steht die Bühne nicht am Seitenanfang, sondern in der Mitte einer langen
 * Seite, misst der Abstand nicht die Kopfzeile, sondern den Inhalt darüber.
 * „Bildschirmhoch" ergibt dann ohnehin keinen Sinn; der Rückfallwert ist
 * besser als eine Bühne von zwei Pixeln Höhe.
 */
const MAX_PLAUSIBLE_HEADER = 320;

/** Der Rückfallwert: die Kopfzeilenhöhe von man.eu (`man-stage--desktop-header`). */
export const FALLBACK_HEADER_HEIGHT = 95;

/** Das Ergebnis von `openClippingAncestors`. */
export interface ClipOpening {
  /** Nimmt alle Eingriffe zurück. */
  undo: () => void;
  /**
   * Der engste Vorfahr, der **nicht** geöffnet werden durfte, weil er wirklich
   * scrollt — oder `null`, wenn der Weg bis zum Fenster frei ist. Er bildet
   * die Kante, bis zu der die Bühne ausbrechen darf.
   */
  limit: HTMLElement | null;
}

/**
 * Räumt die clippenden Vorfahren zwischen `element` und `<body>` aus dem Weg.
 *
 * Ein Container wird nur geöffnet, wenn er **nicht selbst scrollt**: dann ist
 * sein `overflow` eine reine Sicherung gegen Überläufe und keine
 * Bedienfunktion, und das Öffnen ist für die Seite folgenlos. Scrollt er
 * wirklich, bleibt er unangetastet — `overflow` lässt sich in einer Achse gar
 * nicht auf `visible` setzen, solange die andere scrollt (der Browser macht
 * daraus wieder `auto`).
 *
 * Ein solcher Scroller beendet die Suche, hebt den Ausbruch aber nicht auf:
 * die Bühne bricht dann bis zu **seiner** Kante aus. Auf schmalen Schirmen ist
 * genau das der Fall — `div.page-content` scrollt die Seite, ist aber selbst
 * bildschirmbreit (am 01.09.2026 auf onetruck gemessen: 390px bei 390px
 * Fenster). Wer hier ganz aufgibt, verschenkt den Ausbruch an einer Kante,
 * die gar keine ist.
 */
export function openClippingAncestors(element: HTMLElement): ClipOpening {
  const undos: Array<() => void> = [];
  const undoAll = (): void => {
    for (const undo of undos) undo();
  };

  let node = element.parentElement;
  while (node !== null && node !== document.body && node !== document.documentElement) {
    const style = getComputedStyle(node);

    if (CLIPS.test(style.overflowX)) {
      // `+1` gegen die Rundung, die eine Unterpixel-Höhe sonst als Scrollen
      // ausweist.
      const scrolls = node.scrollHeight > node.clientHeight + 1;
      if (scrolls) return { undo: undoAll, limit: node };

      const target = node;
      const previousX = target.style.overflowX;
      const previousY = target.style.overflowY;
      undos.push(() => {
        target.style.overflowX = previousX;
        target.style.overflowY = previousY;
      });

      target.style.overflowX = "visible";
      // Beide Achsen: `overflow-x: visible` neben einem klemmenden
      // `overflow-y` wird vom Browser stillschweigend zu `auto` zurückgedreht.
      if (CLIPS.test(style.overflowY)) target.style.overflowY = "visible";
    }

    node = node.parentElement;
  }

  return { undo: undoAll, limit: null };
}

/**
 * Misst Kante, Breite und Kopfzeilenhöhe an einem Anker, der selbst **nicht**
 * ausbricht — sonst misst man die eigene Verschiebung mit.
 */
export function measureBleed(anchor: HTMLElement, limit: HTMLElement | null = null): BleedMetrics {
  const rect = anchor.getBoundingClientRect();
  const scroller = document.scrollingElement ?? document.documentElement;

  const headerHeight = rect.top + scroller.scrollTop;
  // `clientWidth` statt `100vw`: die Einheit schließt die Scrollbar ein und
  // erzeugt damit genau den waagerechten Überlauf, den der Ausbruch vermeiden
  // soll.
  const viewport = document.documentElement.clientWidth;

  // Gibt es einen Scroller über der Bühne, ist seine Innenkante die Grenze —
  // weiter hinaus wäre die Bühne nur abgeschnitten. `clientLeft` blendet einen
  // etwaigen Rahmen aus, beide Rechtecke stehen im selben Bezug, ein
  // Scroll-Ausgleich entfällt deshalb.
  const bounded = limit !== null;
  const limitRect = bounded ? limit.getBoundingClientRect() : null;

  return {
    width: bounded ? Math.min(limit.clientWidth, viewport) : viewport,
    pull:
      limitRect !== null && limit !== null
        ? limitRect.left + limit.clientLeft - rect.left
        : -(rect.left + scroller.scrollLeft),
    headerHeight:
      headerHeight >= 0 && headerHeight <= MAX_PLAUSIBLE_HEADER
        ? headerHeight
        : FALLBACK_HEADER_HEIGHT,
  };
}

/**
 * Hält den Ausbruch an einem Anker fest.
 *
 * @param anchor das nicht ausbrechende Element, an dem gemessen wird.
 * @param enabled ob überhaupt ausgebrochen werden soll.
 * @returns die Maße, oder `null` solange (oder falls) kein Ausbruch möglich
 * ist. Erst mit einem Ergebnis darf die Bühne breit werden — vorher wäre sie
 * für einen Bildaufbau lang falsch positioniert.
 */
export function useFullBleed(anchor: HTMLElement | null, enabled: boolean): BleedMetrics | null {
  const [metrics, setMetrics] = useState<BleedMetrics | null>(null);

  useEffect(() => {
    if (anchor === null || !enabled) {
      setMetrics(null);
      return;
    }

    // Erst räumen, dann messen: ein noch clippender Vorfahr verfälscht die
    // Breite nicht, aber ein bereits ausgebrochenes Element täte es.
    const opening = openClippingAncestors(anchor);

    const update = (): void =>
      setMetrics((previous) => {
        const next = measureBleed(anchor, opening.limit);
        // Nichts zu gewinnen: steht die Bühne ohnehin schon so breit wie ihre
        // Grenze, bleibt der Ausbruch aus. Eine Verschiebung nach rechts wäre
        // sonst denkbar, wenn ein Vorfahr schmaler ist als die Bühne selbst.
        if (next.width <= anchor.getBoundingClientRect().width) return null;
        // Nur bei echter Änderung ein neues Objekt: der Beobachter sieht auch
        // die Höhenänderung, die die Bühne selbst auslöst, und ein bei jedem
        // Durchlauf neues Objekt liesse den Rendervorgang unnötig kreisen.
        if (
          previous !== null &&
          previous.pull === next.pull &&
          previous.width === next.width &&
          previous.headerHeight === next.headerHeight
        ) {
          return previous;
        }
        return next;
      });
    update();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update);
      return () => {
        window.removeEventListener("resize", update);
        opening.undo();
      };
    }

    const observer = new ResizeObserver(update);
    observer.observe(document.documentElement);
    observer.observe(anchor);
    return () => {
      observer.disconnect();
      opening.undo();
    };
  }, [anchor, enabled]);

  return metrics;
}
