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
 * Gebaut aus `Field`, `Select` und `Input` von `@man/config-ui`: Label,
 * Pflichtmarke, Hinweis und Fehler sind so mit der Eingabe verdrahtet wie in
 * jedem anderen Widget.
 */

import * as React from "react";
import { ReactElement, useEffect, useRef, useState } from "react";
import { Field } from "@man/config-ui/form/field";
import { Input } from "@man/config-ui/primitives/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@man/config-ui/primitives/select";

export interface IdSelectOption {
  id: string;
  title: string;
}

export interface IdSelectProps {
  label: string;
  hint?: string;
  required?: boolean;
  /** Warum der Wert so nicht geht; setzt `aria-invalid`. */
  error?: string;
  value: string;
  options: IdSelectOption[];
  loading: boolean;
  placeholder: string;
  /** Erklärt, warum statt der Auswahl ein Textfeld dasteht. */
  unavailableNotice: string;
  onChange: (id: string) => void;
  testId: string;
  disabled?: boolean;
  className?: string;
}

/** Der Eintrag, der die Auswahl an die Eingabe von Hand übergibt. */
const MANUAL_VALUE = "__manual__";

interface ManualProps extends IdSelectProps {
  /** Von Hand gewählt: dann gleich in das Feld, statt den Fokus zu verlieren. */
  focusOnMount: boolean;
}

function ManualInput({ label, hint, required, error, value, options, loading, unavailableNotice, onChange, testId, disabled, className, focusOnMount }: ManualProps): ReactElement {
  const ref = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (focusOnMount) ref.current?.focus();
  }, [focusOnMount]);
  const unavailable = options.length === 0 && !loading;
  return (
    <Field label={label} hint={unavailable ? unavailableNotice : hint} required={required} error={error} className={className}>
      <Input
        ref={ref}
        type="text"
        data-testid={`${testId}-manual`}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value.trim())}
        placeholder="Kennung, z. B. 6a5e6703cb02c92e74be1eaa"
      />
    </Field>
  );
}

export function IdSelect(props: IdSelectProps): ReactElement {
  const { label, hint, required, error, value, options, loading, placeholder, onChange, testId, disabled = false, className } = props;
  const [manual, setManual] = useState(false);

  const known = options.some((option) => option.id === value);
  // Ein gesperrtes Feld tritt nicht zur Seite: leer ist es dann, weil die
  // Vorbedingung fehlt, nicht weil der Katalog fehlt. Ein Textfeld für eine
  // Kennung von Hand wäre hier eine Einladung zum Falschausfüllen.
  const stepAside =
    !disabled && (manual || (!loading && (options.length === 0 || (value !== "" && !known))));

  if (stepAside) return <ManualInput {...props} disabled={disabled} focusOnMount={manual} />;

  return (
    <Select
      // Leer zeigt Radix den Platzhalter.
      value={known ? value : ""}
      disabled={disabled || loading}
      onValueChange={(next) => {
        if (next === MANUAL_VALUE) {
          setManual(true);
          return;
        }
        onChange(next);
      }}
    >
      <Field label={label} hint={hint} required={required} error={error} className={className}>
        <SelectTrigger className="w-full cursor-pointer" data-testid={testId}>
          <SelectValue placeholder={loading ? "Wird geladen …" : placeholder} />
        </SelectTrigger>
      </Field>
      <SelectContent position="popper" className="max-h-80">
        {options.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.title}
          </SelectItem>
        ))}
        {options.length > 0 && <SelectSeparator />}
        <SelectItem value={MANUAL_VALUE}>Andere Kennung eingeben …</SelectItem>
      </SelectContent>
    </Select>
  );
}
