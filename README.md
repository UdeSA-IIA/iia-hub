# IIA Hub

Página interna para estudiantes de Ingeniería en Inteligencia Artificial: plan de estudios, correlativas, calendario, PPS, intercambios, novedades y recursos útiles.

Es un sitio estático hecho con **Jekyll**, pensado para publicarse gratis con **GitHub Pages** sin necesidad de instalar nada ni correr un build manual: GitHub lo compila solo.

## Estructura

```
iia-hub/
├── _config.yml                    # configuración del sitio (título, etc)
├── _layouts/
│   ├── default.html               # plantilla base (sidebar + header + footer) - estructura
│   ├── home.html                  # portada
│   ├── novedades.html             # lista de novedades
│   ├── faq.html                   # acordeón de preguntas frecuentes
│   ├── pps.html
│   ├── intercambios.html
│   ├── trabajo-de-graduacion.html
│   ├── plan-de-estudios.html      # arma el mapa de correlativas
│   ├── optativas.html             # tabla de optativas con filtros (subsección, página propia)
│   └── tarjetas.html              # layout genérico de "secciones de tarjetas": lo usan
│                                   # recursos.html, equipo.html y clubes.html - cada uno lee
│                                   # su _data/<nombre>.json automáticamente
├── _includes/nav.html             # menú de navegación (un solo lugar para editarlo)
├── _data/                         # todo el contenido del sitio, en JSON
│   ├── home.json                  # textos y tiles de la portada
│   ├── novedades.json             # entradas de Novedades + el cartel de abajo
│   ├── faq.json                   # secciones y preguntas/respuestas
│   ├── pps.json
│   ├── intercambios.json
│   ├── recursos.json              # secciones: Contactos, Documentos, Programas
│   ├── equipo.json                # sección: Equipo de la carrera
│   ├── clubes.json                # sección: Clubes estudiantiles
│   ├── trabajo-de-graduacion.json
│   ├── plan-de-estudios.json      # sólo los textos de esa página (el resto es Liquid)
│   ├── optativas-page.json        # textos de la página Optativas
│   ├── calendario.json            # textos + "otras fechas" sin día puntual
│   ├── calendario_eventos.json    # eventos con fecha, para la vista de calendario
│   ├── materias.json              # plan de estudios: materias, códigos, correlativas
│   └── optativas.json             # listado de materias optativas pre-aprobadas
├── assets/css/styles.css
├── assets/js/main.js
├── index.html                     # Inicio
├── plan-de-estudios.html
├── optativas.html
├── calendario.html
├── faq.html
├── pps.html
├── intercambios.html
├── novedades.html
├── recursos.html
├── equipo.html
├── clubes.html
└── trabajo-de-graduacion.html
```

### Cómo se compila

El sitio separa **estructura** de **contenido**, y no mezcla formatos: la estructura vive
entera en `.html` (`_layouts/`, `_includes/`), el contenido vive entero en `.json` (`_data/`).
No hace falta entender HTML para cambiar un texto.

- **Los `.html` de la raíz** (`pps.html`, `faq.html`, etc.) están vacíos: sólo tienen el
  encabezado `---` (front matter) con `layout`, `title`, `eyebrow`, `description` y
  `permalink`. No tienen contenido - son la "ficha" que le dice a Jekyll qué layout usar y en
  qué URL publicarla.
- **`_layouts/<página>.html`** tiene el HTML/Liquid de esa página: lee su `_data/<página>.json`
  y arma el marcado (tarjetas, acordeones, tablas). Esto no se edita para cambiar texto, sólo
  para cambiar el diseño.
- **`_data/<página>.json`** tiene todo el texto de esa página: títulos, párrafos, listas,
  tarjetas, preguntas y respuestas. Los strings pueden llevar sintaxis Markdown adentro
  (`**negrita**`, `[link](url)`) - el layout los pasa por el filtro `markdownify` de Jekyll,
  así que se siguen viendo como negrita/link aunque el archivo sea JSON.
- **`_data/materias.json`**, **`optativas.json`** y **`calendario_eventos.json`** son los datos
  "de verdad" (no textos sueltos, sino tablas relacionadas entre sí) que alimentan el mapa de
  correlativas, los filtros de optativas y el calendario coloreado.
- **Optativas** es conceptualmente una subsección de Plan de estudios, pero vive en su propia
  página (`optativas.html`) para no ocupar todo el espacio de esa página con una tabla larga.
  Plan de estudios enlaza a ella con una tarjeta.
