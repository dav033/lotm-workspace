// Avisos efimeros: cola con autocierre. El temporizador vive en el closure
// del slice, que se crea una sola vez junto al store.

import type { JuegoState, SliceDeJuego } from './tipos'
import { appendAviso, removeAviso } from './notices'

type NoticesSlice = Pick<JuegoState, 'mostrarAviso' | 'cerrarAviso'>

export const crearNoticesSlice: SliceDeJuego<NoticesSlice> = (set, get) => {
  let avisoId = 0
  const avisoTimers = new Map<number, ReturnType<typeof setTimeout>>()

  return {
    mostrarAviso: (texto, tono = 'bruma') => {
      const id = ++avisoId
      set((prev) => ({ avisos: appendAviso(prev.avisos, { id, texto, tono }) }))
      avisoTimers.set(
        id,
        setTimeout(() => get().cerrarAviso(id), 4200),
      )
    },

    cerrarAviso: (id) => {
      const timer = avisoTimers.get(id)
      if (timer) clearTimeout(timer)
      avisoTimers.delete(id)
      set((prev) => ({ avisos: removeAviso(prev.avisos, id) }))
    },
  }
}
