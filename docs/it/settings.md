# Impostazioni

| Impostazione | Descrizione |
| --- | --- |
| Voci | Il contenuto della pagina: diapositive personalizzate, singoli articoli di notizie e interi canali di notizie. Viene gestito tramite l'editor, che si apre automaticamente all'apertura delle impostazioni. Il campo di testo sottostante contiene il testo grezzo e non deve essere modificato. |
| Altezza | `Standard (420–560 px)` è l’impostazione predefinita. Accanto ad essa sono disponibili `Bassa (320–420 px)`, `Alta (560–720 px)` e `Altezza schermo`. |
| Mostra a tutta larghezza | Se attivata (impostazione predefinita), l’immagine si estende per l’intera larghezza della finestra, mentre il testo rimane allineato al margine della pagina. Se disattivata, il palco rimane nella colonna dei contenuti. |
| Secondi per diapositiva | Il valore predefinito è `5`. Impostando `0`, il palcoscenico si ferma; in questo caso lo scorrimento avviene solo tramite frecce e linee — e, se i controlli sono disattivati, solo con il gesto di scorrimento e i tasti freccia. Massimo 30. |
| Posizione rispetto al percorso di navigazione | `Dopo il percorso di navigazione` è l’impostazione predefinita: la presentazione inizia sotto la riga del percorso di navigazione. `Prima del percorso di navigazione` la posiziona a filo sotto il menu e sposta il percorso di navigazione sotto di essa. Funziona solo se la scena si trova nella parte superiore della pagina e se la pagina dispone effettivamente di una barra di navigazione. |
| Mostra elementi di controllo | Se attivata (impostazione predefinita), compaiono frecce e linee. Se disattivata, entrambe scompaiono; la navigazione prosegue con il gesto di scorrimento e i tasti freccia, e il tempo impostato per ogni diapositiva rimane invariato. |
| Spazio verso il basso | `Standard` è l’impostazione predefinita: sotto il palco rimane lo spazio che la pagina inserisce tra i propri blocchi. `Nessuno spazio` fa sì che il blocco successivo si colleghi direttamente — con l’opzione “Prima della barra di navigazione” direttamente sotto la barra di navigazione. |

## Tipi di voci

| Tipo | Descrizione |
| --- | --- |
| Diapositiva | Una diapositiva gestita manualmente: immagine, titolo, sottotitolo, pulsante. |
| Articolo di attualità | Un articolo specifico come diapositiva. Il contenuto e la destinazione provengono dall’articolo. |
| Canale di attualità | Un intero canale, una diapositiva per ogni articolo. I nuovi articoli appaiono automaticamente senza ulteriori interventi. |

Tutti e tre compaiono nella stessa lista, possono essere mescolati e ordinati tramite **↑** e
**↓**. In totale, il palco mostra al massimo otto diapositive — una
voce del canale conta con tutte le diapositive che apporta.

## Campi di una diapositiva

| Campo | Descrizione |
| --- | --- |
| Immagine o video | Obbligatorio. Dalla mediateca o tramite un indirizzo (`https://…`). Orizzontale, larghezza minima 1920 px. Senza immagine o video, la diapositiva non viene visualizzata. |
| Indirizzo | Al posto della mediateca: l’indirizzo `https` di un’immagine o di un video. Altri indirizzi non vengono accettati. |
| Tipo | Immagine o video. Si imposta automaticamente in base all’estensione dell’indirizzo (`.mp4`, `.webm`, `.mov` sono video); selezionarlo manualmente solo per indirizzi senza estensione. |
| Descrizione dell’immagine o del video | Cosa si vede. Lasciare vuoto solo nel caso di immagini e video puramente decorativi — gli screen reader leggono questo campo. |
| Immagine o video per formato verticale | Facoltativo. Viene visualizzato su schermi stretti e verticali. Se manca, viene utilizzato ovunque il ritaglio orizzontale. |
| Titolo | Da mantenere breve: fino a circa 24 caratteri rimane su una sola riga. |
| Sottotitolo | Facoltativo, da una a due righe. |
| Pulsanti | Facoltativi, fino a tre per diapositiva, ordinabili con ↑/↓. Un pulsante appare solo se sono stati compilati l’etichetta e la destinazione. Solo per le diapositive gestite manualmente; le diapositive delle notizie ricevono il pulsante dal contributo. |
| Destinazione | **Indirizzo libero** (`https://…`, `mailto:…`, `tel:…` o un percorso come `/content/…`), **pagina da Staffbase** o **articolo di notizie da Staffbase** (prima il canale, poi l’articolo). Altri indirizzi, come ad esempio `javascript:`, non vengono accettati. |
| Stile | **Riempito di rosso** (azione principale, impostazione predefinita), **Riempito di bianco**, **Contorno bianco** o **Collegamento testuale**. I nuovi pulsanti, a partire dal secondo, vengono visualizzati inizialmente come contorno, in modo da evitare che due aree rosse si trovino una accanto all’altra. |
| Simbolo | Opzionale: freccia, angolo, link esterno, scarica, riproduci, documento, calendario, e-mail, telefono o informazione — prima o dopo il testo. |
| Apri in una nuova scheda | Apre la destinazione del pulsante in una nuova scheda. Usuale per destinazioni esterne. |

