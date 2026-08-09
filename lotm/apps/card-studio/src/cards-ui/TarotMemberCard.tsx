import React, { forwardRef } from 'react'
import { titleSizeClass } from '../domain/titleFit'
import { useBackgroundDrop } from './useBackgroundDrop'
import type { CardUiProps } from './types'
import { fontSizeCss } from './textStyle'

const TarotMemberCard = forwardRef<HTMLElement, CardUiProps>(function TarotMemberCard(
  {
    variant = 'Portrait', name, tarotTitle, description, detailLabel, detailText,
    fontSizes, image = null, backgroundOpacity = 65, tier = null, onDropBackground,
  }: CardUiProps,
  ref,
) {
  const { dragging, dropProps } = useBackgroundDrop(onDropBackground)
  const mode = ['Portrait', 'Dossier', 'Contrast'].includes(variant) ? variant : 'Portrait'
  const style = {
    ...(tier ? { '--tier': tier.c, '--tier-deep': tier.d } : {}),
    '--background-opacity': backgroundOpacity / 100,
  }

  return (
    <article
      className={`ficha tarot-member-card tarot-member-${mode.toLowerCase()}${dragging ? ' dragover' : ''}`}
      id="card"
      ref={ref}
      style={style as React.CSSProperties}
      aria-label={`${name || 'Tarot member'} profile`}
      {...dropProps}
    >
      {image && <div className="tarot-member-image" style={{ backgroundImage: `url("${image}")` }} aria-hidden="true" />}
      <div className="tarot-member-veil" aria-hidden="true" />
      <div className="tarot-member-arcana" aria-hidden="true">{tarotTitle || 'Unknown'}</div>

      <div className="tarot-member-content">
        <header className="tarot-member-head">
          <span className="tarot-member-chip" style={fontSizeCss(fontSizes, 'meta')}>Tarot Club</span>
          <span className="tarot-member-mode" style={fontSizeCss(fontSizes, 'meta')}>{mode}</span>
        </header>

        {mode === 'Dossier' && <span className="tarot-member-stamp" style={fontSizeCss(fontSizes, 'meta')}>Restricted</span>}

        <div className="tarot-member-title-block">
          <p className="tarot-member-tarot" style={fontSizeCss(fontSizes, 'tarotTitle')}>{tarotTitle || 'Tarot title'}</p>
          <h2 className={`ficha-name tarot-member-name ${titleSizeClass(name || 'Member name')}`} style={fontSizeCss(fontSizes, 'name')}>{name || 'Member name'}</h2>
        </div>

        {mode === 'Contrast' ? (
          <div className="tarot-member-contrast-grid">
            <section>
              <span className="tarot-member-label" style={fontSizeCss(fontSizes, 'label')}>What the Club sees</span>
              <p style={fontSizeCss(fontSizes, 'body')}>{description || 'The public impression.'}</p>
            </section>
            <section>
              <span className="tarot-member-label" style={fontSizeCss(fontSizes, 'label')}>{detailLabel || 'What is actually happening'}</span>
              <p style={fontSizeCss(fontSizes, 'detail')}>{detailText || 'The truth behind the performance.'}</p>
            </section>
          </div>
        ) : (
          <div className="tarot-member-copy">
            <p className="tarot-member-description" style={fontSizeCss(fontSizes, 'body')}>{description || 'A concise, accurate character description.'}</p>
            {detailText && (
              <div className="tarot-member-detail">
                <span className="tarot-member-label" style={fontSizeCss(fontSizes, 'label')}>{detailLabel || 'Club function'}</span>
                <p style={fontSizeCss(fontSizes, 'detail')}>{detailText}</p>
              </div>
            )}
          </div>
        )}

      </div>
    </article>
  )
})

export default TarotMemberCard
