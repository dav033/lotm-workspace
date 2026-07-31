'use client'

import { IconoElemento } from './IconoElemento'
import { ModalOculto } from './ModalOculto'

// Se muestra una sola vez, al obtener el primer avance: es la única mecánica
// que rompe las reglas aprendidas hasta entonces (los avances sí se consumen).
export function ModalTutorialAvance({ onCerrar }: { onCerrar: () => void }) {
  return (
    <ModalOculto titulo="You have obtained your first advance" onCerrar={onCerrar}>
      <span className="text-xs uppercase tracking-[0.25em] text-spectral">
        Your first advance
      </span>
      <div className="anim-glow mx-auto my-5 flex h-24 w-24 items-center justify-center rounded-full border border-brass-deep">
        <IconoElemento iconKey="wand-sparkles" className="h-12 w-12 text-brass" />
      </div>
      <div className="space-y-3 text-left text-sm text-fog">
        <p>
          Advances are different from everything else:{' '}
          <span className="text-parchment">they are consumed when used</span>, while
          concepts are never spent.
        </p>
        <p>
          To use it, combine it with the correct sequence element. You will recognize
          sequences in your archive by their badge{' '}
          <span className="rounded-full border border-brass-deep px-2 py-0.5 text-[10px] text-brass">
            Sequence N · Pathway
          </span>
          ; the advance icon points to its origin pathway.
        </p>
        <p>
          Some advances require having{' '}
          <span className="text-parchment">prepared a ritual beforehand</span>. Failing without it
          has consequences.
        </p>
      </div>
      <button autoFocus type="button" onClick={onCerrar} className="btn-brass mt-7">
        Understood
      </button>
    </ModalOculto>
  )
}
