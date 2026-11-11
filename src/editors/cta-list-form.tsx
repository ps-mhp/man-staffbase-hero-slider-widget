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
 * Die Schaltflächen einer handgepflegten Folie.
 *
 * Nur hier: News-Folien bekommen ihre Schaltfläche aus dem Beitrag, und ein
 * Kanal-Eintrag ist gar keine Folie, sondern eine Anweisung.
 *
 * Halb ausgefüllte Schaltflächen bleiben im Zustand des Dialogs stehen. Erst
 * das Lesen des gespeicherten Attributs (`parseCta`) verwirft, was keine
 * Beschriftung oder kein brauchbares Ziel hat — sonst verschwände ein Knopf
 * unter den Händen, sobald man das erste Feld ausfüllt.
 */

import * as React from "react";
import { ReactElement } from "react";

import { documentLocales } from "@shared/staffbase/posts";

import { pickPostContent, postHref } from "../news-slides";
import {
  CTA_ICONS,
  CTA_VARIANTS,
  CtaIcon,
  CtaIconPosition,
  CtaLink,
  CtaVariant,
  MAX_SLIDE_CTAS,
  SlideCta,
  isExecutableHref,
  isSafeCtaHref,
} from "../slides-model";
import { IdSelect, IdSelectOption } from "./id-select";
import { NewsSource, useChannelPosts, useNewsChannels, usePages } from "./news-source";

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

const TARGET_LABELS: Record<CtaTargetKind, string> = {
  url: "Freie Adresse",
  page: "Seite aus Staffbase",
  post: "News-Beitrag aus Staffbase",
};

/** Dieselbe Schaltfläche ohne die genannten Felder; das Original bleibt unberührt. */
const without = (cta: SlideCta, ...keys: (keyof SlideCta)[]): SlideCta => {
  const next = { ...cta };
  for (const key of keys) delete next[key];
  return next;
};

export const targetKindOf = (cta: SlideCta): CtaTargetKind => cta.link?.kind ?? "url";

/** Ein leerer Knopf. Ab dem zweiten als Kontur — zwei rote Flächen nebeneinander konkurrieren. */
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

interface CtaTargetProps {
  cta: SlideCta;
  onChange: (cta: SlideCta) => void;
  source: NewsSource;
  testId: string;
}

function PageTarget({ cta, onChange, source, testId }: CtaTargetProps): ReactElement {
  const pages = usePages(source, true);
  const link = cta.link?.kind === "page" ? cta.link : undefined;

  const choose = (pageId: string): void => {
    const page = pages.entries.find((entry) => entry.id === pageId);
    if (page === undefined) {
      // Von Hand eingetragen: ohne `menuId` gibt es noch keine Adresse.
      onChange({ ...cta, href: "", link: { kind: "page", pageId, menuId: "" } });
      return;
    }
    onChange({
      ...cta,
      href: page.href,
      link: { kind: "page", pageId: page.id, menuId: page.menuId, title: page.title },
    });
  };

  return (
    <>
      <IdSelect
        label="Seite"
        hint="Die hundert zuletzt geänderten Seiten."
        value={link?.pageId ?? ""}
        options={pages.entries.map((page) => ({ id: page.id, title: page.title }))}
        loading={pages.loading}
        placeholder="Seite wählen …"
        unavailableNotice="Die Seitenliste ist hier nicht erreichbar. Wähle „Freie Adresse“ und trage den Pfad der Seite ein, z. B. /content/page/…"
        onChange={choose}
        testId={`${testId}-page`}
      />
      {link !== undefined && link.pageId !== "" && cta.href === "" && (
        <p className="man-se__hint man-se__hint--warning">
          Diese Seite steht nicht in der Liste, ihre Adresse ist unbekannt. Die Schaltfläche wird so nicht gezeigt.
        </p>
      )}
    </>
  );
}

