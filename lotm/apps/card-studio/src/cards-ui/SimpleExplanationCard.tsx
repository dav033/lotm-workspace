import React, { forwardRef } from 'react'
import type { CardUiProps } from './types'

export type SimpleExplanationPosition = 'top' | 'center' | 'bottom'

const DEFAULT_MIN_FONT_SIZE = 14
const DEFAULT_MAX_FONT_SIZE = 28

function safePosition(value: unknown): SimpleExplanationPosition {
  return value === 'top' || value === 'bottom' ? value : 'center'
}

export function simpleExplanationFontSize(
  text: string,
  minFontSize = DEFAULT_MIN_FONT_SIZE,
  maxFontSize = DEFAULT_MAX_FONT_SIZE,
): number {
  const length = text.trim().length
  const min = Math.max(12, Math.min(36, Math.min(minFontSize, maxFontSize)))
  const max = Math.max(16, Math.min(48, Math.max(min, maxFontSize)))
  const density = Math.min(1, Math.max(0, (length - 40) / 960))
  return Number((max - (max - min) * density).toFixed(1))
}

const SimpleExplanationCard = forwardRef<HTMLElement, CardUiProps>(function SimpleExplanationCard(
  { text, fontSizeMin, fontSizeMax, position },
  ref,
) {
  const displayText = text || 'Add the explanation in the editor panel.'
  const fontSize = simpleExplanationFontSize(displayText, fontSizeMin, fontSizeMax)
  const placement = safePosition(position)

  return (
    <article
      className={`explanation-card simple-explanation-card simple-explanation-${placement}`}
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
