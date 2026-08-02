import type { VistaFases } from '@/shared/adminTree'
import type { AristaArbol, CaminoLeyenda, NodoArbol } from '../tipos'

export type GrafoFases = {
  nodos: NodoArbol[]
  aristas: AristaArbol[]
  caminos: CaminoLeyenda[]
}

export type RespuestaArbolFases = {
  fases: VistaFases
  grafo: GrafoFases
}

export type EstadoElemento =
  | 'disponible'
  | 'sin-ruta'
  | 'frontera'
  | 'bloqueado'
  | 'inactivo'

export const ESTADO_META: Record<EstadoElemento, { label: string; className: string }> = {
  disponible: {
    label: 'Alcanzable',
    className: 'border-emerald-500/45 bg-emerald-950/20 text-emerald-100',
  },
  'sin-ruta': {
    label: 'Sin ruta',
    className: 'border-amber-500/45 bg-amber-950/20 text-amber-100',
  },
  frontera: {
    label: 'Frontera',
    className: 'border-brass/70 bg-brass/15 text-parchment',
  },
  bloqueado: {
    label: 'Bloqueado',
    className: 'border-line bg-black/20 text-fog',
  },
  inactivo: {
    label: 'Inactivo',
    className: 'border-wine/40 bg-wine/10 text-fog',
  },
}
