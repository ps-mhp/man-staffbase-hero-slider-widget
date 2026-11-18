# Instellingen

Alles wordt beheerd in de editor, die automatisch verschijnt wanneer je de instellingen opent
: de items links en in het midden, de instellingen van het podium
rechts in het paneel **Widget**. In het dialoogvenster van Staffbase blijft alleen het tekstveld
„Items“ achter de editor; dit is de ruwe versie en hoeft niet te worden aangepast
.

| Instelling | Beschrijving |
| --- | --- |
| Items | De inhoud van het podium: eigen dia’s, afzonderlijke nieuwsberichten en volledige nieuwskanalen. |

### Paneel „Widget“, tabblad „Ontwerp“

| Instelling | Beschrijving |
| --- | --- |
| Hoogte | `Sectiehoogte` is standaard ingesteld. Daarnaast `Klein (320–420 px)`, `Gemiddeld (420–560 px)`, `Groot (560–720 px)` en `Schermhoogte`. |
| Volledige breedte | Indien ingeschakeld (standaardinstelling) strekt de afbeelding zich uit over de volledige vensterbreedte, terwijl de tekst binnen de uitlijningslijn van de pagina blijft. Indien uitgeschakeld blijft het podium binnen de inhoudskolom. |
| Positie | `Na de broodkruimels` is de standaardinstelling: het podium begint onder de broodkruimelrij. `Voor de broodkruimels` plaatst het podium gelijk met het menu en verschuift de broodkruimels eronder. Dit geldt alleen als het paneel bovenaan de pagina staat en de pagina überhaupt broodkruimels heeft. |
| Afstand onderaan | `Standaard` is de standaardinstelling: onder het paneel blijft de afstand die de pagina tussen haar blokken aanhoudt. `Geen` zorgt ervoor dat het volgende blok direct aansluit — bij „Voor de broodkruimels“ direct onder de broodkruimels. |

### Paneel „Widget“, tabblad „Gedrag“

| Instelling | Beschrijving |
| --- | --- |
| Seconden per dia | `5` is de standaardinstelling, toegestaan zijn `0` tot `30`; getallen met komma’s zijn ook mogelijk. Bij `0` wordt het podium gepauzeerd; dan wordt er alleen met pijltjes en streepjes doorgebladerd — en als de bedieningselementen zijn uitgeschakeld, alleen nog met vegen en de pijltjestoetsen. Leeg betekent: zoals voorheen. |
| Bedieningselementen weergeven | Ingeschakeld (standaardinstelling) verschijnen pijltjes en streepjes. Uitgeschakeld verdwijnen beide; bladeren gaat verder met vegen en de pijltjestoetsen, en de ingestelde tijd per dia blijft ongewijzigd. |

### Bestaande scènes

Tot versie 0.4 stonden deze instellingen als afzonderlijke velden in het dialoogvenster van
Staffbase. Bestaande podia behouden deze: zolang een instelling in het paneel
niet is gewijzigd, blijft de waarde van het oude veld van kracht. Het paneel geeft
deze weer waar deze leesbaar is; anders staat bij keuzelijsten **Zoals voorheen**
en bij schakelaars de opmerking „Nog niet hier ingesteld“. Pas wanneer iemand een
instelling wijzigt en **Toepassen** kiest, legt deze vast in de editor — en
alleen deze ene. Wie de editor opent en zonder wijzigingen toepast, verandert
niets. De oude velden zijn verborgen in het dialoogvenster.

## Soorten items

| Soort | Beschrijving |
| --- | --- |
| Dia | Een handmatig onderhouden dia: afbeelding of video, kop, ondertitel, knoppen. |
| Nieuwsbericht | Een specifiek bericht als dia. Inhoud en bestemming komen uit het bericht. |
| Nieuws-kanaal | Een heel kanaal, één dia per bericht. Nieuwe berichten verschijnen zonder verdere handelingen. |

Alle drie staan in dezelfde lijst, kunnen worden gemengd en gesorteerd door aan de
handgreep te slepen of via **omhoog** en **omlaag**. In totaal toont
het podium maximaal acht dia’s — een kanaalvermelding telt daarbij mee met alle
dia’s die het bijdraagt.

## Velden van een dia

