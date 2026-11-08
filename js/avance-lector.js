/* ==============================================================================
   PORTAL WEB OFICIAL · CONSTRUCCIÓN · FACULTAD DE ARQUITECTURA · UNAL MEDELLÍN
   Módulo Mi Avance · Lector e intérprete de Historia Académica SIA
   Procesa y estructura el texto copiado del SIA (Ctrl+A, Ctrl+C).
   Ejecución 100% en el navegador (Client-Side). No envía datos a ningún servidor.
   Plan 3503 · 180 créditos totales exigidos · Todos los derechos reservados © 2026.
   ============================================================================== */

const CREDITOS_PLAN = 180;

const TIPOLOGIAS = [
  { clave: 'FUND. OBLIGATORIA', nombre: 'Fundamentación obligatoria', grupo: 'fundamentacion', exigidos: 44 },
  { clave: 'FUND. OPTATIVA', nombre: 'Fundamentación optativa', grupo: 'fundamentacion', exigidos: 10 },
  { clave: 'DISCIPLINAR OBLIGATORIA', nombre: 'Disciplinar obligatoria', grupo: 'disciplinar', exigidos: 62 },
  { clave: 'DISCIPLINAR OPTATIVA', nombre: 'Disciplinar optativa', grupo: 'disciplinar', exigidos: 22 },
  { clave: 'LIBRE ELECCIÓN', nombre: 'Libre elección', grupo: 'libre', exigidos: 36 },
  { clave: 'TRABAJO DE GRADO', nombre: 'Trabajo de grado', grupo: 'disciplinar', exigidos: 6 },
  { clave: 'NIVELACIÓN', nombre: 'Nivelación', grupo: 'fundamentacion', exigidos: 0 },
];

const quitarTildes = (t) => String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const entero = (t) => parseInt(t, 10);

// "2026-1S" -> { anio: 2026, num: 1 }
function leerPeriodo(texto) {
  const m = /^(\d{4})-(\d)/.exec(texto);
  return m ? { anio: entero(m[1]), num: entero(m[2]) } : null;
}
const clavePeriodo = (p) => p.anio * 10 + p.num;
const etiquetaPeriodo = (p) => `${p.anio}-${p.num}S`;
function siguientePeriodo(p) { return p.num >= 2 ? { anio: p.anio + 1, num: 1 } : { anio: p.anio, num: 2 }; }
function avanzarPeriodo(p, n) { let r = p; for (let i = 0; i < n; i += 1) r = siguientePeriodo(r); return r; }

// Normaliza el nombre de la tipología del SIA
function normalizarTipologia(texto) {
  const t = quitarTildes(texto).toUpperCase().replace(/\s+/g, ' ').trim();
  if (t.startsWith('NIVELACION')) return 'NIVELACIÓN';
  if (t.startsWith('LIBRE')) return 'LIBRE ELECCIÓN';
  if (t.startsWith('TRABAJO')) return 'TRABAJO DE GRADO';
  if (t.startsWith('FUND') && t.includes('OPTAT')) return 'FUND. OPTATIVA';
  if (t.startsWith('FUND')) return 'FUND. OBLIGATORIA';
  if (t.startsWith('DISCIPLINAR') && t.includes('OPTAT')) return 'DISCIPLINAR OPTATIVA';
  if (t.startsWith('DISCIPLINAR')) return 'DISCIPLINAR OBLIGATORIA';
  return t;
}

// Regex para cada fila de materia
const FILA_MATERIA = /\((\d{6,7}(?:-[A-Z0-9]+)?)\)\s+(\d{1,2})\s+([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ.\/ ]*?)\s+(\d{4}-\d[A-Z]?)\s+([A-Za-zÁÉÍÓÚáéíóúñ]+(?:\s+[A-Za-zÁÉÍÓÚáéíóúñ]+){0,3}?)(?:\s+(\d(?:[.,]\d)?|\bAP\b))?\s+(APROBADA|REPROBADA|CANCELADA|CONVALIDADA|VALIDADA|INSCRITA|CURSANDO|EN\s+CURSO|[A-ZÁÉÍÓÚ]{4,})/gi;

