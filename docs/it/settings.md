# Impostazioni

| Impostazione | Descrizione |
| --- | --- |
| Voci | Il contenuto della pagina: diapositive personalizzate, singoli articoli di notizie e interi canali di notizie. Viene gestito tramite l'editor, che si apre automaticamente all'apertura delle impostazioni. Il campo di testo sottostante contiene la bozza e non deve essere modificato. |
| Altezza | L'impostazione predefinita è `Standard (420–560 px)`. Sono disponibili anche `Bassa (320–420 px)`, `Alta (560–720 px)` e `Altezza schermo`. |
| Mostra a tutta larghezza | Se attivata (impostazione predefinita), l’immagine si estende per l’intera larghezza della finestra, mentre il testo rimane allineato al margine della pagina. Se disattivata, il palcoscenico rimane nella colonna dei contenuti. |
| Secondi per diapositiva | Il valore predefinito è `5`. `0` mette in pausa il palcoscenico; in questo caso la navigazione avviene solo tramite frecce e linee. Massimo 30. |

## Tipi di voci

| Tipo | Descrizione |
| --- | --- |
| Diapositiva | Una diapositiva gestita manualmente: immagine, titolo, sottotitolo, pulsante. |
| Articolo di notizie | Un articolo specifico come diapositiva. Il contenuto e la destinazione provengono dall’articolo. |
| Canale di notizie | Un intero canale, una diapositiva per ogni articolo. I nuovi articoli vengono visualizzati automaticamente senza ulteriori interventi. |

Tutte e tre le tipologie compaiono nella stessa lista, possono essere mescolate e ordinate tramite **↑** e
**↓**. In totale, la piattaforma mostra al massimo otto diapositive — una
voce di canale conta con tutte le diapositive che essa contribuisce.

## Campi di una diapositiva

| Campo | Descrizione |
| --- | --- |
| Immagine | Obbligatorio. Orizzontale, larghezza minima 1920 px. Senza immagine, la diapositiva non viene visualizzata. |
| Descrizione immagine | Cosa si vede nell’immagine. Lasciare vuoto solo nel caso di immagini puramente decorative — gli screen reader leggono ad alta voce questo campo. |
| Immagine per formato verticale | Facoltativo. Viene visualizzata su schermi stretti e verticali. Se manca, viene utilizzata ovunque la versione orizzontale. |
| Titolo | Viene visualizzato in maiuscolo. Fino a circa 24 caratteri rimane su una sola riga. |
| Sottotitolo | Facoltativo, da una a due righe. |
| Pulsante | Facoltativo. Appare solo se sono stati compilati il testo e la destinazione. Al massimo uno per diapositiva. |
| Apri in una nuova scheda | Apre la destinazione del pulsante in una nuova scheda. Usuale per destinazioni esterne. |

## Campi di un articolo di notizie

| Campo | Descrizione |
| --- | --- |
| Canale | Obbligatorio. Determina quali articoli sono disponibili per la selezione. |
| Articolo | Obbligatorio. I cinquanta articoli più recenti del canale, dal più recente al più vecchio. |
| Sovrascrivi titolo | Opzionale. Lasciare vuoto per utilizzare il titolo dell’articolo. |
| Mostra teaser come sottotitolo | Attivato per impostazione predefinita. Il teaser viene abbreviato a 240 caratteri. |
| Etichetta del pulsante | `Scopri di più` per impostazione predefinita. Lasciare vuoto per omettere il pulsante; la destinazione è sempre l’articolo. |
| Sovrascrivi immagine di copertina | Opzionale. Utile se l’immagine del post è troppo ritagliata per la copertina. |
| Immagine per formato verticale | Opzionale. Viene visualizzata su schermi stretti e verticali. |

## Campi di un canale di notizie

| Campo | Descrizione |
| --- | --- |
| Canale | Obbligatorio. Tutte le diapositive di questa voce provengono da questo canale. |
| Numero di diapositive | Impostazione predefinita `3`, massimo otto. |
| Ordine | `Più recenti per primi` (impostazione predefinita) o `Più vecchi per primi`. |
| Solo post in evidenza | Disattivato per impostazione predefinita. Limitato a ciò che è fissato in primo piano nelle notizie. |
| Solo post con immagine | Attivato per impostazione predefinita. Senza immagine, la diapositiva risulterebbe solo una superficie scura con del testo. |
| Parole chiave | Opzionale, più parole separate da virgola. È sufficiente un solo post se contiene una di queste parole. |
| Mostra il teaser come sottotitolo | Attivato per impostazione predefinita. |
| Etichetta del pulsante | Vale per tutte le diapositive del canale. Lasciare vuoto per omettere il pulsante. |

## Note

- **Altezza** funge da limite, non da altezza fissa: l’area di visualizzazione si adatta a
  e su schermi stretti 4:3 e viene semplicemente allineata ai bordi del
  livello selezionato.
- `Altezza schermo` riempie la parte visibile dello schermo al netto dell'intestazione,
  con un minimo di 420 px.
- **Secondi per diapositiva** ha effetto solo a partire dalla seconda diapositiva.
- Chi ha impostato «Riduci movimento» nel sistema operativo non vedrà alcun
  cambio automaticamente — indipendentemente da questa impostazione.
- I comandi compaiono solo a partire dalla seconda diapositiva. Sugli schermi stretti
  le frecce sono nascoste; in quel caso si scorre con il dito.
- Un contributo che viene cancellato o che non è visibile per la persona che sta leggendo
  porta con sé solo la propria diapositiva. Le altre diapositive rimangono al loro posto.
- Le diapositive delle notizie seguono la lingua del lettore, a condizione che il contributo
  sia tradotto; in caso contrario, seguono la prima versione disponibile.
- L’**anteprima** nell’editor segue le stesse regole della
  pagina pubblicata. Ciò che non è presente nell’anteprima non apparirà nemmeno nella visualizzazione finale
 .
