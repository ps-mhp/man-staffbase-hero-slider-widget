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

describe("HeroSlider — Platz für die verschobenen Brotkrumen", () => {
  it("hält die gemeldete Höhe frei und gibt sie wieder her", () => {
    const { container } = render(<HeroSlider slides={two} position="pre" />);

    report({ applied: true, breadcrumbsHeight: 48 });
    const space = container.querySelector<HTMLElement>(".man-hero__crumb-space");
    expect(space).not.toBeNull();
    expect(space?.style.height).toBe("48px");

    report({ applied: true, breadcrumbsHeight: 0 });
    expect(container.querySelector(".man-hero__crumb-space")).toBeNull();
  });
});