function leerMaterias(texto) {
  const materias = [];
  const encabezado = /CALIFICACI[ÓO]N/i.exec(texto);
  let desde = encabezado ? encabezado.index + encabezado[0].length : 0;
  FILA_MATERIA.lastIndex = 0;
  let m;
  while ((m = FILA_MATERIA.exec(texto)) !== null) {
    const antes = texto.slice(desde, m.index);
    const nombre = antes.split(/[\t\n\r]/).map((s) => s.trim()).filter(Boolean).pop() || '';
    const periodo = leerPeriodo(m[4]);
    if (periodo) {
      let nota = null;
      if (m[6]) {
        if (/^AP$/i.test(m[6])) nota = 5.0;
        else nota = parseFloat(m[6].replace(',', '.'));
      }
      materias.push({
        nombre: nombre.replace(/\s+/g, ' '),
        codigo: m[1],
        creditos: entero(m[2]),
        tipologia: normalizarTipologia(m[3]),
        periodo,
        modalidad: m[5],
        nota: Number.isNaN(nota) ? null : nota,
        estado: m[7].toUpperCase().replace(/\s+/g, ' '),
      });
    }
    desde = m.index + m[0].length;
  }
  return materias;
}

const FILA_RESUMEN = /(TOTAL ESTUDIANTE|TOTAL|NIVELACI[ÓO]N|DISCIPLINAR OPTATIVA|DISCIPLINAR OBLIGAT\w*|DISCIPLINAR OBL|FUND\. OBLIGATORIA|FUND\. OPTATIVA|LIBRE ELECCI[ÓO]N|TRABAJO DE GRADO)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)(?:\s+(\d+))?(?!\S)/gi;

function leerResumen(texto) {
  const filas = {};
  let m;
  FILA_RESUMEN.lastIndex = 0;
  while ((m = FILA_RESUMEN.exec(texto)) !== null) {
    const clave = m[1].toUpperCase() === 'TOTAL' || /^TOTAL ESTUDIANTE$/i.test(m[1])
      ? m[1].toUpperCase()
      : normalizarTipologia(m[1]);
    if (!filas[clave]) {
      filas[clave] = {
        exigidos: entero(m[2]),
        aprobados: entero(m[3]),
        pendientes: entero(m[4]),
        inscritos: entero(m[5]),
        cursados: m[6] ? entero(m[6]) : (entero(m[3]) + entero(m[5])),
      };
    }
  }
  return filas;
}

function leerCifraSuelta(texto, patron) {
  const m = patron.exec(texto);
  return m ? parseFloat(m[1].replace(',', '.')) : null;
}

