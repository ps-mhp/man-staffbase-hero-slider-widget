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

import { decodePayload, encodePayload } from "@shared/payload";

import { encodeHeroItemsAttribute, parseHeroItems } from "./hero-items";
import {
  encodeHeroContent,
  parseHeroContent,
  parseHeroSettings,
  resolveHeroOptions,
} from "./hero-settings";
import { Slide } from "./slides-model";

const slide = (id: string): Slide => ({
  id,
  image: { url: `https://cdn.example.test/${id}.png`, alt: "" },
  headline: `Überschrift ${id}`,
});

const rawList = (raw: string): unknown[] => JSON.parse(decodePayload(raw) ?? raw) as unknown[];

describe("parseHeroSettings", () => {
  it("nimmt jede bekannte Einstellung", () => {
    expect(
      parseHeroSettings({
        type: "settings",
        height: "large",
        fullBleed: false,
        autoplayDelay: 8,
        position: "pre",
        controls: false,
        bottomSpacing: "none",
      }),
    ).toEqual({
      height: "large",
      fullBleed: false,
      autoplayDelay: 8,
      position: "pre",
      controls: false,
      bottomSpacing: "none",
    });
  });

  it("lässt Unbrauchbares weg, damit das alte Attribut gilt", () => {
    expect(
      parseHeroSettings({
        type: "settings",
        height: "riesig",
        fullBleed: "false",
        autoplayDelay: 45,
        position: "oben",
        controls: 0,
        bottomSpacing: "",
      }),
    ).toEqual({});
    expect(parseHeroSettings({ type: "settings", autoplayDelay: -1 })).toEqual({});
  });
});

describe("parseHeroContent", () => {
  it("liest alte Bühnen ohne Einstellungen wie bisher", () => {
    const raw = JSON.stringify([{ id: "a", image: { url: "https://cdn.example.test/a.png", alt: "" }, headline: "A" }]);

    const content = parseHeroContent(raw);

    expect(content.settings).toEqual({});
    expect(content.items).toEqual(parseHeroItems(raw));
  });

  it("trennt Einträge und Einstellungen", () => {
    const raw = encodePayload(
      JSON.stringify([
        { id: "a", image: { url: "https://cdn.example.test/a.png", alt: "" }, headline: "A" },
        { type: "settings", height: "small", controls: false },
      ]),
    );

    const content = parseHeroContent(raw);

    expect(content.items.map((item) => item.id)).toEqual(["a"]);
    expect(content.settings).toEqual({ height: "small", controls: false });
  });

  it("zählt den Einstellungs-Eintrag nie als Eintrag der Bühne", () => {
    const raw = encodeHeroContent({ items: [slide("a")], settings: { height: "large" } });

    expect(parseHeroItems(raw).map((item) => item.id)).toEqual(["a"]);
  });

  it("liest nichts aus etwas, das keine Liste ist", () => {
    expect(parseHeroContent("{}")).toEqual({ items: [], settings: {} });
    expect(parseHeroContent(undefined)).toEqual({ items: [], settings: {} });
  });
});

describe("encodeHeroContent", () => {
  it("schreibt ohne Einstellungen Zeichen für Zeichen, was bisher stand", () => {
    const items = [slide("a"), slide("b")];

    expect(encodeHeroContent({ items, settings: {} })).toBe(encodeHeroItemsAttribute(items));
  });

  it("hängt die Einstellungen als eigenen Eintrag ans Ende", () => {
    const raw = encodeHeroContent({ items: [slide("a")], settings: { autoplayDelay: 0, fullBleed: false } });

    expect(rawList(raw)[1]).toEqual({ type: "settings", fullBleed: false, autoplayDelay: 0 });
  });

  it("übersteht die Rundreise", () => {
    const content = {
      items: [slide("a")],
      settings: { height: "viewport", position: "pre", bottomSpacing: "none" } as const,
    };

    expect(parseHeroContent(encodeHeroContent(content))).toEqual(content);
  });

  it("bleibt für ältere Fassungen lesbar: der Eintrag ist eine Folie ohne Bild", () => {
    // So las `parseHeroItems` bis 0.4: alles ohne bekanntes `type` als Folie,
    // und eine Folie ohne Bild fällt weg.
    const [, entry] = rawList(encodeHeroContent({ items: [slide("a")], settings: { height: "small" } })) as Record<
      string,
      unknown
    >[];

    expect(entry).not.toHaveProperty("image");
  });
});

describe("resolveHeroOptions", () => {
  const attrs = {
    height: "small",
    "full-bleed": "false",
    "autoplay-delay": "7",
    position: "pre",
    controls: false,
    "bottom-spacing": "none",
  };

  it("nimmt ohne Einstellungen die alten Attribute", () => {
    expect(resolveHeroOptions({}, attrs)).toEqual({
      height: "small",
      fullBleed: false,
      autoplayDelayMs: 7000,
      position: "pre",
      controls: false,
      bottomSpacing: "none",
    });
  });

  it("lässt jede gesetzte Einstellung vor dem alten Attribut gelten, einzeln", () => {
    expect(resolveHeroOptions({ height: "large", autoplayDelay: 0 }, attrs)).toEqual({
      height: "large",
      fullBleed: false,
      autoplayDelayMs: 0,
      position: "pre",
      controls: false,
      bottomSpacing: "none",
    });
  });

  it("fällt ohne beides auf die Vorgaben zurück", () => {
    expect(resolveHeroOptions({}, {})).toEqual({
      height: "section",
      fullBleed: true,
      autoplayDelayMs: 5000,
      position: "post",
      controls: true,
      bottomSpacing: "default",
    });
  });
});
