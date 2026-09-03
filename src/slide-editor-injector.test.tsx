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

import React from "react";
import { render, act } from "@testing-library/react";
import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";

import { startSlideEditorInjector } from "./slide-editor-injector";
import { configurationSchema, uiSchema } from "./configuration-schema";

describe("startSlideEditorInjector", () => {
  it("renders the modal in the flush editor variant so the editor draws its own frame", async () => {
    // Sichert, dass die Variante `editor-flush` wirklich über
    // `startFieldModalInjector` bis zur Hülle durchgereicht wird: Der
    // Folien-Editor zeichnet seinen eigenen Rahmen (Liste, Formular, Fußzeile
    // teilen sich Kanten), der Panel-Innenabstand schöbe ihn nur weg. Geprüft
    // an der Panel-Klasse, nicht am berechneten Stil — jsdom rechnet kein
    // Layout.
    const { container } = render(
      <Form schema={configurationSchema} uiSchema={uiSchema} validator={validator} onSubmit={jest.fn()} />,
    );

    let stop = () => {};
    await act(async () => {
      stop = startSlideEditorInjector(container);
    });

    const modal = document.body.querySelector('[data-testid="slide-editor-modal"]') as HTMLElement;
    expect(modal).not.toBeNull();
    expect(modal.querySelector(".man-cfg-modal__panel--flush")).not.toBeNull();

    await act(async () => {
      stop();
    });
  });
});
