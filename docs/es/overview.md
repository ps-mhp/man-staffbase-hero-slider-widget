# Hero-Slider

El Hero-Slider es el **escenario** situado en la parte superior de una página: una imagen grande que ocupa
todo el ancho de la ventana, con un título encima, opcionalmente un subtítulo y
un botón. El modelo a seguir es el escenario de man.eu.

Si se crean varias diapositivas, se obtiene un cambiador: las diapositivas se
funden unas en otras, y se puede pasar de una a otra mediante las flechas y las líneas situadas en la esquina inferior izquierda.

No es necesario actualizar una diapositiva manualmente. Además de las diapositivas propias, la
página de inicio también puede mostrar **artículos de las noticias**:

- **Artículo de noticias**: un artículo concreto como diapositiva. La imagen, el título
  y el resumen proceden del artículo, y el botón lleva a él.
- **Canal de noticias**: un canal completo, con una diapositiva por artículo. Se puede configurar el número de diapositivas,
  el orden y los filtros. Cuando aparece un nuevo artículo en
  el canal, se muestra automáticamente en el escenario sin necesidad de ninguna acción adicional.

Los tres tipos aparecen en la misma lista y se pueden mezclar y
ordenar libremente —por ejemplo, una diapositiva propia como titular, seguida de las tres últimas
noticias de un canal.

## Lo que ven los lectores

- La imagen ocupa todo el ancho de la ventana, incluso si la propia página
  tiene una columna de contenido más estrecha.
- El escenario queda **alineado en la parte superior**: si la página tiene una barra de navegación,
  el escenario se sitúa justo debajo; si no la tiene, se une directamente al
  menú. Se suprime la franja blanca vacía que la página suele dejar sobre el primer
  contenido.
- El **texto se mantiene en la línea de alineación de la página**: comienza en la misma
  línea vertical que el encabezado, el menú y el texto situado debajo del escenario. No
  se adhiere en ningún caso al borde de la imagen.
- El texto se sitúa en la parte inferior izquierda, sobre un degradado oscuro que va de abajo
  hacia arriba. En pantallas anchas se añade un segundo degradado desde la izquierda
  para que el texto claro siga siendo legible sobre un fondo claro.
- Si hay varias diapositivas: flechas a la izquierda y a la derecha, con una línea entre ellas por cada diapositiva.
  La línea de la diapositiva actual es roja.
- El cambio se mantiene mientras el ratón se encuentra sobre el escenario o el foco está
  en él. En el teléfono se desliza el dedo; allí las flechas están ocultas.
- **En el móvil** (con un ancho inferior a 768 píxeles) solo aparece el título en
  la imagen, con un máximo de cuatro líneas; lo que sobrepase este límite termina en «…».
  La línea inferior y el botón quedan ocultos; en su lugar, al pulsar
  en cualquier punto de la diapositiva se accede al destino del botón. Para los lectores de pantalla,
  su etiqueta sigue siendo el nombre de este enlace. Si una diapositiva no tiene destino,
  tampoco se puede pulsar.
- Quien tenga configurada la opción «Reducir movimiento» en el sistema operativo no verá
  ningún cambio por sí mismo ni ninguna transición; solo verá los elementos de control.
- Las diapositivas de las noticias tienen el mismo aspecto que cualquier otra diapositiva. Desde fuera no se aprecia
  que el contenido proceda de una noticia.

## Lo que ves en el editor del CMS

El editor muestra el escenario dentro de la columna de contenido, es decir, **más estrecho que en
la página publicada**. Solo se puede evaluar hasta dónde llega realmente la imagen y dónde se
sitúa el texto en la vista previa o en la página publicada. Compruébalo siempre al menos una vez con un ancho de ventana más estrecho
, ya que ahí es donde se aplica el recorte en formato vertical.