function leerHistoria(textoOriginal) {
  const texto = String(textoOriginal || '').replace(/ /g, ' ');
  const materias = leerMaterias(texto);
  const resumen = leerResumen(texto);

  // Detección del nombre o usuario SIA
  let nombre = '';

  // 1. Logo Universidad seguido del usuario institucional (ej: "serojasga")
  const logoMatch = /(?:Logo\s+Universidad\s*\n\s*)([a-z0-9._-]+)/i.exec(texto);
  if (logoMatch && !/^(Datos|Informaci|Mi|Proceso|Buscador|Historia)/i.test(logoMatch[1])) {
    nombre = logoMatch[1];
  }

  // 2. Nombre explícito: "Nombre: Juan Pérez" o "Estudiante: ..."
  if (!nombre) {
    const nomMatch = (/(?:^|\n)\s*(?:Nombre|Estudiante)\s*:?\s*([A-ZÁÉÍÓÚÑa-záéíóúñ ]{6,60})\s*(?:\n|$)/.exec(texto) || [])[1];
    if (nomMatch) nombre = nomMatch.trim();
  }

  // 3. Portal de Servicios Académicos seguido de usuario
  if (!nombre) {
    const usuarioSia = (/(?:Portal de Servicios Acad[ée]micos\s*\n\s*)([a-z0-9._-]+)/i.exec(texto) || [])[1];
    if (usuarioSia && !/^(Datos|Informaci|Mi|Proceso|Buscador)/i.test(usuarioSia)) {
      nombre = usuarioSia;
    }
  }

  const textoNorm = quitarTildes(texto).toUpperCase();

  // Validación de Inglés / Lengua Extranjera
  const tieneInglesAprobado = materias.some((m) => {
    const n = quitarTildes(m.nombre).toUpperCase();
    const esIngles = n.includes('INGLES') || n.includes('LENGUA EXTRANJERA') || n.includes('SUFICIENCIA') || n.includes('ACREDITACION');
    const ok = m.estado === 'APROBADA' || m.estado === 'VALIDADA' || m.estado === 'CONVALIDADA' || m.nota >= 3.0;
    return esIngles && ok;
  });

  const nivelacionCeroPendiente = resumen['NIVELACIÓN'] && resumen['NIVELACIÓN'].pendientes === 0;
  const inglesAcreditado = tieneInglesAprobado || nivelacionCeroPendiente;

  const esConstruccion =
    /CONSTRUCCION/i.test(textoNorm) ||
    /3503\s*-\s*CONSTRUCCION/i.test(textoNorm) ||
    /3503\s+CONSTRUCCION/i.test(textoNorm) ||
    /PLAN.*3503/i.test(textoNorm) ||
    /ARQUITECTURA/i.test(textoNorm);

  return {
    materias,
    resumen,
    nombre: nombre ? nombre.trim() : '',
    papa: leerCifraSuelta(texto, /(\d\.\d{1,2})\s*\(Acumulado\)\s*Pregrado\s*-\s*P\.A\.P\.A/i),
    promedio: leerCifraSuelta(texto, /(\d\.\d{1,2})\s*\(Acumulado\)\s*Pregrado\s*-\s*Promedio/i),
    cancelados: leerCifraSuelta(texto, /Cancelados\s+en\s+los\s+Periodos\s+Cursados?\s*(\d+)/i),
    excedentes: leerCifraSuelta(texto, /Cr[ée]ditos\s+Excedentes\s*(\d+)/i),
    porcentajeSia: leerCifraSuelta(texto, /Porcentaje\s+de\s+Avance\s*([\d.,]+)\s*%/i),
    cupo: leerCifraSuelta(texto, /Cupo\s+de\s+cr[ée]ditos\s+(\d+)/i),
    disponibles: leerCifraSuelta(texto, /Cr[ée]ditos\s+disponibles\s*(-?\d+)/i),
    adicionales: leerCifraSuelta(texto, /Cr[ée]ditos\s+adicionales\s+(\d+)/i),
    esConstruccion,
    inglesAcreditado,
  };
}

/* ---------- Cálculos de Avance y Proyección ---------- */

const ESTADOS_CERRADOS = ['APROBADA', 'REPROBADA', 'CANCELADA', 'CONVALIDADA', 'VALIDADA'];

