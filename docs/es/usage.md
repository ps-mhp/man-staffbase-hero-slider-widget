# Paso a paso

## El editor de un vistazo

El editor se abre con la configuración del widget y ocupa toda la
ventana.

- **Barra de encabezado:** a la izquierda, **Cerrar**; junto a ella, el estado, que indica si hay
  alguna entrada pendiente de guardar y cuántas. En el centro, los botones de cambio de modo
  **Editor** · **Ordenador** · **Tableta** · **Móvil**. A la derecha, **Deshacer**,
  **Rehacer** y **Ayuda**; en el extremo derecho, **Cancelar** y
  **Aplicar**.
- **Lista de la izquierda:** todas las entradas en el orden de la escena; encima,
  **+ Nuevo** y el número de entradas («3 de 8»). Arrastrando el controlador situado a la izquierda de una línea
  se puede mover una entrada a una nueva posición.
  Debajo de cada título aparecen el tipo y el identificador, por ejemplo, **Diapositiva · 2
  Botones**, **Noticia · Canal Tecnología** o **Canal de noticias · 3 últimas**.
- **Centro:** arriba, **Entrada 2 de 3** con el tipo y cuatro iconos:
  **hacia arriba**, **hacia abajo**, **duplicar**, **eliminar**. Su nombre
  aparece al pasar el ratón por encima. Debajo, en grande, el escenario de la
  entrada seleccionada, en tiempo real: cualquier cambio que se realice a la derecha se ve al instante,
  y las animaciones se reproducen.
- **A la derecha:** el panel **Configuración**. La primera pestaña configura la
  entrada seleccionada: **Diapositiva** con **Medio**, **Texto** y **Botones**,
  **Entrada** o **Canal** en el caso de las entradas de noticias. En **Diseño** se encuentran
  **Altura**, **Ancho completo**, **Posición** y **Distancia inferior** de todo el
  escenario; en **Comportamiento**, **Segundos por diapositiva** y **Mostrar controles
  **. **Como hasta ahora** significa: aún no se ha definido aquí, se aplica la
  configuración anterior del bloque.
- **Ordenador de sobremesa**, **tableta** y **móvil** muestran la entrada seleccionada con el
  ancho correspondiente; las entradas de noticias se muestran como las diapositivas que se crean a partir de las
  publicaciones; el panel permanece al lado. **Editor** vuelve al escenario grande
  .

## Configurar el escenario con una imagen

1. Guarde primero la imagen en la biblioteca multimedia de Staffbase. Horizontal, con un mínimo de
   1920 px de ancho; el escenario la recortará a una proporción de 21:9 o
   4:3; por lo tanto, la imagen no debe llegar hasta los bordes.
2. Coloca el widget **Hero-Slider** en la parte superior de la página, en una fila
   sin otros widgets a su lado. Si se encuentra en una columna junto a otros
   contenidos, no podrá ocuparse de forma adecuada todo el ancho.
3. Abre la configuración del widget. El editor se abrirá
   automáticamente.
4. Haz clic en **+ Nuevo**, encima de la lista, y selecciona **Diapositiva**.
5. Haga clic en el área rayada **Seleccionar imagen o vídeo**, situada debajo de **Medio**,
   y seleccione la imagen de la biblioteca multimedia, o bien introduzca la dirección de una imagen o un vídeo mediante
   **Insertar dirección**. Sin imagen,
   la diapositiva no se mostrará.
6. En **Descripción de la imagen**, indique lo que se ve. Deje el
   campo en blanco solo si la imagen es meramente decorativa.
7. Introduzca el **título**. Que sea breve: hasta unos
   24 caracteres, se mantendrá en una sola línea.
8. Opcional: **subtítulo** y hasta tres **botones** (**Añadir
   botón**). Los botones aparecen en forma de lista; al hacer clic en una línea
   se despliegan sus campos. Para cada botón, selecciona el **destino** — **dirección**,
   **página** o **noticia** de Staffbase—, el **estilo** y, si
   es necesario, un **símbolo**. Un botón solo aparece si se han rellenado el texto **y**
   el destino. En el teléfono, la diapositiva no muestra la línea inferior ni el primer
   botón: allí aparece el título, y toda la diapositiva lleva
   al destino del primer botón; los demás botones permanecen visibles. Por lo tanto, lo que
   aparezca en la línea inferior no debería ser nada que sea imprescindible
   leer.
9. A la derecha, en **Comportamiento**, configura **Segundos por diapositiva** en `0` —
   si se trata de una sola diapositiva, no hay nada que cambiar.
10. Haz clic en **Aplicar**, en la esquina superior derecha.
11. Guarde la página y compruébela en la vista previa, una vez a pantalla completa
    y otra vez en una ventana estrecha.

