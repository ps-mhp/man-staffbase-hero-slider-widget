# Impostazioni

Tutto viene gestito nell'editor, che si apre automaticamente all'apertura delle impostazioni:
le voci a sinistra, al centro l'area di lavoro della voce selezionata,
tutte le impostazioni a destra nel pannello **Impostazioni** — scheda
**Diapositiva** (o **Contributo**, **Canale**) per la voce, **Aspetto** e
**Comportamento** per l’intera scena. In assenza di voci, il pannello si chiama **Widget**. Nella finestra di dialogo di Staffbase rimane solo il campo di testo
"Voci" dietro l’editor; si tratta della bozza iniziale e non deve essere modificata
.

| Impostazione | Descrizione |
| --- | --- |
| Voci | Il contenuto del palco: diapositive personalizzate, singoli articoli di notizie e interi canali di notizie. |

### Pannello «Impostazioni», scheda «Aspetto»

| Impostazione | Descrizione |
| --- | --- |
| Altezza | `Altezza sezione` è l’impostazione predefinita. Accanto ad essa sono disponibili `Piccola (320–420 px)`, `Media (420–560 px)`, `Grande (560–720 px)` e `Altezza schermo`. |
| Larghezza intera | Se attivata (impostazione predefinita), l’immagine si estende per l’intera larghezza della finestra, mentre il testo rimane allineato alla linea di guida della pagina. Se disattivata, il palco rimane nella colonna dei contenuti. |
| Posizione | `Dopo il percorso di navigazione` è l’impostazione predefinita: il palco inizia sotto la riga del percorso di navigazione. `Prima del percorso di navigazione` lo posiziona a filo sotto il menu e sposta il percorso di navigazione sotto di esso. Si applica solo se il pannello si trova nella parte superiore della pagina e se la pagina dispone effettivamente di una barra di navigazione. |
| Distanza inferiore | `Standard` è l’impostazione predefinita: sotto il pannello rimane lo spazio che la pagina lascia tra i propri blocchi. `Nessuno` fa sì che il blocco successivo si colleghi direttamente — con «Prima della barra di navigazione» direttamente sotto la barra di navigazione. |

### Pannello «Impostazioni», scheda «Comportamento»

| Impostazione | Descrizione |
| --- | --- |
| Secondi per diapositiva | `5` è l’impostazione predefinita, sono consentiti valori da `0` a `30`; sono ammessi anche i numeri decimali. `0` mette in pausa la scena; poi lo scorrimento avviene solo tramite frecce e linee — e se i controlli sono disattivati, solo con lo scorrimento e i tasti freccia. Lasciare vuoto significa: come prima. |
| Mostra controlli | Se attivato (impostazione predefinita), compaiono frecce e linee. Se disattivati, entrambi scompaiono; lo scorrimento prosegue con il gesto di scorrimento e i tasti freccia, e il tempo impostato per ogni diapositiva rimane invariato. |

### Scene esistenti

Fino alla versione 0.4, queste impostazioni erano disponibili come singoli campi nella finestra di dialogo di
Staffbase. I palchi esistenti le mantengono: finché un’impostazione nel pannello
non è stata modificata, continua a valere il valore del vecchio campo. Il pannello lo
visualizza dove è leggibile; altrimenti, nei campi di selezione compare **Come prima**
e nei pulsanti l’avviso «Non ancora impostato qui». Solo chi
impostazione e seleziona **Applica**, la imposta nell’editor — e
solo quella. Chi apre l’editor e conferma senza apportare modifiche, non cambia
nulla. I vecchi campi sono nascosti nella finestra di dialogo.

## Tipi di voci

| Tipo | Descrizione |
| --- | --- |
| Diapositiva | Una diapositiva gestita manualmente: immagine, video o animazione, titolo, sottotitolo, pulsanti. |
| Articolo di notizie | Un determinato articolo come diapositiva. Il contenuto e la destinazione provengono dall’articolo. |
| Canale di notizie | Un intero canale, una diapositiva per ogni articolo. I nuovi articoli appaiono automaticamente senza ulteriori interventi. |

