# Ajustes

Todo se gestiona en el editor, que aparece automáticamente al abrir los ajustes:
las entradas a la izquierda, en el centro, en tamaño grande, el escenario de la entrada
seleccionada, y todos los ajustes a la derecha en el panel **Ajustes** — pestaña
**Diapositiva** (o **Publicación**, **Canal**) para la entrada, **Diseño** y
**Comportamiento** para todo el escenario. Si no hay ninguna entrada, el panel se denomina **Widget**. En el cuadro de diálogo de Staffbase solo queda el campo de texto
«Entradas» detrás del editor; se trata del borrador y no es necesario modificarlo
.

| Configuración | Descripción |
| --- | --- |
| Entradas | El contenido del escenario: diapositivas propias, entradas de noticias individuales y canales de noticias completos. |

### Panel «Configuración», pestaña «Diseño»

| Ajuste | Descripción |
| --- | --- |
| Altura | La `altura de sección` está preestablecida. Junto a ella, `Pequeña (320–420 px)`, `Mediana (420–560 px)`, `Grande (560–720 px)` y `Altura de pantalla`. |
| Ancho completo | Si está activada (ajuste predeterminado), la imagen ocupa todo el ancho de la ventana, mientras que el texto se mantiene alineado con la línea de alineación de la página. Si está desactivada, el escenario permanece dentro de la columna de contenido. |
| Posición | La opción predeterminada es `Después de la ruta de navegación`: el escenario comienza debajo de la línea de la ruta de navegación. La opción `Antes de la ruta de navegación` lo coloca alineado justo debajo del menú y desplaza la ruta de navegación hacia abajo. Solo se aplica si el panel se encuentra en la parte superior de la página y esta cuenta con una ruta de navegación. |
| Espacio inferior | La opción predeterminada es `Estándar`: debajo del panel se mantiene el espacio que la página deja entre sus bloques. «Ninguno» hace que el bloque siguiente se coloque directamente a continuación; en el caso de «Delante de la ruta de navegación», directamente debajo de la ruta de navegación. |

### Panel «Configuración», pestaña «Comportamiento»

| Ajuste | Descripción |
| --- | --- |
| Segundos por diapositiva | El valor predeterminado es `5`; se admiten valores entre `0` y `30`; también se admiten números decimales. `0` detiene el escenario; entonces solo se puede pasar de diapositiva a diapositiva con las flechas y las líneas; y si los controles están desactivados, solo con el deslizamiento y las teclas de flecha. Dejar en blanco significa: como hasta ahora. |
| Mostrar controles | Si está activado (ajuste predeterminado), aparecen las flechas y las líneas. Si están desactivados, ambos desaparecen; se sigue pasando de diapositiva en diapositiva con el deslizamiento y las teclas de flecha, y el tiempo establecido por diapositiva sigue sin cambios. |

### Escenarios existentes

Hasta la versión 0.4, estos ajustes aparecían como campos individuales en el cuadro de diálogo de
Staffbase. Los escenarios existentes los conservan: mientras no se haya modificado un ajuste en el panel,
seguirá aplicándose el valor del campo anterior. El panel lo muestra
donde se puede leer; en caso contrario, en los campos de selección aparece **Como hasta ahora**
y en los botones, la indicación «Aún no se ha definido aquí». Solo quien
ajuste y seleccione **Aplicar**, lo establece en el editor —y
solo ese. Quien abra el editor y aplique los cambios sin modificarlos, no cambia
nada. Los campos antiguos están ocultos en el cuadro de diálogo.

## Tipos de entradas

| Tipo | Descripción |
| --- | --- |
| Diapositiva | Una diapositiva editada manualmente: imagen, vídeo o animación, título, subtítulo, botones. |
| Entrada de noticias | Una entrada concreta como diapositiva. El contenido y el enlace de destino proceden de la entrada. |
| Canal de noticias | Un canal completo, una diapositiva por entrada. Las nuevas entradas aparecen sin necesidad de ninguna acción adicional. |

