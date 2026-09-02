# Escenarios

| Ambientación | Descripción |
| --- | --- |
| Entradas | El contenido del escenario: diapositivas propias, artículos de noticias individuales y canales enteros de noticias. Mantenido a través del editor, que se muestra cuando se abren los ajustes. El campo de texto que aparece abajo es la versión preliminar y no necesita ser tocado. |
| Altura | 'Default (420-560 px)' está predefinido. Al lado 'Bajo (320-420 px)', 'Alto (560-720 px)' y 'Pantalla alto'. |
| Mostrar ancho completo | Cuando está activada (por defecto), la imagen recorre todo el ancho de la ventana, mientras el texto permanece en la línea que desaparece de la página. Cuando está desactivada, la Etapa permanece en la columna de contenido. |
| segundos por diapositiva | '5' es el valor predeterminado. '0' detiene el escenario; entonces solo se desplazan flechas y guiones. Máximo 30. |

## Tipos de entradas

| Variedad | Descripción |
| --- | --- |
| Diapositiva | Una diapositiva mantenida a mano: imagen, titular, sublínea, botón. |
| Entrada de noticias | Una publicación específica como diapositiva. El contenido y el objetivo provienen de la publicación. |
| Canal de Noticias | Un canal completo, una diapositiva por publicación. Aparecen nuevas publicaciones sin más acción. |

Los tres están en la misma lista, se pueden mezclar y combinar mediante **↑** y
**↓** . En total, el escenario muestra un máximo de ocho diapositivas — una
La entrada del canal cuenta con todas las diapositivas que él contribuye. 

## Campos de un tobogán

| Campo | Descripción |
| --- | --- |
| Imagen | Obligatorio. Paisaje, al menos 1920 px de ancho. Sin imagen, la diapositiva no se mostrará. |
| Descripción de la imagen | Lo que se puede ver en la imagen. Deja en blanco solo imágenes puramente decorativas — los lectores de pantalla leen este campo. |
| Imagen para formato retrato | Opcional. Se muestra en pantallas estrechas y fijas. Si falta, el recorte de paisaje se utiliza en todas partes. |
| Encabezado | Está escrito en mayúsculas. Hasta unos 24 caracteres, permanece a un solo espacio. |
| Sublínea | Opcional, una o dos líneas. |
| Botón | Opcional. Solo aparece si el pie de foto y el destino están llenos. Como mucho uno por diapositiva. |
| Abrir en una pestaña nueva | Abre el objetivo del botón en una pestaña nueva. Común para objetivos externos. |

## Campos de un artículo de noticias

| Campo | Descripción |
| --- | --- |
| Canal | Obligatorio. Determina qué publicaciones están disponibles para elegir. |
| Publicación | Deber. Las cincuenta publicaciones más recientes del canal, la más reciente primero. |
| Sobrescribir titular | Opcional. Deja en blanco para reemplazar el título de la publicación. |
| Mostrar adelanto como sublínea | Activado por defecto. El adelanto se acortará a 240 caracteres. |
| Etiqueta del botón | 'Más información' por defecto. Deja en blanco para omitir el botón; el objetivo siempre es la publicación. |
| Sobrescribir Diseño de Escenario | Opcional. Útil si la imagen destacada está demasiado ajustada para el escenario. |
| Imagen retrato | Opcional. Mostrado en pantallas estrechas y fijas. |

## Campos de un canal de noticias

| Campo | Descripción |
| --- | --- |
| Canal | Obligatorio. Todas las diapositivas de esta entrada son de este canal. |
| Número de diapositivas | '3' por defecto, máximo ocho. |
| Orden | 'El más nuevo primero' (por defecto) o 'El más antiguo primero'. |
| Solo publicaciones destacadas | Desactivado por defecto. Limitado a lo que esté fijado en las noticias. |
| Solo publicaciones con imagen | Activado por defecto. Sin imagen, lo único que quedaría de la diapositiva sería una zona oscura con texto. |
| Etiquetas | Opcionales, varias separadas por coma. Un poste es suficiente si lleva una de ellas. |
| Mostrar adelanto como sublínea | Activado por defecto. |
| Etiqueta de botón | Se aplica a todas las diapositivas del canal. Deja en blanco para omitir el botón. |

## Notas

- **La altura** actúa como un límite, no como una altura fija: el escenario está en ancho
  pantallas 21:9 y en el estrecho 4:3 y solo se usa en los límites de la
  Paso seleccionado. 
- 'Screen-up' llena la página visible menos el encabezado, 
  Pero al menos 420 px. 
- **Segundos por diapositiva** solo se aplica a partir de la segunda diapositiva. 
- Si tienes configurado "Reducir movimiento" en el sistema operativo, no verás ninguna
  Cambiar por sí solo, independientemente de este escenario. 
- Los controles solo aparecen en la segunda diapositiva. En el estrecho
  pantallas, las flechas están ocultas; hay deslizamiento. 
- Una publicación que haya sido eliminada o no visible para la persona que lee
  solo se lleva consigo su propio florete. Los contrapuntos restantes permanecen en su lugar. 
- Las diapositivas de noticias siguen el lenguaje de la persona que lee, siempre que el artículo sea
  se traduce; por lo demás, la primera versión disponible. 
- La **previsualización** en el editor calcula con las mismas reglas que la
  página publicada. Lo que no está ahí también aparece en el escenario
  no.