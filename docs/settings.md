# Einstellungen

Alles wird im Editor gepflegt, der sich beim Öffnen der Einstellungen von
selbst zeigt: die Einträge links und in der Mitte, die Einstellungen der Bühne
rechts im Panel **Widget**. Im Dialog von Staffbase bleibt nur das Textfeld
„Einträge“ hinter dem Editor; es ist die Rohfassung und muss nicht angefasst
werden.

| Einstellung | Beschreibung |
| --- | --- |
| Einträge | Der Inhalt der Bühne: eigene Folien, einzelne News-Beiträge und ganze News-Kanäle. |

### Panel „Widget“, Reiter „Gestaltung“

| Einstellung | Beschreibung |
| --- | --- |
| Höhe | `Abschnittshöhe` ist voreingestellt. Daneben `Klein (320–420 px)`, `Mittel (420–560 px)`, `Groß (560–720 px)` und `Bildschirmhöhe`. |
| Volle Breite | Eingeschaltet (Voreinstellung) läuft das Bild über die volle Fensterbreite, während der Text auf der Fluchtlinie der Seite bleibt. Ausgeschaltet bleibt die Bühne in der Inhaltsspalte. |
| Lage | `Nach den Brotkrumen` ist voreingestellt: die Bühne beginnt unter der Brotkrumen-Zeile. `Vor den Brotkrumen` setzt sie bündig unter das Menü und rückt die Brotkrumen darunter. Greift nur, wenn die Bühne oben auf der Seite steht und die Seite überhaupt Brotkrumen hat. |
| Abstand unten | `Standard` ist voreingestellt: unter der Bühne bleibt der Abstand, den die Seite zwischen ihre Blöcke setzt. `Keiner` lässt den folgenden Block direkt anschliessen — bei „Vor den Brotkrumen“ direkt unter den Brotkrumen. |

### Panel „Widget“, Reiter „Verhalten“

| Einstellung | Beschreibung |
| --- | --- |
| Sekunden pro Folie | `5` ist voreingestellt, erlaubt sind `0` bis `30`; Kommazahlen gehen auch. `0` hält die Bühne an; dann wird nur über Pfeile und Striche geblättert — und wenn die Bedienelemente abgeschaltet sind, nur noch mit Wischen und den Pfeiltasten. Leer heißt: wie bisher. |
| Bedienelemente zeigen | Eingeschaltet (Voreinstellung) erscheinen Pfeile und Striche. Ausgeschaltet verschwinden beide; geblättert wird weiter mit Wischen und den Pfeiltasten, und die eingestellte Zeit je Folie läuft unverändert. |

### Bestehende Bühnen

Bis Version 0.4 standen diese Einstellungen als einzelne Felder im Dialog von
Staffbase. Bestehende Bühnen behalten sie: Solange eine Einstellung im Panel
nicht bedient wurde, gilt weiter der Wert des alten Feldes. Das Panel zeigt
ihn an, wo er sich lesen lässt; sonst steht bei Auswahlfeldern **Wie bisher**
und bei Schaltern der Hinweis „Noch nicht hier festgelegt“. Erst wer eine
Einstellung bedient und **Übernehmen** wählt, legt sie im Editor fest — und
nur diese eine. Wer den Editor öffnet und ohne Änderung übernimmt, ändert
nichts. Die alten Felder sind im Dialog ausgeblendet.

## Sorten von Einträgen

| Sorte | Beschreibung |
| --- | --- |
| Folie | Eine von Hand gepflegte Folie: Bild, Video oder Animation, Überschrift, Unterzeile, Buttons. |
| News-Beitrag | Ein bestimmter Beitrag als eine Folie. Inhalt und Ziel kommen aus dem Beitrag. |
| News-Kanal | Ein ganzer Kanal, eine Folie je Beitrag. Neue Beiträge erscheinen ohne weiteres Zutun. |

Alle drei stehen in derselben Liste, lassen sich mischen und per Ziehen am
Griff oder über **nach oben** und **nach unten** sortieren. Insgesamt zeigt
die Bühne höchstens acht Folien — ein Kanal-Eintrag zählt dabei mit allen
Folien, die er beisteuert.

## Felder einer Folie

