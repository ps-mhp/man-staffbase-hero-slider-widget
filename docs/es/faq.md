# Preguntas frecuentes

**Pregunta:** He creado una diapositiva, pero el escenario sigue vacío.

Respuesta: A la diapositiva le falta la imagen. Las diapositivas sin imagen no se muestran; un
espacio oscuro y vacío no se distinguiría de un error en la página.
Abre el editor y, en **Imagen o vídeo**, selecciona una imagen
o introduce una dirección.

**Pregunta:** He introducido una dirección de vídeo, pero la diapositiva solo muestra
un área oscura.

Respuesta: Por lo general, el vídeo no se puede reproducir sin iniciar sesión, o bien **Tipo** aparece
como **Imagen** porque la dirección no tiene extensión. Abre la dirección en
una ventana privada del navegador: si allí no se reproduce, los
lectores tampoco lo verán. Un mensaje justo debajo del campo indica que la dirección
no se ha aceptado; debe comenzar por `https://`.

**Pregunta:** He introducido un texto para el botón, pero
no aparece.

Respuesta: El botón necesita **ambas cosas**: texto y destino. Mientras
uno de los campos esté vacío, no se mostrará. En el caso de una dirección libre,
solo se admiten `https://…`, `mailto:…`, `tel:…` y rutas como `/content/…`; el
formulario avisa si no se acepta una dirección.

**Pregunta:** La imagen no ocupa todo el ancho de la ventana.

Respuesta: Hay dos posibles causas. O bien la opción **Ancho completo** (en el editor,
a la derecha, en **Diseño**) está desactivada, o bien el widget se encuentra en una columna junto a otros contenidos.
Colóquelo en una línea propia en la parte superior de la página.

**Pregunta:** El texto no aparece donde comienza el resto del contenido de la página.

Respuesta: El área de trabajo se ajusta al ancho de contenido que indica la página.
Si difiere, comunique el caso indicando la dirección de la página.

**Pregunta:** En lugar del editor, veo un campo de texto «Entradas» con
llaves en su interior.

Respuesta: El editor no ha podido integrarse en el cuadro de diálogo. Cierra
la configuración y vuelve a abrirla. El texto del campo es el
versión sin formato de las entradas; no lo edites manualmente: un error tipográfico
en él hará que desaparezcan todas las diapositivas.

**Pregunta:** El escenario no cambia por sí solo.

Respuesta: Hay tres posibles causas: solo hay una diapositiva; **Segundos por diapositiva**
(en el editor, a la derecha, en **Comportamiento**) está en `0`; o bien, en el sistema operativo está activada la opción «Reducir movimiento».
En este último caso, es intencionado: se puede seguir pasando de una diapositiva a otra mediante las flechas
y las líneas.

**Pregunta:** No veo flechas en el teléfono.

Respuesta: Así está previsto. En pantallas estrechas se desliza el dedo; las
líneas situadas debajo del texto siguen indicando qué diapositiva está actualmente en primer plano.

**Pregunta:** Mi imagen aparece recortada por los bordes.

Respuesta: El escenario recorta la imagen a 21:9 o 4:3, dependiendo del ancho de la ventana. Elija
una imagen con margen alrededor del motivo o, en **Imagen para
formato vertical**, seleccione un recorte propio recortado en vertical.

**Pregunta:** ¿Puedo crear más de ocho diapositivas?

Respuesta: No. A cinco segundos por diapositiva, una reproducción completa de
ocho diapositivas ya dura cuarenta segundos; nadie se queda tanto tiempo en un escenario.
El límite de ocho se aplica al conjunto de todas las diapositivas: una entrada de canal con cinco publicaciones
solo permite añadir tres diapositivas más.

**Pregunta:** ¿Tengo que actualizar el escenario cuando aparece una nueva publicación
en las noticias?

Respuesta: En el caso de una entrada de **canal de noticias**, no; esta siempre muestra las
publicaciones actuales del canal según los filtros configurados. En cambio, una entrada de **publicación de noticias**
se mantiene en la publicación que hayas seleccionado.

**Pregunta:** De repente, ha desaparecido una diapositiva de las noticias.

Respuesta: La entrada se ha eliminado, se ha movido o no es visible para el lector.
Solo desaparece esa diapositiva concreta; el resto permanece.

**Pregunta:** Mi entrada de canal muestra menos diapositivas de las configuradas.

Respuesta: Por lo general, los filtros son demasiado restrictivos. La opción **«Solo entradas con imagen»** está
activada por defecto; por lo tanto, un canal sin imágenes no muestra nada. Comprueba la
vista previa en el editor (**escritorio**): muestra exactamente lo que aparecerá en el escenario
.

