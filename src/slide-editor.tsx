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
 * Der Redaktionsdialog der Bühne.
 *
 * Die Einträge liegen als JSON in einem einzigen Attribut — in einem Textfeld
 * wären sie unbearbeitbar. Dieser Editor tritt an seine Stelle: links die
 * Liste der Einträge, rechts die Felder des gewählten, in den Geräteansichten
 * statt der Felder die Vorschau.
 *
 * Ein Eintrag ist entweder eine handgepflegte Folie oder ein Verweis auf die
 * News: ein einzelner Beitrag oder ein ganzer Kanal. Nur die rechte Spalte
 * wechselt mit der Sorte.
 *
 * Er schreibt nichts selbst zurück und zeichnet keine Knöpfe zum Übernehmen
 * oder Abbrechen: Kopf, Status, Rückgängig und Rückfrage kommen aus dem
 * Rahmen von `@man/config-ui`, das Zurückschreiben ins Formularfeld aus
 * `@shared/config-modal`. Nachgeladen wird er nur im Studio
 * (`slide-editor-injector.ts`) — die Bausteine bringen react-aria mit, und
 * das gehört nicht ins Seitenbündel.
 */

import * as React from "react";
import { ReactElement, useMemo, useState } from "react";
import { ConfigWorkspace } from "@man/config-ui/layout/config-workspace";
import { ItemActions } from "@man/config-ui/sidebar/item-actions";
import { useHotStyle } from "@shared/hot-style";
import { MediaClient, createMediaClient } from "@shared/media/media-client";
import { MediaAccept, MediaPicker, PickedMedia } from "@shared/media/media-picker";

import { HeroEntryPreview } from "./hero-slide-preview";
import { HeroItem, isNewsChannelItem, isNewsPostItem, isSlideItem } from "./hero-items";
import { MAX_ITEMS, entryKindName } from "./editor-entries";
import { EntrySidebar } from "./editors/entry-sidebar";
import { useItemLabels } from "./editors/item-label";
import { NewsChannelForm } from "./editors/news-channel-form";
import { NewsPostForm } from "./editors/news-post-form";
import { NewsSource, cacheNewsSource, defaultNewsSource } from "./editors/news-source";
import { SlideForm } from "./editors/slide-form";
import { Entries, PickerTarget, patchForPick, pickedImage, useEntries } from "./use-entries";
import slideEditorCss from "./styles/slide-editor.scss";

export { MAX_ITEMS };

/**
 * Eine Folie nimmt Bilder und Videos. Das Bild eines News-Beitrags bleibt ein
 * Bild: es ersetzt das Beitragsbild, und das ist nie ein Video.
 */
const SLIDE_MEDIA: MediaAccept = ["image", "video"];

export interface SlideEditorProps {
  value: HeroItem[];
  onChange: (items: HeroItem[]) => void;
  /** Vorgabe ist ein Client auf dieselbe Herkunft; für Tests austauschbar. */
  mediaClient?: MediaClient;
  /** Vorgabe sind die echten News-Endpunkte; für Tests austauschbar. */
  newsSource?: NewsSource;
}

interface EntryFormProps {
  item: HeroItem;
  entries: Entries;
  source: NewsSource;
  onPick: (target: PickerTarget) => void;
}

/** Die Felder je Sorte, unverändert aus `editors/`. */
function EntryForm({ item, entries, source, onPick }: EntryFormProps): ReactElement | null {
  if (isSlideItem(item)) {
    return (
      <SlideForm
        // Je Eintrag eine eigene Instanz: das Adressfeld hält eine noch
        // ungültige Eingabe fest, und die gehört nicht in die nächste Folie.
        key={item.id}
        slide={item}
        onPatch={entries.patch}
        onPick={onPick}
        source={source}
      />
    );
  }
  if (isNewsPostItem(item)) {
    return <NewsPostForm item={item} onPatch={entries.patch} onPick={onPick} source={source} />;
  }
  if (isNewsChannelItem(item)) {
    return <NewsChannelForm item={item} onPatch={entries.patch} source={source} />;
  }
  return null;
}

interface EntryMainProps {
  entries: Entries;
  total: number;
  source: NewsSource;
  onPick: (target: PickerTarget) => void;
}

/** Die Hauptfläche: welcher Eintrag, seine Aktionen, seine Felder. */
function EntryMain({ entries, total, source, onPick }: EntryMainProps): ReactElement {
  const { item, index, full } = entries;
  if (item === undefined) {
    return <p className="p-6 text-sm text-muted-foreground">Wähle links einen Eintrag oder lege einen neuen an.</p>;
  }
  return (
    <div className="p-6">
      <div className="man-se__form">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[17px] font-semibold text-foreground">
            {`${entryKindName(item)} ${index + 1} von ${total}`}
          </h2>
          <ItemActions
            noun="Eintrag"
            onMoveBack={() => entries.move(-1)}
            onMoveForward={() => entries.move(1)}
            canMoveBack={index > 0}
            canMoveForward={index < total - 1}
            onDuplicate={entries.duplicate}
            // Voll heißt: keine Kopie. Gesperrt statt weggelassen, damit die
            // Knöpfe nicht springen; „Neu“ nennt die Grenze.
            canDuplicate={!full}
            onDelete={entries.remove}
          />
        </div>
        <EntryForm item={item} entries={entries} source={source} onPick={onPick} />
      </div>
    </div>
  );
}

export function SlideEditor({ value, onChange, mediaClient, newsSource }: SlideEditorProps): ReactElement {
  const css = useHotStyle(slideEditorCss, "hero-slider-widget", "styles/slide-editor.scss");
  const client = useMemo(() => mediaClient ?? createMediaClient(), [mediaClient]);
  const source = useMemo(() => cacheNewsSource(newsSource ?? defaultNewsSource), [newsSource]);
  const entries = useEntries(value, onChange);
  const labels = useItemLabels(value, source);
  const [pickerTarget, setPickerTarget] = useState<PickerTarget | null>(null);
  const { item } = entries;

  const handlePick = (picked: PickedMedia): void => {
    const target = pickerTarget;
    setPickerTarget(null);
    if (target !== null) entries.patch(patchForPick(target, pickedImage(picked)));
  };

  return (
    <div className="man-se" data-testid="slide-editor">
      <style>{css}</style>
      <ConfigWorkspace
        className="flex-1"
        sidebar={
          <EntrySidebar
            items={value}
            labels={labels}
            selectedId={item?.id}
            onSelect={entries.select}
            onAdd={entries.add}
            onReorder={entries.reorder}
          />
        }
        preview={<HeroEntryPreview item={item} />}
      >
        <EntryMain entries={entries} total={value.length} source={source} onPick={setPickerTarget} />
      </ConfigWorkspace>

      {pickerTarget !== null && (
        <MediaPicker
          client={client}
          accept={item !== undefined && isSlideItem(item) ? SLIDE_MEDIA : "images"}
          onSelect={handlePick}
          onClose={() => setPickerTarget(null)}
        />
      )}
    </div>
  );
}
