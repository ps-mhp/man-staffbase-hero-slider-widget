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
   * Der Abstand von der rechten Kante der Inhaltsspalte bis zur rechten Kante
   * der ausgebrochenen Bühne. Links ist es `-pull`. Beides zusammen legt den
   * Text auf die Fluchtlinie der Seite, wie auch immer die Seite sie zieht —
   * klassischer Editor oder Content Designer.
   */
  insetEnd: number;
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
 * Der nächste Vorfahr — auch über die Grenze eines Shadow DOM hinweg.
 *
 * `parentElement` endet am obersten Knoten eines Shadow Roots: dessen Elter
 * ist der Root selbst, und der ist kein Element. Im klassischen Editor fiel
 * das nie auf. Der Content Designer legt die Seite dagegen in einen offenen
 * Shadow Root, und der Baustein steckt zusätzlich im Shadow Root seines
 * `sb-custom-block`. Die Suche nach clippenden Vorfahren endete damit schon
 * innerhalb des Bausteins, und genau die beiden Container, die abschneiden,
 * blieben zu: `div.mb-6.overflow-hidden` um jeden Block und `div.scroller` um
 * die Seite. Die Bühne wurde zwar fensterbreit gerechnet, aber wieder auf die
 * Spaltenbreite zurückgeschnitten — gemessen am 14.10.2026 auf
 * /content/page/6aa12fb54e0ac62265cf06f6: Bühne 1400px breit ab x=0, sichtbar
 * nur 1300px ab x=50.
 */
function parentOf(node: HTMLElement): HTMLElement | null {
  if (node.parentElement !== null) return node.parentElement;
  const root = node.getRootNode();
  // `host` ist bei einem offenen Shadow Root das Element, in dem er hängt;
  // über ihn geht die Suche in der Wirtsseite weiter.
  return root instanceof ShadowRoot && root.host instanceof HTMLElement ? root.host : null;
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

  let node = parentOf(element);
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

    node = parentOf(node);
  }

  return { undo: undoAll, limit: null };
}

/** Der Abschnitt des Content Designers, in dem ein Baustein steckt. */
const SECTION_BLOCK = '[data-c13y-component="section-block"]';

/**
 * Der Abschnitt, in dem die Bühne steckt — oder `null` im klassischen Editor.
 *
 * Die Suche überquert Shadow-Root-Grenzen (`parentOf`) und endet spätestens
 * am `<body>`. Dass es *keinen* Abschnitt gibt, ist kein Sonderfall, sondern
 * der klassische Editor: jeder Aufrufer behandelt diesen Fall ausdrücklich,
 * statt auf gut Glück zu greifen.
 */
export function findSection(element: HTMLElement): HTMLElement | null {
  let node: HTMLElement | null = parentOf(element);
  while (node !== null && node !== document.body && node !== document.documentElement) {
    if (node.matches(SECTION_BLOCK)) return node;
    node = parentOf(node);
  }
  return null;
}

/**
 * Nimmt dem Abschnitt des Content Designers seinen senkrechten Innenabstand.
 *
 * Der Content Designer legt jeden Abschnitt in ein `div` mit eigenem Padding
 * — im neuen Editor stammt es aus den Abschnittseinstellungen und steht auf
 * allen vier Seiten. Waagerecht ist das folgenlos, weil der Ausbruch ohnehin
 * gemessen und nicht gerechnet wird. Senkrecht nicht: über und unter einer
 * Bühne, die bis an den Bildschirmrand läuft, bleibt ein Streifen Weissraum
 * stehen, den es in der Vorlage nicht gibt. Die Bühne schliesst oben an die
 * Kopfzeile und unten an den Folgeinhalt an — den Abstand nach unten setzt
 * sie selbst (`.man-hero-host`).
 *
 * Angefasst wird nur das erste Kind des Abschnitts, also genau der Container,
 * der das Padding trägt, und nur die beiden senkrechten Seiten. Alles andere
 * — Rand, Hintergrund, waagerechter Abstand — bleibt, wie der Abschnitt es
 * vorsieht. Steckt die Bühne in keinem Abschnitt (klassischer Editor), fällt
 * der Eingriff aus.
 *
 * @returns nimmt den Eingriff zurück; das Widget wird in fremde Seiten
 * eingebettet und darf beim Verschwinden nichts zurücklassen.
 */
