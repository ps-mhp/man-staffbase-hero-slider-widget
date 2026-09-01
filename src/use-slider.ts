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
 * Der Zustand der Bühne: welcher Slide vorn liegt und wann von selbst
 * weitergeschaltet wird.
 *
 * Bewusst ohne Swiper. Die Bibliothek löst ein Dutzend Layout-Modi, von denen
 * die Bühne genau einen braucht — Überblenden —, und die Bundles landen in
 * fremden Seiten, wo jedes Kilobyte fremder Code ist, den niemand angefordert
 * hat. Was hier bleibt, ist ein Index, ein Timer und die Regeln, wann er ruht.
 *
 * Der Haken kennt kein DOM: er bekommt die Anzahl der Slides und gibt Zustand
 * und Handlungen zurück. Das Anbinden von Zeigern und Tasten ist Sache der
 * Komponente — und dieser Haken dadurch ohne Renderer prüfbar.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/** Vorgabe nach dem Vorbild: `<man-stage delay="5000">` auf man.eu. */
export const DEFAULT_AUTOPLAY_DELAY_MS = 5000;

/**
 * Unterhalb dieser Strecke ist eine Berührung ein Tippen und kein Wischen.
 * Ohne die Schwelle würde jeder Fingerdruck auf die Schaltfläche die Bühne
 * verschieben.
 */
export const SWIPE_THRESHOLD_PX = 40;

export interface UseSliderOptions {
  /** Anzahl der Slides. Bei 0 oder 1 ruht der Automat vollständig. */
  count: number;
  /** Millisekunden je Slide; `0` schaltet das Weiterlaufen ab. */
  delayMs?: number;
}

export interface SliderState {
  index: number;
  /** Läuft der Timer gerade? Steuert `aria-live` und die Beschriftung der Pause. */
  playing: boolean;
  goTo: (next: number) => void;
  next: () => void;
  previous: () => void;
  /** Hält den Timer an, solange ein Zeiger oder der Fokus im Widget ist. */
  setPaused: (paused: boolean) => void;
  /** Beendet das Weiterlaufen dauerhaft — für die Pause-Schaltfläche. */
  stop: () => void;
  /** Meldet eine Wischgeste; gibt zurück, ob sie als solche gewertet wurde. */
  swipe: (deltaX: number) => boolean;
}

/**
 * Ob die Umgebung um weniger Bewegung bittet.
 *
 * `matchMedia` fehlt in älteren Testumgebungen und in manchen eingebetteten
 * Browsern; fehlt es, wird die Frage mit „nein" beantwortet, statt zu werfen.
 */
function prefersReducedMotion(): boolean {
  return globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}

export function useSlider({ count, delayMs = DEFAULT_AUTOPLAY_DELAY_MS }: UseSliderOptions): SliderState {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);

  // Die Einstellung kann sich zur Laufzeit ändern (Systemeinstellung, DevTools).
  useEffect(() => {
    const query = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!query) return;
    const onChange = (): void => setReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // Verschwinden Slides (der Editor löscht einen), darf der Index nicht ins
  // Leere zeigen — sonst rendert die Bühne `undefined`.
  useEffect(() => {
    setIndex((current) => (count === 0 ? 0 : Math.min(current, count - 1)));
  }, [count]);

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      // Umlauf in beide Richtungen; der zweite Modulo fängt negative Werte.
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const previous = useCallback(() => goTo(index - 1), [goTo, index]);

  // Ein einzelner Slide hat kein „weiter"; ohne Verzögerung ist Autoplay
  // ausgeschaltet, und wer weniger Bewegung möchte, bekommt keine.
  const playing = count > 1 && delayMs > 0 && !paused && !stopped && !reducedMotion;

  // `index` steht absichtlich in den Abhängigkeiten: jeder Wechsel — auch ein
  // von Hand ausgelöster — setzt die Wartezeit neu auf. Sonst spränge die
  // Bühne unmittelbar nach einem Klick noch einmal weiter.
  const nextRef = useRef(next);
  nextRef.current = next;
  useEffect(() => {
    if (!playing) return;
    const handle = setTimeout(() => nextRef.current(), delayMs);
    return () => clearTimeout(handle);
  }, [playing, delayMs, index]);

  const swipe = useCallback(
    (deltaX: number): boolean => {
      if (count < 2 || Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return false;
      // Nach links wischen heißt vorwärts — der Inhalt folgt dem Finger.
      goTo(index + (deltaX < 0 ? 1 : -1));
      return true;
    },
    [count, goTo, index],
  );

  const stop = useCallback(() => setStopped(true), []);

  return useMemo(
    () => ({ index, playing, goTo, next, previous, setPaused, stop, swipe }),
    [index, playing, goTo, next, previous, stop, swipe],
  );
}
