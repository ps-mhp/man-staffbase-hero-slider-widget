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
 * Die Darstellungsform der Bühne: das, was am Ende gezeigt wird.
 *
 * Eine Folie ist hier immer schon fertig — Bild, Überschrift, Unterzeile,
 * Schaltfläche. Woher sie kommt, weiß dieses Modul nicht: von Hand gepflegt,
 * aus einem News-Beitrag abgeleitet oder aus einem ganzen Kanal expandiert.
 * Die Konfigurationsform und ihre Übersetzung in das Attribut `slides` stehen
 * in `hero-items.ts`, das Auflösen in `resolve-hero-items.ts`.
 *
 * Diese Trennung ist neu und der Grund, weshalb `hero-slider.tsx` von News
 * nichts wissen muss: sie bekommt `Slide[]` und rendert es.
 *
 * Frei von DOM und React.
 */

/** Ein Bild samt seiner Beschreibung. */
export interface SlideImage {
  url: string;
  alt: string;
  /** Nur bekannt, wenn das Bild aus der Mediathek kam; steuert `aspect-ratio`. */
  width?: number;
  height?: number;
}

/** Die Schaltfläche unter dem Text. Höchstens eine je Slide (siehe E6). */
export interface SlideCta {
  label: string;
  href: string;
  newTab?: boolean;
}

export interface Slide {
  /** Stabil über Umsortieren hinweg — React-Key und Verweisziel der Bullets. */
  id: string;
  image: SlideImage;
  /**
   * Hochkant-Zuschnitt für schmale, stehende Bildschirme. Fehlt er, zeigt das
   * `<picture>` überall denselben Querzuschnitt — zulässig, nur eben ohne die
   * Bildregie, die man.eu betreibt.
   */
  imagePortrait?: SlideImage;
  headline: string;
  subline?: string;
  cta?: SlideCta;
  /**
   * Alles, was eine spätere Version geschrieben hat und diese nicht kennt.
   * Ohne diesen Beutel würde ein Redakteur, der eine alte Bundle-Version
   * geladen bekommt, beim ersten Speichern fremde Felder löschen.
   */
  unknown?: Record<string, unknown>;
}

/**
 * Erzeugt eine Kennung, die auch dann eindeutig ist, wenn `crypto.randomUUID`
 * fehlt — der Konfigurationsdialog läuft in fremden Seiten, und in einem
 * unsicheren Kontext (http) stellt der Browser die Web-Crypto-API nicht.
 */
export function newSlideId(): string {
  const uuid = globalThis.crypto?.randomUUID;
  if (typeof uuid === "function") return uuid.call(globalThis.crypto);
  return `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Ein leerer Slide, wie ihn der Editor beim Hinzufügen einsetzt. */
export function emptySlide(): Slide {
  return { id: newSlideId(), image: { url: "", alt: "" }, headline: "" };
}
