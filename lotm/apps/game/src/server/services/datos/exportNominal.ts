import 'server-only'
// Exportacion nominal: documento legible por humanos con nombres, no ids.

import type { PrismaClient } from '@/generated/prisma/client'
import { parsePhaseRule, summarizePhaseRule, type PhaseRule } from '@/shared/phaseRules'
import { DIFICULTAD_LABELS } from '@/shared/dificultad'
import { etiquetaRuta } from '../../domain/diagnostico'
import { cargarAnalisisProgresion } from '../progresion'
import type {
  DocumentoElementosNominal,
  ElementoDesencadenanteNominal,
  OrigenElementoNominal,
  RecetaNominal,
  SecuenciaResumida,
  UsoAvanceNominal,
  UsoRecetaNominal,
  UsoRitualNominal,
} from './tipos'
// ---------- Exportación nominal (v2) ----------

// Lista de nombres por unidad ("Ojo ×2" → ["Ojo", "Ojo"]), ordenada en español.
function nombresPorUnidad(
  ingredientes: { quantity: number; element: { name: string } }[],
): string[] {
  return ingredientes
    .flatMap((ingredient) => Array<string>(ingredient.quantity).fill(ingredient.element.name))
    .sort((a, b) => a.localeCompare(b, 'es'))
}

