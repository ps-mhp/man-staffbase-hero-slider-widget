# Hero-Slider

El Hero-Slider es el **escenario** situado en la parte superior de una página: una imagen grande que ocupa
todo el ancho de la ventana, con un título encima, opcionalmente un subtítulo y
un botón. El modelo a seguir es el escenario de man.eu.

Si se crean varias diapositivas, se obtiene un cambiador: las diapositivas se
funden unas en otras, y se puede navegar por ellas mediante las flechas y las líneas de la esquina inferior izquierda.

No es necesario actualizar una diapositiva manualmente. Además de las diapositivas propias, la
página de inicio también puede mostrar **noticias**:

- **Noticia**: una noticia concreta como diapositiva. La imagen, el título
  y el resumen proceden de la noticia, y el botón lleva a ella.
- **Canal de noticias**: un canal completo, una diapositiva por artículo. Se puede configurar el número de diapositivas,
  el orden y los filtros. Cuando aparece un nuevo artículo en
  el canal, se muestra en el escenario sin necesidad de ninguna acción adicional.

Los tres tipos aparecen en la misma lista y se pueden mezclar y
ordenar libremente —por ejemplo, una diapositiva propia como titular, seguida de las tres últimas
noticias de un canal.

## Lo que ven los lectores

- La imagen ocupa todo el ancho de la ventana, incluso si la propia página
  tiene una columna de contenido más estrecha.
- El **texto se mantiene en la línea de alineación de la página**: comienza en la misma
  línea vertical que el encabezado, el menú y el texto situado debajo del escenario. No
  se adhiere en ningún caso al borde de la imagen.
- El texto aparece en la parte inferior izquierda, sobre un degradado oscuro que se desvanece de abajo
  hacia arriba. En pantallas anchas se añade un segundo degradado desde la izquierda
  para que el texto claro siga siendo legible sobre un fondo claro.
- Si hay varias diapositivas: flechas a la izquierda y a la derecha, con una línea entre ellas por cada diapositiva.
  La línea de la diapositiva actual es roja.
- El cambio se mantiene mientras el ratón se sitúe sobre el escenario o el foco esté
  en él. En el teléfono se desliza el dedo; allí, las flechas se ocultan.
- Quien tenga activada la opción «Reducir movimiento» en el sistema operativo no verá
  el cambio por sí mismo ni ninguna transición, solo los elementos de control.
- Las diapositivas de las noticias tienen el mismo aspecto que cualquier otra diapositiva. Desde fuera no se aprecia
  que el contenido provenga de una noticia.

## Lo que ves en el editor del CMS

El editor muestra el escenario dentro de la columna de contenido, es decir, **más estrecho que en
la página publicada**. Solo se puede evaluar hasta dónde llega realmente la imagen y dónde se
sitúa el texto en la vista previa o en la página publicada
. Compruébalo siempre al menos una vez con un ancho de ventana más estrecho
, ya que ahí es donde se aplica el recorte en formato vertical.
