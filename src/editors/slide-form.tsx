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
 * Die Felder einer handgepflegten Folie, gegliedert wie im Screen: Medium,
 * Text, Buttons.
 *
 * Aus `slide-editor.tsx` herausgelöst, als die beiden News-Formulare
 * dazukamen: drei Formulare in einer Datei wären das Doppelte an Zeilen und
 * keine davon mehr auffindbar.
 */

import * as React from "react";
import { ReactElement } from "react";
import { Field } from "@man/config-ui/form/field";
import { FormSection } from "@man/config-ui/form/form-section";
import { Input } from "@man/config-ui/primitives/input";
import { Textarea } from "@man/config-ui/primitives/textarea";
import { useConfigShell } from "@man/config-ui/shell/shell-context";

import { SlideItem } from "../hero-items";
import { SegmentedField } from "@man/config-ui/form/segmented-field";
import { DEFAULT_ANIMATION } from "../slide-animation";
import { animationMedium, isAnimation, mediaFromUrl, withMediaKind } from "../slides-model";
import { AnimationField } from "./animation-field";
import { CtaListForm } from "./cta-list-form";
import { useFieldMedia } from "./editor-media";
import { ImageField } from "./image-field";
import { NewsSource } from "./news-source";

/** Welches der beiden Bilder einer Folie der Picker gerade füllt. */
export type SlidePickerTarget = "image" | "imagePortrait";

export interface SlideFormProps {
  slide: SlideItem;
  onPatch: (changes: Partial<SlideItem>) => void;
  onPick: (target: SlidePickerTarget) => void;
  /** Für die Ziele der Buttons: Seiten und Beiträge aus Staffbase. */
  source: NewsSource;
}

type Background = "file" | "animation";

const BACKGROUND_OPTIONS = [
  { id: "file", label: "Bild oder Video" },
  { id: "animation", label: "Animation" },
] as const satisfies readonly { id: Background; label: string }[];

function MediaSection(props: Omit<SlideFormProps, "source">): ReactElement {
  const { slide, onPatch } = props;
  const animated = isAnimation(slide.image);
  const choose = (background: Background): void => {
    if (background === (animated ? "animation" : "file")) return;
    // Ein Hochformat gehört zu einer Datei; die Animation passt sich selbst an.
    onPatch(
      background === "animation"
        ? { image: animationMedium(DEFAULT_ANIMATION), imagePortrait: undefined }
        : { image: { url: "", alt: "" } },
    );
  };

  return (
    <FormSection title="Medium">
      <SegmentedField
        label="Hintergrund"
        options={BACKGROUND_OPTIONS}
        value={animated ? "animation" : "file"}
        onChange={choose}
      />
      {isAnimation(slide.image) ? (
        <AnimationField
          animation={slide.image.animation}
          onChange={(animation) => onPatch({ image: animationMedium(animation) })}
        />
      ) : (
        <FileMedia {...props} />
      )}
    </FormSection>
  );
}

function FileMedia({ slide, onPatch, onPick }: Omit<SlideFormProps, "source">): ReactElement {
  const { issuesVisible } = useConfigShell();
  // Das Hauptbild ist nie `undefined` — eine leere Folie trägt `url: ""`.
  // Für die Kachel und das Adressfeld heißt das dasselbe: noch kein Medium.
  const image = slide.image.url === "" ? undefined : slide.image;
  const portrait = slide.imagePortrait;
  const imageMedia = useFieldMedia(slide.id, "image");
  const portraitMedia = useFieldMedia(slide.id, "imagePortrait");

  return (
    <>
      <ImageField
        label="Bild oder Video"
        hint="Quer, mindestens 1920 px breit. Ohne Bild oder Video wird die Folie nicht gezeigt."
        error={issuesVisible && image === undefined ? "Diese Folie hat noch kein Bild oder Video." : undefined}
        image={image}
        onPick={() => onPick("image")}
        pickLabel="Bild oder Video wählen"
        onAltChange={(alt) => onPatch({ image: { ...slide.image, alt } })}
        onUrlChange={(url) =>
          onPatch({ image: url === "" ? { url: "", alt: "" } : mediaFromUrl(image, url) })
        }
        onKindChange={(kind) => onPatch({ image: withMediaKind(slide.image, kind) })}
        media={imageMedia}
        testId="slide-image"
      />

      <ImageField
        label="Hochformat"
        hint="Für schmale, stehende Bildschirme; ohne eigenes Bild wird das Querformat beschnitten."
        compactEmpty
        image={portrait}
        onPick={() => onPick("imagePortrait")}
        pickLabel="Bild oder Video wählen"
        onClear={() => onPatch({ imagePortrait: undefined })}
        onAltChange={(alt) =>
          onPatch({ imagePortrait: portrait === undefined ? undefined : { ...portrait, alt } })
        }
        onUrlChange={(url) =>
          onPatch({ imagePortrait: url === "" ? undefined : mediaFromUrl(portrait, url) })
        }
        onKindChange={(kind) =>
          onPatch({
            imagePortrait: portrait === undefined ? undefined : withMediaKind(portrait, kind),
          })
        }
        media={portraitMedia}
        testId="slide-portrait"
      />
    </>
  );
}

function TextSection({ slide, onPatch }: Pick<SlideFormProps, "slide" | "onPatch">): ReactElement {
  return (
    <FormSection title="Text">
      <Field label="Überschrift" hint="Kurz halten — bis etwa 24 Zeichen bleibt sie einzeilig.">
        <Input
          type="text"
          data-testid="slide-headline"
          value={slide.headline}
          onChange={(event) => onPatch({ headline: event.target.value })}
        />
      </Field>
      <Field label="Unterzeile" hint="Optional.">
        <Textarea
          data-testid="slide-subline"
          rows={2}
          value={slide.subline ?? ""}
          onChange={(event) =>
            onPatch({ subline: event.target.value === "" ? undefined : event.target.value })
          }
        />
      </Field>
    </FormSection>
  );
}

export function SlideForm({ slide, onPatch, onPick, source }: SlideFormProps): ReactElement {
  return (
    <>
      <MediaSection slide={slide} onPatch={onPatch} onPick={onPick} />
      <TextSection slide={slide} onPatch={onPatch} />
      <CtaListForm ctas={slide.ctas ?? []} onChange={(ctas) => onPatch({ ctas })} source={source} />
    </>
  );
}
