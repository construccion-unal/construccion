/* =============================================
   FUNCIONES COMUNES A TODOS LOS MÓDULOS
   - Carga de datos modular (cada módulo pide solo lo que necesita)
   - Barra superior interactiva ("La Viga de Replanteo") con Carro Deslizante (Glider)
   - Transición de página constructiva ("Escaneo de Obra / Replanteo Láser")
   - Pie de página oficial y mensaje de autor
   ============================================= */

const $ = (selector, raiz = document) => raiz.querySelector(selector);
const $$ = (selector, raiz = document) => [...raiz.querySelectorAll(selector)];

// Escapa texto antes de meterlo en HTML
const esc = (texto) => String(texto ?? '').replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);


/* ---------- Carga de datos ---------- */

const memoriaDatos = new Map();

function cargarDatos(ruta) {
  if (!memoriaDatos.has(ruta)) {
    const peticion = fetch(`data/${ruta}.json`).then((respuesta) => {
      if (!respuesta.ok) throw new Error(`No se pudo cargar data/${ruta}.json (${respuesta.status})`);
      return respuesta.json();
    });
    memoriaDatos.set(ruta, peticion);
  }
  return memoriaDatos.get(ruta);
}

function mostrarErrorDeCarga(contenedor, error) {
  console.error(error);
  contenedor.innerHTML = `
    <div class="aviso">
      <p><strong>No se pudo cargar la información.</strong></p>
      <p>Si abriste el archivo con doble clic, sírvelo con un servidor local:
        <code>python -m http.server</code> y entra a <code>http://localhost:8000</code>.</p>
    </div>`;
}


/* ---------- Barra superior interactiva y navegación ---------- */

const PAGINAS = [
  {
    id: 'inicio',
    numero: '01',
    texto: 'Inicio',
    tituloCompleto: 'Inicio',
    url: 'index.html',
    cota: '±0.00m',
    badge: null,
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h18M5 21V5l7-3 7 3v16M9 9h1M14 9h1M9 13h1M14 13h1M9 17h1M14 17h1M9 21v-4h6v4"/></svg>'
  },
  {
    id: 'malla',
    numero: '02',
    texto: 'Malla',
    tituloCompleto: 'Malla Curricular',
    url: 'malla.html',
    cota: '+3.50m',
    badge: '180 CR',
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M9 21V9M15 21V9M3 15h18"/></svg>'
  },
  {
    id: 'intercampus',
    numero: '03',
    texto: 'Intercampus',
    tituloCompleto: 'Rutas Intercampus y Metro',
    url: 'intercampus.html',
    cota: '+7.00m',
    badge: null,
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="14" rx="3"/><path d="M7 18v3M17 18v3M3 10h18"/><circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/></svg>'
  },
  {
    id: 'convenios',
    numero: '04',
    texto: 'Convenios',
    tituloCompleto: 'Convenios y Beneficios',
    url: 'convenios.html',
    cota: '+10.50m',
    badge: null,
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5"/><path d="M22 9v6"/></svg>'
  },
  {
    id: 'info',
    numero: '05',
    texto: 'Información',
    tituloCompleto: 'Información General y Trámites',
    url: 'info.html',
    cota: '+14.00m',
    badge: null,
    icono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  }
];