function nombresElementos(elementos: { element: { name: string } }[]): string[] {
  return elementos.map((e) => e.element.name).sort((a, b) => a.localeCompare(b, 'es'))
}
export async function exportarElementosYCombinaciones(
  db: PrismaClient,
): Promise<DocumentoElementosNominal> {
  const [elementos, caminos, fases, progresion] = await Promise.all([
    db.element.findMany({
      include: {
        sequence: { include: { pathway: { select: { name: true } } } },
        categories: { include: { category: { select: { name: true } } } },
        availableFromPhase: { select: { slug: true, name: true } },
        unlockTriggers: {
          include: {
            trigger: {
              select: {
                name: true,
                sequence: {
                  select: {
                    number: true,
                    name: true,
                    pathway: { select: { name: true } },
                  },
                },
              },
            },
          },
        },
        unlockRequirements: {
          include: {
            required: {
              select: {
                name: true,
                sequence: {
                  select: {
                    number: true,
                    name: true,
                    pathway: { select: { name: true } },
                  },
                },
              },
            },
          },
        },
        // Reverso de los bloqueos: a quién despierta este elemento.
        desencadena: { include: { element: { select: { name: true } } } },
        requiredFor: { include: { element: { select: { name: true } } } },
        outputs: {
          include: {
            recipe: {
              include: {
                ingredients: {
                  include: { element: { select: { name: true } } },
                },
              },
            },
          },
        },
        // Usos: dónde participa como ingrediente.
        usedIn: {
          include: {
            recipe: {
              include: {
                ingredients: { include: { element: { select: { name: true } } } },
                outputs: { include: { element: { select: { name: true } } } },
              },
            },
          },
        },
        advanceIngredients: {
          include: {
            advance: {
              include: {
                sourceSequence: {
                  include: {
                    element: { select: { name: true } },
                    pathway: { select: { name: true } },
                  },
                },
                targetSequence: { include: { element: { select: { name: true } } } },
              },
            },
          },
        },
        ritualIngredients: {
          include: {
            ritual: { include: { advance: { select: { internalName: true } } } },
          },
        },
      },
      orderBy: { name: 'asc' },
    }),
    db.pathway.findMany({
      include: {
        sequences: {
          // De la secuencia más alta (donde se empieza) a la más profunda.
          orderBy: { number: 'desc' },
          include: {
            element: { select: { id: true, name: true } },
            advancesTo: {
              include: {
                ingredients: { include: { element: { select: { name: true } } } },
                sourceSequence: { include: { element: { select: { name: true } } } },
                rituals: {
                  include: {
                    ingredients: { include: { element: { select: { name: true } } } },
                    failureOutputs: { include: { element: { select: { name: true } } } },
                  },
                  orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
                },
              },
              orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    }),
    db.progressionPhase.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        elements: {
          select: { name: true },
          orderBy: { name: 'asc' },
        },
      },
    }),
    cargarAnalisisProgresion(db),
  ])

  const avancesPorElemento = new Map<string, OrigenElementoNominal[]>()
  const fallosPorElemento = new Map<string, OrigenElementoNominal[]>()
  const agregarOrigen = (
    mapa: Map<string, OrigenElementoNominal[]>,
    elemento: string,
    origen: OrigenElementoNominal,
  ) => mapa.set(elemento, [...(mapa.get(elemento) ?? []), origen])

  for (const camino of caminos) {
    for (const secuencia of camino.sequences) {
      const destino: SecuenciaResumida = {
        tipo: 'SECUENCIA',
        numero: secuencia.number,
        nombre: secuencia.name,
        elemento: secuencia.element.name,
      }
      for (const avance of secuencia.advancesTo) {
        const origen: SecuenciaResumida = {
          tipo: 'SECUENCIA',
          numero: avance.sourceSequence.number,
          nombre: avance.sourceSequence.name,
          elemento: avance.sourceSequence.element.name,
        }
        agregarOrigen(avancesPorElemento, secuencia.element.id, {
          tipo: 'AVANCE',
          nombreInterno: avance.internalName,
          camino: camino.name,
          origen,
          destino,
          ingredientes: nombresPorUnidad(avance.ingredients),
          isActive: avance.isActive,
        })
        for (const ritual of avance.rituals) {
          for (const consecuencia of ritual.failureOutputs) {
            agregarOrigen(fallosPorElemento, consecuencia.elementId, {
              tipo: 'FALLO_RITUAL',
              nombre: ritual.name,
              avance: avance.internalName,
              camino: camino.name,
              origen,
              destino,
              requiredSequenceNumber: ritual.requiredSequenceNumber,
              ingredientes: nombresPorUnidad(ritual.ingredients),
              isActive: avance.isActive && ritual.isActive,
            })
          }
        }
      }
    }
  }

  const referenciaDesencadenante = (elemento: {
    name: string
    sequence: null | {
      number: number
      name: string
      pathway: { name: string }
    }
  }): ElementoDesencadenanteNominal => ({
    elemento: elemento.name,
    ...(elemento.sequence
      ? {
          camino: elemento.sequence.pathway.name,
          secuencia: elemento.sequence.number,
          nombreSecuencia: elemento.sequence.name,
        }
      : {}),
  })
  const elementNameBySlug = new Map(elementos.map((elemento) => [elemento.slug, elemento.name]))

  return {
    version: 4 as const,
    exportadoEn: new Date().toISOString(),
    fases: fases.map((fase) => {
      const rule = parsePhaseRule(fase.advancementRuleJson, fase.unlockAtDiscoveryCount)
      return {
        tipo: 'FASE' as const,
        slug: fase.slug,
        nombre: fase.name,
        descripcion: fase.description,
        orden: fase.sortOrder,
        isActive: fase.isActive,
        cierreAlcanzableAnterior: fase.unlockAtDiscoveryCount,
        reglaAvance: rule,
        resumenRegla: summarizePhaseRule(rule, elementNameBySlug),
        mensajeCelebracion: fase.celebrationMessage,
        elementosIniciales: fase.elements.map((elemento) => elemento.name),
      }
    }),
    elementos: elementos.map((elemento) => {
      const res = progresion.analisis.get(elemento.id)

      const combinaciones: RecetaNominal[] = elemento.outputs
        .slice()
        .sort((a, b) => a.recipe.inputKey.localeCompare(b.recipe.inputKey))
        .map((output) => ({
          tipo: 'RECETA' as const,
          ...(output.recipe.name ? { nombre: output.recipe.name } : {}),
          ingredientes: nombresPorUnidad(output.recipe.ingredients),
          descubrimientosMinimos: output.recipe.minimumDiscoveries,
          isActive: output.recipe.isActive,
        }))

      const usosEnRecetas: UsoRecetaNominal[] = elemento.usedIn
        .slice()
        .sort((a, b) => a.recipe.inputKey.localeCompare(b.recipe.inputKey))
        .map((uso) => ({
          tipo: 'USO_RECETA' as const,
          ...(uso.recipe.name ? { nombre: uso.recipe.name } : {}),
          ingredientes: nombresPorUnidad(uso.recipe.ingredients),
          produce: nombresElementos(uso.recipe.outputs),
          descubrimientosMinimos: uso.recipe.minimumDiscoveries,
          isActive: uso.recipe.isActive,
        }))

      const usosEnAvances: UsoAvanceNominal[] = elemento.advanceIngredients.map((uso) => ({
        tipo: 'USO_AVANCE' as const,
        nombreInterno: uso.advance.internalName,
        camino: uso.advance.sourceSequence.pathway.name,
        origen: {
          tipo: 'SECUENCIA' as const,
          numero: uso.advance.sourceSequence.number,
          nombre: uso.advance.sourceSequence.name,
          elemento: uso.advance.sourceSequence.element.name,
        },
        destino: {
          tipo: 'SECUENCIA' as const,
          numero: uso.advance.targetSequence.number,
          nombre: uso.advance.targetSequence.name,
          elemento: uso.advance.targetSequence.element.name,
        },
        isActive: uso.advance.isActive,
      }))

      const usosEnRituales: UsoRitualNominal[] = elemento.ritualIngredients.map((uso) => ({
        tipo: 'USO_RITUAL' as const,
        nombre: uso.ritual.name,
        avance: uso.ritual.advance.internalName,
        isActive: uso.ritual.isActive,
      }))

      const origenes: OrigenElementoNominal[] = [
        ...(elemento.isStarter ? [{ tipo: 'INICIAL' as const }] : []),
        ...(elemento.availableFromPhase
          ? [{ tipo: 'APERTURA_FASE' as const, fase: elemento.availableFromPhase.name }]
          : []),
        ...combinaciones,
        ...(avancesPorElemento.get(elemento.id) ?? []),
        ...(fallosPorElemento.get(elemento.id) ?? []),
        ...(elemento.unlockedByType
          ? [{ tipo: 'DESBLOQUEO_TIPO' as const, tipoElemento: elemento.unlockedByType }]
          : []),
        ...(elemento.unlockedBySequenceNumber !== null
          ? [
              {
                tipo: 'DESBLOQUEO_SECUENCIA' as const,
                secuencia: elemento.unlockedBySequenceNumber,
                alcance: 'CUALQUIER_CAMINO' as const,
              },
            ]
          : []),
        ...(elemento.unlockedAtDiscoveryCount !== null
          ? [
              {
                tipo: 'DESBLOQUEO_CANTIDAD' as const,
                cantidadMinima: elemento.unlockedAtDiscoveryCount,
              },
            ]
          : []),
        ...elemento.unlockTriggers.map((trigger) => ({
          tipo: 'DESBLOQUEO_ELEMENTO' as const,
          desencadenante: referenciaDesencadenante(trigger.trigger),
        })),
        ...(elemento.unlockRequirements.length > 0
          ? [
              {
                tipo: 'DESBLOQUEO_CONJUNTO' as const,
                requisitos: elemento.unlockRequirements
                  .map((requirement) => referenciaDesencadenante(requirement.required))
                  .sort((a, b) => a.elemento.localeCompare(b.elemento, 'es')),
              },
            ]
          : []),
      ]
      if (origenes.length === 0) origenes.push({ tipo: 'SIN_ORIGEN_CONFIGURADO' })

      return {
        tipo: 'ELEMENTO' as const,
        slug: elemento.slug,
        nombre: elemento.name,
        descripcion: elemento.description,
        tipoElemento: elemento.type,
        nivel: elemento.tier,
        categorias: elemento.categories
          .map((c) => c.category.name)
          .sort((a, b) => a.localeCompare(b, 'es')),
        isActive: elemento.isActive,
        alcanzable: res?.reachable ?? false,
        profundidad: res?.depth ?? null,
        dificultad: DIFICULTAD_LABELS[res?.difficulty ?? 'impossible'],
        rutaMasFacil: res ? etiquetaRuta(res.bestRoute) : 'Sin ruta válida',
        resumenRutas: res?.routeSummary ?? '—',
        faseApertura: elemento.availableFromPhase?.name ?? null,
        condicionesDesbloqueo: {
          cualquieraDe: elemento.unlockTriggers
            .map((trigger) => referenciaDesencadenante(trigger.trigger))
            .sort((a, b) => a.elemento.localeCompare(b.elemento, 'es')),
          todas: {
            tipoElemento: elemento.unlockedByType,
            secuencia: elemento.unlockedBySequenceNumber,
            cantidadMinima: elemento.unlockedAtDiscoveryCount,
            elementos: elemento.unlockRequirements
              .map((requirement) => referenciaDesencadenante(requirement.required))
              .sort((a, b) => a.elemento.localeCompare(b.elemento, 'es')),
          },
        },
        desbloqueadoPorTipo: elemento.unlockedByType,
        desbloqueadoPorSecuencia: elemento.unlockedBySequenceNumber,
        desbloqueadoPorCantidad: elemento.unlockedAtDiscoveryCount,
        desbloqueadoPorCualquieraDe: elemento.unlockTriggers
          .map((trigger) => trigger.trigger.name)
          .sort((a, b) => a.localeCompare(b, 'es')),
        desbloqueadoPorTodos: elemento.unlockRequirements
          .map((requirement) => requirement.required.name)
          .sort((a, b) => a.localeCompare(b, 'es')),
        desbloquea: elemento.desencadena
          .map((t) => t.element.name)
          .sort((a, b) => a.localeCompare(b, 'es')),
        esRequisitoDe: elemento.requiredFor
          .map((r) => r.element.name)
          .sort((a, b) => a.localeCompare(b, 'es')),
        ...(elemento.sequence
          ? {
              camino: elemento.sequence.pathway.name,
              secuencia: elemento.sequence.number,
              nombreSecuencia: elemento.sequence.name,
            }
          : {}),
        combinaciones,
        usosEnRecetas,
        usosEnAvances,
        usosEnRituales,
        origenes,
      }
    }),
    caminos: caminos.map((camino) => ({
      tipo: 'CAMINO' as const,
      nombre: camino.name,
      isActive: camino.isActive,
      secuencias: camino.sequences.map((secuencia) => {
        const destino: SecuenciaResumida = {
          tipo: 'SECUENCIA',
          numero: secuencia.number,
          nombre: secuencia.name,
          elemento: secuencia.element.name,
        }
        return {
          tipo: 'SECUENCIA' as const,
          numero: secuencia.number,
          nombre: secuencia.name,
          elemento: secuencia.element.name,
          ascensiones: secuencia.advancesTo
            .slice()
            .sort((a, b) => a.sourceSequence.number - b.sourceSequence.number)
            .map((avance) => ({
              tipo: 'ASCENSION' as const,
              origen: {
                tipo: 'SECUENCIA' as const,
                numero: avance.sourceSequence.number,
                nombre: avance.sourceSequence.name,
                elemento: avance.sourceSequence.element.name,
              },
              destino,
              avance: {
                tipo: 'AVANCE' as const,
                nombreInterno: avance.internalName,
                isActive: avance.isActive,
                ingredientes: nombresPorUnidad(avance.ingredients),
              },
              rituales: avance.rituals.map((ritual) => ({
                tipo: 'RITUAL' as const,
                nombre: ritual.name,
                isActive: ritual.isActive,
                requiredSequenceNumber: ritual.requiredSequenceNumber,
                ingredientes: nombresPorUnidad(ritual.ingredients),
                consecuenciasFallo: nombresElementos(ritual.failureOutputs),
              })),
            })),
        }
      }),
    })),
  }
}

