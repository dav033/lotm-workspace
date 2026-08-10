import React, { forwardRef } from 'react'
import { parseTierText } from '../domain/tierText'
import type { CardUiProps } from './types'
import { fontSizeCss } from './textStyle'

const TierlistCard = forwardRef<HTMLElement, CardUiProps>(function TierlistCard(
  { title, rank, tier, text, footerText, fontSizes, backgroundImage = null, backgroundOpacity = 65 }: CardUiProps,
  ref,
) {
  const points = parseTierText(text)
  const estimatedLines = points.reduce((total, point) => total + Math.max(1, Math.ceil(point.length / 44)), 0)
  const pointDensity = estimatedLines <= 5 ? ' sparse' : estimatedLines >= 11 ? ' dense' : ''
  const cardStyle = {
    '--tier': tier.c,
    '--tier-deep': tier.d,
    '--background-opacity': backgroundOpacity / 100,
  }

  return (
    <article
      className="tier-card tierlist-card"
      id="card"
      ref={ref}
      style={cardStyle as React.CSSProperties}
      aria-label={`${title}, tier ${rank}`}
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
          <div className="tier-identity tierlist-identity">
            <span className="tier-pathlabel" style={fontSizeCss(fontSizes, 'pathwayLabel')}>Tierlist</span>
            <p className="tier-path tierlist-title" style={fontSizeCss(fontSizes, 'pathway')}>{title}</p>
          </div>
          <p className="tier-rankwrap">
            <span className="tier-ranklabel" style={fontSizeCss(fontSizes, 'rankLabel')}>Tier</span>
            <strong className="tier-rank" style={fontSizeCss(fontSizes, 'rank')}>{rank}</strong>
          </p>
        </header>

        <div className="tier-body">
          <section className={'tier-text' + (points.length ? '' : ' empty') + pointDensity} aria-label="Explanation">
            <p className="tier-text-label" style={fontSizeCss(fontSizes, 'sectionLabel')}>Explanation</p>
            {points.length ? (
              <ul className="tier-points">
                {points.map((point, index) => <li key={index} style={fontSizeCss(fontSizes, 'points')}>{point}</li>)}
              </ul>
            ) : (
              <p className="tier-empty" style={fontSizeCss(fontSizes, 'empty')}>Add one explanation point per line in the panel.</p>
            )}
          </section>
          {footerText && <p className="tier-footer" style={fontSizeCss(fontSizes, 'footer')}>{footerText}</p>}
        </div>

        <div className="progress tier-progress" aria-hidden="true">
          <div className="ptrack"><span className="pfill" style={{ width: '100%', background: tier.c }} /></div>
        </div>
      </div>
    </article>
  )
})

export default TierlistCard
