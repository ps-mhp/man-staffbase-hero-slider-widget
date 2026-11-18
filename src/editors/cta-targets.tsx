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
 * Das Ziel eines Buttons, je nach Art: freie Adresse, Seite aus Staffbase
 * oder News-Beitrag (erst Kanal, dann Beitrag).
 */

import * as React from "react";
import { ReactElement } from "react";
import { Field } from "@man/config-ui/form/field";
import { Input } from "@man/config-ui/primitives/input";
import { documentLocales } from "@shared/staffbase/posts";

import { pickPostContent, postHref } from "../news-slides";
import { SlideCta, isExecutableHref, isSafeCtaHref } from "../slides-model";
import { targetKindOf } from "./cta-model";
import { IdSelect, IdSelectOption } from "./id-select";
import { NewsSource, useChannelPosts, useNewsChannels, usePages } from "./news-source";

export interface CtaTargetProps {
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

  const unknownAddress = link !== undefined && link.pageId !== "" && cta.href === "";
  return (
    <IdSelect
      label="Seite"
      hint="Die hundert zuletzt geänderten Seiten."
      error={unknownAddress ? "Diese Seite steht nicht in der Liste, ihre Adresse ist unbekannt. Der Button wird so nicht gezeigt." : undefined}
      value={link?.pageId ?? ""}
      options={pages.entries.map((page) => ({ id: page.id, title: page.title }))}
      loading={pages.loading}
      placeholder="Seite wählen …"
      unavailableNotice="Die Seitenliste ist hier nicht erreichbar. Wähle „Adresse“ und trage den Pfad der Seite ein, z. B. /content/page/…"
      onChange={choose}
      testId={`${testId}-page`}
    />
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
    <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
      <IdSelect
        label="Kanal"
        value={channelId}
        options={channels.entries.map((channel) => ({ id: channel.id, title: channel.title }))}
        loading={channels.loading}
        placeholder="Kanal wählen …"
        unavailableNotice="Die Kanalliste ist hier nicht erreichbar. Trage die Kennung des Kanals ein."
        onChange={(next) => onChange({ ...cta, href: "", link: { kind: "post", postId: "", channelId: next } })}
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
    </div>
  );
}

function UrlTarget({ cta, onChange, testId }: CtaTargetProps): ReactElement {
  const href = cta.href.trim();
  const rejected = href !== "" && isExecutableHref(href);
  const doubtful = href !== "" && !rejected && !isSafeCtaHref(href);
  return (
    <Field
      label="Adresse"
      error={
        rejected ? (
          <span data-testid={`${testId}-href-invalid`}>Diese Adresse wird nicht übernommen, weil sie Code ausführen würde.</span>
        ) : undefined
      }
      hint={
        doubtful ? (
          <span data-testid={`${testId}-href-doubtful`} className="text-warning">
            Bitte prüfen: üblich sind https://…, mailto:…, tel:… und Pfade wie /content/…. Ohne https:// führt die Adresse
            meist ins Leere.
          </span>
        ) : undefined
      }
    >
      <Input
        type="text"
        inputMode="url"
        data-testid={`${testId}-href`}
        value={cta.href}
        onChange={(event) => onChange({ ...cta, href: event.target.value })}
        placeholder="https://…, /content/…, mailto:… oder tel:…"
      />
    </Field>
  );
}

/** Die Felder zur Zielart des Buttons. */
export function CtaTarget(props: CtaTargetProps): ReactElement {
  const kind = targetKindOf(props.cta);
  if (kind === "page") return <PageTarget {...props} />;
  if (kind === "post") return <PostTarget {...props} />;
  return <UrlTarget {...props} />;
}
