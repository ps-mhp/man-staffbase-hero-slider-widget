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

import { SlideCta } from "../slides-model";
import { ctaSummary, duplicateCta, moveCta, withTargetKind } from "./cta-model";
import { fileNameOf } from "./image-field";

describe("ctaSummary", () => {
  it("nennt Stil ohne Klammerzusatz und das Ziel", () => {
    expect(ctaSummary({ label: "Mehr", href: "https://example.test" })).toBe("Rot gefüllt · https://example.test");
    expect(
      ctaSummary({ label: "Mehr", href: "/content/page/x", variant: "outline", link: { kind: "page", pageId: "p", menuId: "x", title: "Termine" } }),
    ).toBe("Weiße Kontur · Seite „Termine“");
    expect(ctaSummary({ label: "Lesen", href: "/n", link: { kind: "post", postId: "p", channelId: "c", title: "TGX" } })).toBe(
      "Rot gefüllt · News-Beitrag „TGX“",
    );
  });

  it("sagt, wenn das Ziel fehlt", () => {
    expect(ctaSummary({ label: "", href: " " })).toBe("Rot gefüllt · Ziel fehlt");
    expect(ctaSummary({ label: "", href: "", link: { kind: "page", pageId: "", menuId: "" } })).toBe("Rot gefüllt · Seite fehlt");
    expect(ctaSummary({ label: "", href: "", link: { kind: "post", postId: "", channelId: "c" } })).toBe("Rot gefüllt · Beitrag fehlt");
  });
});

describe("duplicateCta", () => {
  it("setzt eine Kopie direkt dahinter und lässt das Original stehen", () => {
    const ctas: SlideCta[] = [{ label: "A", href: "/a" }, { label: "B", href: "/b" }];
    const next = duplicateCta(ctas, 0);

    expect(next.map((cta) => cta.label)).toEqual(["A", "A", "B"]);
    expect(next[1]).not.toBe(ctas[0]);
    expect(ctas).toHaveLength(2);
  });

  it("lässt eine fremde Stelle unberührt", () => {
    const ctas: SlideCta[] = [{ label: "A", href: "/a" }];
    expect(duplicateCta(ctas, 3)).toBe(ctas);
  });
});

describe("moveCta und withTargetKind", () => {
  it("verschiebt nur innerhalb der Liste", () => {
    const ctas: SlideCta[] = [{ label: "A", href: "" }, { label: "B", href: "" }];
    expect(moveCta(ctas, 0, -1)).toBe(ctas);
    expect(moveCta(ctas, 0, 1).map((cta) => cta.label)).toEqual(["B", "A"]);
  });

  it("wirft beim Wechsel der Zielart die alte Adresse weg", () => {
    expect(withTargetKind({ label: "A", href: "https://x.test" }, "page")).toEqual({
      label: "A",
      href: "",
      link: { kind: "page", pageId: "", menuId: "" },
    });
  });
});

describe("fileNameOf", () => {
  it("nimmt den letzten Teil der Adresse ohne Anfrage und dekodiert ihn", () => {
    expect(fileNameOf("https://cdn.example.test/a/b/Bild%20eins.jpg?w=1#x")).toBe("Bild eins.jpg");
    expect(fileNameOf("https://cdn.example.test/")).toBe("cdn.example.test");
    expect(fileNameOf("https://cdn.example.test/%E0%A4%A.jpg")).toBe("%E0%A4%A.jpg");
  });
});
