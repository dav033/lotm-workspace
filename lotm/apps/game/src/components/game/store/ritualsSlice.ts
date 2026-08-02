// Rituales de avance: confirmacion de riesgo y ejecucion.

import type { PublicRitualState } from '@/shared/ritualKnowledge'
import type { JuegoState, SliceDeJuego } from './tipos'

type RitualsSlice = Pick<
  JuegoState,
  'realizarRitual' | 'cancelarRiesgoRitual' | 'confirmarRiesgoRitual'
>

export const crearRitualsSlice: SliceDeJuego<RitualsSlice> = (set, get) => ({
    realizarRitual: async (ritualId) => {
      if (get().ritualActionLoading) return
      set({ ritualActionLoading: true })
      try {
        const response = await fetch('/api/rituales/realizar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ritualId }),
        })
        const data = await response.json()
        if (!response.ok) {
          set({ ritualState: { status: 'HIDDEN', groups: [] } })
          get().mostrarAviso(data?.error ?? 'The ritual does not respond.', 'peligro')
          await get().cargarEstado()
          return
        }
        set({ ritualState: data.ritualState as PublicRitualState })
        get().mostrarAviso('The ritual preparation has been completed.')
        void get().refrescarPotencial()
      } catch {
        set({ ritualState: { status: 'HIDDEN', groups: [] } })
        get().mostrarAviso('Could not complete the ritual.', 'peligro')
        await get().cargarEstado()
      } finally {
        set({ ritualActionLoading: false })
      }
    },

    cancelarRiesgoRitual: () => {
      if (get().combinando) return
      set({ pendingRitualRisk: null })
    },

    confirmarRiesgoRitual: async () => {
      const pending = get().pendingRitualRisk
      if (!pending) return
      await get().ejecutarCombinacion(pending.elementos[0], pending.elementos[1], {
        ...pending.opciones,
        confirmRitualRisk: true,
      })
    },
})
