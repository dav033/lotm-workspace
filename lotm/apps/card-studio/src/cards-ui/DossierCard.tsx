import React, { forwardRef } from 'react'
import { useBackgroundDrop } from './useBackgroundDrop'
import { fontSizeCss } from './textStyle'
import type { FontSizeOverrides } from '../domain/schema'

type DossierCardProps = {
  name?: string
  headline?: string
  evidence?: string
  counterpoint?: string
  takeaway?: string
  sourceLabel?: string
  backgroundImage?: string | null
  backgroundOpacity?: number
  fontSizes?: FontSizeOverrides
  onDropBackground?: (file: File) => void
}

const DossierCard = forwardRef<HTMLElement, DossierCardProps>(function DossierCard(
  {
    name = '',
    headline = '',
    evidence = '',
    counterpoint = '',
    takeaway = '',
    sourceLabel = 'Source note',
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
      className={'dossier-card' + (dense ? ' dense' : '') + (dragging ? ' dragover' : '')}
      id="card"
      ref={ref}
      style={{ '--background-opacity': backgroundOpacity / 100 } as React.CSSProperties}
      aria-label={`Dossier for ${name || 'unnamed subject'}`}
      {...dropProps}
    >
      {backgroundImage && (
        <div
          className="dossier-background"
          style={{ backgroundImage: `url("${backgroundImage}")` }}
          aria-hidden="true"
        />
      )}
      <div className="dossier-overlay" aria-hidden="true" />
      <div className="frame" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />

      <div className="dossier-content">
        <header className="dossier-masthead">
          <span className="dossier-kicker">Context dossier</span>
          <span className="dossier-type">Dossier</span>
        </header>

        <div className="dossier-subject">
          <span className="dossier-label">Subject</span>
          <h2 style={fontSizeCss(fontSizes, 'title')}>{(name || 'Unnamed subject').toUpperCase()}</h2>
          <span className="dossier-seal" aria-hidden="true">LOTM</span>
        </div>

        <section className="dossier-headline">
          <span className="dossier-label">The point</span>
          <p style={fontSizeCss(fontSizes, 'headline')}>{headline || 'Add the central idea in the editor panel.'}</p>
        </section>

        <div className="dossier-details">
          <section className="dossier-section">
            <span className="dossier-label">Evidence / context</span>
            <p style={fontSizeCss(fontSizes, 'body')}>{evidence || 'Add the context behind the idea.'}</p>
          </section>

          <section className="dossier-counterpoint">
            <span className="dossier-label">Counterpoint</span>
            <p style={fontSizeCss(fontSizes, 'counterpoint')}>{counterpoint || 'Add the strongest alternate reading.'}</p>
          </section>
        </div>

        <footer className="dossier-footer">
          <span className="dossier-source">{sourceLabel || 'Source note'}</span>
          <strong style={fontSizeCss(fontSizes, 'takeaway')}>{takeaway || 'Add the bottom line.'}</strong>
        </footer>
      </div>
    </article>
  )
})

export default DossierCard
