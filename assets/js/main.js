// IIA Hub - comportamiento compartido entre páginas
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector(".menu-btn");
  const sidebar = document.querySelector(".sidebar");

  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (
        sidebar.classList.contains("open") &&
        !sidebar.contains(e.target) &&
        !menuBtn.contains(e.target)
      ) {
        sidebar.classList.remove("open");
      }
    });
  }

  initMalla();
  initOptativasFilter();
  initCalendarioAnio();
});

// Vista de calendario completo (12 meses) para calendario.html.
// Lee el JSON embebido en #calendario-eventos-data y pinta cada día con su
// categoría; el detalle sale por tooltip (CSS, vía atributo data-tip).
function initCalendarioAnio() {
  const cont = document.getElementById("calendario-anio");
  const dataEl = document.getElementById("calendario-eventos-data");
  if (!cont || !dataEl) return;

  let data;
  try {
    data = JSON.parse(dataEl.textContent);
  } catch (e) {
    cont.textContent = "No se pudo cargar el calendario.";
    return;
  }

  const anio = data.anio || new Date().getFullYear();
  const PRIORIDAD = ["feriado", "examenes", "receso", "administrativo", "hito"];
  const MESES = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  const DIAS = ["L", "M", "X", "J", "V", "S", "D"];

  const toKey = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  // Arma un mapa "YYYY-MM-DD" -> [{ categoria, titulo }] expandiendo los rangos.
  const porDia = {};
  (data.eventos || []).forEach((ev) => {
    (ev.rangos || []).forEach((r) => {
      const fin = new Date(`${r.fin}T00:00:00`);
      for (let d = new Date(`${r.inicio}T00:00:00`); d <= fin; d.setDate(d.getDate() + 1)) {
        const key = toKey(d);
        (porDia[key] = porDia[key] || []).push({ categoria: ev.categoria, titulo: ev.titulo });
      }
    });
  });

  function categoriaPrincipal(items) {
    for (let i = 0; i < PRIORIDAD.length; i++) {
      if (items.some((it) => it.categoria === PRIORIDAD[i])) return PRIORIDAD[i];
    }
    return items[0].categoria;
  }

  const escapar = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

  let html = "";
  for (let mes = 0; mes < 12; mes++) {
    const diasEnMes = new Date(anio, mes + 1, 0).getDate();
    const offset = (new Date(anio, mes, 1).getDay() + 6) % 7; // 0 = lunes

    html += `<div class="cal-month"><div class="cal-month-title">${MESES[mes]}</div><div class="cal-grid">`;
    DIAS.forEach((d) => (html += `<div class="cal-dow">${d}</div>`));
    for (let i = 0; i < offset; i++) html += `<div class="cal-day is-empty"></div>`;

    for (let dia = 1; dia <= diasEnMes; dia++) {
      const key = `${anio}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
      const items = porDia[key];
      const esDomingo = new Date(anio, mes, dia).getDay() === 0;
      const domingoClase = esDomingo ? " is-sunday" : "";
      if (items && items.length) {
        const cat = categoriaPrincipal(items);
        const tip = escapar(items.map((it) => it.titulo).join(" · "));
        html += `<div class="cal-day has-event cat-${cat}${domingoClase}" tabindex="0" data-tip="${tip}">${dia}</div>`;
      } else {
        html += `<div class="cal-day${domingoClase}">${dia}</div>`;
      }
    }
    html += `</div></div>`;
  }

  cont.innerHTML = html;
}

// Mapa de correlativas.
// - Clic (o Enter/Espacio) sobre una materia: la marca / desmarca como "aprobada".
// - Con al menos una aprobada, se resaltan las materias que ya podés cursar
//   (tenés todas sus correlativas aprobadas).
// - Mouse encima de una materia que todavía no podés cursar: resalta las correlativas
//   que le faltan (las que necesita y no aprobaste).
// - Mouse encima de una materia que sí podés cursar (o que ya aprobaste): resalta las
//   materias que la necesitan a ella como correlativa.
function initMalla() {
  const malla = document.getElementById("malla");
  if (!malla) return;

  const cards = Array.from(malla.querySelectorAll(".materia-card"));
  const cols = Array.from(malla.querySelectorAll(".malla-col"));
  const approved = new Set();
  const resetBtn = document.getElementById("malla-reset");
  const countEl = document.getElementById("malla-count");

  const prereqsOf = (c) =>
    (c.dataset.prereqs || "").split(",").map((s) => s.trim()).filter(Boolean);

  const codesIn = (col) =>
    Array.from(col.querySelectorAll(".materia-card"))
      .map((c) => c.dataset.code)
      .filter(Boolean);

  function recompute() {
    const hasSel = approved.size > 0;
    malla.classList.toggle("has-selection", hasSel);

    let disponibles = 0;
    cards.forEach((c) => {
      c.classList.remove("is-approved", "can-take", "locked");
      const code = c.dataset.code;
      if (!code) return;

      if (approved.has(code)) {
        c.classList.add("is-approved");
        c.setAttribute("aria-pressed", "true");
        return;
      }
      c.setAttribute("aria-pressed", "false");

      const pr = prereqsOf(c);
      const listo = pr.every((p) => approved.has(p));
      if (listo) {
        c.classList.add("can-take");
        disponibles++;
      } else if (hasSel) {
        c.classList.add("locked");
      }
    });

    if (countEl) {
      countEl.textContent = hasSel
        ? `${approved.size} aprobadas · ${disponibles} para cursar`
        : "";
    }
    if (resetBtn) resetBtn.hidden = !hasSel;

    cols.forEach((col) => {
      const btn = col.querySelector(".malla-col-toggle");
      if (!btn) return;
      const codes = codesIn(col);
      const allDone = codes.length > 0 && codes.every((c) => approved.has(c));
      btn.textContent = allDone ? "Desmarcar todo" : "Marcar todo";
      btn.classList.toggle("is-all", allDone);
      btn.hidden = codes.length === 0;
    });
  }

  function clearRelated() {
    cards.forEach((c) => c.classList.remove("hl-dependent", "hl-missing"));
  }

  function markRelated(card, on) {
    const code = card.dataset.code;
    if (!code) return;
    clearRelated();
    card.classList.toggle("hl-hovered", on);
    if (!on) return;

    // Siempre mostrar, sin importar si ya la puede cursar o la aprobó: en ámbar
    // las correlativas que necesita, y en coral las materias que la necesitan a ella.
    const pr = prereqsOf(card);
    cards.forEach((c) => {
      if (pr.includes(c.dataset.code)) c.classList.add("hl-missing");
      if (prereqsOf(c).includes(code)) c.classList.add("hl-dependent");
    });
  }

  function toggle(card) {
    const code = card.dataset.code;
    if (!code) return;
    if (approved.has(code)) approved.delete(code);
    else approved.add(code);
    recompute();
  }

  cards.forEach((card) => {
    if (!card.dataset.code) return;
    card.addEventListener("click", () => toggle(card));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle(card);
      }
    });
    card.addEventListener("mouseenter", () => markRelated(card, true));
    card.addEventListener("mouseleave", () => markRelated(card, false));
    card.addEventListener("focus", () => markRelated(card, true));
    card.addEventListener("blur", () => markRelated(card, false));
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      approved.clear();
      recompute();
    });
  }

  cols.forEach((col) => {
    const btn = col.querySelector(".malla-col-toggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const codes = codesIn(col);
      const allDone = codes.length > 0 && codes.every((c) => approved.has(c));
      codes.forEach((c) => (allDone ? approved.delete(c) : approved.add(c)));
      recompute();
    });
  });

  recompute();
}

// Filtro de la tabla de optativas por área, orientación y semestre en que se dicta.
function initOptativasFilter() {
  const tabla = document.getElementById("optativas-tabla");
  if (!tabla) return;

  const selArea = document.getElementById("filtro-area");
  const selOri = document.getElementById("filtro-orientacion");
  const selSem = document.getElementById("filtro-semestre");
  const countEl = document.getElementById("optativas-count");
  const rows = Array.from(tabla.querySelectorAll("tbody tr"));

  function apply() {
    const area = selArea ? selArea.value : "";
    const ori = selOri ? selOri.value : "";
    const sem = selSem ? selSem.value : "";
    let visibles = 0;

    rows.forEach((r) => {
      const okArea = !area || r.dataset.area === area;
      const okOri = !ori || r.dataset.orientacion === ori;
      const okSem = !sem || r.dataset.semestre === sem;
      const show = okArea && okOri && okSem;
      r.hidden = !show;
      if (show) visibles++;
    });

    if (countEl) {
      countEl.textContent = `${visibles} ${visibles === 1 ? "materia" : "materias"}`;
    }
  }

  if (selArea) selArea.addEventListener("change", apply);
  if (selOri) selOri.addEventListener("change", apply);
  if (selSem) selSem.addEventListener("change", apply);
  apply();
}
