'use client'

import { ShieldAlert } from 'lucide-react'
import { ModalOculto } from './ModalOculto'

export function ModalRiesgoRitual({
  onCancel,
  onConfirmar,
  cargando,
}: {
  onCancel: () => void
  onConfirmar: () => void
  cargando: boolean
}) {
  return (
    <ModalOculto
      titulo="Ascension without protection"
      descripcionId="riesgo-ritual-descripcion"
      onCerrar={onCancel}
    >
      <ShieldAlert className="mx-auto h-12 w-12 text-wine" aria-hidden />
      <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl text-parchment">
        Ascension without protection
      </h2>
      <p id="riesgo-ritual-descripcion" className="mt-4 text-sm leading-relaxed text-fog">
        You have not completed a ritual preparation for this ascension. Attempting it anyway
        may produce irreversible consequences.
      </p>
      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          autoFocus
          disabled={cargando}
          onClick={onCancel}
          className="rounded-md border border-line2 px-5 py-2.5 text-sm text-parchment transition hover:border-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass active:scale-[0.97] disabled:opacity-40 disabled:active:scale-100"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={cargando}
          onClick={onConfirmar}
          className="rounded-md border border-wine bg-wine/20 px-5 py-2.5 text-sm text-parchment transition hover:bg-wine/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine active:scale-[0.97] disabled:opacity-40 disabled:active:scale-100"
        >
          {cargando ? 'Consulting…' : 'Attempt without protection'}
        </button>
      </div>
    </ModalOculto>
  )
}
