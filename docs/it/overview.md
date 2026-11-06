# Hero-Slider

L'Hero-Slider è il **palcoscenico** nella parte superiore di una pagina: un'immagine di grandi dimensioni che occupa l'
intera larghezza della finestra, con sopra un titolo, eventualmente una didascalia e
un pulsante. Il modello di riferimento è il palcoscenico su man.eu.

Chi crea più diapositive ottiene un carrello: le diapositive si
succedono in dissolvenza, mentre la navigazione avviene tramite le frecce e le linee in basso a sinistra.

Non è necessario aggiornare manualmente una diapositiva. Oltre alle diapositive personalizzate, la
pagina iniziale può mostrare anche **articoli dalle notizie**:

- **Articolo** — un determinato articolo come diapositiva. Immagine, titolo
  e anteprima provengono dall’articolo, il pulsante rimanda ad esso.
- **Canale di notizie** — un intero canale, una diapositiva per ogni contributo. È possibile impostare il numero,
  l’ordine e i filtri. Se nel
  canale viene pubblicato un nuovo contributo, questo appare automaticamente sul palco senza alcun intervento.

I tre tipi figurano nello stesso elenco e possono essere liberamente combinati e
ordinati — ad esempio, una diapositiva dedicata come articolo di apertura, seguita dai tre articoli più recenti
di un canale.

## Cosa vedono i lettori

- L’immagine occupa l’intera larghezza della finestra — anche se la pagina
  stessa ha una colonna di contenuto più stretta.
- Il «palcoscenico» è posizionato **a filo in alto**: se la pagina ha una barra di navigazione,
  il «palcoscenico» si trova immediatamente sotto di essa; se non ce l’ha, si collega direttamente al
  menu. La striscia bianca vuota che la pagina altrimenti lascia libera sopra il primo
  contenuto viene eliminata.
- Il **testo rimane allineato alla linea di riferimento della pagina**: inizia sulla stessa
  linea verticale dell’intestazione, del menu e del testo sottostante l’area di visualizzazione. Esso
  non è espressamente allineato al bordo dell’immagine.
- Il testo si trova in basso a sinistra, su una sfumatura scura che va dal basso
  verso l’alto. Sugli schermi larghi si aggiunge una seconda sfumatura da sinistra
  , affinché il testo chiaro rimanga leggibile su uno sfondo chiaro.
- In caso di più diapositive: frecce a sinistra e a destra, con una linea tra di esse per ogni diapositiva.
  La linea della diapositiva corrente è rossa.
- Il cambio rimane attivo finché il mouse si trova sopra il palco o il focus è
  su di esso. Sul telefono si scorre con il dito; in questo caso le frecce vengono nascoste.
- **Sul telefono** (con larghezza inferiore a 768 pixel) sull’immagine compare solo il titolo,
  lungo al massimo quattro righe; ciò che va oltre termina con «…».
  La riga inferiore e il pulsante vengono nascosti; al loro posto, un tocco
  in un punto qualsiasi della diapositiva porta alla destinazione del pulsante. Per gli screen reader,
  la loro etichetta rimane il nome di questo link. Se una diapositiva non ha una destinazione,
  non è possibile toccarla.
- Chi ha impostato «Riduci animazioni» nel sistema operativo non vede alcun
  cambio automatico né dissolvenze — solo gli elementi di controllo.
- Le diapositive delle notizie hanno lo stesso aspetto di qualsiasi altra diapositiva. Il fatto che il contenuto provenga
  da un articolo non è riconoscibile dall’esterno.

## Cosa vedete nell’editor CMS

L’editor mostra l’area di visualizzazione all’interno della colonna dei contenuti, quindi **più stretta rispetto alla
pagina pubblicata**. È possibile valutare fino a dove si estende realmente l’immagine e dove si trova il testo
solo nell’anteprima o sulla pagina pubblicata
. Controllate sempre almeno una volta con una
larghezza della finestra ridotta: è lì che entra in gioco il ritaglio in formato verticale.