function pintarBarra() {
  const actual = document.body.dataset.pagina;
  const contenedorBarra = $('#barra');
  if (!contenedorBarra) return;

  contenedorBarra.outerHTML = `
    <header class="barra" id="encabezado-barra">
      <div class="contenedor barra__contenido">
        <!-- MARCA ARQUITECTÓNICA DE CONSTRUCCIÓN -->
        <a class="barra__marca" href="index.html" aria-label="Construcción UNAL, volver al inicio" data-id="inicio" data-cota="±0.00m" data-titulo="Inicio">
          <div class="barra__escudo-wrap">
            <span class="barra__mira barra__mira--tl" aria-hidden="true"></span>
            <span class="barra__mira barra__mira--tr" aria-hidden="true"></span>
            <span class="barra__mira barra__mira--bl" aria-hidden="true"></span>
            <span class="barra__mira barra__mira--br" aria-hidden="true"></span>
            <img src="img/logo-construccion.svg" alt="Escudo de Construcción" class="barra__escudo-img" width="42" height="42">
          </div>
          <div class="barra__texto">
            <span class="barra__carrera">Construcción</span>
            <span class="barra__facultad">Facultad de Arquitectura · UNAL</span>
          </div>
        </a>

        <!-- BOTÓN MENÚ MÓVIL (TIPO CAJETÍN) -->
        <button class="barra__boton-menu" id="btn-menu" type="button" aria-expanded="false" aria-controls="menu-navegacion" aria-label="Abrir menú de planos">
          <span class="barra__icono barra__icono--abrir" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
          </span>
          <span class="barra__icono barra__icono--cerrar" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </span>
          <span class="barra__boton-texto">Módulos</span>
        </button>

        <!-- NAVEGACIÓN PRINCIPAL CON CARRO DE REPLANTEO -->
        <nav class="nav" id="menu-navegacion" aria-label="Módulos del sitio">
          <!-- GLIDER DESLIZANTE DE NIVEL TOPOGRÁFICO -->
          <div class="nav__glider" id="nav-glider" aria-hidden="true">
            <span class="nav__glider-laser"></span>
            <span class="nav__glider-burbuja"></span>
          </div>

          ${PAGINAS.map((p) => {
            const esActivo = p.id === actual;
            return `
              <a class="nav__enlace ${esActivo ? 'is-activo' : ''}" href="${p.url}" ${esActivo ? 'aria-current="page"' : ''} data-id="${p.id}" data-cota="${p.cota}" data-titulo="${p.tituloCompleto}">
                <span class="nav__numero">${p.numero}</span>
                <span class="nav__icono">${p.icono}</span>
                <span class="nav__texto">${p.texto}</span>
                ${p.badge ? `<span class="nav__badge">${p.badge}</span>` : ''}
                <span class="nav__burbuja" aria-hidden="true"></span>
              </a>`;
          }).join('')}
        </nav>
      </div>

      <!-- LÁSER DE BORDE / NIVELADOR TOPOGRÁFICO -->
      <div class="barra__laser-borde" aria-hidden="true">
        <span class="barra__laser-haz"></span>
        <span class="barra__laser-marca">EJE DE REPLANTEO · SEDE MEDELLÍN</span>
      </div>
    </header>

    <!-- CORTINA DE REPLANTEO Y TRANSICIÓN CONSTRUCTIVA -->
    <div class="cortina-obra" id="cortina-obra" aria-hidden="true">
      <div class="cortina-obra__grid"></div>
      <div class="cortina-obra__haz">
        <span class="cortina-obra__laser-punto"></span>
        <span class="cortina-obra__laser-cota">REPLANTEO LÁSER · TOPOGRAFÍA Y EDIFICACIÓN</span>
      </div>
      <div class="cortina-obra__tarjeta">
        <div class="cortina-obra__esquinas">
          <span class="esquina esquina--tl"></span>
          <span class="esquina esquina--tr"></span>
          <span class="esquina esquina--bl"></span>
          <span class="esquina esquina--br"></span>
        </div>
        <div class="cortina-obra__cabecera">
          <span class="cortina-obra__sello">OBRA EN CURSO · ESCUELA DE CONSTRUCCIÓN</span>
          <span class="cortina-obra__escala">ESCALA 1:100</span>
        </div>
        <h2 class="cortina-obra__titulo" id="cortina-titulo">REPLANTEANDO PLANO...</h2>
        <div class="cortina-obra__cota-wrap">
          <span class="cortina-obra__cota-linea"></span>
          <span class="cortina-obra__cota-lectura" id="cortina-cota">N.P.T. ±0.00m</span>
          <span class="cortina-obra__cota-linea"></span>
        </div>
        <div class="cortina-obra__progreso">
          <span class="cortina-obra__barra"></span>
        </div>
      </div>
    </div>`;

  configurarMenuMovil();
  configurarNavegacionInteractiva();
}

