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
 * Liste der Einträge, in der Mitte die Felder des gewählten, rechts das Panel
 * „Widget“ mit den Einstellungen der Bühne (Höhe, Breite, Lage, Sekunden …).
 * Die reisen im selben Attribut (`hero-settings.ts`), also nimmt „Abbrechen“
 * sie mit zurück. In den Geräteansichten steht statt der Felder die Vorschau
 * in Gerätebreite; das Panel bleibt daneben.
 *
 * Ein Eintrag ist entweder eine handgepflegte Folie oder ein Verweis auf die
 * News: ein einzelner Beitrag oder ein ganzer Kanal. Nur die Felder in der
 * Mitte wechseln mit der Sorte.
 *
 * Er schreibt nichts selbst zurück und zeichnet keine Knöpfe zum Übernehmen
 * oder Abbrechen: Kopf, Status, Rückgängig und Rückfrage kommen aus dem
 * Rahmen von `@man/config-ui`, das Zurückschreiben ins Formularfeld aus
 * `@shared/config-modal`. Nachgeladen wird er nur im Studio
 * (`slide-editor-injector.ts`) — die Bausteine bringen react-aria mit, und
 * das gehört nicht ins Seitenbündel.
 *
 * Bilder kommen aus der Mediathek: im Rahmen als Leiste rechts
 * (`useMediaPanel`), deren Kacheln man auch direkt auf jedes Bildfeld
 * ziehen kann (`EditorMediaContext` → `useMediaDrop`); ohne Rahmen als
 * Overlay wie zuvor.
 */

import * as React from "react";
import { ReactElement, useMemo, useState } from "react";
import { ConfigWorkspace } from "@man/config-ui/layout/config-workspace";
import { ItemActions } from "@man/config-ui/sidebar/item-actions";
import type { ShownIssues } from "@shared/config-modal";
import { useHotStyle } from "@shared/hot-style";
import { MediaClient, createMediaClient } from "@shared/media/media-client";
import { MediaAccept, PickedMedia } from "@shared/media/media-picker";
import { useMediaPanel } from "@shared/media/use-media-panel";

import { HeroEntryPreview } from "./hero-slide-preview";
import { HeroItem, heroItemType, isNewsChannelItem, isNewsPostItem, isSlideItem } from "./hero-items";
import { MAX_ITEMS, entryKindName } from "./editor-entries";
import type { HeroEditorValue } from "./editor-value";
import { EditorMedia, EditorMediaContext } from "./editors/editor-media";
import { EntrySidebar } from "./editors/entry-sidebar";
import { useItemLabels } from "./editors/item-label";
import { NewsChannelForm } from "./editors/news-channel-form";
import { NewsPostForm } from "./editors/news-post-form";
import { NewsSource, cacheNewsSource, defaultNewsSource } from "./editors/news-source";
import { SlideForm } from "./editors/slide-form";
import { SETTINGS_PANEL_TITLE, WIDGET_PANEL_TITLE, WidgetSettingsPanel } from "./editors/widget-settings-panel";
import { BlockSelection, BlockSelectionProvider, useStageEditing } from "./editors/zone-stage";
import { updateBlock } from "./layout-ops";
import type { SlideLayout, ZoneId } from "./slide-layout";
import { Entries, PickerTarget, patchForPick, pickedImage, useEntries } from "./use-entries";
import slideEditorCss from "./styles/slide-editor.scss";

export { MAX_ITEMS };

/**
 * Eine Folie nimmt Bilder und Videos. Das Bild eines News-Beitrags bleibt ein
 * Bild: es ersetzt das Beitragsbild, und das ist nie ein Video.
 */
const SLIDE_MEDIA: MediaAccept = ["image", "video"];

const TARGET_NOUNS: Readonly<Record<PickerTarget, string>> = {
  image: "Bild",
  imagePortrait: "Hochformat-Bild",
  imageOverride: "Bühnenbild",
};

/** Titel der Mediathek-Leiste: wohin die Wahl geht, etwa „Bild für Folie 2“. */
export function mediaPanelTitle(target: PickerTarget, item: HeroItem, index: number): string {
  return `${TARGET_NOUNS[target]} für ${entryKindName(item)} ${index + 1}`;
}

/** Was die Bildfelder eines Eintrags nehmen. */
const acceptFor = (item: HeroItem | undefined): MediaAccept =>
  item !== undefined && isSlideItem(item) ? SLIDE_MEDIA : "images";

export interface SlideEditorProps {
  value: HeroEditorValue;
  onChange: (value: HeroEditorValue) => void;
  /** Das letzte gescheiterte Übernehmen; siehe `@shared/config-modal`. */
  shownIssues?: ShownIssues | null;
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
  onPickBlockImage: (blockId: string) => void;
}

