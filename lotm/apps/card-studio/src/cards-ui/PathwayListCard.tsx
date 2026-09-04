import React, { forwardRef } from 'react'
import { useBackgroundDrop } from './useBackgroundDrop'
import type { CardUiProps } from './types'
import { fontSizeCss } from './textStyle'

function renderTitle(title: string) {
  return title.split(/\*(.+?)\*/g).map((part, index) => (
    index % 2 === 1
      ? <span className="pathway-list-highlight" key={index}>{part}</span>
      : part
  ))
}

function cleanItem(item: string) {
  return String(item).replace(/^\s*\d+\s*[.)]\s*/, '').trim()
}

const PathwayListCard = forwardRef<HTMLElement, CardUiProps>(function PathwayListCard(
  { pathway, index, total, title, items, fontSizes, backgroundImage = null, backgroundOpacity = 65, tier = null, onDropBackground }: CardUiProps,
  ref,
) {
  const { dragging, dropProps } = useBackgroundDrop(onDropBackground)
  const shownItems = Array.isArray(items) ? items.map(cleanItem).filter(Boolean) : []
  const shownTitle = title || 'Things you will find here.'

  return (
    <article
      className={'ficha pathway-list-card' + (dragging ? ' dragover' : '')}
      id="card"
      ref={ref}
      style={{
        ...(tier ? { '--tier': tier.c, '--tier-deep': tier.d } : {}),
        '--background-opacity': backgroundOpacity / 100,
      } as React.CSSProperties}
      aria-label={`${pathway} pathway item list`}
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
      <div className="pathway-list-content">
        <header className="pathway-list-head">
          <span className="pathway-list-chip" style={fontSizeCss(fontSizes, 'meta')}>{pathway}</span>
          <span className="pathway-list-counter" style={fontSizeCss(fontSizes, 'meta')}>{index} / {total} PATHWAYS</span>
        </header>
        <h2 className="pathway-list-title" style={fontSizeCss(fontSizes, 'title')}>
          {renderTitle(shownTitle)}
        </h2>
        <div className="pathway-list-rule" aria-hidden="true" />
        <ul className="pathway-list-items" aria-label="Pathway observations">
          {shownItems.map((item, itemIndex) => (
            <li key={`${itemIndex}-${item}`} style={fontSizeCss(fontSizes, 'body')}>
              <span className="pathway-list-index" aria-hidden="true">{String(itemIndex + 1).padStart(2, '0')}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
})

export default PathwayListCard
