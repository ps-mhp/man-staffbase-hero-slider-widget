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
 * Das Datenmodell der Bühne und seine Übersetzung in das eine Attribut, in dem
 * es lebt.
 *
 * Alle Slides stehen als JSON in `slides` — dasselbe Verfahren wie `tabledata`
 * beim table-widget. Ein Widget hat keinen Speicher außer seinen Attributen;
 * ein Feld pro Slide-Eigenschaft würde bei fünf Slides fünfundzwanzig Felder
 * bedeuten, deren Namen die Reihenfolge mitcodieren müssten.
 *
 * Dieses Modul ist bewusst frei von DOM und React: es ist die einzige Stelle,
 * die entscheidet, was ein gültiger Slide ist, und soll ohne Renderer prüfbar
 * bleiben.
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

/** Die Felder, die {@link Slide} selbst belegt — alles andere ist `unknown`. */
const KNOWN_SLIDE_KEYS = new Set([
  "id",
  "image",
  "imagePortrait",
  "headline",
  "subline",
  "cta",
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asTrimmedString = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

const asPositiveNumber = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) && value > 0 ? value : undefined;

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

const parseImage = (value: unknown): SlideImage | undefined => {
  if (!isRecord(value)) return undefined;
  const url = asTrimmedString(value.url);
  if (url === "") return undefined;
  const image: SlideImage = { url, alt: asTrimmedString(value.alt) };
  const width = asPositiveNumber(value.width);
  const height = asPositiveNumber(value.height);
  if (width !== undefined) image.width = width;
  if (height !== undefined) image.height = height;
  return image;
};

const parseCta = (value: unknown): SlideCta | undefined => {
  if (!isRecord(value)) return undefined;
  const label = asTrimmedString(value.label);
  const href = asTrimmedString(value.href);
  // Eine Schaltfläche ohne Ziel führt nirgendwohin, eine ohne Beschriftung ist
  // unsichtbar. Beides ist kein Fehler, den man melden müsste — es ist ein
  // halb ausgefülltes Formular, und der Slide steht auch ohne sie.
  if (label === "" || href === "") return undefined;
  const cta: SlideCta = { label, href };
  if (value.newTab === true) cta.newTab = true;
  return cta;
};

const parseSlide = (value: unknown): Slide | null => {
  if (!isRecord(value)) return null;

  const image = parseImage(value.image);
  // Ohne Bild gibt es keine Bühne — der Slide wäre eine leere dunkle Fläche.
  if (image === undefined) return null;

  const slide: Slide = {
    id: asTrimmedString(value.id) || newSlideId(),
    image,
    headline: typeof value.headline === "string" ? value.headline : "",
  };

  const portrait = parseImage(value.imagePortrait);
  if (portrait !== undefined) slide.imagePortrait = portrait;

  const subline = typeof value.subline === "string" ? value.subline : "";
  if (subline !== "") slide.subline = subline;

  const cta = parseCta(value.cta);
  if (cta !== undefined) slide.cta = cta;

  const unknown: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (!KNOWN_SLIDE_KEYS.has(key)) unknown[key] = entry;
  }
  if (Object.keys(unknown).length > 0) slide.unknown = unknown;

  return slide;
};

/**
 * Liest das `slides`-Attribut.
 *
 * Gibt bei allem, was nicht als Liste von Slides lesbar ist, eine leere Liste
 * zurück statt zu werfen: das Attribut kommt aus einem Textfeld, in dem
 * jemand mit den besten Absichten etwas anderes stehen lassen kann, und eine
 * kaputte Bühne darf die Seite nicht mitreißen. Die Leseansicht rendert dann
 * nichts, der Editor beginnt bei null.
 */
export function parseSlides(raw: string | null | undefined): Slide[] {
  if (raw === null || raw === undefined || raw.trim() === "") return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) return [];

  const slides: Slide[] = [];
  const usedIds = new Set<string>();
  for (const entry of parsed) {
    const slide = parseSlide(entry);
    if (slide === null) continue;
    // Doppelte Kennungen entstehen beim Duplizieren eines Slides, wenn eine
    // ältere Editor-Version die Kennung mitkopiert hat. Zwei gleiche Keys
    // lassen React Slides verwechseln, deshalb wird die zweite ersetzt.
    if (usedIds.has(slide.id)) slide.id = newSlideId();
    usedIds.add(slide.id);
    slides.push(slide);
  }
  return slides;
}

/**
 * Schreibt das `slides`-Attribut.
 *
 * Leere Felder werden weggelassen, damit das Attribut nicht mit `"subline":
 * ""` aufläuft; unbekannte Felder werden zuerst geschrieben, sodass die
 * bekannten sie bei einer Namensgleichheit überschreiben und nicht umgekehrt.
 */
export function encodeSlidesAttribute(slides: Slide[]): string {
  return JSON.stringify(
    slides.map((slide) => {
      const image: Record<string, unknown> = { url: slide.image.url, alt: slide.image.alt };
      if (slide.image.width !== undefined) image.width = slide.image.width;
      if (slide.image.height !== undefined) image.height = slide.image.height;

      const out: Record<string, unknown> = {
        ...(slide.unknown ?? {}),
        id: slide.id,
        image,
        headline: slide.headline,
      };

      if (slide.imagePortrait !== undefined) {
        out.imagePortrait = { url: slide.imagePortrait.url, alt: slide.imagePortrait.alt };
      }
      if (slide.subline !== undefined && slide.subline !== "") out.subline = slide.subline;
      if (slide.cta !== undefined) {
        out.cta = slide.cta.newTab === true
          ? { label: slide.cta.label, href: slide.cta.href, newTab: true }
          : { label: slide.cta.label, href: slide.cta.href };
      }
      return out;
    }),
  );
}