- Las etiquetas fijas de la interfaz (encabezados de tabla, la leyenda del mapa de
  correlativas, el texto de botones como "Marcar todo") quedan escritas en el `_layouts/*.html`
  correspondiente, porque están atadas 1 a 1 al JS/CSS de esa función - no son "contenido" que
  se edite sin tocar también el comportamiento.

| Querés cambiar... | Editá... |
|---|---|
| El texto de una página (párrafos, tarjetas, preguntas) | `_data/<página>.json` |
| Las materias y correlativas | `_data/materias.json` |
| Las optativas | `_data/optativas.json` |
| Los eventos del calendario (fechas, categoría) | `_data/calendario_eventos.json` |
| El diseño/maquetación de una página | `_layouts/<página>.html` |
| El menú de navegación | `_includes/nav.html` |
| Colores y estilo | `assets/css/styles.css` (variables en `:root`) |

## Cómo publicarlo en GitHub Pages (paso a paso)

1. **Creá el repositorio en GitHub**
   - Andá a [github.com/new](https://github.com/new), elegí un nombre (ej: `iia-hub`) y creálo (puede ser público o privado - con privado hace falta un plan de pago para Pages).

2. **Subí este código**
   Desde la carpeta `iia-web/`:
   ```bash
   cd iia-web
   git init
   git add .
   git commit -m "Primera versión del sitio IIA Hub"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
   git push -u origin main
   ```

3. **Activá GitHub Pages**
   - En el repo, andá a **Settings → Pages**.
   - En "Build and deployment" → **Source**, elegí **Deploy from a branch**.
   - Elegí la branch **main** y la carpeta **/ (root)**.
   - Guardá. En unos minutos el sitio va a estar publicado en:
     `https://TU-USUARIO.github.io/TU-REPO/`

4. **Ajustá el `baseurl`**
   - Abrí `_config.yml` y poné en `baseurl` el nombre del repo con una barra adelante, ej: `baseurl: "/iia-hub"`.
   - Hacé commit y push de ese cambio para que todos los links internos funcionen bien.

   > Si en cambio publicás en un repo que se llama `TU-USUARIO.github.io` (sitio de usuario), dejá `baseurl: ""` tal como está.

5. **Listo.** Cada vez que hagas push a `main`, GitHub recompila el sitio automáticamente (tarda 1-2 minutos).

## Cómo editar contenido sin tocar código

Abrí el `.json` de `_data/` que corresponda (ver la tabla de arriba) y editá los valores de
texto - son pares `"clave": "valor"`, no hace falta saber programar.

Un detalle de formato: JSON no permite comas después del último elemento de una lista, y todo
string va entre comillas dobles (`"así"`). Si al guardar el build falla, seguramente sea eso -
cualquier validador de JSON online lo detecta al toque.

## Contenido pendiente

Algunas respuestas del FAQ y algunas fechas del calendario todavía están marcadas como
`(a completar)` porque no teníamos la info real al armar el sitio. Buscá esa marca para
encontrar lo que falta cargar. Las novedades de `_data/novedades.json` también son de ejemplo.
Los mails de Director/Co-Director/Coordinador en `_data/equipo.json` también están como
`(mail a completar)`.

## Probarlo en tu computadora (opcional)

GitHub Pages compila el sitio solo al hacer push, así que esto es opcional. Si querés verlo
antes de publicar, hay dos formas. En ambas el sitio queda en
**`http://localhost:4000/iia-hub/`** (con el `/iia-hub/` del `baseurl`) y se recompila solo
cada vez que guardás un archivo.

### Opción A - con Docker (no hace falta instalar Ruby)

```bash
docker run --rm -p 4000:4000 -v "$PWD":/srv/jekyll -it jekyll/jekyll:4 \
  jekyll serve --force_polling --host 0.0.0.0
```

### Opción B - con Ruby local

Una sola vez, instalá las herramientas de compilación y Bundler:

```bash
sudo apt install ruby-dev build-essential   # Debian/Ubuntu
gem install --user-install bundler
```

Y después, desde la carpeta del proyecto:

```bash
bundle install        # una sola vez (usa el Gemfile)
bundle exec jekyll serve
```

Para verlo sin el prefijo `/iia-hub/`, agregá `--baseurl ""` al comando `serve` y entrá a
`http://localhost:4000/`.