function PostTarget({ cta, onChange, source, testId }: CtaTargetProps): ReactElement {
  const link = cta.link?.kind === "post" ? cta.link : undefined;
  const channelId = link?.channelId ?? "";
  const channels = useNewsChannels(source);
  const posts = useChannelPosts(source, channelId);

  const postOptions: IdSelectOption[] = posts.entries.map((post) => {
    const title = pickPostContent(post.contents, documentLocales())?.title?.trim();
    return { id: post.id, title: title === undefined || title === "" ? post.id : title };
  });

  const choosePost = (postId: string): void => {
    const post = posts.entries.find((entry) => entry.id === postId);
    const title = postOptions.find((option) => option.id === postId)?.title;
    onChange({
      ...cta,
      // Ein Beitrag von Hand hat denselben Pfad wie jeder andere; der Weg über
      // `detail_view` ist nur genauer, wenn die Liste ihn kennt.
      href: post !== undefined ? postHref(post) : postId === "" ? "" : `/content/news/article/${postId}`,
      link: {
        kind: "post",
        postId,
        channelId,
        ...(title !== undefined && title !== postId ? { title } : {}),
      },
    });
  };

  return (
    <>
      <IdSelect
        label="Kanal"
        value={channelId}
        options={channels.entries.map((channel) => ({ id: channel.id, title: channel.title }))}
        loading={channels.loading}
        placeholder="Kanal wählen …"
        unavailableNotice="Die Kanalliste ist hier nicht erreichbar. Trage die Kennung des Kanals ein."
        onChange={(next) =>
          onChange({ ...cta, href: "", link: { kind: "post", postId: "", channelId: next } })
        }
        testId={`${testId}-channel`}
      />
      <IdSelect
        label="Beitrag"
        value={link?.postId ?? ""}
        options={postOptions}
        loading={posts.loading}
        disabled={channelId === ""}
        placeholder={channelId === "" ? "Erst einen Kanal wählen …" : "Beitrag wählen …"}
        unavailableNotice="Die Beitragsliste ist hier nicht erreichbar. Trage die Kennung des Beitrags ein."
        onChange={choosePost}
        testId={`${testId}-post`}
      />
    </>
  );
}

function UrlTarget({ cta, onChange, testId }: CtaTargetProps): ReactElement {
  const href = cta.href.trim();
  const rejected = href !== "" && isExecutableHref(href);
  const doubtful = href !== "" && !rejected && !isSafeCtaHref(href);
  return (
    <label className="man-se__field">
      <span className="man-se__label">Adresse</span>
      <input
        type="text"
        inputMode="url"
        className="man-se__input"
        data-testid={`${testId}-href`}
        value={cta.href}
        onChange={(event) => onChange({ ...cta, href: event.target.value })}
        placeholder="https://…, /content/…, mailto:… oder tel:…"
      />
      {rejected && (
        <p className="man-se__hint man-se__hint--warning" data-testid={`${testId}-href-invalid`}>
          Diese Adresse wird nicht übernommen, weil sie Code ausführen würde.
        </p>
      )}
      {doubtful && (
        <p className="man-se__hint man-se__hint--warning" data-testid={`${testId}-href-doubtful`}>
          Bitte prüfen: üblich sind https://…, mailto:…, tel:… und Pfade wie /content/…. Ohne https:// führt
          die Adresse meist ins Leere.
        </p>
      )}
    </label>
  );
}

interface CtaFieldsProps {
  cta: SlideCta;
  position: number;
  count: number;
  onChange: (cta: SlideCta) => void;
  onMove: (by: -1 | 1) => void;
  onRemove: () => void;
  source: NewsSource;
}

