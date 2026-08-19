import React, { forwardRef, type ReactNode } from 'react'
import { useBackgroundDrop } from './useBackgroundDrop'
import { fontSizeCss } from './textStyle'
import type { DossierVariant, FontSizeOverrides } from '../domain/schema'

type DossierCardProps = {
  variant?: DossierVariant
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

const AUTO_VARIANTS: Exclude<DossierVariant, 'Auto'>[] = ['Impact', 'Verdict', 'Contrast', 'Evidence', 'Comment']

function autoVariant(name: string): Exclude<DossierVariant, 'Auto'> {
  let hash = 0
  for (const character of name || 'subject') hash = (hash * 31 + character.charCodeAt(0)) | 0
  return AUTO_VARIANTS[Math.abs(hash) % AUTO_VARIANTS.length]
}

function resolveVariant(variant: DossierVariant | undefined, name: string) {
  return !variant || variant === 'Auto' ? autoVariant(name) : variant
}

function DossierMeta({ children }: { children: ReactNode }) {
  return <span className="dossier-meta">{children}</span>
}

const DossierCard = forwardRef<HTMLElement, DossierCardProps>(function DossierCard(
  {
    variant = 'Auto',
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
  const resolvedVariant = resolveVariant(variant, name)
  const displayName = name || 'Unnamed subject'
  const displayHeadline = headline || 'Add the central idea in the editor panel.'
  const displayEvidence = evidence || 'Add the context behind the idea.'
  const displayCounterpoint = counterpoint || 'Add the strongest alternate reading.'
  const displayTakeaway = takeaway || 'Add the bottom line.'
  const displaySource = sourceLabel || 'Source note'
  const clampedBackgroundOpacity = Math.min(100, Math.max(0, Number.isFinite(backgroundOpacity) ? backgroundOpacity : 65))
  const normalizedBackgroundOpacity = clampedBackgroundOpacity / 100
  // Keep image visibility and the readability veil on one continuous scale.
  // A fixed near-black veil made every value below 88% look almost identical.
  const dossierStyle = {
    '--background-opacity': normalizedBackgroundOpacity,
    '--dossier-veil-top': 0.62 - normalizedBackgroundOpacity * 0.38,
    '--dossier-veil-mid': 0.78 - normalizedBackgroundOpacity * 0.38,
    '--dossier-veil-bottom': 0.9 - normalizedBackgroundOpacity * 0.32,
  } as React.CSSProperties
  const backgroundVisibilityClass = normalizedBackgroundOpacity >= 0.9 ? ' dossier-background-boosted' : ''

  function renderVariant() {
    switch (resolvedVariant) {
      case 'Impact':
        return (
          <div className="dossier-content dossier-content-impact">
            <div className="dossier-impact-mark"><DossierMeta>LOTM / FIELD NOTE</DossierMeta><span>01</span></div>
            <section className="dossier-impact-hero">
              <DossierMeta>THE HOOK</DossierMeta>
              <h2 style={fontSizeCss(fontSizes, 'title')}>{displayName.toUpperCase()}</h2>
              <p className="dossier-impact-headline" style={fontSizeCss(fontSizes, 'headline')}>{displayHeadline}</p>
            </section>
            <section className="dossier-impact-context">
              <DossierMeta>WHY IT STICKS</DossierMeta>
              <p style={fontSizeCss(fontSizes, 'body')}>{displayEvidence}</p>
            </section>
            <footer className="dossier-impact-footer">
              <span>{displaySource}</span>
              <p style={fontSizeCss(fontSizes, 'counterpoint')}>{displayCounterpoint}</p>
              <strong style={fontSizeCss(fontSizes, 'takeaway')}>{displayTakeaway}</strong>
            </footer>
          </div>
        )
      case 'Verdict':
        return (
          <div className="dossier-content dossier-content-verdict">
            <header className="dossier-verdict-top"><DossierMeta>CASE CLOSED?</DossierMeta><span>{displaySource}</span></header>
            <p className="dossier-verdict-name">{displayName}</p>
            <section className="dossier-verdict-stamp">
              <DossierMeta>THE VERDICT</DossierMeta>
              <strong style={fontSizeCss(fontSizes, 'takeaway')}>{displayTakeaway}</strong>
            </section>
            <section className="dossier-verdict-reading">
              <p style={fontSizeCss(fontSizes, 'headline')}>{displayHeadline}</p>
              <p className="dossier-verdict-evidence" style={fontSizeCss(fontSizes, 'body')}>{displayEvidence}</p>
            </section>
            <footer className="dossier-verdict-foot">
              <DossierMeta>FAIR COUNTER-READ</DossierMeta>
              <p style={fontSizeCss(fontSizes, 'counterpoint')}>{displayCounterpoint}</p>
            </footer>
          </div>
        )
      case 'Contrast':
        return (
          <div className="dossier-content dossier-content-contrast">
            <header className="dossier-contrast-head">
              <h2 style={fontSizeCss(fontSizes, 'title')}>{displayName.toUpperCase()}</h2>
              <DossierMeta>{displaySource}</DossierMeta>
            </header>
            <p className="dossier-contrast-hook" style={fontSizeCss(fontSizes, 'headline')}>{displayHeadline}</p>
            <div className="dossier-contrast-grid">
              <section className="dossier-contrast-case">
                <DossierMeta>THE CASE FOR IT</DossierMeta>
                <p style={fontSizeCss(fontSizes, 'body')}>{displayEvidence}</p>
              </section>
              <section className="dossier-contrast-other">
                <DossierMeta>THE OTHER READ</DossierMeta>
                <p style={fontSizeCss(fontSizes, 'counterpoint')}>{displayCounterpoint}</p>
              </section>
            </div>
            <footer className="dossier-contrast-footer"><span>SO WHAT?</span><strong style={fontSizeCss(fontSizes, 'takeaway')}>{displayTakeaway}</strong></footer>
          </div>
        )
      case 'Evidence':
        return (
          <div className="dossier-content dossier-content-evidence">
            <header className="dossier-evidence-head"><DossierMeta>RECEIPT / {displaySource}</DossierMeta><span>◆</span></header>
            <p className="dossier-evidence-name">{displayName}</p>
            <blockquote style={fontSizeCss(fontSizes, 'body')}>{displayEvidence}</blockquote>
            <section className="dossier-evidence-meaning">
              <DossierMeta>READING</DossierMeta>
              <p style={fontSizeCss(fontSizes, 'headline')}>{displayHeadline}</p>
            </section>
            <div className="dossier-evidence-bottom">
              <p style={fontSizeCss(fontSizes, 'counterpoint')}>{displayCounterpoint}</p>
              <strong style={fontSizeCss(fontSizes, 'takeaway')}>{displayTakeaway}</strong>
            </div>
          </div>
        )
      case 'Comment':
        return (
          <div className="dossier-content dossier-content-comment">
            <header className="dossier-comment-head"><span className="dossier-comment-dot" aria-hidden="true" /><DossierMeta>{displaySource}</DossierMeta></header>
            <p className="dossier-comment-name">{displayName}</p>
            <section className="dossier-comment-question">
              <DossierMeta>STILL THINKING ABOUT THIS</DossierMeta>
              <h2 style={fontSizeCss(fontSizes, 'headline')}>{displayHeadline}</h2>
            </section>
            <div className="dossier-comment-notes">
              <p style={fontSizeCss(fontSizes, 'body')}>{displayEvidence}</p>
              <p style={fontSizeCss(fontSizes, 'counterpoint')}>{displayCounterpoint}</p>
            </div>
            <footer className="dossier-comment-footer"><span>YOUR TAKE?</span><strong style={fontSizeCss(fontSizes, 'takeaway')}>{displayTakeaway}</strong></footer>
          </div>
        )
      case 'Longform':
        return (
          <div className="dossier-content dossier-content-longform">
            <header className="dossier-longform-kicker">
              <DossierMeta>FIELD ARCHIVE / LONGFORM</DossierMeta>
              <span>{displaySource}</span>
            </header>
            <section className="dossier-longform-heading">
              <div>
                <DossierMeta>SUBJECT / CASE FILE</DossierMeta>
                <h2 style={fontSizeCss(fontSizes, 'title')}>{displayName}</h2>
              </div>
              <p style={fontSizeCss(fontSizes, 'headline')}>{displayHeadline}</p>
            </section>
            <div className="dossier-longform-body">
              <section className="dossier-longform-evidence">
                <DossierMeta>EVIDENCE / WHAT HAPPENED</DossierMeta>
                <p style={fontSizeCss(fontSizes, 'body')}>{displayEvidence}</p>
              </section>
              <aside className="dossier-longform-side">
                <section className="dossier-longform-counterpoint">
                  <DossierMeta>COUNTER-READ</DossierMeta>
                  <p style={fontSizeCss(fontSizes, 'counterpoint')}>{displayCounterpoint}</p>
                </section>
                <section className="dossier-longform-takeaway">
                  <DossierMeta>THE LINE THAT SURVIVES</DossierMeta>
                  <strong style={fontSizeCss(fontSizes, 'takeaway')}>{displayTakeaway}</strong>
                </section>
              </aside>
            </div>
            <footer className="dossier-longform-footer">
              <span>LOTM / GREATEST FEATS</span>
              <span>READ THE RECEIPTS</span>
            </footer>
          </div>
        )
    }
  }

  return (
    <article
      className={`dossier-card dossier-${resolvedVariant.toLowerCase()}${backgroundVisibilityClass}${dragging ? ' dragover' : ''}`}
      data-variant={resolvedVariant}
      id="card"
      ref={ref}
      style={dossierStyle}
      aria-label={`${resolvedVariant} dossier for ${displayName}`}
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
      <div className="dossier-frame" aria-hidden="true" />
      <div className="dossier-grain" aria-hidden="true" />
      {renderVariant()}
    </article>
  )
})

export default DossierCard
