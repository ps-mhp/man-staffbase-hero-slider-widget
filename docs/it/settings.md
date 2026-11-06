# Impostazioni

| Impostazione | Descrizione |
| --- | --- |
| Voci | Il contenuto della pagina: diapositive personalizzate, singoli articoli di notizie e interi canali di notizie. Viene gestito tramite l'editor, che si apre automaticamente all'apertura delle impostazioni. Il campo di testo sottostante contiene il testo grezzo e non deve essere modificato. |
| Altezza | `Standard (420–560 px)` è l'impostazione predefinita. Accanto ad essa sono disponibili `Bassa (320–420 px)`, `Alta (560–720 px)` e `Altezza schermo`. |
| Mostra a tutta larghezza | Se attivata (impostazione predefinita), l’immagine si estende per l’intera larghezza della finestra, mentre il testo rimane allineato al margine della pagina. Se disattivata, il palco rimane nella colonna dei contenuti. |
| Secondi per diapositiva | Il valore predefinito è `5`. Impostando `0`, il palcoscenico si ferma; in questo caso lo scorrimento avviene solo tramite frecce e linee — e, se i controlli sono disattivati, solo con il gesto di scorrimento e i tasti freccia. Massimo 30. |
| Posizione rispetto al percorso di navigazione | L’impostazione predefinita è `Dopo il percorso di navigazione`: la presentazione inizia sotto la riga del percorso di navigazione. `Prima del percorso di navigazione` la posiziona a filo sotto il menu e sposta il percorso di navigazione sotto di essa. Funziona solo se la scena si trova nella parte superiore della pagina e se la pagina dispone effettivamente di una barra di navigazione. |
| Mostra elementi di controllo | Se attivata (impostazione predefinita), vengono visualizzate frecce e linee. Se disattivati, entrambi scompaiono; la navigazione prosegue con il gesto di scorrimento e i tasti freccia, e il tempo impostato per ogni diapositiva scorre senza variazioni. |

## Tipi di voci

| Tipo | Descrizione |
| --- | --- |
| Diapositiva | Una diapositiva gestita manualmente: immagine, titolo, sottotitolo, pulsante. |
| Articolo di notizie | Un determinato articolo come diapositiva. Il contenuto e il link di destinazione provengono dall’articolo. |
| Canale di notizie | Un intero canale, una diapositiva per ogni articolo. I nuovi articoli vengono visualizzati automaticamente senza alcun intervento. |

Tutti e tre i tipi figurano nello stesso elenco, possono essere combinati e ordinati tramite **↑** e
**↓**. Complessivamente, la scena mostra al massimo otto diapositive — una
voce di canale viene conteggiata insieme a tutte le diapositive che essa contribuisce.

## Campi di una diapositiva

| Campo | Descrizione |
| --- | --- |
| Immagine o video | Obbligatorio. Dalla libreria multimediale o tramite un indirizzo (`https://…`). Orizzontale, larghezza minima 1920 px. Senza immagine o video, la diapositiva non viene visualizzata. |
| Indirizzo | Al posto della libreria multimediale: l’indirizzo `https` di un’immagine o di un video. Altri indirizzi non vengono accettati. |
| Tipo | Immagine o video. Viene impostato automaticamente in base all’estensione dell’indirizzo (`.mp4`, `.webm`, `.mov` sono video); selezionarlo manualmente solo per indirizzi senza estensione. |
| Descrizione dell’immagine o del video | Cosa si vede. Lasciare vuoto solo nel caso di immagini e video puramente decorativi — gli screen reader leggono ad alta voce questo campo. |
| Immagine o video per formato verticale | Facoltativo. Viene visualizzato su schermi stretti e verticali. Se manca, viene utilizzato ovunque il ritaglio orizzontale. |
| Titolo | Da mantenere breve: fino a circa 24 caratteri rimane su una sola riga. |
| Sottotitolo | Facoltativo, da una a due righe. |
| Pulsante | Facoltativo. Appare solo se sono stati compilati l’etichetta e la destinazione. Al massimo uno per diapositiva. |
| Apri in una nuova scheda | Apre la destinazione del pulsante in una nuova scheda. Usuale per destinazioni esterne. |

## Campi di un post di notizie

| Campo | Descrizione |
| --- | --- |
| Canale | Obbligatorio. Determina quali articoli sono disponibili per la selezione. |
| Articolo | Obbligatorio. I cinquanta articoli più recenti del canale, dal più recente al più vecchio. |
| Sovrascrivi titolo | Facoltativo. Lasciare vuoto per utilizzare il titolo dell’articolo. |
| Mostra teaser come sottotitolo | Attivato per impostazione predefinita. Il teaser viene abbreviato a 240 caratteri. |
| Etichetta del pulsante | Impostazione predefinita: `Scopri di più`. Lasciare vuoto per omettere il pulsante; la destinazione è sempre l’articolo. |
| Sovrascrivi immagine di copertina | Opzionale. Utile se l’immagine del post è troppo ritagliata per la copertina. |
| Immagine per formato verticale | Opzionale. Viene visualizzata su schermi stretti e verticali. |

## Campi di un canale di notizie

| Campo | Descrizione |
| --- | --- |
| Canale | Obbligatorio. Tutte le diapositive di questa voce provengono da questo canale. |
| Numero di diapositive | Impostazione predefinita `3`, massimo otto. |
| Ordine | `Più recenti prima` (impostazione predefinita) o `Più vecchie prima`. |
| Solo post in evidenza | Disattivato per impostazione predefinita. Limitato a ciò che è fissato in primo piano nelle notizie. |
| Solo post con immagine | Attivato per impostazione predefinita. Senza immagine, la diapositiva risulterebbe solo una superficie scura con del testo. |
| Parole chiave | Opzionale, più parole separate da virgole. È sufficiente un solo post se contiene una di queste parole. |
| Mostra teaser come sottotitolo | Attivato per impostazione predefinita. |
| Etichetta del pulsante | Vale per tutte le diapositive del canale. Lasciare vuoto per omettere il pulsante. |

## Note

- **Altezza** funge da limite, non da altezza fissa: il palco si adatta a schermi larghi
  e su schermi stretti 4:3 e viene semplicemente agganciata ai bordi del
  livello selezionato.
- `Altezza dello schermo` riempie l’area visibile al netto dell’intestazione,
  ma con un minimo di 420 px.
- **Secondi per diapositiva** ha effetto solo a partire dalla seconda diapositiva.
- Chi ha impostato «Riduci movimento» nel sistema operativo non vedrà alcun
  cambio automaticamente — indipendentemente da questa impostazione.
- I comandi compaiono solo a partire dalla seconda diapositiva. Sugli schermi stretti
  le frecce sono nascoste; in quel caso si scorre con il dito.
- Un contributo che viene cancellato o che non è visibile per la persona che sta leggendo
  porta con sé solo la propria diapositiva. Le altre diapositive rimangono al loro posto.
- Le diapositive delle notizie seguono la lingua del lettore, purché il contributo
  sia tradotto; in caso contrario, seguono la prima versione disponibile.
- L’**anteprima** nell’editor segue le stesse regole della
  pagina pubblicata. Ciò che non è presente lì, non apparirà nemmeno sulla pagina
  pubblicata.
