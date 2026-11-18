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
 * Ein Bildfeld als Medienzeile wie im Screen: Kachel (160 × 90), daneben
 * Dateiname und Maße, darunter „Ersetzen“, „Adresse einfügen“, „Entfernen“.
 *
 * Steht in einer eigenen Datei, weil Folie und News-Beitrag es brauchen.
 * Wer `onUrlChange` mitgibt, bekommt „Adresse einfügen“: das Medium kommt
 * dann wahlweise aus der Mediathek oder von einer https-Adresse, und es darf
 * auch ein Video sein. `compactEmpty` zeigt ein leeres, optionales Feld als
 * eine Zeile („Hochformat (optional): … [Bild wählen]“) statt als Kachel.
 *
 * Mit `media` (aus `useFieldMedia`) ist das ganze Feld eine Ablagezone für
 * Kacheln aus der Mediathek-Leiste – auch über dem Adressfeld, in das der
 * Browser sonst die Vorschau-Adresse schriebe. Der Knopf zum Wählen bleibt
 * der Weg für Tastatur und Screenreader.
 */

import * as React from "react";
import { ReactElement, useId, useState } from "react";
import { DropZone } from "@man/config-ui/drop/drop-zone";
import { Field } from "@man/config-ui/form/field";
import { SegmentedField } from "@man/config-ui/form/segmented-field";
import { Button } from "@man/config-ui/primitives/button";
import { Input } from "@man/config-ui/primitives/input";
import { useMediaDrop } from "@shared/media/use-media-drop";

import { MediaKind, SlideImage, firstFrameUrl, isVideo } from "../slides-model";
import type { FieldMedia } from "./editor-media";
import { MediaUrlField } from "./media-url-field";

export interface ImageFieldProps {
  label: string;
  hint: string;
  image: SlideImage | undefined;
  onPick: () => void;
  /** Beschriftung des Knopfs zum Wählen; Vorgabe „Bild wählen“. */
  pickLabel?: string;
  onClear?: () => void;
  onAltChange?: (alt: string) => void;
  /** Eine geprüfte Adresse, oder `""`, wenn das Feld geleert wurde. */
  onUrlChange?: (url: string) => void;
  onKindChange?: (kind: MediaKind) => void;
  /** Ablegen aus der Mediathek-Leiste; ohne bleibt es beim Knopf. */
  media?: FieldMedia;
  /** Leer als eine Zeile statt als Kachel – für optionale Felder. */
  compactEmpty?: boolean;
  /** Warum das Feld so nicht geht, etwa „ohne Bild keine Folie“. */
  error?: string;
  testId: string;
}

const KIND_OPTIONS = [
  { id: "image", label: "Bild" },
  { id: "video", label: "Video" },
] as const;

const LABEL = "text-[13px] font-semibold text-foreground";
const HINT = "text-[13px] text-muted-foreground";

/** Der letzte Teil der Adresse – was man als Dateinamen wiedererkennt. */
export function fileNameOf(url: string): string {
  const path = url.split(/[?#]/)[0] ?? "";
  const last = path.split("/").filter((part) => part !== "").pop() ?? url;
  try {
    return decodeURIComponent(last);
  } catch {
    return last;
  }
}

function metaOf(image: SlideImage): string {
  const kind = isVideo(image) ? "Video" : "Bild";
  return image.width !== undefined && image.height !== undefined ? `${kind} · ${image.width} × ${image.height} px` : kind;
}

/** Die Vorschau in der Kachel — ein Video zeigt dort sein erstes Bild. */
function Thumb({ image, testId }: { image: SlideImage; testId: string }): ReactElement {
  const className = "h-[90px] w-40 shrink-0 rounded-md border bg-stage object-cover";
  return isVideo(image) ? (
    <video className={className} src={firstFrameUrl(image.url)} muted preload="metadata" data-testid={`${testId}-thumb`} />
  ) : (
    <img className={className} src={image.url} alt="" data-testid={`${testId}-thumb`} />
  );
}

interface DropAreaProps {
  media: FieldMedia | undefined;
  testId: string;
  children: React.ReactNode;
}

const AREA = "flex flex-col gap-3";

/** Das Feld als Ablagezone samt Fehlermeldung des letzten Ablegens. */
function MediaDropArea({ media, testId, children }: DropAreaProps & { media: FieldMedia }): ReactElement {
  const drop = useMediaDrop({ client: media.client, accept: media.accept, onPick: media.onPick });
  return (
    <DropZone zone={drop} busy={drop.busy} className={AREA} data-testid={`${testId}-drop`}>
      {children}
      {drop.error !== null && (
        <p className="text-[13px] text-destructive" role="alert" data-testid={`${testId}-drop-error`}>
          {drop.error}
        </p>
      )}
    </DropZone>
  );
}

function FieldArea({ media, testId, children }: DropAreaProps): ReactElement {
  if (media === undefined) return <div className={AREA}>{children}</div>;
  return (
    <MediaDropArea media={media} testId={testId}>
      {children}
    </MediaDropArea>
  );
}

interface RowProps extends ImageFieldProps {
  ids: { hint: string; error: string; url: string };
  urlToggle: React.ReactNode;
}

/** Leer und optional: eine Zeile mit Hinweis und Knopf, wie im Screen. */
function CompactEmptyRow({ label, hint, pickLabel = "Bild wählen", onPick, testId, ids, urlToggle }: RowProps): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <p id={ids.hint} className={HINT}>
        <span className="font-semibold text-foreground">{`${label} (optional):`}</span> {hint}
      </p>
      <Button type="button" variant="ghost" size="sm" aria-label={`${label}: ${pickLabel}`} data-testid={`${testId}-pick`} onClick={onPick}>
        {pickLabel}
      </Button>
      {urlToggle}
    </div>
  );
}