Tutti e tre compaiono nello stesso elenco, possono essere combinati e ordinati trascinandone la
maniglia o utilizzando i pulsanti **su** e **giù**. In totale,
il palcoscenico mostra al massimo otto diapositive — una voce del canale conta con tutte le
diapositive che contribuisce.

## Campi di una diapositiva

| Campo | Descrizione |
| --- | --- |
| Struttura | **Fissa**: titolo, sottotitolo e pulsanti in posizione fissa in basso a sinistra. **Personalizzata**: elementi disposti in nove zone sull’area di lavoro (vedi sotto). Il cambio di struttura mantiene ciò che è presente. |
| Sfondo | **Immagine o video** (un file, vedi sotto) o **animazione**: un motivo in movimento composto da quadrati nei colori MAN, disegnato dal widget stesso. Un’animazione si adatta a qualsiasi dimensione della scena, non richiede il formato verticale e non carica nulla in seguito. |
| Motivo | Solo con l’animazione. Angolare: **Onda** (quadratini sottili attraversati da un’onda che li solleva), **Griglia** (griglia statica con una striscia di luce che si sposta), **Moduli** (moduli distribuiti in modo casuale che pulsano). Rotondi: **Punti** (punti sottili che sollevano un'increspatura), **Linee** (curve di livello fluide, alcune in rosso), **Anelli** (anelli di punti che si espandono dolcemente da destra), **Corrente** (particelle che ruotano e fluttuano). Il lato del testo a sinistra — in basso sul telefono — rimane sempre libero. |
| Sfondo | Solo con animazione. **Opaco**, **75 %**, **50 %**, **25 %** o **Trasparente**: da sotto traspare la sezione dietro le quinte; motivi e testo rimangono ben visibili. |
| Tono di fondo | Solo con animazione. **Scuro** (antracite) o **Chiaro** (bianco). Il testo diventa automaticamente bianco o antracite — a seconda di quale sia più leggibile sullo sfondo visibile, anche con uno sfondo traslucido sopra una sezione colorata. |
| Velocità | Solo in caso di animazione. **Lenta** (un ciclo in 20 secondi) o **Viva** (12 secondi). Se sull’apparecchio è attivata l’impostazione «Riduci movimento», l’animazione si ferma. |
| Accenti rossi | Solo in caso di animazione. Interruttori: gli elementi rossi si muovono insieme — circa uno ogni cento nel campo; nel caso di linee e anelli, singole linee o anelli interi. |
| Immagine o video | Obbligatorio se lo sfondo è **un’immagine o un video**. Dalla libreria multimediale o tramite un indirizzo (`https://…`). Orizzontale, larghezza minima 1920 px. Senza immagine o video, la diapositiva non viene visualizzata. |
| Indirizzo | Dietro **Inserisci indirizzo**, al posto della libreria multimediale: l’indirizzo `https` di un’immagine o di un video. Altri indirizzi non vengono accettati. |
| Tipo | Immagine o video. Si imposta automaticamente in base all’estensione dell’indirizzo (`.mp4`, `.webm`, `.mov` sono video); selezionarlo manualmente solo per indirizzi senza estensione. |
| Descrizione dell’immagine o del video | Cosa si vede. Lasciare vuoto solo nel caso di immagini e video puramente decorativi — gli screen reader leggono questo campo. |
| Formato verticale | Opzionale. Viene visualizzato su schermi stretti e verticali. Se manca, viene utilizzato ovunque il ritaglio orizzontale. |
| Titolo | Si raccomanda di mantenerlo breve: fino a circa 24 caratteri rimane su una sola riga. |
| Sottotitolo | Facoltativo, da una a due righe. |
| Pulsanti | Facoltativi, fino a tre per diapositiva. Vengono visualizzati come elenco con stile e destinazione; un clic espande i campi di un pulsante. Su/giù, duplica ed elimina tramite le icone sopra i campi. Un pulsante appare solo se il testo e la destinazione sono stati inseriti. Solo per le diapositive gestite manualmente; le diapositive delle notizie ricevono il pulsante dal contributo. |
| Destinazione | **Indirizzo** (`https://…`, `mailto:…`, `tel:…` o un percorso come `/content/…`), **pagina** da Staffbase o **articolo di notizie** da Staffbase (prima il canale, poi l’articolo). Altri indirizzi, come ad esempio `javascript:`, non vengono accettati. |
| Stile | **Riempito di rosso** (azione principale, impostazione predefinita), **Riempito di bianco**, **Contorno bianco** o **Riferimento testuale**. I nuovi pulsanti a partire dal secondo iniziano come contorno, in modo che non vi siano due aree rosse una accanto all’altra. |
| Icona | Opzionale: freccia, angolo, link esterno, scarica, riproduci, documento, calendario, e-mail, telefono o informazioni. Con l’icona, **l’icona appare**: prima o dopo il testo. |
| Apri in una nuova scheda | Interruttore. Apre la destinazione del pulsante in una nuova scheda. Usuale per destinazioni esterne. |

## Campi di un articolo

| Campo | Descrizione |
| --- | --- |
| Canale | Obbligatorio. Determina quali articoli sono disponibili per la selezione. |
| Articolo | Obbligatorio. I cinquanta articoli più recenti del canale, dal più recente al più vecchio. |
| Titolo | Facoltativo. Lasciare vuoto per utilizzare il titolo dell’articolo. |
| Mostra anteprima | Attivato per impostazione predefinita. Il testo di anteprima (teaser) appare come sottotitolo e viene abbreviato a 240 caratteri. |
| Etichetta del pulsante | Impostazione predefinita: `Scopri di più`. Lasciare vuoto per omettere il pulsante; la destinazione è sempre l’articolo. |
| Immagine di copertina | Facoltativo. Utile se l’immagine del post è troppo ritagliata per la copertina. |
| Formato verticale | Facoltativo. Viene visualizzato su schermi stretti e verticali. |

## Campi di un canale di notizie

| Campo | Descrizione |
| --- | --- |
| Canale | Obbligatorio. Tutte le diapositive di questa voce provengono da questo canale. |
| Numero di post | Impostazione predefinita `3`, massimo otto. |
| Ordine | `I più recenti per primi` (impostazione predefinita) o `I più vecchi per primi`. |
| Solo post in evidenza | Disattivato per impostazione predefinita. Limitato a ciò che è fissato in cima alle notizie. |
| Solo post con immagine | Attivato per impostazione predefinita. Senza immagine, la diapositiva sarebbe solo una superficie scura con del testo. |
| Hashtag | Opzionale, separati da virgola. È sufficiente un solo post che ne contenga uno. |
| Mostra anteprima | Attivato per impostazione predefinita. |
| Etichetta del pulsante | Vale per tutte le diapositive del canale. Lasciare vuoto per omettere il pulsante. |

## Note

- **Altezza** funge da limite, non da altezza fissa: l’area di visualizzazione è in formato 21:9
  sugli schermi larghi e in formato 4:3 su quelli stretti, e viene semplicemente limitata ai bordi del
  livello selezionato.
- `Altezza dello schermo` riempie la parte visibile dello schermo al netto dell’intestazione,
  ma con un minimo di 420 px.
- **Secondi per diapositiva** ha effetto solo a partire dalla seconda diapositiva.
- Chi ha impostato «Riduci movimento» nel sistema operativo non vedrà alcun
  cambio di per sé — indipendentemente da questa impostazione.
- In alto, il palcoscenico si allinea sempre perfettamente — alle briciole di navigazione o, in caso di
  «Prima delle briciole di navigazione», al menu. Compensa invece la distanza interna che la sezione mantiene
  rispetto al suo primo blocco. Ciò avviene solo se
  non c’è altro contenuto sopra il palco.
- Se il palco è l’ultimo blocco della sua sezione, la sezione termina
  con esso — a qualsiasi altezza. Se il livello è fisso, la sezione si adatta al
  palcoscenico; se si imposta `Altezza sezione`, è il palcoscenico ad adattarsi alla sezione.
- **Distanza inferiore** regola la distanza dal blocco successivo nella stessa
  sezione. La distanza interna di una sezione successiva appartiene a quest’ultima e
  rimane invariata.
- Con `Altezza sezione`, la scena assume l’altezza della sezione solo se
  si trova da sola al suo interno. Se nella stessa sezione sono presenti altri blocchi, mantiene
  le sue proporzioni e i blocchi si avvicinano ad essa senza lasciare spazio.
- I comandi compaiono solo a partire dalla seconda diapositiva. Sugli schermi stretti
  le frecce sono nascoste; in quel caso si utilizza il gesto di scorrimento.
- Un articolo che viene cancellato o che non è visibile al lettore
  porta con sé solo la propria diapositiva. Le altre diapositive rimangono al loro posto.
- Le diapositive delle notizie seguono la lingua del lettore, purché l’articolo
  sia tradotto; altrimenti seguono la prima versione disponibile.
- L’**anteprima** su desktop, tablet e dispositivi mobili applica alle voci delle notizie
  le stesse regole della pagina pubblicata. Ciò che non è presente lì,
  non appare nemmeno sul palco.

## Diapositiva personalizzata

Con **Struttura: Personalizzata**, il palco al centro è un’area di lavoro
con nove zone — in alto, al centro, in basso, rispettivamente a sinistra, al centro e a destra sulla
linea di allineamento. Nel pannello a destra si trova il catalogo dei moduli.

| Modulo | Impostazioni |
| --- | --- |
| Titolo | Testo, dimensione (**Display**, **H1**–**H3**), colore. Il primo titolo della diapositiva è il titolo principale. |
| Testo | Testo, dimensione (**L**, **M**, **S**), colore. |
| Etichetta | Breve testo sopra un titolo, colore. |
| Pulsanti | Fino a tre pulsanti come nella diapositiva fissa. |
| Immagine o logo | Dalla libreria multimediale o tramite indirizzo, descrizione, dimensione: **S** un terzo, **M** due terzi, **L** l’intera larghezza della zona — al massimo un quinto, due quinti o tre quinti dell’altezza del palco (su dispositivi mobili, con **L** poco meno della metà). Per un’immagine di grandi dimensioni, allargare la zona (**Larghezza**). Le immagini con sfondo trasparente (PNG, SVG) risaltano su qualsiasi sfondo. |
| Icona | Simbolo, dimensione, colore. |

Inoltre, per ogni elemento: **Zona** (una selezione 3×3 come il palco),
**Nascondi su dispositivi mobili** e in alto **verso l’alto**, **verso il basso**, **duplica**,
**elimina**. **Colore: Auto** segue la diapositiva — bianco o antracite, a seconda di
ciò che risulta più leggibile sullo sfondo.

**Allineamento per zona:** un clic sul nome di una zona (o sulla sua area vuota
) mostra a destra **Orizzontalmente nella zona** (**Sinistra**, **Centro**,
**Destra**) e **Verticalmente nella zona** (**In alto**, **Centro**, **in basso**). Queste
valgono per tutti i moduli della zona; gli stessi campi sono presenti anche nelle
impostazioni di ciascun modulo. L’impostazione predefinita è la posizione della zona — «in basso a sinistra»
si trova in basso a sinistra.

**Unire le zone:** Sotto l’allineamento sono disponibili **Larghezza** (**1 colonna**,
**2 colonne**, **3 colonne**) e **Altezza** (**1 riga**, **2 righe**,
**3 righe**). In questo modo, ad esempio, la riga superiore diventa una zona (“in alto, intera
larghezza”) oppure la colonna di sinistra (“a sinistra, intera altezza”). La zona si espande prima
verso destra o verso il basso, poi verso sinistra o verso l’alto; gli elementi delle
zone sovrapposte vengono posizionati dietro i propri, mantenendo l’allineamento. Quando
si riduce la dimensione, la zona rimane sul lato in cui si trovano i suoi elementi. Una
dimensione che coprirebbe solo parzialmente un’altra zona raggruppata non viene
proposta.

**Su dispositivi mobili** le zone si dispongono una sotto l’altra nell’ordine di lettura (in alto a sinistra, in alto
al centro, in alto a destra, al centro a sinistra…; una zona raggruppata si posiziona nel punto
del proprio angolo superiore sinistro); ciò che è allineato a destra si sposta a sinistra,
ciò che è al centro rimane al centro, i pulsanti rimangono pulsanti. Ciò che risulta eccessivo sul telefono viene nascosto da **Nascondi su dispositivi mobili**
; è possibile verificarlo in alto con **Dispositivi mobili**.
