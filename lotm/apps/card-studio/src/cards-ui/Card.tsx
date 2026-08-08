/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef } from 'react'
import type { CardUiProps } from './types'
import { fontSizeCss } from './textStyle'

const Card = forwardRef<HTMLDivElement, CardUiProps>(function Card(
  { name, image, accent, sequences, pathLabel, dom, powerLabel, powerValue, fontSizes, onUploadImage, onDropImages }: CardUiProps,
  ref
) {
  const cardStyle = { '--tier': accent.c, '--tier-deep': accent.d }
  const dual = sequences.length > 1

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault()
    const files = [...e.dataTransfer.files].filter((f) => f.type.startsWith('image/'))
    if (!files.length) return
    // Multiple images -> one card per image; a single image fills this card.
    if (onDropImages) onDropImages(files)
    else onUploadImage(files[0])
  }

  return (
    <div className="card" id="card" ref={ref} style={cardStyle as React.CSSProperties}>
      <div className="frame" />
      <div className="scanlines" />
      <div className="content">
        <div className="name" style={fontSizeCss(fontSizes, 'name')}>{(name || ' ').toUpperCase()}</div>

        <div
          className={'imgwrap' + (image ? '' : ' empty')}
          style={image ? { backgroundImage: `url("${image}")` } : undefined}
          onDragOver={(e) => { e.preventDefault() }}
          onDragLeave={(e) => { e.preventDefault() }}
          onDrop={handleDrop}
        >
          {!image && (
            <span className="ph" style={fontSizeCss(fontSizes, 'placeholder')}>
              Drop or upload image — drop several to batch-create cards
            </span>
          )}
          <span className="scan" />
        </div>

        <div className={'seqhero' + (dual ? ' dual' : '')}>
          {sequences.map((s: any, i: number) => (
            <div className="seqitem" key={i}>
              <div className="num" style={{ color: s.tier.c, textShadow: `0 0 26px ${s.tier.d}`, ...fontSizeCss(fontSizes, 'sequenceNumber') }}>
                {s.seq}
              </div>
              <img className="seqicon" src={s.icon} alt={s.path} />
              <div className="seqname" style={fontSizeCss(fontSizes, 'sequenceName')}>{s.rank}</div>
            </div>
          ))}
        </div>

        <div className="stats">
          <div className="row"><span className="k" style={fontSizeCss(fontSizes, 'label')}>Pathway</span><span className="v" style={fontSizeCss(fontSizes, 'value')}>{pathLabel}</span></div>
          <div className="row"><span className="k" style={fontSizeCss(fontSizes, 'label')}>Alter Domain</span><span className="v" style={fontSizeCss(fontSizes, 'value')}>{dom}</span></div>
          <div className="row"><span className="k" style={fontSizeCss(fontSizes, 'label')}>{powerLabel}</span><span className="v" style={fontSizeCss(fontSizes, 'value')}>{powerValue}</span></div>
        </div>

        <div className="progress">
          <div className="ptrack">
            <span className="pfill" style={{ width: `${accent.pct}%`, background: accent.c }} />
          </div>
        </div>
      </div>
    </div>
  )
})

export default Card