/** Kachel, Dateiname und Knöpfe; darunter Hinweis und Fehler. */
function MediaRow({ label, hint, image, pickLabel = "Bild wählen", onPick, onClear, error, testId, ids, urlToggle }: RowProps): ReactElement {
  const describedBy = [error !== undefined && ids.error, ids.hint].filter(Boolean).join(" ");
  return (
    <>
      <span className={LABEL}>{label}</span>
      <div className="flex flex-wrap items-center gap-4">
        {image === undefined ? (
          <button
            type="button"
            className="flex h-[90px] w-40 shrink-0 cursor-pointer items-center justify-center rounded-md border border-dashed border-primary-soft-border bg-primary-soft px-2 text-center text-[13px] font-semibold text-primary outline-none hover:bg-primary-soft/70 focus-visible:ring-[3px] focus-visible:ring-ring/40"
            aria-label={`${label}: ${pickLabel}`}
            aria-describedby={describedBy}
            aria-invalid={error !== undefined ? true : undefined}
            data-testid={`${testId}-pick`}
            onClick={onPick}
          >
            {pickLabel}
          </button>
        ) : (
          <Thumb image={image} testId={testId} />
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {image !== undefined && (
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm text-foreground" title={image.url}>
                {fileNameOf(image.url)}
              </span>
              <span className={HINT}>{metaOf(image)}</span>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            {image !== undefined && (
              <Button type="button" variant="outline" size="sm" aria-label={`${label} ersetzen`} data-testid={`${testId}-replace`} onClick={onPick}>
                Ersetzen
              </Button>
            )}
            {urlToggle}
            {image !== undefined && onClear !== undefined && (
              <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive" aria-label={`${label} entfernen`} data-testid={`${testId}-clear`} onClick={onClear}>
                Entfernen
              </Button>
            )}
          </div>
        </div>
      </div>
      {error !== undefined && (
        <p id={ids.error} role="alert" className="text-[13px] text-destructive">
          {error}
        </p>
      )}
      <p id={ids.hint} className={HINT}>
        {hint}
      </p>
    </>
  );
}

/** Beschreibung und Art des gewählten Mediums nebeneinander. */
function MediaDetails({ image, onAltChange, onKindChange, testId }: ImageFieldProps & { image: SlideImage }): ReactElement {
  const video = isVideo(image);
  return (
    <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
      {onAltChange !== undefined && (
        // Kein Pflichtfeld, aber eines mit Folgen: ohne sie ist das Bild für
        // Screenreader stumm. Rein schmückende Bilder bleiben leer — deshalb
        // wird hier nicht erzwungen, sondern erklärt.
        <Field label={video ? "Videobeschreibung" : "Bildbeschreibung"} hint="Leer lassen, wenn rein schmückend.">
          <Input type="text" data-testid={`${testId}-alt`} value={image.alt} placeholder="Was ist zu sehen?" onChange={(event) => onAltChange(event.target.value)} />
        </Field>
      )}
      {onKindChange !== undefined && (
        // Die Endung entscheidet von selbst; von Hand nur dann, wenn eine
        // Adresse keine trägt.
        <SegmentedField label="Art" hint="Erkennt die Endung von selbst." options={KIND_OPTIONS} value={video ? "video" : "image"} onChange={onKindChange} />
      )}
    </div>
  );
}

export function ImageField(props: ImageFieldProps): ReactElement {
  const { label, image, onUrlChange, media, compactEmpty = false, testId } = props;
  const base = useId();
  const ids = { hint: `${base}-hint`, error: `${base}-error`, url: `${base}-url` };
  const [urlOpen, setUrlOpen] = useState(false);

  const urlToggle = onUrlChange !== undefined && (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-label={`${label}: Adresse einfügen`}
      aria-expanded={urlOpen}
      aria-controls={urlOpen ? ids.url : undefined}
      data-testid={`${testId}-url-toggle`}
      onClick={() => setUrlOpen((open) => !open)}
    >
      Adresse einfügen
    </Button>
  );
  const rowProps: RowProps = { ...props, ids, urlToggle };

  return (
    <FieldArea media={media} testId={testId}>
      {compactEmpty && image === undefined ? <CompactEmptyRow {...rowProps} /> : <MediaRow {...rowProps} />}
      {urlOpen && onUrlChange !== undefined && (
        <MediaUrlField id={ids.url} url={image?.url ?? ""} onUrlChange={onUrlChange} testId={testId} autoFocus />
      )}
      {image !== undefined && (props.onAltChange !== undefined || props.onKindChange !== undefined) && (
        <MediaDetails {...props} image={image} />
      )}
    </FieldArea>
  );
}
