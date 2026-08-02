import 'server-only'
// Copia de seguridad completa (v5): estructura fiel para restaurar.

import type { PrismaClient } from '@/generated/prisma/client'
import { parsePhaseRule, type PhaseRule } from '@/shared/phaseRules'

export async function exportarContenido(db: PrismaClient) {
  const [fases, featureGates, categorias, elementos, caminos, secuencias, recetas, avances, rituales, logros] = await Promise.all([
    db.progressionPhase.findMany({ orderBy: { sortOrder: 'asc' } }),
    db.featureGate.findMany({ orderBy: { key: 'asc' } }),
    db.category.findMany({ include: { parent: { select: { slug: true } } }, orderBy: { sortOrder: 'asc' } }),
    db.element.findMany({
      include: {
        categories: { include: { category: { select: { slug: true } } } },
        unlockTriggers: { include: { trigger: { select: { slug: true } } } },
        unlockRequirements: { include: { required: { select: { slug: true } } } },
        availableFromPhase: { select: { slug: true } },
      },
      orderBy: { slug: 'asc' },
    }),
    db.pathway.findMany({ include: { category: { select: { slug: true } } }, orderBy: { slug: 'asc' } }),
    db.sequence.findMany({
      include: { pathway: { select: { slug: true } }, element: { select: { slug: true } } },
      orderBy: [{ pathwayId: 'asc' }, { number: 'asc' }],
    }),
    db.recipe.findMany({
      include: {
        outputs: { include: { element: { select: { slug: true } } } },
        ingredients: { include: { element: { select: { slug: true } } } },
      },
      orderBy: { inputKey: 'asc' },
    }),
    db.advance.findMany({
      include: {
        ingredients: { include: { element: { select: { slug: true } } } },
        sourceSequence: { include: { pathway: { select: { slug: true } } } },
        targetSequence: true,
      },
      orderBy: { inputKey: 'asc' },
    }),
    db.ritual.findMany({
      include: {
        advance: { include: { ingredients: { include: { element: { select: { slug: true } } } } } },
        ingredients: { include: { element: { select: { slug: true } } } },
        failureOutputs: { include: { element: { select: { slug: true } } } },
      },
      orderBy: { inputKey: 'asc' },
    }),
    db.achievement.findMany({
      include: {
        triggerElement: { select: { slug: true } },
        triggerSequence: { include: { pathway: { select: { slug: true } } } },
      },
      orderBy: { createdAt: 'asc' },
    }),
  ])

  return {
    version: 5 as const,
    exportadoEn: new Date().toISOString(),
    fases: fases.map((phase) => ({
      slug: phase.slug,
      name: phase.name,
      description: phase.description,
      sortOrder: phase.sortOrder,
      unlockAtDiscoveryCount: phase.unlockAtDiscoveryCount,
      advancementRule: parsePhaseRule(
        phase.advancementRuleJson,
        phase.unlockAtDiscoveryCount,
      ),
      celebrationMessage: phase.celebrationMessage,
      isActive: phase.isActive,
    })),
    featureGates: featureGates.map((gate) => ({
      key: gate.key,
      minimumPhaseSortOrder: gate.minimumPhaseSortOrder,
    })),
    categorias: categorias.map((c) => ({
      slug: c.slug,
      name: c.name,
      description: c.description,
      parentSlug: c.parent?.slug ?? null,
      sortOrder: c.sortOrder,
      isHidden: c.isHidden,
      isActive: c.isActive,
    })),
    elementos: elementos.map((e) => ({
      slug: e.slug,
      name: e.name,
      description: e.description,
      iconKey: e.iconKey,
      imageUrl: e.imageUrl,
      type: e.type,
      tier: e.tier,
      isStarter: e.isStarter,
      isHiddenUntilDiscovered: e.isHiddenUntilDiscovered,
      isMajorDiscovery: e.isMajorDiscovery,
      revealTitle: e.revealTitle,
      revealText: e.revealText,
      unlockedByType: e.unlockedByType,
      unlockedBySequenceNumber: e.unlockedBySequenceNumber,
      unlockedAtDiscoveryCount: e.unlockedAtDiscoveryCount,
      unlockedByElements: e.unlockTriggers.map((t) => t.trigger.slug),
      unlockedByAllElements: e.unlockRequirements.map((r) => r.required.slug),
      openingPhaseSlug: e.availableFromPhase?.slug ?? null,
      isActive: e.isActive,
      categorias: e.categories.map((ec) => ({
        slug: ec.category.slug,
        isPrimary: ec.isPrimary,
      })),
    })),
    caminos: caminos.map((p) => ({
      slug: p.slug,
      name: p.name,
      description: p.description,
      categorySlug: p.category.slug,
      iconKey: p.iconKey,
      isHiddenUntilDiscovered: p.isHiddenUntilDiscovered,
      isActive: p.isActive,
    })),
    secuencias: secuencias.map((s) => ({
      pathwaySlug: s.pathway.slug,
      number: s.number,
      name: s.name,
      description: s.description,
      elementSlug: s.element.slug,
    })),
    recetas: recetas.map((r) => ({
      name: r.name,
      outputs: r.outputs.map((o) => ({
        elementSlug: o.element.slug,
        quantity: o.quantity,
        chance: o.chance,
        sortOrder: o.sortOrder,
      })),
      successText: r.successText,
      hintText: r.hintText,
      minimumDiscoveries: r.minimumDiscoveries,
      isActive: r.isActive,
      ingredientes: r.ingredients.map((i) => ({
        elementSlug: i.element.slug,
        quantity: i.quantity,
      })),
    })),
    avances: avances.map((advance) => ({
      internalName: advance.internalName,
      pathwaySlug: advance.sourceSequence.pathway.slug,
      sourceSequenceNumber: advance.sourceSequence.number,
      targetSequenceNumber: advance.targetSequence.number,
      isActive: advance.isActive,
      ingredientes: advance.ingredients.map((ingredient) => ({
        elementSlug: ingredient.element.slug,
        quantity: ingredient.quantity,
      })),
    })),
    rituales: rituales.map((ritual) => ({
      name: ritual.name,
      requiredSequenceNumber: ritual.requiredSequenceNumber,
      isActive: ritual.isActive,
      advanceIngredients: ritual.advance.ingredients.map((ingredient) => ({
        elementSlug: ingredient.element.slug,
        quantity: ingredient.quantity,
      })),
      ingredientes: ritual.ingredients.map((ingredient) => ({
        elementSlug: ingredient.element.slug,
        quantity: ingredient.quantity,
      })),
      failureOutputSlugs: ritual.failureOutputs.map((output) => output.element.slug),
    })),
    logros: logros.map((achievement) =>
      achievement.triggerSequence
        ? {
            slug: achievement.slug,
            name: achievement.name,
            description: achievement.description,
            iconKey: achievement.iconKey,
            isHiddenUntilUnlocked: achievement.isHiddenUntilUnlocked,
            isActive: achievement.isActive,
            triggerType: 'SEQUENCE' as const,
            triggerPathwaySlug: achievement.triggerSequence.pathway.slug,
            triggerSequenceNumber: achievement.triggerSequence.number,
          }
        : {
            slug: achievement.slug,
            name: achievement.name,
            description: achievement.description,
            iconKey: achievement.iconKey,
            isHiddenUntilUnlocked: achievement.isHiddenUntilUnlocked,
            isActive: achievement.isActive,
            triggerType: 'ELEMENT' as const,
            triggerElementSlug: achievement.triggerElement?.slug ?? '',
          },
    ),
  }
}

