// Mesa de combinacion: colocacion, ejecucion y registro del resultado.

import type { ResolvedCombineResult } from '@/shared/tipos'
import { ABILITY_DEFINITIONS, facultadesDesdeSlugs, type AbilityKey } from '@/shared/habilidades'
import type { JuegoState, SliceDeJuego } from './tipos'
import { crearInstanciaBandeja, sincronizarBandeja } from './tray'
import { nuevosDesbloqueos } from './abilities'
import { unidadesDePendiente } from './recipes'
import { parseCombineResult } from './combine'
import { TUTORIAL_AVANCE_KEY, feedbackTactil } from './runtime'
import { crearCargaPendientes } from './pendientes'

type CombineSlice = Pick<
  JuegoState,
  | 'colocar'
  | 'retirar'
  | 'limpiar'
  | 'colocarEnSlot'
  | 'usarResultado'
  | 'autocompletarPendiente'
  | 'combinarPendiente'
  | 'ejecutarCombinacion'
  | 'combinarDirecto'
>

export const crearCombineSlice: SliceDeJuego<CombineSlice> = (set, get) => {
  const { programarCargaPendientes } = crearCargaPendientes(set)
  let combinandoEnCurso = false

  const registrarResultado = (r: ResolvedCombineResult) => {
    const nuevasFacultades = new Set<AbilityKey>()
    if (r.consumedSlugs.length > 0) {
      set((prev) => {
        if (!prev.estado) return prev
        const elementos = prev.estado.elementos.flatMap((elemento) => {
          if (!r.consumedSlugs.includes(elemento.slug)) return [elemento]
          const quantity = elemento.quantity ?? 1
          return quantity > 1 ? [{ ...elemento, quantity: quantity - 1 }] : []
        })
        return {
          estado: { ...prev.estado, elementos },
          bandeja: sincronizarBandeja(prev.bandeja, elementos),
          slots: prev.slots.map((slot) =>
            slot ? (elementos.find((elemento) => elemento.id === slot.id) ?? null) : null,
          ),
        }
      })
    }
    for (const salida of r.results) {
      const nuevo = salida.element
      set((prev) => {
        if (!prev.estado) return prev
        const existe = prev.estado.elementos.some((x) => x.id === nuevo.id)
        const elementos = existe
          ? prev.estado.elementos.map((x) =>
              x.id === nuevo.id
                ? {
                    ...x,
                    timesCreated: x.timesCreated + 1,
                    quantity: nuevo.kind === 'ADVANCE' ? (x.quantity ?? 1) + 1 : x.quantity,
                  }
                : x,
            )
          : [
              ...prev.estado.elementos,
              { ...nuevo, firstDiscoveredAt: new Date().toISOString(), timesCreated: 1 },
            ]
        const descubiertos = elementos.filter((elemento) => elemento.kind === 'ELEMENT').length
        const recientes =
          salida.isNewDiscovery && !prev.recientes.includes(nuevo.slug)
            ? [...prev.recientes.slice(-39), nuevo.slug]
            : prev.recientes
        const abilities = facultadesDesdeSlugs(
          new Set(
            elementos
              .filter((elemento) => elemento.kind === 'ELEMENT')
              .map((elemento) => elemento.slug),
          ),
        )
        for (const key of nuevosDesbloqueos(prev.abilities, abilities)) {
          nuevasFacultades.add(key)
        }
        return {
          recientes,
          abilities,
          bandeja: sincronizarBandeja(prev.bandeja, elementos),
          estado: {
            ...prev.estado,
            elementos,
            abilities,
            descubiertos,
            porcentaje:
              prev.estado.totalElementos === 0
                ? 0
                : Math.round((descubiertos / prev.estado.totalElementos) * 100),
          },
        }
      })
    }
    for (const key of nuevasFacultades) {
      get().mostrarAviso(`New ability: ${ABILITY_DEFINITIONS[key].nombre}.`)
    }
  }

  return {
    colocar: (el) => {
      const { slots, mostrarAviso, marcarVisto, combinando, modoRapido } = get()
      if (combinando) {
        mostrarAviso('The circle is still resolving the combination.')
        return
      }
      const libre = slots.findIndex((x) => x === null)
      if (libre === -1) {
        if (modoRapido && slots[0]) {
          const next = [slots[0], el]
          set({ slots: next, resultado: null })
          marcarVisto(el.slug)
          void get().ejecutarCombinacion(slots[0].slug, el.slug, { origen: 'mesa' })
          return
        }
        mostrarAviso('The circle is full. Remove an element or press Clear.')
        return
      }
      const next = [...slots]
      next[libre] = el
      set({ slots: next })
      marcarVisto(el.slug)
      // Al quedar los dos espacios llenos, se combina solo (sin botón).
      if (next[0] && next[1]) void get().ejecutarCombinacion(next[0].slug, next[1].slug, { origen: 'mesa' })
    },

    retirar: (i) => {
      if (get().combinando) return
      set((prev) => ({ slots: prev.slots.map((x, idx) => (idx === i ? null : x)) }))
    },

    limpiar: () => {
      if (get().combinando) return
      set({ slots: [null, null], resultado: null })
    },

    // Colocación por arrastre: el panel publica el slug y el círculo lo
    // resuelve aquí. Si la ficha viene del otro espacio, este queda libre
    // (antes se duplicaba el elemento al moverlo de un espacio al otro).
    colocarEnSlot: (i, slug, origen) => {
      const { estado, slots, combinando } = get()
      if (combinando) return
      const el = estado?.elementos.find((x) => x.slug === slug)
      if (!el) return
      const next = slots.map((x, idx) => {
        if (idx === i) return el
        if (origen?.tipo === 'slot' && idx === origen.index) return null
        return x
      })
      set({ slots: next })
      get().marcarVisto(slug)
      if (next[0] && next[1]) void get().ejecutarCombinacion(next[0].slug, next[1].slug, { origen: 'mesa' })
    },

    // Clic en una tarjeta de resultado: limpia el círculo y coloca ese
    // elemento en el primer espacio, listo para seguir encadenando.
    usarResultado: (elementId) => {
      const el = get().estado?.elementos.find((x) => x.id === elementId)
      if (!el) return
      set({ slots: [el, null] })
    },

    // Panel de depuración (admin): expande los ingredientes de una receta
    // pendiente en unidades sueltas (ojo ×2 → ojo, ojo) listas para el círculo.
    autocompletarPendiente: (recipeId) => {
      const unidades = unidadesDePendiente(get().pendientes, recipeId)
      if (unidades.length === 0) return
      set({ slots: [unidades[0] ?? null, unidades[1] ?? null], resultado: null })
    },

    // Doble clic: carga los ingredientes y lanza la combinación al momento.
    combinarPendiente: (recipeId) => {
      const unidades = unidadesDePendiente(get().pendientes, recipeId)
      if (unidades.length < 2) return
      set({ slots: [unidades[0], unidades[1]] })
      void get().ejecutarCombinacion(unidades[0].slug, unidades[1].slug, { origen: 'mesa' })
    },

    // Núcleo de combinación compartido por el círculo y los arrastres.
    // El lienzo solo altera sus instancias después de una respuesta exitosa.
    ejecutarCombinacion: async (slugA, slugB, opts) => {
      if (
        combinandoEnCurso ||
        get().reiniciando ||
        (get().pendingRitualRisk && !opts.confirmRitualRisk)
      )
        return
      combinandoEnCurso = true
      const baseRapida =
        opts.origen === 'mesa' && get().modoRapido ? (get().slots[0] ?? null) : null
      set({
        combinando: true,
        resultado: null,
      })
      try {
        const res = await fetch('/api/combine', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            elementos: [slugA, slugB],
            confirmRitualRisk: opts.confirmRitualRisk ?? false,
          }),
        })
        const data = await res.json()
        if (!res.ok) {
          if (opts.confirmRitualRisk) {
            set({ pendingRitualRisk: null })
            await get().cargarEstado()
          }
          get().mostrarAviso(data?.error ?? 'The archive remains silent.', 'peligro')
          return
        }
        const rawResult = parseCombineResult(data)
        const r = rawResult.kind === 'RESOLVED'
          ? {
              ...rawResult,
              results: rawResult.results.map((output) => ({
                ...output,
                element: output.element,
              })),
            }
          : rawResult
        if (r.kind === 'RITUAL_KNOWLEDGE_REQUIRED') {
          set({ pendingRitualRisk: null })
          if (opts.confirmRitualRisk) await get().cargarEstado()
          get().mostrarAviso(r.message, 'peligro')
          return
        }
        if (r.kind === 'RITUAL_PREPARATION_REQUIRED') {
          set({
            pendingRitualRisk: {
              elementos: [slugA, slugB],
              opciones: { ...opts, confirmRitualRisk: false },
            },
          })
          return
        }
        if (opts.confirmRitualRisk) set({ pendingRitualRisk: null })
        if (r.memoryDelta) get().aplicarDeltaMemoriaAprendiz(r.memoryDelta)
        if (r.unlockedAchievements.length > 0) {
          set((prev) => {
            const ids = new Set(prev.logrosPendientes.map((achievement) => achievement.id))
            return {
              logrosPendientes: [
                ...prev.logrosPendientes,
                ...r.unlockedAchievements.filter((achievement) => !ids.has(achievement.id)),
              ],
            }
          })
        }
        if (r.results.length > 0) registrarResultado(r)

        // Tutorial de una sola vez: el primer avance rompe la regla de que
        // nada se gasta, así que merece una explicación puntual.
        if (
          r.results.some((salida) => salida.element.kind === 'ADVANCE') &&
          !window.localStorage.getItem(TUTORIAL_AVANCE_KEY)
        ) {
          set({ tutorialAvance: true })
        }

        set((prev) => ({ resultado: r, sello: prev.sello + 1 }))
        if (r.success && r.results.length > 0) {
          // El modo rápido holds la base (salvo que haya sido consumida)
          // y deja el segundo hueco listo para el siguiente toque.
          if (opts.origen === 'mesa') {
            const baseDisponible =
              baseRapida && !r.consumedSlugs.includes(baseRapida.slug) ? baseRapida : null
            set({ slots: baseRapida ? [baseDisponible, null] : [null, null] })
          } else if (opts.origen === 'bandeja') {
            const { sourceInstanceId, targetInstanceId, x, y } = opts.bandeja
            const usadas = new Set([targetInstanceId, sourceInstanceId].filter(Boolean))
            set((prev) => {
              const elementos = new Map(
                prev.estado?.elementos.map((elemento) => [elemento.id, elemento]) ?? [],
              )
              let indice = 0
              const creadas = r.results.flatMap((salida) => {
                const elemento = elementos.get(salida.element.id)
                if (!elemento) return []
                return Array.from({ length: salida.quantity }, () => {
                  const angulo = indice * 2.4
                  const radio = indice === 0 ? 0 : 0.045
                  indice += 1
                  return crearInstanciaBandeja(
                    elemento,
                    x + Math.cos(angulo) * radio,
                    y + Math.sin(angulo) * radio,
                  )
                })
              })
              return {
                bandeja: [
                  ...prev.bandeja.filter((instancia) => !usadas.has(instancia.instanceId)),
                  ...creadas,
                ],
              }
            })
          }
          programarCargaPendientes()
        } else if (opts.origen === 'mesa') {
          // En modo rápido basta tocar otro elemento para el siguiente intento.
          set((prev) => ({
            fallo: prev.fallo + 1,
            ...(baseRapida ? { slots: [baseRapida, null] } : {}),
          }))
        }
        feedbackTactil(r.success && r.results.length > 0 ? [12, 28, 18] : 22)
        if (
          opts.confirmRitualRisk ||
          r.results.length > 0 ||
          r.consumedSlugs.length > 0
        ) {
          await get().cargarEstado()
          void get().refrescarPotencial()
        }
      } catch {
        get().mostrarAviso('No connection to the archive. Try again.', 'peligro')
      } finally {
        combinandoEnCurso = false
        set({ combinando: false })
      }
    },

    // Combinación directa por arrastre (icono sobre icono): no toca el círculo.
    combinarDirecto: (slugA, slugB) => {
      void get().ejecutarCombinacion(slugA, slugB, { origen: 'directo' })
    },
  }
}
