import type { Aviso } from './tipos'

export function appendAviso(avisos: Aviso[], aviso: Aviso): Aviso[] {
  return [...avisos.slice(-2), aviso]
}

export function removeAviso(avisos: Aviso[], id: number): Aviso[] {
  return avisos.filter((aviso) => aviso.id !== id)
}
