// Bandeja de preparacion y arrastre: posiciones en el lienzo.

import type { JuegoState, SliceDeJuego } from './tipos'
import { crearInstanciaBandeja, limitarPosicion, mismoDestino } from './tray'

type TraySlice = Pick<
  JuegoState,
  | 'setArrastre'
  | 'setObjetivo'
  | 'agregarABandeja'
  | 'moverEnBandeja'
  | 'combinarEnBandeja'
  | 'quitarDeBandeja'
  | 'limpiarBandeja'
>

export const crearTraySlice: SliceDeJuego<TraySlice> = (set, get) => ({
    setArrastre: (arrastre) => set({ arrastre }),

    setObjetivo: (d) => {
      if (!mismoDestino(get().objetivo, d)) set({ objetivo: d })
    },

    agregarABandeja: (slug, x, y) => {
      const { estado, bandeja, combinando } = get()
      if (combinando) return
      const elemento = estado?.elementos.find((item) => item.slug === slug)
      if (!elemento) return
      set({ bandeja: [...bandeja, crearInstanciaBandeja(elemento, x, y)] })
      get().marcarVisto(slug)
    },

    moverEnBandeja: (instanceId, x, y) => {
      if (get().combinando) return
      set((prev) => ({
        bandeja: prev.bandeja.map((instancia) =>
          instancia.instanceId === instanceId
            ? {
                ...instancia,
                x: limitarPosicion(x, 0.02, 0.98),
                y: limitarPosicion(y, 0.02, 0.98),
              }
            : instancia,
        ),
      }))
    },

    combinarEnBandeja: (sourceInstanceId, targetInstanceId, sourceSlug, x, y) => {
      const { bandeja, combinando } = get()
      if (combinando || sourceInstanceId === targetInstanceId) return
      const objetivo = bandeja.find((instancia) => instancia.instanceId === targetInstanceId)
      const origen = sourceInstanceId
        ? bandeja.find((instancia) => instancia.instanceId === sourceInstanceId)
        : null
      if (!objetivo || (sourceInstanceId && !origen)) return
      void get().ejecutarCombinacion(sourceSlug, objetivo.elemento.slug, {
        origen: 'bandeja',
        bandeja: { sourceInstanceId, targetInstanceId, x, y },
      })
    },

    quitarDeBandeja: (instanceId) => {
      if (get().combinando) return
      set((prev) => ({
        bandeja: prev.bandeja.filter((instancia) => instancia.instanceId !== instanceId),
      }))
    },

    limpiarBandeja: () => {
      if (get().combinando) return
      set({ bandeja: [] })
    },
})
