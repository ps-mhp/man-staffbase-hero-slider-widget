# Ajustes

Todo se gestiona en el editor, que aparece automáticamente al abrir los ajustes:
las entradas a la izquierda y en el centro, y los ajustes del escenario
a la derecha, en el panel **Widget**. En el cuadro de diálogo de Staffbase solo queda el campo de texto
«Entradas» detrás del editor; se trata de la versión preliminar y no es necesario modificarla
.

| Configuración | Descripción |
| --- | --- |
| Entradas | El contenido del escenario: diapositivas propias, noticias individuales y canales de noticias completos. |

### Panel «Widget», pestaña «Diseño»

| Configuración | Descripción |
| --- | --- |
| Altura | La `altura de sección` está preestablecida. Junto a ella, `Pequeña (320–420 px)`, `Mediana (420–560 px)`, `Grande (560–720 px)` y `Altura de pantalla`. |
| Ancho completo | Si está activado (ajuste predeterminado), la imagen ocupa todo el ancho de la ventana, mientras que el texto se mantiene alineado con la línea de flujo de la página. Si está desactivado, el escenario permanece dentro de la columna de contenido. |
| Posición | La opción predeterminada es `Después de la ruta de navegación`: el escenario comienza debajo de la línea de la ruta de navegación. La opción `Antes de la ruta de navegación` lo coloca alineado justo debajo del menú y desplaza la ruta de navegación hacia abajo. Solo se aplica si el panel se encuentra en la parte superior de la página y esta cuenta con una ruta de navegación. |
| Espacio inferior | La opción predeterminada es `Estándar`: debajo del panel se mantiene el espacio que la página deja entre sus bloques. «Ninguno» hace que el bloque siguiente se coloque directamente a continuación; en el caso de «Delante de la ruta de navegación», directamente debajo de la ruta de navegación. |

### Panel «Widget», pestaña «Comportamiento»

| Ajuste | Descripción |
| --- | --- |
| Segundos por diapositiva | El valor predeterminado es `5`; se admiten valores de `0` a `30`; también se admiten números decimales. `0` detiene el escenario; entonces solo se puede pasar de diapositiva a diapositiva con las flechas y las líneas; y si los controles están desactivados, solo con el deslizamiento y las teclas de flecha. Dejar en blanco significa: como hasta ahora. |
| Mostrar controles | Si está activado (ajuste predeterminado), aparecen las flechas y las líneas. Si están desactivados, desaparecen ambos; se sigue pasando de diapositiva en diapositiva con el deslizamiento y las teclas de flecha, y el tiempo establecido por diapositiva sigue sin cambios. |

### Escenarios existentes

Hasta la versión 0.4, estos ajustes aparecían como campos individuales en el cuadro de diálogo de
Staffbase. Los escenarios existentes los conservan: mientras no se haya modificado un ajuste en el panel,
seguirá aplicándose el valor del campo anterior. El panel lo muestra
donde se puede leer; en caso contrario, en los campos de selección aparece **Como hasta ahora**
y en los botones, la indicación «Aún no se ha definido aquí». Solo quien
ajuste y seleccione **Aplicar** es quien lo establece en el editor —y
solo ese. Quien abra el editor y aplique los cambios sin modificarlos, no cambia
nada. Los campos antiguos están ocultos en el cuadro de diálogo.

## Tipos de entradas

| Tipo | Descripción |
| --- | --- |
| Diapositiva | Una diapositiva editada manualmente: imagen o vídeo, título, subtítulo, botones. |
| Entrada de noticias | Una entrada concreta como diapositiva. El contenido y el enlace de destino proceden de la entrada. |
| Canal de noticias | Un canal completo, una diapositiva por entrada. Las nuevas entradas aparecen sin necesidad de ninguna acción adicional. |

Las tres opciones aparecen en la misma lista, se pueden mezclar y ordenar arrastrando el
controlador o mediante **arriba** y **abajo**. En total,
el escenario muestra un máximo de ocho diapositivas; una entrada de canal cuenta con todas las
diapositivas que aporta.

## Campos de una diapositiva

