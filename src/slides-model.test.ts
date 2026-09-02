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

import { emptySlide, newSlideId } from "./slides-model";

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
