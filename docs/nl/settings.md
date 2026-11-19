# Instellingen

Alles wordt beheerd in de editor, die automatisch verschijnt wanneer je de instellingen opent:
de items aan de linkerkant, in het midden het grote venster van het geselecteerde
item, en alle instellingen rechts in het paneel **Instellingen** — tabblad
**Dia** (of **Bijdrage**, **Kanaal**) voor het item, **Ontwerp** en
**Gedrag** voor het hele podium. Zonder item heet het paneel **Widget**. In het dialoogvenster van Staffbase blijft alleen het tekstveld
„Items“ achter de editor; dit is de ruwe versie en hoeft niet te worden aangepast
.

| Instelling | Beschrijving |
| --- | --- |
| Items | De inhoud van het podium: eigen dia’s, afzonderlijke nieuwsberichten en volledige nieuwskanalen. |

### Paneel „Instellingen“, tabblad „Ontwerp“

| Instelling | Beschrijving |
| --- | --- |
| Hoogte | `Sectiehoogte` is standaard ingesteld. Daarnaast `Klein (320–420 px)`, `Gemiddeld (420–560 px)`, `Groot (560–720 px)` en `Schermhoogte`. |
| Volledige breedte | Indien ingeschakeld (standaardinstelling) strekt de afbeelding zich uit over de volledige vensterbreedte, terwijl de tekst op de uitlijningslijn van de pagina blijft. Indien uitgeschakeld blijft het podium binnen de inhoudskolom. |
| Positie | `Na de broodkruimels` is de standaardinstelling: het podium begint onder de broodkruimelrij. `Voor de broodkruimels` plaatst het podium gelijk met het menu en verschuift de broodkruimels eronder. Dit geldt alleen als het paneel bovenaan de pagina staat en de pagina überhaupt broodkruimels heeft. |
| Afstand onderaan | `Standaard` is de standaardinstelling: onder het paneel blijft de afstand die de pagina tussen haar blokken aanhoudt. `Geen` zorgt ervoor dat het volgende blok direct aansluit — bij „Voor de broodkruimels“ direct onder de broodkruimels. |

### Paneel „Instellingen“, tabblad „Gedrag“

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
niets. De oude velden zijn in het dialoogvenster verborgen.

## Soorten items

| Soort | Beschrijving |
| --- | --- |
| Dia | Een handmatig onderhouden dia: afbeelding, video of animatie, kop, ondertitel, knoppen. |
| Nieuwsbericht | Een specifiek bericht als dia. Inhoud en bestemming komen uit het bericht. |
| Nieuws-kanaal | Een heel kanaal, één dia per bericht. Nieuwe berichten verschijnen zonder verdere handelingen. |

Alle drie staan in dezelfde lijst, kunnen worden gemengd en gesorteerd door aan de
handgreep te slepen of via **naar boven** en **naar beneden**. In totaal toont
het podium maximaal acht dia’s — een kanaalvermelding telt daarbij mee met alle
dia’s die het bijdraagt.

## Velden van een dia

