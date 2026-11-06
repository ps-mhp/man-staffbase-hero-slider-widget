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
  readAutoplayDelayMs,
  readBottomSpacing,
  readFlag,
  readHeight,
  readPosition,
} from "./attributes";

describe("readHeight", () => {
  it("nimmt eine bekannte Stufe", () => {
    expect(readHeight("large")).toBe("large");
  });

  it("fällt bei allem Unbekannten auf die Abschnittshöhe zurück", () => {
    // Bestandsinhalte ohne Attribut und veraltete Werte landen beide hier.
    expect(readHeight(undefined)).toBe("section");
    expect(readHeight("")).toBe("section");
    expect(readHeight("riesig")).toBe("section");
  });
});

describe("readFlag", () => {
  it("bleibt an, solange es niemand ausdrücklich abschaltet", () => {
    expect(readFlag(undefined)).toBe(true);
    expect(readFlag(true)).toBe(true);
    expect(readFlag("true")).toBe(true);
  });

  it("zählt nur ein echtes Aus", () => {
    // Staffbase liefert Wahrheitswerte je nach Weg als Wert oder Zeichenkette.
    expect(readFlag(false)).toBe(false);
    expect(readFlag("false")).toBe(false);
  });
});

describe("readAutoplayDelayMs", () => {
  it("rechnet Sekunden in Millisekunden um", () => {
    expect(readAutoplayDelayMs(3)).toBe(3000);
    expect(readAutoplayDelayMs("2.5")).toBe(2500);
  });

  it("nimmt die Null als Anhalten ernst", () => {
    expect(readAutoplayDelayMs(0)).toBe(0);
  });

  it("fällt bei Unbrauchbarem auf die Vorgabe zurück", () => {
    expect(readAutoplayDelayMs(undefined)).toBe(5000);
    expect(readAutoplayDelayMs("bald")).toBe(5000);
    expect(readAutoplayDelayMs(-1)).toBe(5000);
  });
});

describe("readPosition", () => {
  it("nimmt die Lage vor den Brotkrumen nur auf ausdrückliche Ansage", () => {
    expect(readPosition("pre")).toBe("pre");
  });

  it("lässt alles andere unter den Brotkrumen", () => {
    // Bestandsseiten tragen das Attribut nicht und dürfen sich nicht ändern.
    expect(readPosition(undefined)).toBe("post");
    expect(readPosition("")).toBe("post");
    expect(readPosition("oben")).toBe("post");
  });
});

describe("readBottomSpacing", () => {
  it("nimmt den Abstand nur auf ausdrückliche Ansage weg", () => {
    expect(readBottomSpacing("none")).toBe("none");
  });

  it("lässt alles andere beim Blockabstand der Seite", () => {
    // Bestandsseiten tragen das Attribut nicht und dürfen sich nicht ändern.
    expect(readBottomSpacing(undefined)).toBe("default");
    expect(readBottomSpacing("")).toBe("default");
    expect(readBottomSpacing("0")).toBe("default");
  });
});