| Feld | Beschreibung |
| --- | --- |
| Hintergrund | **Bild oder Video** (eine Datei, siehe unten) oder **Animation**: ein bewegtes Muster aus Quadraten in MAN-Farben, das das Widget selbst zeichnet. Eine Animation passt sich jeder Bühnengröße an, braucht kein Hochformat und lädt nichts nach. |
| Muster | Nur bei Animation. Eckig: **Welle** (feine Quadrate, durch die eine Welle läuft und sie anhebt), **Raster** (ruhiges Raster mit wanderndem Lichtband), **Module** (locker verteilte Module, die pulsieren). Rund: **Punkte** (feine Punkte, die eine Kräuselung anhebt), **Linien** (fließende Höhenlinien, einzelne in Rot), **Ringe** (Punktringe, die sich ruhig von rechts ausbreiten), **Strömung** (Partikel, die kreisen und driften). Die Textseite links — auf dem Telefon unten — bleibt immer frei. |
| Deckkraft | Nur bei Animation. **100 %**, **75 %**, **50 %** oder **25 %**: Darunter wird die ganze Animation durchscheinend — Grund, Muster und Rot —, und der Abschnitt hinter der Bühne scheint durch. Die Schriftfarbe folgt dem Grundton, passend zum Hintergrund wählen. |
| Grundton | Nur bei Animation. **Dunkel** (Anthrazit, Schrift weiß) oder **Hell** (weiß, Schrift anthrazit). |
| Tempo | Nur bei Animation. **Ruhig** (ein Durchlauf in 20 Sekunden) oder **Lebhaft** (12 Sekunden). Bei eingeschalteter Einstellung „Bewegung reduzieren“ des Geräts steht die Animation still. |
| Rote Akzente | Nur bei Animation. Schalter: rote Elemente laufen mit — etwa jedes hundertste im Feld, bei Linien und Ringen einzelne ganze Linien bzw. Ringe. |
| Bild oder Video | Pflicht, wenn der Hintergrund **Bild oder Video** ist. Aus der Mediathek oder über eine Adresse (`https://…`). Quer, mindestens 1920 px breit. Ohne Bild oder Video wird die Folie nicht gezeigt. |
| Adresse | Hinter **Adresse einfügen**, statt der Mediathek: die `https`-Adresse eines Bildes oder Videos. Andere Adressen werden nicht übernommen. |
| Art | Bild oder Video. Stellt sich an der Endung der Adresse selbst ein (`.mp4`, `.webm`, `.mov` sind Videos); nur bei Adressen ohne Endung von Hand wählen. |
| Bild- bzw. Videobeschreibung | Was zu sehen ist. Nur bei rein schmückenden Bildern und Videos leer lassen — Screenreader lesen dieses Feld vor. |
| Hochformat | Optional. Wird auf schmalen, stehenden Bildschirmen gezeigt. Fehlt es, wird überall der Querzuschnitt verwendet. |
| Überschrift | Kurz halten: bis etwa 24 Zeichen bleibt sie einzeilig. |
| Unterzeile | Optional, ein bis zwei Zeilen. |
| Buttons | Optional, bis zu drei je Folie. Stehen als Liste mit Stil und Ziel; ein Klick klappt die Felder eines Buttons auf. Nach oben/unten, duplizieren und löschen über die Symbole über den Feldern. Ein Button erscheint nur, wenn Beschriftung und Ziel ausgefüllt sind. Nur bei von Hand gepflegten Folien; News-Folien bekommen ihren Button aus dem Beitrag. |
| Ziel | **Adresse** (`https://…`, `mailto:…`, `tel:…` oder ein Pfad wie `/content/…`), **Seite** aus Staffbase oder **News-Beitrag** aus Staffbase (erst Kanal, dann Beitrag). Andere Adressen, etwa `javascript:`, werden nicht übernommen. |
| Stil | **Rot gefüllt** (Hauptaktion, Vorgabe), **Weiß gefüllt**, **Weiße Kontur** oder **Textverweis**. Neue Buttons ab dem zweiten beginnen als Kontur, damit nicht zwei rote Flächen nebeneinanderstehen. |
| Symbol | Optional: Pfeil, Winkel, externer Link, Herunterladen, Abspielen, Dokument, Kalender, E-Mail, Telefon oder Information. Mit Symbol erscheint **Symbol steht**: vor oder nach dem Text. |
| In neuem Tab öffnen | Schalter. Öffnet das Ziel des Buttons in einem neuen Tab. Für externe Ziele üblich. |

## Felder eines News-Beitrags

