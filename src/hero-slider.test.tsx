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
 * Prüfungen der Leseansicht.
 *
 * Der Zustandsautomat ist in `use-slider.test.ts` bereits für sich geprüft;
 * hier geht es um das, was daraus im DOM wird — Markup, ARIA, Bildregie und
 * die Bedienung mit Zeiger, Taste und Finger.
 */

import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { HeroSlider } from "./hero-slider";
import { Slide } from "./slides-model";

const slide = (id: string, extra: Partial<Slide> = {}): Slide => ({
  id,
  image: { url: `https://example.test/${id}.jpg`, alt: `Bild ${id}` },
  headline: `Überschrift ${id}`,
  ...extra,
});

const two = [slide("a"), slide("b")];

describe("HeroSlider", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Rendern", () => {
    it("rendert ohne Slides nichts", () => {
      const { container } = render(<HeroSlider slides={[]} />);
      expect(container.querySelector(".man-hero")).toBeNull();
    });

    it("zeigt Überschrift, Unterzeile und Schaltfläche eines Slides", () => {
      render(
        <HeroSlider
          slides={[
            slide("a", {
              subline: "Die Unterzeile",
              cta: { label: "Mehr erfahren", href: "https://example.test/ziel" },
            }),
          ]}
        />,
      );

      expect(screen.getByText("Überschrift a")).toBeInTheDocument();
      expect(screen.getByText("Die Unterzeile")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Mehr erfahren" })).toHaveAttribute(
        "href",
        "https://example.test/ziel",
      );
    });

    it("lässt eine leere Überschrift weg statt eine leere Zeile zu rendern", () => {
      const { container } = render(<HeroSlider slides={[slide("a", { headline: "" })]} />);
      expect(container.querySelector(".man-hero__headline")).toBeNull();
    });

    it("öffnet eine Schaltfläche mit newTab in neuem Tab und schützt den Opener", () => {
      render(
        <HeroSlider
          slides={[
            slide("a", {
              cta: { label: "Extern", href: "https://example.test/x", newTab: true },
            }),
          ]}
        />,
      );

      const link = screen.getByRole("link", { name: "Extern" });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Bildregie", () => {
    it("lädt nur den ersten Slide vorrangig", () => {
      const { container } = render(<HeroSlider slides={two} />);
      const images = container.querySelectorAll("img");

      expect(images[0]).toHaveAttribute("loading", "eager");
      expect(images[1]).toHaveAttribute("loading", "lazy");
    });

    it("bietet den Hochkant-Zuschnitt nur auf schmalen, stehenden Schirmen an", () => {
      const { container } = render(
        <HeroSlider
          slides={[
            slide("a", {
              imagePortrait: { url: "https://example.test/a-hoch.jpg", alt: "Bild a" },
            }),
          ]}
        />,
      );

      const source = container.querySelector("source");
      expect(source).toHaveAttribute("media", "(orientation: portrait) and (max-width: 767px)");
      expect(source).toHaveAttribute("srcset", "https://example.test/a-hoch.jpg");
    });

    it("rendert ohne Hochkant-Zuschnitt gar keine source", () => {
      const { container } = render(<HeroSlider slides={[slide("a")]} />);
      expect(container.querySelector("source")).toBeNull();
    });
  });

  describe("Ausbruch", () => {
    it("bricht nach Vorgabe aus und misst Kante und Fensterbreite ohne Scrollbar", () => {
      Object.defineProperty(document.documentElement, "clientWidth", {
        value: 1234,
        configurable: true,
      });

      const { container } = render(<HeroSlider slides={[slide("a")]} />);
      const host = container.querySelector(".man-hero-host") as HTMLElement;
      host.getBoundingClientRect = () =>
        ({ left: 150, top: 175, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0 }) as DOMRect;
      // Der Effekt misst beim Einhängen; jsdom kennt zu dem Zeitpunkt noch
      // keine Masse, deshalb wird die Messung nach dem Setzen wiederholt.
      act(() => {
        window.dispatchEvent(new Event("resize"));
      });

      const root = container.querySelector(".man-hero") as HTMLElement;
      expect(root).toHaveClass("man-hero--bleed");
      expect(root.style.getPropertyValue("--man-hero-vw")).toBe("1234px");
      expect(root.style.getPropertyValue("--man-hero-pull")).toBe("-150px");
      expect(root.style.getPropertyValue("--man-hero-header")).toBe("175px");
    });

    it("lässt die Breite in Ruhe, wenn der Ausbruch abgeschaltet ist", () => {
      const { container } = render(<HeroSlider slides={[slide("a")]} fullBleed={false} />);
      const root = container.querySelector(".man-hero") as HTMLElement;

      expect(root).not.toHaveClass("man-hero--bleed");
      expect(root.style.getPropertyValue("--man-hero-vw")).toBe("");
    });

    it("bricht nicht aus, wenn ein Vorfahr wirklich scrollt", () => {
      const scroller = document.createElement("div");
      scroller.style.overflowX = "hidden";
      Object.defineProperty(scroller, "scrollHeight", { value: 4000, configurable: true });
      Object.defineProperty(scroller, "clientHeight", { value: 800, configurable: true });
      document.body.appendChild(scroller);

      // Eine an beiden Rändern angeschnittene Bühne ist kaputt; eine in
      // Spaltenbreite ist bloss schmaler.
      const { container } = render(<HeroSlider slides={[slide("a")]} />, { container: scroller });
      expect(container.querySelector(".man-hero")).not.toHaveClass("man-hero--bleed");
    });
  });

  describe("Mehrere Folien", () => {
    it("kennzeichnet die Bühne, damit der Text der Bedienleiste ausweicht", () => {
      // Text und Bedienleiste liegen in getrennten absoluten Ebenen und
      // wüssten sonst nichts voneinander — sie lägen beide unten links.
      const { container } = render(<HeroSlider slides={[slide("a"), slide("b")]} />);
      expect(container.querySelector(".man-hero")).toHaveClass("man-hero--many");
    });

    it("verzichtet bei einer einzigen Folie darauf", () => {
      const { container } = render(<HeroSlider slides={[slide("a")]} />);
      expect(container.querySelector(".man-hero")).not.toHaveClass("man-hero--many");
    });
  });

  describe("Höhe", () => {    it("verwendet ohne Angabe die Stufe der CI-Spec", () => {
      const { container } = render(<HeroSlider slides={[slide("a")]} />);
      expect(container.querySelector(".man-hero")).toHaveClass("man-hero--height-medium");
    });

    it("übernimmt eine gewählte Stufe", () => {
      const { container } = render(<HeroSlider slides={[slide("a")]} height="viewport" />);
      expect(container.querySelector(".man-hero")).toHaveClass("man-hero--height-viewport");
    });
  });

  describe("Bedienelemente", () => {
    it("zeigt bei einem einzigen Slide keine Steuerung", () => {
      const { container } = render(<HeroSlider slides={[slide("a")]} />);
      expect(container.querySelector(".man-hero__controls")).toBeNull();
      expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    });

    it("schaltet mit den Pfeilen weiter und zurück", () => {
      render(<HeroSlider slides={two} autoplayDelayMs={0} />);

      const dots = screen.getAllByRole("tab");
      expect(dots[0]).toHaveAttribute("aria-selected", "true");

      fireEvent.click(screen.getByTestId("hero-next"));
      expect(screen.getAllByRole("tab")[1]).toHaveAttribute("aria-selected", "true");

      fireEvent.click(screen.getByTestId("hero-prev"));
      expect(screen.getAllByRole("tab")[0]).toHaveAttribute("aria-selected", "true");
    });

    it("springt über einen Strich direkt zum Slide", () => {
      render(<HeroSlider slides={[...two, slide("c")]} autoplayDelayMs={0} />);

      fireEvent.click(screen.getByTestId("hero-dot-c"));
      expect(screen.getAllByRole("tab")[2]).toHaveAttribute("aria-selected", "true");
    });

    it("blättert mit den Pfeiltasten", () => {
      const { container } = render(<HeroSlider slides={two} autoplayDelayMs={0} />);
      const root = container.querySelector(".man-hero") as HTMLElement;

      fireEvent.keyDown(root, { key: "ArrowRight" });
      expect(screen.getAllByRole("tab")[1]).toHaveAttribute("aria-selected", "true");

      fireEvent.keyDown(root, { key: "ArrowLeft" });
      expect(screen.getAllByRole("tab")[0]).toHaveAttribute("aria-selected", "true");
    });

    it("lässt andere Tasten unbehelligt", () => {
      const { container } = render(<HeroSlider slides={two} autoplayDelayMs={0} />);
      const root = container.querySelector(".man-hero") as HTMLElement;

      fireEvent.keyDown(root, { key: "a" });
      expect(screen.getAllByRole("tab")[0]).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("Wischen", () => {
    const swipe = (root: HTMLElement, from: number, to: number): void => {
      fireEvent.touchStart(root, { touches: [{ clientX: from }] });
      fireEvent.touchEnd(root, { changedTouches: [{ clientX: to }] });
    };

    it("schaltet bei einem Wisch nach links weiter", () => {
      const { container } = render(<HeroSlider slides={two} autoplayDelayMs={0} />);
      const root = container.querySelector(".man-hero") as HTMLElement;

      swipe(root, 300, 100);
      expect(screen.getAllByRole("tab")[1]).toHaveAttribute("aria-selected", "true");
    });

    it("wertet ein Tippen nicht als Wisch", () => {
      const { container } = render(<HeroSlider slides={two} autoplayDelayMs={0} />);
      const root = container.querySelector(".man-hero") as HTMLElement;

      swipe(root, 300, 295);
      expect(screen.getAllByRole("tab")[0]).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("Weiterlaufen", () => {
    it("schaltet nach der eingestellten Zeit von selbst weiter", () => {
      render(<HeroSlider slides={two} autoplayDelayMs={5000} />);

      act(() => {
        jest.advanceTimersByTime(5000);
      });
      expect(screen.getAllByRole("tab")[1]).toHaveAttribute("aria-selected", "true");
    });

    it("hält an, solange der Zeiger über der Bühne steht", () => {
      const { container } = render(<HeroSlider slides={two} autoplayDelayMs={5000} />);
      const root = container.querySelector(".man-hero") as HTMLElement;

      fireEvent.mouseEnter(root);
      act(() => {
        jest.advanceTimersByTime(15000);
      });
      expect(screen.getAllByRole("tab")[0]).toHaveAttribute("aria-selected", "true");

      fireEvent.mouseLeave(root);
      act(() => {
        jest.advanceTimersByTime(5000);
      });
      expect(screen.getAllByRole("tab")[1]).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("Barrierefreiheit", () => {
    it("kennzeichnet mehrere Slides als Karussell", () => {
      const { container } = render(<HeroSlider slides={two} />);
      expect(container.querySelector(".man-hero")).toHaveAttribute(
        "aria-roledescription",
        "carousel",
      );
    });

    it("verschweigt die Karussell-Rolle bei einem einzigen Slide", () => {
      const { container } = render(<HeroSlider slides={[slide("a")]} />);
      expect(container.querySelector(".man-hero")).not.toHaveAttribute("aria-roledescription");
    });

    it("zählt die Folien in ihren Beschriftungen", () => {
      render(<HeroSlider slides={two} />);
      expect(screen.getByLabelText("Folie 1 von 2", { selector: ".man-hero__slide" })).toBeInTheDocument();
      expect(screen.getByLabelText("Folie 2 von 2", { selector: ".man-hero__slide" })).toBeInTheDocument();
    });

    it("nimmt verborgene Slides aus Hilfsmitteln und Tabreihenfolge", () => {
      render(<HeroSlider slides={two} />);
      const panels = screen.getAllByRole("tabpanel", { hidden: true });

      expect(panels[0]).not.toHaveAttribute("aria-hidden");
      expect(panels[1]).toHaveAttribute("aria-hidden", "true");
      expect(panels[1]).toHaveAttribute("inert");
    });

    it("verbindet jeden Strich mit seinem Slide", () => {
      render(<HeroSlider slides={two} />);
      expect(screen.getByTestId("hero-dot-a")).toHaveAttribute("aria-controls", "hero-slide-a");
      expect(screen.getByTestId("hero-slide-a")).toHaveAttribute("id", "hero-slide-a");
    });

    it("schweigt, solange die Bühne von selbst läuft", () => {
      render(<HeroSlider slides={two} autoplayDelayMs={5000} />);
      expect(screen.getByTestId("hero-live")).toHaveTextContent("");
    });

    it("sagt die Folie an, sobald jemand selbst blättert", () => {
      render(<HeroSlider slides={two} autoplayDelayMs={0} />);
      expect(screen.getByTestId("hero-live")).toHaveTextContent("Folie 1 von 2");

      fireEvent.click(screen.getByTestId("hero-next"));
      expect(screen.getByTestId("hero-live")).toHaveTextContent("Folie 2 von 2");
    });
  });
});
