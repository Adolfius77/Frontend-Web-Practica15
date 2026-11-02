## Preguntas

¿por qué el 404 sí tiene encabezado y pie?
Porque la ruta * está dentro de la ruta del Layout. El 404 se pinta en el Outlet, así que el encabezado y el pie se quedan donde estaban.

¿qué cambia en la pestaña Red si usas <a "href"> en lugar de Link?
Con <a href> se recarga toda la página y se vuelven a descargar el documento, el JS y el CSS. Con Link no se recarga nada y solo aparecen las peticiones que necesita la nueva página, como las de la api.

¿en qué tipo de dato llega el id de la URL y qué pasa si no lo conviertes?
Llega como texto. Si no lo conviertes, TypeScript marca error porque useClase espera un número, y comparaciones como "1" === 1 dan falso.

¿qué pasa al ir de /clases/1 a /clases/2 si el id no está en las dependencias del efecto?
La url cambia, pero se sigue viendo la clase 1. El componente no se vuelve a montar y, como el efecto no sabe que cambió el id, no pide la clase nueva.
