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
 * Die Regeln der Eintragsliste ohne Renderer: Prüfen, Verschieben,
 * Duplizieren, Löschen und Umsortieren.
 */

import { HeroItem, NewsChannelItem, NewsPostItem } from "./hero-items";
import {
  changesStatus,
  duplicateEntry,
  entriesStatus,
  entryKindName,
  moveEntry,
  removeEntry,
  reorderEntries,
  validateHeroItems,
} from "./editor-entries";
import { Slide } from "./slides-model";

const slide = (id: string, url = `https://cdn.example.test/${id}.png`): Slide => ({
  id,
  image: { url, alt: "" },
  headline: `Überschrift ${id}`,
});

const post = (id: string, postId = "p1"): NewsPostItem => ({
  type: "news-post",
  id,
  channelId: "c1",
  postId,
});

const channel = (id: string, channelId = "c1"): NewsChannelItem => ({
  type: "news-channel",
  id,
  channelId,
  count: 3,
  order: "newest",
});

const ids = (items: HeroItem[]): string[] => items.map((item) => item.id);

describe("validateHeroItems", () => {
  it("findet an vollständigen Einträgen nichts", () => {
    expect(validateHeroItems([slide("a"), post("b"), channel("c")])).toEqual([]);
    expect(validateHeroItems([])).toEqual([]);
  });

  it("meldet eine Folie ohne Bild mit ihrer Stelle in der Liste", () => {
    expect(validateHeroItems([post("b"), slide("a", "  ")])).toEqual([
      { id: "a", message: "Folie 2: Bild fehlt" },
    ]);
  });

  it("meldet einen News-Beitrag ohne Beitrag und einen Kanal ohne Kanal", () => {
    expect(validateHeroItems([post("b", ""), slide("a"), channel("c", "")])).toEqual([
      { id: "b", message: "News-Beitrag 1: Beitrag fehlt" },
      { id: "c", message: "News-Kanal 3: Kanal fehlt" },
    ]);
  });
});

describe("entriesStatus", () => {
  it("zählt die Einträge in Worten", () => {
    expect(entriesStatus([])).toBe("Keine Einträge");
    expect(entriesStatus([slide("a")])).toBe("1 Eintrag");
    expect(entriesStatus([slide("a"), post("b"), channel("c")])).toBe("3 Einträge");
  });
});

describe("changesStatus", () => {
  const saved: HeroItem[] = [slide("a"), post("b"), channel("c")];

  it("zählt einen geänderten Eintrag", () => {
    const draft = [{ ...slide("a"), headline: "Neu" }, post("b"), channel("c")];
    expect(changesStatus(draft, saved)).toBe("1 Eintrag geändert");
  });

  it("zählt neue und gelöschte Einträge mit", () => {
    expect(changesStatus([slide("a"), post("b"), slide("d")], saved)).toBe("2 Einträge geändert");
  });

  it("nennt eine reine Umsortierung als solche", () => {
    expect(changesStatus([post("b"), slide("a"), channel("c")], saved)).toBe("Reihenfolge geändert");
  });

  it("fällt ohne Unterschied auf die Zahl der Einträge zurück", () => {
    expect(changesStatus([slide("a"), post("b"), channel("c")], saved)).toBe("3 Einträge");
  });
});

describe("entryKindName", () => {
  it("nennt die Sorte so wie das Menü „Neu“", () => {
    expect(entryKindName(slide("a"))).toBe("Folie");
    expect(entryKindName(post("b"))).toBe("News-Beitrag");
    expect(entryKindName(channel("c"))).toBe("News-Kanal");
  });
});

describe("Listenoperationen", () => {
  const items: HeroItem[] = [slide("a"), slide("b"), slide("c")];

  it("verschiebt einen Eintrag und lässt das Original stehen", () => {
    expect(ids(moveEntry(items, 0, 2))).toEqual(["b", "c", "a"]);
    expect(ids(items)).toEqual(["a", "b", "c"]);
  });

  it("gibt am Rand dieselbe Liste zurück", () => {
    expect(moveEntry(items, 0, -1)).toBe(items);
    expect(moveEntry(items, 2, 3)).toBe(items);
  });

  it("dupliziert direkt dahinter mit eigener Kennung", () => {
    const next = duplicateEntry(items, 1);

    expect(next.map((item) => (item as Slide).headline)).toEqual([
      "Überschrift a",
      "Überschrift b",
      "Überschrift b",
      "Überschrift c",
    ]);
    expect(next[2]!.id).not.toBe("b");
    expect(items).toHaveLength(3);
  });

  it("löscht den Eintrag an der Stelle", () => {
    expect(ids(removeEntry(items, 1))).toEqual(["a", "c"]);
  });

  it("sortiert nach der Folge der Kennungen", () => {
    expect(ids(reorderEntries(items, ["c", "a", "b"]))).toEqual(["c", "a", "b"]);
  });

  it("verliert beim Sortieren keinen Eintrag, den die Folge nicht kennt", () => {
    expect(ids(reorderEntries(items, ["c", "x"]))).toEqual(["c", "a", "b"]);
  });
});
