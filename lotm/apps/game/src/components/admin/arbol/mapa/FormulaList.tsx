'use client'
import { Fragment } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import type { VistaFases } from '@/shared/adminTree'
import { FichaElemento } from './FichaElemento'

export function FormulaList({
  title,
  recipes,
  elementById,
  onSelect,
  onToggle,
  onDelete,
  onEdit,
  onAdd,
  addLabel,
  saving,
  advanceCount = 0,
}: {
  title: string
  recipes: VistaFases['recipes']
  elementById: Map<string, VistaFases['elements'][number]>
  onSelect: (id: string) => void
  onToggle: (recipeId: string) => void
  onDelete: (recipeId: string) => void
  onEdit: (recipeId: string) => void
  onAdd: () => void
  addLabel: string
  saving: boolean
  advanceCount?: number
}) {
  return (
    <section className="mt-6 first:mt-0">
      <div className="flex items-center justify-between gap-3 border-b border-line pb-1.5">
        <h4 className="text-xs uppercase tracking-[0.16em] text-brass">{title}</h4>
        <div className="flex items-center gap-2">
          <span className="text-[11px] tabular-nums text-fog">
            {recipes.length} {recipes.length === 1 ? 'receta' : 'recetas'}
            {advanceCount > 0 && <> · {advanceCount} {advanceCount === 1 ? 'avance' : 'avances'}</>}
          </span>
          <button
            type="button"
            aria-label={addLabel}
            disabled={saving}
            onClick={onAdd}
            className="flex items-center gap-1 rounded-md border border-brass/40 bg-brass/5 px-2 py-1 text-[11px] text-brass transition hover:border-brass hover:bg-brass/10 focus-visible:ring-2 focus-visible:ring-brass disabled:opacity-50"
          >
            <Plus aria-hidden="true" className="h-3 w-3" />
            Añadir
          </button>
        </div>
      </div>
      {recipes.length === 0 && advanceCount === 0 && (
        <p className="mt-2 text-xs text-fog">Sin recetas directas.</p>
      )}
      {recipes.length > 0 && (
        <ul className="mt-3 space-y-2">
          {recipes.map((recipe) => (
            <li
              key={recipe.id}
              className={`flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border px-3 py-2.5 ${
                recipe.isActive ? 'border-line bg-black/15' : 'border-wine/45 bg-wine/10'
              }`}
            >
              <div
                className={`flex min-w-0 flex-1 flex-wrap items-center gap-1.5 ${
                  recipe.isActive ? '' : 'opacity-60'
                }`}
              >
                {recipe.ingredientElementIds.map((id, index) => (
                  <Fragment key={`${recipe.id}-in-${id}-${index}`}>
                    {index > 0 && <span className="text-sm text-brass-deep">+</span>}
                    <FichaElemento id={id} elementById={elementById} onSelect={onSelect} />
                  </Fragment>
                ))}
                <span className="px-0.5 text-sm font-semibold text-brass">→</span>
                {recipe.outputElementIds.map((id, index) => (
                  <Fragment key={`${recipe.id}-out-${id}-${index}`}>
                    {index > 0 && <span className="text-sm text-brass-deep">+</span>}
                    <FichaElemento id={id} elementById={elementById} onSelect={onSelect} />
                  </Fragment>
                ))}
              </div>
              {!recipe.isActive && (
                <span className="shrink-0 rounded-full border border-wine/50 px-2 py-0.5 text-[10px] uppercase tracking-wider text-wine">
                  Bloqueada
                </span>
              )}
              <button
                type="button"
                disabled={saving}
                onClick={() => onEdit(recipe.id)}
                className="flex shrink-0 items-center gap-1 rounded-md border border-line2 px-2.5 py-1 text-[11px] text-fog transition hover:border-brass hover:text-parchment focus-visible:ring-2 focus-visible:ring-brass disabled:opacity-50"
              >
                <Pencil aria-hidden="true" className="h-3 w-3" />
                Editar
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => onToggle(recipe.id)}
                className={`shrink-0 rounded-md border px-2.5 py-1 text-[11px] transition disabled:opacity-50 ${
                  recipe.isActive
                    ? 'border-line2 text-fog hover:border-wine/60 hover:text-parchment'
                    : 'border-brass/40 text-brass hover:border-brass'
                }`}
              >
                {recipe.isActive ? 'Bloquear' : 'Desbloquear'}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => onDelete(recipe.id)}
                className="flex shrink-0 items-center gap-1 rounded-md border border-wine/50 px-2.5 py-1 text-[11px] text-wine transition hover:border-wine hover:bg-wine/10 hover:text-parchment focus-visible:ring-2 focus-visible:ring-wine disabled:opacity-50"
              >
                <Trash2 aria-hidden="true" className="h-3 w-3" />
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
