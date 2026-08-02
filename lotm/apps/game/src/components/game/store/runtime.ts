// Estado mutable que vive fuera del store porque no debe provocar renders:
// banderas de reentrada, temporizadores y marcas por navegador. Se agrupa en un
// objeto para que los slices compartan la misma referencia (una importacion no
// se puede reasignar).

/** Marca local de "ya vio el tutorial del primer avance"; por navegador. */
export const TUTORIAL_AVANCE_KEY = 'am-tutorial-avance-visto'

export const runtime = {
  esAdminActual: false,
  refrescoPotencialPendiente: false,
  pendientesTimer: null as ReturnType<typeof setTimeout> | null,
}

export function feedbackTactil(pattern: number | number[]) {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    navigator.vibrate(pattern)
  }
}
