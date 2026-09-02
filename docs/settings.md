# Einstellungen

| Einstellung | Beschreibung |
| --- | --- |
| Einträge | Der Inhalt der Bühne: eigene Folien, einzelne News-Beiträge und ganze News-Kanäle. Wird über den Editor gepflegt, der sich beim Öffnen der Einstellungen von selbst zeigt. Das darunterliegende Textfeld ist die Rohfassung und muss nicht angefasst werden. |
| Höhe | `Standard (420–560 px)` ist voreingestellt. Daneben `Niedrig (320–420 px)`, `Hoch (560–720 px)` und `Bildschirmhoch`. |
| Über die volle Breite zeigen | Eingeschaltet (Voreinstellung) läuft das Bild über die volle Fensterbreite, während der Text auf der Fluchtlinie der Seite bleibt. Ausgeschaltet bleibt die Bühne in der Inhaltsspalte. |
| Sekunden je Folie | `5` ist voreingestellt. `0` hält die Bühne an; dann wird nur über Pfeile und Striche geblättert. Höchstens 30. |

## Sorten von Einträgen

| Sorte | Beschreibung |
| --- | --- |
| Folie | Eine von Hand gepflegte Folie: Bild, Überschrift, Unterzeile, Schaltfläche. |
| News-Beitrag | Ein bestimmter Beitrag als eine Folie. Inhalt und Ziel kommen aus dem Beitrag. |
| News-Kanal | Ein ganzer Kanal, eine Folie je Beitrag. Neue Beiträge erscheinen ohne weiteres Zutun. |

Alle drei stehen in derselben Liste, lassen sich mischen und über **↑** und
**↓** sortieren. Insgesamt zeigt die Bühne höchstens acht Folien — ein
Kanal-Eintrag zählt dabei mit allen Folien, die er beisteuert.

## Felder einer Folie

| Feld | Beschreibung |
| --- | --- |
| Bild | Pflicht. Quer, mindestens 1920 px breit. Ohne Bild wird die Folie nicht gezeigt. |
| Bildbeschreibung | Was auf dem Bild zu sehen ist. Nur bei rein schmückenden Bildern leer lassen — Screenreader lesen dieses Feld vor. |
| Bild für Hochformat | Optional. Wird auf schmalen, stehenden Bildschirmen gezeigt. Fehlt es, wird überall der Querzuschnitt verwendet. |
| Überschrift | Wird in Versalien gesetzt. Bis etwa 24 Zeichen bleibt sie einzeilig. |
| Unterzeile | Optional, ein bis zwei Zeilen. |
| Schaltfläche | Optional. Erscheint nur, wenn Beschriftung und Ziel ausgefüllt sind. Höchstens eine je Folie. |
| In neuem Tab öffnen | Öffnet das Ziel der Schaltfläche in einem neuen Tab. Für externe Ziele üblich. |

## Felder eines News-Beitrags

| Feld | Beschreibung |
| --- | --- |
| Kanal | Pflicht. Bestimmt, welche Beiträge zur Auswahl stehen. |
| Beitrag | Pflicht. Die fünfzig jüngsten Beiträge des Kanals, neueste zuerst. |
| Überschrift überschreiben | Optional. Leer lassen, um den Titel des Beitrags zu übernehmen. |
| Teaser als Unterzeile zeigen | Eingeschaltet voreingestellt. Der Teaser wird auf 240 Zeichen gekürzt. |
| Beschriftung der Schaltfläche | `Mehr erfahren` voreingestellt. Leer lassen, um die Schaltfläche wegzulassen; das Ziel ist immer der Beitrag. |
| Bühnenbild überschreiben | Optional. Sinnvoll, wenn das Beitragsbild für die Bühne zu knapp geschnitten ist. |
| Bild für Hochformat | Optional. Wird auf schmalen, stehenden Bildschirmen gezeigt. |

## Felder eines News-Kanals

| Feld | Beschreibung |
| --- | --- |
| Kanal | Pflicht. Alle Folien dieses Eintrags stammen aus diesem Kanal. |
| Anzahl der Folien | `3` voreingestellt, höchstens acht. |
| Reihenfolge | `Neueste zuerst` (Voreinstellung) oder `Älteste zuerst`. |
| Nur hervorgehobene Beiträge | Ausgeschaltet voreingestellt. Beschränkt auf das, was in den News angepinnt ist. |
| Nur Beiträge mit Bild | Eingeschaltet voreingestellt. Ohne Bild bliebe von der Folie nur eine dunkle Fläche mit Text. |
| Schlagworte | Optional, mehrere durch Komma getrennt. Ein Beitrag genügt, wenn er eines davon trägt. |
| Teaser als Unterzeile zeigen | Eingeschaltet voreingestellt. |
| Beschriftung der Schaltfläche | Gilt für alle Folien des Kanals. Leer lassen, um die Schaltfläche wegzulassen. |

## Hinweise

- **Höhe** wirkt als Grenze, nicht als feste Höhe: die Bühne ist auf breiten
  Bildschirmen 21:9 und auf schmalen 4:3 und wird nur an den Grenzen der
  gewählten Stufe geklemmt.
- `Bildschirmhoch` füllt die sichtbare Seite abzüglich der Kopfzeile,
  mindestens aber 420 px.
- **Sekunden je Folie** wirkt erst ab der zweiten Folie.
- Wer im Betriebssystem „Bewegung reduzieren“ eingestellt hat, sieht keinen
  Wechsel von selbst — unabhängig von dieser Einstellung.
- Die Bedienelemente erscheinen erst ab der zweiten Folie. Auf schmalen
  Bildschirmen sind die Pfeile ausgeblendet; dort wird gewischt.
- Ein Beitrag, der gelöscht wird oder für die lesende Person nicht sichtbar
  ist, nimmt nur seine eigene Folie mit. Die übrigen Folien bleiben stehen.
- News-Folien folgen der Sprache der lesenden Person, soweit der Beitrag
  übersetzt ist; sonst der ersten vorhandenen Fassung.
- Die **Vorschau** im Editor rechnet mit denselben Regeln wie die
  veröffentlichte Seite. Was dort nicht steht, erscheint auch auf der Bühne
  nicht.