| Veld | Beschrijving |
| --- | --- |
| Opbouw | **Vast**: koptekst, ondertitel en knoppen op een vaste plek linksonder. **Aangepast**: bouwstenen in negen zones, gerangschikt op het podium (zie hieronder). Bij het wisselen wordt meegenomen wat er staat. |
| Achtergrond | **Afbeelding of video** (één bestand, zie hieronder) of **animatie**: een bewegend patroon van vierkantjes in MAN-kleuren, dat de widget zelf tekent. Een animatie past zich aan elke podiumgrootte aan, heeft geen staand formaat nodig en laadt niets extra’s. |
| Patroon | Alleen bij animatie. Hoekig: **Golf** (fijne vierkantjes waar een golf doorheen loopt en ze omhoog tilt), **Raster** (rustig raster met een bewegende lichtband), **Modules** (losjes verspreide modules die pulseren). Rond: **Punten** (fijne punten die een rimpeling doen opstijgen), **Lijnen** (vloeiende hoogtelijnen, enkele in rood), **ringen** (ringen van punten die zich rustig vanuit rechts verspreiden), **stroming** (deeltjes die rondcirkelen en drijven). De tekstpagina links — onderaan op de telefoon — blijft altijd vrij. |
| Achtergrond | Alleen bij animatie. **Dekkend**, **75 %**, **50 %**, **25 %** of **Doorzichtig**: daaronder schijnt het gedeelte achter de schermen door; patronen en tekst blijven krachtig. |
| Achtergrondkleur | Alleen bij animatie. **Donker** (antraciet) of **Licht** (wit). De tekst wordt automatisch wit of antraciet — afhankelijk van wat beter leesbaar is op de zichtbare achtergrond, ook bij een doorschijnende achtergrond boven een gekleurd gedeelte. |
| Snelheid | Alleen bij animatie. **Rustig** (één cyclus in 20 seconden) of **Levendig** (12 seconden). Als de instelling „Beweging verminderen“ van het apparaat is ingeschakeld, staat de animatie stil. |
| Rode accenten | Alleen bij animatie. Schakelaar: rode elementen bewegen mee — ongeveer elke honderdste in het veld, bij lijnen en ringen afzonderlijke volledige lijnen of ringen. |
| Afbeelding of video | Verplicht als de achtergrond **afbeelding of video** is. Uit de mediabibliotheek of via een adres (`https://…`). Liggend, minimaal 1920 px breed. Zonder afbeelding of video wordt de dia niet getoond. |
| Adres | Achter **Adres invoegen**, in plaats van de mediabibliotheek: het `https`-adres van een afbeelding of video. Andere adressen worden niet overgenomen. |
| Type | Afbeelding of video. Wordt automatisch ingesteld op basis van de extensie van het adres (`.mp4`, `.webm`, `.mov` zijn video’s); alleen handmatig selecteren bij adressen zonder extensie. |
| Afbeeldings- of videobeschrijving | Wat er te zien is. Alleen leeg laten bij puur decoratieve afbeeldingen en video’s — schermlezers lezen dit veld voor. |
| Staand formaat | Optioneel. Wordt weergegeven op smalle, staande schermen. Ontbreekt dit, wordt overal het liggende formaat gebruikt. |
| Kop | Houd het kort: tot ongeveer 24 tekens blijft het op één regel. |
| Ondertitel | Optioneel, één tot twee regels. |
| Knoppen | Optioneel, maximaal drie per dia. Worden weergegeven als lijst met stijl en bestemming; een klik opent de velden van een knop. Naar boven/beneden, dupliceren en verwijderen via de pictogrammen boven de velden. Een knop verschijnt alleen als de tekst en de bestemming zijn ingevuld. Alleen bij handmatig onderhouden dia’s; nieuwsdia’s krijgen hun knop uit het bericht. |
| Bestemming | **Adres** (`https://…`, `mailto:…`, `tel:…` of een pad zoals `/content/…`), **pagina** uit Staffbase of **nieuwsbericht** uit Staffbase (eerst kanaal, dan bericht). Andere adressen, zoals `javascript:`, worden niet overgenomen. |
| Stijl | **Rood gevuld** (hoofdactie, standaard), **Wit gevuld**, **Witte omtrek** of **Tekstlink**. Nieuwe knoppen vanaf de tweede beginnen als omtrek, zodat er geen twee rode vlakken naast elkaar staan. |
| Pictogram | Optioneel: pijl, hoek, externe link, downloaden, afspelen, document, kalender, e-mail, telefoon of informatie. Bij gebruik van een pictogram verschijnt **pictogram staat**: voor of na de tekst. |
| Openen in nieuw tabblad | Schakelaar. Opent de bestemming van de knop in een nieuw tabblad. Gebruikelijke instelling voor externe bestemmingen. |

## Velden van een nieuwsbericht

| Veld | Beschrijving |
| --- | --- |
| Kanaal | Verplicht. Bepaalt welke berichten beschikbaar zijn. |
| Bericht | Verplicht. De vijftig meest recente berichten van het kanaal, met de nieuwste bovenaan. |
| Kop | Optioneel. Laat leeg om de titel van het bericht over te nemen. |
| Teaser weergeven | Standaard ingeschakeld. De samenvatting (teaser) wordt als ondertitel weergegeven en wordt ingekort tot 240 tekens. |
| Tekst op de knop | Standaard ingesteld op `Meer informatie`. Laat leeg om de knop weg te laten; de bestemming is altijd het bericht. |
| Achtergrondafbeelding | Optioneel. Handig als de afbeelding van het bericht te klein is voor de achtergrond. |
| Staand formaat | Optioneel. Wordt weergegeven op smalle, staande schermen. |

## Velden van een nieuwskanaal

| Veld | Beschrijving |
| --- | --- |
| Kanaal | Verplicht. Alle dia’s van dit bericht zijn afkomstig uit dit kanaal. |
| Aantal berichten | Standaard ingesteld op `3`, maximaal acht. |
| Volgorde | `Nieuwste eerst` (standaard) of `Oudste eerst`. |
| Alleen uitgelichte berichten | Standaard uitgeschakeld. Beperkt tot wat in het nieuws is vastgezet. |
| Alleen berichten met afbeelding | Standaard ingeschakeld. Zonder afbeelding zou de dia slechts een donker vlak met tekst zijn. |
| Hashtags | Optioneel, meerdere gescheiden door komma’s. Eén bericht volstaat als het een van deze bevat. |
| Voorproeftekst weergeven | Standaard ingeschakeld. |
| Tekst op de knop | Geldt voor alle dia’s van het kanaal. Laat leeg om de knop weg te laten. |

## Opmerkingen

- **Hoogte** fungeert als grens, niet als vaste hoogte: het podium is op brede
  schermen 21:9 en op smalle schermen 4:3 en wordt alleen aan de randen van het
  geselecteerde niveau vastgezet.
- `Schermhoogte` vult de zichtbare zijde minus de koptekst,
  maar minimaal 420 px.
- **Seconden per dia** is pas vanaf de tweede dia van toepassing.
- Wie in het besturingssysteem „Beweging verminderen“ heeft ingesteld, ziet geen
  wisseling vanzelf — ongeacht deze instelling.
