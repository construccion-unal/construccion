/* =============================================
   MÓDULO MALLA CURRICULAR
   Datos (carpeta data/malla):
   - componentes.json: componentes y agrupaciones (con sus créditos)
   - plan.json: qué va en cada semestre (códigos o casillas de optativa / libre elección)
   - asignaturas.json: catálogo con créditos, prerrequisitos y agrupación
   Las relaciones se calculan aquí a partir de los códigos: nada está repetido en los datos.
   ============================================= */

const POR_PAGINA = 12;
const ROMANOS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const ICONO_WHATSAPP = `<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.07 7.71C8.89 7.71 8.6 7.78 8.36 8.04C8.11 8.3 7.41 8.96 7.41 10.3C7.41 11.63 8.38 12.92 8.52 13.1C8.66 13.29 10.42 16 13.12 17.17C15.36 18.14 15.82 17.95 16.31 17.9C16.8 17.86 17.88 17.26 18.11 16.63C18.33 16 18.33 15.46 18.26 15.35C18.2 15.24 18.01 15.18 17.73 15.04C17.45 14.9 16.08 14.23 15.83 14.13C15.57 14.04 15.39 13.99 15.2 14.27C15.02 14.55 14.49 15.18 14.33 15.36C14.17 15.55 14.01 15.57 13.73 15.43C13.45 15.29 12.27 14.9 10.87 13.65C9.78 12.68 9.05 11.48 8.84 11.12C8.63 10.76 8.82 10.56 8.96 10.42C9.09 10.29 9.25 10.08 9.39 9.92C9.53 9.76 9.58 9.64 9.67 9.46C9.76 9.27 9.72 9.11 9.65 8.97C9.58 8.83 9.07 7.58 8.86 7.07C8.66 6.58 8.45 6.64 8.3 6.63C8.15 6.63 7.97 6.63 7.78 6.63"/></svg>`;