Las tres opciones aparecen en la misma lista, se pueden mezclar y ordenar arrastrando el
controlador o mediante **arriba** y **abajo**. En total,
el escenario muestra un máximo de ocho diapositivas; una entrada de canal cuenta con todas las
diapositivas que aporta.

## Campos de una diapositiva

| Campo | Descripción |
| --- | --- |
| Estructura | **Fija**: título, subtítulo y botones en una posición fija en la parte inferior izquierda. **Personalizada**: módulos en nueve zonas, dispuestos en el escenario (véase más abajo). Al cambiar, se mantiene lo que hay. |
| Fondo | **Imagen o vídeo** (un archivo, véase más abajo) o **animación**: un patrón en movimiento formado por cuadrados en los colores de MAN, que dibuja el propio widget. Una animación se adapta a cualquier tamaño de escenario, no necesita formato vertical y no carga nada adicional. |
| Patrón | Solo en el caso de la animación. Angular: **Ola** (cuadrados finos por los que recorre una ola y los eleva), **Cuadrícula** (cuadrícula tranquila con una franja de luz que se desplaza), **Módulos** (módulos distribuidos de forma dispersa que pulsan). Redondos: **Puntos** (puntos finos que se elevan formando un ondulado), **Líneas** (curvas de nivel fluidas, algunas en rojo), **anillos** (anillos de puntos que se extienden suavemente desde la derecha), **corriente** (partículas que giran y se desplazan). La parte del texto de la izquierda —en la parte inferior del teléfono— siempre permanece libre. |
| Fondo | Solo en animación. **Opaco**, **75 %**, **50 %**, **25 %** o **Transparente**: por debajo se ve la sección que hay detrás; los patrones y la tipografía se mantienen intensos. |
| Color de fondo | Solo en animación. **Oscuro** (antracita) o **Claro** (blanco). La letra se vuelve automáticamente blanca o antracita, según lo que resulte más legible sobre el fondo visible, incluso si el fondo es translúcido sobre una sección de color. |
| Velocidad | Solo en animación. **Lenta** (una repetición en 20 segundos) o **Rápida** (12 segundos). Si está activada la opción «Reducir movimiento» del dispositivo, la animación se detiene. |
| Acentos rojos | Solo en animación. Interruptor: los elementos rojos se desplazan con la animación —aproximadamente uno de cada cien en el campo; en el caso de líneas y anillos, líneas o anillos completos individuales—. |
| Imagen o vídeo | Obligatorio si el fondo es una **imagen o un vídeo**. De la biblioteca multimedia o mediante una dirección (`https://…`). Horizontal, con un ancho mínimo de 1920 píxeles. Si no hay imagen ni vídeo, no se muestra la diapositiva. |
| Dirección | En **Insertar dirección**, en lugar de la biblioteca multimedia: la dirección `https` de una imagen o un vídeo. No se aceptan otras direcciones. |
| Tipo | Imagen o vídeo. Se configura automáticamente según la extensión de la dirección (`.mp4`, `.webm`, `.mov` son vídeos); solo hay que seleccionarlo manualmente en direcciones sin extensión. |
| Descripción de la imagen o el vídeo | Lo que se ve. Déjalo en blanco solo en el caso de imágenes y vídeos puramente decorativos; los lectores de pantalla leen este campo en voz alta. |
| Formato vertical | Opcional. Se muestra en pantallas estrechas y verticales. Si no se indica, se utilizará el recorte horizontal en todos los casos. |
| Título | Que sea breve: hasta unos 24 caracteres, así se mantendrá en una sola línea. |
| Subtítulo | Opcional, de una a dos líneas. |
| Botones | Opcional, hasta tres por diapositiva. Aparecen como una lista con estilo y destino; al hacer clic se despliegan los campos de un botón. Subir/bajar, duplicar y eliminar mediante los iconos situados encima de los campos. Un botón solo aparece si se han rellenado el texto y el destino. Solo en diapositivas editadas manualmente; las diapositivas de noticias obtienen su botón de la publicación. |
| Destino | **Dirección** (`https://…`, `mailto:…`, `tel:…` o una ruta como `/content/…`), **página** de Staffbase o **publicación de noticias** de Staffbase (primero el canal, luego la publicación). No se aceptan otras direcciones, como `javascript:`. |
| Estilo | **Relleno en rojo** (acción principal, predeterminado), **Relleno en blanco**, **Contorno blanco** o **Enlace de texto**. Los botones nuevos, a partir del segundo, comienzan con contorno para que no haya dos áreas rojas una al lado de la otra. |
| Icono | Opcional: flecha, ángulo, enlace externo, descargar, reproducir, documento, calendario, correo electrónico, teléfono o información. Si se incluye un icono, **el icono aparece**: antes o después del texto. |
| Abrir en una pestaña nueva | Botón. Abre el destino del botón en una pestaña nueva. Se suele utilizar para destinos externos. |

