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
