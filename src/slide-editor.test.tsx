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
 * Prüfungen des Redaktionsdialogs.
 *
 * Der Editor schreibt nichts selbst zurück — er meldet jede Änderung über
 * `onChange`. Geprüft wird deshalb durchweg, welche Folienliste dort ankommt.
 */

import * as React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MediaClient, MediaItem } from "@shared/media/media-client";
import { MAX_SLIDES, SlideEditor } from "./slide-editor";
import { Slide } from "./slides-model";

const mediaItem = (id: string): MediaItem => ({
  id,
  url: `https://cdn.example.test/${id}.png`,
  previewUrl: `https://cdn.example.test/${id}-preview.png`,
  fileName: `${id}.png`,
  type: "image",
  width: 1920,
  height: 823,
});

/** Ein Media-Client, der nur das kann, was der Editor von ihm verlangt. */
const stubMediaClient = (overrides: Partial<MediaClient> = {}): MediaClient =>
  ({
    listMedia: jest.fn(async () => ({ items: [mediaItem("a")], total: 1, nextOffset: null })),
    searchMedia: jest.fn(async () => ({ items: [], nextCursor: null })),
    uploadMedia: jest.fn(async () => mediaItem("up")),
    ensurePublicImageUrl: jest.fn(async (m: MediaItem) => m.url),
    currentUserId: jest.fn(async () => null),
    ...overrides,
  }) as unknown as MediaClient;

const slide = (id: string, extra: Partial<Slide> = {}): Slide => ({
  id,
  image: { url: `https://cdn.example.test/${id}.png`, alt: `Bild ${id}` },
  headline: `Überschrift ${id}`,
  ...extra,
});

interface Harness {
  onChange: jest.Mock<void, [Slide[]]>;
  onSave: jest.Mock;
  onClose: jest.Mock;
  /** Die Folienliste des jüngsten `onChange`. */
  latest: () => Slide[];
}

const setup = (value: Slide[], dirty = false): Harness => {
  const onChange = jest.fn<void, [Slide[]]>();
  const onSave = jest.fn();
  const onClose = jest.fn();

  render(
    <SlideEditor
      value={value}
      onChange={onChange}
      onSave={onSave}
      onClose={onClose}
      dirty={dirty}
      mediaClient={stubMediaClient()}
    />,
  );

  return {
    onChange,
    onSave,
    onClose,
    latest: () => onChange.mock.calls[onChange.mock.calls.length - 1]![0],
  };
};

