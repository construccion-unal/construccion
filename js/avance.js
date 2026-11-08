/* ==============================================================================
   PORTAL WEB OFICIAL · CONSTRUCCIÓN · FACULTAD DE ARQUITECTURA · UNAL MEDELLÍN
   MÓDULO MI AVANCE — Interfaz y Lógica de Progreso
   Lee la historia académica guardada en localStorage (construccion.avance.v1),
   dibuja la pantalla de avance del estudiante: nivel, proyección de graduación,
   mapa de semestres (Ruta), misiones por componente y bitácora académica.
   Plan 3503 · 180 créditos exigidos · Todos los derechos reservados © 2026.
   ============================================================================== */

(() => {
  'use strict';

  const CLAVE_GUARDADO = 'construccion.avance.v1';

  // Helpers seguros
  const $ = (sel, r = document) => (typeof window.$ === 'function' ? window.$(sel, r) : r.querySelector(sel));
  const $$ = (sel, r = document) => (typeof window.$$ === 'function' ? window.$$(sel, r) : [...r.querySelectorAll(sel)]);
  const esc = (t) => (typeof window.esc === 'function' ? window.esc(t) : String(t ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]));
  const clavePeriodo = (p) => (typeof window.clavePeriodo === 'function' ? window.clavePeriodo(p) : (p && p.anio && p.num ? p.anio * 10 + p.num : 0));
  const etiquetaPeriodo = (p) => (typeof window.etiquetaPeriodo === 'function' ? window.etiquetaPeriodo(p) : (p && p.anio && p.num ? `${p.anio}-${p.num}S` : ''));

  const guardado = {
    leer() {
      try {
        return JSON.parse(localStorage.getItem(CLAVE_GUARDADO)) || null;
      } catch {
        return null;
      }
    },
    escribir(datos) {
      try {
        localStorage.setItem(CLAVE_GUARDADO, JSON.stringify(datos));
        return true;
      } catch {
        return false;
      }
    },
    borrar() {
      try {
        localStorage.removeItem(CLAVE_GUARDADO);
        return true;
      } catch {
        return false;
      }
    },
  };

  const estado = {
    texto: '',
    nombre: '',
    ritmo: null,
    historia: null,
    avance: null,
    pestana: 'ruta',
  };

  const GRUPOS_COMPONENTE = {
    fundamentacion: { nombre: 'Fundamentación', color: 'var(--fundamentacion, #795446)' },
    disciplinar: { nombre: 'Formación disciplinar o profesional', color: 'var(--disciplinar, #33363B)' },
    libre: { nombre: 'Libre elección', color: 'var(--libre, #94914E)' },
  };

  const formatear = (n, d = 0) =>
    Number(n).toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d });

  /* ---------- Rangos Temáticos de Construcción ---------- */
  const RANGOS_CONSTRUCCION = [
    [1, 'Iniciado en la obra y el dibujo técnico'],
    [10, 'Cadenero(a) y explorador de materiales'],
    [25, 'Auxiliar técnico de campo y estructuras'],
    [45, 'Constructor(a) en formación · Instalaciones y talleres de obra'],
    [65, 'Residente de obra y supervisor técnico'],
    [85, 'Director(a) de proyectos constructivos y hábitat'],
    [100, 'Constructor(a) · Facultad de Arquitectura UNAL'],
  ];

  function rangoNivel(nivel) {
    let r = RANGOS_CONSTRUCCION[0][1];
    RANGOS_CONSTRUCCION.forEach(([desde, nom]) => {
      if (nivel >= desde) r = nom;
    });
    return r;
  }

  function faltanParaSiguienteNivel(avance) {
    if (avance.nivel >= 100 || !avance.exigidos) return null;
    const meta = Math.ceil(((avance.nivel + 1) * avance.exigidos) / 100 - 1e-9);
    return Math.max(1, meta - avance.aprobados);
  }

  /* ---------- Pintado del Jugador / HUD Superior ---------- */
  function pintarJugador(avance, historia) {
    const pasoXp = (avance.aprobados / avance.exigidos) * 100;
    const pasoCurso = Math.min(100 - pasoXp, (avance.inscritos / avance.exigidos) * 100);
    const faltan = faltanParaSiguienteNivel(avance);

    const inglesBadge = historia.inglesAcreditado
      ? `<span class="jugador__ingles jugador__ingles--ok" title="Requisito de idioma extranjero acreditado en el SIA">✓ Inglés acreditado</span>`
      : `<span class="jugador__ingles jugador__ingles--pendiente" title="Requisito de idioma extranjero pendiente en el SIA">⚠ Requisito de inglés pendiente</span>`;

    return `
      <section class="jugador" aria-label="Tarjeta del Estudiante">
        <div class="jugador__avatar">
          <svg class="anillo" viewBox="0 0 120 120" aria-hidden="true">
            <circle class="anillo__pista" cx="60" cy="60" r="54" pathLength="100"></circle>
            <circle class="anillo__curso" cx="60" cy="60" r="54" pathLength="100" style="--ini: ${pasoXp}; --len: ${pasoCurso}"></circle>
            <circle class="anillo__valor" cx="60" cy="60" r="54" pathLength="100" style="--pct: ${pasoXp}"></circle>
          </svg>
          <div class="jugador__escudo-wrap">
            <img src="img/logo-construccion.png" alt="Escudo de Construcción" class="jugador__escudo" width="80" height="80">
          </div>
          <span class="jugador__nivel${String(avance.nivel).length > 2 ? ' jugador__nivel--3' : ''}">
            <small>NIVEL</small><b data-cuenta="${avance.nivel}">${avance.nivel}</b>
          </span>
        </div>

        <div class="jugador__datos">
          <div class="jugador__fila-sup">
            <p class="etiqueta-hud">ESTUDIANTE</p>
            ${inglesBadge}
          </div>
          <label class="jugador__nombre-wrap">
            <span class="visualmente-oculto">Tu nombre</span>
            <input class="jugador__nombre" id="nombre-jugador" type="text" maxlength="40" value="${esc(estado.nombre || historia.nombre || 'Estudiante')}" placeholder="Escribe tu nombre">
          </label>
          <p class="jugador__rango">
            <span class="jugador__rango-texto">${esc(rangoNivel(avance.nivel))}</span>
          </p>
          <p class="jugador__programa">Construcción · Facultad de Arquitectura · UNAL Medellín</p>

          <div class="xp" role="img" aria-label="${avance.aprobados} de ${avance.exigidos} créditos aprobados">
            <div class="xp__barra">
              <span class="xp__relleno" style="--ancho: ${pasoXp}%"></span>
              <span class="xp__curso" style="--inicio: ${pasoXp}%; --ancho: ${pasoCurso}%"></span>
            </div>
            <div class="xp__texto">
              <span><b>${avance.aprobados}</b> / ${avance.exigidos} créditos aprobados</span>
              <span>${formatear(avance.porcentaje, 1)} %</span>
            </div>
          </div>

          ${faltan ? `<p class="xp__siguiente">A <b>${faltan}</b> ${faltan === 1 ? 'crédito' : 'créditos'} del nivel <b>${avance.nivel + 1}</b></p>` : '<p class="xp__siguiente">¡Nivel máximo alcanzado! 100% de créditos cubiertos</p>'}
        </div>

        <div class="jugador__acciones">
          <button type="button" class="btn-juego btn-juego--mini" id="btn-compartir">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            <span>Compartir tarjeta</span>
          </button>
        </div>
      </section>`;
  }

  /* ---------- Estadísticas Clave ---------- */
  function pintarEstadisticas(avance, historia) {
    const casillas = [
      { etiqueta: 'Créditos aprobados', valor: avance.aprobados, sufijo: `/${avance.exigidos}`, tono: 'arcilla' },
      { etiqueta: 'Por cursar', valor: avance.pendientes, tono: 'naranja' },
      { etiqueta: 'Inscritos ahora', valor: avance.inscritos, tono: 'verde' },
      { etiqueta: 'P.A.P.A', valor: historia.papa, decimales: 1, tono: 'arcilla' },
      { etiqueta: 'Materias aprobadas', valor: avance.materiasAprobadas, tono: 'verde' },
      { etiqueta: 'Semestres cursados', valor: avance.semestresCursados, tono: 'naranja' },
    ].filter((c) => c.valor !== null && c.valor !== undefined);

    return `
      <ul class="estadisticas" aria-label="Estadísticas de la carrera">
        ${casillas.map((c) => `
          <li class="estadistica estadistica--${c.tono}">
            <span class="estadistica__valor">
              <b data-cuenta="${c.valor}" data-decimales="${c.decimales || 0}">${formatear(c.valor, c.decimales || 0)}</b>
              ${c.sufijo ? `<small>${c.sufijo}</small>` : ''}
            </span>
            <span class="estadistica__etiqueta">${esc(c.etiqueta)}</span>
          </li>`).join('')}
      </ul>`;
  }

  /* ---------- Graduación Estimada y Ritmo de Créditos ---------- */
  function pintarGraduacion(avance) {
    const etiqueta = avance.graduacion ? etiquetaPeriodo(avance.graduacion) : '';
    const cuerpo = avance.completo
      ? `<p class="meta__valor meta__valor--listo">¡Créditos del plan 100% cumplidos!</p>
         <p class="meta__texto">Ya cubriste los 180 créditos exigidos del plan. Revisa con la Dirección de Área Curricular de Construcción los trámites de grado.</p>`
      : `<p class="meta__valor">${esc(etiqueta)}</p>
         <p class="meta__texto">Según tu ritmo de <b id="ritmo-valor">${avance.ritmo}</b> créditos por semestre, te faltan aproximadamente <b>${avance.semestresFaltantes}</b> semestre${avance.semestresFaltantes === 1 ? '' : 's'}${avance.inscritos > 0 ? ' (contando el que tienes en curso)' : ''}.</p>
         <label class="meta__ritmo" for="ritmo">
           <span>Simula un ritmo diferente:</span>
           <input type="range" id="ritmo" min="6" max="24" step="1" value="${avance.ritmo}">
           <span class="meta__ritmo-escala"><span>6 cr</span><span>15 cr</span><span>24 cr</span></span>
         </label>
         ${avance.ritmo !== avance.ritmoCalculado ? `<button type="button" class="boton-juego boton-juego--suave boton-juego--mini" id="ritmo-reiniciar">Restablecer mi ritmo calculado (${avance.ritmoCalculado} cr)</button>` : ''}`;

    return `
      <section class="panel meta" aria-label="Graduación estimada">
        <div class="panel__cabecera">
          <p class="panel__titulo">Proyección · Graduación estimada</p>
        </div>
        ${cuerpo}
        <p class="meta__aviso">Esta estimación se calcula según tu ritmo semestral promedio reciente. Depende de la oferta de cursos de obra, prerrequisitos académicos y el Trabajo de Grado.</p>
      </section>`;
  }

  /* ---------- Pestaña 1: Ruta (Mapa Semestral) ---------- */
  function pintarMapa(avance) {
    const maximo = Math.max(24, avance.ritmo, ...avance.historial.map((h) => h.aprobados + h.reprobados), ...avance.proyeccion.map((p) => p.creditos));
    const alto = (c) => `${Math.max(4, (c / maximo) * 100)}%`;
    const columnas = [
      ...avance.historial.map((h) => ({ periodo: h.periodo, tipo: 'hecho', aprobados: h.aprobados, reprobados: h.reprobados })),
      ...avance.proyeccion.map((p) => ({ periodo: p.periodo, tipo: p.tipo, aprobados: p.creditos, reprobados: 0 })),
    ];

    return `
      <section class="panel mapa" aria-label="Mapa de semestres">
        <p class="panel__titulo">Mapa de niveles · créditos por semestre</p>
        <div class="mapa__scroll" tabindex="0">
          <ol class="mapa__lista" style="--columnas: ${columnas.length}">
            ${columnas.map((c, i) => `
              <li class="mapa__col mapa__col--${c.tipo}" style="--i: ${i}">
                <span class="mapa__cr">${c.aprobados + c.reprobados} cr</span>
                <span class="mapa__barra">
                  <span class="mapa__tramo mapa__tramo--ok" style="height: ${alto(c.aprobados)}"></span>
                  ${c.reprobados ? `<span class="mapa__tramo mapa__tramo--mal" style="height: ${alto(c.reprobados)}"></span>` : ''}
                </span>
                <span class="mapa__periodo">${esc(etiquetaPeriodo(c.periodo))}</span>
                <span class="mapa__marca">${c.tipo === 'hecho' ? '✓' : c.tipo === 'curso' ? '▶' : '◇'}</span>
              </li>`).join('')}
          </ol>
        </div>
        <ul class="mapa__leyenda">
          <li><i class="l-ok"></i>Aprobados</li>
          <li><i class="l-mal"></i>Reprobados</li>
          <li><i class="l-curso"></i>En curso</li>
          <li><i class="l-proy"></i>Proyección</li>
        </ul>
      </section>`;
  }

  /* ---------- Pestaña 2: Misiones por Componente ---------- */
  function pintarMisiones(historia) {
    const r = historia.resumen;
    const filas = TIPOLOGIAS.map((t) => ({ ...t, datos: r[t.clave] })).filter((f) => f.datos && f.clave !== 'NIVELACIÓN');
    if (!filas.length) return '';

    return `
      <section class="panel misiones" aria-label="Misiones por componente">
        <p class="panel__titulo">Misiones · avance por componente de Construcción</p>
        <ul class="misiones__lista">
          ${filas.map((f) => {
            const d = f.datos;
            const completa = d.pendientes === 0 && d.exigidos > 0;
            const pa = d.exigidos ? (d.aprobados / d.exigidos) * 100 : 0;
            const pi = d.exigidos ? Math.min(100 - pa, (d.inscritos / d.exigidos) * 100) : 0;
            return `
              <li class="mision" style="--color: ${GRUPOS_COMPONENTE[f.grupo]?.color || 'var(--arcilla)'}">
                <div class="mision__cabecera">
                  <span class="mision__nombre">${esc(f.nombre)}</span>
                  <span class="mision__estado ${completa ? 'mision__estado--lista' : ''}">${completa ? '¡COMPLETA!' : `${d.pendientes} cr por cursar`}</span>
                </div>
                <div class="mision__barra">
                  <span class="mision__relleno" style="--ancho: ${pa}%"></span>
                  <span class="mision__curso" style="--inicio: ${pa}%; --ancho: ${pi}%"></span>
                </div>
                <p class="mision__detalle"><b>${d.aprobados}</b> / ${d.exigidos} cr aprobados${d.inscritos ? ` · ${d.inscritos} inscritos` : ''}</p>
              </li>`;
          }).join('')}
        </ul>
      </section>`;
  }

  /* ---------- Pestaña 3: Bitácora Académica (Historial) ---------- */
  function pintarHistorial(historia) {
    const materias = [...historia.materias].sort((a, b) => clavePeriodo(b.periodo) - clavePeriodo(a.periodo));

    if (!materias.length) {
      return `
      <details class="panel historial" open>
        <summary class="panel__titulo panel__titulo--resumen">Bitácora · Primer semestre (en curso)</summary>
        <p class="historial__vacio">
          Aún no tienes asignaturas finalizadas en el SIA. ¡Muchos éxitos en tu primer semestre de Construcción!
        </p>
      </details>`;
    }

    return `
      <details class="panel historial" open>
        <summary class="panel__titulo panel__titulo--resumen">Bitácora · ${materias.length} materias registradas</summary>
        <div class="historial__tabla-wrap">
          <table class="historial__tabla">
            <thead>
              <tr>
                <th>Asignatura</th>
                <th>Créditos</th>
                <th>Tipología</th>
                <th>Período</th>
                <th>Calificación</th>
              </tr>
            </thead>
            <tbody>
              ${materias.map((m) => {
                const esMala = m.estado === 'REPROBADA';
                const notaTexto = m.nota !== null ? formatear(m.nota, 1) : '—';
                return `<tr class="${esMala ? 'es-mala' : ''}">
                  <td>
                    <strong>${esc(m.nombre)}</strong>
                    <small>${esc(m.codigo)}</small>
                  </td>
                  <td>${m.creditos}</td>
                  <td><span class="etiqueta-tipologia">${esc(m.tipologia)}</span></td>
                  <td>${esc(etiquetaPeriodo(m.periodo))}</td>
                  <td>
                    <span class="nota-valor">${notaTexto}</span>
                    <small class="nota-estado nota-estado--${m.estado.toLowerCase()}">${esc(m.estado)}</small>
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </details>`;
  }

  const PESTANAS = [
    { id: 'ruta', texto: 'Ruta' },
    { id: 'misiones', texto: 'Misiones' },
    { id: 'bitacora', texto: 'Bitácora' },
  ];

  function activarPestana(juego, id, animar = true) {
    const botones = $$('.pestana-juego', juego);
    const paneles = $$('.pestana-panel', juego);
    if (!botones.some((b) => b.dataset.pestana === id)) id = 'ruta';
    estado.pestana = id;

    botones.forEach((b) => {
      const activa = b.dataset.pestana === id;
      b.classList.toggle('is-activa', activa);
      b.setAttribute('aria-selected', activa ? 'true' : 'false');
      b.tabIndex = activa ? 0 : -1;
      if (activa) {
        const barra = $('.pestanas-juego__indicador', juego);
        if (barra) {
          barra.style.setProperty('--x', `${b.offsetLeft}px`);
          barra.style.setProperty('--w', `${b.offsetWidth}px`);
        }
      }
    });

    paneles.forEach((p) => {
      const activo = p.dataset.pestana === id;
      p.hidden = !activo;
      if (activo && animar) {
        p.classList.remove('entra');
        void p.offsetWidth;
        p.classList.add('entra');
      }
    });
  }

  function animarCifras(contenedor) {
    const reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    contenedor.querySelectorAll('[data-cuenta]').forEach((el) => {
      const meta = parseFloat(el.dataset.cuenta);
      const dec = parseInt(el.dataset.decimales || '0', 10);
      if (reducido || Number.isNaN(meta) || meta === 0) return;
      const t0 = performance.now();
      const paso = (t) => {
        const k = Math.min(1, (t - t0) / 900);
        el.textContent = formatear(meta * (1 - (1 - k) ** 3), dec);
        if (k < 1) requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    });
  }

  /* ---------- Modal / Tarjeta para Compartir ---------- */
  function compartirTarjeta() {
    const nombre = estado.nombre || estado.historia?.nombre || 'Estudiante de Construcción';
    const nivel = estado.avance?.nivel || 1;
    const rango = rangoNivel(nivel);
    const papa = estado.historia?.papa ? formatear(estado.historia.papa, 1) : '—';
    const aprob = estado.avance?.aprobados || 0;
    const total = estado.avance?.exigidos || 180;
    const pct = estado.avance?.porcentaje || 0;

    const texto = `🏗️ Mi progreso en Construcción (UNAL Medellín):
👤 Estudiante: ${nombre}
🎖️ Nivel: ${nivel}/100 — ${rango}
📊 P.A.P.A: ${papa}
📚 Créditos: ${aprob}/${total} (${pct}%)
Consulta tu avance en la web de Construcción: https://construccionunal.com`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(texto).then(() => {
        alert('¡Resumen de avance copiado al portapapeles!');
      }).catch(() => {
        alert(texto);
      });
    } else {
      alert(texto);
    }
  }

  /* ---------- Dibujado Principal del HUD ---------- */
  function dibujar() {
    const historia = estado.historia;
    const avance = calcularAvance(historia, estado.ritmo);
    estado.avance = avance;

    const misiones = pintarMisiones(historia);
    const juego = $('#avance-juego');
    if (!juego) return;

    const sinAnimar = Boolean(juego.dataset.visto);

    juego.classList.toggle('sin-animar', sinAnimar);
    juego.hidden = false;

    juego.innerHTML = `
      ${historia.esConstruccion ? '' : '<p class="aviso-juego">Aviso: no detectamos «Construcción» en el texto pegado. Los cálculos se basan en el Plan 3503 de 180 créditos de Construcción.</p>'}
      ${pintarJugador(avance, historia)}
      ${pintarEstadisticas(avance, historia)}
      ${pintarGraduacion(avance)}
      <div class="pestanas-juego" role="tablist" aria-label="Secciones de Mi avance">
        ${PESTANAS.filter((t) => t.id !== 'misiones' || misiones).map((t) => `
          <button type="button" class="pestana-juego" role="tab" id="pest-${t.id}" data-pestana="${t.id}" aria-controls="panel-${t.id}">${t.texto}</button>`).join('')}
        <span class="pestanas-juego__indicador" aria-hidden="true"></span>
      </div>
      <div class="pestana-panel" role="tabpanel" id="panel-ruta" data-pestana="ruta" aria-labelledby="pest-ruta">${pintarMapa(avance)}</div>
      ${misiones ? `<div class="pestana-panel" role="tabpanel" id="panel-misiones" data-pestana="misiones" aria-labelledby="pest-misiones" hidden>${misiones}</div>` : ''}
      <div class="pestana-panel" role="tabpanel" id="panel-bitacora" data-pestana="bitacora" aria-labelledby="pest-bitacora" hidden>${pintarHistorial(historia)}</div>`;

    if (!sinAnimar) animarCifras(juego);
    juego.dataset.visto = '1';

    // Cerrar el accordion de entrada para darle foco al resultado si hay datos cargados
    const entrada = $('#entrada');
    if (entrada && estado.historia?.materias?.length) {
      entrada.removeAttribute('open');
    }

    // Pestañas
    $$('.pestana-juego', juego).forEach((btn, i, todos) => {
      btn.addEventListener('click', () => activarPestana(juego, btn.dataset.pestana));
      btn.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const siguiente = todos[(i + (e.key === 'ArrowRight' ? 1 : todos.length - 1)) % todos.length];
        siguiente.focus();
        activarPestana(juego, siguiente.dataset.pestana);
      });
    });
    activarPestana(juego, estado.pestana, false);

    // Nombre de estudiante editable
    const inputNombre = $('#nombre-jugador');
    if (inputNombre) {
      let timerNombre = null;
      inputNombre.addEventListener('input', (e) => {
        estado.nombre = e.target.value;
        clearTimeout(timerNombre);
        timerNombre = setTimeout(() => {
          guardado.escribir({ texto: estado.texto, nombre: estado.nombre, ritmo: estado.ritmo });
        }, 500);
      });
    }

    // Slider de ritmo
    const ritmo = $('#ritmo');
    if (ritmo) {
      ritmo.addEventListener('input', (e) => {
        $('#ritmo-valor').textContent = e.target.value;
      });
      ritmo.addEventListener('change', (e) => {
        estado.ritmo = Number(e.target.value);
        guardado.escribir({ texto: estado.texto, nombre: estado.nombre, ritmo: estado.ritmo });
        dibujar();
      });
    }
    const reiniciar = $('#ritmo-reiniciar');
    if (reiniciar) {
      reiniciar.addEventListener('click', () => {
        estado.ritmo = null;
        guardado.escribir({ texto: estado.texto, nombre: estado.nombre, ritmo: null });
        dibujar();
      });
    }

    // Botón compartir
    const btnCompartir = $('#btn-compartir');
    if (btnCompartir) {
      btnCompartir.addEventListener('click', compartirTarjeta);
    }
  }

  /* ---------- Procesar Texto de Historia Académica ---------- */
  function mostrarError(mensaje) {
    const el = $('#entrada-error');
    if (!el) return;
    if (!mensaje) {
      el.hidden = true;
      el.textContent = '';
    } else {
      el.hidden = false;
      el.textContent = mensaje;
    }
  }

  function procesar(texto, esCargaInicial = false) {
    mostrarError('');
    if (!texto || !texto.trim()) {
      if (!esCargaInicial) mostrarError('Pega primero el texto copiado de tu Historia Académica en el SIA.');
      return false;
    }

    const historia = typeof leerHistoria === 'function' ? leerHistoria(texto) : window.leerHistoria?.(texto);
    if (!historia) {
      mostrarError('Error interno leyendo el formato de historia académica.');
      return false;
    }

    const tieneMaterias = Boolean(historia.materias && historia.materias.length);
    const tieneResumen = Boolean(historia.resumen && Object.keys(historia.resumen).length);

    if (!tieneMaterias && !tieneResumen) {
      mostrarError('No pudimos reconocer asignaturas ni resumen de créditos en el texto pegado. Asegúrate de presionar Ctrl+A y luego Ctrl+C dentro del módulo Historia Académica del SIA.');
      return false;
    }

    estado.texto = texto;
    estado.historia = historia;
    if (!estado.nombre && historia.nombre) {
      estado.nombre = historia.nombre;
    }

    guardado.escribir({
      texto: estado.texto,
      nombre: estado.nombre,
      ritmo: estado.ritmo,
      actualizado: new Date().toISOString(),
    });

    dibujar();
    return true;
  }

  /* ---------- Inicialización ---------- */
  function iniciar() {
    const datosGuardados = guardado.leer();
    if (datosGuardados && datosGuardados.texto) {
      estado.nombre = datosGuardados.nombre || '';
      estado.ritmo = datosGuardados.ritmo || null;
      const txtArea = $('#historia-texto');
      if (txtArea) txtArea.value = datosGuardados.texto;
      procesar(datosGuardados.texto, true);
    } else {
      const entrada = $('#entrada');
      if (entrada) entrada.setAttribute('open', '');
    }

    // Botón guardar
    const btnGuardar = $('#btn-guardar');
    if (btnGuardar) {
      btnGuardar.addEventListener('click', (e) => {
        e.preventDefault();
        const txt = $('#historia-texto')?.value || '';
        if (procesar(txt)) {
          btnGuardar.textContent = '¡Datos cargados con éxito!';
          const juego = $('#avance-juego');
          if (juego) juego.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(() => { btnGuardar.textContent = 'Actualizar mi historia'; }, 2200);
        }
      });
    }

    // Botón borrar
    const btnBorrar = $('#btn-borrar');
    if (btnBorrar) {
      btnBorrar.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('¿Deseas borrar tus datos locales de avance en este navegador?')) {
          guardado.borrar();
          estado.texto = '';
          estado.nombre = '';
          estado.ritmo = null;
          estado.historia = null;
          estado.avance = null;
          const txtArea = $('#historia-texto');
          if (txtArea) txtArea.value = '';
          const juego = $('#avance-juego');
          if (juego) {
            juego.hidden = true;
            juego.innerHTML = '';
            delete juego.dataset.visto;
          }
          const entrada = $('#entrada');
          if (entrada) entrada.setAttribute('open', '');
          mostrarError('');
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
