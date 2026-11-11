# Veelgestelde vragen

**Vraag:** Ik heb een dia aangemaakt, maar het podium blijft leeg.

Antwoord: De dia mist de afbeelding. Dia’s zonder afbeelding worden niet weergegeven — een
leeg, donker vlak zou op de pagina niet te onderscheiden zijn van een fout.
Open de editor en selecteer onder **Afbeelding of video** een afbeelding
of voer een adres in.

**Vraag:** Ik heb een videoadres ingevoerd, maar de dia toont alleen
een donker vlak.

Antwoord: Meestal is de video zonder aanmelding niet beschikbaar, of staat **Type** ingesteld
op **Afbeelding**, omdat het adres geen extensie heeft. Open het adres in
een privé-browservenster: als het daar niet werkt, zien de
lezers het ook niet. Een melding direct onder het veld geeft aan dat het adres
niet is overgenomen — het moet beginnen met `https://`.

**Vraag:** Ik heb een tekst voor de knop ingevoerd, maar
deze verschijnt niet.

Antwoord: De knop heeft **beide** nodig — tekst en bestemming. Zolang
een van de velden leeg is, wordt deze niet weergegeven. Bij een vrij adres
tellen alleen `https://…`, `mailto:…`, `tel:…` en paden zoals `/content/…`; het
formulier geeft een waarschuwing als een adres niet wordt geaccepteerd.

**Vraag:** De afbeelding beslaat niet de volledige breedte van het venster.

Antwoord: Er zijn twee mogelijke oorzaken. Ofwel is **Over de volledige breedte weergeven**
uitgeschakeld, ofwel staat de widget in een kolom naast andere inhoud.
Plaats het in een aparte regel bovenaan de pagina.

**Vraag:** De tekst staat niet op de plek waar de rest van de pagina-inhoud begint.

Antwoord: Het weergavegebied past zich aan aan de inhoudsbreedte die de pagina aangeeft.
Als deze afwijkt, meld dit dan samen met het pagina-adres.

**Vraag:** In plaats van de editor zie ik een tekstveld „Invoer“ met accolades
erin.

Antwoord: De editor kon niet in het dialoogvenster worden geïntegreerd. Sluit
de instellingen en open ze opnieuw. De tekst in het veld is de
ruwe versie van de items; bewerk deze niet handmatig — één typefout
daarin zorgt ervoor dat alle dia’s verdwijnen.

**Vraag:** Het podium wisselt niet vanzelf.

Antwoord: Drie mogelijke oorzaken: er is slechts één dia; **seconden per dia**
staat op `0`; of in het besturingssysteem is „Beweging verminderen“ ingeschakeld.
In het laatste geval is dit de bedoeling — je kunt nog steeds bladeren met pijltjes
en streepjes.

**Vraag:** Op de telefoon zie ik geen pijltjes.

Antwoord: Dat is zo bedoeld. Op smalle schermen veeg je; de
streepjes onder de tekst geven nog steeds aan welke dia op dat moment op de voorgrond staat.

**Vraag:** Mijn afbeelding is aan de rand afgesneden.

Antwoord: Het podium snijdt de afbeelding bij tot 21:9 of 4:3, afhankelijk van de vensterbreedte. Kies
een afbeelding met wat ruimte rondom het motief, of voeg onder **Afbeelding voor
staand formaat** een eigen, staand bijgesneden uitsnede toe.

**Vraag:** Kan ik meer dan acht dia’s aanmaken?

Antwoord: Nee. Bij vijf seconden per dia duurt een volledige doorloop bij
acht dia’s al veertig seconden — zo lang blijft niemand op een podium staan.
Het aantal acht geldt voor alle dia’s samen: een kanaalvermelding met vijf berichten
laat naast zichzelf slechts drie extra dia’s toe.

**Vraag:** Moet ik het podium bijwerken als er een nieuw bericht
in het nieuws verschijnt?

Antwoord: Bij een **nieuws-kanaal**-vermelding niet — deze toont altijd de actuele
berichten van het kanaal volgens de ingestelde filters. Een **nieuwsbericht**-
vermelding blijft daarentegen bij het bericht dat u hebt gekozen.

**Vraag:** Een dia uit het nieuws is plotseling verdwenen.

Antwoord: Het bericht is verwijderd, verplaatst of is niet zichtbaar voor de lezer.
Alleen deze ene dia verdwijnt; de overige blijven staan.

