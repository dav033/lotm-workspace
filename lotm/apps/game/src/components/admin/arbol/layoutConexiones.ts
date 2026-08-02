import { FAMILIA_ARISTA, type AristaArbol, type FamiliaArista } from './tipos'

export type FiltrosConexiones = Record<FamiliaArista, boolean>

export function filtrarAristasVisibles(
  aristas: readonly AristaArbol[],
  filtros: FiltrosConexiones,
): AristaArbol[] {
  return aristas.filter((arista) => filtros[FAMILIA_ARISTA[arista.tipo]])
}
