# Paso a paso

## Configurar un escenario con una imagen

1. Guarda primero la imagen en la biblioteca multimedia de Staffbase. En formato horizontal, con un mínimo
   de 1920 px de ancho; el escenario la recortará a una proporción de 21:9 o
   4:3; por lo tanto, la imagen no debe llegar hasta los bordes.
2. Coloca el widget **Hero-Slider** en la parte superior de la página, en una fila
   sin otros widgets a su lado. Si se encuentra en una columna junto a otros
   contenidos, no podrá ocuparse de forma adecuada todo el ancho.
3. Abre la configuración del widget. El editor se abrirá
   automáticamente.
4. Haz clic en **Nuevo +**, encima de la lista, y selecciona **Diapositiva**.
5. En **Imagen**, haz clic en el área rayada **Seleccionar imagen** y
   selecciona la imagen de la biblioteca multimedia. Sin imagen, la diapositiva no
   se mostrará.
6. En **Descripción de la imagen**, escribe lo que se ve en ella. Deje el
   campo en blanco solo si la imagen es meramente decorativa.
7. Introduzca el **título**. Se mostrará en mayúsculas; hasta unos
   24 caracteres, se mantendrá en una sola línea.
8. Opcional: **Subtítulo** y **Botón**. El botón solo aparecerá
   si se han rellenado el texto **y** el destino.
9. Haz clic en **Aplicar**.
10. Establezca **Segundos por diapositiva** en `0` — si se trata de una sola diapositiva,
    no hay nada que cambiar.
11. Guarde la página y compruébela en la vista previa, una vez en pantalla ancha
    y otra vez en una ventana estrecha.

## Crear varias diapositivas

1. Abre los ajustes y, con ello, el editor.
2. Para cada diapositiva adicional, selecciona en **Nuevo +** la opción **Diapositiva** y
   rellénala como se ha indicado anteriormente. No es posible tener más de ocho diapositivas: nadie se molesta en
   pasar tantas páginas.
3. Ordena las diapositivas con las flechas **↑** y **↓** de la esquina superior derecha. La primera diapositiva
   es la que se ve al cargar la página.
4. Comprueba que **Segundos por diapositiva** esté en `5` (ajuste predeterminado).
5. **Aplicar**, guardar y comprobar en la vista previa.

## Mostrar una sola noticia en la página principal

1. Abre la configuración y, con ello, el editor.
2. Haz clic en **Nuevo +**, encima de la lista, y selecciona **Noticia**.
   A la izquierda aparecerá una entrada con la etiqueta **Publicación**.
3. En **Canal**, selecciona el canal de noticias. Solo entonces podrás
   seleccionar la entrada.
4. En **Entrada**, selecciona la entrada deseada. Puedes elegir entre
   las cincuenta entradas más recientes del canal, ordenadas de más reciente a más antigua.
5. Comprueba la **vista previa** que aparece debajo: muestra la imagen, el titular y
   el resumen tal y como aparecerá la diapositiva posteriormente.
6. Opcional: **sobrescribir el titular**, **mostrar el resumen como subtítulo**
   o cambiar el **texto del botón**. El destino del
   botón es siempre la propia publicación.
7. Opcional: **sobrescribir la imagen de fondo**. La imagen de la publicación está recortada para el feed
   y no siempre se ve bien con un fondo alto.
8. **Aplicar**, guardar y comprobar en la vista previa.

## Mostrar todas las publicaciones de un canal

1. Abra la configuración y, con ello, el editor.
2. Haga clic en **Nuevo +**, situado encima de la lista, y seleccione **Canal de noticias**.
   A la izquierda aparecerá una entrada con la etiqueta **Canal**.
3. En **Canal**, selecciona el canal de noticias.
4. Configura el **número de diapositivas** (valor predeterminado `3`, máximo ocho).
5. Selecciona el **orden**: `Lo más reciente primero` o `Lo más antiguo primero`.
6. Si es necesario, aplica **filtros**:
   - **Solo publicaciones destacadas**: se limita a lo que está
     fijado en las noticias.
   - **Solo publicaciones con imagen** — activado por defecto. Sin imagen,
     la diapositiva quedaría como un área oscura con texto.
   - **Palabras clave** — sepáralas con comas; basta con que una publicación
     contenga una de ellas.
7. Comprueba la **vista previa**: muestra exactamente las entradas que quedan
   tras aplicar los filtros. Si queda vacía, los filtros son demasiado restrictivos.
8. **Aplicar**, guardar y comprobar en la vista previa.

La entrada cuenta como **una** en la lista, pero incluye varias diapositivas.
En total, el escenario nunca muestra más de ocho diapositivas; lo que exceda este número,
se omite al final.

## Añadir una imagen para el formato vertical

1. Guarde en la
   biblioteca multimedia un recorte del mismo motivo recortado en formato vertical.
2. Seleccione la diapositiva correspondiente en el editor.
3. En **Imagen para formato vertical**, haga clic en **Seleccionar imagen**.
4. **Aplicar**, guardar y comprobarlo en una ventana estrecha o en el
   teléfono.

## Modificar posteriormente

1. Abre la configuración del widget; se abrirá el editor con las
   entradas existentes.
2. Selecciona a la izquierda la entrada que deseas modificar. El icono situado encima del título indica
  de qué tipo se trata: **Diapositiva**, **Publicación** o **Canal**.
3. Modifica los campos de la derecha. Al pulsar **Duplicar** se crea una copia de la
   entrada seleccionada justo detrás; con **Eliminar**, esta desaparece. Las flechas,
   **Duplicar** y **Eliminar** se aplican por igual a los tres tipos.
4. **Aplicar** guarda los cambios en el widget; solo después de esto
   se guarda la página.

## Si algo no funciona

1. **El escenario permanece vacío.** Falta al menos una imagen: las diapositivas sin imagen
   no se muestran. Abre el editor y comprueba que cada entrada tenga
   una imagen; en el caso de las entradas de noticias, compruébalo en la vista previa.
2. **La imagen no ocupa todo el ancho.** ¿Se encuentra el widget en una
   columna junto a otros contenidos? En ese caso, colóquelo en una línea propia.
   Si no es así, compruebe si la opción **Mostrar a todo el ancho** está activada
  .
3. **El texto no se alinea con la línea de referencia.** Esto puede deberse a que
   el ancho del contenido de la página no coincide. Notifique el caso indicando la
   dirección de la página; el escenario se ajusta al ancho que la propia página
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
   demasiado restrictivos —normalmente **«Solo entradas con imagen»** en un canal sin imágenes— o
   el escenario ya está lleno con ocho diapositivas.
