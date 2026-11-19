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
 * Die Hintergrund-Animation einer Folie als `<canvas>`.
 *
 * Die Leinwand füllt das Medienfeld der Bühne (wie Bild und Video) und
 * zeichnet in dessen tatsächlicher Größe — es wird nichts beschnitten.
 * Gezeichnet wird nur, solange es etwas zu sehen gibt: die Folie vorn ist
 * (`play`), die Bühne im Bild liegt und der Tab nicht im Hintergrund. Sonst
 * steht das letzte Bild still; ohne `play` (weniger Bewegung, verborgene
 * Folie) ein festes Standbild.
 */

import * as React from "react";
import { ReactElement, useEffect, useRef } from "react";
import { ANIMATION_PERIOD, SlideAnimation } from "./slide-animation";
import { STILL_TIME_RATIO, drawAnimation } from "./slide-animation-patterns";

/** Mehr Bildpunkte als doppelte Dichte sieht niemand, kosten aber Zeit je Bild. */
const MAX_PIXEL_RATIO = 2;

/**
 * Braucht ein Bild im Mittel länger (ms), zeichnet die Animation nur jedes
 * zweite — 30 statt 60 Bilder je Sekunde, aber ohne Ruckeln durch verpasste
 * Bilder. Die Zeit läuft trotzdem nach der Uhr weiter.
 */
const SLOW_FRAME_MS = 9;

export interface SlideAnimationCanvasProps {
  animation: SlideAnimation;
  play: boolean;
}

interface Clock {
  /** Gezeigte Zeit in Sekunden; läuft nur, solange gespielt wird. */
  elapsed: number;
  last: number | null;
  /** Gleitender Mittelwert der Zeichenzeit je Bild. */
  cost: number;
  frame: number;
}

/** Sichtbar im Fenster und Tab im Vordergrund. */
function useVisibility(ref: React.RefObject<HTMLElement | null>, onChange: (visible: boolean) => void): void {
  useEffect(() => {
    const element = ref.current;
    if (element === null) return undefined;
    let inView = true;
    const report = (): void => onChange(inView && document.visibilityState !== "hidden");
    const observer =
      typeof IntersectionObserver === "function"
        ? new IntersectionObserver((entries) => {
            inView = entries.some((entry) => entry.isIntersecting);
            report();
          })
        : null;
    observer?.observe(element);
    document.addEventListener("visibilitychange", report);
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", report);
    };
  }, [ref, onChange]);
}

export function SlideAnimationCanvas({ animation, play }: SlideAnimationCanvasProps): ReactElement {
  const ref = useRef<HTMLCanvasElement>(null);
  const clock = useRef<Clock>({ elapsed: ANIMATION_PERIOD[animation.speed] * STILL_TIME_RATIO, last: null, cost: 0, frame: 0 });
  const visible = useRef(true);
  const frame = useRef<number | null>(null);
  const settings = useRef(animation);
  settings.current = animation;

  const paint = React.useCallback((): void => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    drawAnimation(context, canvas.width, canvas.height, settings.current, clock.current.elapsed);
  }, []);

  const loop = React.useCallback(
    (now: number): void => {
      const state = clock.current;
      state.elapsed = (state.elapsed + (state.last === null ? 0 : (now - state.last) / 1000)) % ANIMATION_PERIOD[settings.current.speed];
      state.last = now;
      state.frame += 1;
      if (state.cost <= SLOW_FRAME_MS || state.frame % 2 === 0) {
        const started = performance.now();
        paint();
        state.cost = state.cost * 0.9 + (performance.now() - started) * 0.1;
      }
      frame.current = requestAnimationFrame(loop);
    },
    [paint],
  );

  const stop = React.useCallback((): void => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    clock.current.last = null;
  }, []);

  const sync = React.useCallback(
    (shouldRun: boolean): void => {
      if (shouldRun && frame.current === null && typeof requestAnimationFrame === "function") {
        frame.current = requestAnimationFrame(loop);
      } else if (!shouldRun) {
        stop();
      }
    },
    [loop, stop],
  );

  // Größe: die Leinwand in Gerätepixeln so groß wie ihr Feld.
  useEffect(() => {
    const canvas = ref.current;
    if (canvas === null) return undefined;
    const resize = (): void => {
      const ratio = Math.min(globalThis.devicePixelRatio || 1, MAX_PIXEL_RATIO);
      const width = Math.round(canvas.clientWidth * ratio);
      const height = Math.round(canvas.clientHeight * ratio);
      if (width === canvas.width && height === canvas.height) return;
      canvas.width = width;
      canvas.height = height;
      paint();
    };
    resize();
    if (typeof ResizeObserver !== "function") return undefined;
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [paint]);

  const onVisibility = React.useCallback(
    (isVisible: boolean): void => {
      visible.current = isVisible;
      sync(isVisible && play);
    },
    [play, sync],
  );
  useVisibility(ref, onVisibility);

  useEffect(() => {
    if (!play) {
      stop();
      clock.current.elapsed = ANIMATION_PERIOD[settings.current.speed] * STILL_TIME_RATIO;
      paint();
      return undefined;
    }
    sync(visible.current);
    return stop;
  }, [play, paint, stop, sync]);

  // Neue Einstellungen (im Editor) sofort zeigen, auch im Stillstand.
  useEffect(() => paint(), [animation.pattern, animation.theme, animation.speed, animation.accent, animation.opacity, paint]);

  return (
    <canvas
      ref={ref}
      className="man-hero__image man-hero__animation"
      // Reiner Schmuck: für Hilfsmittel nicht vorhanden.
      aria-hidden
      data-testid="hero-animation"
      data-pattern={animation.pattern}
      data-theme={animation.theme}
      // Die Deckkraft gilt für die ganze Animation, Grund und Muster; dahinter
      // liegt keine Fläche der Bühne (slideClassName → --see-through).
      style={animation.opacity < 1 ? { opacity: animation.opacity } : undefined}
    />
  );
}

const thumbnails = new Map<string, string>();

/**
 * Ein kleines Standbild der Animation als Daten-Adresse — für die Kachel in
 * der Liste der Einträge. Ohne Canvas (Tests, alte Umgebungen) keins.
 */
export function animationThumbnail(animation: SlideAnimation, width = 192, height = 108): string | undefined {
  const key = `${animation.pattern}:${animation.theme}:${animation.accent}:${animation.opacity}:${width}x${height}`;
  const cached = thumbnails.get(key);
  if (cached !== undefined) return cached;
  if (typeof document === "undefined") return undefined;
  try {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return undefined;
    drawAnimation(context, width, height, animation, ANIMATION_PERIOD[animation.speed] * STILL_TIME_RATIO);
    const url = canvas.toDataURL("image/png");
    thumbnails.set(key, url);
    return url;
  } catch {
    return undefined;
  }
}
