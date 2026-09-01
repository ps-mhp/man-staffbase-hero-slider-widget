# Ajustes

| Ajuste | Descripción |
| --- | --- |
| Diapositivas | Imágenes, textos y botones del escenario. Se gestionan mediante el editor de diapositivas, que aparece automáticamente al abrir la configuración. El campo de texto que hay debajo es el borrador y no es necesario modificarlo. |
| Altura | `Estándar (420–560 px)` es el valor predeterminado. Junto a él, `Baja (320–420 px)`, `Alta (560–720 px)` y `Altura de pantalla`. |
| Mostrar a ancho completo | Si está activado (ajuste predeterminado), la imagen ocupa todo el ancho de la ventana, mientras que el texto se mantiene alineado con el borde de la página. Si está desactivado, el escenario permanece en la columna de contenido. |
| Segundos por diapositiva | El valor predeterminado es `5`. Si se establece en `0`, el escenario se detiene y solo se puede avanzar mediante flechas y líneas. Máximo 30. |

## Campos de una diapositiva

| Campo | Descripción |
| --- | --- |
| Imagen | Obligatorio. Horizontal, con un ancho mínimo de 1920 píxeles. Si no hay imagen, no se muestra la diapositiva. |
| Descripción de la imagen | Lo que se ve en la imagen. Déjalo en blanco solo si se trata de imágenes puramente decorativas; los lectores de pantalla leen este campo en voz alta. |
| Imagen para formato vertical | Opcional. Se muestra en pantallas estrechas y verticales. Si falta, se utilizará el recorte horizontal en todas partes. |
| Título | Se escribe en mayúsculas. Hasta unos 24 caracteres, se mantiene en una sola línea. |
| Subtítulo | Opcional, de una a dos líneas. |
| Botón | Opcional. Solo aparece si se han rellenado el texto y el destino. Como máximo uno por diapositiva. |
| Abrir en una nueva pestaña | Abre el destino del botón en una nueva pestaña. Habitual para destinos externos. |

## Notas

- **Altura** actúa como límite, no como altura fija: el escenario se ajusta a pantallas anchas
  de 21:9 y a pantallas estrechas de 4:3, y solo se ajusta a los límites del
  nivel seleccionado.
- `Altura de pantalla` ocupa toda la parte visible de la pantalla, descontando el encabezado,
  pero con un mínimo de 420 px.
- **Segundos por diapositiva** solo se aplica a partir de la segunda diapositiva.
- Quien tenga configurada la opción «Reducir movimiento» en el sistema operativo no verá
  el cambio por sí mismo, independientemente de esta configuración.
- Los controles solo aparecen a partir de la segunda diapositiva. En pantallas estrechas,
  las flechas están ocultas; en ese caso, se desliza el dedo.