## Campos de una entrada de noticias

| Campo | Descripción |
| --- | --- |
| Canal | Obligatorio. Determina qué entradas están disponibles para su selección. |
| Entrada | Obligatorio. Las cincuenta entradas más recientes del canal, ordenadas de más reciente a más antigua. |
| Título | Opcional. Déjalo en blanco para que se utilice el título de la entrada. |
| Mostrar texto de avance | Activado por defecto. El texto de avance (teaser) aparece como subtítulo y se acorta a 240 caracteres. |
| Texto del botón | Predeterminado: «Más información». Déjalo en blanco para omitir el botón; el destino es siempre la entrada. |
| Imagen de fondo | Opcional. Recomendable si la imagen de la entrada está demasiado recortada para la página principal. |
| Formato vertical | Opcional. Se muestra en pantallas estrechas y verticales. |

## Campos de un canal de noticias

| Campo | Descripción |
| --- | --- |
| Canal | Obligatorio. Todas las diapositivas de esta entrada proceden de este canal. |
| Número de entradas | Predeterminado en `3`, con un máximo de ocho. |
| Orden | `Las más recientes primero` (predeterminado) o `Las más antiguas primero`. |
| Solo publicaciones destacadas | Desactivado por defecto. Se limita a lo que está fijado en las noticias. |
| Solo publicaciones con imagen | Activado por defecto. Sin imagen, la diapositiva no sería más que un área oscura con texto. |
| Hashtags | Opcional, varios separados por comas. Basta con una publicación que contenga uno de ellos. |
| Mostrar texto de vista previa | Activado por defecto. |
| Texto del botón | Se aplica a todas las diapositivas del canal. Déjalo en blanco para omitir el botón. |

## Notas

- **Altura** actúa como límite, no como altura fija: el escenario es de 21:9 en
  pantallas anchas y de 4:3 en pantallas estrechas, y solo se ajusta a los límites del
  nivel seleccionado.
- `Altura de pantalla` ocupa la parte visible de la pantalla menos el encabezado,
  pero con un mínimo de 420 px.
- **Segundos por diapositiva** solo se aplica a partir de la segunda diapositiva.
- Quien tenga activada la opción «Reducir movimiento» en el sistema operativo no verá
  el cambio por sí mismo, independientemente de esta configuración.
- En la parte superior, el escenario siempre queda alineado: con la ruta de navegación o, en el caso de
  «Delante de la ruta de navegación», con el menú. A cambio, compensa el espacio interior que la sección mantiene
  por encima de su primer bloque. Esto solo ocurre si
  no hay ningún otro contenido por encima del escenario.
- Si el escenario es el último bloque de su sección, la sección termina
  con él, independientemente de su altura. Si se establece un nivel fijo, la sección se adapta al
  escenario; si se establece `altura de la sección`, el escenario se adapta a la sección.
- **Distancia inferior** controla la distancia al siguiente bloque de la misma
  sección. La distancia interior de una sección siguiente pertenece a esta y
  se mantiene.
- Con la opción `altura de sección`, el escenario solo ocupa la altura de la sección si
  se encuentra solo en ella. Si hay otros bloques en la misma sección, mantiene
  su relación de aspecto y los bloques se acercan a él sin dejar espacio.
