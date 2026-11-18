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
 * Die Regeln der Buttons einer Folie, frei von React: Beschriftungen der
 * Auswahl, Wechsel der Zielart, Verschieben, Kopieren und die Unterzeile,
 * unter der ein Button in der Liste steht.
 *
 * Jede Funktion gibt einen neuen Wert zurück und lässt den alten stehen.
 */

import { CtaIcon, CtaLink, CtaVariant, SlideCta } from "../slides-model";

/** Woher das Ziel kommt; abgeleitet aus `link`, nie gespeichert. */
export type CtaTargetKind = "url" | "page" | "post";

export const VARIANT_LABELS: Record<CtaVariant, string> = {
  primary: "Rot gefüllt (Hauptaktion)",
  secondary: "Weiß gefüllt",
  outline: "Weiße Kontur",
  link: "Textverweis",
};

export const ICON_LABELS: Record<CtaIcon, string> = {
  "arrow-right": "Pfeil nach rechts",
  "chevron-right": "Winkel nach rechts",
  "external-link": "Externer Link",
  download: "Herunterladen",
  play: "Abspielen",
  "file-text": "Dokument",
  calendar: "Kalender",
  mail: "E-Mail",
  phone: "Telefon",
  info: "Information",
};

export const TARGET_LABELS: Record<CtaTargetKind, string> = {
  url: "Adresse",
  page: "Seite",
  post: "News-Beitrag",
};

/** Derselbe Button ohne die genannten Felder; das Original bleibt unberührt. */
export const without = (cta: SlideCta, ...keys: (keyof SlideCta)[]): SlideCta => {
  const next = { ...cta };
  for (const key of keys) delete next[key];
  return next;
};

export const targetKindOf = (cta: SlideCta): CtaTargetKind => cta.link?.kind ?? "url";

/** Ein leerer Button. Ab dem zweiten als Kontur — zwei rote Flächen nebeneinander konkurrieren. */
export const emptyCta = (position: number): SlideCta =>
  position === 0 ? { label: "", href: "" } : { label: "", href: "", variant: "outline" };

/** Wechselt die Herkunft des Ziels. Die alte Adresse gehörte zur alten Herkunft und fällt weg. */
export function withTargetKind(cta: SlideCta, kind: CtaTargetKind): SlideCta {
  if (targetKindOf(cta) === kind) return cta;
  const rest = without(cta, "link");
  if (kind === "url") return { ...rest, href: "" };
  const link: CtaLink =
    kind === "page"
      ? { kind: "page", pageId: "", menuId: "" }
      : { kind: "post", postId: "", channelId: "" };
  return { ...rest, href: "", link };
}

/** Verschiebt einen Eintrag um eine Stelle; außerhalb der Liste bleibt alles, wie es ist. */
export function moveCta(ctas: SlideCta[], from: number, by: -1 | 1): SlideCta[] {
  const to = from + by;
  if (to < 0 || to >= ctas.length) return ctas;
  const next = [...ctas];
  [next[from], next[to]] = [next[to]!, next[from]!];
  return next;
}

/** Setzt eine Kopie direkt hinter den Button. */
export function duplicateCta(ctas: SlideCta[], at: number): SlideCta[] {
  const original = ctas[at];
  if (original === undefined) return ctas;
  return [...ctas.slice(0, at + 1), { ...original }, ...ctas.slice(at + 1)];
}

/** Der Stil ohne Klammerzusatz, für die Unterzeile. */
const shortVariant = (variant: CtaVariant | undefined): string =>
  VARIANT_LABELS[variant ?? "primary"].replace(/\s*\(.*\)$/, "");

function targetText(cta: SlideCta): string {
  const link = cta.link;
  if (link?.kind === "page") {
    if (link.title !== undefined) return `Seite „${link.title}“`;
    return link.pageId === "" ? "Seite fehlt" : "Seite";
  }
  if (link?.kind === "post") {
    if (link.title !== undefined) return `News-Beitrag „${link.title}“`;
    return link.postId === "" ? "Beitrag fehlt" : "News-Beitrag";
  }
  return cta.href.trim() === "" ? "Ziel fehlt" : cta.href.trim();
}

/** Die Unterzeile in der Liste: „Rot gefüllt · Seite „Termine““. */
export function ctaSummary(cta: SlideCta): string {
  return `${shortVariant(cta.variant)} · ${targetText(cta)}`;
}
