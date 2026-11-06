# Ajustes

| Ajuste | Descripción |
| --- | --- |
| Entradas | El contenido de la página: diapositivas propias, noticias individuales y canales de noticias completos. Se gestiona a través del editor, que aparece automáticamente al abrir la configuración. El campo de texto que hay debajo es el borrador y no es necesario modificarlo. |
| Altura | `Estándar (420–560 px)` es la opción predeterminada. Junto a ella, `Baja (320–420 px)`, `Alta (560–720 px)` y `Altura de pantalla`. |
| Mostrar a todo lo ancho | Si está activado (ajuste predeterminado), la imagen ocupa todo el ancho de la ventana, mientras que el texto se mantiene alineado con el margen de la página. Si está desactivado, el escenario permanece dentro de la columna de contenido. |
| Segundos por diapositiva | El valor predeterminado es `5`. Si se establece en `0`, el escenario se detiene; en ese caso, solo se puede avanzar mediante las flechas y las líneas —y, si los controles están desactivados, únicamente deslizando el dedo y con las teclas de flecha—. Máximo 30. |
| Posición respecto a la ruta de navegación | El valor predeterminado es `Después de la ruta de navegación`: el escenario comienza debajo de la línea de la ruta de navegación. `Antes de la ruta de navegación` lo coloca alineado justo debajo del menú y desplaza la ruta de navegación hacia abajo. Solo es aplicable si la escena se encuentra en la parte superior de la página y si la página tiene migas de pan. |
| Mostrar controles | Si está activado (ajuste predeterminado), aparecen flechas y líneas. Si está desactivado, ambos desaparecen; se sigue pasando de diapositiva en diapositiva deslizando el dedo y con las teclas de flecha, y el tiempo establecido por diapositiva sigue sin cambios. |
| Espacio hacia abajo | «Estándar» es la configuración predeterminada: debajo del escenario se mantiene el espacio que la página deja entre sus bloques. «Sin espacio» hace que el bloque siguiente se una directamente; en el caso de «Delante de la ruta de navegación», justo debajo de la ruta de navegación. |

## Tipos de entradas

| Tipo | Descripción |
| --- | --- |
| Diapositiva | Una diapositiva editada manualmente: imagen, título, subtítulo, botón. |
| Entrada de noticias | Una entrada concreta como diapositiva. El contenido y el enlace de destino proceden de la entrada. |
| Canal de noticias | Un canal completo, una diapositiva por entrada. Las nuevas entradas aparecen sin necesidad de intervención alguna. |

Las tres opciones aparecen en la misma lista, se pueden mezclar y ordenar mediante **↑** y
**↓**. En total, el escenario muestra un máximo de ocho diapositivas; una
entrada de canal cuenta con todas las diapositivas que aporta.

## Campos de una diapositiva

| Campo | Descripción |
| --- | --- |
| Imagen o vídeo | Obligatorio. De la biblioteca multimedia o mediante una dirección (`https://…`). Horizontal, con un ancho mínimo de 1920 píxeles. Si no hay imagen ni vídeo, la diapositiva no se muestra. |
| Dirección | En lugar de la biblioteca multimedia: la dirección `https` de una imagen o un vídeo. No se aceptan otras direcciones. |
| Tipo | Imagen o vídeo. Se configura automáticamente según la extensión de la dirección (`.mp4`, `.webm`, `.mov` son vídeos); solo hay que seleccionarlo manualmente en direcciones sin extensión. |
| Descripción de la imagen o del vídeo | Lo que se ve. Délo en blanco solo en el caso de imágenes y vídeos puramente decorativos; los lectores de pantalla leen este campo en voz alta. |
| Imagen o vídeo para formato vertical | Opcional. Se muestra en pantallas estrechas y verticales. Si falta, se utilizará el recorte horizontal en todas partes. |
| Título | Que sea breve: hasta unos 24 caracteres, así se mantendrá en una sola línea. |
| Subtítulo | Opcional, de una a dos líneas. |
| Botón | Opcional. Solo aparece si se han rellenado el texto y el destino. Como máximo uno por diapositiva. |
| Abrir en una pestaña nueva | Abre el destino del botón en una pestaña nueva. Se suele utilizar para destinos externos. |

