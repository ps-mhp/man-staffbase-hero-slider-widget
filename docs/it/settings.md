# Impostazioni

Tutto viene gestito nell'editor, che si apre automaticamente all'apertura delle impostazioni:
le voci a sinistra e al centro, le impostazioni del palco
a destra nel pannello **Widget**. Nella finestra di dialogo di Staffbase rimane solo il campo di testo
"Voci" dietro l'editor; si tratta della versione grezza e non deve essere modificata
.

| Impostazione | Descrizione |
| --- | --- |
| Voci | Il contenuto del palco: diapositive personalizzate, singoli articoli di notizie e interi canali di notizie. |

### Pannello «Widget», scheda «Design»

| Impostazione | Descrizione |
| --- | --- |
| Altezza | `Altezza sezione` è l’impostazione predefinita. Accanto ad essa sono disponibili `Piccola (320–420 px)`, `Media (420–560 px)`, `Grande (560–720 px)` e `Altezza schermo`. |
| Larghezza intera | Se attivata (impostazione predefinita), l’immagine occupa l’intera larghezza della finestra, mentre il testo rimane allineato alla linea di guida della pagina. Se disattivata, l’area di visualizzazione rimane nella colonna dei contenuti. |
| Posizione | `Dopo il percorso di navigazione` è l’impostazione predefinita: il palco inizia sotto la riga del percorso di navigazione. `Prima del percorso di navigazione` lo posiziona a filo sotto il menu e sposta il percorso di navigazione sotto di esso. Si applica solo se il pannello si trova nella parte superiore della pagina e se la pagina dispone effettivamente di una barra di navigazione. |
| Distanza inferiore | `Standard` è l’impostazione predefinita: sotto il pannello rimane lo spazio che la pagina lascia tra i propri blocchi. `Nessuno` fa sì che il blocco successivo si colleghi direttamente — con «Prima della barra di navigazione» direttamente sotto la barra di navigazione. |

### Pannello «Widget», scheda «Comportamento»

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
| Diapositiva | Una diapositiva gestita manualmente: immagine o video, titolo, sottotitolo, pulsanti. |
| Articolo di notizie | Un determinato articolo come diapositiva. Il contenuto e la destinazione provengono dall’articolo. |
| Canale di notizie | Un intero canale, una diapositiva per ogni articolo. I nuovi articoli appaiono senza ulteriori interventi. |

Tutti e tre compaiono nello stesso elenco, possono essere mescolati e ordinati trascinandone la
maniglia o utilizzando i pulsanti **su** e **giù**. In totale,
il palco mostra al massimo otto diapositive — una voce del canale conta con tutte le
diapositive che contribuisce.

## Campi di una diapositiva

| Campo | Descrizione |
| --- | --- |
| Immagine o video | Obbligatorio. Dalla libreria multimediale o tramite un indirizzo (`https://…`). Orizzontale, larghezza minima 1920 px. Senza immagine o video, la diapositiva non viene visualizzata. |
| Indirizzo | Dietro **Inserisci indirizzo**, al posto della libreria multimediale: l’indirizzo `https` di un’immagine o di un video. Altri indirizzi non vengono accettati. |
| Tipo | Immagine o video. Si imposta automaticamente in base all’estensione dell’indirizzo (`.mp4`, `.webm`, `.mov` sono video); selezionarlo manualmente solo per indirizzi senza estensione. |
| Descrizione dell’immagine o del video | Cosa si vede. Lasciare vuoto solo nel caso di immagini e video puramente decorativi — gli screen reader leggono ad alta voce questo campo. |
| Formato verticale | Opzionale. Viene visualizzato su schermi stretti e verticali. Se manca, viene utilizzato ovunque il ritaglio orizzontale. |
| Titolo | Si raccomanda di mantenerlo breve: fino a circa 24 caratteri rimane su una sola riga. |
| Sottotitolo | Facoltativo, da una a due righe. |
| Pulsanti | Facoltativi, fino a tre per diapositiva. Vengono visualizzati come elenco con stile e destinazione; un clic espande i campi di un pulsante. Su/giù, duplica ed elimina tramite le icone sopra i campi. Un pulsante appare solo se il testo e la destinazione sono stati inseriti. Solo per le diapositive gestite manualmente; le diapositive delle notizie ricevono il pulsante dal contributo. |
| Destinazione | **Indirizzo** (`https://…`, `mailto:…`, `tel:…` o un percorso come `/content/…`), **pagina** da Staffbase o **articolo di notizie** da Staffbase (prima il canale, poi l’articolo). Altri indirizzi, come ad esempio `javascript:`, non vengono accettati. |
| Stile | **Riempito di rosso** (azione principale, impostazione predefinita), **Riempito di bianco**, **Contorno bianco** o **Riferimento testuale**. I pulsanti successivi al primo vengono visualizzati come contorno, in modo da evitare che due aree rosse si trovino una accanto all’altra. |
| Icona | Opzionale: freccia, angolo, link esterno, scarica, riproduci, documento, calendario, e-mail, telefono o informazioni. Se si seleziona un'icona, **l'icona appare**: prima o dopo il testo. |
| Apri in una nuova scheda | Pulsante. Apre la destinazione del pulsante in una nuova scheda. Usuale per destinazioni esterne. |