| Campo | Descripción |
| --- | --- |
| Imagen o vídeo | Obligatorio. De la biblioteca multimedia o mediante una dirección (`https://…`). Horizontal, con un ancho mínimo de 1920 píxeles. Si no hay imagen ni vídeo, la diapositiva no se muestra. |
| Dirección | Detrás de **Insertar dirección**, en lugar de la biblioteca multimedia: la dirección `https` de una imagen o un vídeo. No se aceptan otras direcciones. |
| Tipo | Imagen o vídeo. Se configura automáticamente según la extensión de la dirección (`.mp4`, `.webm`, `.mov` son vídeos); solo hay que seleccionarlo manualmente en el caso de direcciones sin extensión. |
| Descripción de la imagen o el vídeo | Lo que se ve. Déjalo en blanco solo en el caso de imágenes y vídeos puramente decorativos; los lectores de pantalla leen este campo en voz alta. |
| Formato vertical | Opcional. Se muestra en pantallas estrechas y verticales. Si no se indica, se utilizará el recorte horizontal en todos los casos. |
| Título | Que sea breve: hasta unos 24 caracteres, así se mantendrá en una sola línea. |
| Subtítulo | Opcional, de una a dos líneas. |
| Botones | Opcional, hasta tres por diapositiva. Aparecen como una lista con estilo y destino; al hacer clic se despliegan los campos de un botón. Subir/bajar, duplicar y eliminar mediante los iconos situados encima de los campos. Un botón solo aparece si se han rellenado el texto y el destino. Solo en diapositivas editadas manualmente; las diapositivas de noticias obtienen su botón de la publicación. |
| Destino | **Dirección** (`https://…`, `mailto:…`, `tel:…` o una ruta como `/content/…`), **página** de Staffbase o **publicación de noticias** de Staffbase (primero el canal, luego la publicación). No se aceptan otras direcciones, como `javascript:`. |
| Estilo | **Relleno en rojo** (acción principal, predeterminado), **Relleno en blanco**, **Contorno blanco** o **Enlace de texto**. Los botones a partir del segundo comienzan con contorno, para que no haya dos áreas rojas una al lado de la otra. |
| Icono | Opcional: flecha, ángulo, enlace externo, descargar, reproducir, documento, calendario, correo electrónico, teléfono o información. Si se incluye un icono, **el icono aparece**: antes o después del texto. |
| Abrir en una nueva pestaña | Botón. Abre el destino del botón en una nueva pestaña. Se suele utilizar para destinos externos. |

## Campos de una entrada de noticias

| Campo | Descripción |
| --- | --- |
| Canal | Obligatorio. Determina qué entradas están disponibles para su selección. |
| Entrada | Obligatorio. Las cincuenta entradas más recientes del canal, ordenadas de más reciente a más antigua. |
| Título | Opcional. Déjalo en blanco para que se utilice el título de la entrada. |
| Mostrar texto de avance | Activado por defecto. El texto de avance (teaser) aparece como subtítulo y se acorta a 240 caracteres. |
| Texto del botón | «Más información» por defecto. Délo en blanco para omitir el botón; el destino es siempre la entrada. |
| Imagen de fondo | Opcional. Recomendable si la imagen de la entrada está recortada en exceso para la pantalla. |
| Formato vertical | Opcional. Se muestra en pantallas estrechas y verticales. |

## Campos de un canal de noticias

| Campo | Descripción |
| --- | --- |
| Canal | Obligatorio. Todas las diapositivas de esta entrada proceden de este canal. |
| Número de entradas | Predeterminado en `3`, con un máximo de ocho. |
| Orden | «Más recientes primero» (por defecto) o «Más antiguos primero». |
| Solo publicaciones destacadas | Desactivado por defecto. Se limita a lo que está fijado en las noticias. |
| Solo publicaciones con imagen | Activado por defecto. Sin imagen, la diapositiva se vería como un área oscura con texto. |
| Etiquetas (hashtags) | Opcional, varias separadas por comas. Basta con que una publicación contenga una de ellas. |
| Mostrar texto de vista previa | Activado por defecto. |
| Texto del botón | Se aplica a todas las diapositivas del canal. Déjalo en blanco para omitir el botón. |

## Notas

- **Altura** actúa como límite, no como altura fija: el escenario se adapta a pantallas anchas
  pantallas anchas de 21:9 y en las estrechas de 4:3, y solo se ajusta a los límites del
  nivel seleccionado.
- `Altura de pantalla` ocupa la parte visible de la pantalla menos el encabezado,
  con un mínimo de 420 px.
- **Segundos por diapositiva** solo se aplica a partir de la segunda diapositiva.
- Quien tenga configurada la opción «Reducir movimiento» en el sistema operativo no verá
  el cambio por sí mismo, independientemente de esta configuración.
- En la parte superior, el escenario siempre queda alineado: con la ruta de navegación o, en el caso de
  «Antes de la ruta de navegación», con el menú. Para ello, compensa el espacio interior que la sección mantiene
  por encima de su primer bloque. Esto solo ocurre si
  no hay ningún otro contenido encima del escenario.
- Si el escenario es el último bloque de su sección, la sección
  termina con él, independientemente de su altura. Con un nivel fijo, la sección se adapta al
  escenario; con `Altura de sección`, el escenario se adapta a la sección.
- **Espacio inferior** regula la distancia al siguiente bloque de la misma
  sección. El espacio interior de una sección siguiente pertenece a esta y
  se mantiene.
- Con `altura de sección`, el escenario solo ocupa la altura de la sección si
  se encuentra solo en ella. Si hay más bloques en la misma sección, conserva
  su relación de aspecto y los bloques se acercan a ella sin dejar espacio.
- Los controles solo aparecen a partir de la segunda diapositiva. En pantallas estrechas
  las flechas se ocultan; en ese caso, se desliza el dedo.
- Una entrada que se elimine o que no sea visible para el lector
  solo se lleva consigo su propia diapositiva. El resto de diapositivas permanecen en su sitio.
- Las diapositivas de noticias siguen el idioma del lector, siempre que la entrada
  esté traducida; de lo contrario, se muestra la primera versión disponible.
- La **vista previa** en ordenador, tableta y móvil aplica a las entradas de noticias
  las mismas reglas que la página publicada. Lo que no aparece allí,
  tampoco aparece en la vista previa.
