# FAQ

**Frage:** Ich habe eine Folie angelegt, aber die Bühne bleibt leer.

Antwort: Der Folie fehlt das Bild. Folien ohne Bild werden nicht gezeigt — eine
leere dunkle Fläche wäre auf der Seite nicht von einem Fehler zu unterscheiden.
Öffnen Sie den Editor und wählen Sie unter **Bild** ein Bild aus.

**Frage:** Ich habe eine Beschriftung für die Schaltfläche eingetragen, aber
sie erscheint nicht.

Antwort: Die Schaltfläche braucht **beides** — Beschriftung und Ziel. Solange
eines der Felder leer ist, wird sie nicht angezeigt.

**Frage:** Das Bild läuft nicht über die volle Fensterbreite.

Antwort: Zwei mögliche Ursachen. Entweder ist **Über die volle Breite zeigen**
ausgeschaltet, oder das Widget steht in einer Spalte neben anderen Inhalten.
Setzen Sie es in eine eigene Zeile am Kopf der Seite.

**Frage:** Der Text steht nicht dort, wo der übrige Seiteninhalt beginnt.

Antwort: Die Bühne richtet sich nach der Inhaltsbreite, die die Seite meldet.
Weicht sie ab, melden Sie den Fall mit der Seitenadresse.

**Frage:** Statt des Editors sehe ich ein Textfeld „Einträge“ mit geschweiften
Klammern darin.

Antwort: Der Editor konnte sich nicht in den Dialog einhängen. Schließen Sie
die Einstellungen und öffnen Sie sie erneut. Der Text im Feld ist die
Rohfassung der Einträge; bearbeiten Sie ihn nicht von Hand — ein Tippfehler
darin lässt alle Folien verschwinden.

**Frage:** Die Bühne wechselt nicht von selbst.

Antwort: Drei mögliche Ursachen: Es gibt nur eine Folie; **Sekunden je Folie**
steht auf `0`; oder im Betriebssystem ist „Bewegung reduzieren“ eingeschaltet.
Im letzten Fall ist das gewollt — geblättert werden kann weiterhin über Pfeile
und Striche.

**Frage:** Auf dem Telefon sehe ich keine Pfeile.

Antwort: Das ist so vorgesehen. Auf schmalen Bildschirmen wird gewischt; die
Striche unter dem Text zeigen weiterhin an, welche Folie gerade vorn liegt.

**Frage:** Mein Motiv ist am Rand angeschnitten.

Antwort: Die Bühne schneidet je nach Fensterbreite auf 21:9 oder 4:3 zu. Wählen
Sie ein Bild mit Luft um das Motiv, oder hinterlegen Sie unter **Bild für
Hochformat** einen eigenen, hochkant zugeschnittenen Ausschnitt.

**Frage:** Kann ich mehr als acht Folien anlegen?

Antwort: Nein. Bei fünf Sekunden je Folie dauert ein voller Durchlauf schon bei
acht Folien vierzig Sekunden — so lange bleibt niemand auf einer Bühne stehen.
Die Acht gilt für alle Folien zusammen: Ein Kanal-Eintrag mit fünf Beiträgen
lässt neben sich nur noch drei weitere Folien zu.

**Frage:** Muss ich die Bühne pflegen, wenn in den News ein neuer Beitrag
erscheint?

Antwort: Bei einem **News-Kanal**-Eintrag nicht — er zeigt immer die aktuellen
Beiträge des Kanals nach den eingestellten Filtern. Ein **News-Beitrag**-
Eintrag bleibt dagegen bei dem Beitrag, den Sie gewählt haben.

**Frage:** Eine Folie aus den News ist plötzlich verschwunden.

Antwort: Der Beitrag wurde gelöscht, verschoben oder ist für die lesende Person
nicht sichtbar. Nur diese eine Folie fällt weg; die übrigen bleiben stehen.

**Frage:** Mein Kanal-Eintrag zeigt weniger Folien als eingestellt.

Antwort: Meist sind die Filter zu eng. **Nur Beiträge mit Bild** ist
voreingestellt — ein Kanal ohne Bilder liefert damit nichts. Prüfen Sie die
Vorschau im Editor: sie zeigt genau das, was auf der Bühne erscheinen wird.

**Frage:** In der Kanalauswahl steht kein einziger Kanal, stattdessen ein
Textfeld für eine Kennung.

Antwort: Die Liste der News-Kanäle war nicht erreichbar. Laden Sie den Dialog
neu. Hilft das nicht, tragen Sie die Kennung des Kanals von Hand ein; sie steht
in der Adresse des Kanals im CMS.

**Frage:** Warum ist das Bild eines News-Beitrags auf der Bühne unscharf oder
seltsam angeschnitten?

Antwort: Beitragsbilder sind für das Feed-Format geschnitten, nicht für eine
bildschirmhohe Bühne. Hinterlegen Sie im Eintrag unter **Bühnenbild
überschreiben** ein eigenes, quer und mindestens 1920 px breit.
