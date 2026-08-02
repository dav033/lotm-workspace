// Sesion y progreso general: arranque, recarga, reinicio y preferencias.

import type { EstadoJuego } from '../tipos'
import type { JuegoState, SliceDeJuego } from './tipos'
import { ABILITY_DEFINITIONS, facultadesDesdeSlugs } from '@/shared/habilidades'
import { crearEstadoInteraccionHabilidades } from '../estadoHabilidades'
import { sincronizarBandeja } from './tray'
import { nuevosDesbloqueos } from './abilities'
import { TUTORIAL_AVANCE_KEY, runtime } from './runtime'
import { crearCargaPendientes } from './pendientes'

type SessionSlice = Pick<
  JuegoState,
  | 'iniciar'
  | 'cargarEstado'
  | 'reiniciar'
  | 'cerrarLogro'
  | 'marcarVisto'
  | 'alternarModoRapido'
  | 'toggleCinematicMode'
>

export const crearSessionSlice: SliceDeJuego<SessionSlice> = (set, get) => {
  const { cargarPendientes } = crearCargaPendientes(set)

  return {
    iniciar: (esAdmin) => {
      runtime.esAdminActual = esAdmin
      void get().cargarEstado()
      void cargarPendientes()
    },

    cargarEstado: async () => {
      try {
        const res = await fetch('/api/estado')
        if (!res.ok) throw new Error()
        const rawData = (await res.json()) as EstadoJuego
        const data = rawData
        const estadoAnterior = get().estado
        const abilitiesAnteriores = get().abilities
        set((prev) => ({
          estado: data,
          ritualState: data.ritualState,
          abilities: data.abilities,
          logrosPendientes: data.pendingAchievements ?? [],
          errorCarga: false,
          modoInteraccion: data.abilities.seer.unlocked ? prev.modoInteraccion : 'normal',
          mysteryActivo: data.abilities.mysteryPryer.unlocked ? prev.mysteryActivo : false,
          potencialPorElemento: data.abilities.mysteryPryer.unlocked
            ? prev.potencialPorElemento
            : {},
          bandeja: sincronizarBandeja(prev.bandeja, data.elementos),
        }))
        if (estadoAnterior) {
          for (const key of nuevosDesbloqueos(abilitiesAnteriores, data.abilities)) {
            get().mostrarAviso(`New ability: ${ABILITY_DEFINITIONS[key].nombre}.`)
          }
        }
        if (get().mysteryActivo) void get().refrescarPotencial()
        // Se carga una sola vez: al desbloquearse y también si la facultad
        // ya venía desbloqueada en la primera carga de la sesión.
        if (data.abilities.apprenticeMemory.unlocked && get().memoriaAprendiz.status === 'idle') {
          void get().cargarMemoriaAprendiz()
        }
      } catch {
        set({ errorCarga: true, ritualState: { status: 'HIDDEN', groups: [] } })
      }
    },

    reiniciar: async () => {
      if (get().combinando) {
        get().mostrarAviso('Wait for the archive to resolve the current combination.')
        return
      }
      if (
        !window.confirm(
          'Reset your progress? You will lose all discoveries and start over.',
        )
      )
        return
      set({ reiniciando: true })
      try {
        const res = await fetch('/api/perfil/reiniciar', { method: 'POST' })
        if (!res.ok) throw new Error()
        runtime.refrescoPotencialPendiente = false
        set({
          slots: [null, null],
          resultado: null,
          logrosPendientes: [],
          recientes: [],
          aperturasFase: [],
          transicionFase: null,
          bandeja: [],
          ritualState: { status: 'HIDDEN', groups: [] },
          pendingRitualRisk: null,
          ritualActionLoading: false,
          ...crearEstadoInteraccionHabilidades(),
          arrastre: null,
          objetivo: null,
        })
        // Al empezar de cero, el tutorial del primer avance vuelve a mostrarse.
        window.localStorage.removeItem(TUTORIAL_AVANCE_KEY)
        await get().cargarEstado()
        get().mostrarAviso('The archive has been restored. You start anew.')
      } catch {
        get().mostrarAviso('Could not reset progress.', 'peligro')
      } finally {
        set({ reiniciando: false })
      }
    },

    cerrarLogro: () => {
      const current = get().logrosPendientes[0]
      if (!current) return
      set((prev) => ({ logrosPendientes: prev.logrosPendientes.slice(1) }))
      void fetch('/api/logros/vistos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ achievementIds: [current.id] }),
      })
    },

    marcarVisto: (slug) => {
      if (!get().recientes.includes(slug) && !get().aperturasFase.includes(slug)) return
      set((prev) => ({
        recientes: prev.recientes.filter((s) => s !== slug),
        aperturasFase: prev.aperturasFase.filter((s) => s !== slug),
      }))
    },

    alternarModoRapido: () => {
      if (get().combinando) return
      set((prev) => ({ modoRapido: !prev.modoRapido }))
    },

    toggleCinematicMode: () => {
      set((prev) => ({ cinematicMode: !prev.cinematicMode }))
    },
  }
}
