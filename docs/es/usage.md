# Paso a paso

## Configurar un escenario con una imagen

1. Guarda primero la imagen en la biblioteca multimedia de Staffbase. En formato apaisado, con un ancho mínimo
   de 1920 píxeles; el escenario la recortará a una proporción de 21:9 o
   4:3; por lo tanto, la imagen no debe llegar hasta los bordes.
2. Coloca el widget **Hero-Slider** en la parte superior de la página, en una fila
   sin otros widgets a su lado. Si se encuentra en una columna junto a otros
   contenidos, no podrá ocuparse de forma adecuada todo el ancho.
3. Abre la configuración del widget. El editor se abrirá
   automáticamente.
4. Haz clic en **Nuevo +**, encima de la lista, y selecciona **Diapositiva**.
5. Debajo de **Imagen o vídeo**, haz clic en el área rayada **Seleccionar imagen
   o vídeo** y selecciona la imagen de la biblioteca multimedia, o bien introduce
   debajo la dirección de una imagen o un vídeo. Sin imagen, la
   diapositiva no se mostrará.
6. En **Descripción de la imagen**, introduzca lo que se ve en ella. Deje el
   campo en blanco solo si la imagen es meramente decorativa.
7. Introduzca el **título**. Que sea breve: hasta unos
   24 caracteres, se mantendrá en una sola línea.
8. Opcional: **línea inferior** y **botón**. El botón solo aparecerá
   si se han rellenado el texto **y** el destino. En el teléfono,
   el escenario no muestra ninguno de los dos: allí solo aparece el título, y toda la
   diapositiva lleva al destino del botón. Por lo tanto, lo que figure en el subtítulo
   no debería ser nada que sea imprescindible leer.
9. Haga clic en **Aplicar**.
10. Establezca **Segundos por diapositiva** en `0`; si solo hay una diapositiva,
    no hay nada que cambiar.
11. Guarde la página y compruébela en la vista previa, una vez en pantalla ancha
    y otra vez en una ventana estrecha.

## Crear varias diapositivas

1. Abre la configuración y, con ello, el editor.
2. Para cada diapositiva adicional, selecciona en **Nuevo +** la opción **Diapositiva** y
   rellénala como se ha indicado anteriormente. No es posible tener más de ocho diapositivas: nadie se desplaza
   tanto.
3. Ordena las diapositivas con las flechas **↑** y **↓** de la esquina superior derecha. La primera diapositiva
   es la que se ve al cargar la página.
4. Comprueba que **Segundos por diapositiva** esté en `5` (ajuste predeterminado).
5. **Aplicar**, guardar y comprobar en la vista previa.

## Mostrar una noticia concreta en la página principal

1. Abre la configuración y, con ello, el editor.
2. Haz clic en **Nuevo +**, encima de la lista, y selecciona **Noticia**.
   A la izquierda aparecerá una entrada con la etiqueta **Publicación**.
3. En **Canal**, selecciona el canal de noticias. Solo entonces podrás
   seleccionar la noticia.
4. En **Noticia**, selecciona la noticia deseada. Puedes elegir entre
   las cincuenta noticias más recientes del canal, ordenadas de más reciente a más antigua.
5. Comprueba la **vista previa** que aparece debajo: muestra la imagen, el título y
   el resumen tal y como se verá la diapositiva más adelante.
6. Opcional: **sobrescribir el título**, **mostrar el resumen como subtítulo**
   o cambiar el **texto del botón**. El destino del
   botón es siempre la propia publicación.
7. Opcional: **sobrescribir la imagen de portada**. La imagen de la publicación está recortada para el feed
   y no siempre incluye una parte superior.
8. **Aplicar**, guardar y comprobar en la vista previa.

## Mostrar todas las publicaciones de un canal

1. Abre la configuración y, con ello, el editor.
2. Haz clic en **Nuevo +**, situado encima de la lista, y selecciona **Canal de noticias**.
   A la izquierda aparecerá una entrada con la etiqueta **Canal**.
