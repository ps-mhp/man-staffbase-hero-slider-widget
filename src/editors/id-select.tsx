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
 * Ein Auswahlfeld für eine Kennung, das sich zur Seite stellen kann.
 *
 * Dieselbe Überlegung wie in `@shared/entity-picker`: eine Kennung, die die
 * Liste nicht enthält — weil der Katalog nicht geladen werden konnte oder weil
 * sie außerhalb der Rechte dieses Redakteurs liegt —, darf nicht als leeres
 * Auswahlfeld erscheinen. Der Wert sähe ungesetzt aus, und das nächste
 * Speichern würde ihn stillschweigend verlieren. Dann tritt ein Textfeld an
 * die Stelle der Auswahl.
 *
 * Eine eigene Umsetzung statt der geteilten, weil diese hier im
 * Folien-Editor steht und dessen Stylesheet (`man-se__`) benutzt, während die
 * geteilte in Staffbases Dialog mit Inline-Stilen auskommen muss.
 */

import * as React from "react";
import { ReactElement, useState } from "react";

export interface IdSelectOption {
  id: string;
  title: string;
}

export interface IdSelectProps {
  label: string;
  hint?: string;
  value: string;
  options: IdSelectOption[];
  loading: boolean;
  placeholder: string;
  /** Erklärt, warum statt der Auswahl ein Textfeld dasteht. */
  unavailableNotice: string;
  onChange: (id: string) => void;
  testId: string;
  disabled?: boolean;
}

/** Der Eintrag, der die Auswahl an die Eingabe von Hand übergibt. */
const MANUAL_VALUE = "__manual__";

export function IdSelect({
  label,
  hint,
  value,
  options,
  loading,
  placeholder,
  unavailableNotice,
  onChange,
  testId,
  disabled = false,
}: IdSelectProps): ReactElement {
  const [manual, setManual] = useState(false);

  const known = options.some((option) => option.id === value);
  // Ein gesperrtes Feld tritt nicht zur Seite: leer ist es dann, weil die
  // Vorbedingung fehlt, nicht weil der Katalog fehlt. Ein Textfeld für eine
  // Kennung von Hand wäre hier eine Einladung zum Falschausfüllen.
  const stepAside =
    !disabled && (manual || (!loading && (options.length === 0 || (value !== "" && !known))));

  return (
    <label className="man-se__field">
      <span className="man-se__label">{label}</span>
      {hint !== undefined && <p className="man-se__hint">{hint}</p>}

      {stepAside ? (
        <>
          {options.length === 0 && !loading && <p className="man-se__hint">{unavailableNotice}</p>}
          <input
            type="text"
            className="man-se__input"
            data-testid={`${testId}-manual`}
            value={value}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value.trim())}
            placeholder="Kennung, z. B. 6a5e6703cb02c92e74be1eaa"
          />
        </>
      ) : (
        <select
          className="man-se__input man-se__select"
          data-testid={testId}
          value={known ? value : ""}
          disabled={disabled || loading}
          onChange={(event) => {
            if (event.target.value === MANUAL_VALUE) {
              setManual(true);
              return;
            }
            onChange(event.target.value);
          }}
        >
          <option value="">{loading ? "Wird geladen …" : placeholder}</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.title}
            </option>
          ))}
          <option value={MANUAL_VALUE}>Andere Kennung eingeben …</option>
        </select>
      )}
    </label>
  );
}
