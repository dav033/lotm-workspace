'use client'

// Store unico del juego (zustand): toda la UI se suscribe por selectores, asi
// un cambio en una esquina del estado solo re-renderiza quien la lee. Los
// datos canonicos viven en el servidor (perfil por cookie + PostgreSQL); aqui
// se cachean para que la interfaz responda al instante.
//
// El estado se compone por slices tematicos. Comparten set/get, asi que una
// accion puede llamar a otra con get() igual que cuando todo vivia en un solo
// closure. JuegoState sigue siendo un unico tipo: si un slice sobra o falta un
// campo, el typecheck lo detecta.

import { create } from 'zustand'
import { crearEstadoInteraccionHabilidades } from './estadoHabilidades'
import type { JuegoState } from './store/tipos'
import { crearSessionSlice } from './store/sessionSlice'
import { crearNoticesSlice } from './store/noticesSlice'
import { crearCombineSlice } from './store/combineSlice'
import { crearPhasesSlice } from './store/phasesSlice'
import { crearRitualsSlice } from './store/ritualsSlice'
import { crearAbilitiesSlice } from './store/abilitiesSlice'
import { crearTraySlice } from './store/traySlice'

export type { Aviso } from './store/tipos'
export { agregarAperturasBandeja } from './store/tray'

export const useJuegoStore = create<JuegoState>()((...a) => ({
  estado: null,
  errorCarga: false,
  slots: [null, null],
  combinando: false,
  resultado: null,
  fallo: 0,
  sello: 0,
  avisos: [],
  reiniciando: false,
  faseAvanzando: false,
  transicionFase: null,
  aperturasFase: [],
  pendientes: [],
  logrosPendientes: [],
  tutorialAvance: false,
  recientes: [],
  arrastre: null,
  objetivo: null,
  modoRapido: true,
  bandeja: [],
  cinematicMode: false,
  ritualState: { status: 'HIDDEN', groups: [] },
  pendingRitualRisk: null,
  ritualActionLoading: false,
  ...crearEstadoInteraccionHabilidades(),

  ...crearSessionSlice(...a),
  ...crearNoticesSlice(...a),
  ...crearCombineSlice(...a),
  ...crearPhasesSlice(...a),
  ...crearRitualsSlice(...a),
  ...crearAbilitiesSlice(...a),
  ...crearTraySlice(...a),
}))