function configurarMenuMovil() {
  const barra = $('#encabezado-barra');
  const btn = $('#btn-menu');
  const nav = $('#menu-navegacion');
  if (!barra || !btn || !nav) return;

  function toggleMenu(abrir) {
    const estaAbierto = abrir !== undefined ? abrir : !barra.classList.contains('is-menu-abierto');
    barra.classList.toggle('is-menu-abierto', estaAbierto);
    btn.setAttribute('aria-expanded', String(estaAbierto));
    btn.setAttribute('aria-label', estaAbierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      toggleMenu(false);
    }
  });

  document.addEventListener('click', (e) => {
    if (barra.classList.contains('is-menu-abierto') && !barra.contains(e.target)) {
      toggleMenu(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && barra.classList.contains('is-menu-abierto')) {
      toggleMenu(false);
      btn.focus();
    }
  });
}

function configurarNavegacionInteractiva() {
  const nav = $('#menu-navegacion');
  const glider = $('#nav-glider');
  const cortina = $('#cortina-obra');
  if (!nav || !glider) return;

  const enlaces = $$('.nav__enlace', nav);
  const enlaceActivo = nav.querySelector('.nav__enlace[aria-current="page"]');

  function moverGlider(enlace, animar = true) {
    if (!enlace || window.innerWidth <= 1040) {
      glider.style.opacity = '0';
      return;
    }
    const navRect = nav.getBoundingClientRect();
    const linkRect = enlace.getBoundingClientRect();
    const left = linkRect.left - navRect.left;
    const width = linkRect.width;

    if (!animar) {
      glider.style.transition = 'none';
    } else {
      glider.style.transition = 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), width 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease';
    }

    glider.style.transform = `translate3d(${left}px, 0, 0)`;
    glider.style.width = `${width}px`;
    glider.style.opacity = '1';
  }

  // Posicionar glider inicialmente sobre la pestaña activa
  if (enlaceActivo) {
    setTimeout(() => moverGlider(enlaceActivo, false), 40);
  }

  enlaces.forEach((enlace) => {
    enlace.addEventListener('mouseenter', () => moverGlider(enlace, true));
  });

  nav.addEventListener('mouseleave', () => {
    if (enlaceActivo) moverGlider(enlaceActivo, true);
  });

  window.addEventListener('resize', () => {
    if (enlaceActivo) moverGlider(enlaceActivo, false);
  }, { passive: true });

  // Transición constructiva de cambio de página
  if (cortina) {
    // Si venimos de una transición previa, animar revelado suave
    if (sessionStorage.getItem('transicion_obra_activa')) {
      sessionStorage.removeItem('transicion_obra_activa');
      cortina.classList.add('is-revelando');
      setTimeout(() => {
        cortina.classList.remove('is-revelando');
      }, 380);
    }

    // Interceptar clics de navegación
    const todosEnlaces = [...enlaces, $('.barra__marca')].filter(Boolean);
    todosEnlaces.forEach((enlace) => {
      enlace.addEventListener('click', (e) => {
        // Permitir modificadores (abrir en pestaña nueva)
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

        const href = enlace.getAttribute('href');
        if (!href || href.startsWith('#')) return;

        // Si ya estamos en la página actual
        if (enlace.getAttribute('aria-current') === 'page') {
          e.preventDefault();
          enlace.classList.add('is-pulsando');
          setTimeout(() => enlace.classList.remove('is-pulsando'), 300);
          return;
        }

        e.preventDefault();

        // Actualizar textos técnicos de la cortina
        const titulo = enlace.dataset.titulo || 'MÓDULO DE OBRA';
        const cota = enlace.dataset.cota || '±0.00m';
        const cortinaTitulo = $('#cortina-titulo');
        const cortinaCota = $('#cortina-cota');

        if (cortinaTitulo) cortinaTitulo.textContent = `REPLANTEANDO · ${titulo.toUpperCase()}`;
        if (cortinaCota) cortinaCota.textContent = `N.P.T. ${cota}`;

        // Activar transición visual
        cortina.classList.add('is-entrando');
        sessionStorage.setItem('transicion_obra_activa', '1');

        // Mover glider al destino con antelación
        moverGlider(enlace, true);

        // Navegar a los 220ms (ultra responsivo y placentero)
        setTimeout(() => {
          window.location.href = href;
        }, 220);
      });
    });

    // Soporte para bfcache (navegación atrás/adelante del navegador)
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) {
        cortina.classList.remove('is-entrando', 'is-revelando');
      }
    });
  }
}


