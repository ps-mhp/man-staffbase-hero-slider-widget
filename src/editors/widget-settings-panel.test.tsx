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

import * as React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfigShellProvider } from "@man/config-ui/shell/shell-context";
import type { ShownIssues } from "@shared/config-modal";

import { AUTOPLAY_DELAY_ISSUE } from "../editor-value";
import { HeroSettings } from "../hero-settings";
import { WidgetSettingsPanel } from "./widget-settings-panel";

interface Setup {
  settings?: HeroSettings;
  legacy?: HeroSettings;
  issuesVisible?: boolean;
  shownIssues?: ShownIssues | null;
}

function setup({ settings = {}, legacy = {}, issuesVisible = false, shownIssues = null }: Setup = {}) {
  const onChange = jest.fn<void, [HeroSettings]>();
  const ui = (next: Setup = {}): React.ReactElement => (
    <ConfigShellProvider
      value={{ view: "editor", setView: () => undefined, preview: true, issuesVisible: next.issuesVisible ?? issuesVisible }}
    >
      <WidgetSettingsPanel
        settings={next.settings ?? settings}
        legacy={legacy}
        onChange={onChange}
        shownIssues={next.shownIssues === undefined ? shownIssues : next.shownIssues}
      />
    </ConfigShellProvider>
  );
  const view = render(ui());
  return { onChange, rerender: (next: Setup) => view.rerender(ui(next)) };
}

const openTab = async (name: string): Promise<void> => {
  await userEvent.click(screen.getByRole("tab", { name: new RegExp(name) }));
};

describe("WidgetSettingsPanel", () => {
  it("steht als Panel „Widget“ mit Gestaltung und Verhalten", () => {
    setup();

    const panel = screen.getByRole("complementary", { name: "Widget" });
    expect(within(panel).getAllByRole("tab").map((tab) => tab.textContent)).toEqual(["Gestaltung", "Verhalten"]);
    expect(within(panel).getByRole("tab", { name: "Gestaltung" })).toHaveAttribute("aria-selected", "true");
  });

  it("zeigt, was die alten Felder tragen, und schreibt nichts davon", () => {
    const { onChange } = setup({ legacy: { height: "large", position: "pre", fullBleed: false, bottomSpacing: "none" } });

    expect(screen.getByTestId("hero-setting-height")).toHaveTextContent("Groß (560–720 px)");
    expect(screen.getByTestId("hero-setting-position")).toHaveTextContent("Vor den Brotkrumen");
    expect(screen.getByRole("switch", { name: "Volle Breite" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "Keiner" })).toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("sagt „wie bisher“, wo weder Einstellung noch altes Feld bekannt sind", () => {
    setup();

    expect(screen.getByTestId("hero-setting-height")).toHaveTextContent("Wie bisher");
    expect(screen.getByRole("switch", { name: "Volle Breite" })).toHaveAccessibleDescription(
      expect.stringContaining("Noch nicht hier festgelegt"),
    );
  });

  it("lässt die Einstellung vor dem alten Feld gelten", () => {
    setup({ settings: { height: "small" }, legacy: { height: "large" } });

    expect(screen.getByTestId("hero-setting-height")).toHaveTextContent("Klein (320–420 px)");
  });

  it("schreibt genau die bediente Einstellung", async () => {
    const { onChange } = setup({ settings: { controls: false } });

    await userEvent.click(screen.getByTestId("hero-setting-height"));
    await userEvent.click(await screen.findByRole("option", { name: "Bildschirmhöhe" }));
    expect(onChange).toHaveBeenLastCalledWith({ controls: false, height: "viewport" });

    fireEvent.click(screen.getByRole("switch", { name: "Volle Breite" }));
    expect(onChange).toHaveBeenLastCalledWith({ controls: false, fullBleed: false });
  });

  it("nimmt Sekunden mit Komma und gibt sie leer wieder frei", async () => {
    const onChange = jest.fn<void, [HeroSettings]>();
    function Live(): React.ReactElement {
      const [settings, setSettings] = React.useState<HeroSettings>({});
      return (
        <WidgetSettingsPanel
          settings={settings}
          legacy={{ autoplayDelay: 7 }}
          onChange={(next) => {
            onChange(next);
            setSettings(next);
          }}
        />
      );
    }
    render(<Live />);
    await openTab("Verhalten");

    const input = screen.getByTestId("hero-setting-autoplay-delay");
    expect(input).toHaveAttribute("placeholder", "7");
    fireEvent.change(input, { target: { value: "2,5" } });
    expect(onChange).toHaveBeenLastCalledWith({ autoplayDelay: 2.5 });
    expect(input).toHaveValue("2,5");

    fireEvent.change(input, { target: { value: "" } });
    expect(onChange).toHaveBeenLastCalledWith({});
  });

  it("zeigt unerlaubte Sekunden erst nach gescheitertem Übernehmen, dann mit Marke am Reiter", async () => {
    const { rerender } = setup({ settings: { autoplayDelay: 45 } });
    await openTab("Verhalten");
    expect(screen.queryByText(/Erlaubt sind 0 bis 30 Sekunden/)).toBeNull();

    rerender({ issuesVisible: true });

    expect(screen.getByText("Erlaubt sind 0 bis 30 Sekunden.")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Verhalten/ })).toHaveTextContent("1 Fehler");
  });

  it("springt nach gescheitertem Übernehmen zum Reiter mit dem Fehler", () => {
    const { rerender } = setup({ settings: { autoplayDelay: 45 } });

    rerender({ shownIssues: { issues: [{ id: AUTOPLAY_DELAY_ISSUE, message: "Sekunden" }] } });

    expect(screen.getByRole("tab", { name: /Verhalten/ })).toHaveAttribute("aria-selected", "true");
  });
});
