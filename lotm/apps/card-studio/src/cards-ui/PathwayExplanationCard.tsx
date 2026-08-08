import React, { forwardRef } from 'react'
import { titleSizeClass } from '../domain/titleFit'
import { useBackgroundDrop } from './useBackgroundDrop'
import type { CardUiProps } from './types'
import { fontSizeCss } from './textStyle'

// El texto entre *asteriscos* se resalta en el color del tier; el resto queda
// en blanco. Solo una palabra o frase clave lleva color.
function renderHighlightedTitle(title: string) {
  return title.split(/\*(.+?)\*/g).map((part, index) => (
    index % 2 === 1
      ? <span className="pathway-explanation-highlight" key={index}>{part}</span>
      : part
  ))
}

const PathwayExplanationCard = forwardRef<HTMLElement, CardUiProps>(function PathwayExplanationCard(
  { pathway, index, total, title, description, fontSizes, backgroundImage = null, backgroundOpacity = 65, tier = null, onDropBackground }: CardUiProps,
  ref,
) {
  const { dragging, dropProps } = useBackgroundDrop(onDropBackground)
  const shown = title || 'A title with a *highlighted* word.'
  // La talla se mide sobre el texto ya sin asteriscos: son marcas, no letras.
  const size = titleSizeClass(shown.replace(/\*/g, ''))

  return (
    <article
      className={'ficha pathway-explanation-card' + (dragging ? ' dragover' : '')}
      id="card"
      ref={ref}
      style={{
        ...(tier ? { '--tier': tier.c, '--tier-deep': tier.d } : {}),
        '--background-opacity': backgroundOpacity / 100,
      } as React.CSSProperties}
      aria-label={`${pathway} pathway explanation`}
      {...dropProps}
    >
      {backgroundImage && (
        <>
          <div
            className="tier-background"
            style={{ backgroundImage: `url("${backgroundImage}")` }}
            aria-hidden="true"
          />
          <div className="tier-background-overlay" aria-hidden="true" />
        </>
      )}
      <div className="pathway-explanation-content">
        <header className="pathway-explanation-head">
          <span className="pathway-explanation-chip" style={fontSizeCss(fontSizes, 'meta')}>{pathway}</span>
          <span className="pathway-explanation-counter" style={fontSizeCss(fontSizes, 'meta')}>{index} / {total} PATHWAYS</span>
        </header>
        <h2 className={`ficha-name pathway-explanation-title ${size}`} style={fontSizeCss(fontSizes, 'title')}>
          {renderHighlightedTitle(shown)}
        </h2>
        <p className="pathway-explanation-description" style={fontSizeCss(fontSizes, 'body')}>
          {description || 'Add the explanation in the editor panel.'}
        </p>
        <div className="pathway-explanation-rule" aria-hidden="true" />
      </div>
    </article>
  )
})

export default PathwayExplanationCard
