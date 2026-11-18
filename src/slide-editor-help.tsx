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
 * Die Hilfe des Folien-Editors in der Leiste des Rahmens. Tasten und den
 * Satz zu „Übernehmen“ ergänzt der Rahmen selbst; hier steht nur, was es
 * nur in diesem Widget gibt.
 */

import * as React from "react";

import { MAX_ITEMS } from "./editor-entries";

export const SLIDE_EDITOR_HELP = (
  <ul className="flex list-disc flex-col gap-2 pl-5">
    <li>
      <strong>Folie</strong>: Bild oder Video, Überschrift, Unterzeile und bis zu drei
      Buttons selbst pflegen.
    </li>
    <li>
      <strong>News-Beitrag</strong>: ein bestimmter Beitrag; Titel, Teaser und Bild kommen aus
      den News und lassen sich überschreiben.
    </li>
    <li>
      <strong>News-Kanal</strong>: je Beitrag eines Kanals eine Folie – er führt sich selbst
      nach.
    </li>
    <li>
      Die <strong>Reihenfolge</strong> der Liste ist die Reihenfolge im Slider: am Griff ziehen
      oder über dem Formular nach oben und unten schieben.
    </li>
    <li>Höchstens {MAX_ITEMS} Einträge; ein Kanal zählt als einer.</li>
    <li>Eine Folie ohne Bild wird nicht gezeigt; „Übernehmen“ nennt sie.</li>
    <li>
      Rechts steht verkleinert, was der gewählte Eintrag auf die Bühne bringt. Desktop, Tablet
      und Mobil zeigen ihn im Gerätrahmen – News als die Folien, die daraus werden.
    </li>
    <li>
      Höhe, Breite, Lage, Abstand, Sekunden je Folie und Bedienelemente stehen nach dem
      Schließen im Dialog von Staffbase.
    </li>
  </ul>
);
