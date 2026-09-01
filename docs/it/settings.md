# Impostazioni

| Impostazione | Descrizione |
| --- | --- |
| Diapositive | Immagini, testi e pulsanti del palco. Vengono gestiti tramite l'editor delle diapositive, che si apre automaticamente all'apertura delle impostazioni. Il campo di testo sottostante contiene la bozza e non deve essere modificato. |
| Altezza | `Standard (420–560 px)` è l’impostazione predefinita. Accanto ad essa sono disponibili `Bassa (320–420 px)`, `Alta (560–720 px)` e `Altezza schermo`. |
| Mostra a tutta larghezza | Se attivata (impostazione predefinita), l’immagine si estende per l’intera larghezza della finestra, mentre il testo rimane allineato al margine della pagina. Se disattivata, il palco rimane nella colonna dei contenuti. |
| Secondi per diapositiva | Il valore predefinito è `5`. `0` mette in pausa il palco; in questo caso, lo scorrimento avviene solo tramite frecce e linee. Massimo 30. |

## Campi di una diapositiva

| Campo | Descrizione |
| --- | --- |
| Immagine | Obbligatorio. Orizzontale, larghezza minima 1920 px. Senza immagine, la diapositiva non viene visualizzata. |
| Descrizione immagine | Cosa si vede nell’immagine. Lasciare vuoto solo in caso di immagini puramente decorative — gli screen reader leggono ad alta voce questo campo. |
| Immagine per formato verticale | Facoltativo. Viene visualizzata su schermi stretti e verticali. Se manca, viene utilizzato ovunque il ritaglio orizzontale. |
| Titolo | Viene scritto in maiuscolo. Fino a circa 24 caratteri rimane su una sola riga. |
| Sottotitolo | Facoltativo, da una a due righe. |
| Pulsante | Facoltativo. Appare solo se sono stati compilati il testo e la destinazione. Al massimo uno per diapositiva. |
| Apri in una nuova scheda | Apre la destinazione del pulsante in una nuova scheda. Usuale per destinazioni esterne. |

## Note

- **Altezza** funge da limite, non da altezza fissa: l’area di visualizzazione è in formato 21:9 sugli
  schermi larghi e 4:3 su quelli stretti, e viene semplicemente confinata ai bordi del
  livello selezionato.
- `Altezza schermo` riempie la parte visibile dello schermo al netto dell’intestazione,
  ma con un minimo di 420 px.
- **Secondi per diapositiva** ha effetto solo a partire dalla seconda diapositiva.
- Chi ha impostato «Riduci movimento» nel sistema operativo non vedrà alcun
  cambio di per sé — indipendentemente da questa impostazione.
- I comandi compaiono solo a partire dalla seconda diapositiva. Sugli schermi stretti
  le frecce sono nascoste; in quel caso si scorre con il dito.
