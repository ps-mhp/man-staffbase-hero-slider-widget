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
 * Die Naht zwischen Bühne und Messung.
 *
 * jsdom rechnet kein Layout, eine echte Messung ergibt hier also nie eine
 * Höhe. Geprüft wird deshalb, was die Bühne der Messung übergibt und was sie
 * aus deren Meldung macht — `usePageTop` steht dafür als Doppel ein.
 */

import * as React from "react";
import { act, render, screen } from "@testing-library/react";
import { PageTopLayout, PageTopOptions } from "./page-top";
import { HeroSlider } from "./hero-slider";
import { Slide } from "./slides-model";

jest.mock("./page-top", () => ({
  ...jest.requireActual("./page-top"),
  usePageTop: jest.fn(),
}));

const { usePageTop } = jest.requireMock("./page-top") as {
  usePageTop: jest.Mock<void, [PageTopOptions]>;
};

/** Die Angaben des letzten Bildaufbaus. */
function lastOptions(): PageTopOptions {
  const call = usePageTop.mock.calls.at(-1);
  if (call === undefined) throw new Error("usePageTop wurde nicht gerufen");
  return call[0];
}

/** Eine Meldung der Messung, wie sie im Browser nach einem Durchlauf käme. */
function report(layout: PageTopLayout): void {
  act(() => {
    lastOptions().onLayout?.(layout);
  });
}

const slide = (id: string): Slide => ({
  id,
  image: { url: `https://example.test/${id}.jpg`, alt: `Bild ${id}` },
  headline: `Überschrift ${id}`,
});

const two = [slide("a"), slide("b")];

afterEach(() => {
  usePageTop.mockClear();
  document.body.innerHTML = "";
});

describe("HeroSlider — was gemessen wird", () => {
  it("übergibt die Bühne selbst, nicht den Kasten mit dem Platzhalter", () => {
    const { container } = render(<HeroSlider slides={two} position="pre" />);

    const stage = screen.getByTestId("hero-slider");
    const host = container.querySelector(".man-hero-host");
    expect(lastOptions().host).toBe(stage);
    expect(lastOptions().host).not.toBe(host);
  });

  it("misst eine Kante, unter der der Platzhalter liegt", () => {
    render(<HeroSlider slides={two} position="pre" />);
    report({ applied: true, breadcrumbsHeight: 48 });

    const measured = lastOptions().host as HTMLElement;
    const space = document.querySelector(".man-hero__crumb-space");
    expect(space).not.toBeNull();
    // Läge der Platzhalter im gemessenen Kasten, wanderte dessen Unterkante
    // um seine eigene Höhe nach unten — die Brotkrumen landeten eine
    // Brotkrumenhöhe zu tief.
    expect(measured.contains(space)).toBe(false);
  });

  it("gibt die Bühne nicht mehr an, sobald es keine gibt", () => {
    const { rerender } = render(<HeroSlider slides={two} position="pre" />);
    expect(lastOptions().host).not.toBeNull();

    rerender(<HeroSlider slides={[]} position="pre" />);
    expect(lastOptions().host).toBeNull();
  });
});

describe("HeroSlider — Hinweis im Editor", () => {
  /** Der Zustand des klassischen Editors (`EDITOR_MARKER_SELECTOR`). */
  function openEditor(): void {
    const marker = document.createElement("div");
    marker.setAttribute("data-react-values", "{}");
    document.body.appendChild(marker);
  }

  it("macht aus einer Messung ohne Bühne keinen Rückfall", () => {
    openEditor();
    render(<HeroSlider slides={two} position="pre" />);

    // Vor dem ersten Bildaufbau gibt es die Bühne noch nicht; die Messung
    // läuft dann ohne Kasten und meldet zwangsläufig einen Rückfall.
    const first = usePageTop.mock.calls[0][0];
    expect(first.host).toBeNull();
    act(() => first.onLayout?.({ applied: false, breadcrumbsHeight: 0 }));
    expect(screen.queryByTestId("hero-position-notice")).toBeNull();

    // Mit Bühne zählt dieselbe Meldung.
    report({ applied: false, breadcrumbsHeight: 0 });
    expect(screen.getByTestId("hero-position-notice")).toBeInTheDocument();
  });
});

describe("HeroSlider — Platz für die verschobenen Brotkrumen", () => {
  /** Ein Abschnitt des neuen Editors; nur in ihm nimmt die Bühne dessen Höhe. */
  function addSection(): HTMLElement {
    const section = document.createElement("div");
    section.dataset.c13yComponent = "section-block";
    section.appendChild(document.createElement("div"));
    document.body.appendChild(section);
    return section.firstElementChild as HTMLElement;
  }

  it("hält die gemeldete Höhe frei und gibt sie wieder her", () => {
    const { container } = render(<HeroSlider slides={two} position="pre" />);

    report({ applied: true, breadcrumbsHeight: 48 });
    const space = container.querySelector<HTMLElement>(".man-hero__crumb-space");
    expect(space).not.toBeNull();
    expect(space?.style.height).toBe("48px");

    report({ applied: true, breadcrumbsHeight: 0 });
    expect(container.querySelector(".man-hero__crumb-space")).toBeNull();
  });

  it("hält den Platz im Abschnitt am Wirtskasten frei, nicht in ihm", () => {
    const { container } = render(<HeroSlider slides={two} position="pre" height="section" />, {
      container: addSection(),
    });

    report({ applied: true, breadcrumbsHeight: 48 });

    // Der Wirtskasten steht hier auf der Höhe des Abschnitts; ein Platzhalter
    // in ihm hielte nichts frei, sondern liefe über seine Unterkante hinaus.
    const host = container.querySelector<HTMLElement>(".man-hero-host");
    expect(host).toHaveClass("man-hero-host--fill");
    expect(container.querySelector(".man-hero__crumb-space")).toBeNull();
    expect(host?.style.marginBottom).toBe("48px");

    // Der Abstand darf nicht in die Messung zurücklaufen: gemessen wird die
    // Bühne, und die liegt im Wirtskasten, nicht an seiner Aussenkante.
    expect(lastOptions().host).not.toBe(host);

    report({ applied: true, breadcrumbsHeight: 0 });
    expect(host?.style.marginBottom).toBe("");
  });

  it("lässt den Wirtskasten ohne Brotkrumen unangetastet", () => {
    const { container } = render(<HeroSlider slides={two} />, { container: addSection() });

    expect(container.querySelector(".man-hero-host")?.getAttribute("style")).toBeNull();
  });
});
