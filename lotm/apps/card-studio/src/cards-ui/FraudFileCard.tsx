import React, { forwardRef } from 'react'
import { useBackgroundDrop } from './useBackgroundDrop'
import { fontSizeCss } from './textStyle'
import type { FontSizeOverrides } from '../domain/schema'

type FraudFileCardProps = {
  name?: string
  allegation?: string
  evidence?: string
  counterpoint?: string
  verdict?: string
  sourceLabel?: string
  backgroundImage?: string | null
  backgroundOpacity?: number
  fontSizes?: FontSizeOverrides
  onDropBackground?: (file: File) => void
}

const FraudFileCard = forwardRef<HTMLElement, FraudFileCardProps>(function FraudFileCard(
  {
    name = '',
    allegation = '',
    evidence = '',
    counterpoint = '',
    verdict = '',
    sourceLabel = 'Reddit take',
    backgroundImage = null,
    backgroundOpacity = 65,
    fontSizes,
    onDropBackground,
  },
  ref,
) {
  const { dragging, dropProps } = useBackgroundDrop(onDropBackground)
  const dense = evidence.length + counterpoint.length > 560

  return (
    <article
      className={'fraud-file-card' + (dense ? ' dense' : '') + (dragging ? ' dragover' : '')}
      id="card"
      ref={ref}
      style={{ '--background-opacity': backgroundOpacity / 100 } as React.CSSProperties}
      aria-label={`Fraud file for ${name || 'unnamed subject'}`}
      {...dropProps}
    >
      {backgroundImage && (
        <div
          className="fraud-file-background"
          style={{ backgroundImage: `url("${backgroundImage}")` }}
          aria-hidden="true"
        />
      )}
      <div className="fraud-file-overlay" aria-hidden="true" />
      <div className="frame" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />

      <div className="fraud-file-content">
        <header className="fraud-file-masthead">
          <span className="fraud-file-kicker">Reddit receipts</span>
          <span className="fraud-file-type">Fraud file</span>
        </header>

        <div className="fraud-file-subject">
          <span className="fraud-file-label">Subject</span>
          <h2 style={fontSizeCss(fontSizes, 'title')}>{(name || 'Unnamed subject').toUpperCase()}</h2>
          <span className="fraud-file-seal" aria-hidden="true">LOTM</span>
        </div>

        <section className="fraud-file-charge">
          <span className="fraud-file-label">The charge</span>
          <p style={fontSizeCss(fontSizes, 'allegation')}>{allegation || 'Add the accusation in the editor panel.'}</p>
        </section>

        <div className="fraud-file-details">
          <section className="fraud-file-section">
            <span className="fraud-file-label">Receipts</span>
            <p style={fontSizeCss(fontSizes, 'body')}>{evidence || 'Add the evidence behind the take.'}</p>
          </section>

          <section className="fraud-file-counterpoint">
            <span className="fraud-file-label">Counterpoint</span>
            <p style={fontSizeCss(fontSizes, 'counterpoint')}>{counterpoint || 'Add the defense.'}</p>
          </section>
        </div>

        <footer className="fraud-file-footer">
          <span className="fraud-file-source">{sourceLabel || 'Reddit take'}</span>
          <strong style={fontSizeCss(fontSizes, 'verdict')}>{verdict || 'Add the verdict.'}</strong>
        </footer>
      </div>
    </article>
  )
})

export default FraudFileCard
