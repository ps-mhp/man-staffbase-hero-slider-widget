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

import { act, renderHook } from "@testing-library/react";
import { DEFAULT_AUTOPLAY_DELAY_MS, SWIPE_THRESHOLD_PX, useSlider } from "./use-slider";

/**
 * Stellt `matchMedia` auf eine feste Antwort. jsdom bringt die Funktion nicht
 * mit, und der Haken fragt sie nach `prefers-reduced-motion`.
 */
function mockReducedMotion(matches: boolean): jest.Mock {
  const listeners = new Set<() => void>();
  const query = {
    matches,
    addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
  };
  const matchMedia = jest.fn().mockReturnValue(query);
  Object.defineProperty(globalThis, "matchMedia", { value: matchMedia, configurable: true });
  return matchMedia;
}

beforeEach(() => {
  jest.useFakeTimers();
  mockReducedMotion(false);
});

afterEach(() => {
  jest.useRealTimers();
  Object.defineProperty(globalThis, "matchMedia", { value: undefined, configurable: true });
});

const advance = (ms: number): void => {
  act(() => {
    jest.advanceTimersByTime(ms);
  });
};

describe("Blättern", () => {
  it("beginnt beim ersten Slide", () => {
    const { result } = renderHook(() => useSlider({ count: 3 }));

    expect(result.current.index).toBe(0);
  });

  it("läuft am Ende wieder von vorn", () => {
    const { result } = renderHook(() => useSlider({ count: 3, delayMs: 0 }));

    act(() => result.current.goTo(2));
    act(() => result.current.next());

    expect(result.current.index).toBe(0);
  });

  it("läuft rückwärts ans Ende", () => {
    const { result } = renderHook(() => useSlider({ count: 3, delayMs: 0 }));

    act(() => result.current.previous());

    expect(result.current.index).toBe(2);
  });

  it("verträgt einen Sprung weit über die Anzahl hinaus", () => {
    const { result } = renderHook(() => useSlider({ count: 3, delayMs: 0 }));

    act(() => result.current.goTo(7));

    expect(result.current.index).toBe(1);
  });

  it("tut bei null Slides nichts, statt zu werfen", () => {
    const { result } = renderHook(() => useSlider({ count: 0 }));

    act(() => result.current.next());

    expect(result.current.index).toBe(0);
  });

  it("zieht den Index nach, wenn Slides verschwinden", () => {
    const { result, rerender } = renderHook((props: { count: number }) => useSlider({ ...props, delayMs: 0 }), {
      initialProps: { count: 3 },
    });

    act(() => result.current.goTo(2));
    rerender({ count: 1 });

    expect(result.current.index).toBe(0);
  });
});

describe("Autoplay", () => {
  it("schaltet nach der Vorgabe von 5s weiter — wie man.eu", () => {
    const { result } = renderHook(() => useSlider({ count: 3 }));

    advance(DEFAULT_AUTOPLAY_DELAY_MS - 1);
    expect(result.current.index).toBe(0);

    advance(1);
    expect(result.current.index).toBe(1);
  });

  it("beginnt die Wartezeit nach einem Klick von vorn", () => {
    const { result } = renderHook(() => useSlider({ count: 3, delayMs: 1000 }));

    advance(900);
    act(() => result.current.next());
    expect(result.current.index).toBe(1);

    // Ohne Neustart des Timers spränge die Bühne hier sofort auf 2 weiter.
    advance(900);
    expect(result.current.index).toBe(1);

    advance(100);
    expect(result.current.index).toBe(2);
  });

  it("ruht bei einem einzelnen Slide", () => {
    const { result } = renderHook(() => useSlider({ count: 1 }));

    expect(result.current.playing).toBe(false);
    advance(DEFAULT_AUTOPLAY_DELAY_MS * 3);
    expect(result.current.index).toBe(0);
  });

  it("ruht, wenn die Verzögerung 0 ist", () => {
    const { result } = renderHook(() => useSlider({ count: 3, delayMs: 0 }));

    expect(result.current.playing).toBe(false);
    advance(10000);
    expect(result.current.index).toBe(0);
  });

  it("hält an, solange pausiert ist, und läuft danach weiter", () => {
    const { result } = renderHook(() => useSlider({ count: 3, delayMs: 1000 }));

    act(() => result.current.setPaused(true));
    advance(5000);
    expect(result.current.index).toBe(0);

    act(() => result.current.setPaused(false));
    advance(1000);
    expect(result.current.index).toBe(1);
  });

  it("bleibt nach stop() dauerhaft stehen", () => {
    const { result } = renderHook(() => useSlider({ count: 3, delayMs: 1000 }));

    act(() => result.current.stop());
    advance(10000);

    expect(result.current.playing).toBe(false);
    expect(result.current.index).toBe(0);
  });

  it("lässt sich nach stop() weiterhin von Hand bedienen", () => {
    const { result } = renderHook(() => useSlider({ count: 3, delayMs: 1000 }));

    act(() => result.current.stop());
    act(() => result.current.next());

    expect(result.current.index).toBe(1);
  });

  it("läuft nicht, wenn weniger Bewegung gewünscht ist", () => {
    mockReducedMotion(true);
    const { result } = renderHook(() => useSlider({ count: 3, delayMs: 1000 }));

    expect(result.current.playing).toBe(false);
    advance(5000);
    expect(result.current.index).toBe(0);
  });

  it("kommt ohne matchMedia aus", () => {
    Object.defineProperty(globalThis, "matchMedia", { value: undefined, configurable: true });
    const { result } = renderHook(() => useSlider({ count: 3, delayMs: 1000 }));

    advance(1000);

    expect(result.current.index).toBe(1);
  });
});

describe("Wischen", () => {
  it("ignoriert eine kurze Berührung — das ist ein Tippen", () => {
    const { result } = renderHook(() => useSlider({ count: 3, delayMs: 0 }));

    let handled = true;
    act(() => {
      handled = result.current.swipe(-(SWIPE_THRESHOLD_PX - 1));
    });

    expect(handled).toBe(false);
    expect(result.current.index).toBe(0);
  });

  it("blättert nach links vorwärts", () => {
    const { result } = renderHook(() => useSlider({ count: 3, delayMs: 0 }));

    act(() => {
      result.current.swipe(-SWIPE_THRESHOLD_PX);
    });

    expect(result.current.index).toBe(1);
  });

  it("blättert nach rechts zurück", () => {
    const { result } = renderHook(() => useSlider({ count: 3, delayMs: 0 }));

    act(() => {
      result.current.swipe(SWIPE_THRESHOLD_PX);
    });

    expect(result.current.index).toBe(2);
  });

  it("wischt bei einem einzelnen Slide nicht", () => {
    const { result } = renderHook(() => useSlider({ count: 1 }));

    let handled = true;
    act(() => {
      handled = result.current.swipe(-200);
    });

    expect(handled).toBe(false);
  });
});
