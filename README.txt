THRASH WEBSITE
==============

ARCHIVOS
- index.html: estructura y contenido (comentado por secciones).
- styles.css: diseño, animaciones y responsive (índice al inicio del archivo).
- script.js: menú, animaciones, filtros, ventana de proyectos, formulario y botones.
- pitch.pdf: documento de identidad (proyecto 2).
- videos/: spots en MP4 (proyectos 1 y 5).
- images/: logo, hero 3D, mascota, fotos del equipo y miniaturas de proyectos.

CÓMO ABRIR
Abre la carpeta en Visual Studio Code y usa Live Server sobre index.html.
(Los videos y el PDF necesitan Live Server o un servidor; abiertos con doble clic
 pueden no cargar en algunos navegadores.)

ÍCONO DE LA PESTAÑA
images/favicon.png y favicon.ico (la "T" de THRASH sobre círculo morado).

MASCOTA
images/mascota-thrash.png (PNG transparente). Se usa en el hero (esquina inferior derecha).
Su posición y tamaño están en styles.css, bloque ".hero-mascot".

PROYECTOS (index.html > sección PROYECTOS)
Cada tarjeta es un <button class="project-card"> con atributos data-*:
- data-title, data-type, data-description: textos de la ventana.
- data-image: miniatura de la tarjeta (y foto de la ventana si no hay video/PDF).
- data-video: ruta de un MP4 -> la ventana reproduce el video.
- data-pdf: ruta de un PDF -> la ventana muestra el documento.
Para agregar un proyecto, copia una tarjeta. La cuadrícula se acomoda sola
para no dejar huecos (si la cantidad es impar, la primera tarjeta ocupa todo el ancho).

EQUIPO (7 integrantes)
- Fotos: images/team/ (daniela, manuela, mateo, roger, thomas, lanza, bleider .jpg)
- Cada foto es un enlace: cambia el href de cada <a class="team-photo"> por el link real.

CONTACTO (script.js > CONFIG)
- whatsappNumber, instagramUrl y tiktokUrl.
- En index.html cambia hola@thrash.com y la ubicación.