describe("SlideEditor", () => {
  describe("Folienliste", () => {
    it("weist ohne Folien darauf hin, dass jede Folie ein Bild braucht", () => {
      setup([]);
      expect(screen.getByText(/mindestens ein Bild/i)).toBeInTheDocument();
    });

    it("listet alle Folien mit ihrer Überschrift", () => {
      setup([slide("a"), slide("b")]);
      expect(screen.getByTestId("slide-item-a")).toHaveTextContent("Überschrift a");
      expect(screen.getByTestId("slide-item-b")).toHaveTextContent("Überschrift b");
    });

    it("beschriftet eine Folie ohne Überschrift erkennbar", () => {
      setup([slide("a", { headline: "  " })]);
      expect(screen.getByTestId("slide-item-a")).toHaveTextContent("Ohne Überschrift");
    });

    it("fügt eine leere Folie hinzu", () => {
      const h = setup([slide("a")]);
      fireEvent.click(screen.getByTestId("slide-add"));

      const slides = h.latest();
      expect(slides).toHaveLength(2);
      expect(slides[1]!.image.url).toBe("");
    });

    it("verhindert mehr Folien als sinnvoll gezeigt werden können", () => {
      const many = Array.from({ length: MAX_SLIDES }, (_, i) => slide(`s${i}`));
      setup(many);

      expect(screen.getByTestId("slide-add")).toBeDisabled();
      expect(screen.getByTestId("slide-duplicate")).toBeDisabled();
    });

    it("dupliziert eine Folie mit eigener Kennung direkt dahinter", () => {
      const h = setup([slide("a"), slide("b")]);
      fireEvent.click(screen.getByTestId("slide-duplicate"));

      const slides = h.latest();
      expect(slides.map((s) => s.headline)).toEqual([
        "Überschrift a",
        "Überschrift a",
        "Überschrift b",
      ]);
      expect(slides[1]!.id).not.toBe("a");
    });

    it("löscht die gewählte Folie", () => {
      const h = setup([slide("a"), slide("b")]);
      fireEvent.click(screen.getByTestId("slide-remove"));

      expect(h.latest().map((s) => s.id)).toEqual(["b"]);
    });

    it("verschiebt eine Folie nach hinten", () => {
      const h = setup([slide("a"), slide("b")]);
      fireEvent.click(screen.getByTestId("slide-down"));

      expect(h.latest().map((s) => s.id)).toEqual(["b", "a"]);
    });

    it("sperrt das Verschieben an den Rändern", () => {
      setup([slide("a"), slide("b")]);
      expect(screen.getByTestId("slide-up")).toBeDisabled();
      expect(screen.getByTestId("slide-down")).toBeEnabled();
    });
  });

  describe("Felder", () => {
    it("übernimmt eine geänderte Überschrift", () => {
      const h = setup([slide("a")]);
      fireEvent.change(screen.getByTestId("slide-headline"), { target: { value: "Neu" } });

      expect(h.latest()[0]!.headline).toBe("Neu");
    });

    it("löscht eine geleerte Unterzeile aus der Folie", () => {
      const h = setup([slide("a", { subline: "Alt" })]);
      fireEvent.change(screen.getByTestId("slide-subline"), { target: { value: "" } });

      expect(h.latest()[0]!.subline).toBeUndefined();
    });

    it("ändert die Bildbeschreibung ohne das Bild anzutasten", () => {
      const h = setup([slide("a")]);
      fireEvent.change(screen.getByTestId("slide-image-alt"), { target: { value: "Ein LKW" } });

      expect(h.latest()[0]!.image).toEqual({
        url: "https://cdn.example.test/a.png",
        alt: "Ein LKW",
      });
    });
  });

  describe("Schaltfläche", () => {
    it("hält eine halb ausgefüllte Schaltfläche fest, statt sie zu verwerfen", () => {
      const h = setup([slide("a")]);
      fireEvent.change(screen.getByTestId("slide-cta-label"), { target: { value: "Mehr" } });

      expect(h.latest()[0]!.cta).toEqual({ label: "Mehr", href: "" });
    });

    it("entfernt die Schaltfläche, sobald beide Felder leer sind", () => {
      const h = setup([slide("a", { cta: { label: "Mehr", href: "" } })]);
      fireEvent.change(screen.getByTestId("slide-cta-label"), { target: { value: "" } });

      expect(h.latest()[0]!.cta).toBeUndefined();
    });

    it("merkt sich das Öffnen in neuem Tab", () => {
      const h = setup([
        slide("a", { cta: { label: "Mehr", href: "https://example.test" } }),
      ]);
      fireEvent.click(screen.getByTestId("slide-cta-newtab"));

      expect(h.latest()[0]!.cta).toEqual({
        label: "Mehr",
        href: "https://example.test",
        newTab: true,
      });
    });
  });

  describe("Bildauswahl", () => {
    it("bietet für eine Folie ohne Bild eine leere Kachel an", () => {
      setup([slide("a", { image: { url: "", alt: "" } })]);
      expect(screen.getByTestId("slide-image-pick")).toBeInTheDocument();
      expect(screen.queryByTestId("slide-image-thumb")).not.toBeInTheDocument();
    });

    it("übernimmt ein gewähltes Bild samt Maßen", async () => {
      const h = setup([slide("a", { image: { url: "", alt: "" } })]);
      fireEvent.click(screen.getByTestId("slide-image-pick"));

      const tile = await screen.findByAltText("a.png");
      fireEvent.click(tile);

      await waitFor(() => expect(h.onChange).toHaveBeenCalled());
      expect(h.latest()[0]!.image).toMatchObject({
        url: "https://cdn.example.test/a.png",
        width: 1920,
        height: 823,
      });
    });

    it("entfernt das Hochformat-Bild wieder", () => {
      const h = setup([
        slide("a", { imagePortrait: { url: "https://cdn.example.test/hoch.png", alt: "" } }),
      ]);
      fireEvent.click(screen.getByTestId("slide-portrait-clear"));

      expect(h.latest()[0]!.imagePortrait).toBeUndefined();
    });

    it("bietet für das Hauptbild kein Entfernen an — ohne Bild gibt es keine Folie", () => {
      setup([slide("a")]);
      expect(screen.queryByTestId("slide-image-clear")).not.toBeInTheDocument();
    });
  });

  describe("Fußzeile", () => {
    it("benennt ungesicherte Änderungen", () => {
      setup([slide("a")], true);
      expect(screen.getByText("Ungesicherte Änderungen")).toBeInTheDocument();
    });

    it("reicht Übernehmen und Abbrechen weiter", () => {
      const h = setup([slide("a")]);

      fireEvent.click(screen.getByTestId("slide-editor-save"));
      expect(h.onSave).toHaveBeenCalled();

      fireEvent.click(screen.getByTestId("slide-editor-cancel"));
      expect(h.onClose).toHaveBeenCalled();
    });
  });
});
