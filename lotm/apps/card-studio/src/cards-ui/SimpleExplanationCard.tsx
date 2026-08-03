import React, { forwardRef } from 'react'
import type { CardUiProps } from './types'

export function simpleExplanationFontSize(text: string): number {
  const length = text.trim().length
  return Number(Math.max(16, Math.min(42, 42 - Math.max(0, length - 80) * 0.029)).toFixed(1))
}

const SimpleExplanationCard = forwardRef<HTMLElement, CardUiProps>(function SimpleExplanationCard(
  { text },
  ref,
) {
  const displayText = text || 'Add the explanation in the editor panel.'
  const fontSize = simpleExplanationFontSize(displayText)

  return (
    <article
      className="explanation-card simple-explanation-card"
      id="card"
      ref={ref}
      style={{ '--simple-explanation-size': `${fontSize}px` } as React.CSSProperties}
      aria-label="Simple explanation"
    >
      <div className="frame" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />
      <div className="simple-explanation-content">
        <p className="simple-explanation-text">{displayText}</p>
      </div>
    </article>
  )
})

export default SimpleExplanationCard
