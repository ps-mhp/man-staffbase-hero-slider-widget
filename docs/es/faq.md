# Preguntas frecuentes

**Pregunta:** He creado una diapositiva, pero el escenario sigue vacío.

Respuesta: A la diapositiva le falta la imagen. Las diapositivas sin imagen no se muestran; un
espacio oscuro y vacío no se distinguiría de un error en la página.
Abre el editor y, en **Imagen o vídeo**, selecciona una imagen
o introduce una dirección.

**Pregunta:** He introducido una dirección de vídeo, pero la diapositiva solo muestra
un área oscura.

Respuesta: Por lo general, el vídeo no se puede reproducir sin iniciar sesión, o bien el **Tipo** está
configurado en **Imagen** porque la dirección no tiene extensión. Abre la dirección en
una ventana privada del navegador: si no se reproduce allí, los
lectores tampoco lo verán. Un mensaje justo debajo del campo indica que la dirección
no se ha aceptado; debe comenzar por `https://`.

**Pregunta:** He introducido un texto para el botón, pero
no aparece.

Respuesta: El botón necesita **ambas cosas**: texto y destino. Mientras
uno de los campos esté vacío, no se mostrará.

**Pregunta:** La imagen no ocupa todo el ancho de la ventana.

Respuesta: Hay dos posibles causas. O bien la opción **Mostrar a todo lo ancho**
está desactivada, o bien el widget se encuentra en una columna junto a otros contenidos.
Colóquelo en una línea propia en la parte superior de la página.

**Pregunta:** El texto no aparece donde comienza el resto del contenido de la página.

Respuesta: El escenario se adapta al ancho de contenido que indica la página.
Si difiere, notifique el caso indicando la dirección de la página.

**Pregunta:** En lugar del editor, veo un campo de texto «Entradas» con
llaves en su interior.

Respuesta: El editor no ha podido integrarse en el cuadro de diálogo. Cierre
la configuración y vuelva a abrirla. El texto del campo es el
borrador de las entradas; no lo edite manualmente, ya que un error tipográfico
en él haría que desaparecieran todas las diapositivas.

**Pregunta:** El escenario no cambia por sí solo.

Respuesta: Hay tres posibles causas: solo hay una diapositiva; **Segundos por diapositiva**
está en `0`; o en el sistema operativo está activada la opción «Reducir movimiento».
En este último caso, es intencionado: se puede seguir pasando de una diapositiva a otra mediante las flechas
y las líneas.

**Pregunta:** No veo flechas en el teléfono.

Respuesta: Así está previsto. En pantallas estrechas se desliza el dedo; las
líneas situadas debajo del texto siguen indicando qué diapositiva está actualmente en primer plano.

**Pregunta:** Mi imagen está recortada por los bordes.

Respuesta: El escenario recorta la imagen a 21:9 o 4:3, dependiendo del ancho de la ventana. Elige
una imagen con margen alrededor del motivo o añade, en **Imagen para
formato vertical**, un recorte propio recortado en vertical.

**Pregunta:** ¿Puedo crear más de ocho diapositivas?

Respuesta: No. A cinco segundos por diapositiva, una reproducción completa ya dura, con
ocho diapositivas, cuarenta segundos; nadie se queda tanto tiempo en un escenario.
El límite de ocho se aplica al conjunto de todas las diapositivas: una entrada de canal con cinco publicaciones
solo permite tres diapositivas más junto a ella.

**Pregunta:** ¿Tengo que actualizar el escenario cuando aparece una nueva entrada
en las noticias?

Respuesta: En el caso de una entrada del **canal de noticias**, no; siempre muestra las
entradas actuales del canal según los filtros configurados. En cambio, una entrada de **publicación de noticias**
se mantiene en la publicación que hayas seleccionado.

**Pregunta:** Una diapositiva de las noticias ha desaparecido de repente.

Respuesta: La publicación se ha eliminado, se ha movido o no es visible para el lector. Solo desaparece esa diapositiva; el resto permanece.

