// Facultades: vidente, misterio, potencial y memoria del aprendiz.

import type { PotentialTier } from '@/shared/habilidades'
import type { JuegoState, SliceDeJuego } from './tipos'
import { aplicarDeltaAMemoria, type ResultadoVidente } from '../estadoHabilidades'
import { runtime } from './runtime'

type AbilitiesSlice = Pick<
  JuegoState,
  | 'activarModoVidente'
  | 'cancelarModoVidente'
  | 'analizarConVidente'
  | 'alternarMystery'
  | 'refrescarPotencial'
  | 'cargarMemoriaAprendiz'
  | 'aplicarDeltaMemoriaAprendiz'
>

export const crearAbilitiesSlice: SliceDeJuego<AbilitiesSlice> = (set, get) => ({
    activarModoVidente: () => {
      const { abilities, seerCargando } = get()
      if (!abilities.seer.unlocked || seerCargando) return
      set({ modoInteraccion: 'vidente-objetivo' })
    },

    cancelarModoVidente: () => set({ modoInteraccion: 'normal' }),

    analizarConVidente: async (elementId) => {
      const { abilities, estado, seerCargando } = get()
      if (!abilities.seer.unlocked || seerCargando) return
      const elemento = estado?.elementos.find(
        (item) => item.kind === 'ELEMENT' && item.id === elementId,
      )
      if (!elemento) {
        set({ modoInteraccion: 'normal' })
        get().mostrarAviso('That element cannot be analyzed.', 'peligro')
        return
      }

      // La selección termina inmediatamente; la petición continúa con el
      // botón protegido por seerCargando para evitar envíos repetidos.
      set({ modoInteraccion: 'normal', seerCargando: true })
      try {
        const response = await fetch('/api/habilidades/vidente', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ elementId }),
        })
        const data = await response.json()
        if (!response.ok) {
          get().mostrarAviso(data?.error ?? 'The divination does not respond.', 'peligro')
          return
        }
        const count = Number(data.availableCombinationCount)
        // Un reset puede ocurrir mientras la petición viaja: no restaurar un
        // resultado de una facultad que ya dejó de pertenecer al perfil.
        if (!get().abilities.seer.unlocked) return
        const resultado: ResultadoVidente = {
          elementId,
          nombre: elemento.name,
          availableCombinationCount: Number.isInteger(count) && count >= 0 ? count : 0,
        }
        set({ seerResultado: resultado })
        get().mostrarAviso(
          resultado.availableCombinationCount === 0
            ? `«${elemento.name}» has no pending combinations you can execute now.`
            : `«${elemento.name}» holds ${resultado.availableCombinationCount} ${
                resultado.availableCombinationCount === 1
                  ? 'pending combination'
                  : 'pending combinations'
              } with your current knowledge.`,
        )
      } catch {
        get().mostrarAviso('The divination does not respond. Try again.', 'peligro')
      } finally {
        set({ seerCargando: false })
      }
    },

    alternarMystery: async () => {
      const { abilities, mysteryActivo, mysteryCargando } = get()
      if (!abilities.mysteryPryer.unlocked || mysteryCargando) return
      if (mysteryActivo) {
        runtime.refrescoPotencialPendiente = false
        set({ mysteryActivo: false, potencialPorElemento: {} })
        return
      }
      set({ mysteryActivo: true, potencialPorElemento: {} })
      await get().refrescarPotencial()
    },

    refrescarPotencial: async () => {
      if (!get().mysteryActivo) return
      if (get().mysteryCargando) {
        runtime.refrescoPotencialPendiente = true
        return
      }
      runtime.refrescoPotencialPendiente = false
      // La caché se invalida antes de pedir: un fallo nunca deja tiers viejos.
      set({ mysteryCargando: true, potencialPorElemento: {} })
      try {
        const response = await fetch('/api/habilidades/potencial')
        const data = await response.json()
        if (!response.ok) throw new Error(data?.error ?? 'The vision does not respond.')
        const potencial: Record<string, PotentialTier> = {}
        for (const entry of data.potential ?? []) {
          if (
            typeof entry?.elementId === 'string' &&
            Number.isInteger(entry?.tier) &&
            entry.tier >= 1 &&
            entry.tier <= 5
          ) {
            potencial[entry.elementId] = entry.tier as PotentialTier
          }
        }
        // El modo pudo desactivarse o el perfil reiniciarse durante la carga.
        if (!get().mysteryActivo) return
        set({ potencialPorElemento: potencial })
      } catch {
        set({ mysteryActivo: false, potencialPorElemento: {} })
        get().mostrarAviso(
          'The Mystery Pryer vision has faded. Try again.',
          'peligro',
        )
      } finally {
        set({ mysteryCargando: false })
        if (runtime.refrescoPotencialPendiente && get().mysteryActivo) {
          runtime.refrescoPotencialPendiente = false
          void get().refrescarPotencial()
        }
      }
    },

    // Memoria del Aprendiz: carga el historial completo UNA vez (al
    // desbloquearse o al iniciar sesión ya desbloqueada); después, cada
    // combinación lo actualiza de forma incremental vía aplicarDeltaMemoriaAprendiz.
    // Un fallo de carga deja la facultad en 'error' sin afectar el resto del
    // juego: la advertencia visual simplemente no aparece hasta reintentar.
    cargarMemoriaAprendiz: async () => {
      if (!get().abilities.apprenticeMemory.unlocked) return
      set((prev) => ({ memoriaAprendiz: { ...prev.memoriaAprendiz, status: 'loading' } }))
      try {
        const response = await fetch('/api/habilidades/aprendiz/memoria')
        const data = await response.json()
        if (!response.ok) throw new Error(data?.error ?? 'The memory does not respond.')
        const failedInputKeys = new Set<string>(
          Array.isArray(data.failedInputKeys) ? data.failedInputKeys : [],
        )
        // El perfil pudo reiniciarse mientras la petición viajaba.
        if (!get().abilities.apprenticeMemory.unlocked) return
        set({
          memoriaAprendiz: {
            status: 'ready',
            revision: typeof data.revision === 'string' ? data.revision : null,
            failedInputKeys,
          },
        })
      } catch {
        set((prev) => ({ memoriaAprendiz: { ...prev.memoriaAprendiz, status: 'error' } }))
        get().mostrarAviso('The Apprentice Memory is not responding right now.', 'peligro')
      }
    },

    // Un delta puede llegar antes de que la carga inicial termine (o de que
    // la facultad esté desbloqueada): el propio intento actual ya lo conoce
    // el jugador, así que registrarlo no filtra nada nuevo, pero solo tiene
    // efecto visual una vez que el snapshot está 'ready'.
    aplicarDeltaMemoriaAprendiz: (delta) => {
      set((prev) => ({ memoriaAprendiz: aplicarDeltaAMemoria(prev.memoriaAprendiz, delta) }))
    },
})
