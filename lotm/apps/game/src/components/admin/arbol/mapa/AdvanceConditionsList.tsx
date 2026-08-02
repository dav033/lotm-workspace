'use client'
import { Fragment } from 'react'
import Link from 'next/link'
import type { VistaFases } from '@/shared/adminTree'
import { FichaElemento } from './FichaElemento'

export function AdvanceConditionsList({
  advances,
  rituals,
  elementById,
  onSelect,
}: {
  advances: VistaFases['advances']
  rituals: VistaFases['rituals']
  elementById: Map<string, VistaFases['elements'][number]>
  onSelect: (id: string) => void
}) {
  if (advances.length === 0) return null

  return (
    <div className="mt-3 space-y-3">
      {advances.map((advance) => {
        const activeRituals = rituals.filter(
          (ritual) => ritual.advanceId === advance.id && ritual.isActive,
        )
        return (
          <article
            key={advance.id}
            className={`rounded-lg border p-3 ${
              advance.isActive ? 'border-brass/35 bg-brass/5' : 'border-wine/45 bg-wine/10'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-brass">Ruta de avance</p>
                <p className="mt-0.5 text-sm font-medium text-parchment">{advance.internalName}</p>
              </div>
              <div className="flex items-center gap-2">
                {!advance.isActive && (
                  <span className="rounded-full border border-wine/50 px-2 py-0.5 text-[10px] uppercase tracking-wider text-wine">
                    Inactivo
                  </span>
                )}
                <Link
                  href={`/admin/avances/${advance.id}`}
                  className="text-xs text-brass underline hover:brightness-110 focus-visible:ring-2 focus-visible:ring-brass"
                >
                  Editar avance
                </Link>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5 rounded-md border border-line bg-black/20 p-2.5">
              <FichaElemento
                id={advance.sourceElementId}
                elementById={elementById}
                onSelect={onSelect}
              />
              <span aria-hidden="true" className="text-sm text-brass-deep">+</span>
              <Link
                href={`/admin/avances/${advance.id}`}
                className="rounded-md border border-brass/40 bg-brass/10 px-2 py-1 text-xs text-parchment transition hover:border-brass hover:text-brass focus-visible:ring-2 focus-visible:ring-brass"
              >
                Avance «{advance.internalName}»
              </Link>
              <span aria-hidden="true" className="px-0.5 text-sm font-semibold text-brass">→</span>
              <FichaElemento
                id={advance.targetElementId}
                elementById={elementById}
                onSelect={onSelect}
              />
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <section className="rounded-md border border-line bg-black/15 p-2.5">
                <h5 className="text-[10px] uppercase tracking-[0.14em] text-fog">Crear la carta de avance</h5>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {advance.ingredientElementIds.map((id, index) => (
                    <Fragment key={`${advance.id}-ingredient-${id}-${index}`}>
                      {index > 0 && <span aria-hidden="true" className="text-sm text-brass-deep">+</span>}
                      <FichaElemento id={id} elementById={elementById} onSelect={onSelect} />
                    </Fragment>
                  ))}
                </div>
              </section>

              <section className="rounded-md border border-line bg-black/15 p-2.5">
                <h5 className="text-[10px] uppercase tracking-[0.14em] text-fog">Ritual requerido</h5>
                {activeRituals.length === 0 ? (
                  <p className="mt-2 text-xs text-fog">Este avance no exige un ritual activo.</p>
                ) : (
                  <div className="mt-2 space-y-2">
                    {activeRituals.length > 1 && (
                      <p className="text-[11px] text-fog">Basta preparar uno de estos rituales.</p>
                    )}
                    {activeRituals.map((ritual) => (
                      <div key={ritual.id} className="rounded-md border border-brass/25 bg-brass/5 p-2">
                        <Link
                          href={`/admin/rituales?editar=${ritual.id}`}
                          className="text-xs font-medium text-brass underline hover:brightness-110 focus-visible:ring-2 focus-visible:ring-brass"
                        >
                          {ritual.name}
                        </Link>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          {ritual.ingredientElementIds.map((id, index) => (
                            <Fragment key={`${ritual.id}-ingredient-${id}-${index}`}>
                              {index > 0 && <span aria-hidden="true" className="text-sm text-brass-deep">+</span>}
                              <FichaElemento id={id} elementById={elementById} onSelect={onSelect} />
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </article>
        )
      })}
    </div>
  )
}