export function openSectionPadding(element: HTMLElement): () => void {
  const section = findSection(element);
  const padded = section?.firstElementChild ?? null;
  if (!(padded instanceof HTMLElement)) return () => undefined;

  const previousTop = padded.style.paddingTop;
  const previousBottom = padded.style.paddingBottom;

  padded.style.paddingTop = "0px";
  padded.style.paddingBottom = "0px";

  return () => {
    padded.style.paddingTop = previousTop;
    padded.style.paddingBottom = previousBottom;
  };
}

/** Die Eigenschaften, die `stretchToSection` anfasst. */
type FillProperty =
  | "margin-top"
  | "margin-bottom"
  | "padding-top"
  | "padding-bottom"
  | "height"
  | "display";

/**
 * Lässt die Bühne die Höhe ihres Abschnitts einnehmen.
 *
 * Gemessen am 15.10.2026 auf /content/page/6ad091f099aab81970383823: der
 * Abschnitt war 682px hoch, die Bühne 594px. Die fehlenden 88px lagen
 * sämtlich **unter** ihr; oben schloss sie dank `openSectionPadding` bereits
 * bündig an. Sie stammten aus Abständen, die der neue Editor zwischen Bühne
 * und Abschnittskante stapelt — 32px eigene Luft der Bühne, 32px `mb-6` des
 * Containers, 24px Innenabstand des Abschnitts. Eine freie Fläche, in die
 * die Bühne wachsen könnte, gab es also gar nicht: der Abschnitt stand auf
 * Inhaltshöhe, und der „ungenutzte" Rest war Abstand.
 *
 * Deshalb zwei Eingriffe statt einem:
 *
 * 1. Die senkrechten Abstände auf dem Weg vom Baustein bis zum Abschnitt
 *    fallen — damit schliesst die Bühne unten so bündig ab wie oben.
 * 2. Jeder Vorfahr bekommt `height: 100%`. Steht der Abschnitt auf
 *    Inhaltshöhe, löst sich das mangels fester Elternhöhe zu `auto` auf und
 *    ändert nichts; hat er eine eingestellte Höhe oder eine höhere
 *    Nachbarspalte, reicht die Kette diese Höhe bis zur Bühne durch. Dasselbe
 *    CSS trägt beide Fälle, ohne dass das Widget sie unterscheiden müsste.
 *
 * `!important` ist hier nicht Bequemlichkeit, sondern gemessen: ohne
 * Nachdruck blieben von den 88px genau 56 stehen — der Editor führt `mb-6`
 * am Container und den Innenabstand des Abschnitts selbst mit `!important`,
 * und ein gewöhnlicher Inline-Wert verliert dagegen. Mit Nachdruck ist die
 * Lücke oben wie unten 0 (am selben Tag auf derselben Seite nachgestellt).
 *
 * Angefasst wird nur die Ahnenkette der Bühne, nicht der übrige Abschnitt.
 * Die Stufe ist ausdrücklich zu wählen; steht noch etwas anderes im selben
 * Abschnitt, rückt es durch die entfallenden Abstände näher an die Bühne —
 * das ist die Bedeutung von „Abschnittshöhe" und kein Versehen.
 *
 * Der senkrechte Innenabstand des Abschnitts **selbst** fällt hier, nicht in
 * `openSectionPadding`: dort geht es um den Polster-`div` darin, und das sind
 * zwei verschiedene Elemente mit zwei verschiedenen Werten (gemessen 40px im
 * `div`, 24px am Abschnitt).
 *
 * @returns nimmt alle Eingriffe zurück.
 */