function CtaFields({ cta, position, count, onChange, onMove, onRemove, source }: CtaFieldsProps): ReactElement {
  const testId = `slide-cta-${position}`;
  const kind = targetKindOf(cta);
  const Target = kind === "page" ? PageTarget : kind === "post" ? PostTarget : UrlTarget;

  return (
    <fieldset className="man-se__cta" data-testid={testId}>
      <legend className="man-se__label">Schaltfläche {position + 1}</legend>
      <div className="man-se__cta-actions">
          <button
            type="button"
            className="man-se__button man-se__button--quiet"
            data-testid={`${testId}-up`}
            aria-label={`Schaltfläche ${position + 1} nach vorn`}
            disabled={position === 0}
            onClick={() => onMove(-1)}
          >
            ↑
          </button>
          <button
            type="button"
            className="man-se__button man-se__button--quiet"
            data-testid={`${testId}-down`}
            aria-label={`Schaltfläche ${position + 1} nach hinten`}
            disabled={position === count - 1}
            onClick={() => onMove(1)}
          >
            ↓
          </button>
          <button
            type="button"
            className="man-se__button man-se__button--quiet man-se__button--danger"
            data-testid={`${testId}-remove`}
            onClick={onRemove}
          >
            Entfernen
          </button>
      </div>

      <label className="man-se__field">
        <span className="man-se__label">Beschriftung</span>
        <input
          type="text"
          className="man-se__input"
          data-testid={`${testId}-label`}
          value={cta.label}
          onChange={(event) => onChange({ ...cta, label: event.target.value })}
        />
      </label>

      <label className="man-se__field">
        <span className="man-se__label">Ziel</span>
        <select
          className="man-se__input man-se__select"
          data-testid={`${testId}-kind`}
          value={kind}
          onChange={(event) => onChange(withTargetKind(cta, event.target.value as CtaTargetKind))}
        >
          {(Object.keys(TARGET_LABELS) as CtaTargetKind[]).map((option) => (
            <option key={option} value={option}>
              {TARGET_LABELS[option]}
            </option>
          ))}
        </select>
      </label>

      <Target cta={cta} onChange={onChange} source={source} testId={testId} />

      <div className="man-se__cta-row">
        <label className="man-se__field">
          <span className="man-se__label">Stil</span>
          <select
            className="man-se__input man-se__select"
            data-testid={`${testId}-variant`}
            value={cta.variant ?? "primary"}
            onChange={(event) => {
              const variant = event.target.value as CtaVariant;
              const rest = without(cta, "variant");
              onChange(variant === "primary" ? rest : { ...rest, variant });
            }}
          >
            {CTA_VARIANTS.map((variant) => (
              <option key={variant} value={variant}>
                {VARIANT_LABELS[variant]}
              </option>
            ))}
          </select>
        </label>

        <label className="man-se__field">
          <span className="man-se__label">Symbol</span>
          <select
            className="man-se__input man-se__select"
            data-testid={`${testId}-icon`}
            value={cta.icon ?? ""}
            onChange={(event) => {
              const rest = without(cta, "icon", "iconPosition");
              const icon = event.target.value as CtaIcon | "";
              onChange(
                icon === ""
                  ? rest
                  : { ...rest, icon, ...(cta.iconPosition === "start" ? { iconPosition: "start" } : {}) },
              );
            }}
          >
            <option value="">Kein Symbol</option>
            {CTA_ICONS.map((icon) => (
              <option key={icon} value={icon}>
                {ICON_LABELS[icon]}
              </option>
            ))}
          </select>
        </label>

        <label className="man-se__field">
          <span className="man-se__label">Symbol steht</span>
          <select
            className="man-se__input man-se__select"
            data-testid={`${testId}-icon-position`}
            value={cta.iconPosition ?? "end"}
            disabled={cta.icon === undefined}
            onChange={(event) => {
              const rest = without(cta, "iconPosition");
              const next = event.target.value as CtaIconPosition;
              onChange(next === "start" ? { ...rest, iconPosition: "start" } : rest);
            }}
          >
            <option value="end">Nach dem Text</option>
            <option value="start">Vor dem Text</option>
          </select>
        </label>
      </div>

      <label className="man-se__check">
        <input
          type="checkbox"
          data-testid={`${testId}-newtab`}
          checked={cta.newTab === true}
          onChange={(event) => {
            const rest = without(cta, "newTab");
            onChange(event.target.checked ? { ...rest, newTab: true } : rest);
          }}
        />
        In neuem Tab öffnen
      </label>
    </fieldset>
  );
}

export interface CtaListFormProps {
  ctas: SlideCta[];
  onChange: (ctas: SlideCta[] | undefined) => void;
  source: NewsSource;
}

export function CtaListForm({ ctas, onChange, source }: CtaListFormProps): ReactElement {
  // Eine leere Liste wird nicht gespeichert: das Attribut bliebe sonst mit
  // `"ctas": []` stehen, wo vorher gar nichts stand.
  const commit = (next: SlideCta[]): void => onChange(next.length === 0 ? undefined : next);
  const replace = (position: number, cta: SlideCta): void =>
    commit(ctas.map((entry, at) => (at === position ? cta : entry)));

  return (
    <fieldset className="man-se__field man-se__fieldset">
      <legend className="man-se__label">Schaltflächen (optional)</legend>
      <p className="man-se__hint">
        Bis zu {MAX_SLIDE_CTAS}. Eine Schaltfläche erscheint nur, wenn Beschriftung und Ziel ausgefüllt sind. Auf
        dem Telefon wird die erste zur Fläche der ganzen Folie.
      </p>

      {ctas.map((cta, position) => (
        <CtaFields
          key={position}
          cta={cta}
          position={position}
          count={ctas.length}
          source={source}
          onChange={(next) => replace(position, next)}
          onMove={(by) => commit(moveCta(ctas, position, by))}
          onRemove={() => commit(ctas.filter((_, at) => at !== position))}
        />
      ))}

      <button
        type="button"
        className="man-se__button"
        data-testid="slide-cta-add"
        disabled={ctas.length >= MAX_SLIDE_CTAS}
        onClick={() => commit([...ctas, emptyCta(ctas.length)])}
      >
        Schaltfläche hinzufügen
      </button>
    </fieldset>
  );
}
