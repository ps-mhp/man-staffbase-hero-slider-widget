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

import {
  SlideImage,
  emptySlide,
  firstFrameUrl,
  mediaFromUrl,
  mediaKindFromUrl,
  newSlideId,
  parseMediaUrl,
  withMediaKind,
} from "./slides-model";

describe("emptySlide", () => {
  it("ist leer, aber unterscheidbar", () => {
    const first = emptySlide();
    const second = emptySlide();

    expect(first.headline).toBe("");
    expect(first.image.url).toBe("");
    expect(first.id).not.toBe(second.id);
  });
});

describe("newSlideId", () => {
  it("kommt ohne Web-Crypto aus \u2014 in unsicherem Kontext gibt es die API nicht", () => {
    const original = globalThis.crypto;
    // `randomUUID` fehlt auf http-Seiten; die Kennung muss trotzdem entstehen.
    Object.defineProperty(globalThis, "crypto", { value: undefined, configurable: true });
    try {
      expect(newSlideId()).not.toBe("");
      expect(newSlideId()).not.toBe(newSlideId());
    } finally {
      Object.defineProperty(globalThis, "crypto", { value: original, configurable: true });
    }
  });
});

describe("mediaKindFromUrl", () => {
  it("erkennt Videos an der Endung", () => {
    expect(mediaKindFromUrl("https://cdn.example.test/film.mp4")).toBe("video");
    expect(mediaKindFromUrl("https://cdn.example.test/film.WEBM")).toBe("video");
    expect(mediaKindFromUrl("https://cdn.example.test/film.mov?v=2#t=3")).toBe("video");
  });

  it("erkennt Bilder an der Endung", () => {
    expect(mediaKindFromUrl("https://cdn.example.test/bild.jpg")).toBe("image");
    expect(mediaKindFromUrl("https://cdn.example.test/bild.webp?w=1920")).toBe("image");
  });

  it("legt sich ohne erkennbare Endung nicht fest", () => {
    expect(mediaKindFromUrl("https://cdn.example.test/media/12345")).toBeUndefined();
    expect(mediaKindFromUrl("https://cdn.example.test/datei.pdf")).toBeUndefined();
    expect(mediaKindFromUrl("keine Adresse")).toBeUndefined();
  });
});

describe("parseMediaUrl", () => {
  it("nimmt eine vollständige https-Adresse ohne Leerraum an", () => {
    expect(parseMediaUrl("  https://cdn.example.test/film.mp4 ")).toBe(
      "https://cdn.example.test/film.mp4",
    );
  });

  it("weist halbe Rechnernamen und Adressen mit Zugangsdaten ab", () => {
    // Beim Tippen ist `https://e` schon eine gültige URL — aber noch keine Adresse.
    expect(parseMediaUrl("https://e")).toBeNull();
    expect(parseMediaUrl("https://nutzer:geheim@cdn.example.test/film.mp4")).toBeNull();
  });

  it("weist alles andere ab — auch http, das die Seite als gemischten Inhalt sperrt", () => {
    expect(parseMediaUrl("http://cdn.example.test/film.mp4")).toBeNull();
    expect(parseMediaUrl("javascript:alert(1)")).toBeNull();
    expect(parseMediaUrl("data:image/png;base64,AAAA")).toBeNull();
    expect(parseMediaUrl("/media/film.mp4")).toBeNull();
    expect(parseMediaUrl("https://")).toBeNull();
    expect(parseMediaUrl("")).toBeNull();
  });
});

describe("mediaFromUrl", () => {
  it("setzt ein Video, wenn die Endung eines verrät", () => {
    expect(mediaFromUrl(undefined, "https://cdn.example.test/film.mp4")).toEqual({
      url: "https://cdn.example.test/film.mp4",
      alt: "",
      kind: "video",
    });
  });

  it("behält die Beschreibung, verwirft aber die Maße des alten Bildes", () => {
    const current: SlideImage = {
      url: "https://cdn.example.test/alt.png",
      alt: "Werkhalle",
      width: 1920,
      height: 823,
    };
    expect(mediaFromUrl(current, "https://cdn.example.test/neu.jpg")).toEqual({
      url: "https://cdn.example.test/neu.jpg",
      alt: "Werkhalle",
    });
  });

  it("behält ohne erkennbare Endung die bisherige Sorte", () => {
    const video: SlideImage = { url: "https://cdn.example.test/a.mp4", alt: "", kind: "video" };
    expect(mediaFromUrl(video, "https://cdn.example.test/stream/1").kind).toBe("video");
    expect(mediaFromUrl(undefined, "https://cdn.example.test/stream/1").kind).toBeUndefined();
  });
});

describe("firstFrameUrl", () => {
  it("lässt ein Video beim ersten Bild stehen, statt schwarz zu bleiben", () => {
    expect(firstFrameUrl("https://cdn.example.test/film.mp4")).toBe(
      "https://cdn.example.test/film.mp4#t=0.001",
    );
  });

  it("lässt einen vorhandenen Anker in Ruhe", () => {
    expect(firstFrameUrl("https://cdn.example.test/film.mp4#t=4")).toBe(
      "https://cdn.example.test/film.mp4#t=4",
    );
  });
});

describe("withMediaKind", () => {
  it("schaltet zwischen Bild und Video um, ohne das Original zu verändern", () => {
    const image: SlideImage = { url: "https://cdn.example.test/x", alt: "A" };
    const video = withMediaKind(image, "video");

    expect(video).toEqual({ url: "https://cdn.example.test/x", alt: "A", kind: "video" });
    expect(image.kind).toBeUndefined();
    expect(withMediaKind(video, "image")).toEqual(image);
    expect("kind" in withMediaKind(video, "image")).toBe(false);
  });
});
