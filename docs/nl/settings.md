# Instellingen

| Instelling | Beschrijving |
| --- | --- |
| Items | De inhoud van het podium: eigen dia's, afzonderlijke nieuwsberichten en complete nieuwskanalen. Wordt beheerd via de editor, die automatisch verschijnt wanneer je de instellingen opent. Het tekstveld eronder is de ruwe versie en hoeft niet te worden aangepast. |
| Hoogte | `Standaard (420–560 px)` is de standaardinstelling. Daarnaast `Laag (320–420 px)`, `Hoog (560–720 px)` en `Schermhoogte`. |
| Over de volledige breedte weergeven | Indien ingeschakeld (standaardinstelling) strekt de afbeelding zich uit over de volledige breedte van het venster, terwijl de tekst binnen de uitlijningslijn van de pagina blijft. Indien uitgeschakeld blijft het podium binnen de inhoudskolom. |
| Seconden per dia | `5` is de standaardinstelling. Bij `0` wordt het podium gepauzeerd; dan kan alleen met pijltjes en streepjes worden gebladerd — en als de bedieningselementen zijn uitgeschakeld, alleen nog met vegen en de pijltjestoetsen. Maximaal 30. |
| Positie ten opzichte van de broodkruimels | `Na de broodkruimels` is de standaardinstelling: het podium begint onder de broodkruimelregel. `Voor de broodkruimels` plaatst het podium gelijk met het menu en verschuift de broodkruimels eronder. Dit werkt alleen als het podium bovenaan de pagina staat en de pagina überhaupt broodkruimels heeft. |
| Bedieningselementen weergeven | Ingeschakeld (standaardinstelling) verschijnen pijlen en streepjes. Uitgeschakeld verdwijnen beide; je bladert verder door te vegen en met de pijltjestoetsen, en de ingestelde tijd per dia blijft ongewijzigd. |
| Afstand naar beneden | `Standaard` is de standaardinstelling: onder het podium blijft de afstand behouden die de pagina tussen haar blokken aanbrengt. `Geen afstand` laat het volgende blok direct aansluiten — bij „Voor de broodkruimels“ direct onder de broodkruimels. |

## Soorten items

| Soort | Beschrijving |
| --- | --- |
| Dia | Een handmatig bewerkte dia: afbeelding, kop, ondertitel, knop. |
| Nieuwsbericht | Een specifiek bericht als dia. Inhoud en bestemming komen uit het bericht. |
| Nieuwskanaal | Een heel kanaal, één dia per bericht. Nieuwe berichten verschijnen zonder verdere handeling. |

Alle drie staan in dezelfde lijst, kunnen worden gemengd en via **↑** en
**↓** gesorteerd. In totaal toont het podium maximaal acht dia’s — een
kanaalvermelding telt daarbij mee met alle dia’s die het bijdraagt.

## Velden van een dia

| Veld | Beschrijving |
| --- | --- |
| Afbeelding of video | Verplicht. Uit de mediabibliotheek of via een adres (`https://…`). Liggend, minimaal 1920 px breed. Zonder afbeelding of video wordt de dia niet weergegeven. |
| Adres | In plaats van de mediabibliotheek: het `https`-adres van een afbeelding of video. Andere adressen worden niet overgenomen. |
| Type | Afbeelding of video. Wordt automatisch ingesteld op basis van de extensie van het adres (`.mp4`, `.webm`, `.mov` zijn video’s); alleen handmatig selecteren bij adressen zonder extensie. |
| Beschrijving van de afbeelding of video | Wat er te zien is. Laat dit veld alleen leeg bij afbeeldingen en video’s die puur decoratief zijn — schermlezers lezen dit veld voor. |
| Afbeelding of video voor staand formaat | Optioneel. Wordt weergegeven op smalle, staande schermen. Als dit ontbreekt, wordt overal de liggende versie gebruikt. |
| Kop | Houd het kort: tot ongeveer 24 tekens blijft het op één regel. |
| Ondertitel | Optioneel, één tot twee regels. |
| Knop | Optioneel. Verschijnt alleen als de tekst en de bestemming zijn ingevuld. Maximaal één per dia. |
| In nieuw tabblad openen | Opent de bestemming van de knop in een nieuw tabblad. Gebruikelijke optie voor externe bestemmingen. |