**Pregunta:** Mi entrada de canal muestra menos diapositivas de las configuradas.

Respuesta: Normalmente, los filtros son demasiado restrictivos. La opción **«Solo entradas con imagen»** está
activada por defecto, por lo que un canal sin imágenes no mostrará nada. Comprueba la
vista previa en el editor: muestra exactamente lo que aparecerá en la pantalla.

**Pregunta:** En la selección de canales no aparece ningún canal, sino un
campo de texto para introducir un identificador.

Respuesta: No se ha podido acceder a la lista de canales de noticias. Vuelve a cargar el cuadro de diálogo.
Si eso no funciona, introduce el identificador del canal manualmente; lo encontrarás
en la dirección del canal en el CMS.

**Pregunta:** ¿Por qué la imagen de una noticia aparece borrosa o
recortada de forma extraña en el escenario?

Respuesta: Las imágenes de las noticias están recortadas para el formato de feed, no para un
escenario a altura de pantalla. En la entrada, en **Sobrescribir imagen del escenario**,
añade una propia, en horizontal y con un ancho mínimo de 1920 píxeles.

**Pregunta:** ¿Qué ocurre con el escenario cuando se traduce automáticamente la
página?

Respuesta: Se traducen todos los textos escritos por ti mismo: el título,
el subtítulo, el texto del botón y la descripción de la imagen de una diapositiva,
así como el título sobrescrito y el texto de una entrada de noticias.
Las imágenes, los enlaces, los canales, los filtros y el orden permanecen sin cambios.

**Pregunta:** Una entrada de noticias muestra en la página traducida textos diferentes a los del
idioma original; ¿se trata de un error?

Respuesta: No. El título y el texto de resumen de una noticia proceden de la propia
noticia, y se muestran en el idioma que el lector haya
configurado en la aplicación. Solo se traduce lo que hayas escrito en la propia entrada.
Si falta una versión lingüística de la entrada, aparece la que hay disponible, en lugar de
dejar la diapositiva en blanco.

**Pregunta:** He seleccionado «Antes de la ruta de navegación», pero no cambia nada.

Respuesta: La configuración solo se aplica si se cumplen tres condiciones: la página tiene
una barra de navegación, el escenario se encuentra en la parte superior de la página y
no hay ningún otro contenido por encima de él. Si no se cumple alguna de estas condiciones, el
escena debajo de la ruta de navegación; una ruta de navegación en el centro de la página sería
peor que no haber realizado ningún cambio. En el editor, en este caso aparece una nota
encima de la escena. En la página publicada no aparece; allí
no se puede modificar la configuración.

**Pregunta:** Antes había una franja blanca encima del escenario. ¿Dónde está?

Respuesta: La sección en la que se encuentra el escenario mantiene un
espacio interior por encima de su primer bloque. Sobre un texto esto es correcto, pero sobre un escenario
se crea así una franja blanca entre el menú o la ruta de navegación y la imagen. El escenario
compensa este espacio por sí mismo en cuanto se sitúa en la parte superior. Si hay
otro bloque por encima, el espacio se mantiene tal y como lo establece la página.

**Pregunta:** He seleccionado «Sin espacio», pero sigue habiendo espacio debajo del escenario.

Respuesta: «Sin espacio» elimina el espacio entre dos bloques. Si el
escenario es el último bloque de su sección, a continuación aparece el espacio interior de la
sección y el inicio de la siguiente; ambos forman parte de la página. Si coloca el
contenido siguiente en la misma sección, se unirá directamente a él.

**Pregunta:** Sin elementos de control, ¿cómo se pasa de una diapositiva a otra?

Respuesta: Deslizando el dedo, con las teclas de flecha o de forma automática:
el tiempo configurado por diapositiva transcurre sin cambios. En cuanto al teclado, el
escenario se puede seleccionar directamente en cuanto faltan los elementos de control.