## Campi di un articolo

| Campo | Descrizione |
| --- | --- |
| Canale | Obbligatorio. Determina quali articoli sono disponibili per la selezione. |
| Articolo | Obbligatorio. I cinquanta articoli più recenti del canale, dal più recente al più vecchio. |
| Sovrascrivi titolo | Opzionale. Lasciare vuoto per utilizzare il titolo dell’articolo. |
| Mostra teaser come sottotitolo | Attivato per impostazione predefinita. Il teaser viene abbreviato a 240 caratteri. |
| Etichetta del pulsante | Impostazione predefinita: `Scopri di più`. Lasciare vuoto per omettere il pulsante; la destinazione è sempre l’articolo. |
| Sovrascrivi immagine di copertina | Opzionale. Utile se l’immagine del post è troppo ritagliata per la copertina. |
| Immagine per formato verticale | Opzionale. Viene visualizzata su schermi stretti e verticali. |

## Campi di un canale di notizie

| Campo | Descrizione |
| --- | --- |
| Canale | Obbligatorio. Tutte le diapositive di questa voce provengono da questo canale. |
| Numero di diapositive | Impostazione predefinita `3`, massimo otto. |
| Ordine | `Più recenti prima` (impostazione predefinita) o `Più vecchi prima`. |
| Solo post in evidenza | Disattivato per impostazione predefinita. Limitato a ciò che è fissato in evidenza nelle notizie. |
| Solo post con immagine | Attivato per impostazione predefinita. Senza immagine, la diapositiva risulterebbe solo una superficie scura con del testo. |
| Parole chiave | Opzionale, più parole separate da virgole. È sufficiente un solo post se contiene una di queste parole. |
| Mostra il teaser come sottotitolo | Attivato per impostazione predefinita. |
| Etichetta del pulsante | Vale per tutte le diapositive del canale. Lasciare vuoto per omettere il pulsante. |

## Note

- **Altezza** funge da limite, non da altezza fissa: l’area di visualizzazione è in formato 21:9
  sugli schermi larghi e in formato 4:3 su quelli stretti, e viene semplicemente limitata ai bordi del
  livello selezionato.
- `Altezza schermo` riempie la parte visibile dello schermo al netto dell’intestazione,
  ma con un minimo di 420 px.
- **Secondi per diapositiva** ha effetto solo a partire dalla seconda diapositiva.
- Chi ha impostato «Riduci movimento» nel sistema operativo non vedrà alcun
  cambio automaticamente — indipendentemente da questa impostazione.
- In alto, il palcoscenico si allinea sempre perfettamente — alle briciole di navigazione o, in caso di
  «Prima delle briciole di navigazione», al menu. In compenso, compensa la distanza interna che la sezione mantiene
  rispetto al suo primo blocco. Ciò avviene solo se
  non c’è altro contenuto sopra il palco.
- Se il palco è l’ultimo blocco della sua sezione, la sezione termina
  con esso — a qualsiasi altezza. Con un livello fisso, la sezione si adatta al
  palcoscenico; con `Altezza sezione`, il palcoscenico si adatta alla sezione.
- **Spazio verso il basso** regola la distanza dal blocco successivo nella stessa
  sezione. Lo spazio interno di una sezione successiva appartiene a quest’ultima e
  rimane invariato.
- Con `Altezza sezione`, il palco occupa l’altezza della sezione solo se
  si trova da solo al suo interno. Se nella stessa sezione sono presenti altri blocchi, mantiene
  le sue proporzioni e i blocchi si avvicinano ad esso senza lasciare spazio.
- I comandi compaiono solo a partire dalla seconda diapositiva. Sugli schermi stretti
  le frecce sono nascoste; in quel caso si utilizza il gesto di scorrimento.
- Un contributo che viene cancellato o che non è visibile al lettore
  porta con sé solo la propria diapositiva. Le restanti diapositive rimangono al loro posto.
- Le diapositive delle notizie seguono la lingua del lettore, purché il contributo
  sia tradotto; in caso contrario, seguono la prima versione disponibile.
- L’**anteprima** nell’editor segue le stesse regole della
  pagina pubblicata. Ciò che non è presente lì non apparirà nemmeno sulla pagina
  pubblicata.