- Los controles solo aparecen a partir de la segunda diapositiva. En pantallas estrechas,
  las flechas se ocultan; en ese caso, se desliza el dedo.
- Una entrada que se elimine o que no sea visible para el lector
  solo se lleva consigo su propia diapositiva. El resto de diapositivas permanecen en su sitio.
- Las diapositivas de noticias siguen el idioma del lector, siempre que la entrada
  esté traducida; de lo contrario, se utiliza la primera versión disponible.
- La **vista previa** en ordenador, tableta y móvil aplica a las entradas de noticias
  las mismas reglas que la página publicada. Lo que no aparezca allí,
  tampoco aparecerá en el escenario.

## Diapositiva personalizada

Con **Estructura: Personalizada**, el escenario central es un área de trabajo
con nueve zonas: arriba, centro y abajo, cada una a la izquierda, en el centro y a la derecha de la
línea de alineación. En el panel de la derecha se encuentra el catálogo de bloques.

| Bloque | Ajustes |
| --- | --- |
| Título | Texto, tamaño (**Display**, **H1**–**H3**), color. El primer título de la diapositiva es su título principal. |
| Texto | Texto, tamaño (**L**, **M**, **S**), color. |
| Etiqueta | Texto breve sobre un título, color. |
| Botones | Hasta tres botones, igual que en la diapositiva fija. |
| Imagen o logotipo | De la biblioteca multimedia o mediante dirección, descripción, tamaño: **S** un tercio, **M** dos tercios, **L** todo el ancho de la zona — como máximo una quinta parte, dos quintas partes o tres quintas partes de la altura del escenario (en dispositivos móviles, con **L**, poco menos de la mitad). Para una imagen grande, amplía la zona (**Ancho**). Las imágenes con fondo transparente (PNG, SVG) se ven bien sobre cualquier fondo. |
| Icono | Símbolo, tamaño, color. |

Además, para cada módulo: **Zona** (una selección de 3×3 como el escenario),
**Ocultar en móvil** y, en la parte superior, **hacia arriba**, **hacia abajo**, **duplicar**,
**eliminar**. **Color: Automático** sigue la diapositiva — blanco o antracita, según
lo que se lea mejor sobre el fondo.

**Alineación por zona:** Al hacer clic en el nombre de una zona (o en su
área vacía) muestra a la derecha **Horizontal en la zona** (**Izquierda**, **Centro**,
**Derecha**) y **Vertical en la zona** (**Arriba**, **Centro**, **Abajo**). Se
aplican a todos los bloques de la zona; estos mismos campos también aparecen en la
configuración de cada bloque. La posición predeterminada es la de la zona: «abajo a la izquierda»
se sitúa abajo a la izquierda.

**Agrupar zonas:** Debajo de la alineación aparecen **Ancho** (**1 columna**,
**2 columnas**, **3 columnas**) y **Altura** (**1 fila**, **2 filas**,
**3 filas**). De este modo, por ejemplo, la fila superior se convierte en una zona («arriba, todo el
ancho») o la columna de la izquierda («izquierda, toda la altura»). La zona se expande primero
hacia la derecha o hacia abajo, y en el borde, hacia la izquierda o hacia arriba; los bloques de las
zonas superpuestas se sitúan detrás de los suyos propios, y la alineación se mantiene. Al
reducir el tamaño, la zona permanece en el lado en el que se encuentran sus bloques. No se
ofrece un tamaño que solo cubra parcialmente otra zona agrupada.

En **móvil**, las zonas se sitúan una debajo de otra en el orden de lectura (arriba a la izquierda, arriba
en el centro, arriba a la derecha, en el centro a la izquierda…; una zona agrupada en la posición
de su esquina superior izquierda); lo alineado a la derecha se desplaza hacia la izquierda,
lo centrado permanece centrado, los botones siguen siendo botones. Lo que resulte excesivo en el teléfono se oculta con **Ocultar en móvil**;
se puede comprobar más arriba con **Móvil**.
