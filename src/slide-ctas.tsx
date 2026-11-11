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
 * Die Schaltflächen einer Folie.
 *
 * Die erste trägt `man-hero__cta--lead` und mit ihr das Verhalten auf dem
 * Telefon: dort deckt sie die ganze Folie ab (siehe `hero-slider.scss`).
 * Jede weitere ist `man-hero__cta--extra` und bleibt
 * auch schmal ein sichtbarer Knopf über dieser Fläche — sonst wäre ihr Ziel
 * auf dem Telefon gar nicht erreichbar.
 */

import * as React from "react";
import { ReactElement } from "react";
import {
  ArrowRight,
  Calendar,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Info,
  LucideIcon,
  Mail,
  Phone,
  Play,
} from "lucide-react";

import { CtaIcon, CtaVariant, SlideCta } from "./slides-model";

/** Die Symbole hinter den Namen im Attribut. Auch der Editor zeigt sie daraus. */
export const CTA_ICON_COMPONENTS: Record<CtaIcon, LucideIcon> = {
  "arrow-right": ArrowRight,
  "chevron-right": ChevronRight,
  "external-link": ExternalLink,
  download: Download,
  play: Play,
  "file-text": FileText,
  calendar: Calendar,
  mail: Mail,
  phone: Phone,
  info: Info,
};

function CtaIconMark({ icon }: { icon: CtaIcon }): ReactElement {
  const Icon = CTA_ICON_COMPONENTS[icon];
  // Schmückend: der Name des Links ist seine Beschriftung.
  return <Icon className="man-hero__cta-icon" aria-hidden="true" focusable="false" strokeWidth={2} />;
}

/** Ausgeschrieben statt zusammengesetzt, damit jede Klasse im Quelltext auffindbar bleibt. */
const VARIANT_CLASS: Record<CtaVariant, string> = {
  primary: "man-hero__cta--primary",
  secondary: "man-hero__cta--secondary",
  outline: "man-hero__cta--outline",
  link: "man-hero__cta--link",
};

const ctaClassName = (cta: SlideCta, first: boolean): string =>
  [
    "man-hero__cta",
    VARIANT_CLASS[cta.variant ?? "primary"],
    first ? "man-hero__cta--lead" : "man-hero__cta--extra",
  ].join(" ");

export interface SlideCtasProps {
  ctas: SlideCta[] | undefined;
}

export function SlideCtas({ ctas }: SlideCtasProps): ReactElement | null {
  if (ctas === undefined || ctas.length === 0) return null;

  return (
    <div className="man-hero__ctas">
      {ctas.map((cta, position) => {
        const iconAtStart = cta.icon !== undefined && cta.iconPosition === "start";
        const iconAtEnd = cta.icon !== undefined && !iconAtStart;
        return (
          <a
            // Beschriftung und Ziel können doppelt vorkommen; die Stelle nicht.
            key={position}
            className={ctaClassName(cta, position === 0)}
            href={cta.href}
            data-testid={`hero-cta-${position}`}
            target={cta.newTab === true ? "_blank" : undefined}
            // `noopener` gegen den Zugriff der Zielseite auf `window.opener`;
            // `noreferrer` folgt der Hausordnung für externe Ziele.
            rel={cta.newTab === true ? "noopener noreferrer" : undefined}
          >
            {iconAtStart && <CtaIconMark icon={cta.icon!} />}
            {/* Eigenes Element, damit die Beschriftung schmal verborgen werden
                kann, ohne den Link selbst zu verbergen: dort deckt die erste
                Schaltfläche die ganze Folie ab und macht sie zum Ziel, ihren
                Namen braucht sie trotzdem weiter (siehe `hero-slider.scss`). */}
            <span className="man-hero__cta-label">{cta.label}</span>
            {iconAtEnd && <CtaIconMark icon={cta.icon!} />}
          </a>
        );
      })}
    </div>
  );
}