export function stretchToSection(element: HTMLElement): () => void {
  const undos: Array<() => void> = [];
  const force = (node: HTMLElement, property: FillProperty, value: string): void => {
    const previousValue = node.style.getPropertyValue(property);
    const previousPriority = node.style.getPropertyPriority(property);
    undos.push(() => {
      // Ein leerer Wert heisst „stand nicht inline" — dann muss die
      // Eigenschaft ganz verschwinden, nicht auf `""` stehen bleiben.
      if (previousValue === "") node.style.removeProperty(property);
      else node.style.setProperty(property, previousValue, previousPriority);
    });
    node.style.setProperty(property, value, "important");
  };

  // Erst sammeln, dann setzen: ohne Abschnitt am Ende der Kette bleibt alles
  // unangetastet, statt auf halbem Weg Spuren zu hinterlassen.
  const section = findSection(element);
  if (section === null) return () => undefined;

  const chain: HTMLElement[] = [];
  let node: HTMLElement | null = parentOf(element);
  while (node !== null && node !== section) {
    chain.push(node);
    node = parentOf(node);
  }

  for (const ancestor of chain) {
    force(ancestor, "margin-top", "0px");
    force(ancestor, "margin-bottom", "0px");
    force(ancestor, "height", "100%");
    // `sb-custom-block` ist ein unbekanntes Element und damit `inline`; eine
    // Höhe greift daran nicht. Gemessen am 15.10.2026: `display: inline` bei
    // 594px Rechteckhöhe — die Höhe stammte ausschliesslich vom Inhalt.
    if (getComputedStyle(ancestor).display === "inline") force(ancestor, "display", "block");
  }

  // Der Abschnitt gibt die Höhe vor, er nimmt sie nicht entgegen: angefasst
  // wird nur sein eigener senkrechter Innenabstand.
  force(section, "padding-top", "0px");
  force(section, "padding-bottom", "0px");

  return () => {
    for (const undo of undos) undo();
  };
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

  const width = bounded ? Math.min(limit.clientWidth, viewport) : viewport;
  const pull =
    limitRect !== null && limit !== null
      ? limitRect.left + limit.clientLeft - rect.left
      : -(rect.left + scroller.scrollLeft);

  return {
    width,
    pull,
    insetEnd: Math.max(0, width + pull - rect.width),
    headerHeight:
      headerHeight >= 0 && headerHeight <= MAX_PLAUSIBLE_HEADER
        ? headerHeight
        : FALLBACK_HEADER_HEIGHT,
  };
}

/** Was `useFullBleed` über die Lage der Bühne weiss. */
export interface BleedState {
  /**
   * Die Maße, oder `null` solange (oder falls) kein Ausbruch möglich ist.
   * Erst mit einem Ergebnis darf die Bühne breit werden — vorher wäre sie
   * für einen Bildaufbau lang falsch positioniert.
   */
  metrics: BleedMetrics | null;
  /**
   * Ob die Bühne tatsächlich in einem Abschnitt des neuen Editors steckt und
   * dessen Höhe einnimmt. Im klassischen Editor nie — die Höhenstufe
   * „Abschnittshöhe" fällt dort auf die Vorgabestufe zurück, statt sich an
   * einem Abschnitt auszurichten, den es nicht gibt.
   */
  filled: boolean;
}

/**
 * Hält den Ausbruch an einem Anker fest.
 *
 * @param anchor das nicht ausbrechende Element, an dem gemessen wird.
 * @param enabled ob überhaupt ausgebrochen werden soll.
 * @param fill ob die Bühne die Höhe ihres Abschnitts einnehmen soll
 * (Höhenstufe „Abschnittshöhe"). Unabhängig vom Ausbruch, aber im selben
 * Effekt: beide räumen an derselben Ahnenkette, und zwei Effekte nähmen sich
 * gegenseitig die gemerkten Vorzustände ab.
 */
export function useFullBleed(
  anchor: HTMLElement | null,
  enabled: boolean,
  fill = false,
): BleedState {
  const [metrics, setMetrics] = useState<BleedMetrics | null>(null);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    if (anchor === null || (!enabled && !fill)) {
      setMetrics(null);
      setFilled(false);
      return;
    }

    // Erst räumen, dann messen: ein noch clippender Vorfahr verfälscht die
    // Breite nicht, aber ein bereits ausgebrochenes Element täte es. Das
    // Padding des Abschnitts fällt vor der Messung, weil es die gemessene
    // Kopfzeilenhöhe sonst um seinen eigenen Wert zu gross ausweist.
    const opening = enabled
      ? openClippingAncestors(anchor)
      : { undo: (): void => undefined, limit: null };
    const closePadding = openSectionPadding(anchor);
    const collapse = fill ? stretchToSection(anchor) : (): void => undefined;

    // Nicht der Wunsch zählt, sondern der Befund: ohne Abschnitt hat
    // `stretchToSection` nichts angefasst, und die Bühne muss sich wie die
    // Vorgabestufe verhalten.
    setFilled(fill && findSection(anchor) !== null);

    // Rücknahme in umgekehrter Reihenfolge des Eingriffs.
    const undoAll = (): void => {
      collapse();
      closePadding();
      opening.undo();
    };

    // Ohne Ausbruch gibt es nichts zu messen; die Höhe steht trotzdem schon.
    if (!enabled) {
      setMetrics(null);
      return undoAll;
    }

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
          previous.insetEnd === next.insetEnd &&
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
        undoAll();
      };
    }

    const observer = new ResizeObserver(update);
    observer.observe(document.documentElement);
    observer.observe(anchor);
    return () => {
      observer.disconnect();
      undoAll();
    };
  }, [anchor, enabled, fill]);

  return { metrics, filled };
}