**Vraag:** Mijn kanaalvermelding toont minder dia’s dan is ingesteld.

Antwoord: Meestal zijn de filters te streng ingesteld. **Alleen berichten met afbeelding** is
de standaardinstelling — een kanaal zonder afbeeldingen levert dus niets op. Controleer het
voorbeeld in de editor: dit toont precies wat er op het scherm zal verschijnen.

**Vraag:** In de kanaalkeuze staat geen enkel kanaal, maar in plaats daarvan een
tekstveld voor een identificatiecode.

Antwoord: De lijst met nieuwskanalen was niet bereikbaar. Laad het dialoogvenster
opnieuw. Als dat niet helpt, voer dan de ID van het kanaal handmatig in; deze staat
in het adres van het kanaal in het CMS.

**Vraag:** Waarom is de afbeelding van een nieuwsbericht op het podium wazig of
vreemd bijgesneden?

Antwoord: Afbeeldingen bij berichten zijn bijgesneden voor het feed-formaat, niet voor een
podium dat de volledige schermhoogte beslaat. Voeg in het item onder **Podiumafbeelding
overschrijven** een eigen afbeelding toe, in liggend formaat en minimaal 1920 px breed.

**Vraag:** Wat gebeurt er met het podium bij de automatische vertaling van de
pagina?

Antwoord: Alle zelfgeschreven teksten worden vertaald: kop,
ondertitel, tekst op de knop en afbeeldingsbeschrijving van een dia,
evenals de overschreven titel en de tekst van een nieuwsbericht.
Afbeeldingen, linkbestemmingen, kanalen, filters en de volgorde blijven ongewijzigd.

**Vraag:** Een nieuwsbericht toont op de vertaalde pagina andere teksten dan in
de brontaal — is dat een fout?

Antwoord: Nee. De titel en de samenvatting van een nieuwsbericht komen uit het bericht
zelf, en dat wordt weergegeven in de taal die de lezer in de app
heeft ingesteld. Alleen wat u in het bericht zelf hebt geschreven, wordt vertaald.
Als er geen taalversie van het bericht beschikbaar is, wordt de bestaande versie weergegeven in plaats van
de dia leeg te laten.

**Vraag:** Ik heb „Boven de broodkruimels“ geselecteerd, maar er verandert niets.

Antwoord: De instelling werkt alleen als aan drie voorwaarden is voldaan: de pagina heeft
überhaupt een broodkruimelbalk, de balk staat helemaal bovenaan de pagina en
er staat geen andere inhoud boven. Als aan één van deze voorwaarden niet is voldaan, blijft de
podium onder de broodkruimels — een broodkruimelbalk midden op de pagina zou
erger zijn dan helemaal geen verandering. In de editor staat in dit geval een opmerking
boven het podium. Op de gepubliceerde pagina verschijnt deze niet; daar
kan de instelling niet worden gewijzigd.

**Vraag:** Vroeger stond er een witte strook boven het podium. Waar is die gebleven?

Antwoord: Het gedeelte waarin het podium staat, houdt boven het eerste blok
een interne afstand aan. Boven tekst is dat correct, maar boven een podium ontstaat
daardoor een witte strook tussen het menu of de broodkruimels en de afbeelding. Het podium
compenseert deze afstand zelf zodra het helemaal bovenaan staat. Als er boven het podium
een ander blok staat, blijft de afstand zoals de pagina die instelt.

**Vraag:** Ik heb „Geen afstand“ gekozen, maar onder het podium is nog ruimte.

Antwoord: „Geen afstand“ verwijdert de afstand tot het volgende blok in dezelfde
paragraaf. Is het podium het laatste blok van zijn paragraaf, dan eindigt de
paragraaf sowieso met het podium. De ruimte die dan nog overblijft, is de interne afstand
van de volgende sectie — die hoort bij die sectie en kan worden aangepast in de
sectie-instellingen. Als de volgende inhoud in dezelfde sectie staat
als het podium, sluit deze bij „Geen afstand“ direct aan.

**Vraag:** Zonder bedieningselementen — hoe blader je dan?

Antwoord: Met je vinger vegen, met de pijltjestoetsen bladeren, of vanzelf:
de ingestelde tijd per dia blijft ongewijzigd. Voor het toetsenbord wordt het
podium zelf selecteerbaar zodra de bedieningselementen ontbreken.