| Feld | Beschreibung |
| --- | --- |
| Kanal | Pflicht. Bestimmt, welche Beiträge zur Auswahl stehen. |
| Beitrag | Pflicht. Die fünfzig jüngsten Beiträge des Kanals, neueste zuerst. |
| Überschrift | Optional. Leer lassen, um den Titel des Beitrags zu übernehmen. |
| Anrisstext zeigen | Eingeschaltet voreingestellt. Der Anrisstext (Teaser) steht als Unterzeile und wird auf 240 Zeichen gekürzt. |
| Beschriftung des Buttons | `Mehr erfahren` voreingestellt. Leer lassen, um den Button wegzulassen; das Ziel ist immer der Beitrag. |
| Bühnenbild | Optional. Sinnvoll, wenn das Beitragsbild für die Bühne zu knapp geschnitten ist. |
| Hochformat | Optional. Wird auf schmalen, stehenden Bildschirmen gezeigt. |

## Felder eines News-Kanals

| Feld | Beschreibung |
| --- | --- |
| Kanal | Pflicht. Alle Folien dieses Eintrags stammen aus diesem Kanal. |
| Anzahl Beiträge | `3` voreingestellt, höchstens acht. |
| Reihenfolge | `Neueste zuerst` (Voreinstellung) oder `Älteste zuerst`. |
| Nur hervorgehobene Beiträge | Ausgeschaltet voreingestellt. Beschränkt auf das, was in den News angepinnt ist. |
| Nur Beiträge mit Bild | Eingeschaltet voreingestellt. Ohne Bild bliebe von der Folie nur eine dunkle Fläche mit Text. |
| Hashtags | Optional, mehrere durch Komma getrennt. Ein Beitrag genügt, wenn er einen davon trägt. |
| Anrisstext zeigen | Eingeschaltet voreingestellt. |
| Beschriftung des Buttons | Gilt für alle Folien des Kanals. Leer lassen, um den Button wegzulassen. |

## Hinweise

- **Höhe** wirkt als Grenze, nicht als feste Höhe: die Bühne ist auf breiten
  Bildschirmen 21:9 und auf schmalen 4:3 und wird nur an den Grenzen der
  gewählten Stufe geklemmt.
- `Bildschirmhoch` füllt die sichtbare Seite abzüglich der Kopfzeile,
  mindestens aber 420 px.
- **Sekunden pro Folie** wirkt erst ab der zweiten Folie.
- Wer im Betriebssystem „Bewegung reduzieren“ eingestellt hat, sieht keinen
  Wechsel von selbst — unabhängig von dieser Einstellung.
- Oben schliesst die Bühne immer bündig an — an die Brotkrumen oder, bei
  „Vor den Brotkrumen“, an das Menü. Den Innenabstand, den der Abschnitt über
  seinem ersten Block hält, gleicht sie dafür aus. Das geschieht nur, wenn
  über der Bühne kein anderer Inhalt steht.
- Steht die Bühne als letzter Block in ihrem Abschnitt, endet der Abschnitt
  mit ihr — bei jeder Höhe. Bei einer festen Stufe passt sich der Abschnitt der
  Bühne an, bei `Abschnittshöhe` die Bühne dem Abschnitt.
- **Abstand unten** regelt den Abstand zum nächsten Block im selben
  Abschnitt. Der Innenabstand eines folgenden Abschnitts gehört diesem und
  bleibt.
- Bei `Abschnittshöhe` nimmt die Bühne die Höhe des Abschnitts nur ein, wenn
  sie allein darin steht. Mit weiteren Blöcken im selben Abschnitt behält sie
  ihr Seitenverhältnis, und die Blöcke rücken ohne Abstand an sie heran.
- Die Bedienelemente erscheinen erst ab der zweiten Folie. Auf schmalen
  Bildschirmen sind die Pfeile ausgeblendet; dort wird gewischt.
- Ein Beitrag, der gelöscht wird oder für die lesende Person nicht sichtbar
  ist, nimmt nur seine eigene Folie mit. Die übrigen Folien bleiben stehen.
- News-Folien folgen der Sprache der lesenden Person, soweit der Beitrag
  übersetzt ist; sonst der ersten vorhandenen Fassung.
- Die **Vorschau** in Desktop, Tablet und Mobil rechnet bei News-Einträgen mit
  denselben Regeln wie die veröffentlichte Seite. Was dort nicht steht,
  erscheint auch auf der Bühne nicht.
