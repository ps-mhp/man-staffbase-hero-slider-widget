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
 * Die linke Spalte des Folien-Editors: alle Einträge in Bühnenreihenfolge,
 * „Neu“ mit den drei Sorten, Sortieren per Ziehen.
 *
 * Die Liste behandelt alle drei Sorten gleich — Reihenfolge, Duplizieren und
 * Löschen gehören zum Eintrag, nicht zu seiner Sorte. Jede Zeile wie im
 * Screen: Vorschaubild (bei News das Beitragsbild, sonst das Zeichen der
 * Sorte), Titel und „Sorte · Erkennungszeichen“. Fehlerhafte Einträge
 * zeigt sie erst, wenn der Rahmen es sagt (nach einem gescheiterten
 * „Übernehmen“): eine frisch angelegte Folie ist noch kein Fehler.
 */

import * as React from "react";
import { ReactElement } from "react";
import { ImageIcon, Newspaper, Rss } from "lucide-react";
import type { IconComponent } from "@man/config-ui/form/segmented";
import { useConfigShell } from "@man/config-ui/shell/shell-context";
import { ItemList, type ListItem } from "@man/config-ui/sidebar/item-list";
import { SidebarPanel, type SidebarAddOption } from "@man/config-ui/sidebar/sidebar-panel";

import { MAX_ITEMS, missingPart } from "../editor-entries";
import { HeroItem, HeroItemType, emptyNewsChannelItem, emptyNewsPostItem } from "../hero-items";
import { emptySlide, firstFrameUrl } from "../slides-model";
import { ItemLabel } from "./item-label";

export interface EntrySidebarProps {
  items: HeroItem[];
  labels: ItemLabel[];
  selectedId: string | undefined;
  onSelect: (id: string) => void;
  onAdd: (fresh: HeroItem) => void;
  onReorder: (ids: string[]) => void;
}

const EMPTY_STATE = (
  <>
    Noch kein Eintrag. Lege über <strong>Neu</strong> eine eigene Folie an oder hole einen
    Beitrag aus den News.
  </>
);

/** Dasselbe Zeichen wie im Menü „Neu“. */
const KIND_ICONS: Readonly<Record<HeroItemType, IconComponent>> = {
  slide: ImageIcon,
  "news-post": Newspaper,
  "news-channel": Rss,
};

/** Bild, erstes Videobild oder – ohne Bild – das Zeichen der Sorte. */
function EntryThumb({ label }: { label: ItemLabel | undefined }): ReactElement {
  if (label?.thumbUrl === undefined) {
    const Icon = KIND_ICONS[label?.type ?? "slide"];
    return <Icon className="size-4 text-muted-foreground" aria-hidden />;
  }
  return label.thumbVideo ? (
    <video className="size-full object-cover" src={firstFrameUrl(label.thumbUrl)} muted preload="metadata" />
  ) : (
    <img src={label.thumbUrl} alt="" />
  );
}

function listItems(items: HeroItem[], labels: ItemLabel[], issuesVisible: boolean): ListItem[] {
  return items.map((item, position) => {
    const label = labels[position];
    const kind = label?.kind ?? "Eintrag";
    const missing = issuesVisible ? missingPart(item) : undefined;
    return {
      id: item.id,
      label: label?.title ?? kind,
      description: missing === undefined ? (label?.description ?? kind) : `${kind} · ${missing}`,
      thumbnail: <EntryThumb label={label} />,
      invalid: missing !== undefined,
    };
  });
}

/** Der Nachsatz sagt, wofür die Sorte gut ist; ohne ihn müsste man alle drei anlegen, um es zu sehen. */
function addOptions(onAdd: (fresh: HeroItem) => void): SidebarAddOption[] {
  return [
    {
      id: "slide",
      label: "Folie",
      description: "Bild oder Video mit Text und Buttons",
      icon: ImageIcon,
      onSelect: () => onAdd(emptySlide()),
    },
    {
      id: "news-post",
      label: "News-Beitrag",
      description: "Ein Beitrag aus einem Kanal",
      icon: Newspaper,
      onSelect: () => onAdd(emptyNewsPostItem()),
    },
    {
      id: "news-channel",
      label: "News-Kanal",
      description: "Die neuesten Beiträge eines Kanals, je eine Folie",
      icon: Rss,
      onSelect: () => onAdd(emptyNewsChannelItem()),
    },
  ];
}

export function EntrySidebar({
  items,
  labels,
  selectedId,
  onSelect,
  onAdd,
  onReorder,
}: EntrySidebarProps): ReactElement {
  const { issuesVisible } = useConfigShell();
  // An der Grenze sperrt `SidebarPanel` den Knopf selbst und öffnet kein Menü.
  return (
    <SidebarPanel title="Einträge" count={items.length} max={MAX_ITEMS} addLabel="Neu" addMenu={addOptions(onAdd)}>
      <ItemList
        aria-label="Einträge"
        items={listItems(items, labels, issuesVisible)}
        selectedId={selectedId}
        onSelect={onSelect}
        onReorder={onReorder}
        emptyState={EMPTY_STATE}
      />
    </SidebarPanel>
  );
}