/* ---------- Pie de página oficial ---------- */

function pintarPie() {
  const contenedorPie = $('#pie');
  if (!contenedorPie) return;

  contenedorPie.outerHTML = `
    <footer class="pie">
      <div class="pie__marca-central">
        <div class="pie__escudo">
          <img src="img/logo-construccion.svg" alt="Logo de Construcción" class="pie__escudo-img">
        </div>

        <div class="pie__pildoras-carrera">
          <a class="pie__pildora pie__pildora--ig" href="https://www.instagram.com/construccionunal/" target="_blank" rel="noopener noreferrer" title="Instagram de Construcción UNAL">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            <span>@construccionunal</span>
          </a>
          <a class="pie__pildora pie__pildora--wpp" href="https://wa.me/573193584740" target="_blank" rel="noopener noreferrer" title="WhatsApp Representación de Construcción">
            <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.07 7.71C8.89 7.71 8.6 7.78 8.36 8.04C8.11 8.3 7.41 8.96 7.41 10.3C7.41 11.63 8.38 12.92 8.52 13.1C8.66 13.29 10.42 16 13.12 17.17C15.36 18.14 15.82 17.95 16.31 17.9C16.8 17.86 17.88 17.26 18.11 16.63C18.33 16 18.33 15.46 18.26 15.35C18.2 15.24 18.01 15.18 17.73 15.04C17.45 14.9 16.08 14.23 15.83 14.13C15.57 14.04 15.39 13.99 15.2 14.27C15.02 14.55 14.49 15.18 14.33 15.36C14.17 15.55 14.01 15.57 13.73 15.43C13.45 15.29 12.27 14.9 10.87 13.65C9.78 12.68 9.05 11.48 8.84 11.12C8.63 10.76 8.82 10.56 8.96 10.42C9.09 10.29 9.25 10.08 9.39 9.92C9.53 9.76 9.58 9.64 9.67 9.46C9.76 9.27 9.72 9.11 9.65 8.97C9.58 8.83 9.07 7.58 8.86 7.07C8.66 6.58 8.45 6.64 8.3 6.63C8.15 6.63 7.97 6.63 7.78 6.63"/></svg>
            <span>(+57) 319 358 4740</span>
          </a>
        </div>

        <p class="pie__titulo-carrera"><strong>Construcción</strong> · Facultad de Arquitectura · Universidad Nacional de Colombia, Sede Medellín</p>
      </div>

      <!-- DOS TARJETICAS OFICIALES -->
      <div class="pie__tarjetas-grid">
        <!-- TARJETA 1: REPRESENTACIÓN ESTUDIANTIL -->
        <div class="pie__tarjeta pie__tarjeta--representacion">
          <span class="pie__tarjeta-sub">REPRESENTACIÓN ESTUDIANTIL · CONSTRUCCIÓN</span>
          <p class="pie__tarjeta-nombre"><strong>Johana Andrea</strong> · Representante Estudiantil</p>
          <div class="pie__tarjeta-enlaces">
            <a class="pie__enlace-contacto pie__enlace-contacto--wpp" href="https://wa.me/573193584740" target="_blank" rel="noopener noreferrer" title="WhatsApp Johana Andrea">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.07 7.71C8.89 7.71 8.6 7.78 8.36 8.04C8.11 8.3 7.41 8.96 7.41 10.3C7.41 11.63 8.38 12.92 8.52 13.1C8.66 13.29 10.42 16 13.12 17.17C15.36 18.14 15.82 17.95 16.31 17.9C16.8 17.86 17.88 17.26 18.11 16.63C18.33 16 18.33 15.46 18.26 15.35C18.2 15.24 18.01 15.18 17.73 15.04C17.45 14.9 16.08 14.23 15.83 14.13C15.57 14.04 15.39 13.99 15.2 14.27C15.02 14.55 14.49 15.18 14.33 15.36C14.17 15.55 14.01 15.57 13.73 15.43C13.45 15.29 12.27 14.9 10.87 13.65C9.78 12.68 9.05 11.48 8.84 11.12C8.63 10.76 8.82 10.56 8.96 10.42C9.09 10.29 9.25 10.08 9.39 9.92C9.53 9.76 9.58 9.64 9.67 9.46C9.76 9.27 9.72 9.11 9.65 8.97C9.58 8.83 9.07 7.58 8.86 7.07C8.66 6.58 8.45 6.64 8.3 6.63C8.15 6.63 7.97 6.63 7.78 6.63"/></svg>
              <span>(+57) 319 358 4740</span>
            </a>
            <a class="pie__enlace-contacto pie__enlace-contacto--ig" href="https://www.instagram.com/construccionunal/" target="_blank" rel="noopener noreferrer" title="Instagram Construcción UNAL">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              <span>@construccionunal</span>
            </a>
          </div>
        </div>

        <!-- TARJETA 2: CREACIÓN Y DESARROLLO WEB -->
        <div class="pie__tarjeta pie__tarjeta--desarrollo">
          <span class="pie__tarjeta-sub">CREACIÓN Y DESARROLLO WEB</span>
          <p class="pie__tarjeta-nombre">Iniciativa y plataforma desarrollada por <strong>Santiago Escobar Arias</strong> · Representante de Sistemas</p>
          <div class="pie__tarjeta-enlaces">
            <a class="pie__enlace-contacto pie__enlace-contacto--wpp" href="https://wa.me/573123772091" target="_blank" rel="noopener noreferrer" title="WhatsApp Santiago Escobar">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.07 7.71C8.89 7.71 8.6 7.78 8.36 8.04C8.11 8.3 7.41 8.96 7.41 10.3C7.41 11.63 8.38 12.92 8.52 13.1C8.66 13.29 10.42 16 13.12 17.17C15.36 18.14 15.82 17.95 16.31 17.9C16.8 17.86 17.88 17.26 18.11 16.63C18.33 16 18.33 15.46 18.26 15.35C18.2 15.24 18.01 15.18 17.73 15.04C17.45 14.9 16.08 14.23 15.83 14.13C15.57 14.04 15.39 13.99 15.2 14.27C15.02 14.55 14.49 15.18 14.33 15.36C14.17 15.55 14.01 15.57 13.73 15.43C13.45 15.29 12.27 14.9 10.87 13.65C9.78 12.68 9.05 11.48 8.84 11.12C8.63 10.76 8.82 10.56 8.96 10.42C9.09 10.29 9.25 10.08 9.39 9.92C9.53 9.76 9.58 9.64 9.67 9.46C9.76 9.27 9.72 9.11 9.65 8.97C9.58 8.83 9.07 7.58 8.86 7.07C8.66 6.58 8.45 6.64 8.3 6.63C8.15 6.63 7.97 6.63 7.78 6.63"/></svg>
              <span>(+57) 312 377 2091</span>
            </a>
            <a class="pie__enlace-contacto pie__enlace-contacto--correo" href="mailto:saescobara@unal.edu.co" title="Correo institucional Santiago Escobar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <span>saescobara@unal.edu.co</span>
            </a>
          </div>
          <div class="pie__tarjeta-enlaces pie__tarjeta-enlaces--segunda">
            <a class="pie__enlace-contacto pie__enlace-contacto--ig" href="https://www.instagram.com/s_escobar__/" target="_blank" rel="noopener noreferrer" title="Instagram Santiago Escobar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              <span>@s_escobar__</span>
            </a>
          </div>
        </div>
      </div>

            <div class="pie__legal">
        <p class="pie__legal-texto">Proyecto de apoyo estudiantil sin ánimo de lucro, de carácter académico e informativo para la comunidad universitaria de la Universidad Nacional de Colombia (Sede Medellín).</p>
        <p class="pie__copyright">© 2026 · Todos los derechos reservados.</p>
      </div>
    </footer>`;
}


