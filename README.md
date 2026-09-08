# IIA Hub

Página interna para estudiantes de Ingeniería en Inteligencia Artificial: plan de estudios, correlativas, calendario, PPS, intercambios, novedades y recursos útiles.

Es un sitio estático hecho con **Jekyll**, pensado para publicarse gratis con **GitHub Pages** sin necesidad de instalar nada ni correr un build manual: GitHub lo compila solo.

## Estructura

```
iia-hub/
├── _config.yml                    # configuración del sitio (título, etc)
├── _layouts/
│   ├── default.html               # plantilla base (sidebar + header + footer)
│   ├── home.html                  # portada: hero + tiles + últimas novedades
│   ├── novedades.html             # lista de novedades
│   ├── plan-de-estudios.html      # arma el mapa de correlativas y las tablas del plan
│   └── recursada.html             # arma la tabla de incompatibilidades
├── _includes/nav.html             # menú de navegación (un solo lugar para editarlo)
├── _data/
│   ├── home.yml                   # textos y tiles de la portada
│   ├── novedades.yml              # entradas de la página Novedades
│   ├── materias.yml               # plan de estudios: materias, códigos, correlativas
│   ├── optativas.yml              # listado de materias optativas pre-aprobadas
│   └── incompatibilidades.yml     # incompatibilidades de horario para recursantes
├── assets/css/styles.css
├── assets/js/main.js
├── index.md                       # Inicio
├── plan-de-estudios.md
├── recursada.md
├── calendario.md
├── faq.md
├── pps.md
├── intercambios.md
├── novedades.md
└── recursos.md
```

### Cómo se compila

Cada página es un archivo **Markdown puro** (`.md`): sólo tiene un encabezado `---` (front
matter, con `title` / `eyebrow` / `permalink` / `layout`) y después texto Markdown - sin HTML
ni etiquetas Liquid en el cuerpo. Al publicar, **Jekyll convierte el Markdown a HTML** y lo
inyecta dentro del `layout` que indica el front matter. No hay que generar nada a mano.

Toda la parte visual vive fuera del contenido:

| Dónde | Qué hay ahí |
|-------|-------------|
| `_layouts/*.html` | La estructura de cada tipo de página (sidebar, header, grillas, y los bucles que arman las tablas). |
| `_data/*.yml` | Los datos: materias, optativas, incompatibilidades, y los tiles/textos de la portada. |
| `assets/css/styles.css` | El estilo. Incluye una sección que da formato al HTML "desnudo" que sale del Markdown (títulos, listas, tablas y `> citas`, que se ven como recuadros). |

- Un recuadro destacado en una página se escribe como cita Markdown: una o más líneas que
  empiezan con `> `.
- Las páginas **Plan de estudios** y **Si recursás una materia** usan un layout propio
  (`_layouts/plan-de-estudios.html` y `_layouts/recursada.html`) que genera las tablas desde
  `_data/`. El `.md` sólo tiene la nota introductoria.
- La portada (`index.md`) usa `_layouts/home.html`; el hero y los seis tiles se editan en
  `_data/home.yml`.

Las tablas de **Plan de estudios** y **Si recursás una materia** se generan automáticamente a partir de los archivos en `_data/`. Para actualizarlas, alcanza con editar esos `.yml` - no hace falta tocar la página.

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

- **Materias y correlativas**: editar `_data/materias.yml`.
- **Optativas**: editar `_data/optativas.yml`.
- **Incompatibilidades de recursada**: editar `_data/incompatibilidades.yml` (ver la skill `horarios-iia` para recalcularlas si cambia la programación de horarios).
- **Texto de cualquier página**: abrir el `.md` correspondiente y editar el Markdown. Es sólo texto: párrafos, `## títulos`, listas con `-`, `[links](destino.html)`, tablas y `> recuadros`.
- **Hero y tiles de la portada**: `_data/home.yml`.
- **Menú de navegación**: `_includes/nav.html`.
- **Colores y estilo**: `assets/css/styles.css` (las variables están arriba de todo, en `:root`).

## Contenido pendiente

Algunas respuestas del FAQ y algunas fechas del calendario todavía están marcadas como
`_(a completar)_` porque no teníamos la info real al armar el sitio. Buscá esa marca para
encontrar lo que falta cargar. Las novedades de `_data/novedades.yml` también son de ejemplo.

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
