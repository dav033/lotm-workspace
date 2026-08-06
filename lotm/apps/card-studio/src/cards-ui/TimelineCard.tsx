import React, { forwardRef } from 'react'
import { titleSizeClass } from '../domain/titleFit'
import { useBackgroundDrop } from './useBackgroundDrop'

// Alto util de la espina: la carta mide 640 y el contenido reserva 26 arriba y
// 22 abajo. Si cambia el padding de .timeline-content, cambia esta constante.
const SPINE_HEIGHT = 592
const VARIANTS = ['Open', 'Beat', 'Turn', 'Arc'] as const
const ROMAN = ['I', 'II', 'III', 'IV'] as const

type TimelineVariant = (typeof VARIANTS)[number]

type TimelineCardProps = {
  variant?: TimelineVariant
  pathway?: string
  era?: string
  kicker?: string
  title?: string
  text?: string
  step?: number
  total?: number
  certainty?: 'Canon' | 'Mixed' | 'Secondary' | 'Reconstruction'
  note?: string
  moves?: string[]
  footerText?: string
  ghost?: string
  icon?: string
  tier?: { c: string; d: string }
  backgroundImage?: string | null
  backgroundOpacity?: number
  onDropBackground?: (file: File) => void
}

const pad = (value: number) => String(value).padStart(2, '0')

const TimelineCard = forwardRef<HTMLElement, TimelineCardProps>(function TimelineCard({
  variant = 'Beat', pathway, era, kicker, title, text, step = 1, total = 11,
  certainty = 'Canon', note, moves = [], footerText, ghost, icon, tier,
  backgroundImage, backgroundOpacity = 25, onDropBackground,
}, ref) {
  const { dragging, dropProps } = useBackgroundDrop(onDropBackground)
  const mode: TimelineVariant = VARIANTS.includes(variant) ? variant : 'Beat'
  // El total acota el paso: una carta con step 7 de un video de 5 dibujaria el
  // nodo activo fuera de la espina.
  const steps = Math.max(1, Math.min(24, Math.round(total)))
  const current = Math.max(1, Math.min(steps, Math.round(step)))
  const cell = SPINE_HEIGHT / steps
  const withSpine = mode === 'Beat' || mode === 'Turn'
  const size = titleSizeClass(title || 'Timeline milestone')
  const classes = ['ficha', 'timeline-card', mode.toLowerCase(), 'certainty-' + certainty.toLowerCase()]
  if (dragging) classes.push('dragover')

  return (
    <article
      className={classes.join(' ')}
      id="card"
      ref={ref}
      style={{
        '--tier': tier?.c || '#9d8fc2',
        '--tier-deep': tier?.d || '#332b52',
        '--background-opacity': backgroundOpacity / 100,
        '--timeline-cell': String(cell),
        '--timeline-node': String(cell * (current - 0.5)),
      } as React.CSSProperties}
      aria-label={(pathway || 'Timeline') + ' timeline, step ' + current + ' of ' + steps}
      {...dropProps}
    >
      {backgroundImage && mode !== 'Arc' && (
        <>
          <div className="timeline-background" style={{ backgroundImage: 'url("' + backgroundImage + '")' }} aria-hidden="true" />
          <div className="timeline-veil" aria-hidden="true" />
        </>
      )}
      {ghost && mode === 'Turn' && <span className="timeline-ghost" aria-hidden="true">{ghost}</span>}
      {withSpine && (
        <div className="timeline-spine" aria-hidden="true">
          <div className="timeline-spine-rail" />
          <div className="timeline-spine-done" />
          <div className="timeline-spine-dots" />
          <div className="timeline-spine-node" />
        </div>
      )}
      <div className="timeline-content">
        <header className="timeline-head">
          <span>{pathway ? pathway + ' pathway' : 'Timeline'}</span>
          <span className="timeline-step">
            {mode === 'Open' ? 'Timeline' : mode === 'Arc' ? 'Summary' : pad(current) + ' / ' + pad(steps)}
          </span>
        </header>

        {mode === 'Open' && (
          <>
            <div className="timeline-hero">
              {icon && <div className="timeline-medallion"><img src={icon} alt="" /></div>}
              {kicker && <span className="timeline-kicker">{kicker}</span>}
              <h2 className={'timeline-title ' + size}>{title}</h2>
              <div className="timeline-rule" aria-hidden="true" />
              {text && <p className="timeline-text">{text}</p>}
            </div>
            {footerText && <span className="timeline-foot">{footerText}</span>}
          </>
        )}

        {withSpine && (
          <>
            {mode === 'Turn' && <div className="timeline-spacer" />}
            {era && <span className="timeline-era">{era}</span>}
            <h2 className={'timeline-title ' + size}>{title}</h2>
            <div className="timeline-rule" aria-hidden="true" />
            {text && <p className="timeline-text">{text}</p>}
            {mode === 'Beat' && <div className="timeline-spacer" />}
            <div className="timeline-source">
              <span className="timeline-certainty">{certainty}</span>
              {note && <p className="timeline-note">{note}</p>}
            </div>
          </>
        )}

        {mode === 'Arc' && (
          <>
            <h2 className={'timeline-title ' + size}>{title}</h2>
            <div className="timeline-rule" aria-hidden="true" />
            <div className="timeline-moves">
              {moves.slice(0, 4).map((move, index) => (
                <section className="timeline-move" key={move}>
                  <span className="timeline-move-node" aria-hidden="true">{ROMAN[index]}</span>
                  <p>{move}</p>
                </section>
              ))}
            </div>
            <div className="timeline-spacer" />
            {footerText && <p className="timeline-footer">{footerText}</p>}
          </>
        )}
      </div>
    </article>
  )
})

export default TimelineCard