## Campi di un articolo di notizie

| Campo | Descrizione |
| --- | --- |
| Canale | Obbligatorio. Determina quali articoli sono disponibili per la selezione. |
| Articolo | Obbligatorio. I cinquanta articoli più recenti del canale, dal più recente al più vecchio. |
| Titolo | Facoltativo. Lasciare vuoto per utilizzare il titolo dell’articolo. |
| Mostra anteprima | Attivato per impostazione predefinita. L’anteprima (teaser) appare come sottotitolo e viene abbreviata a 240 caratteri. |
| Etichetta del pulsante | Impostazione predefinita: `Scopri di più`. Lasciare vuoto per omettere il pulsante; la destinazione è sempre il post. |
| Immagine di copertina | Facoltativo. Utile se l’immagine del post è troppo ritagliata per la copertina. |
| Formato verticale | Facoltativo. Viene visualizzato su schermi stretti e verticali. |

## Campi di un canale di notizie

| Campo | Descrizione |
| --- | --- |
| Canale | Obbligatorio. Tutte le diapositive di questa voce provengono da questo canale. |
| Numero di post | Impostazione predefinita `3`, massimo otto. |
| Ordine | `Più recenti prima` (impostazione predefinita) o `Più vecchi prima`. |
| Solo post in evidenza | Disattivato per impostazione predefinita. Limitato a ciò che è fissato in evidenza nelle notizie. |
| Solo post con immagine | Attivato per impostazione predefinita. Senza immagine, la diapositiva risulterebbe solo una superficie scura con del testo. |
| Hashtag | Opzionale, separati da virgola. È sufficiente un solo post che ne contenga uno. |
| Mostra anteprima | Attivato per impostazione predefinita. |
| Etichetta del pulsante | Vale per tutte le diapositive del canale. Lasciare vuoto per omettere il pulsante. |

## Note

- **Altezza** funge da limite, non da altezza fissa: il palco si adatta a schermi larghi
  e su schermi stretti 4:3 e viene allineata solo ai bordi del
  livello selezionato.
- `Altezza schermo` riempie l’area visibile al netto dell’intestazione,
  ma con un minimo di 420 px.
- **Secondi per diapositiva** ha effetto solo a partire dalla seconda diapositiva.
- Chi ha impostato «Riduci movimento» nel sistema operativo non vedrà alcun
  cambio di per sé — indipendentemente da questa impostazione.
- In alto, il palcoscenico si allinea sempre perfettamente — alle briciole di navigazione o, in caso di
  «Prima delle briciole di navigazione», al menu. Compensa così la distanza interna che la sezione mantiene
  rispetto al suo primo blocco. Ciò avviene solo se
  non è presente altro contenuto sopra il palco.
- Se il palco è l’ultimo blocco della sua sezione, la sezione termina
  con esso — a qualsiasi altezza. Con un livello fisso, la sezione si adatta al
  palco; con `Altezza sezione`, il palco si adatta alla sezione.
- **Distanza inferiore** regola la distanza dal blocco successivo nella stessa
  sezione. La distanza interna di una sezione successiva appartiene a quest’ultima e
  rimane invariata.
- Con `Altezza sezione`, il palco occupa l’altezza della sezione solo se
  si trova da solo al suo interno. Se nella stessa sezione sono presenti altri blocchi, essa mantiene
  le proprie proporzioni e i blocchi si avvicinano ad essa senza lasciare spazio.
- I comandi compaiono solo a partire dalla seconda diapositiva. Sugli schermi stretti
  le frecce sono nascoste; in quel caso si utilizza il gesto di scorrimento.
- Un articolo che viene eliminato o che non è visibile al lettore
  porta con sé solo la propria diapositiva. Le altre diapositive rimangono al loro posto.
- Le diapositive delle notizie seguono la lingua del lettore, a condizione che l’articolo
  sia tradotto; in caso contrario, seguono la prima versione disponibile.
- L’**anteprima** su desktop, tablet e dispositivi mobili applica alle notizie
  le stesse regole della pagina pubblicata. Ciò che non è presente lì,
  non compare nemmeno nell’anteprima.
