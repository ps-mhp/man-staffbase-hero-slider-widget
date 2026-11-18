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
 * Das Adressfeld eines Bildfelds („Adresse einfügen“).
 *
 * Es hält die Eingabe selbst und reicht nur weiter, was `parseMediaUrl`
 * annimmt: Zwischenstände beim Tippen — `https:/`, ein Rechnername ohne
 * Punkt — landeten sonst in der Folie und nähmen ihr das Bild, das sie gerade
 * noch hatte. Ändert sich die Adresse von außen (Mediathek), zieht die
 * Eingabe nach.
 */

import * as React from "react";
import { ReactElement, useEffect, useRef, useState } from "react";
import { Field } from "@man/config-ui/form/field";
import { Input } from "@man/config-ui/primitives/input";

import { parseMediaUrl } from "../slides-model";

export interface MediaUrlFieldProps {
  id: string;
  url: string;
  onUrlChange: (url: string) => void;
  testId: string;
  /** Beim Aufklappen gleich hinein, damit „Adresse einfügen“ wirklich einfügen lässt. */
  autoFocus?: boolean;
}

export function MediaUrlField({ id, url, onUrlChange, testId, autoFocus = false }: MediaUrlFieldProps): ReactElement {
  const [draft, setDraft] = useState(url);
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setDraft((current) => (current.trim() === url ? current : url));
  }, [url]);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  const invalid = draft.trim() !== "" && parseMediaUrl(draft) === null;

  return (
    <Field
      label="Adresse eines Bildes oder Videos"
      hint={invalid ? undefined : "Videos (MP4, WebM) laufen stumm in Schleife, solange ihre Folie vorn steht."}
      error={
        invalid ? (
          <span data-testid={`${testId}-url-error`}>Wird nicht übernommen: nur vollständige Adressen mit https://.</span>
        ) : undefined
      }
    >
      <Input
        ref={ref}
        id={id}
        type="url"
        data-testid={`${testId}-url`}
        value={draft}
        placeholder="https://…/bild.jpg oder …/film.mp4"
        onChange={(event) => {
          const text = event.target.value;
          setDraft(text);
          if (text.trim() === "") {
            onUrlChange("");
            return;
          }
          const parsed = parseMediaUrl(text);
          if (parsed !== null) onUrlChange(parsed);
        }}
      />
    </Field>
  );
}
