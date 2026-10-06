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

/** Was hinter einer Medienadresse steckt. */
export type MediaKind = "image" | "video";

/**
 * Ein Bild — oder ein Video — samt seiner Beschreibung.
 *
 * Der Name ist älter als das Video: er steht in jeder gespeicherten Bühne, und
 * ein Umbenennen hätte allen bestehenden Konfigurationen das Bild genommen.
 */
export interface SlideImage {
  url: string;
  alt: string;
  /** Nur bekannt, wenn das Bild aus der Mediathek kam; steuert `aspect-ratio`. */
  width?: number;
  height?: number;
  /**
   * `"video"` bei Videos; bei Bildern fehlt das Feld. Es steht ausdrücklich da,
   * statt bei jedem Zeigen aus der Endung gelesen zu werden: viele Adressen —
   * Mediendienste, CDNs mit Parametern — tragen gar keine.
   */
  kind?: "video";
}

/** Endungen, an denen eine Adresse sicher als Video gilt. */
const VIDEO_EXTENSIONS = new Set(["mp4", "m4v", "webm", "ogv", "mov"]);

/** Endungen, an denen eine Adresse sicher als Bild gilt. */
const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "gif", "webp", "avif", "svg"]);

export function isVideo(image: SlideImage): boolean {
  return image.kind === "video";
}

/**
 * Liest die Sorte an der Endung des Pfads ab; Suchteil und Anker zählen nicht.
 * Ohne eindeutige Endung bleibt die Antwort offen — dann entscheidet, was vorher
 * eingestellt war, oder die Redaktion von Hand.
 */
export function mediaKindFromUrl(url: string): MediaKind | undefined {
  let path: string;
  try {
    path = new URL(url).pathname;
  } catch {
    return undefined;
  }
  const extension = /\.([a-z0-9]+)$/i.exec(path)?.[1]?.toLowerCase();
  if (extension === undefined) return undefined;
  if (VIDEO_EXTENSIONS.has(extension)) return "video";
  if (IMAGE_EXTENSIONS.has(extension)) return "image";
  return undefined;
}

/**
 * Prüft eine von Hand eingegebene Medienadresse.
 *
 * Nur `https:` — `http:` sperrt jede Staffbase-Seite als gemischten Inhalt, und
 * `data:`, `javascript:` oder relative Pfade gehören nicht in ein Feld, das
 * „Adresse“ heißt. Der Rechnername braucht einen Punkt: `https://e` ist beim
 * Tippen schon eine gültige URL, aber noch keine Adresse, und jeder solche
 * Zwischenstand wäre ein vergeblicher Abruf. Zugangsdaten in der Adresse
 * stünden für alle lesbar im Markup der Seite.
 *
 * Gibt die Adresse ohne Leerraum zurück oder `null`.
 */
export function parseMediaUrl(text: string): string | null {
  const trimmed = text.trim();
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  if (!url.hostname.includes(".")) return null;
  if (url.username !== "" || url.password !== "") return null;
  return trimmed;
}

/**
 * Die Adresse, unter der ein Video vor dem Abspielen sein erstes Bild zeigt.
 *
 * Safari malt mit `preload="metadata"` kein Bild, solange nichts abgespielt
 * wird — bei weniger Bewegung oder verweigertem Abspielen also nie, und die
 * Bühne bliebe schwarz. Der Zeitanker lässt ihn das erste Bild laden; die
 * übrigen Browser stört er nicht.
 */
export function firstFrameUrl(url: string): string {
  return url.includes("#") ? url : `${url}#t=0.001`;
}

/** Dasselbe Medium als Bild oder als Video; das Original bleibt unberührt. */
export function withMediaKind(image: SlideImage, kind: MediaKind): SlideImage {
  const next: SlideImage = { ...image };
  delete next.kind;
  return kind === "video" ? { ...next, kind: "video" } : next;
}

/**
 * Das Medium hinter einer neu eingegebenen Adresse.
 *
 * Die Maße fallen weg — sie gehörten zur alten Datei. Die Beschreibung bleibt:
 * wer eine Adresse ändert, korrigiert meist einen Tippfehler, und jeder
 * Tastendruck nähme sonst den Text darunter mit. Verrät die Endung nichts,
 * bleibt die bisherige Sorte stehen, aus demselben Grund.
 */
export function mediaFromUrl(current: SlideImage | undefined, url: string): SlideImage {
  const kind = mediaKindFromUrl(url) ?? (current !== undefined && isVideo(current) ? "video" : "image");
  return withMediaKind({ url, alt: current?.alt ?? "" }, kind);
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
