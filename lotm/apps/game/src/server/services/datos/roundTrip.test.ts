import assert from 'node:assert/strict'
import test from 'node:test'
import type { PrismaClient } from '@/generated/prisma/client'
import { exportarContenido } from './exportBackup'
import { validarDocumento } from './importValidate'

// Round-trip export → validate sobre un contenido que toca todas las entidades.
// No usa base de datos: comprueba que lo que produce el exportador de copia de
// seguridad lo acepta el validador de importación, que es el contrato que se
// puede romper en silencio al separar ambos módulos. La ejecución real de la
// importación necesita TEST_DATABASE_URL y queda fuera.

const phase = {
  slug: 'fase-1',
  name: 'Fase 1',
  description: 'Inicio',
  sortOrder: 1,
  unlockAtDiscoveryCount: 0,
  advancementRuleJson: '{"type":"ALWAYS"}',
  celebrationMessage: 'Enhorabuena',
  isActive: true,
}

const category = {
  slug: 'materia',
  name: 'Materia',
  description: 'Cosas tangibles',
  parent: null,
  sortOrder: 1,
  isHidden: false,
  isActive: true,
}

function element(slug: string, extra: Record<string, unknown> = {}) {
  return {
    slug,
    name: slug,
    description: `Descripción de ${slug}`,
    iconKey: 'sparkles',
    imageUrl: null,
    type: 'CONCEPTO',
    tier: 1,
    isStarter: true,
    isHiddenUntilDiscovered: false,
    isMajorDiscovery: false,
    revealTitle: null,
    revealText: null,
    unlockedByType: null,
    unlockedBySequenceNumber: null,
    unlockedAtDiscoveryCount: null,
    isActive: true,
    unlockTriggers: [],
    unlockRequirements: [],
    availableFromPhase: { slug: phase.slug },
    categories: [{ category: { slug: category.slug }, isPrimary: true }],
    ...extra,
  }
}

const agua = element('agua')
const fuego = element('fuego')
const vapor = element('vapor', { isStarter: false })
const semilla = element('semilla-vidente', { isStarter: false })

const pathway = {
  slug: 'vidente',
  name: 'Vidente',
  description: 'El camino del Vidente',
  category: { slug: category.slug },
  iconKey: 'eye',
  isHiddenUntilDiscovered: false,
  isActive: true,
}

function sequence(number: number, elementSlug: string) {
  return {
    pathway: { slug: pathway.slug },
    number,
    name: `Secuencia ${number}`,
    description: `Nivel ${number}`,
    element: { slug: elementSlug },
  }
}

const secuencia9 = sequence(9, semilla.slug)
const secuencia8 = sequence(8, vapor.slug)

const recipe = {
  name: 'Vapor',
  outputs: [{ element: { slug: vapor.slug }, quantity: 1, chance: 1, sortOrder: 0 }],
  successText: 'Se eleva una nube',
  hintText: null,
  minimumDiscoveries: 0,
  isActive: true,
  ingredients: [
    { element: { slug: agua.slug }, quantity: 1 },
    { element: { slug: fuego.slug }, quantity: 1 },
  ],
}

// Las fórmulas de avance y ritual deben sumar exactamente dos unidades.
const advanceIngredients = [
  { element: { slug: semilla.slug }, quantity: 1 },
  { element: { slug: agua.slug }, quantity: 1 },
]

const advance = {
  internalName: 'vidente-9-a-8',
  sourceSequence: { pathway: { slug: pathway.slug }, number: 9 },
  targetSequence: { number: 8 },
  isActive: true,
  ingredients: advanceIngredients,
}

const ritual = {
  name: 'Ritual del Vidente',
  requiredSequenceNumber: 9,
  isActive: true,
  advance: { ingredients: advanceIngredients },
  ingredients: [{ element: { slug: agua.slug }, quantity: 2 }],
  failureOutputs: [{ element: { slug: fuego.slug } }],
}

const logroElemento = {
  slug: 'primer-vapor',
  name: 'Primer vapor',
  description: 'Descubre el vapor',
  iconKey: 'trophy',
  isHiddenUntilUnlocked: false,
  isActive: true,
  triggerElement: { slug: vapor.slug },
  triggerSequence: null,
}

const logroSecuencia = {
  slug: 'vidente-8',
  name: 'Vidente de secuencia 8',
  description: 'Asciende a la secuencia 8',
  iconKey: 'trophy',
  isHiddenUntilUnlocked: true,
  isActive: true,
  triggerElement: null,
  triggerSequence: { pathway: { slug: pathway.slug }, number: 8 },
}

function poblada(): PrismaClient {
  return {
    progressionPhase: { findMany: async () => [phase] },
    featureGate: {
      findMany: async () => [{ key: 'ADVANCEMENT_RITUALS', minimumPhaseSortOrder: 6 }],
    },
    category: { findMany: async () => [category] },
    element: { findMany: async () => [agua, fuego, vapor, semilla] },
    pathway: { findMany: async () => [pathway] },
    sequence: { findMany: async () => [secuencia9, secuencia8] },
    recipe: { findMany: async () => [recipe] },
    advance: { findMany: async () => [advance] },
    ritual: { findMany: async () => [ritual] },
    achievement: { findMany: async () => [logroElemento, logroSecuencia] },
    elementUnlockTrigger: { findMany: async () => [] },
  } as unknown as PrismaClient
}

test('la copia de seguridad v5 que se exporta la acepta el validador de importación', async () => {
  const backup = await exportarContenido(poblada())

  assert.equal(backup.version, 5)

  const { doc, resumen } = validarDocumento(backup)

  assert.equal(resumen.fases, 1)
  assert.equal(resumen.categorias, 1)
  assert.equal(resumen.elementos, 4)
  assert.equal(resumen.caminos, 1)
  assert.equal(resumen.secuencias, 2)
  assert.equal(resumen.recetas, 1)
  assert.equal(resumen.logros, 2)

  // El documento validado conserva el contenido, no solo su forma.
  assert.equal(doc.elementos?.length, 4)
  assert.deepEqual(
    doc.recetas?.[0]?.ingredientes.map((i) => i.elementSlug).sort(),
    [agua.slug, fuego.slug],
  )
})

test('un documento exportado sin contenido sigue siendo válido', async () => {
  const vacio = {
    progressionPhase: { findMany: async () => [phase] },
    featureGate: { findMany: async () => [] },
    category: { findMany: async () => [] },
    element: { findMany: async () => [] },
    pathway: { findMany: async () => [] },
    sequence: { findMany: async () => [] },
    recipe: { findMany: async () => [] },
    advance: { findMany: async () => [] },
    ritual: { findMany: async () => [] },
    achievement: { findMany: async () => [] },
    elementUnlockTrigger: { findMany: async () => [] },
  } as unknown as PrismaClient

  const backup = await exportarContenido(vacio)
  const { resumen } = validarDocumento(backup)

  assert.equal(resumen.fases, 1)
  assert.equal(resumen.elementos, 0)
})
