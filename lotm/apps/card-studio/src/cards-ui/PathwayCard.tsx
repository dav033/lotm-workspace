import React, { forwardRef } from 'react'
import { parseTierText } from '../domain/tierText'
import type { CardUiProps } from './types'
import { fontSizeCss } from './textStyle'

// Same layout as TierCard, minus the tier-rank signaling: no "Tier" label, no
// rank letter. Accent color comes from PATHWAY_COLORS instead of TIER_RANKS.
const PathwayCard = forwardRef<HTMLElement, CardUiProps>(function PathwayCard(
  { path, icon, sequence, sequenceName, text, footerText = '', fontSizes, backgroundImage = null, backgroundOpacity = 65, tier }: CardUiProps,
  ref,
) {
  const points = parseTierText(text)
  const estimatedLines = points.reduce((total, point) => total + Math.max(1, Math.ceil(point.length / 44)), 0)
  const pointDensity = estimatedLines <= 5 ? ' sparse' : estimatedLines >= 11 ? ' dense' : ''
  const footerDensity = footerText.length <= 70 ? ' sparse' : footerText.length > 160 ? ' dense' : ''
  const cardStyle = {
    '--tier': tier.c,
    '--tier-deep': tier.d,
    '--background-opacity': backgroundOpacity / 100,
  }

  return (
    <article
      className="pathway-card"
      id="card"
      ref={ref}
      style={cardStyle as React.CSSProperties}
      aria-label={`${path}${sequence === null ? ' pathway' : ` sequence ${sequence} ${sequenceName}`}`}
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
      <div className="frame" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />
      <div className="content tier-content">
        <header className="tier-summary">
          <div className="tier-iconwrap">
            <img
              className="tier-icon"
              src={icon}
              alt={`${path} pathway icon`}
              width="58"
              height="58"
            />
          </div>
          <div className="tier-identity">
            <span className="tier-pathlabel" style={fontSizeCss(fontSizes, 'pathwayLabel')}>Pathway</span>
            <p className="tier-path" style={fontSizeCss(fontSizes, 'pathway')}>{path}</p>
            {sequence !== null && (
              <p className="tier-sequence" style={fontSizeCss(fontSizes, 'sequence')}>Seq {sequence} · {sequenceName}</p>
            )}
          </div>
        </header>

        <div className="tier-body">
          <section
            className={'tier-text' + (points.length ? '' : ' empty') + pointDensity}
            aria-label="Explanation"
          >
            {points.length ? (
              <ul className="tier-points">
                {points.map((point, index) => <li key={index} style={fontSizeCss(fontSizes, 'points')}>{point}</li>)}
              </ul>
            ) : (
              <p className="tier-empty" style={fontSizeCss(fontSizes, 'empty')}>Add one explanation point per line in the panel.</p>
            )}
          </section>

          {footerText && (
            <p className={'tier-footer-text' + footerDensity} style={fontSizeCss(fontSizes, 'footer')}>{footerText}</p>
          )}
        </div>

        <div className="progress tier-progress" aria-hidden="true">
          <div className="ptrack">
            <span className="pfill" style={{ width: '100%', background: tier.c }} />
          </div>
        </div>
      </div>
    </article>
  )
})

export default PathwayCard
