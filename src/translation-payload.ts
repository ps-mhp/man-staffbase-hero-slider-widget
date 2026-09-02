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
 * Die Drahtform für die eigene Übersetzungsanfrage der Bühne.
 *
 * `POST /api/translations` übersetzt **Textknoten** und fasst **Attribute
 * nicht an**. Genau deshalb kann die Bühne nicht einfach im Attribut `slides`
 * mitfahren: dort steht ihr gesamter Text. Sie wird stattdessen als kleines
 * Dokument verschickt, in dem jedes Textfeld als eigener Knoten steht und
 * seinen Schlüssel in einem Attribut trägt — der Text reist dorthin, wo der
 * Dienst zugreift, der Schlüssel dorthin, wo er es nicht tut.
 *
 * Ein Abschnitt je Eintrag mit `<h2>` für die Überschrift, weil eine
 * Maschinenübersetzung kurze Zeilen sonst ohne jeden Zusammenhang sieht und
 * eine Überschrift anders übersetzt als einen Fließtext.
 */

import {
  DEFAULT_CTA_LABEL,
  HeroItem,
  NewsChannelItem,
  NewsPostItem,
  SlideItem,
  isNewsChannelItem,
  isNewsPostItem,
} from "./hero-items";
import { SlideImage } from "./slides-model";

/** Markiert den Behälter, damit die Antwort in jeder Form auffindbar bleibt. */
export const HERO_MARKER = "data-hs-hero";
/** `<Nummer>.<Feld>` — das Einzige, was eine Übersetzung wieder zuordnet. */
export const FIELD_ATTRIBUTE = "data-hs-field";

/** Die Felder, die übersetzt werden. */
type FieldName = "headline" | "subline" | "cta" | "alt" | "alt-portrait";

interface Field {
  readonly key: string;
  readonly name: FieldName;
  readonly text: string;
}

const key = (index: number, name: FieldName): string => `${index}.${name}`;

/**
 * Von Hand maskiert statt über das DOM, weil dieses Modul im abgefangenen
 * `fetch` läuft: dort ist ein Dokument nicht garantiert, und ein `innerHTML`
 * würde nebenbei normalisieren.
 */
const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Die Beschriftung, die im Frontend wirklich erscheint.
 *
 * `undefined` heißt Vorgabe, und die steckt im Bundle statt im Attribut. Sie
 * wird deshalb ausdrücklich mitgeschickt und beim Zurückschreiben gesetzt —
 * sonst stünde unter jeder News-Folie eines übersetzten Artikels weiterhin ein
 * deutsches „Mehr erfahren“. Eine ausdrücklich leere Beschriftung heißt
 * dagegen „keine Schaltfläche“ und bleibt leer.
 */
const effectiveCtaLabel = (item: NewsPostItem | NewsChannelItem): string =>
  item.ctaLabel === undefined ? DEFAULT_CTA_LABEL : item.ctaLabel;

const imageFields = (
  index: number,
  image: SlideImage | undefined,
  name: FieldName,
): Field[] =>
  image?.alt !== undefined && image.alt.trim() !== ""
    ? [{ key: key(index, name), name, text: image.alt }]
    : [];

const textField = (index: number, name: FieldName, text: string | undefined): Field[] =>
  text !== undefined && text.trim() !== "" ? [{ key: key(index, name), name, text }] : [];

/** Alle übersetzbaren Felder eines Eintrags, in Lesereihenfolge. */
function itemFields(item: HeroItem, index: number): Field[] {
  if (isNewsPostItem(item)) {
    return [
      ...textField(index, "headline", item.headline),
      ...textField(index, "cta", effectiveCtaLabel(item)),
      ...imageFields(index, item.imageOverride, "alt"),
      ...imageFields(index, item.imagePortrait, "alt-portrait"),
    ];
  }
  if (isNewsChannelItem(item)) {
    return textField(index, "cta", effectiveCtaLabel(item));
  }

  const slide = item as SlideItem;
  return [
    ...textField(index, "headline", slide.headline),
    ...textField(index, "subline", slide.subline),
    ...textField(index, "cta", slide.cta?.label),
    ...imageFields(index, slide.image, "alt"),
    ...imageFields(index, slide.imagePortrait, "alt-portrait"),
  ];
}

/**
 * Baut das übersetzbare Dokument.
 *
 * @returns `null`, wenn kein einziges Feld Text hat — dann gibt es nichts zu
 * übersetzen, und eine leere Anfrage wäre nur eine Quelle für Fehlermeldungen.
 */