| Veld | Beschrijving |
| --- | --- |
| Afbeelding of video | Verplicht. Uit de mediabibliotheek of via een adres (`https://…`). Liggend, minimaal 1920 px breed. Zonder afbeelding of video wordt de dia niet weergegeven. |
| Adres | Achter **Adres invoegen**, in plaats van de mediabibliotheek: het `https`-adres van een afbeelding of video. Andere adressen worden niet overgenomen. |
| Type | Afbeelding of video. Wordt automatisch ingesteld op basis van de extensie van het adres (`.mp4`, `.webm`, `.mov` zijn video’s); alleen handmatig selecteren bij adressen zonder extensie. |
| Afbeeldings- of videobeschrijving | Wat er te zien is. Alleen leeg laten bij puur decoratieve afbeeldingen en video’s — schermlezers lezen dit veld voor. |
| Staand formaat | Optioneel. Wordt weergegeven op smalle, staande schermen. Ontbreekt dit, wordt overal het liggende formaat gebruikt. |
| Kop | Houd het kort: tot ongeveer 24 tekens blijft het op één regel. |
| Ondertitel | Optioneel, één tot twee regels. |
| Knoppen | Optioneel, maximaal drie per dia. Worden weergegeven als lijst met stijl en bestemming; een klik opent de velden van een knop. Naar boven/beneden, dupliceren en verwijderen via de pictogrammen boven de velden. Een knop verschijnt alleen als de tekst en de bestemming zijn ingevuld. Alleen bij handmatig onderhouden dia’s; nieuwsdia’s krijgen hun knop uit het bericht. |
| Bestemming | **Adres** (`https://…`, `mailto:…`, `tel:…` of een pad zoals `/content/…`), **pagina** uit Staffbase of **nieuwsbericht** uit Staffbase (eerst kanaal, dan bericht). Andere adressen, zoals `javascript:`, worden niet overgenomen. |
| Stijl | **Rood gevuld** (hoofdactie, standaard), **Wit gevuld**, **Witte omtrek** of **Tekstlink**. Nieuwe knoppen vanaf de tweede beginnen als omtrek, zodat er geen twee rode vlakken naast elkaar staan. |
| Symbool | Optioneel: pijl, hoek, externe link, downloaden, afspelen, document, kalender, e-mail, telefoon of informatie. Als er een symbool wordt gekozen, verschijnt **het symbool**: voor of achter de tekst. |
| Openen in nieuw tabblad | Schakelaar. Opent de bestemming van de knop in een nieuw tabblad. Gebruikelijke instelling voor externe bestemmingen. |

## Velden van een nieuwsbericht

| Veld | Beschrijving |
| --- | --- |
| Kanaal | Verplicht. Bepaalt welke berichten beschikbaar zijn. |
| Bericht | Verplicht. De vijftig meest recente berichten van het kanaal, met de nieuwste bovenaan. |
| Kop | Optioneel. Laat leeg om de titel van het bericht over te nemen. |
| Teaser weergeven | Standaard ingeschakeld. De teaser wordt als ondertitel weergegeven en ingekort tot 240 tekens. |
| Tekst op de knop | Standaard ingesteld op `Meer informatie`. Laat leeg om de knop weg te laten; de bestemming is altijd het bericht. |
| Achtergrondafbeelding | Optioneel. Handig als de afbeelding van het bericht te krap is voor de achtergrond. |
| Staand formaat | Optioneel. Wordt weergegeven op smalle, staande schermen. |

## Velden van een nieuwskanaal

| Veld | Beschrijving |
| --- | --- |
| Kanaal | Verplicht. Alle dia’s van dit bericht zijn afkomstig uit dit kanaal. |
| Aantal berichten | Standaard ingesteld op `3`, maximaal acht. |
| Volgorde | `Nieuwste eerst` (standaard) of `Oudste eerst`. |
| Alleen uitgelichte berichten | Standaard uitgeschakeld. Beperkt tot wat in het nieuws is vastgezet. |
| Alleen berichten met afbeelding | Standaard ingeschakeld. Zonder afbeelding zou de dia slechts een donker vlak met tekst zijn. |
| Hashtags | Optioneel, meerdere gescheiden door komma’s. Eén bericht volstaat als het een van deze hashtags bevat. |
| Voorproeftekst weergeven | Standaard ingeschakeld. |
| Tekst op de knop | Geldt voor alle dia’s van het kanaal. Laat leeg om de knop weg te laten. |

## Opmerkingen

- **Hoogte** fungeert als grens, niet als vaste hoogte: het podium past zich aan op brede
  21:9-schermen en op smalle 4:3-schermen en wordt alleen vastgeklemd aan de randen van het
  geselecteerde niveau.
- `Schermhoogte` vult de zichtbare zijde minus de koptekst,
  maar minimaal 420 px.
- **Seconden per dia** werkt pas vanaf de tweede dia.
- Wie in het besturingssysteem „Beweging verminderen“ heeft ingesteld, ziet geen
  overgang vanzelf — ongeacht deze instelling.
- Bovenaan sluit het podium altijd gelijk aan — aan de broodkruimels of, bij
  „Voor de broodkruimels“, aan het menu. De binnenafstand die de sectie boven
  zijn eerste blok aanhoudt, compenseert het daarvoor. Dit gebeurt alleen als
  er geen andere inhoud boven het podium staat.
- Als het podium het laatste blok in zijn sectie is, eindigt de sectie
  mee met het podium — ongeacht de hoogte. Bij een vaste hoogte past de sectie zich aan het
  podium aan, bij `sectiehoogte` past het podium zich aan de sectie aan.
- **Afstand onderaan** regelt de afstand tot het volgende blok in dezelfde
  sectie. De binnenafstand van een volgende sectie hoort bij deze sectie en
  blijft behouden.
- Bij `sectiehoogte` neemt het podium de hoogte van de sectie alleen in als
  het er alleen in staat. Met andere blokken in hetzelfde gedeelte behoudt het
  zijn beeldverhouding, en de blokken schuiven zonder tussenruimte tegen het podium aan.
- De bedieningselementen verschijnen pas vanaf de tweede dia. Op smalle
  schermen zijn de pijltjes verborgen; daar wordt geveegd.
- Een bericht dat wordt verwijderd of niet zichtbaar is voor de lezer,
  neemt alleen zijn eigen dia mee. De overige dia’s blijven staan.
- Nieuwsdia’s volgen de taal van de lezer, voor zover het bericht
  is vertaald; anders de eerste beschikbare versie.
- Het **voorbeeld** op desktop, tablet en mobiel hanteert voor nieuwsberichten
  dezelfde regels als de gepubliceerde pagina. Wat daar niet staat,
  verschijnt ook niet op het scherm.