- Bovenaan sluit het podium altijd gelijk aan — aan de broodkruimels of, bij
  „Voor de broodkruimels“, aan het menu. De binnenafstand die de sectie boven
  zijn eerste blok aanhoudt, wordt hiervoor gecompenseerd. Dit gebeurt alleen als
  er geen andere inhoud boven het podium staat.
- Als het podium als laatste blok in zijn sectie staat, eindigt de sectie
  mee — ongeacht de hoogte. Bij een vaste trede past het segment zich aan het
  podium aan; bij `segmenthoogte` past het podium zich aan het segment aan.
- **Afstand onderaan** regelt de afstand tot het volgende blok in hetzelfde
  segment. De binnenafstand van een volgend segment hoort bij dat segment en
  blijft behouden.
- Bij `sectiehoogte` neemt het podium alleen de hoogte van de sectie aan als
  het daarin alleen staat. Met andere blokken in dezelfde sectie behoudt het
  zijn beeldverhouding, en de blokken schuiven zonder tussenruimte tegen het podium aan.
- De bedieningselementen verschijnen pas vanaf de tweede dia. Op smalle
  schermen worden de pijltjes verborgen; daar wordt geveegd.
- Een bericht dat wordt verwijderd of dat niet zichtbaar is voor de lezer,
  neemt alleen zijn eigen dia mee. De overige dia’s blijven staan.
- Nieuwsdia’s volgen de taal van de lezer, voor zover het bericht
  is vertaald; anders de eerste beschikbare versie.
- Het **voorbeeld** op desktop, tablet en mobiel hanteert bij nieuwsberichten
  dezelfde regels als de gepubliceerde pagina. Wat daar niet staat,
  verschijnt ook niet op het podium.

## Door de gebruiker gedefinieerde dia

Bij **Opbouw: Aangepast** is het podium in het midden een werkgebied
met negen zones — boven, midden, onder, telkens links, in het midden en rechts op de
uitlijningslijn. In het paneel rechts staat de catalogus met bouwstenen.

| Bouwsteen | Instellingen |
| --- | --- |
| Kop | Tekst, grootte (**Display**, **H1**–**H3**), kleur. De eerste kop van de dia is de hoofdkop. |
| Tekst | Tekst, grootte (**L**, **M**, **S**), kleur. |
| Label | Korte tekst boven een kop, kleur. |
| Knoppen | Maximaal drie knoppen, net als bij de vaste dia. |
| Afbeelding of logo | Uit de mediabibliotheek of via een adres, beschrijving, grootte: **S** een derde, **M** twee derde, **L** de volledige breedte van de zone — maximaal een vijfde, twee vijfde respectievelijk drie vijfde van de hoogte van het podium (op mobiele apparaten bij **L** iets minder dan de helft). Maak de zone breder voor een grote afbeelding (**Breedte**). Afgesneden afbeeldingen (PNG, SVG) komen op elke achtergrond goed tot hun recht. |
| Pictogram | Symbool, grootte, kleur. |

Voor elk bouwsteen bovendien: **Zone** (een 3×3-selectie zoals het podium),
**Op mobiel verbergen** en bovenaan **naar boven**, **naar beneden**, **dupliceren**,
**verwijderen**. **Kleur: Auto** volgt de dia — wit of antraciet, afhankelijk van
wat beter leesbaar is op de achtergrond.

**Uitlijning per zone:** Een klik op de naam van een zone (of het lege
gebied ervan) toont rechts **Horizontaal in de zone** (**Links**, **Midden**,
**Rechts**) en **Verticaal in de zone** (**Boven**, **Midden**, **onder**). Deze
gelden voor alle bouwstenen in de zone; dezelfde velden staan ook in de
instellingen van elke bouwsteen. De standaardinstelling is de positie van de zone — „linksonder“
staat linksonder.

**Zones samenvoegen:** Onder de uitlijning staan **Breedte** (**1 kolom**,
**2 kolommen**, **3 kolommen**) en **Hoogte** (**1 rij**, **2 rijen**,
**3 rijen**). Zo wordt bijvoorbeeld de bovenste rij één zone („boven, volledige
breedte“) of de linkerkolom („links, volledige hoogte“). De zone breidt zich eerst
naar rechts of naar beneden uit, en aan de rand naar links of naar boven; de bouwstenen van de
overlappende zones komen achter hun eigen zones te staan, de uitlijning blijft behouden. Bij
verkleining blijft de zone op de pagina staan waar haar bouwstenen zich bevinden. Een
grootte die een andere samengevoegde zone slechts gedeeltelijk zou raken, wordt niet
aangeboden.

**Op mobiel** staan de zones in leesvolgorde onder elkaar (linksboven, boven
midden, rechtsboven, midden links …; een samengevoegde zone op de plaats
van haar linkerbovenhoek); naar rechts uitgelijnde elementen verschuiven naar links,
middenuitgelijnde blijven in het midden, knoppen blijven knoppen. Wat op de telefoon te veel is, wordt met **Mobiel verbergen**
verborgen; dit kan hierboven worden gecontroleerd met **Mobiel**.