/** Die Abschnitte des Formulars je Sorte, aus `editors/`. */
function EntryForm({ item, entries, source, onPick, onPickBlockImage }: EntryFormProps): ReactElement | null {
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
        onPickBlockImage={onPickBlockImage}
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

/** Kurz genug für einen Reiter im Panel rechts. */
const ENTRY_TAB_LABELS = { slide: "Folie", "news-post": "Beitrag", "news-channel": "Kanal" } as const;

export function entryTabLabel(item: HeroItem): string {
  return ENTRY_TAB_LABELS[heroItemType(item)];
}

interface EntryMainProps {
  entries: Entries;
  total: number;
  source: NewsSource;
}

/**
 * Die Hauptfläche: Kopf mit „Eintrag 1 von 4“, der Sorte und den Aktionen,
 * darunter groß die Bühne der gewählten Folie, live — das Widget ist durch
 * und durch visuell, eingestellt wird daneben im Panel (Reiter „Folie“).
 */
function EntryMain({ entries, total, source }: EntryMainProps): ReactElement {
  const { item, index, full } = entries;
  const layout = item !== undefined && isSlideItem(item) ? item.layout : undefined;
  const editing = useStageEditing(layout, (next: SlideLayout) => entries.patch({ layout: next }));
  if (item === undefined) {
    return <p className="px-10 py-6 text-sm text-muted-foreground">Wähle links einen Eintrag oder lege einen neuen an.</p>;
  }
  return (
    <div className="px-10 pt-6 pb-12 max-lg:px-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h2 className="text-xl font-semibold text-foreground">{`Eintrag ${index + 1} von ${total}`}</h2>
          <span className="text-[13px] text-muted-foreground" data-testid="entry-kind">
            {entryKindName(item)}
          </span>
          <ItemActions
            className="ml-auto"
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
        <div data-testid="entry-stage">
          <HeroEntryPreview item={item} source={source} editing={editing} />
        </div>
      </div>
    </div>
  );
}

/**
 * Mediathek und Ablegen für den gewählten Eintrag. Beides schreibt über
 * `patchItem` mit der Kennung des Eintrags: in die Folie, die gefragt hat,
 * auch wenn inzwischen eine andere gewählt ist.
 */
function useEditorMedia(client: MediaClient, entries: Entries) {
  const media = useMediaPanel(client);
  const { item, index, patchItem, patchWith } = entries;
  const accept = acceptFor(item);
  const place = (itemId: string, target: PickerTarget, picked: PickedMedia): void =>
    patchItem(itemId, patchForPick(target, pickedImage(picked)));
  const openBlockImage = (blockId: string): void => {
    if (item === undefined) return;
    const itemId = item.id;
    media.openMedia({
      title: "Bild für Baustein",
      accept: ["image"],
      onSelect: (picked) =>
        patchWith(itemId, (entry) => ({
          layout: updateBlock((entry as { layout?: SlideLayout }).layout, blockId, { image: pickedImage(picked) }),
        })),
    });
  };
  const open = (target: PickerTarget): void => {
    if (item === undefined) return;
    const itemId = item.id;
    media.openMedia({
      title: mediaPanelTitle(target, item, index),
      accept,
      onSelect: (picked) => place(itemId, target, picked),
    });
  };
  // `patchItem` bleibt stabil und liest selbst den jüngsten Stand: neu gebaut
  // wird der Kontext nur, wenn Client oder Medienart wechseln.
  const drop = useMemo<EditorMedia>(
    () => ({ client, accept, drop: (itemId, target, picked) => patchItem(itemId, patchForPick(target, pickedImage(picked))) }),
    [client, accept, patchItem],
  );
  return { open, openBlockImage, drop, overlay: media.overlay };
}

export function SlideEditor({ value, onChange, shownIssues = null, mediaClient, newsSource }: SlideEditorProps): ReactElement {
  const css = useHotStyle(slideEditorCss, "hero-slider-widget", "styles/slide-editor.scss");
  const client = useMemo(() => mediaClient ?? createMediaClient(), [mediaClient]);
  const source = useMemo(() => cacheNewsSource(newsSource ?? defaultNewsSource), [newsSource]);
  const { items } = value;
  // Die Einträge ändern sich über `useEntries`; das hält selbst den jüngsten
  // Stand der Liste, die Einstellungen kommen aus diesem Rendern.
  const entries = useEntries(items, (next) => onChange({ ...value, items: next }));
  const labels = useItemLabels(items, source);
  const media = useEditorMedia(client, entries);
  const { item } = entries;
  // Der gewählte Baustein gehört zu einer Folie; wechselt die Folie, ist keiner gewählt.
  const [picked, setPicked] = useState<{ itemId: string; blockId?: string; zone?: ZoneId } | null>(null);
  const current = picked !== null && picked.itemId === item?.id ? picked : null;
  const selection: BlockSelection = {
    selectedId: current?.blockId ?? null,
    select: (blockId) => setPicked(blockId === null || item === undefined ? null : { itemId: item.id, blockId }),
    selectedZone: current?.zone ?? null,
    selectZone: (zone) => setPicked(zone === null || item === undefined ? null : { itemId: item.id, zone }),
  };

  return (
    <div className="man-se" data-testid="slide-editor">
      <style>{css}</style>
      <EditorMediaContext.Provider value={media.drop}>
        <BlockSelectionProvider value={selection}>
        <ConfigWorkspace
          className="flex-1"
          sidebar={
            <EntrySidebar
              items={items}
              labels={labels}
              selectedId={item?.id}
              onSelect={entries.select}
              onAdd={entries.add}
              onReorder={entries.reorder}
            />
          }
          inspector={
            <WidgetSettingsPanel
              settings={value.settings}
              legacy={value.legacy}
              onChange={(settings) => onChange({ ...value, settings })}
              shownIssues={shownIssues}
              entryTab={
                item === undefined
                  ? undefined
                  : {
                      label: entryTabLabel(item),
                      content: (
                        <EntryForm item={item} entries={entries} source={source} onPick={media.open} onPickBlockImage={media.openBlockImage} />
                      ),
                      focusKey: selection.selectedId ?? selection.selectedZone,
                    }
              }
            />
          }
          inspectorTitle={item === undefined ? WIDGET_PANEL_TITLE : SETTINGS_PANEL_TITLE}
          preview={<HeroEntryPreview item={item} source={source} />}
        >
          <EntryMain entries={entries} total={items.length} source={source} />
        </ConfigWorkspace>
        </BlockSelectionProvider>
      </EditorMediaContext.Provider>
      {media.overlay}
    </div>
  );
}
