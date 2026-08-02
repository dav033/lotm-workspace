import type { DestinoArrastre, ElementoDescubierto, InstanciaBandeja } from '../tipos'

export function mismoDestino(a: DestinoArrastre, b: DestinoArrastre): boolean {
  if (a === b) return true
  if (!a || !b || a.tipo !== b.tipo) return false
  if (a.tipo === 'slot' && b.tipo === 'slot') return a.index === b.index
  if (a.tipo === 'elemento' && b.tipo === 'elemento') {
    return a.slug === b.slug && a.bandejaInstanceId === b.bandejaInstanceId
  }
  if (a.tipo === 'bandeja' && b.tipo === 'bandeja') return true
  return false
}

export function sincronizarBandeja(
  bandeja: InstanciaBandeja[],
  elementos: ElementoDescubierto[],
): InstanciaBandeja[] {
  const porId = new Map(elementos.map((elemento) => [elemento.id, elemento]))
  return bandeja.flatMap((instancia) => {
    const actualizado = porId.get(instancia.elemento.id)
    return actualizado ? [{ ...instancia, elemento: actualizado }] : []
  })
}

let instanciaBandejaId = 0

export function limitarPosicion(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : 0.5))
}

export function crearInstanciaBandeja(
  elemento: ElementoDescubierto,
  x: number,
  y: number,
): InstanciaBandeja {
  return {
    instanceId: `bandeja-${++instanciaBandejaId}`,
    elemento,
    x: limitarPosicion(x, 0.02, 0.98),
    y: limitarPosicion(y, 0.02, 0.98),
  }
}

export function agregarAperturasBandeja(
  bandeja: InstanciaBandeja[],
  aperturas: ElementoDescubierto[],
): InstanciaBandeja[] {
  const presentes = new Set(bandeja.map((instancia) => instancia.elemento.slug))
  const nuevas = aperturas.filter((elemento) => !presentes.has(elemento.slug))
  return [
    ...bandeja,
    ...nuevas.map((elemento, index) => {
      const columns = Math.min(4, Math.max(1, nuevas.length))
      const column = index % columns
      const row = Math.floor(index / columns)
      return crearInstanciaBandeja(elemento, (column + 1) / (columns + 1), 0.18 + row * 0.2)
    }),
  ]
}