3. En **Canal**, selecciona el canal de noticias.
4. Configura el **número de diapositivas** (valor predeterminado `3`, máximo ocho).
5. Selecciona el **orden**: `Más recientes primero` o `Más antiguos primero`.
6. Si es necesario, aplica **filtros**:
   - **Solo publicaciones destacadas**: se limita a lo que está
     fijado en las noticias.
   - **Solo publicaciones con imagen**: activado por defecto. Sin imagen,
     la diapositiva solo mostraría un área oscura con texto.
   - **Palabras clave**: sepáralas con comas; basta con que una publicación
     contenga una de ellas.
7. Comprueba la **vista previa**: muestra exactamente las entradas que quedan
   tras aplicar los filtros. Si queda vacía, los filtros son demasiado restrictivos.
8. **Aplicar**, guardar y comprobar en la vista previa.

La entrada cuenta como **una** en la lista, pero incluye varias diapositivas.
En total, el escenario nunca muestra más de ocho diapositivas; lo que exceda este número,
queda omitido.

## Mostrar un vídeo como escenario

1. Seleccione la diapositiva en el editor.
2. En **Imagen o vídeo**, haz clic en **Seleccionar imagen o vídeo** y
   selecciona el vídeo de la biblioteca multimedia. Los vídeos aparecen allí identificados con
   su formato (por ejemplo, `MP4`). Se aplica la versión convertida por Staffbase
   — se reproduce en cualquier navegador y suele ser considerablemente más pequeña que el
   original.
3. Si el vídeo se encuentra en otro lugar: introduce en su lugar su dirección en
   **O dirección de una imagen o un vídeo**. Debe comenzar por `https://`
   , y todos los lectores deben poder acceder al vídeo sin necesidad de registrarse
  . Si termina en `.mp4`, `.webm` o `.mov`, el **Tipo** cambia
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
   biblioteca multimedia un recorte del mismo motivo recortado en vertical.
2. Seleccione la diapositiva correspondiente en el editor.
3. En **Imagen o vídeo para formato vertical**, haz clic en **Seleccionar imagen o vídeo
  ** o introduce una dirección debajo.
4. **Aplicar**, guarda y comprueba el resultado en una ventana estrecha o en el
  teléfono.

## Modificar posteriormente

1. Abre la configuración del widget; se abrirá el editor con las
   entradas existentes.
2. Selecciona a la izquierda la entrada que deseas modificar. El indicador situado encima del título indica
  de qué tipo se trata: **Diapositiva**, **Publicación** o **Canal**.
3. Modifica los campos de la derecha. Al hacer clic en **Duplicar** se crea una copia de la
   entrada seleccionada justo detrás; con **Eliminar**, esta desaparece. Las flechas,
   **Duplicar** y **Eliminar** se aplican por igual a los tres tipos.
4. **Aplicar** guarda los cambios en el widget; solo entonces
   se guarda la página.

## Si algo no funciona

1. **El escenario permanece vacío.** Falta al menos una imagen: las diapositivas sin imagen
   no se muestran. Abre el editor y comprueba que cada entrada tenga
   una imagen; en el caso de las entradas de noticias, compruébalo en la vista previa.
2. **La imagen no ocupa todo el ancho.** ¿Se encuentra el widget en una
   columna junto a otros contenidos? En ese caso, colóquelo en una línea propia.
   De lo contrario, compruebe si la opción **Mostrar a todo el ancho** está activada
  .
3. **El texto no se alinea con la línea de referencia.** Esto puede deberse a que
   el ancho del contenido de la página no coincide. Notifique el caso indicando la
   dirección de la página; el escenario se ajusta al ancho que la propia página
   indica.
4. **En lugar del editor, ves un campo de texto «Entradas» con JSON.** El
   editor no ha podido integrarse. Vuelve a cargar el cuadro de diálogo. No edites
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
