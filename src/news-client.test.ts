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
  CHANNEL_LIMIT,
  fetchChannelPosts,
  fetchNewsChannels,
  fetchPost,
  userLocales,
} from "./news-client";

const jsonResponse = (body: unknown, ok = true): Response =>
  ({ ok, status: ok ? 200 : 500, json: async () => body }) as Response;

const mockFetch = (): jest.Mock => {
  const fetchMock = jest.fn();
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
};

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  document.documentElement.setAttribute("lang", "en");
});

describe("fetchNewsChannels", () => {
  it("fragt bis zu hundert Kanäle mit der Sitzung der lesenden Person", async () => {
    const fetchMock = mockFetch();
    fetchMock.mockResolvedValue(jsonResponse({ data: [] }));

    await fetchNewsChannels();

    expect(fetchMock).toHaveBeenCalledWith(
      `/api/channels?limit=${CHANNEL_LIMIT}`,
      expect.objectContaining({ credentials: "same-origin" }),
    );
  });

  it("nimmt nur News-Kanäle — ein Wiki-Kanal wäre in der Bühne eine Sackgasse", async () => {
    const fetchMock = mockFetch();
    fetchMock.mockResolvedValue(
      jsonResponse({
        data: [
          { id: "a", pluginID: "news", config: { localization: { de_DE: { title: "Truck News" } } } },
          { id: "b", pluginID: "wiki", config: { localization: { de_DE: { title: "Handbuch" } } } },
        ],
      }),
    );

    await expect(fetchNewsChannels()).resolves.toEqual([{ id: "a", title: "Truck News" }]);
  });

  it("fällt ohne Titel auf die Kennung zurück, statt eine leere Zeile anzubieten", async () => {
    const fetchMock = mockFetch();
    fetchMock.mockResolvedValue(jsonResponse({ data: [{ id: "a", pluginID: "news" }] }));

    await expect(fetchNewsChannels()).resolves.toEqual([{ id: "a", title: "a" }]);
  });

  it.each([
    ["einen HTTP-Fehler", async (m: jest.Mock) => m.mockResolvedValue(jsonResponse({}, false))],
    ["einen Netzfehler", async (m: jest.Mock) => m.mockRejectedValue(new Error("offline"))],
  ])("liefert bei %s eine leere Liste statt zu werfen", async (_name, arrange) => {
    const fetchMock = mockFetch();
    await arrange(fetchMock);

    await expect(fetchNewsChannels()).resolves.toEqual([]);
  });
});

describe("fetchChannelPosts", () => {
  it("fragt absteigend nach Veröffentlichung — die andere Richtung kennt die API nicht", async () => {
    const fetchMock = mockFetch();
    fetchMock.mockResolvedValue(jsonResponse({ data: [] }));

    await fetchChannelPosts("c1", 25);

    expect(fetchMock.mock.calls[0][0]).toBe("/api/channels/c1/posts?limit=25&sort=published_DESC");
  });

  it("verwirft Einträge ohne Kennung", async () => {
    const fetchMock = mockFetch();
    fetchMock.mockResolvedValue(jsonResponse({ data: [{ id: "p1" }, {}, { id: "" }] }));

    await expect(fetchChannelPosts("c1", 5)).resolves.toEqual([{ id: "p1" }]);
  });

  it("fragt ohne Kanalkennung gar nicht erst", async () => {
    const fetchMock = mockFetch();

    await expect(fetchChannelPosts("", 5)).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("fetchPost", () => {
  it("liefert den Beitrag", async () => {
    const fetchMock = mockFetch();
    fetchMock.mockResolvedValue(jsonResponse({ id: "p1" }));

    await expect(fetchPost("p1")).resolves.toEqual({ id: "p1" });
    expect(fetchMock.mock.calls[0][0]).toBe("/api/posts/p1");
  });

  it("liefert null, wenn es den Beitrag nicht mehr gibt", async () => {
    const fetchMock = mockFetch();
    fetchMock.mockResolvedValue(jsonResponse({}, false));

    await expect(fetchPost("p1")).resolves.toBeNull();
  });
});

describe("userLocales", () => {
  it("stellt die im App-Profil gewählte Sprache voran", async () => {
    document.documentElement.setAttribute("lang", "en");
    const fetchMock = mockFetch();
    fetchMock.mockResolvedValue(jsonResponse({ config: { locale: "de-DE" } }));

    await expect(userLocales()).resolves.toEqual(["de_DE", "en", "en_US"]);
  });

  it("fällt bei fehlgeschlagenem Abruf auf die Sprachen des Dokuments zurück", async () => {
    document.documentElement.setAttribute("lang", "fr");
    const fetchMock = mockFetch();
    fetchMock.mockRejectedValue(new Error("offline"));

    await expect(userLocales()).resolves.toContain("fr");
  });
});