## Velden van een nieuwsbericht

| Veld | Beschrijving |
| --- | --- |
| Kanaal | Verplicht. Bepaalt welke berichten beschikbaar zijn. |
| Bericht | Verplicht. De vijftig meest recente berichten van het kanaal, met de nieuwste bovenaan. |
| Kop overschrijven | Optioneel. Laat leeg om de titel van het bericht over te nemen. |
| Teaser als ondertitel weergeven | Standaard ingeschakeld. De teaser wordt ingekort tot 240 tekens. |
| Tekst op de knop | Standaard ingesteld op `Meer informatie`. Laat leeg om de knop weg te laten; de bestemming is altijd het bericht. |
| Achtergrondafbeelding overschrijven | Optioneel. Handig als de afbeelding van het bericht te krap is uitgesneden voor de achtergrond. |
| Afbeelding voor staand formaat | Optioneel. Wordt weergegeven op smalle, staande schermen. |

## Velden van een nieuwskanaal

| Veld | Beschrijving |
| --- | --- |
| Kanaal | Verplicht. Alle dia’s van dit bericht zijn afkomstig uit dit kanaal. |
| Aantal dia’s | Standaard ingesteld op `3`, maximaal acht. |
| Volgorde | `Nieuwste eerst` (standaard) of `Oudste eerst`. |
| Alleen uitgelichte berichten | Standaard uitgeschakeld. Beperkt tot wat in het nieuws is vastgezet. |
| Alleen berichten met afbeelding | Standaard ingeschakeld. Zonder afbeelding zou de dia slechts een donker vlak met tekst zijn. |
| Trefwoorden | Optioneel, meerdere gescheiden door komma’s. Eén bericht volstaat als het één van deze trefwoorden bevat. |
| Teaser als ondertitel weergeven | Standaard ingeschakeld. |
| Tekst op de knop | Geldt voor alle dia’s van het kanaal. Laat leeg om de knop weg te laten. |

## Opmerkingen

- **Hoogte** fungeert als grens, niet als vaste hoogte: het podium past zich aan op brede
  21:9-schermen en op smalle 4:3-schermen en wordt alleen aan de randen van het
  geselecteerde niveau vastgezet.
- `Schermhoogte` vult de zichtbare zijde minus de koptekst,
  maar minimaal 420 px.
- **Seconden per dia** geldt pas vanaf de tweede dia.
- Wie in het besturingssysteem „Beweging verminderen“ heeft ingesteld, ziet geen
  overgang vanzelf — ongeacht deze instelling.
- Bovenaan sluit het podium altijd gelijk aan — aan de broodkruimels of, bij
  „Voor de broodkruimels“, aan het menu. De binnenafstand die de sectie boven
  zijn eerste blok aanhoudt, compenseert het daarvoor. Dit gebeurt alleen als
  er geen andere inhoud boven het podium staat.
- **Afstand naar beneden** verwijdert de afstand tussen de blokken, niet de
  binnenafstand aan het einde van een sectie. Als het podium als laatste blok in
  zijn sectie staat, blijft de afstand naar beneden behouden.
- De bedieningselementen verschijnen pas vanaf de tweede dia. Op smalle
  schermen worden de pijltjes verborgen; daar wordt geveegd.
- Een bijdrage die wordt verwijderd of niet zichtbaar is voor de lezer,
  neemt alleen zijn eigen dia mee. De overige dia’s blijven staan.
- Nieuwsdia’s volgen de taal van de lezer, voor zover het bericht
  vertaald is; anders de eerste beschikbare versie.
- Het **voorbeeld** in de editor hanteert dezelfde regels als de
  gepubliceerde pagina. Wat daar niet staat, verschijnt ook niet op het podium
 .
