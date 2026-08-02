import 'server-only'
// Validacion previa a la importacion: no toca la base de datos.

import { isIntentionalRecipeAdvanceDualOutcome } from '@/shared/formulaOverlapPolicy'
import { phaseRuleElementSlugs } from '@/shared/phaseRules'
import { buildRecipeInputKey } from '@/shared/inputKey'
import type { ResumenImportacion } from '@/shared/adminTree'
import { importDocumentoSchema, type ImportDocumento } from '../../schemas'
import { ImportError } from './errores'

// ---------- Validación previa a la importación ----------

export function validarDocumento(raw: unknown): { doc: ImportDocumento; resumen: ResumenImportacion } {
  const parsed = importDocumentoSchema.safeParse(raw)
  if (!parsed.success) {
    const detalle = parsed.error.issues
      .slice(0, 8)
      .map((i) => `${i.path.join('.') || 'raíz'}: ${i.message}`)
      .join(' · ')
    throw new ImportError(`El archivo no tiene un formato válido. ${detalle}`)
  }
  const doc = parsed.data
  const problemas: string[] = []

  const catSlugs = new Set(doc.categorias.map((c) => c.slug))
  const elSlugs = new Set(doc.elementos.map((e) => e.slug))
  const caminoSlugs = new Set(doc.caminos.map((p) => p.slug))

  if (catSlugs.size !== doc.categorias.length) problemas.push('Hay categorías con slug repetido.')
  if (elSlugs.size !== doc.elementos.length) problemas.push('Hay elementos con slug repetido.')
  if (caminoSlugs.size !== doc.caminos.length) problemas.push('Hay caminos con slug repetido.')

  for (const c of doc.categorias) {
    if (c.parentSlug && !catSlugs.has(c.parentSlug))
      problemas.push(`La categoría «${c.slug}» apunta a un padre inexistente («${c.parentSlug}»).`)
  }
  for (const e of doc.elementos) {
    for (const ec of e.categorias) {
      if (!catSlugs.has(ec.slug))
        problemas.push(`El elemento «${e.slug}» usa la categoría inexistente «${ec.slug}».`)
    }
    for (const t of e.unlockedByElements) {
      if (!elSlugs.has(t))
        problemas.push(`El elemento «${e.slug}» tiene el desencadenante inexistente «${t}».`)
      if (t === e.slug)
        problemas.push(`El elemento «${e.slug}» se desencadena a sí mismo.`)
    }
    for (const t of e.unlockedByAllElements) {
      if (!elSlugs.has(t))
        problemas.push(`El elemento «${e.slug}» tiene el requisito AND inexistente «${t}».`)
      if (t === e.slug)
        problemas.push(`El elemento «${e.slug}» se requiere a sí mismo en un AND.`)
    }
  }
  for (const p of doc.caminos) {
    if (!catSlugs.has(p.categorySlug))
      problemas.push(`El camino «${p.slug}» usa la categoría inexistente «${p.categorySlug}».`)
  }
  const seqPorElemento = new Set<string>()
  const seqPorCaminoNumero = new Set<string>()
  const elementoPorCaminoNumero = new Map<string, string>()
  for (const s of doc.secuencias) {
    if (!caminoSlugs.has(s.pathwaySlug))
      problemas.push(`La secuencia ${s.number} referencia el camino inexistente «${s.pathwaySlug}».`)
    if (!elSlugs.has(s.elementSlug))
      problemas.push(`La secuencia ${s.number} referencia el elemento inexistente «${s.elementSlug}».`)
    if (seqPorElemento.has(s.elementSlug))
      problemas.push(`El elemento «${s.elementSlug}» representa más de una secuencia.`)
    seqPorElemento.add(s.elementSlug)
    const key = `${s.pathwaySlug}#${s.number}`
    if (seqPorCaminoNumero.has(key))
      problemas.push(`El camino «${s.pathwaySlug}» repite la secuencia número ${s.number}.`)
    seqPorCaminoNumero.add(key)
    elementoPorCaminoNumero.set(key, s.elementSlug)
  }
  const claves = new Set<string>()
  const recetasPorClave = new Map<string, (typeof doc.recetas)[number]>()
  for (const r of doc.recetas) {
    if (r.outputs.length === 0) {
      problemas.push('Una receta no tiene ningún resultado.')
    }
    for (const o of r.outputs) {
      if (!elSlugs.has(o.elementSlug))
        problemas.push(`Una receta produce el elemento inexistente «${o.elementSlug}».`)
    }
    for (const i of r.ingredientes) {
      if (!elSlugs.has(i.elementSlug))
        problemas.push(`Una receta usa el ingrediente inexistente «${i.elementSlug}».`)
    }
    // La inputKey SIEMPRE se recalcula aquí; la del archivo (si viene) se ignora.
    const key = buildRecipeInputKey(
      r.ingredientes.map((i) => ({ slug: i.elementSlug, quantity: i.quantity })),
    )
    if (claves.has(key)) problemas.push(`Hay recetas duplicadas para la combinación «${key}».`)
    claves.add(key)
    recetasPorClave.set(key, r)
  }
  const advanceKeys = new Set<string>()
  const advancesByKey = new Map<string, (typeof doc.avances)[number]>()
  for (const advance of doc.avances) {
    if (!caminoSlugs.has(advance.pathwaySlug)) {
      problemas.push(`Un avance usa el camino inexistente «${advance.pathwaySlug}».`)
    }
    if (!seqPorCaminoNumero.has(`${advance.pathwaySlug}#${advance.sourceSequenceNumber}`)) {
      problemas.push(`Un avance usa una secuencia de origen inexistente.`)
    }
    if (!seqPorCaminoNumero.has(`${advance.pathwaySlug}#${advance.targetSequenceNumber}`)) {
      problemas.push(`Un avance usa una secuencia de destino inexistente.`)
    }
    if (advance.sourceSequenceNumber === advance.targetSequenceNumber) {
      problemas.push(`El avance «${advance.internalName}» usa la misma secuencia como origen y destino.`)
    }
    for (const ingredient of advance.ingredientes) {
      if (!elSlugs.has(ingredient.elementSlug)) {
        problemas.push(`Un avance usa el ingrediente inexistente «${ingredient.elementSlug}».`)
      }
    }
    const key = buildRecipeInputKey(
      advance.ingredientes.map((ingredient) => ({
        slug: ingredient.elementSlug,
        quantity: ingredient.quantity,
      })),
    )
    const overlappingRecipe = recetasPorClave.get(key)
    const targetSlug = elementoPorCaminoNumero.get(
      `${advance.pathwaySlug}#${advance.targetSequenceNumber}`,
    )
    if (
      overlappingRecipe &&
      (!targetSlug ||
        !isIntentionalRecipeAdvanceDualOutcome({
          inputKey: key,
          recipeOutputSlugs: overlappingRecipe.outputs.map((output) => output.elementSlug),
          advanceTargetSlug: targetSlug,
        }))
    ) {
      problemas.push(`La combinación «${key}» está repetida entre recetas y avances.`)
    }
    if (advanceKeys.has(key)) problemas.push(`Hay avances duplicados para la combinación «${key}».`)
    claves.add(key)
    advanceKeys.add(key)
    advancesByKey.set(key, advance)
  }
  const ritualKeys = new Set<string>()
  for (const ritual of doc.rituales) {
    for (const ingredient of [...ritual.ingredientes, ...ritual.advanceIngredients]) {
      if (!elSlugs.has(ingredient.elementSlug)) {
        problemas.push(`El ritual «${ritual.name}» usa el elemento inexistente «${ingredient.elementSlug}».`)
      }
    }
    for (const slug of ritual.failureOutputSlugs) {
      if (!elSlugs.has(slug)) problemas.push(`El ritual «${ritual.name}» produce el elemento inexistente «${slug}».`)
    }
    const key = buildRecipeInputKey(
      ritual.ingredientes.map((ingredient) => ({ slug: ingredient.elementSlug, quantity: ingredient.quantity })),
    )
    if (ritualKeys.has(key)) problemas.push(`Hay rituales duplicados para la combinación «${key}».`)
    ritualKeys.add(key)
    const advanceKey = buildRecipeInputKey(
      ritual.advanceIngredients.map((ingredient) => ({ slug: ingredient.elementSlug, quantity: ingredient.quantity })),
    )
    if (!advanceKeys.has(advanceKey)) problemas.push(`El ritual «${ritual.name}» usa un avance inexistente.`)
    const linkedAdvance = advancesByKey.get(advanceKey)
    if (
      linkedAdvance &&
      ritual.requiredSequenceNumber !== linkedAdvance.sourceSequenceNumber
    ) {
      problemas.push(
        `El ritual «${ritual.name}» exige la secuencia ${ritual.requiredSequenceNumber}, pero su avance parte de la ${linkedAdvance.sourceSequenceNumber}.`,
      )
    }
  }
  const logroSlugs = new Set<string>()
  for (const achievement of doc.logros) {
    if (logroSlugs.has(achievement.slug)) problemas.push(`Hay logros con el slug repetido «${achievement.slug}».`)
    logroSlugs.add(achievement.slug)
    if (achievement.triggerType === 'ELEMENT') {
      if (!elSlugs.has(achievement.triggerElementSlug)) {
        problemas.push(`El logro «${achievement.slug}» usa un elemento inexistente.`)
      }
    } else if (!seqPorCaminoNumero.has(`${achievement.triggerPathwaySlug}#${achievement.triggerSequenceNumber}`)) {
      problemas.push(`El logro «${achievement.slug}» usa una secuencia inexistente.`)
    }
  }
  const phaseSlugs = new Set<string>()
  const phaseOrders = new Set<number>()
  for (const phase of doc.fases) {
    if (phaseSlugs.has(phase.slug)) problemas.push(`Hay fases con el slug repetido «${phase.slug}».`)
    if (phaseOrders.has(phase.sortOrder)) problemas.push(`Hay fases con el orden repetido ${phase.sortOrder}.`)
    phaseSlugs.add(phase.slug)
    phaseOrders.add(phase.sortOrder)
    for (const elementSlug of phaseRuleElementSlugs(phase.advancementRule)) {
      if (!elSlugs.has(elementSlug)) {
        problemas.push(
          `La regla de la fase «${phase.slug}» referencia el elemento inexistente «${elementSlug}».`,
        )
      }
    }
  }
  for (const element of doc.elementos) {
    if (
      element.openingPhaseSlug !== undefined &&
      element.openingPhaseSlug !== null &&
      !phaseSlugs.has(element.openingPhaseSlug)
    ) {
      problemas.push(
        `El elemento «${element.slug}» referencia la fase inexistente «${element.openingPhaseSlug}».`,
      )
    }
  }
  if (new Set(doc.featureGates.map((gate) => gate.key)).size !== doc.featureGates.length) {
    problemas.push('Hay features repetidas.')
  }

  return {
    doc,
    resumen: {
      fases: doc.fases.length,
      featureGates: doc.featureGates.length,
      categorias: doc.categorias.length,
      elementos: doc.elementos.length,
      caminos: doc.caminos.length,
      secuencias: doc.secuencias.length,
      recetas: doc.recetas.length,
      avances: doc.avances.length,
      rituales: doc.rituales.length,
      logros: doc.logros.length,
      problemas,
    },
  }
}

