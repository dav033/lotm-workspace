import React, { forwardRef } from 'react'
import { parseMapEntries } from '../domain/mapEntries'
import { titleSizeClass } from '../domain/titleFit'
import { useBackgroundDrop } from './useBackgroundDrop'
import { fontSizeCss, textStyleCss } from './textStyle'
import type { CardUiProps } from './types'

const MapCard = forwardRef<HTMLElement, CardUiProps>(function MapCard(
  { title, entriesText, textStyles, fontSizes, pathway = null, tier = null, backgroundImage = null, backgroundOpacity = 65, onDropBackground }: CardUiProps,
  ref,
) {
  const { dragging, dropProps } = useBackgroundDrop(onDropBackground)
  const entries = parseMapEntries(entriesText || '')
  const dense = entries.length > 3 || entries.some((entry) => entry.value.length > 44)
  const extraDense = entries.length > 5
  // Sin pathway la ficha se queda con el dorado que trae .ficha por defecto.
  const cardStyle = {
    ...(tier ? { '--tier': tier.c, '--tier-deep': tier.d } : {}),
    '--background-opacity': backgroundOpacity / 100,
  }

  return (
    <article
      className={
        'ficha map-card'
        + (dense ? ' dense' : '')
        + (extraDense ? ' extra-dense' : '')
        + (dragging ? ' dragover' : '')
      }
      id="card"
      ref={ref}
      style={cardStyle as React.CSSProperties}
      aria-label={`${title || 'Map'} card`}
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
      <div className="map-content">
        {pathway && <span className="map-chip" style={{ ...textStyleCss(textStyles?.label), ...fontSizeCss(fontSizes, 'label') }}>{pathway}</span>}
        <h2
          className={`ficha-name map-title ${titleSizeClass(title || 'Map title')}`}
          style={{ ...textStyleCss(textStyles?.title), ...fontSizeCss(fontSizes, 'title') }}
        >
          {title || 'Map title'}
        </h2>
        {entries.length ? (
          <div className="map-entries">
            {entries.map((entry, index) => (
              <div className="map-entry" key={index}>
                {entry.tags && <span className="map-entry-tags" style={{ ...textStyleCss(textStyles?.label), ...fontSizeCss(fontSizes, 'label') }}>{entry.tags}</span>}
                <p className="map-entry-value" style={{ ...textStyleCss(textStyles?.value), ...fontSizeCss(fontSizes, 'value') }}>{entry.value}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="map-empty" style={fontSizeCss(fontSizes, 'value')}>Add one row per line as &quot;tags -&gt; value&quot; in the editor panel.</p>
        )}
      </div>
    </article>
  )
})

export default MapCard
