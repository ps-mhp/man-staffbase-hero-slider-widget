# Ajustes

| Ajuste | Descripción |
| --- | --- |
| Entradas | El contenido del escenario: diapositivas propias, noticias individuales y canales de noticias completos. Se gestiona a través del editor, que aparece automáticamente al abrir la configuración. El campo de texto que hay debajo es el borrador y no es necesario modificarlo. |
| Altura | `Estándar (420–560 px)` es la opción predeterminada. Junto a ella, `Baja (320–420 px)`, `Alta (560–720 px)` y `Altura de pantalla`. |
| Mostrar a todo lo ancho | Si está activado (configuración predeterminada), la imagen ocupa todo el ancho de la ventana, mientras que el texto se mantiene alineado con la línea de flujo de la página. Si está desactivado, el escenario permanece dentro de la columna de contenido. |
| Segundos por diapositiva | El valor predeterminado es `5`. `0` detiene el escenario; en ese caso, solo se puede avanzar mediante flechas y líneas. Máximo 30. |
| Posición respecto a la ruta de navegación | `Después de la ruta de navegación` es el valor predeterminado: el escenario comienza debajo de la línea de la ruta de navegación. `Antes de la ruta de navegación` la coloca alineada justo debajo del menú y desplaza la ruta de navegación hacia abajo. Solo se aplica si la diapositiva se encuentra en la parte superior de la página y esta tiene ruta de navegación. |
| Mostrar controles | Si está activado (ajuste predeterminado), aparecen flechas y líneas. Si está desactivado, ambos desaparecen; se sigue pasando de diapositiva a diapositiva deslizando el dedo o con las teclas de flecha, y el tiempo establecido por diapositiva transcurre sin cambios. |

## Tipos de entradas

| Tipo | Descripción |
| --- | --- |
| Diapositiva | Una diapositiva editada manualmente: imagen, título, subtítulo, botón. |
| Entrada de noticias | Una entrada concreta como diapositiva. El contenido y el enlace de destino proceden de la entrada. |
| Canal de noticias | Un canal completo, una diapositiva por entrada. Las nuevas entradas aparecen sin necesidad de ninguna acción adicional. |

Las tres aparecen en la misma lista, se pueden mezclar y ordenar mediante **↑** y
**↓**. En total, el escenario muestra un máximo de ocho diapositivas; una
entrada de canal cuenta con todas las diapositivas que aporta.

## Campos de una diapositiva

| Campo | Descripción |
| --- | --- |
| Imagen o vídeo | Obligatorio. De la biblioteca multimedia o mediante una dirección (`https://…`). Horizontal, con un ancho mínimo de 1920 píxeles. Si no hay imagen ni vídeo, la diapositiva no se muestra. |
| Dirección | En lugar de la biblioteca multimedia: la dirección `https` de una imagen o un vídeo. No se aceptan otras direcciones. |
| Tipo | Imagen o vídeo. Se configura automáticamente según la extensión de la dirección (`.mp4`, `.webm`, `.mov` son vídeos); solo hay que seleccionarlo manualmente en direcciones sin extensión. |
| Descripción de la imagen o del vídeo | Lo que se ve. Délo en blanco solo en el caso de imágenes y vídeos puramente decorativos; los lectores de pantalla leen este campo en voz alta. |
| Imagen o vídeo para formato vertical | Opcional. Se muestra en pantallas estrechas y verticales. Si falta, se utiliza el recorte horizontal en todas partes. |
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
| Solo entradas con imagen | Activado por defecto. Sin imagen, la diapositiva no sería más que un área oscura con texto. |
| Etiquetas | Opcional, varias separadas por comas. Basta con que una publicación contenga una de ellas. |
| Mostrar el resumen como subtítulo | Activado por defecto. |
| Texto del botón | Se aplica a todas las diapositivas del canal. Déjalo en blanco para omitir el botón. |

## Notas

- **Altura** actúa como límite, no como altura fija: el escenario se adapta a pantallas anchas
  pantallas anchas de 21:9 y en las estrechas de 4:3, y solo se ajusta a los límites del
  nivel seleccionado.
- `Altura de pantalla` ocupa toda la parte visible menos el encabezado,
  con un mínimo de 420 px.
- **Segundos por diapositiva** solo se aplica a partir de la segunda diapositiva.
- Quien tenga activada la opción «Reducir movimiento» en el sistema operativo no verá
  el cambio por sí mismo, independientemente de esta configuración.
- Los controles solo aparecen a partir de la segunda diapositiva. En pantallas estrechas,
  las flechas están ocultas; en ese caso, se desliza el dedo.
- Una entrada que se elimine o que no sea visible para la persona que lee
  solo se lleva consigo su propia diapositiva. El resto de diapositivas permanecen en su sitio.
- Las diapositivas de noticias se adaptan al idioma del lector, siempre que la publicación
  esté traducida; en caso contrario, se muestra la primera versión disponible.
- La **vista previa** del editor sigue las mismas reglas que la
  página publicada. Lo que no aparezca allí, tampoco aparecerá en la pantalla
  .