**Biblioteca como barra.** **Seleccionar imagen o vídeo** y **Reemplazar** abren
la biblioteca como una barra junto al panel; su título indica el destino, por ejemplo,
«Imagen para la diapositiva 2». Al hacer clic en una imagen —o pulsar Intro— se inserta
allí. También puede arrastrar imágenes desde la barra directamente a cualquier campo de imagen,
por ejemplo, a la fila **Formato vertical**: los campos adecuados se
resaltan al arrastrar, y encima del destino aparece «Soltar aquí». Los vídeos solo se pueden
insertar en diapositivas, no en los campos de imagen de una noticia. La tecla Escape o la flecha
superior de la barra la cierran sin salir del editor.

## Crear varias diapositivas

1. Abre la configuración y, con ello, el editor.
2. Para cada diapositiva adicional, selecciona en **+ Nuevo** la opción **Diapositiva** y
   rellénala como se ha indicado anteriormente. No es posible crear más de ocho diapositivas: nadie se molesta en
   desplazarse tanto.
3. Ordena las diapositivas arrastrando una de ellas por el controlador de la izquierda hasta la nueva posición
   o mediante los iconos **arriba** y **abajo** situados sobre el
   formulario. La primera diapositiva es la que se ve al cargar la página.
4. Comprueba a la derecha, en **Comportamiento**, que **Segundos por diapositiva** esté en blanco
   o muestre `5` (valor predeterminado).
5. **Aplicar**, guardar y comprobar en la vista previa.

## Mostrar una noticia concreta en el escenario

1. Abre la configuración y, con ello, el editor.
2. Haz clic en **+ Nuevo**, situado encima de la lista, y selecciona **Noticia**.
   A la izquierda aparecerá una entrada con la indicación **Noticia** debajo del título.
3. En **Canal**, selecciona el canal de noticias. Solo entonces podrás
   seleccionar la noticia.
4. En **Noticia**, selecciona la noticia deseada. Se pueden seleccionar
   las cincuenta últimas entradas del canal, ordenadas de más reciente a más antigua.
5. Selecciona **Escritorio** en la parte superior: la vista previa muestra la imagen, el título y
   el texto de resumen tal y como aparecerá posteriormente en la diapositiva. **Editor** te lleva de vuelta.
6. Opcionalmente, en **Presentación**: puede introducir un **título** propio, desactivar la opción **Mostrar texto de resumen**
   o cambiar el **texto del botón**. El
   botón siempre lleva a la propia entrada.
7. Opcionalmente, en **Medio**: una **imagen de fondo** personalizada. La imagen de la publicación está
   recortada para el feed y no siempre admite una imagen de fondo de gran tamaño.
8. **Aplicar**, guardar y comprobar en la vista previa.

## Mostrar todas las entradas de un canal

1. Abra la configuración y, con ello, el editor.
2. Haga clic en **+ Nuevo**, encima de la lista, y seleccione **Canal de noticias**.
   A la izquierda aparecerá una entrada con el texto **Canal de noticias** debajo del título.
3. En **Canal**, selecciona el canal de noticias.
4. Configura el **Número de entradas** (valor predeterminado `3`, máximo ocho).
5. Selecciona el **orden**: `Más recientes primero` o `Más antiguos primero`.
6. En **Selección**, activa las opciones que necesites:
   - **Solo publicaciones destacadas**: se limita a lo que está
     fijado en las noticias.
   - **Solo publicaciones con imagen** — activado por defecto. Sin imagen,
     la diapositiva solo mostraría un área oscura con texto.
   - **Hashtags** — sepáralos con comas; basta con una publicación si
     incluye alguno de ellos.
7. Selecciona **Ordenador** en la parte superior: la vista previa muestra exactamente las publicaciones
   que quedan tras aplicar los filtros, una diapositiva por publicación. Si queda vacía,
   los filtros son demasiado restrictivos.
8. **Aplicar**, guardar y comprobar en la vista previa.

La entrada cuenta como **una** en la lista, pero incluye varias diapositivas.
En total, el escenario nunca muestra más de ocho diapositivas; lo que exceda este número,
se omite al final.

## Mostrar un vídeo como escenario

1. Selecciona la diapositiva en el editor.
2. En **Imagen o vídeo**, haz clic en **Seleccionar imagen o vídeo** y
   selecciona el vídeo de la biblioteca multimedia. Los vídeos aparecen allí etiquetados con
   su formato (por ejemplo, `MP4`). Se aplica la versión convertida por Staffbase
   — se reproduce en cualquier navegador y suele ser considerablemente más pequeña que el
   original.
3. Si el vídeo se encuentra en otro lugar: introduce su dirección mediante **Insertar dirección**
  . Debe comenzar por `https://`
   y todos los lectores deben poder acceder al vídeo sin necesidad de registrarse
  . Si termina en `.mp4`, `.webm` o `.mov`, **Tipo** cambia
   automáticamente a **Vídeo**; en caso contrario, cámbielo manualmente.
4. En **Descripción del vídeo**, indique qué se ve en él o deje
   el campo en blanco si el vídeo es meramente decorativo.
5. **Aplicar**, guardar y comprobar en la vista previa.