**Pregunta:** En la selección de canales no aparece ningún canal, sino un
campo de texto para introducir un identificador.

Respuesta: No se ha podido acceder a la lista de canales de noticias. Vuelve a cargar el cuadro de diálogo.
Si eso no funciona, introduce el identificador del canal manualmente; la encontrará
en la dirección del canal en el CMS.

**Pregunta:** ¿Por qué la imagen de una noticia en el escenario aparece borrosa o
recortada de forma extraña?

Respuesta: Las imágenes de las noticias están recortadas para el formato de feed, no para un
escenario que ocupa toda la pantalla. En la entrada, en **Sobrescribir imagen del escenario
**, añade una propia, en formato apaisado y con un ancho mínimo de 1920 píxeles.

**Pregunta:** ¿Qué ocurre con el escenario al traducir automáticamente la
página?

Respuesta: Se traducen todos los textos escritos por ti mismo: el título,
el subtítulo, el texto del botón y la descripción de la imagen de una diapositiva,
así como el título sobrescrito y el texto de una entrada de noticias.
Las imágenes, los enlaces, los canales, los filtros y el orden permanecen sin cambios.

**Pregunta:** Una entrada de noticias muestra en la página traducida textos diferentes a los del
idioma original; ¿se trata de un error?

Respuesta: No. El título y el texto de resumen de una entrada de noticias proceden de la propia entrada,
y se muestran en el idioma que el lector haya configurado en la aplicación. Solo se traduce lo que hayas escrito en la propia entrada.
Si falta una versión lingüística de la entrada, aparece la disponible, en lugar de
dejar la diapositiva en blanco.

**Pregunta:** He seleccionado «Antes de la ruta de navegación», pero no cambia nada.

Respuesta: La configuración solo se aplica si se cumplen tres condiciones: la página tiene
una barra de navegación, la barra está situada en la parte superior de la página y
no hay ningún otro contenido por encima de ella. Si no se cumple alguna de estas condiciones, la
escena debajo de la ruta de navegación; una ruta de navegación en el centro de la página sería
peor que no haber realizado ningún cambio. En el editor, en este caso aparece una nota
encima de la escena. En la página publicada no aparece; allí
no se puede modificar la configuración.

**Pregunta:** Antes había una franja blanca encima del escenario. ¿Dónde está?

Respuesta: La sección en la que se encuentra el escenario mantiene un
espacio interior por encima de su primer bloque. Sobre un texto esto es correcto, pero sobre un escenario
se crea así una franja blanca entre el menú o la ruta de navegación y la imagen. El escenario
compensa este espacio por sí mismo en cuanto se sitúa en la parte superior. Si hay
otro bloque encima de él, el espacio se mantiene tal y como lo establece la página.

**Pregunta:** He seleccionado «Ninguno» en **Espacio inferior**, pero debajo del escenario
sigue habiendo espacio.

Respuesta: «Ninguno» elimina el espacio con respecto al siguiente bloque de la misma
sección. Si el escenario es el último bloque de su sección, la
sección termina de todos modos con él. El espacio que queda entonces es el espacio interior
de la sección siguiente —le pertenece a esta y se puede modificar en sus
ajustes de sección. Si el contenido siguiente se encuentra en la misma sección
que la diapositiva, con la opción «Ninguno» se une directamente a ella.

**Pregunta:** Sin controles de navegación, ¿cómo se pasa de una diapositiva a otra?

Respuesta: Deslizando el dedo, con las teclas de flecha o de forma automática:
el tiempo configurado por diapositiva sigue sin cambios. En cuanto al teclado, la
propia escena se puede seleccionar en cuanto faltan los controles.

**Pregunta:** ¿Dónde están la altura, el ancho completo y los segundos por diapositiva? En el
cuadro de diálogo de Staffbase ya no los encuentro.

Respuesta: Se encuentran en el editor, a la derecha, en el panel **Widget**: Altura, Ancho completo,
Posición y Distancia inferior en **Diseño**, segundos por diapositiva y
elementos de control, en **Comportamiento**. Así, al pulsar **Cancelar**, se
deshacen los cambios. Lo que estaba configurado anteriormente sigue vigente hasta que lo
modifique allí.

**Pregunta:** En el panel **Widget** aparece «Como antes». ¿Qué se aplica?

Respuesta: La configuración que ya tenía el bloque. El editor no ha podido leerla correctamente
del campo anterior y, por eso, no muestra ningún valor predeterminado que
quizá ni siquiera sea válido. En cuanto seleccione algo allí y lo aplique, se aplicará
su elección.
