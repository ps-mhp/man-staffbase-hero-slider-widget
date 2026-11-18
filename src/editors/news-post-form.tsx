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
 * Die Felder eines einzelnen News-Beitrags, gegliedert wie der Screen des
 * Kanals: Quelle, Darstellung, Medium.
 *
 * Zuerst Kanal, dann Beitrag: die Beitragsliste eines ganzen Tenants wäre für
 * eine Auswahl unbrauchbar lang, und Redakteur:innen denken ohnehin vom Kanal
 * her.
 */

import * as React from "react";
import { ReactElement } from "react";
import { Field } from "@man/config-ui/form/field";
import { FormSection } from "@man/config-ui/form/form-section";
import { SwitchRow } from "@man/config-ui/form/switch-row";
import { Input } from "@man/config-ui/primitives/input";
import { useConfigShell } from "@man/config-ui/shell/shell-context";

import { DEFAULT_CTA_LABEL, NewsPostItem } from "../hero-items";
import { documentLocales } from "@shared/staffbase/posts";
import { pickPostContent } from "../news-slides";
import { useFieldMedia } from "./editor-media";
import { ImageField } from "./image-field";
import { IdSelect, IdSelectOption } from "./id-select";
import { NewsSource, useChannelPosts, useNewsChannels } from "./news-source";

/** Welches Bild eines News-Eintrags der Picker gerade füllt. */
export type NewsPickerTarget = "imageOverride" | "imagePortrait";

export interface NewsPostFormProps {
  item: NewsPostItem;
  onPatch: (changes: Partial<NewsPostItem>) => void;
  onPick: (target: NewsPickerTarget) => void;
  source: NewsSource;
}

function SourceSection({ item, onPatch, source }: Omit<NewsPostFormProps, "onPick">): ReactElement {
  const { issuesVisible } = useConfigShell();
  const channels = useNewsChannels(source);
  const posts = useChannelPosts(source, item.channelId);

  const postOptions: IdSelectOption[] = posts.entries.map((post) => {
    // Die Titel der Auswahl folgen der Sprache der Seite, nicht der der
    // lesenden Person: der Dialog steht vor der Redaktion, nicht vor ihr.
    const title = pickPostContent(post.contents, documentLocales())?.title?.trim();
    return { id: post.id, title: title === undefined || title === "" ? post.id : title };
  });

  return (
    <FormSection title="Quelle">
      <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
        <IdSelect
          label="Kanal"
          required
          hint="Bestimmt, welche Beiträge zur Auswahl stehen."
          value={item.channelId}
          options={channels.entries.map((channel) => ({ id: channel.id, title: channel.title }))}
          loading={channels.loading}
          placeholder="Kanal wählen …"
          unavailableNotice="Die Kanalliste ist hier nicht erreichbar. Trage die Kennung des Kanals ein."
          // Der Beitrag gehört zum alten Kanal; ihn stehen zu lassen hieße, eine
          // Auswahl anzuzeigen, die zur Liste darunter nicht passt.
          onChange={(channelId) => onPatch({ channelId, postId: "" })}
          testId="news-post-channel"
        />
        <IdSelect
          label="Beitrag"
          required
          hint="Die fünfzig jüngsten Beiträge des Kanals, neueste zuerst."
          error={issuesVisible && item.postId.trim() === "" ? "Ohne Beitrag wird dieser Eintrag nicht gezeigt." : undefined}
          value={item.postId}
          options={postOptions}
          loading={posts.loading}
          disabled={item.channelId === ""}
          placeholder={item.channelId === "" ? "Erst einen Kanal wählen …" : "Beitrag wählen …"}
          unavailableNotice="Die Beitragsliste ist hier nicht erreichbar. Trage die Kennung des Beitrags ein."
          onChange={(postId) => onPatch({ postId })}
          testId="news-post-post"
        />
      </div>
    </FormSection>
  );
}

function DisplaySection({ item, onPatch }: Pick<NewsPostFormProps, "item" | "onPatch">): ReactElement {
  return (
    <FormSection title="Darstellung">
      <Field label="Überschrift" hint="Leer lassen, um den Titel des Beitrags zu übernehmen.">
        <Input
          type="text"
          data-testid="news-post-headline"
          value={item.headline ?? ""}
          onChange={(event) =>
            onPatch({ headline: event.target.value === "" ? undefined : event.target.value })
          }
        />
      </Field>
      <SwitchRow
        label="Anrisstext zeigen"
        hint="Als Unterzeile unter der Überschrift."
        data-testid="news-post-teaser"
        checked={item.showTeaser !== false}
        onCheckedChange={(checked) => onPatch({ showTeaser: checked ? undefined : false })}
      />
      <Field
        className="max-w-[360px]"
        label="Beschriftung des Buttons"
        hint="Leer lassen, um den Button wegzulassen. Er führt immer zum Beitrag."
      >
        <Input
          type="text"
          data-testid="news-post-cta"
          value={item.ctaLabel ?? DEFAULT_CTA_LABEL}
          onChange={(event) => onPatch({ ctaLabel: event.target.value })}
        />
      </Field>
    </FormSection>
  );
}

function MediaSection({ item, onPatch, onPick }: Omit<NewsPostFormProps, "source">): ReactElement {
  const overrideMedia = useFieldMedia(item.id, "imageOverride");
  const portraitMedia = useFieldMedia(item.id, "imagePortrait");
  return (
    <FormSection title="Medium" description="Ohne eigenes Bild zeigt die Bühne das Beitragsbild.">
      <ImageField
        label="Bühnenbild"
        hint="Das Beitragsbild ist fürs Feed geschnitten. Für eine hohe Bühne lohnt ein eigenes, quer und mindestens 1920 px breit."
        compactEmpty
        image={item.imageOverride}
        onPick={() => onPick("imageOverride")}
        onClear={() => onPatch({ imageOverride: undefined })}
        onAltChange={(alt) =>
          onPatch({
            imageOverride:
              item.imageOverride === undefined ? undefined : { ...item.imageOverride, alt },
          })
        }
        media={overrideMedia}
        testId="news-post-image"
      />

      <ImageField
        label="Hochformat"
        hint="Für schmale, stehende Bildschirme; ohne eigenes Bild wird das Querformat beschnitten."
        compactEmpty
        image={item.imagePortrait}
        onPick={() => onPick("imagePortrait")}
        onClear={() => onPatch({ imagePortrait: undefined })}
        onAltChange={(alt) =>
          onPatch({
            imagePortrait:
              item.imagePortrait === undefined ? undefined : { ...item.imagePortrait, alt },
          })
        }
        media={portraitMedia}
        testId="news-post-portrait"
      />
    </FormSection>
  );
}

export function NewsPostForm({ item, onPatch, onPick, source }: NewsPostFormProps): ReactElement {
  return (
    <>
      <SourceSection item={item} onPatch={onPatch} source={source} />
      <DisplaySection item={item} onPatch={onPatch} />
      <MediaSection item={item} onPatch={onPatch} onPick={onPick} />
    </>
  );
}