export function heroItemsToTranslatableHtml(items: HeroItem[]): string | null {
  const sections = items
    .map((item, index) => {
      const fields = itemFields(item, index);
      if (fields.length === 0) return "";
      const nodes = fields
        .map(({ key: fieldKey, name, text }) => {
          const tag = name === "headline" ? "h2" : "p";
          return `<${tag} ${FIELD_ATTRIBUTE}="${fieldKey}">${escapeHtml(text)}</${tag}>`;
        })
        .join("");
      return `<section>${nodes}</section>`;
    })
    .join("");

  return sections === "" ? null : `<div ${HERO_MARKER}="1">${sections}</div>`;
}

/** Wahr, wenn eine Zeichenkette wie eine Antwort auf {@link heroItemsToTranslatableHtml} aussieht. */
export const isTranslatedHeroHtml = (html: string): boolean => html.includes(FIELD_ATTRIBUTE);

/**
 * Liest die übersetzten Felder zurück, gekeyt nach `"<Nummer>.<Feld>"`.
 *
 * Nur `textContent`: die Bühne zeigt reinen Text, und was der Dienst an
 * Auszeichnung dazu erfindet, gehört nicht in eine Überschrift.
 */
export function readTranslatedFields(html: string): Map<string, string> {
  const fields = new Map<string, string>();
  if (!isTranslatedHeroHtml(html)) return fields;

  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");
  doc.body.querySelectorAll(`[${FIELD_ATTRIBUTE}]`).forEach((element) => {
    const fieldKey = element.getAttribute(FIELD_ATTRIBUTE);
    if (fieldKey === null || fields.has(fieldKey)) return;
    fields.set(fieldKey, element.textContent ?? "");
  });
  return fields;
}

/**
 * Nimmt den übersetzten Text an, außer der Dienst hat ihn verloren.
 *
 * Aus einem gefüllten Feld ein leeres zu machen ist kein Übersetzen; die
 * Quellsprache ist dann die bessere Antwort als eine Lücke in der Bühne.
 */
const pick = (
  fields: ReadonlyMap<string, string>,
  index: number,
  name: FieldName,
  source: string,
): string => {
  const translated = fields.get(key(index, name));
  if (translated === undefined) return source;
  return translated.trim() === "" && source.trim() !== "" ? source : translated;
};

const withAlt = (
  image: SlideImage | undefined,
  fields: ReadonlyMap<string, string>,
  index: number,
  name: FieldName,
): SlideImage | undefined =>
  image === undefined ? undefined : { ...image, alt: pick(fields, index, name, image.alt) };

/**
 * Gibt die Einträge mit allen übersetzten Feldern zurück.
 *
 * Alles andere — Kennungen, Bild-URLs, Ziele, Filter, Reihenfolge — bleibt
 * Zeichen für Zeichen stehen. Genau dafür reisen die Schlüssel mit.
 */
export function applyTranslatedFields(
  items: HeroItem[],
  fields: ReadonlyMap<string, string>,
): HeroItem[] {
  if (fields.size === 0) return items;

  return items.map((item, index) => {
    if (isNewsPostItem(item)) {
      return {
        ...item,
        ...(item.headline === undefined
          ? {}
          : { headline: pick(fields, index, "headline", item.headline) }),
        ctaLabel: pick(fields, index, "cta", effectiveCtaLabel(item)),
        imageOverride: withAlt(item.imageOverride, fields, index, "alt"),
        imagePortrait: withAlt(item.imagePortrait, fields, index, "alt-portrait"),
      };
    }

    if (isNewsChannelItem(item)) {
      return { ...item, ctaLabel: pick(fields, index, "cta", effectiveCtaLabel(item)) };
    }

    const slide = item as SlideItem;
    return {
      ...slide,
      headline: pick(fields, index, "headline", slide.headline),
      ...(slide.subline === undefined
        ? {}
        : { subline: pick(fields, index, "subline", slide.subline) }),
      ...(slide.cta === undefined
        ? {}
        : { cta: { ...slide.cta, label: pick(fields, index, "cta", slide.cta.label) } }),
      image: withAlt(slide.image, fields, index, "alt") as SlideImage,
      imagePortrait: withAlt(slide.imagePortrait, fields, index, "alt-portrait"),
    };
  });
}