El vídeo se reproduce sin sonido y en bucle, y solo mientras su diapositiva esté en primer
plano. Quien haya configurado menos movimiento en el sistema, verá su primera imagen
fija. Mantenga el archivo pequeño —unos pocos megabytes para unos segundos—,
ya que se carga cada vez que se visita la página.

## Añadir una imagen para el formato vertical

1. Guarde en la
   biblioteca multimedia un recorte del mismo motivo recortado en formato vertical.
2. Seleccione la diapositiva correspondiente en el editor.
3. En la línea **Formato vertical (opcional)**, haz clic en **Seleccionar imagen o vídeo**
   o, mediante **Insertar dirección**, introduce una dirección.
4. La vista **Móvil** de la barra de encabezado muestra el recorte en formato vertical
   ya en el editor.
5. **Aplicar**, guardar y comprobarlo en una ventana estrecha o en el
   teléfono.

## Modificar posteriormente

1. Abre la configuración del widget; se abrirá el editor con las
   entradas existentes.
2. Selecciona a la izquierda la entrada que deseas modificar. La descripción que aparece debajo del título
   indica de qué tipo se trata: **diapositiva**, **noticia** o
   **canal de noticias**.
3. Modifica los campos de la derecha. Con el icono **duplicar** se crea una
   copia de la entrada seleccionada justo detrás; con **eliminar**, esta
   desaparece. Las opciones de mover, duplicar y eliminar se aplican a los tres tipos
   por igual. Cuando hay ocho entradas, las opciones **+ Nuevo** y **Duplicar**
   están desactivadas.
4. **Deshacer** y **Rehacer** En la barra de encabezado, los botones
   permiten deshacer o rehacer pasos individuales.
5. **Aplicar** guarda los cambios en el widget; solo después de esto
   se guarda la página. Si a una diapositiva le falta la imagen, el editor
   no aplica ningún cambio: el estado indica la diapositiva y la lista la marca.
6. **Cancelar** o **Cerrar** te preguntarán, siempre que no se haya
   aplicado ningún cambio: **Desechar**, **Seguir editando** o **Aplicar**.

## Si algo no funciona

1. **El escenario permanece vacío.** Falta al menos una imagen: las diapositivas sin imagen
   no se muestran. Abra el editor y compruebe que cada entrada tenga
   una imagen — en el caso de las entradas de noticias, en la vista previa (**Escritorio**).
2. **La imagen no ocupa todo el ancho.** ¿Se encuentra el widget en una
   columna junto a otros contenidos? En ese caso, colóquelo en una línea propia.
   De lo contrario, compruebe si, a la derecha, en **Diseño**, está activada la opción **Ancho completo**
  .
3. **El texto no se alinea con la línea de alineación.** Esto puede deberse a que
   el ancho del contenido de la página difiere. Notifique el caso indicando la
   dirección de la página; la plataforma se ajusta al ancho que la propia página
   indica.
4. **En lugar del editor, ves un campo de texto «Entradas» con JSON.** El
   editor no ha podido cargarse. Vuelve a cargar el cuadro de diálogo. No edites
   el texto manualmente.
5. **La selección de canales permanece vacía y aparece un campo de texto para introducir un
   identificador.** No se ha podido acceder a la lista de canales de noticias. Vuelve a cargar el
   cuadro de diálogo; si eso no funciona, introduce el identificador del canal. Lo
   encontrarás en la dirección del canal en el CMS.
6. **Falta una diapositiva de noticias en la página.** La entrada se ha eliminado,
   se ha movido o no es visible para el lector. El resto de diapositivas
   no se ven afectadas. Comprueba la entrada en la vista previa del editor.
7. **Una entrada de canal muestra menos diapositivas de las configuradas.** Los filtros son
   demasiado restrictivos —normalmente **Solo entradas con imagen** en un canal sin imágenes— o
   el escenario ya está lleno con ocho diapositivas.

## Diseñar una diapositiva libremente

1. Seleccione la diapositiva a la izquierda y, a la derecha, en la pestaña **Diapositiva**, en **Estructura**,
   seleccione **Personalizada**. Lo que ya tenía la diapositiva —título, subtítulo,
   botones— aparecerá a continuación como bloques en la parte inferior izquierda.
2. Arrastre un bloque desde el catálogo de la derecha hasta una zona del escenario.
   Al arrastrarlo, se resalta la zona sobre la que suelta el botón. Sin arrastrar:
   haga clic en el bloque; este aparecerá entonces en la parte inferior izquierda.
3. Al hacer clic en un bloque del escenario, se abren sus ajustes a la derecha:
   Texto, tamaño, color, la **zona** y **Ocultar en móvil**. **Volver a la
   diapositiva** te lleva al catálogo. Los bloques también se pueden arrastrar dentro del escenario a otra
   zona.
4. Si desea que una zona sea más ancha o más alta —por ejemplo, toda la fila superior—,
   haga clic en su nombre y seleccione a la derecha **Ancho** o **Altura**.
5. Seleccione **Móvil** en la parte superior y compruebe el orden; oculte
   lo que sobre en las columnas estrechas.
6. **Aplicar**, guardar y comprobar en la vista previa.