/* ---------- Easter Egg: Pascal el Camaleón (Topografía) ---------- */
const SVG_PASCAL = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41 34" class="pascal-pixel-svg" shape-rendering="crispEdges" width="52" height="43" aria-hidden="true"><path fill="var(--pascal-dark, #000000)" d="M28,0h6v1h-6z M13,1h11v1h-11z M28,1h1v1h-1z M34,1h1v1h-1z M10,2h3v1h-3z M24,2h3v1h-3z M28,2h1v1h-1z M35,2h1v1h-1z M8,3h2v1h-2z M27,3h2v1h-2z M35,3h1v1h-1z M7,4h1v1h-1z M36,4h1v1h-1z M6,5h1v1h-1z M27,5h1v1h-1z M36,5h1v1h-1z M5,6h1v1h-1z M33,6h1v1h-1z M37,6h1v1h-1z M4,7h1v1h-1z M31,7h2v1h-2z M38,7h1v1h-1z M3,8h1v1h-1z M30,8h1v1h-1z M38,8h1v1h-1z M2,9h1v1h-1z M30,9h1v1h-1z M32,9h2v1h-2z M39,9h1v1h-1z M1,10h1v1h-1z M30,10h2v1h-2z M39,10h1v1h-1z M1,11h1v1h-1z M32,11h2v1h-2z M40,11h1v1h-1z M0,12h1v1h-1z M32,12h1v1h-1z M40,12h1v1h-1z M0,13h1v1h-1z M40,13h1v1h-1z M0,14h1v1h-1z M12,14h1v1h-1z M21,14h1v1h-1z M40,14h1v1h-1z M0,15h1v1h-1z M12,15h1v1h-1z M17,15h1v1h-1z M21,15h2v1h-2z M30,15h2v1h-2z M37,15h1v1h-1z M40,15h1v1h-1z M0,16h1v1h-1z M12,16h1v1h-1z M17,16h1v1h-1z M21,16h4v1h-4z M32,16h3v1h-3z M39,16h1v1h-1z M0,17h1v1h-1z M5,17h1v1h-1z M9,17h1v1h-1z M12,17h7v1h-7z M23,17h1v1h-1z M25,17h2v1h-2z M35,17h5v1h-5z M0,18h1v1h-1z M5,18h5v1h-5z M14,18h1v1h-1z M19,18h1v1h-1z M22,18h2v1h-2z M27,18h2v1h-2z M36,18h1v1h-1z M0,19h1v1h-1z M5,19h1v1h-1z M8,19h2v1h-2z M12,19h3v1h-3z M20,19h1v1h-1z M23,19h1v1h-1z M29,19h7v1h-7z M0,20h1v1h-1z M5,20h1v1h-1z M9,20h1v1h-1z M13,20h2v1h-2z M21,20h3v1h-3z M1,21h1v1h-1z M5,21h1v1h-1z M9,21h7v1h-7z M1,22h1v1h-1z M5,22h1v1h-1z M9,22h1v1h-1z M16,22h1v1h-1z M1,23h1v1h-1z M5,23h1v1h-1z M8,23h1v1h-1z M17,23h1v1h-1z M1,24h1v1h-1z M5,24h1v1h-1z M8,24h1v1h-1z M12,24h2v1h-2z M18,24h1v1h-1z M2,25h1v1h-1z M6,25h1v1h-1z M8,25h1v1h-1z M12,25h3v1h-3z M18,25h1v1h-1z M2,26h1v1h-1z M6,26h1v1h-1z M9,26h1v1h-1z M14,26h1v1h-1z M18,26h1v1h-1z M3,27h1v1h-1z M7,27h1v1h-1z M10,27h1v1h-1z M14,27h1v1h-1z M18,27h1v1h-1z M3,28h1v1h-1z M7,28h1v1h-1z M11,28h4v1h-4z M18,28h1v1h-1z M4,29h1v1h-1z M8,29h2v1h-2z M13,29h1v1h-1z M18,29h1v1h-1z M5,30h1v1h-1z M10,30h3v1h-3z M17,30h1v1h-1z M6,31h1v1h-1z M16,31h1v1h-1z M7,32h2v1h-2z M14,32h2v1h-2z M9,33h5v1h-5z"/><path fill="var(--pascal-shadow, #4ea32e)" d="M32,1h2v1h-2z M18,2h4v1h-4z M34,2h1v1h-1z M10,3h3v1h-3z M17,3h5v1h-5z M26,3h1v1h-1z M10,4h3v1h-3z M25,4h4v1h-4z M10,5h2v1h-2z M25,5h2v1h-2z M28,5h5v1h-5z M26,6h5v1h-5z M5,7h2v1h-2z M26,7h1v1h-1z M28,7h2v1h-2z M34,7h1v1h-1z M4,8h1v1h-1z M28,8h1v1h-1z M33,8h1v1h-1z M35,8h1v1h-1z M28,9h1v1h-1z M35,9h1v1h-1z M24,10h1v1h-1z M28,10h1v1h-1z M34,10h2v1h-2z M8,11h4v1h-4z M23,11h2v1h-2z M28,11h2v1h-2z M34,11h2v1h-2z M1,12h1v1h-1z M12,12h1v1h-1z M18,12h1v1h-1z M22,12h2v1h-2z M29,12h3v1h-3z M33,12h2v1h-2z M12,13h1v1h-1z M17,13h1v1h-1z M21,13h4v1h-4z M32,13h3v1h-3z M5,14h1v1h-1z M13,14h5v1h-5z M22,14h3v1h-3z M28,14h1v1h-1z M4,15h1v1h-1z M13,15h4v1h-4z M23,15h1v1h-1z M25,15h1v1h-1z M29,15h1v1h-1z M4,16h1v1h-1z M9,16h1v1h-1z M13,16h4v1h-4z M25,16h2v1h-2z M4,17h1v1h-1z M8,17h1v1h-1z M21,17h2v1h-2z M27,17h2v1h-2z M4,18h1v1h-1z M12,18h2v1h-2z M21,18h1v1h-1z M29,18h2v1h-2z M4,19h1v1h-1z M11,19h1v1h-1z M21,19h2v1h-2z M4,20h1v1h-1z M10,20h3v1h-3z M4,21h1v1h-1z M4,22h1v1h-1z M12,23h2v1h-2z M14,24h1v1h-1z M5,25h1v1h-1z M15,25h1v1h-1z M13,26h1v1h-1z M15,26h1v1h-1z M6,27h1v1h-1z M15,27h1v1h-1z M14,29h1v1h-1z M9,30h1v1h-1z"/><path fill="var(--pascal-body, #78cf36)" d="M29,2h1v1h-1z M29,3h2v1h-2z M17,4h4v1h-4z M29,4h4v1h-4z M12,5h1v1h-1z M16,5h5v1h-5z M33,5h1v1h-1z M10,6h4v1h-4z M16,6h5v1h-5z M24,6h2v1h-2z M34,6h1v1h-1z M10,7h4v1h-4z M15,7h6v1h-6z M23,7h3v1h-3z M27,7h1v1h-1z M35,7h1v1h-1z M5,8h3v1h-3z M10,8h11v1h-11z M22,8h6v1h-6z M4,9h5v1h-5z M10,9h18v1h-18z M36,9h1v1h-1z M5,10h19v1h-19z M25,10h3v1h-3z M36,10h1v1h-1z M2,11h1v1h-1z M6,11h2v1h-2z M12,11h11v1h-11z M25,11h3v1h-3z M36,11h1v1h-1z M2,12h10v1h-10z M13,12h5v1h-5z M19,12h3v1h-3z M24,12h5v1h-5z M35,12h2v1h-2z M2,13h10v1h-10z M13,13h4v1h-4z M18,13h3v1h-3z M25,13h7v1h-7z M35,13h1v1h-1z M3,14h2v1h-2z M6,14h6v1h-6z M18,14h3v1h-3z M25,14h3v1h-3z M32,14h4v1h-4z M1,15h3v1h-3z M5,15h7v1h-7z M18,15h3v1h-3z M24,15h1v1h-1z M26,15h3v1h-3z M1,16h3v1h-3z M5,16h4v1h-4z M10,16h2v1h-2z M18,16h3v1h-3z M27,16h3v1h-3z M1,17h3v1h-3z M6,17h2v1h-2z M10,17h2v1h-2z M19,17h2v1h-2z M29,17h3v1h-3z M2,18h2v1h-2z M10,18h2v1h-2z M16,18h1v1h-1z M20,18h1v1h-1z M31,18h4v1h-4z M3,19h1v1h-1z M10,19h1v1h-1z M1,20h3v1h-3z M2,21h2v1h-2z M3,22h1v1h-1z M12,22h3v1h-3z M4,23h1v1h-1z M9,23h1v1h-1z M11,23h1v1h-1z M14,23h1v1h-1z M2,24h3v1h-3z M9,24h3v1h-3z M15,24h1v1h-1z M17,24h1v1h-1z M3,25h2v1h-2z M9,25h2v1h-2z M16,25h2v1h-2z M3,26h3v1h-3z M12,26h1v1h-1z M16,26h2v1h-2z M5,27h1v1h-1z M11,27h3v1h-3z M16,27h1v1h-1z M6,28h1v1h-1z M15,28h1v1h-1z M5,29h3v1h-3z M15,29h3v1h-3z M6,30h1v1h-1z M8,30h1v1h-1z M13,30h1v1h-1z M15,30h2v1h-2z M9,31h2v1h-2z M12,31h2v1h-2z M9,32h2v1h-2z M13,32h1v1h-1z"/><path fill="var(--pascal-light, #ebf73c)" d="M29,1h3v1h-3z M13,2h5v1h-5z M22,2h2v1h-2z M30,2h4v1h-4z M13,3h4v1h-4z M22,3h4v1h-4z M31,3h4v1h-4z M8,4h2v1h-2z M13,4h4v1h-4z M21,4h4v1h-4z M33,4h3v1h-3z M7,5h3v1h-3z M13,5h3v1h-3z M21,5h4v1h-4z M34,5h2v1h-2z M6,6h4v1h-4z M14,6h2v1h-2z M21,6h3v1h-3z M31,6h2v1h-2z M35,6h2v1h-2z M7,7h3v1h-3z M14,7h1v1h-1z M21,7h2v1h-2z M30,7h1v1h-1z M33,7h1v1h-1z M36,7h2v1h-2z M8,8h2v1h-2z M21,8h1v1h-1z M29,8h1v1h-1z M31,8h2v1h-2z M34,8h1v1h-1z M36,8h2v1h-2z M3,9h1v1h-1z M9,9h1v1h-1z M29,9h1v1h-1z M31,9h1v1h-1z M34,9h1v1h-1z M37,9h2v1h-2z M2,10h3v1h-3z M29,10h1v1h-1z M32,10h2v1h-2z M37,10h2v1h-2z M3,11h3v1h-3z M30,11h2v1h-2z M37,11h3v1h-3z M37,12h3v1h-3z M1,13h1v1h-1z M36,13h4v1h-4z M1,14h2v1h-2z M29,14h3v1h-3z M36,14h4v1h-4z M32,15h5v1h-5z M38,15h2v1h-2z M30,16h2v1h-2z M35,16h4v1h-4z M32,17h3v1h-3z M1,18h1v1h-1z M35,18h1v1h-1z M1,19h2v1h-2z M2,22h1v1h-1z M10,22h2v1h-2z M15,22h1v1h-1z M2,23h2v1h-2z M10,23h1v1h-1z M15,23h2v1h-2z M16,24h1v1h-1z M11,25h1v1h-1z M10,26h2v1h-2z M4,27h1v1h-1z M17,27h1v1h-1z M4,28h2v1h-2z M16,28h2v1h-2z M7,30h1v1h-1z M14,30h1v1h-1z M7,31h2v1h-2z M11,31h1v1h-1z M14,31h2v1h-2z M11,32h2v1h-2z"/></svg>`;

const PASCAL_PALETAS = [
  { dark: '#000000', body: '#78cf36', shadow: '#4ea32e', light: '#ebf73c', nombre: 'Verde Camaleón' },
  { dark: '#2b1a04', body: '#f59e0b', shadow: '#b45309', light: '#fef08a', nombre: 'Amarillo Solar' },
  { dark: '#1e053a', body: '#a855f7', shadow: '#7e22ce', light: '#f0abfc', nombre: 'Púrpura Rapunzel' },
  { dark: '#2a0d05', body: '#d97706', shadow: '#9a3412', light: '#fed7aa', nombre: 'Terracota Ladrillo' },
  { dark: '#04242e', body: '#06b6d4', shadow: '#0e7490', light: '#a5f3fc', nombre: 'Turquesa Marino' },
  { dark: '#3b061d', body: '#ec4899', shadow: '#be185d', light: '#fbcfe8', nombre: 'Rosa Corona' },
  { dark: '#1c1917', body: '#78716c', shadow: '#44403c', light: '#e7e5e4', nombre: 'Tierra Topográfica' },
  { dark: '#3a0314', body: '#f43f5e', shadow: '#be123c', light: '#fecdd3', nombre: 'Rojo Rubí' },
  { dark: '#132604', body: '#84cc16', shadow: '#4d7c0f', light: '#d9f99d', nombre: 'Lima Neón' },
  { dark: '#300f04', body: '#ea580c', shadow: '#9a3412', light: '#fed7aa', nombre: 'Naranja Atardecer' },
  { dark: '#0b0d36', body: '#4f46e5', shadow: '#3730a3', light: '#c7d2fe', nombre: 'Azul Torre' },
  { dark: '#022118', body: '#10b981', shadow: '#047857', light: '#a7f3d0', nombre: 'Menta Esmeralda' },
  { dark: '#09090b', body: '#52525b', shadow: '#27272a', light: '#e4e4e7', nombre: 'Gris Grafito' },
  { dark: '#190333', body: '#9333ea', shadow: '#6b21a8', light: '#e9d5ff', nombre: 'Lavanda Mágica' },
  { dark: '#291802', body: '#eab308', shadow: '#a16207', light: '#fef9c3', nombre: 'Dorado Linterna' },
  { dark: '#240a45', body: '#ec4899', shadow: '#831843', light: '#facc15', nombre: '✨ Encantado', magico: true }
];

let clicsPascal = 0;
let indicePaletaPascal = 0;
let audioPascal = null;

let hoverCodigoActual = null;

const estado = {
  componentes: [],
  agrupaciones: [],
  plan: [],
  asignaturas: new Map(),   // codigo -> asignatura
  dependientes: new Map(),  // codigo -> códigos que lo piden como prerrequisito
  seleccion: null,          // código de la asignatura abierta en el detalle
  componente: null,         // pestaña activa del catálogo
  agrupacion: null,         // agrupación activa del catálogo
  tipo: 'todas',            // todas | obligatorias | optativas
  pagina: 1,
};

const buscarComponente = (id) => estado.componentes.find((c) => c.id === id);
const buscarAgrupacion = (id) => estado.agrupaciones.find((a) => a.id === id);
const colorDe = (asignatura) => buscarComponente(buscarAgrupacion(asignatura.agrupacion).componente).color;
const creditosTexto = (creditos) => (creditos ?? '—');


/* ---------- Carga ---------- */

function prepararDatos([componentes, plan, asignaturas]) {
  estado.componentes = componentes.componentes;
  estado.agrupaciones = componentes.agrupaciones;
  estado.plan = plan;
  asignaturas.forEach((a) => estado.asignaturas.set(a.codigo, a));

  // Inverso de "prerrequisitos": de qué materias es requisito cada una
  asignaturas.forEach((a) => a.prerrequisitos.forEach((p) => {
    if (!estado.dependientes.has(p)) estado.dependientes.set(p, []);
    estado.dependientes.get(p).push(a.codigo);
  }));

  const totalCreditos = plan.reduce((suma, s) => suma + s.creditos, 0);
  $('#malla-antetitulo').textContent = `${plan.length} semestres · ${totalCreditos} créditos`;
}

/* ---------- Estado del Progreso del Estudiante ---------- */
const estadoProgreso = {
  activo: true,               // Si el sombreado de aprobadas está encendido
  historia: null,             // Objeto historia parseado desde avance-lector.js
  mapaProgreso: new Map(),    // Índice rápido 'cod:...' y 'nom:...' -> registro de materia
  bolsasCumplidas: new Set(), // IDs de bolsas cumplidas en la malla ('b-semestre-pos')
  aprobadasPlan: 0,
  creditosAprobadosPlan: 0,
  totalPlanAsignaturas: 0,
  porcentajePlan: 0,
};

const PRIORIDAD_ESTADO = {
  APROBADA: 4,
  VALIDADA: 4,
  CONVALIDADA: 4,
  'EN CURSO': 3,
  CURSANDO: 3,
  INSCRITA: 3,
  REPROBADA: 2,
  CANCELADA: 1,
};

const normalizarNombre = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const baseCodigo = (c) => String(c || '').toUpperCase().trim().replace(/-[A-Z0-9]+$/, '');

/* Indexa las asignaturas aprobadas / en curso de la historia académica */
function crearIndiceProgreso(historia) {
  estadoProgreso.mapaProgreso.clear();
  if (!historia?.materias?.length) return;

  for (const m of historia.materias) {
    const estadoNorm = (m.estado || '').toUpperCase().trim();
    const registro = {
      ...m,
      estado: estadoNorm,
      prioridad: PRIORIDAD_ESTADO[estadoNorm] || 0,
    };

    const registrar = (clave) => {
      const previo = estadoProgreso.mapaProgreso.get(clave);
      if (!previo || registro.prioridad > previo.prioridad) {
        estadoProgreso.mapaProgreso.set(clave, registro);
      }
    };

    const codExacto = String(m.codigo || '').trim().toUpperCase();
    const codBase = baseCodigo(m.codigo);
    const nomNorm = normalizarNombre(m.nombre);

    if (codExacto) registrar('cod:' + codExacto);
    if (codBase) registrar('cod:' + codBase);
    if (nomNorm) registrar('nom:' + nomNorm);
  }

  calcularBolsasCumplidas(historia);
  actualizarMetricasPlan();
}

/* Consulta el estado de una asignatura en el avance del estudiante */
function consultarProgresoMateria(codigo) {
  if (!estadoProgreso.activo || !estadoProgreso.historia) return null;
  const asig = estado.asignaturas.get(codigo);
  const codExacto = String(codigo || '').trim().toUpperCase();
  const codBase = baseCodigo(codigo);
  const nomNorm = asig ? normalizarNombre(asig.nombre) : '';
  const map = estadoProgreso.mapaProgreso;

  return (codExacto ? map.get('cod:' + codExacto) : null)
    ?? (codBase ? map.get('cod:' + codBase) : null)
    ?? (nomNorm ? map.get('nom:' + nomNorm) : null)
    ?? null;
}

/* Calcula qué casillas optativas o de libre elección ya fueron satisfechas */
function calcularBolsasCumplidas(historia) {
  estadoProgreso.bolsasCumplidas.clear();
  if (!historia?.materias) return;

  const creditosPorBolsa = {
    'libre-eleccion-idiomas': 0,
    'optativas-disciplinares': 0,
    'optativas-fundamentacion': 0,
  };

  for (const m of historia.materias) {
    if (!['APROBADA', 'VALIDADA', 'CONVALIDADA'].includes((m.estado || '').toUpperCase())) continue;
    const tip = (m.tipologia || '').toUpperCase();
    const cr = m.creditos || 0;

    const a = estado.asignaturas.get(m.codigo) || estado.asignaturas.get(baseCodigo(m.codigo));
    if (a && !a.obligatoria && creditosPorBolsa[a.agrupacion] !== undefined) {
      creditosPorBolsa[a.agrupacion] += cr;
    } else if (tip.includes('LIBRE')) {
      creditosPorBolsa['libre-eleccion-idiomas'] += cr;
    } else if (tip.includes('FUND. OPTATIVA')) {
      creditosPorBolsa['optativas-fundamentacion'] += cr;
    } else if (tip.includes('DISCIPLINAR OPTATIVA')) {
      creditosPorBolsa['optativas-disciplinares'] += cr;
    }
  }

  if (historia.resumen) {
    if (historia.resumen['LIBRE ELECCIÓN']?.aprobados) {
      creditosPorBolsa['libre-eleccion-idiomas'] = Math.max(creditosPorBolsa['libre-eleccion-idiomas'], historia.resumen['LIBRE ELECCIÓN'].aprobados);
    }
    if (historia.resumen['FUND. OPTATIVA']?.aprobados) {
      creditosPorBolsa['optativas-fundamentacion'] = Math.max(creditosPorBolsa['optativas-fundamentacion'], historia.resumen['FUND. OPTATIVA'].aprobados);
    }
    if (historia.resumen['DISCIPLINAR OPTATIVA']?.aprobados) {
      creditosPorBolsa['optativas-disciplinares'] = Math.max(creditosPorBolsa['optativas-disciplinares'], historia.resumen['DISCIPLINAR OPTATIVA'].aprobados);
    }
  }

  const disponibles = { ...creditosPorBolsa };

  for (const s of estado.plan) {
    s.items.forEach((item, pos) => {
      if (item.tipo === 'bolsa') {
        const ag = item.agrupacion;
        let cump = false;
        if (disponibles[ag] >= item.creditos) {
          disponibles[ag] -= item.creditos;
          cump = true;
        }
        if (cump) {
          estadoProgreso.bolsasCumplidas.add(`b-${s.semestre}-${pos}`);
        }
      }
    });
  }
}

/* Calcula el total de asignaturas obligatorias y créditos cumplidos del plan */
function actualizarMetricasPlan() {
  let aprobadas = 0;
  let creditosAprobados = 0;
  let totalAsignaturas = 0;

  for (const semestre of estado.plan) {
    semestre.items.forEach((item, pos) => {
      if (item.tipo === 'asignatura') {
        totalAsignaturas += 1;
        const prog = consultarProgresoMateria(item.codigo);
        if (prog && ['APROBADA', 'VALIDADA', 'CONVALIDADA'].includes(prog.estado)) {
          aprobadas += 1;
          creditosAprobados += (estado.asignaturas.get(item.codigo)?.creditos || 0);
        }
      } else if (item.tipo === 'bolsa' && estadoProgreso.bolsasCumplidas.has(`b-${semestre.semestre}-${pos}`)) {
        creditosAprobados += (item.creditos || 0);
      }
    });
  }

  Object.assign(estadoProgreso, {
    aprobadasPlan: aprobadas,
    totalPlanAsignaturas: totalAsignaturas,
    creditosAprobadosPlan: creditosAprobados,
    porcentajePlan: Math.min(100, (creditosAprobados / 180) * 100),
  });
}

/* Carga el progreso desde localStorage 'construccion.avance.v1' */
function cargarProgresoUsuario() {
  let textoHistoria = '';
  let nombreUsuario = '';

  try {
    const guardado = JSON.parse(localStorage.getItem('construccion.avance.v1') || '{}');
    if (guardado.texto) {
      textoHistoria = guardado.texto;
      nombreUsuario = guardado.nombre || '';
    }
  } catch {}

  if (textoHistoria && typeof leerHistoria === 'function') {
    try {
      const historia = leerHistoria(textoHistoria);
      if (historia && (historia.materias?.length || Object.keys(historia.resumen || {}).length)) {
        estadoProgreso.historia = historia;
        if (!nombreUsuario && historia.nombre) nombreUsuario = historia.nombre;
        crearIndiceProgreso(historia);
      }
    } catch (e) {
      console.warn('Error procesando historia en la malla de Construcción:', e);
    }
  }

  actualizarBannerSesion(nombreUsuario);
}

/* Actualiza el panel superior de sesión o el aviso de invitación */
function actualizarBannerSesion(nombreUsuario) {
  const sesionEl = $('#malla-sesion');
  const invitadoEl = $('#malla-invitado');
  const tieneProgreso = Boolean(estadoProgreso.historia && estadoProgreso.historia.materias?.length);

  if (invitadoEl) invitadoEl.hidden = tieneProgreso;
  if (!sesionEl) return;
  sesionEl.hidden = !tieneProgreso;

  if (tieneProgreso) {
    const nombreEl = $('#malla-usuario-nombre');
    if (nombreEl) nombreEl.textContent = nombreUsuario || estadoProgreso.historia?.nombre || 'Estudiante';

    const resumenEl = $('#malla-resumen-texto');
    if (resumenEl) {
      const pct = (estadoProgreso.historia?.porcentajeSia != null)
        ? Number(estadoProgreso.historia.porcentajeSia).toFixed(1)
        : estadoProgreso.porcentajePlan.toFixed(1);
      resumenEl.textContent = `Has aprobado ${estadoProgreso.aprobadasPlan} asignaturas obligatorias (${estadoProgreso.creditosAprobadosPlan} créditos cumplidos) · ${pct} % de avance general`;
    }
  }
}

/* Control del botón switch para alternar el sombreado */
function iniciarControlesSesion() {
  const btnToggle = $('#btn-toggle-sombreado');
  if (btnToggle) {
    btnToggle.addEventListener('click', () => {
      estadoProgreso.activo = !estadoProgreso.activo;
      btnToggle.classList.toggle('is-activo', estadoProgreso.activo);
      btnToggle.setAttribute('aria-pressed', String(estadoProgreso.activo));
      const label = btnToggle.querySelector('.malla-sesion__btn-toggle-label');
      if (label) label.textContent = estadoProgreso.activo ? 'Sombrear aprobadas' : 'Ver malla limpia';
      pintarMalla();
      pintarLeyenda();
    });
  }
}

Promise.all([cargarDatos('malla/componentes'), cargarDatos('malla/plan'), cargarDatos('malla/asignaturas')])
  .then((datos) => {
    prepararDatos(datos);
    cargarProgresoUsuario();
    iniciarControlesSesion();
    pintarLeyenda();
    pintarMalla();
    iniciarCatalogo();
    leerDireccion();
  })
  .catch((error) => mostrarErrorDeCarga($('#malla-rejilla'), error));


/* ---------- Convenciones ---------- */

function pintarLeyenda() {
  const componentes = estado.componentes
    .map((c) => `<li><span class="leyenda__punto" style="--color: ${c.color}"></span>${esc(c.nombre)}</li>`)
    .join('');

  const progresoLeyenda = (estadoProgreso.activo && estadoProgreso.historia)
    ? `<li><span class="leyenda__punto leyenda__punto--aprobada"></span>Aprobada / Cumplida</li>
       <li><span class="leyenda__punto leyenda__punto--curso"></span>En curso</li>`
    : '';

  $('#leyenda').innerHTML = `
    ${componentes}
    ${progresoLeyenda}
    <li><span class="leyenda__aro" style="--color: var(--arcilla)"></span>Prerrequisito (te pide)</li>
    <li><span class="leyenda__aro" style="--color: var(--cemento-calido)"></span>Te abre (se abre después)</li>`;
}


/* ---------- Malla ---------- */

function casillaAsignatura(codigo) {
  const a = estado.asignaturas.get(codigo);
  const wppIndicador = a.whatsapp ? `<span class="materia__wpp-punto" title="Grupo de WhatsApp disponible">💬</span>` : '';

  let claseEstado = '';
  let estadoAria = '';
  let badgeHtml = '';

  if (estadoProgreso.activo) {
    const prog = consultarProgresoMateria(codigo);
    if (prog) {
      if (['APROBADA', 'VALIDADA', 'CONVALIDADA'].includes(prog.estado)) {
        claseEstado = ' materia--aprobada';
        estadoAria = ', aprobada';
        const notaTooltip = (prog.nota != null) ? ` · Nota: ${Number(prog.nota).toFixed(1)}` : '';
        badgeHtml = `<span class="materia__tag-aprobada" title="Asignatura aprobada${notaTooltip}">✓</span>`;
      } else if (['EN CURSO', 'CURSANDO', 'INSCRITA'].includes(prog.estado)) {
        claseEstado = ' materia--en-curso';
        estadoAria = ', en curso';
        badgeHtml = `<span class="materia__tag-curso" title="Matriculada este período">En curso</span>`;
      }
    }
  }

  return `
    <li>
      <button class="materia${claseEstado} ${a.whatsapp ? 'materia--con-wpp' : ''}" type="button" data-codigo="${esc(codigo)}" data-agrupacion="${esc(a.agrupacion)}"
        style="--color: ${colorDe(a)}" aria-label="${esc(a.nombre)}, ${a.creditos} créditos${estadoAria}${a.whatsapp ? ', con grupo de WhatsApp' : ''}">
        <span class="materia__nombre">${esc(a.nombre)}</span>
        <span class="materia__cred">${a.creditos}</span>
        <span class="materia__codigo">
          <span class="materia__codigo-num">${esc(a.codigo)}${wppIndicador}</span>
          ${badgeHtml}
        </span>
      </button>
    </li>`;
}

function casillaBolsa(bolsa, semestre, posicion) {
  const agrupacion = buscarAgrupacion(bolsa.agrupacion);
  const color = buscarComponente(agrupacion.componente).color;
  const bolsaId = `b-${semestre}-${posicion}`;
  const estaCumplida = estadoProgreso.activo && estadoProgreso.bolsasCumplidas.has(bolsaId);

  const claseCumplida = estaCumplida ? ' materia--aprobada materia--bolsa-cumplida' : '';
  const textoBolsa = estaCumplida
    ? 'Cumplida'
    : (bolsa.agrupacion === 'libre-eleccion-idiomas' || bolsa.agrupacion === 'libre-eleccion' ? 'a tu elección' : 'ver opciones');
  const badgeHtml = estaCumplida
    ? '<span class="materia__tag-aprobada" title="Casilla cumplida">✓</span>'
    : '';

  return `
    <li>
      <button class="materia materia--bolsa${claseCumplida}" type="button" data-bolsa="${esc(bolsa.agrupacion)}"
        data-id="${bolsaId}" data-agrupacion="${esc(bolsa.agrupacion)}"
        data-creditos="${bolsa.creditos}" data-nombre="${esc(bolsa.nombre)}"
        ${estaCumplida ? 'data-cumplida="true"' : ''}
        style="--color: ${color}" aria-label="${esc(bolsa.nombre)}, ${bolsa.creditos} créditos${estaCumplida ? ', cumplida' : ''}">
        <span class="materia__nombre">${esc(bolsa.nombre)}</span>
        <span class="materia__cred">${bolsa.creditos}</span>
        <span class="materia__codigo">
          <span class="materia__codigo-num">${esc(textoBolsa)}</span>
          ${badgeHtml}
        </span>
      </button>
    </li>`;
}

function pintarMalla() {
  $('#malla-rejilla').innerHTML = `
    <div class="rejilla" id="rejilla">
      ${estado.plan.map((semestre) => `
        <section class="semestre" aria-label="Semestre ${ROMANOS[semestre.semestre - 1]}">
          <div class="semestre__cabeza">
            <h3>Semestre ${ROMANOS[semestre.semestre - 1]}</h3>
            <p>Créditos ${semestre.creditos}</p>
          </div>
          <ul class="semestre__lista">
            ${semestre.items.map((item, i) => item.tipo === 'asignatura'
              ? casillaAsignatura(item.codigo)
              : casillaBolsa(item, semestre.semestre, i)).join('')}
          </ul>
        </section>`).join('')}
    </div>`;

  const rejilla = $('#rejilla');

  rejilla.addEventListener('click', (evento) => {
    const boton = evento.target.closest('.materia');
    if (!boton) return;
    if (boton.dataset.codigo) seleccionar(boton.dataset.codigo);
    else seleccionarBolsa(boton);
  });

  // Al pasar el cursor por encima de cualquier asignatura, marca sus prerrequisitos y lo que te abre
  rejilla.addEventListener('pointerover', (evento) => {
    const boton = evento.target.closest('.materia[data-codigo]');
    if (!boton) return;
    const codigo = boton.dataset.codigo;
    if (codigo === hoverCodigoActual) return;
    hoverCodigoActual = codigo;
    marcarRelaciones(codigo);
  });

  rejilla.addEventListener('pointerout', (evento) => {
    const boton = evento.target.closest('.materia[data-codigo]');
    if (!boton) return;
    const proximoBoton = evento.relatedTarget?.closest?.('.materia[data-codigo]');
    if (proximoBoton) {
      if (proximoBoton.dataset.codigo !== hoverCodigoActual) {
        hoverCodigoActual = proximoBoton.dataset.codigo;
        marcarRelaciones(hoverCodigoActual);
      }
      return;
    }
    // Salió del botón o pasó a un espacio no interactivo
    hoverCodigoActual = null;
    marcarRelaciones(estado.seleccion);
  });

  rejilla.addEventListener('pointerleave', () => {
    hoverCodigoActual = null;
    marcarRelaciones(estado.seleccion);
  });
}

// Marca en la malla la materia elegida o sobre la que está el cursor, sus prerrequisitos y las materias que abre
function marcarRelaciones(codigo) {
  const rejilla = $('#rejilla');
  if (!rejilla) return;
  rejilla.classList.toggle('hay-seleccion', Boolean(codigo));
  $$('.materia', rejilla).forEach((boton) => boton.classList.remove('es-seleccion', 'es-prerreq', 'es-dependiente'));
  if (!codigo) return;

  const asignatura = estado.asignaturas.get(codigo);
  if (!asignatura) return;

  const marcar = (cod, clase) => $$(`.materia[data-codigo="${CSS.escape(cod)}"]`, rejilla).forEach((b) => b.classList.add(clase));
  marcar(codigo, 'es-seleccion');
  asignatura.prerrequisitos.forEach((p) => marcar(p, 'es-prerreq'));
  (estado.dependientes.get(codigo) || []).forEach((d) => marcar(d, 'es-dependiente'));
}


/* ---------- Detalle ---------- */

/* ---------- Funciones Easter Egg: Pascal ---------- */

function aplicarPaletaPascal(elemento, paleta) {
  if (!elemento || !paleta) return;
  elemento.style.setProperty('--pascal-dark', paleta.dark);
  elemento.style.setProperty('--pascal-body', paleta.body);
  elemento.style.setProperty('--pascal-shadow', paleta.shadow || paleta.dark);
  elemento.style.setProperty('--pascal-light', paleta.light);
}

function lanzarParticulasPascal(contenedor) {
  const particulasWrap = $('.pascal-camaleon__particulas', contenedor);
  if (!particulasWrap) return;
  const iconos = ['🎵', '✨', '🎶', '🌟', '🦎'];
  particulasWrap.innerHTML = iconos.map((ico, i) =>
    `<span class="pascal-nota pascal-nota--${i + 1}" style="--delay: ${i * 0.15}s; --x: ${(i - 2) * 12}px;">${ico}</span>`
  ).join('');
}

function iniciarMusicaPascal() {
  if (!audioPascal) {
    audioPascal = new Audio('audio/pascal.mp3');
    audioPascal.volume = 0.85;
    audioPascal.addEventListener('ended', () => {
      const player = $('#pascal-player');
      player?.remove();
      const btn = $('#pascal-camaleon');
      btn?.classList.remove('is-playing');
    });
  }
  audioPascal.currentTime = 0;
  audioPascal.play().catch((err) => console.log('Audio autoplay prevented:', err));
  mostrarPildoraMusica();
}

function mostrarPildoraMusica() {
  let player = $('#pascal-player');
  if (!player) {
    player = document.createElement('div');
    player.id = 'pascal-player';
    player.className = 'pascal-player is-visible';
    player.setAttribute('role', 'region');
    player.setAttribute('aria-label', 'Reproductor de música de Pascal');
    player.innerHTML = `
      <div class="pascal-player__icono" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
          <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
        </svg>
      </div>
      <div class="pascal-player__info">
        <span class="pascal-player__titulo">Enchanted</span>
        <span class="pascal-player__sub">Easter egg desbloqueado · Pascal ✨</span>
      </div>
      <button class="pascal-player__btn" id="pascal-player-toggle" type="button" aria-label="Pausar o reanudar canción">
        <svg id="pascal-player-icono-pause" viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        <svg id="pascal-player-icono-play" style="display:none;" viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </button>
      <button class="pascal-player__cerrar" id="pascal-player-cerrar" type="button" aria-label="Cerrar reproductor">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" width="13" height="13"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;
    document.body.appendChild(player);

    $('#pascal-player-toggle', player)?.addEventListener('click', () => {
      if (!audioPascal) return;
      if (audioPascal.paused) {
        audioPascal.play().catch(() => {});
        actualizarEstadoReproductor(true);
      } else {
        audioPascal.pause();
        actualizarEstadoReproductor(false);
      }
    });

    $('#pascal-player-cerrar', player)?.addEventListener('click', () => {
      if (audioPascal) {
        audioPascal.pause();
        audioPascal.currentTime = 0;
      }
      player.classList.remove('is-visible');
      setTimeout(() => player.remove(), 250);
      const btn = $('#pascal-camaleon');
      btn?.classList.remove('is-playing');
    });
  } else {
    player.classList.add('is-visible');
    actualizarEstadoReproductor(true);
  }
}

function actualizarEstadoReproductor(reproduciendo) {
  const icoPause = $('#pascal-player-icono-pause');
  const icoPlay = $('#pascal-player-icono-play');
  if (icoPause && icoPlay) {
    icoPause.style.display = reproduciendo ? 'block' : 'none';
    icoPlay.style.display = reproduciendo ? 'none' : 'block';
  }
  const btn = $('#pascal-camaleon');
  if (btn) {
    btn.classList.toggle('is-playing', reproduciendo);
  }
}

function iniciarEasterEggPascal() {
  const btn = $('#pascal-camaleon');
  if (!btn) return;

  const paletaActual = PASCAL_PALETAS[indicePaletaPascal];
  aplicarPaletaPascal(btn, paletaActual);

  if (audioPascal && !audioPascal.paused) {
    btn.classList.add('is-playing');
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    clicsPascal++;
    indicePaletaPascal = (indicePaletaPascal + 1) % PASCAL_PALETAS.length;
    const paleta = PASCAL_PALETAS[indicePaletaPascal];
    aplicarPaletaPascal(btn, paleta);

    // Animación de pulso
    btn.classList.remove('is-pulsing');
    void btn.offsetWidth;
    btn.classList.add('is-pulsing');

    // Al llegar a 16 clics: ¡suena la canción!
    if (clicsPascal === 16) {
      btn.classList.add('is-playing');
      lanzarParticulasPascal(btn);
      iniciarMusicaPascal();
    } else if (clicsPascal > 16 && audioPascal) {
      // Alternar pausa / reproducción en clics posteriores
      if (audioPascal.paused) {
        audioPascal.play().catch(() => {});
        btn.classList.add('is-playing');
        actualizarEstadoReproductor(true);
      } else {
        audioPascal.pause();
        btn.classList.remove('is-playing');
        actualizarEstadoReproductor(false);
      }
    }
  });
}

const fichaMateria = (codigo, clase = '') => {
  const a = estado.asignaturas.get(codigo);
  return `
    <li><button class="ficha-materia ${clase}" type="button" data-ir="${esc(codigo)}" style="--color: ${colorDe(a)}">
      ${esc(a.nombre)} <small>${esc(a.codigo)}</small>
    </button></li>`;
};

function textoAvance(requisito) {
  const nombre = requisito.componente === 'fundamentacion' ? 'Fundamentación' : 'Formación Disciplinar o Profesional';
  return `${requisito.porcentaje} % de avance en el componente de ${nombre}`;
}

function pintarDetalle(contenidoHtml, color) {
  const detalle = $('#detalle');
  detalle.style.setProperty('--color', color);
  detalle.innerHTML = `<button class="detalle__cerrar" type="button" aria-label="Cerrar detalle">✕</button>${contenidoHtml}`;
  detalle.hidden = false;
  document.body.classList.add('con-detalle');
}

function cerrarDetalle() {
  estado.seleccion = null;
  hoverCodigoActual = null;
  $('#detalle').hidden = true;
  document.body.classList.remove('con-detalle');
  if ($('#rejilla')) marcarRelaciones(null);
  guardarDireccion();
}

function seleccionar(codigo, { desplazar = false } = {}) {
  const a = estado.asignaturas.get(codigo);
  if (!a) return;
  estado.seleccion = codigo;

  const agrupacion = buscarAgrupacion(a.agrupacion);
  const componente = buscarComponente(agrupacion.componente);
  const dependientes = estado.dependientes.get(codigo) || [];
  const semestre = a.semestre ? `Semestre ${ROMANOS[a.semestre - 1]}` : 'Optativa · sin semestre fijo';
  const esTopografia = a.codigo === '3007401' || a.nombre.toLowerCase().includes('topograf');

  const bloqueWhatsapp = a.whatsapp ? `
    <div class="detalle__bloque detalle__bloque--whatsapp">
      <h4>Comunidad de WhatsApp</h4>
      <a class="detalle__whatsapp-boton" href="${esc(a.whatsapp)}" target="_blank" rel="noopener noreferrer">
        ${ICONO_WHATSAPP}
        <span>Unirse al grupo de WhatsApp</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" width="15" height="15" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </a>
    </div>` : '';

  pintarDetalle(`
    <div class="detalle__cabeza">
      <div class="detalle__codigo-fila">
        <p class="detalle__codigo">Código ${esc(a.codigo)}</p>
        ${esTopografia ? `
          <div class="pascal-widget" id="pascal-widget">
            <button class="pascal-camaleon" id="pascal-camaleon" type="button" aria-label="Pascal el camaleón (Easter Egg)">
              ${SVG_PASCAL}
              <span class="pascal-camaleon__particulas" aria-hidden="true"></span>
            </button>
          </div>` : ''}
      </div>
      <h3>${esc(a.nombre)}</h3>
      <ul class="etiquetas">
        <li class="etiqueta etiqueta--cred">${creditosTexto(a.creditos)} ${a.creditos === 1 ? 'crédito' : 'créditos'}</li>
        <li class="etiqueta etiqueta--comp">${esc(componente.nombre)}</li>
        <li class="etiqueta">${esc(agrupacion.nombre)}</li>
        <li class="etiqueta">${a.obligatoria ? 'Obligatoria' : 'Optativa'}</li>
        <li class="etiqueta">${esc(semestre)}</li>
        ${a.whatsapp ? `<li class="etiqueta etiqueta--wpp"><a href="${esc(a.whatsapp)}" target="_blank" rel="noopener noreferrer" title="Abrir grupo de WhatsApp">${ICONO_WHATSAPP} WhatsApp</a></li>` : ''}
      </ul>
    </div>
    <div class="detalle__cuerpo">
      ${bloqueWhatsapp}
      <div class="detalle__bloque">
        <h4>Prerrequisitos</h4>
        ${a.prerrequisitos.length
          ? `<ul class="fichas">${a.prerrequisitos.map((p) => fichaMateria(p, 'ficha-materia--prerreq')).join('')}</ul>`
          : '<p class="detalle__vacio">No tiene prerrequisitos.</p>'}
        ${a.requisitosAvance ? `<ul class="detalle__avance">${a.requisitosAvance.map((r) => `<li>${esc(textoAvance(r))}</li>`).join('')}</ul>` : ''}
      </div>
      <div class="detalle__bloque">
        <h4>Es prerrequisito de</h4>
        ${dependientes.length
          ? `<ul class="fichas">${dependientes.map((d) => fichaMateria(d)).join('')}</ul>`
          : '<p class="detalle__vacio">No es prerrequisito de otra asignatura.</p>'}
      </div>
      ${a.porConfirmar ? `<p class="detalle__confirmar"><strong>Dato por confirmar.</strong> ${esc(a.porConfirmar)}</p>` : ''}
    </div>`, colorDe(a));

  if (esTopografia) {
    iniciarEasterEggPascal();
  }

  marcarRelaciones(codigo);
  if (desplazar) {
    $(`.materia[data-codigo="${CSS.escape(codigo)}"]`)?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }
  guardarDireccion();
}

// Casilla de "Optativa de…" o "Libre elección": explica de qué se trata y lleva a la lista de opciones
function seleccionarBolsa(boton) {
  const agrupacion = buscarAgrupacion(boton.dataset.bolsa);
  const componente = buscarComponente(agrupacion.componente);
  const esLibre = agrupacion.id === 'libre-eleccion';

  estado.seleccion = null;
  marcarRelaciones(null);
  $$('.materia--bolsa.es-seleccion').forEach((b) => b.classList.remove('es-seleccion'));
  boton.classList.add('es-seleccion');

  pintarDetalle(`
    <div class="detalle__cabeza">
      <p class="detalle__codigo">Casilla de la malla</p>
      <h3>${esc(boton.dataset.nombre)}</h3>
      <ul class="etiquetas">
        <li class="etiqueta etiqueta--cred">${esc(boton.dataset.creditos)} créditos</li>
        <li class="etiqueta etiqueta--comp">${esc(componente.nombre)}</li>
        ${esLibre ? '' : `<li class="etiqueta">${esc(agrupacion.nombre)}</li>`}
      </ul>
    </div>
    <div class="detalle__cuerpo">
      <p class="detalle__vacio">${esLibre
        ? 'Esta casilla corresponde al componente de libre elección: no tiene una asignatura fija en la malla.'
        : `Aquí se cursa una optativa de la agrupación «${esc(agrupacion.nombre)}». El programa exige ${agrupacion.exigidos} créditos en total en esta agrupación; la lista con sus prerrequisitos está más abajo.`}</p>
      ${esLibre ? '' : '<button class="detalle__boton" type="button" data-ver-opciones>Ver las opciones</button>'}
    </div>`, componente.color);

  $('#detalle').dataset.bolsa = boton.dataset.bolsa;
  guardarDireccion();
}

$('#detalle').addEventListener('click', (evento) => {
  if (evento.target.closest('.detalle__cerrar')) return cerrarDetalle();

  const ir = evento.target.closest('[data-ir]');
  if (ir) return seleccionar(ir.dataset.ir, { desplazar: true });

  if (evento.target.closest('[data-ver-opciones]')) {
    const agrupacion = buscarAgrupacion($('#detalle').dataset.bolsa);
    estado.componente = agrupacion.componente;
    estado.agrupacion = agrupacion.id;
    estado.tipo = 'optativas';
    estado.pagina = 1;
    pintarCatalogo();
    $('#asignaturas').scrollIntoView({ behavior: 'smooth' });
    guardarDireccion();
  }
});

document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape' && !$('#detalle').hidden) cerrarDetalle();
});


/* ---------- Catálogo por componente (paginado) ---------- */

function iniciarCatalogo() {
  estado.componente = estado.componentes[0].id;
  estado.agrupacion = null;

  $('#pestanas').setAttribute('role', 'tablist');
  $('#pestanas').addEventListener('click', (evento) => {
    const pestana = evento.target.closest('[data-componente]');
    if (!pestana) return;
    estado.componente = pestana.dataset.componente;
    estado.agrupacion = null;
    estado.tipo = 'todas';
    estado.pagina = 1;
    pintarCatalogo();
    guardarDireccion();
  });

  $('#agrupaciones').addEventListener('click', (evento) => {
    const pildora = evento.target.closest('[data-agrupacion]');
    if (!pildora) return;
    estado.agrupacion = pildora.dataset.agrupacion;
    estado.tipo = 'todas';
    estado.pagina = 1;
    pintarCatalogo();
    guardarDireccion();
  });

  $('#resumen-agrupacion').addEventListener('click', (evento) => {
    const filtro = evento.target.closest('[data-tipo]');
    if (!filtro) return;
    estado.tipo = filtro.dataset.tipo;
    estado.pagina = 1;
    pintarCatalogo();
    guardarDireccion();
  });

  $('#catalogo').addEventListener('click', (evento) => {
    const tarjeta = evento.target.closest('[data-codigo]');
    if (tarjeta) seleccionar(tarjeta.dataset.codigo);
  });

  $('#paginacion').addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-pagina]');
    if (!boton || boton.disabled) return;
    estado.pagina = Number(boton.dataset.pagina);
    pintarCatalogo();
    $('#asignaturas-titulo').scrollIntoView({ behavior: 'smooth', block: 'start' });
    guardarDireccion();
  });

  pintarCatalogo();
}

// Obligatorias primero (por semestre) y luego las optativas por nombre
function ordenar(a, b) {
  if (a.obligatoria !== b.obligatoria) return a.obligatoria ? -1 : 1;
  if (a.obligatoria) return (a.semestre ?? 99) - (b.semestre ?? 99) || a.nombre.localeCompare(b.nombre, 'es');
  return a.nombre.localeCompare(b.nombre, 'es');
}

function pintarCatalogo() {
  // Pestañas de componente
  $('#pestanas').innerHTML = estado.componentes.map((c) => `
    <button class="pestana" type="button" role="tab" data-componente="${esc(c.id)}"
      aria-selected="${c.id === estado.componente}" style="--color: ${c.color}">${esc(c.nombre)}</button>`).join('');

  // Agrupaciones del componente elegido
  const delComponente = estado.agrupaciones.filter((a) => a.componente === estado.componente);
  if (!delComponente.some((a) => a.id === estado.agrupacion)) estado.agrupacion = delComponente[0].id;
  $('#agrupaciones').innerHTML = delComponente.length > 1
    ? delComponente.map((a) => `
        <button class="pildora" type="button" data-agrupacion="${esc(a.id)}"
          aria-pressed="${a.id === estado.agrupacion}">${esc(a.nombre)}</button>`).join('')
    : '';

  const agrupacion = buscarAgrupacion(estado.agrupacion);
  const todas = [...estado.asignaturas.values()].filter((a) => a.agrupacion === agrupacion.id).sort(ordenar);
  const hayAmbas = todas.some((a) => a.obligatoria) && todas.some((a) => !a.obligatoria);
  if (!hayAmbas) estado.tipo = 'todas';
  const filtradas = todas.filter((a) =>
    estado.tipo === 'todas' || (estado.tipo === 'obligatorias' ? a.obligatoria : !a.obligatoria));

  // Resumen de créditos de la agrupación (los números del programa curricular)
  const filtro = hayAmbas ? `
    <span class="filtro" role="group" aria-label="Tipo de asignatura">
      ${[['todas', 'Todas'], ['obligatorias', 'Obligatorias'], ['optativas', 'Optativas']].map(([id, texto]) =>
        `<button type="button" data-tipo="${id}" aria-pressed="${estado.tipo === id}">${texto}</button>`).join('')}
    </span>` : '';
  $('#resumen-agrupacion').innerHTML = agrupacion.exigidos === undefined ? '' : `
    <div class="resumen">
      <span><strong>${esc(agrupacion.nombre)}</strong> · créditos exigidos: <strong>${agrupacion.exigidos}</strong></span>
      <span class="resumen__oblig">Obligatorios: ${agrupacion.obligatorios}</span>
      <span class="resumen__optat">Optativos: ${agrupacion.optativos}</span>
      ${filtro}
    </div>`;

  // Página actual
  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  estado.pagina = Math.min(Math.max(1, estado.pagina), totalPaginas);
  const inicio = (estado.pagina - 1) * POR_PAGINA;
  const visibles = filtradas.slice(inicio, inicio + POR_PAGINA);

  $('#catalogo').innerHTML = agrupacion.id === 'libre-eleccion' || agrupacion.id === 'libre-eleccion-idiomas'
    ? `<li class="catalogo__vacio">El componente de libre elección no tiene asignaturas fijas: se cursa en las casillas «Libre elección» de la malla.</li>`
    : visibles.map((a) => {
        const prog = estadoProgreso.activo ? consultarProgresoMateria(a.codigo) : null;
        const esAprobada = prog && ['APROBADA', 'VALIDADA', 'CONVALIDADA'].includes(prog.estado);
        const esEnCurso = prog && ['EN CURSO', 'CURSANDO', 'INSCRITA'].includes(prog.estado);
        const claseTarjeta = esAprobada ? ' tarjeta tarjeta--aprobada' : (esEnCurso ? ' tarjeta tarjeta--en-curso' : ' tarjeta');
        const badgeEstado = esAprobada
          ? `<span class="tarjeta__estado-badge" style="background:var(--arcilla, #795446); color:#fff; font-size:10px; font-weight:700; padding:2px 6px; border-radius:4px; margin-right:4px;">✓ APROBADA ${prog.nota != null ? Number(prog.nota).toFixed(1) : ''}</span>`
          : (esEnCurso ? `<span class="tarjeta__estado-badge" style="background:var(--cemento-calido, #7D7660); color:#fff; font-size:10px; font-weight:700; padding:2px 6px; border-radius:4px; margin-right:4px;">▶ EN CURSO</span>` : '');

        return `
        <li>
          <button class="${claseTarjeta}" type="button" data-codigo="${esc(a.codigo)}" style="--color: ${colorDe(a)}">
            <span class="tarjeta__nombre">${esc(a.nombre)}</span>
            <span class="tarjeta__pie">
              <span>${badgeEstado}<span class="tarjeta__tipo">${a.obligatoria ? 'Obligatoria' : 'Optativa'}</span> · ${esc(a.codigo)}${a.whatsapp ? ' · <span class="tarjeta__wpp" title="Tiene grupo de WhatsApp">💬 WhatsApp</span>' : ''}</span>
              <span class="tarjeta__cred" title="Créditos">${creditosTexto(a.creditos)}</span>
            </span>
          </button>
        </li>`;
      }).join('');

  pintarPaginacion(totalPaginas, filtradas.length, inicio, visibles.length);
}

// 1 … 4 5 [6] 7 8 … 12
function paginasVisibles(actual, total) {
  const conjunto = new Set([1, total, actual - 1, actual, actual + 1]);
  const ordenadas = [...conjunto].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const salida = [];
  ordenadas.forEach((n, i) => {
    const hueco = i ? n - ordenadas[i - 1] : 1;
    if (hueco === 2) salida.push(n - 1);     // si falta una sola página, se muestra en vez de "…"
    else if (hueco > 2) salida.push('…');
    salida.push(n);
  });
  return salida;
}

function pintarPaginacion(total, cantidad, inicio, enPagina) {
  const nav = $('#paginacion');
  if (!cantidad || estado.agrupacion === 'libre-eleccion') { nav.innerHTML = ''; return; }

  const info = `<p class="pag__info">Mostrando ${inicio + 1}–${inicio + enPagina} de ${cantidad} asignaturas</p>`;
  if (total === 1) { nav.innerHTML = info; return; }

  nav.innerHTML = `
    <button class="pag__boton" type="button" data-pagina="${estado.pagina - 1}" ${estado.pagina === 1 ? 'disabled' : ''} aria-label="Página anterior">‹</button>
    ${paginasVisibles(estado.pagina, total).map((n) => n === '…'
      ? '<span class="pag__puntos" aria-hidden="true">…</span>'
      : `<button class="pag__boton" type="button" data-pagina="${n}" ${n === estado.pagina ? 'aria-current="page"' : ''} aria-label="Página ${n}">${n}</button>`).join('')}
    <button class="pag__boton" type="button" data-pagina="${estado.pagina + 1}" ${estado.pagina === total ? 'disabled' : ''} aria-label="Página siguiente">›</button>
    ${info}`;
}


/* ---------- Dirección (para compartir el estado de la página) ---------- */

function guardarDireccion() {
  const parametros = new URLSearchParams();
  if (estado.seleccion) parametros.set('materia', estado.seleccion);
  parametros.set('componente', estado.componente);
  parametros.set('agrupacion', estado.agrupacion);
  if (estado.tipo !== 'todas') parametros.set('tipo', estado.tipo);
  if (estado.pagina > 1) parametros.set('pagina', estado.pagina);
  history.replaceState(null, '', `#${parametros}`);
}

function leerDireccion() {
  const parametros = new URLSearchParams(location.hash.slice(1));
  const agrupacion = buscarAgrupacion(parametros.get('agrupacion'));
  if (agrupacion) {
    estado.componente = agrupacion.componente;
    estado.agrupacion = agrupacion.id;
    estado.tipo = ['obligatorias', 'optativas'].includes(parametros.get('tipo')) ? parametros.get('tipo') : 'todas';
    estado.pagina = Number(parametros.get('pagina')) || 1;
    pintarCatalogo();
  }
  const materia = parametros.get('materia');
  if (materia && estado.asignaturas.has(materia)) seleccionar(materia, { desplazar: true });
}