/* ---------- Mensaje oficial de autor / Representación estudiantil ---------- */

function mostrarMensajeAutor() {
  if (sessionStorage.getItem('mensaje_representacion_cerrado') === '1') return;

  const toast = document.createElement('aside');
  toast.className = 'toast-autor';
  toast.id = 'toast-autor';
  toast.setAttribute('aria-label', 'Mensaje del creador del portal y representante estudiantil');

  toast.innerHTML = `
    <div class="toast-autor__tarjeta">
      <button class="toast-autor__cerrar" id="toast-autor-cerrar" type="button" aria-label="Cerrar mensaje">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <div class="toast-autor__cabecera">
        <div class="toast-autor__avatar" aria-hidden="true">
          <img src="img/logo-construccion.svg" alt="Logo de Construcción" class="toast-autor__avatar-img">
        </div>
        <div class="toast-autor__titulos">
          <span class="toast-autor__nombre">Santiago Escobar Arias</span>
          <span class="toast-autor__cargo">REPRESENTANTE DE SISTEMAS · CREADOR DE LA WEB</span>
        </div>
      </div>

      <p class="toast-autor__mensaje">
        ¡Hola! Desarrollé este portal con el propósito de apoyar, guiar y facilitar la vida universitaria de todos los estudiantes de <strong>Construcción</strong>. Cuentan con mi total respaldo desde la representación estudiantil de Sistemas para seguir construyendo herramientas digitales que fortalezcan nuestra vida académica en la Facultad de Arquitectura y en la Sede Medellín.
      </p>

      <div class="toast-autor__pildoras">
        <a class="toast-autor__pildora toast-autor__pildora--wpp" href="https://wa.me/573123772091" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp de Santiago Escobar">
          <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.07 7.71C8.89 7.71 8.6 7.78 8.36 8.04C8.11 8.3 7.41 8.96 7.41 10.3C7.41 11.63 8.38 12.92 8.52 13.1C8.66 13.29 10.42 16 13.12 17.17C15.36 18.14 15.82 17.95 16.31 17.9C16.8 17.86 17.88 17.26 18.11 16.63C18.33 16 18.33 15.46 18.26 15.35C18.2 15.24 18.01 15.18 17.73 15.04C17.45 14.9 16.08 14.23 15.83 14.13C15.57 14.04 15.39 13.99 15.2 14.27C15.02 14.55 14.49 15.18 14.33 15.36C14.17 15.55 14.01 15.57 13.73 15.43C13.45 15.29 12.27 14.9 10.87 13.65C9.78 12.68 9.05 11.48 8.84 11.12C8.63 10.76 8.82 10.56 8.96 10.42C9.09 10.29 9.25 10.08 9.39 9.92C9.53 9.76 9.58 9.64 9.67 9.46C9.76 9.27 9.72 9.11 9.65 8.97C9.58 8.83 9.07 7.58 8.86 7.07C8.66 6.58 8.45 6.64 8.3 6.63C8.15 6.63 7.97 6.63 7.78 6.63"/></svg>
          <span>(+57) 312 377 2091</span>
        </a>
        <a class="toast-autor__pildora toast-autor__pildora--ig" href="https://www.instagram.com/s_escobar__/" target="_blank" rel="noopener noreferrer" aria-label="Instagram de Santiago Escobar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          <span>@s_escobar__</span>
        </a>
        <a class="toast-autor__pildora toast-autor__pildora--correo" href="mailto:saescobara@unal.edu.co" aria-label="Correo de Santiago Escobar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          <span>saescobara@unal.edu.co</span>
        </a>
      </div>

      <button class="toast-autor__btn-ok" id="toast-autor-ok" type="button">¡ENTENDIDO!</button>
    </div>`;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('is-visible');
  }, 700);

  function cerrarToast() {
    toast.classList.remove('is-visible');
    toast.classList.add('is-hiding');
    sessionStorage.setItem('mensaje_representacion_cerrado', '1');
    sessionStorage.setItem('mensaje_autor_cerrado', '1');
    setTimeout(() => {
      toast.remove();
    }, 350);
  }

  $('#toast-autor-cerrar', toast)?.addEventListener('click', cerrarToast);
  $('#toast-autor-ok', toast)?.addEventListener('click', cerrarToast);
}

// Inicialización única
pintarBarra();
pintarPie();
mostrarMensajeAutor();
