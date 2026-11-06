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

import { useEffect, useRef } from "react";

import { HeroPosition } from "./attributes";

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
 * Der äusserste Kasten zwischen `element` und `wrapper`, der aus dem Fluss
 * genommen ist — oder `null`, wenn keiner es ist.
 *
 * Der Unterschied entscheidet, was gemessen und was geschrieben werden darf.
 * Stehen die Brotkrumen im Fluss, schieben sie den Inhalt selbst — dann ist
 * ihre Unterkante eine Folge des Kopfabstands, und sie zu messen hiesse, den
 * eigenen Eingriff zu messen; ein geschriebenes `top` bliebe ausserdem
 * folgenlos. Liegen sie darüber, schiebt sie niemand, und der äusserste
 * Kasten ist der, der das `top` von Staffbase trägt.
 */
function outOfFlowBox(element: HTMLElement, wrapper: HTMLElement): HTMLElement | null {
  let node: HTMLElement | null = element;
  let found: HTMLElement | null = null;
  while (node !== null && node !== wrapper) {
    const { position } = getComputedStyle(node);
    if (position === "absolute" || position === "fixed") found = node;
    node = node.parentElement;
  }
  return found;
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
 * @param position `post` setzt den Inhalt unter die Brotkrumen (die Vorgabe),
 * `pre` bündig unter die festen Leisten — dort rücken die Brotkrumen unter die
 * Bühne, und ihre Unterkante ist nicht mehr der Anfang des Inhalts.
 * @returns den Wert in CSS-Pixeln, oder `null`, wenn nichts Verlässliches zu
 * messen war — dann bleibt der Abstand von Staffbase unangetastet. Ein
 * geratener Wert wäre schlechter als der fremde.
 */
export function measurePageTop(
  doc: Document = document,
  position: HeroPosition = "post",
): number | null {
  const wrapper = doc.querySelector<HTMLElement>(WRAPPER_SELECTOR);
  if (wrapper === null) return null;

  const scroller = doc.scrollingElement ?? doc.documentElement;
  // Der Bezugspunkt ist die Oberkante des Rahmens selbst; sein Innenabstand
  // ändert sie nicht, deshalb misst sich der Eingriff hier nicht selbst.
  const wrapperTop = wrapper.getBoundingClientRect().top + scroller.scrollTop;

  const crumbs = doc.querySelector<HTMLElement>(BREADCRUMBS_SELECTOR);
  const underCrumbs =
    position === "post" &&
    crumbs !== null &&
    isVisible(crumbs) &&
    outOfFlowBox(crumbs, wrapper) !== null;

  const edge = underCrumbs
    ? (crumbs as HTMLElement).getBoundingClientRect().bottom + scroller.scrollTop
    : // Feste Leisten stehen im Fenster, nicht im Dokument: ihre Unterkante
      // ist bereits der Abstand vom Seitenanfang und darf nicht noch einmal
      // um den Bildlauf verschoben werden.
      chromeBottom(doc);

  if (edge === null) return null;

  const top = edge - wrapperTop;
  // Bündig heisst bündig: der Abstand zwischen Kante und Bühne ist 0, die Luft
  // darunter setzt die Bühne selbst (`.man-hero-host`).
  if (top < 0 || top > MAX_PLAUSIBLE_TOP) return null;
  return top;
}

/**
 * Ob die Lage vor den Brotkrumen auf dieser Seite überhaupt zustande kommt.
 *
 * Verlangt wird alles, was der Eingriff braucht: ein Seitenrahmen, messbare
 * feste Leisten, ein Brotkrumen-Kasten aus dem Fluss (nur der trägt das `top`,
 * das verschoben werden kann) und eine Bühne, die oben auf der Seite steht.
 * Die Brotkrumen unter eine Bühne zu schieben, über der schon Inhalt steht,
 * ergäbe eine Zeile mitten auf der Seite.
 *
 * Trifft eines davon nicht zu, ist das kein Fehler, sondern eine Seite, auf
 * die die Einstellung nicht passt: der Aufrufer fällt still auf `post` zurück.
 */
export function canPlacePreBreadcrumbs(
  doc: Document = document,
  host: HTMLElement | null = null,
): boolean {
  // Eine abgehängte Bühne — oder eine unter einem ausgeblendeten Vorfahren,
  // oder eine vor dem ersten Bildaufbau — liefert ein leeres Rechteck. Das
  // läge rechnerisch ganz oben auf der Seite und ginge sonst als „anwendbar"
  // durch: die Brotkrumen landeten hinter den festen Leisten.
  if (host === null || !host.isConnected) return false;
  if (host.getBoundingClientRect().height <= 0) return false;

  const wrapper = doc.querySelector<HTMLElement>(WRAPPER_SELECTOR);
  if (wrapper === null) return false;

  const crumbs = doc.querySelector<HTMLElement>(BREADCRUMBS_SELECTOR);
  if (crumbs === null || !isVisible(crumbs)) return false;
  if (outOfFlowBox(crumbs, wrapper) === null) return false;
  if (measurePageTop(doc, "pre") === null) return false;

  const scroller = doc.scrollingElement ?? doc.documentElement;
  const wrapperTop = wrapper.getBoundingClientRect().top + scroller.scrollTop;
  const hostTop = host.getBoundingClientRect().top + scroller.scrollTop;
  return hostTop - wrapperTop <= MAX_PLAUSIBLE_TOP;
}

/** Was von einer Stileigenschaft vor dem Eingriff da war. */
interface SavedPadding {
  element: HTMLElement;
  property: string;
  value: string;
  priority: string;
}

/** Was die Bühne über das Ergebnis der Messung wissen muss. */
export interface PageTopLayout {
  /**
   * Ob die Lage `pre` für **diese** Bühne zustande kam. `false` heisst, dass
   * es für sie bei der Lage unter den Brotkrumen bleibt — entweder weil `pre`
   * auf dieser Seite nicht anwendbar ist, oder weil eine früher angemeldete
   * Bühne den Kopfabstand führt und diese ihm nur folgt.
   *
   * Eine Bühne in `post` sieht `false` nie: sie hat die Lage bekommen, die
   * sie wollte. `applied` heisst damit überall dasselbe — `pre` angefordert
   * und nicht bekommen — und taugt für sich allein als Anlass für den
   * Hinweis im Editor.
   */
  applied: boolean;
  /**
   * Die Höhe des verschobenen Brotkrumen-Kastens in CSS-Pixeln, die die Bühne
   * unter sich freihalten muss. `0`, solange nichts verschoben ist.
   */
  breadcrumbsHeight: number;
}

/** Womit sich eine Bühne den Kopfabstand holt. */
export interface PageTopOptions {
  /** Die Lage zu den Brotkrumen; Vorgabe ist darunter. */
  position?: HeroPosition;
  /** Die Bühne selbst; im Modus `pre` trägt ihre Unterkante die Brotkrumen. */
  host?: HTMLElement | null;
  /** Wird nach jeder Messung gerufen. */
  onLayout?: (layout: PageTopLayout) => void;
}

/**
 * Die angemeldeten Bühnen, in der Reihenfolge ihrer Anmeldung.
 *
 * Zwei Bühnen auf einer Seite setzen denselben Wert; die erste, die geht,
 * darf ihn deshalb nicht zurücknehmen, solange die zweite noch steht. Gemerkt
 * wird nicht nur die Anzahl, sondern wer was angemeldet hat: sonst überlebten
 * Modus und Bühne ihren Halter, und die Messung bezöge sich auf einen Kasten,
 * den es auf der Seite nicht mehr gibt.
 */
interface Holder {
  position: HeroPosition;
  host: HTMLElement | null;
  /** Wer über das Ergebnis jeder Messung unterrichtet werden will. */
  onLayout?: (layout: PageTopLayout) => void;
}

const holders: Holder[] = [];
let saved: SavedPadding | null = null;
/** Der Vorzustand des Brotkrumen-Kastens, solange er verschoben ist. */
let savedCrumbs: SavedPadding | null = null;
/** Der Modus, den der erste noch stehende Halter angemeldet hat. */
let mode: HeroPosition = "post";
/** Die Bühne des ersten noch stehenden Halters; sie trägt die Brotkrumen. */
let anchorHost: HTMLElement | null = null;
let resizeObserver: ResizeObserver | null = null;
let mutationObserver: MutationObserver | null = null;
let frame: number | null = null;
/**
 * Die angemeldete Messung — modulweit, nicht je Aufrufer: beim Abmelden des
 * Zuhörers muss dieselbe Funktion übergeben werden, die angemeldet wurde,
 * und das ist nicht zwingend die des letzten Halters.
 */
let scheduled: (() => void) | null = null;

function restoreSaved(entry: SavedPadding | null): void {
  if (entry === null) return;
  const { element, property, value, priority } = entry;
  // Ein leerer Wert heisst „stand nicht inline" — dann muss die Eigenschaft
  // ganz verschwinden, nicht auf `""` stehen bleiben.
  if (value === "") element.style.removeProperty(property);
  else element.style.setProperty(property, value, priority);
}

function restore(): void {
  restoreSaved(saved);
  saved = null;
  restoreSaved(savedCrumbs);
  savedCrumbs = null;
}

/**
 * Schiebt den Brotkrumen-Kasten unter die Bühne.
 *
 * Bezug des Kastens ist die Polsterkante des `#wrapper` — sie liegt vor dem
 * Innenabstand und bleibt von unserem Eingriff unberührt. Die Unterkante der
 * Bühne hängt umgekehrt nicht vom `top` des Kastens ab, weil der aus dem Fluss
 * genommen ist. Die Messkette ist damit azyklisch und kann sich nicht selbst
 * hochschaukeln.
 *
 * @returns die Höhe des Kastens, die die Bühne unter sich freihalten muss.
 */
function placeBreadcrumbs(doc: Document, wrapper: HTMLElement, host: HTMLElement): number {
  const crumbs = doc.querySelector<HTMLElement>(BREADCRUMBS_SELECTOR);
  if (crumbs === null) return 0;
  const box = outOfFlowBox(crumbs, wrapper);
  if (box === null) return 0;

  const scroller = doc.scrollingElement ?? doc.documentElement;
  const wrapperTop = wrapper.getBoundingClientRect().top + scroller.scrollTop;
  const hostBottom = host.getBoundingClientRect().bottom + scroller.scrollTop;

  // Die Einzelseitenanwendung tauscht den Kasten beim Seitenwechsel aus.
  // Merkte man sich weiter den alten, bekäme der neue unser `!important` und
  // behielte es für immer — auf einer Seite, die uns nicht gehört.
  if (savedCrumbs !== null && savedCrumbs.element !== box) {
    restoreSaved(savedCrumbs);
    savedCrumbs = null;
  }

  savedCrumbs ??= {
    element: box,
    property: "top",
    value: box.style.getPropertyValue("top"),
    priority: box.style.getPropertyPriority("top"),
  };

  // Angenommen wird, dass der Bezug des Kastens die Polsterkante des
  // `#wrapper` ist und der Kasten selbst keinen Aussenabstand hat. Das trifft
  // auf die bekannten Varianten zu, aber nicht auf alle ausgelieferten:
  // `resources/css/app.css` führt für
  // `#wrapper#wrapper.is-content-document-page div:has(#breadcrumbs)` ein
  // `margin-top: -3%`, und ein eigener Aussenabstand des Kastens verschiebt
  // ihn gegenüber jedem `top`, das wir schreiben — hier um 3% der Breite des
  // Bezugsrahmens. Ebenso versetzt ihn ein näherer positionierter Vorfahre,
  // der dann den Bezug stellt. (Der Aussenabstand des `#wrapper` ist dagegen
  // unschädlich: `getBoundingClientRect().top` zählt ihn ohnehin nicht mit.)
  // Bekannte Lücke, hier bewusst nicht behoben.
  box.style.setProperty("top", `${hostBottom - wrapperTop}px`, "important");
  return box.getBoundingClientRect().height;
}

/**
 * Unterrichtet die Halter über das Ergebnis einer Messung.
 *
 * Gemessen und geschrieben wird einmal je Seite, und zwar für den ersten
 * Halter: er führt Modus und Bühne. `breadcrumbsHeight` ist aber der Platz,
 * den **die jeweilige** Bühne unter sich freihalten muss — die Brotkrumen
 * liegen nur unter der ersten. Jede weitere hielte sonst einen Streifen
 * Weissraum frei, hinter dem nichts steht.
 */
function notify(layout: PageTopLayout): void {
  for (const [index, holder] of holders.entries()) {
    if (index === 0) {
      holder.onLayout?.(layout);
      continue;
    }
    // Dieselbe Regel wie bei einer Messung, die nichts ergibt: ein Rückfall
    // ist es nur für `pre`. Wer `post` wollte, bekommt `post` — ob er den
    // Kopfabstand führt oder einer früheren Bühne folgt, ändert daran nichts.
    holder.onLayout?.({ applied: holder.position !== "pre", breadcrumbsHeight: 0 });
  }
}

function write(doc: Document): void {
  const wrapper = doc.querySelector<HTMLElement>(WRAPPER_SELECTOR);
  if (wrapper === null) {
    // Dieselbe Regel wie bei einer Messung, die nichts ergibt: ohne
    // Seitenrahmen greift der Eingriff nirgends, und eine Bühne in `pre`
    // bekommt ihre Lage nicht. Schwiege es hier, bliebe sie bei ihrer
    // Anfangsannahme — und im Editor käme kein Hinweis, ausgerechnet auf
    // der Seite, auf der `pre` gar nicht gehen kann.
    notify({ applied: mode !== "pre", breadcrumbsHeight: 0 });
    return;
  }

  const applied = mode === "pre" ? canPlacePreBreadcrumbs(doc, anchorHost) : true;

  // Zuerst zurückstellen, dann messen. Fiel die Lage weg, während der Kasten
  // noch verschoben ist, läse eine Messung in `post` die Kante, die dieser
  // Eingriff selbst gesetzt hat — unter einer Bühne liegt sie weit über
  // `MAX_PLAUSIBLE_TOP`, die Messung verwürfe sich, und der Kasten bliebe
  // mitten auf der Seite stehen, ohne dass ein späterer Durchlauf daran noch
  // etwas änderte.
  if (!applied || mode !== "pre") {
    restoreSaved(savedCrumbs);
    savedCrumbs = null;
  }

  const top = measurePageTop(doc, applied ? mode : "post");
  if (top === null) {
    // Auch ohne Eingriff müssen die Halter es erfahren: eine Bühne, die
    // weiter Platz für Brotkrumen freihält, die längst zurückgerückt sind,
    // hinterliesse eine Lücke. Ein Rückfall ist das aber nur für `pre` — wer
    // `post` angemeldet hat, bekommt genau die Lage, die er wollte.
    notify({ applied: mode !== "pre", breadcrumbsHeight: 0 });
    return;
  }

  // Die Einzelseitenanwendung tauscht auch den Rahmen beim Seitenwechsel aus.
  // Merkte man sich weiter den alten, bekäme der neue unser `!important`,
  // während `restore()` es dem abgehängten alten abnimmt — und behielte es
  // für immer, auf einer Seite, die uns nicht gehört.
  if (saved !== null && saved.element !== wrapper) {
    restoreSaved(saved);
    saved = null;
  }

  // Der Vorzustand wird beim ersten Schreiben gemerkt, nicht bei jedem —
  // sonst merkte sich der zweite Durchlauf unseren eigenen Wert.
  saved ??= {
    element: wrapper,
    property: "padding-top",
    value: wrapper.style.getPropertyValue("padding-top"),
    priority: wrapper.style.getPropertyPriority("padding-top"),
  };

  // `!important` ist nötig und unstrittig: der Gegner steht bei vier Klassen
  // und einer Kennung, führt seinen Wert aber ohne Nachdruck.
  wrapper.style.setProperty("padding-top", `${top}px`, "important");

  let breadcrumbsHeight = 0;
  if (applied && mode === "pre" && anchorHost !== null) {
    breadcrumbsHeight = placeBreadcrumbs(doc, wrapper, anchorHost);
  }

  notify({ applied, breadcrumbsHeight });
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
 * Stehen zwei Bühnen auf einer Seite, gilt der Modus der ersten: der
 * Kopfabstand der Seite gibt es nur einmal, und zwei einander widersprechende
 * Ansagen liessen sich nicht beide erfüllen. Die zweite erfährt das über
 * `onLayout`.
 *
 * @returns gibt den Kopfabstand wieder frei; der letzte Halter stellt den
 * Zustand der Wirtsseite wieder her.
 */
export function holdPageTop(doc: Document = document, options: PageTopOptions = {}): () => void {
  const { position = "post", host = null, onLayout } = options;

  const entry: Holder = { position, host, onLayout };
  holders.push(entry);
  if (holders.length === 1) {
    mode = position;
    anchorHost = host;
  }
  write(doc);

  const view = doc.defaultView;
  if (holders.length === 1 && view !== null) {
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
      // Die Unterkante der Bühne wandert mit ihrer Höhe; im Modus `pre` hängen
      // die Brotkrumen daran.
      if (host !== null) resizeObserver.observe(host);
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
    const index = holders.indexOf(entry);
    if (index !== -1) holders.splice(index, 1);
    const previous = anchorHost;
    if (holders.length > 0) {
      // Modus und Bühne gehören dem Halter, der sie angemeldet hat. Geht er,
      // gilt der nächste noch stehende — sonst zeigte `anchorHost` auf einen
      // abgehängten Kasten, und die verbliebene Bühne richtete sich nach
      // einer Lage, die niemand mehr angemeldet hat.
      const next = holders[0];
      mode = next.position;
      anchorHost = next.host;
      // Beobachtet wurde bisher die Bühne des gegangenen Halters. Bliebe es
      // dabei, fiele jede Höhenänderung der nachgerückten unbemerkt durch —
      // eine spät geladene Schrift, ein Bild, ein Übergang —, und die
      // Brotkrumen hingen bis zum nächsten Umbau an der alten Kante.
      if (resizeObserver !== null && previous !== anchorHost) {
        if (previous !== null) resizeObserver.unobserve(previous);
        if (anchorHost !== null) resizeObserver.observe(anchorHost);
      }
      write(doc);
      return;
    }

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
    mode = "post";
    anchorHost = null;
    restore();
  };
}

/** {@link holdPageTop} an der Lebensdauer einer Komponente. */
export function usePageTop(options: PageTopOptions = {}): void {
  const { position = "post", host = null, onLayout } = options;
  // Der natürliche Aufrufer übergibt eine frisch erzeugte Funktion. Hinge der
  // Effekt an ihr, risse jeder Bildaufbau den Halter ab und baute ihn neu
  // auf: Abstand und Brotkrumen zurückgestellt, Beobachter getrennt, alles
  // wieder gesetzt — ein Flackern je Bildaufbau.
  const latest = useRef(onLayout);
  useEffect(() => {
    latest.current = onLayout;
  }, [onLayout]);

  useEffect(
    () =>
      holdPageTop(document, {
        position,
        host,
        onLayout: (layout) => latest.current?.(layout),
      }),
    [position, host],
  );
}