function calcularAvance(historia, ritmoElegido) {
  const { materias, resumen } = historia;
  const delPlan = materias.filter((m) => m.tipologia !== 'NIVELACIÓN');

  // Si una materia fue cursada más de una vez, gana la aprobada
  const aprobadasPorCodigo = new Map();
  delPlan.filter((m) => ['APROBADA', 'VALIDADA', 'CONVALIDADA'].includes(m.estado)).forEach((m) => {
    aprobadasPorCodigo.set(m.codigo, m);
  });
  const aprobadasCalculo = [...aprobadasPorCodigo.values()].reduce((s, m) => s + m.creditos, 0);

  const total = resumen.TOTAL || resumen['TOTAL ESTUDIANTE'];
  const aprobados = total ? total.aprobados : aprobadasCalculo;
  const enCursoMaterias = delPlan.filter((m) => !ESTADOS_CERRADOS.includes(m.estado));
  const inscritos = total ? total.inscritos : enCursoMaterias.reduce((s, m) => s + m.creditos, 0);
  const exigidos = total ? total.exigidos : CREDITOS_PLAN;
  const pendientes = total ? total.pendientes : Math.max(0, exigidos - aprobados);

  // Créditos cursados por semestre ordinario para medir el ritmo
  const porPeriodo = new Map();
  delPlan.filter((m) => m.modalidad && m.modalidad.toLowerCase() === 'ordinaria' && m.estado !== 'CANCELADA').forEach((m) => {
    const k = clavePeriodo(m.periodo);
    const fila = porPeriodo.get(k) || { periodo: m.periodo, aprobados: 0, reprobados: 0, enCurso: 0 };
    if (['APROBADA', 'VALIDADA', 'CONVALIDADA'].includes(m.estado)) {
      fila.aprobados += m.creditos;
    } else if (m.estado === 'REPROBADA') {
      fila.reprobados += m.creditos;
    } else {
      fila.enCurso += m.creditos;
    }
    porPeriodo.set(k, fila);
  });
  const historial = [...porPeriodo.entries()].sort((a, b) => a[0] - b[0]).map((e) => e[1]);

  const cerrados = historial.filter((f) => f.enCurso === 0);
  const recientes = cerrados.slice(-4);
  const promedio = recientes.length
    ? recientes.reduce((s, f) => s + f.aprobados + f.reprobados, 0) / recientes.length
    : 17;
  const ritmoCalculado = Math.min(24, Math.max(6, Math.round(promedio || 17)));
  const ritmo = ritmoElegido || ritmoCalculado;

  const hoy = new Date();
  const periodoCalendario = {
    anio: hoy.getFullYear(),
    num: hoy.getMonth() >= 6 ? 2 : 1,
  };

  const ultimoCerrado = cerrados.length ? cerrados[cerrados.length - 1].periodo : null;

  // Determinar el periodo que está actualmente en curso:
  // "Todo lo que salga con nota en historia académica es que ya pasó".
  // Por tanto, el semestre en curso debe ser posterior al último cerrado con notas,
  // y al menos igual al periodo del calendario académico actual.
  let periodoEnCurso;
  if (enCursoMaterias.length && enCursoMaterias[0].periodo) {
    const pMat = enCursoMaterias[0].periodo;
    if (!ultimoCerrado || clavePeriodo(pMat) > clavePeriodo(ultimoCerrado)) {
      periodoEnCurso = pMat;
    }
  }

  if (!periodoEnCurso) {
    if (ultimoCerrado) {
      const siguienteAlUltimo = siguientePeriodo(ultimoCerrado);
      periodoEnCurso = (clavePeriodo(siguienteAlUltimo) >= clavePeriodo(periodoCalendario))
        ? siguienteAlUltimo
        : periodoCalendario;
    } else {
      periodoEnCurso = periodoCalendario;
    }
  }

  // Filtrar historial para garantizar que ningún periodo cerrado colisione con el periodo en curso
  const historialCerrado = historial.filter((h) => clavePeriodo(h.periodo) < clavePeriodo(periodoEnCurso));

  // Proyección de semestres restantes
  const proyeccion = [];
  let restante = Math.max(0, pendientes - inscritos);
  let periodo = periodoEnCurso;
  if (inscritos > 0) {
    proyeccion.push({ periodo, creditos: inscritos, tipo: 'curso' });
    periodo = siguientePeriodo(periodo);
  }
  while (restante > 0) {
    const toma = Math.min(ritmo, restante);
    proyeccion.push({ periodo, creditos: toma, tipo: 'proyectado' });
    restante -= toma;
    periodo = siguientePeriodo(periodo);
  }
  const graduacion = proyeccion.length ? proyeccion[proyeccion.length - 1].periodo : (ultimoCerrado || periodoCalendario);
  const semestresFaltantes = proyeccion.length;

  const semestresCursados = historialCerrado.length;
  const porcentaje = exigidos ? Math.round((aprobados / exigidos) * 1000) / 10 : 0;
  const nivel = Math.max(1, Math.min(100, Math.floor((exigidos ? aprobados / exigidos : 0) * 100)));
  const esPrimiparo = (aprobados === 0 && semestresCursados === 0);

  return {
    aprobados,
    inscritos,
    pendientes,
    exigidos,
    porcentaje,
    nivel,
    ritmo,
    ritmoCalculado,
    historial: historialCerrado,
    proyeccion,
    graduacion,
    semestresFaltantes,
    semestresCursados,
    completo: pendientes === 0 && exigidos > 0,
    materiasAprobadas: aprobadasPorCodigo.size,
    esPrimiparo,
    periodoEnCurso,
  };
}

if (typeof window !== 'undefined') {
  window.leerHistoria = leerHistoria;
  window.calcularAvance = calcularAvance;
  window.etiquetaPeriodo = etiquetaPeriodo;
  window.clavePeriodo = clavePeriodo;
  window.TIPOLOGIAS = TIPOLOGIAS;
  window.CREDITOS_PLAN = CREDITOS_PLAN;
}
if (typeof module !== 'undefined') {
  module.exports = { leerHistoria, calcularAvance, etiquetaPeriodo, clavePeriodo, TIPOLOGIAS, CREDITOS_PLAN };
}
