import 'server-only'
// Ejecucion transaccional de la importacion: o todo o nada.

import type { PrismaClient } from '@/generated/prisma/client'
import { isIntentionalRecipeAdvanceDualOutcome } from '@/shared/formulaOverlapPolicy'
import { serializePhaseRule, type PhaseRule } from '@/shared/phaseRules'
import { buildRecipeInputKey } from '@/shared/inputKey'
import type { ResumenImportacion } from '@/shared/adminTree'
import type { ImportDocumento } from '../../schemas'
import { descubrirIniciales } from '../../domain/descubrimientos'
import { sincronizarStartersConPrimeraFase } from '../fasesProgresion'
import { ImportError } from './errores'
import { validarDocumento } from './importValidate'

// ---------- Importación (transaccional: o todo o nada) ----------

export async function importarContenido(
  db: PrismaClient,
  raw: unknown,
  modo: 'reemplazar' | 'fusionar',
): Promise<ResumenImportacion> {
  const { doc, resumen } = validarDocumento(raw)
  if (resumen.problemas.length > 0) {
    throw new ImportError(`El archivo tiene problemas: ${resumen.problemas.join(' · ')}`)
  }

  await db.$transaction(async (tx) => {
    if (modo === 'reemplazar') {
      const progressCounts = await Promise.all([
        tx.playerDiscovery.count(),
        tx.playerPathwayUnlock.count(),
        tx.playerAdvance.count(),
        tx.playerRitual.count(),
        tx.playerAchievement.count(),
        tx.playerCombinationStat.count(),
      ])
      if (progressCounts.some((count) => count > 0)) {
        throw new ImportError(
          'No se puede reemplazar el catálogo mientras exista progreso de jugadores. Usa fusión o una base nueva.',
        )
      }
      await tx.recipeIngredient.deleteMany({})
      await tx.recipe.deleteMany({})
      await tx.advance.deleteMany({})
      await tx.achievement.deleteMany({})
      await tx.sequence.deleteMany({})
      await tx.pathway.deleteMany({})
      await tx.elementCategory.deleteMany({})
      await tx.element.deleteMany({})
      await tx.progressionPhase.deleteMany({})
      await tx.category.deleteMany({})
    }

    for (const phase of doc.fases) {
      const phaseData = {
        name: phase.name,
        description: phase.description,
        sortOrder: phase.sortOrder,
        unlockAtDiscoveryCount: phase.unlockAtDiscoveryCount,
        advancementRuleJson: serializePhaseRule(phase.advancementRule),
        celebrationMessage: phase.celebrationMessage,
        isActive: phase.isActive,
      }
      await tx.progressionPhase.upsert({
        where: { slug: phase.slug },
        update: phaseData,
        create: { slug: phase.slug, ...phaseData },
      })
    }
    const phaseIdBySlug = new Map(
      (
        await tx.progressionPhase.findMany({ select: { id: true, slug: true } })
      ).map((phase) => [phase.slug, phase.id]),
    )

    for (const gate of doc.featureGates) {
      await tx.featureGate.upsert({
        where: { key: gate.key },
        update: { minimumPhaseSortOrder: gate.minimumPhaseSortOrder },
        create: gate,
      })
    }

    // Categorías: primero sin padre (dos pasadas para tolerar cualquier orden).
    for (const c of doc.categorias) {
      await tx.category.upsert({
        where: { slug: c.slug },
        update: {
          name: c.name,
          description: c.description ?? null,
          sortOrder: c.sortOrder,
          isHidden: c.isHidden,
          isActive: c.isActive,
        },
        create: {
          slug: c.slug,
          name: c.name,
          description: c.description ?? null,
          sortOrder: c.sortOrder,
          isHidden: c.isHidden,
          isActive: c.isActive,
        },
      })
    }
    for (const c of doc.categorias) {
      if (!c.parentSlug) continue
      const padre = await tx.category.findUnique({ where: { slug: c.parentSlug } })
      await tx.category.update({
        where: { slug: c.slug },
        data: { parentId: padre?.id ?? null },
      })
    }

    for (const e of doc.elementos) {
      const data = {
        name: e.name,
        description: e.description,
        iconKey: e.iconKey,
        imageUrl: e.imageUrl ?? null,
        type: e.type,
        tier: e.tier,
        isStarter: e.isStarter,
        isHiddenUntilDiscovered: e.isHiddenUntilDiscovered,
        isMajorDiscovery: e.isMajorDiscovery,
        revealTitle: e.revealTitle ?? null,
        revealText: e.revealText ?? null,
        unlockedByType: e.unlockedByType ?? null,
        unlockedBySequenceNumber: e.unlockedBySequenceNumber ?? null,
        unlockedAtDiscoveryCount: e.unlockedAtDiscoveryCount ?? null,
        ...(e.openingPhaseSlug !== undefined
          ? {
              availableFromPhaseId: e.openingPhaseSlug
                ? (phaseIdBySlug.get(e.openingPhaseSlug) ?? null)
                : null,
            }
          : {}),
        isActive: e.isActive,
      }
      const el = await tx.element.upsert({
        where: { slug: e.slug },
        update: data,
        create: { slug: e.slug, ...data },
      })
      await tx.elementCategory.deleteMany({ where: { elementId: el.id } })
      for (const ec of e.categorias) {
        const cat = await tx.category.findUnique({ where: { slug: ec.slug } })
        if (!cat) throw new ImportError(`Categoría no encontrada: ${ec.slug}`)
        await tx.elementCategory.create({
          data: { elementId: el.id, categoryId: cat.id, isPrimary: ec.isPrimary },
        })
      }
    }

    // Desencadenantes espontáneos: segunda pasada, cuando ya existen todos
    // los elementos (pueden referenciarse en cualquier orden).
    for (const e of doc.elementos) {
      const el = await tx.element.findUnique({ where: { slug: e.slug } })
      if (!el) continue
      await tx.elementUnlockTrigger.deleteMany({ where: { elementId: el.id } })
      for (const slug of new Set(e.unlockedByElements)) {
        if (slug === e.slug) continue
        const trigger = await tx.element.findUnique({ where: { slug } })
        if (!trigger) throw new ImportError(`Desencadenante no encontrado: ${slug}`)
        await tx.elementUnlockTrigger.create({
          data: { elementId: el.id, triggerId: trigger.id },
        })
      }
    }

    // Requisitos AND: sincronizar en una segunda pasada, cuando ya existen todos los elementos.
    for (const e of doc.elementos) {
      const el = await tx.element.findUnique({ where: { slug: e.slug } })
      if (!el) continue
      await tx.elementUnlockRequirement.deleteMany({ where: { elementId: el.id } })
      for (const slug of new Set(e.unlockedByAllElements)) {
        if (slug === e.slug) continue
        const required = await tx.element.findUnique({ where: { slug } })
        if (!required) throw new ImportError(`Requisito AND no encontrado: ${slug}`)
        await tx.elementUnlockRequirement.create({
          data: { elementId: el.id, requiredElementId: required.id },
        })
      }
    }

    for (const p of doc.caminos) {
      const cat = await tx.category.findUnique({ where: { slug: p.categorySlug } })
      if (!cat) throw new ImportError(`Categoría no encontrada: ${p.categorySlug}`)
      const data = {
        name: p.name,
        description: p.description,
        categoryId: cat.id,
        iconKey: p.iconKey ?? null,
        isHiddenUntilDiscovered: p.isHiddenUntilDiscovered,
        isActive: p.isActive,
      }
      await tx.pathway.upsert({
        where: { slug: p.slug },
        update: data,
        create: { slug: p.slug, ...data },
      })
    }

    for (const s of doc.secuencias) {
      const [camino, elemento] = await Promise.all([
        tx.pathway.findUnique({ where: { slug: s.pathwaySlug } }),
        tx.element.findUnique({ where: { slug: s.elementSlug } }),
      ])
      if (!camino || !elemento) throw new ImportError('Secuencia con referencias inválidas.')
      await tx.sequence.upsert({
        where: { elementId: elemento.id },
        update: {
          pathwayId: camino.id,
          number: s.number,
          name: s.name,
          description: s.description ?? null,
        },
        create: {
          pathwayId: camino.id,
          number: s.number,
          name: s.name,
          description: s.description ?? null,
          elementId: elemento.id,
        },
      })
    }

    for (const r of doc.recetas) {
      const outputs: { elementId: string; quantity: number; chance: number; sortOrder: number }[] = []
      for (const o of r.outputs) {
        const el = await tx.element.findUnique({ where: { slug: o.elementSlug } })
        if (!el) throw new ImportError(`Elemento resultado no encontrado: ${o.elementSlug}`)
        outputs.push({ elementId: el.id, quantity: o.quantity, chance: o.chance, sortOrder: o.sortOrder })
      }
      const inputKey = buildRecipeInputKey(
        r.ingredientes.map((i) => ({ slug: i.elementSlug, quantity: i.quantity })),
      )
      const existingAdvance = await tx.advance.findUnique({
        where: { inputKey },
        select: { targetSequence: { select: { element: { select: { slug: true } } } } },
      })
      if (
        existingAdvance &&
        !isIntentionalRecipeAdvanceDualOutcome({
          inputKey,
          recipeOutputSlugs: r.outputs.map((output) => output.elementSlug),
          advanceTargetSlug: existingAdvance.targetSequence.element.slug,
        })
      ) {
        throw new ImportError(`La combinación «${inputKey}» ya pertenece a un avance.`)
      }
      const ingredientes: { elementId: string; quantity: number }[] = []
      for (const i of r.ingredientes) {
        const el = await tx.element.findUnique({ where: { slug: i.elementSlug } })
        if (!el) throw new ImportError(`Ingrediente no encontrado: ${i.elementSlug}`)
        ingredientes.push({ elementId: el.id, quantity: i.quantity })
      }
      const data = {
        name: r.name ?? null,
        successText: r.successText ?? null,
        hintText: r.hintText ?? null,
        isActive: r.isActive,
        minimumDiscoveries: r.minimumDiscoveries,
      }
      const receta = await tx.recipe.upsert({
        where: { inputKey },
        update: data,
        create: { inputKey, ...data },
      })
      await tx.recipeIngredient.deleteMany({ where: { recipeId: receta.id } })
      await tx.recipeOutput.deleteMany({ where: { recipeId: receta.id } })
      for (const i of ingredientes) {
        await tx.recipeIngredient.create({ data: { recipeId: receta.id, ...i } })
      }
      for (const o of outputs) {
        await tx.recipeOutput.create({ data: { recipeId: receta.id, ...o } })
      }
    }

    for (const advance of doc.avances) {
      const pathway = await tx.pathway.findUnique({ where: { slug: advance.pathwaySlug } })
      if (!pathway) throw new ImportError(`Camino no encontrado: ${advance.pathwaySlug}`)
      const [sourceSequence, targetSequence] = await Promise.all([
        tx.sequence.findUnique({
          where: {
            pathwayId_number: {
              pathwayId: pathway.id,
              number: advance.sourceSequenceNumber,
            },
          },
          include: { element: { select: { slug: true } } },
        }),
        tx.sequence.findUnique({
          where: {
            pathwayId_number: {
              pathwayId: pathway.id,
              number: advance.targetSequenceNumber,
            },
          },
          include: { element: { select: { slug: true } } },
        }),
      ])
      if (!sourceSequence || !targetSequence) {
        throw new ImportError(`El avance «${advance.internalName}» tiene secuencias inválidas.`)
      }

      const ingredients: { elementId: string; quantity: number }[] = []
      for (const ingredient of advance.ingredientes) {
        const element = await tx.element.findUnique({ where: { slug: ingredient.elementSlug } })
        if (!element) throw new ImportError(`Ingrediente no encontrado: ${ingredient.elementSlug}`)
        ingredients.push({ elementId: element.id, quantity: ingredient.quantity })
      }
      const inputKey = buildRecipeInputKey(
        advance.ingredientes.map((ingredient) => ({
          slug: ingredient.elementSlug,
          quantity: ingredient.quantity,
        })),
      )
      const existingRecipe = await tx.recipe.findUnique({
        where: { inputKey },
        select: { outputs: { select: { element: { select: { slug: true } } } } },
      })
      if (
        existingRecipe &&
        !isIntentionalRecipeAdvanceDualOutcome({
          inputKey,
          recipeOutputSlugs: existingRecipe.outputs.map((output) => output.element.slug),
          advanceTargetSlug: targetSequence.element.slug,
        })
      ) {
        throw new ImportError(`La combinación «${inputKey}» ya pertenece a una receta.`)
      }
      const saved = await tx.advance.upsert({
        where: { inputKey },
        update: {
          internalName: advance.internalName,
          sourceSequenceId: sourceSequence.id,
          targetSequenceId: targetSequence.id,
          isActive: advance.isActive,
        },
        create: {
          internalName: advance.internalName,
          inputKey,
          sourceSequenceId: sourceSequence.id,
          targetSequenceId: targetSequence.id,
          isActive: advance.isActive,
        },
      })
      await tx.advanceIngredient.deleteMany({ where: { advanceId: saved.id } })
      await tx.advanceIngredient.createMany({
        data: ingredients.map((ingredient) => ({ advanceId: saved.id, ...ingredient })),
      })
    }

    for (const ritual of doc.rituales) {
      const advanceInputKey = buildRecipeInputKey(
        ritual.advanceIngredients.map((ingredient) => ({
          slug: ingredient.elementSlug,
          quantity: ingredient.quantity,
        })),
      )
      const advance = await tx.advance.findUnique({ where: { inputKey: advanceInputKey } })
      if (!advance) throw new ImportError(`Avance del ritual «${ritual.name}» no encontrado.`)
      const inputKey = buildRecipeInputKey(
        ritual.ingredientes.map((ingredient) => ({
          slug: ingredient.elementSlug,
          quantity: ingredient.quantity,
        })),
      )
      const ingredients: { elementId: string; quantity: number }[] = []
      for (const ingredient of ritual.ingredientes) {
        const element = await tx.element.findUnique({ where: { slug: ingredient.elementSlug } })
        if (!element) throw new ImportError(`Ingrediente de ritual no encontrado: ${ingredient.elementSlug}`)
        ingredients.push({ elementId: element.id, quantity: ingredient.quantity })
      }
      const failureOutputs: string[] = []
      for (const slug of ritual.failureOutputSlugs) {
        const element = await tx.element.findUnique({ where: { slug } })
        if (!element) throw new ImportError(`Consecuencia de ritual no encontrada: ${slug}`)
        failureOutputs.push(element.id)
      }
      const saved = await tx.ritual.upsert({
        where: { inputKey },
        update: {
          name: ritual.name,
          advanceId: advance.id,
          requiredSequenceNumber: ritual.requiredSequenceNumber,
          isActive: ritual.isActive,
        },
        create: {
          name: ritual.name,
          inputKey,
          advanceId: advance.id,
          requiredSequenceNumber: ritual.requiredSequenceNumber,
          isActive: ritual.isActive,
        },
      })
      await tx.ritualIngredient.deleteMany({ where: { ritualId: saved.id } })
      await tx.ritualFailureOutput.deleteMany({ where: { ritualId: saved.id } })
      await tx.ritualIngredient.createMany({
        data: ingredients.map((ingredient) => ({ ritualId: saved.id, ...ingredient })),
      })
      await tx.ritualFailureOutput.createMany({
        data: failureOutputs.map((elementId) => ({ ritualId: saved.id, elementId })),
      })
    }

    for (const achievement of doc.logros) {
      let triggerElementId: string | null = null
      let triggerSequenceId: string | null = null
      if (achievement.triggerType === 'ELEMENT') {
        const element = await tx.element.findUnique({
          where: { slug: achievement.triggerElementSlug },
        })
        if (!element) throw new ImportError(`Elemento de logro no encontrado: ${achievement.triggerElementSlug}`)
        triggerElementId = element.id
      } else {
        const pathway = await tx.pathway.findUnique({
          where: { slug: achievement.triggerPathwaySlug },
        })
        if (!pathway) throw new ImportError(`Camino de logro no encontrado: ${achievement.triggerPathwaySlug}`)
        const sequence = await tx.sequence.findUnique({
          where: {
            pathwayId_number: {
              pathwayId: pathway.id,
              number: achievement.triggerSequenceNumber,
            },
          },
        })
        if (!sequence) throw new ImportError(`Secuencia del logro «${achievement.slug}» no encontrada.`)
        triggerSequenceId = sequence.id
      }
      const data = {
        name: achievement.name,
        description: achievement.description,
        iconKey: achievement.iconKey,
        triggerElementId,
        triggerSequenceId,
        isHiddenUntilUnlocked: achievement.isHiddenUntilUnlocked,
        isActive: achievement.isActive,
      }
      await tx.achievement.upsert({
        where: { slug: achievement.slug },
        update: data,
        create: { slug: achievement.slug, ...data },
      })
    }
    await sincronizarStartersConPrimeraFase(tx)
    const profiles = await tx.playerProfile.findMany({ select: { id: true } })
    for (const profile of profiles) await descubrirIniciales(tx, profile.id)
  })

  return resumen
}