## Campos de una entrada de noticias

| Campo | Descripción |
| --- | --- |
| Canal | Obligatorio. Determina qué entradas están disponibles para su selección. |
| Entrada | Obligatorio. Las cincuenta entradas más recientes del canal, ordenadas de más reciente a más antigua. |
| Sobrescribir título | Opcional. Déjalo en blanco para que se utilice el título de la entrada. |
| Mostrar el resumen como subtítulo | Activado por defecto. El resumen se acorta a 240 caracteres. |
| Texto del botón | «Más información» por defecto. Déjalo en blanco para omitir el botón; el destino es siempre la entrada. |
| Sobrescribir imagen de fondo | Opcional. Recomendado si la imagen de la entrada está demasiado recortada para el fondo. |
| Imagen para formato vertical | Opcional. Se muestra en pantallas estrechas y verticales. |

## Campos de un canal de noticias

| Campo | Descripción |
| --- | --- |
| Canal | Obligatorio. Todas las diapositivas de esta entrada proceden de este canal. |
| Número de diapositivas | Predeterminado en `3`, con un máximo de ocho. |
| Orden | `Las más recientes primero` (predeterminado) o `Las más antiguas primero`. |
| Solo entradas destacadas | Desactivado por defecto. Se limita a lo que está fijado en las noticias. |
| Solo entradas con imagen | Activado por defecto. Sin imagen, la diapositiva se vería como un área oscura con texto. |
| Etiquetas | Opcional, varias separadas por comas. Basta con que una publicación contenga una de ellas. |
| Mostrar el resumen como subtítulo | Activado por defecto. |
| Texto del botón | Se aplica a todas las diapositivas del canal. Déjalo en blanco para omitir el botón. |

## Notas

- **Altura** actúa como límite, no como altura fija: el escenario se adapta a pantallas anchas
  pantallas de 21:9 y en las estrechas de 4:3, y solo se ajusta a los límites del
  nivel seleccionado.
- `Altura de pantalla` ocupa toda la parte visible menos el encabezado,
  con un mínimo de 420 px.
- **Segundos por diapositiva** solo surte efecto a partir de la segunda diapositiva.
- Quien tenga activada la opción «Reducir movimiento» en el sistema operativo no verá
  el cambio por sí mismo, independientemente de esta configuración.
- En la parte superior, el escenario siempre se alinea —con la ruta de navegación o, en el caso
  «Delante de la ruta de navegación», con el menú. A cambio, compensa el espacio interior que la sección mantiene
  por encima de su primer bloque. Esto solo ocurre si
  no hay ningún otro contenido por encima del escenario.
- **Espacio hacia abajo** elimina el espacio entre los bloques, no el
  espacio interior al final de una sección. Si el escenario es el último bloque de
  su sección, se mantiene su espacio hacia abajo, salvo en el caso de la
  altura `Altura de sección`: ahí, la sección termina a ras de todos modos.
- Con `altura de sección`, el escenario ocupa la altura de la sección solo si
  se encuentra solo en ella. Si hay otros bloques en la misma sección, mantiene
  su relación de aspecto y los bloques se acercan a él sin dejar espacio.
- Los elementos de control solo aparecen a partir de la segunda diapositiva. En pantallas estrechas
  las flechas se ocultan; en ese caso, se desliza el dedo.
- Una entrada que se elimine o que no sea visible para el lector
  solo se lleva consigo su propia diapositiva. El resto de diapositivas permanecen en su sitio.
- Las diapositivas de noticias siguen el idioma del lector, siempre que la entrada
  esté traducida; de lo contrario, se utiliza la primera versión disponible.
- La **vista previa** del editor sigue las mismas reglas que la
  página publicada. Lo que no aparece allí, tampoco aparece en la pantalla
  .
