import React, { forwardRef } from 'react'
import { useBackgroundDrop } from './useBackgroundDrop'
import type { FontSizeOverrides } from '../domain/schema'
import { fontSizeCss } from './textStyle'

const STEP_META = [['01', 'Ritual function'], ['02', 'Potion pressure'], ['03', 'Sequence rehearsal']] as const

type RitualLogicCardProps = {
  variant?: 'Chain' | 'Split' | 'Casefile' | 'Pressure' | 'Timeline'
  pathway?: string; sequence?: number; sequenceName?: string; ritual?: string; survival?: string
  preparation?: string; certainty?: 'Canon' | 'Mixed' | 'Theory'; uncertainty?: string
  footerText?: string; tier?: { c: string }; backgroundImage?: string | null
  fontSizes?: FontSizeOverrides
  backgroundOpacity?: number; onDropBackground?: (file: File) => void
}

const RitualLogicCard = forwardRef<HTMLElement, RitualLogicCardProps>(function RitualLogicCard({
  variant = 'Chain', pathway, sequence, sequenceName, ritual, survival, preparation, certainty = 'Mixed',
  uncertainty, tier, fontSizes, backgroundImage, backgroundOpacity = 65, onDropBackground,
}, ref) {
  const { dragging, dropProps } = useBackgroundDrop(onDropBackground)
  const mode = ['Chain', 'Split', 'Casefile', 'Pressure', 'Timeline'].includes(variant) ? variant : 'Chain'
  const steps = [ritual, survival, preparation]
  const contentLength = steps.join('').length + (uncertainty || '').length
  const dense = contentLength > 620
  // The content layouts can use the full card height now that Ritual Logic has no footer.
  const sparse = mode !== 'Pressure' && contentLength < 360
  return (
    <article className={`ficha ritual-logic-card certainty-${certainty.toLowerCase()}${dense ? ' dense' : ''}${sparse ? ' sparse' : ''}${dragging ? ' dragover' : ''}`} id="card" ref={ref}
      style={{ '--tier': tier?.c || '#d9b869', '--background-opacity': backgroundOpacity / 100 } as React.CSSProperties}
      aria-label={`${pathway} Sequence ${sequence} ${sequenceName} advancement ritual`} {...dropProps}>
      {backgroundImage && <><div className="ritual-logic-background" style={{ backgroundImage: `url("${backgroundImage}")` }} aria-hidden="true" /><div className="ritual-logic-background-overlay" aria-hidden="true" /></>}
      <div className="ritual-logic-ghost" aria-hidden="true">{sequence}</div>
      <div className="ritual-logic-content">
        <header className="ritual-logic-head" style={fontSizeCss(fontSizes, 'meta')}><span>Advancement ritual</span><span className="ritual-logic-sequence">Sequence {sequence}</span></header>
        <p className="ritual-logic-pathway" style={fontSizeCss(fontSizes, 'pathway')}>{pathway} pathway</p>
        <h2 className="ficha-name ritual-logic-title" style={fontSizeCss(fontSizes, 'title')}>{sequenceName}</h2>
        <div className="ritual-logic-rule" aria-hidden="true" />
        {mode === 'Chain' && <div className="ritual-logic-chain">{steps.map((text, index) => <section className="ritual-logic-step" key={STEP_META[index][1]}><div className="ritual-logic-node" aria-hidden="true" style={fontSizeCss(fontSizes, 'meta')}>{STEP_META[index][0]}</div><div><span className="ritual-logic-label" style={fontSizeCss(fontSizes, 'label')}>{STEP_META[index][1]}</span><p style={fontSizeCss(fontSizes, 'body')}>{text}</p></div></section>)}</div>}
        {mode === 'Split' && <div className="ritual-logic-split">
          <section className="ritual-logic-pane"><span className="ritual-logic-pane-number" style={fontSizeCss(fontSizes, 'meta')}>01</span><span className="ritual-logic-label" style={fontSizeCss(fontSizes, 'label')}>Ritual function</span><h3 style={fontSizeCss(fontSizes, 'heading')}>What the act does</h3><p style={fontSizeCss(fontSizes, 'body')}>{ritual}</p></section>
          <section className="ritual-logic-pane"><span className="ritual-logic-pane-number" style={fontSizeCss(fontSizes, 'meta')}>02</span><span className="ritual-logic-label" style={fontSizeCss(fontSizes, 'label')}>Sequence rehearsal</span><h3 style={fontSizeCss(fontSizes, 'heading')}>What it trains</h3><p style={fontSizeCss(fontSizes, 'body')}>{preparation}</p></section>
          <section className="ritual-logic-pressure"><span className="ritual-logic-label" style={fontSizeCss(fontSizes, 'label')}>Potion pressure</span><p style={fontSizeCss(fontSizes, 'body')}>{survival}</p></section>
        </div>}
        {mode === 'Casefile' && <div className="ritual-logic-casefile">
          <div className="ritual-logic-casebar" style={fontSizeCss(fontSizes, 'meta')}><span>Field note</span><strong>{certainty}</strong></div>
          <section><span className="ritual-logic-label" style={fontSizeCss(fontSizes, 'label')}>Ritual function</span><p style={fontSizeCss(fontSizes, 'body')}>{ritual}</p></section>
          <section><span className="ritual-logic-label" style={fontSizeCss(fontSizes, 'label')}>Potion pressure</span><p style={fontSizeCss(fontSizes, 'body')}>{survival}</p></section>
          <section><span className="ritual-logic-label" style={fontSizeCss(fontSizes, 'label')}>Sequence rehearsal</span><p style={fontSizeCss(fontSizes, 'body')}>{preparation}</p></section>
        </div>}
        {mode === 'Pressure' && <div className="ritual-logic-pressure-layout">
          <section className="ritual-logic-threat">
            <span className="ritual-logic-label" style={fontSizeCss(fontSizes, 'label')}>The part that can kill you</span>
            <p style={fontSizeCss(fontSizes, 'body')}>{survival}</p>
          </section>
          <div className="ritual-logic-pressure-notes">
            <section><span className="ritual-logic-label" style={fontSizeCss(fontSizes, 'label')}>Ritual function</span><p style={fontSizeCss(fontSizes, 'body')}>{ritual}</p></section>
            <section><span className="ritual-logic-label" style={fontSizeCss(fontSizes, 'label')}>Sequence rehearsal</span><p style={fontSizeCss(fontSizes, 'body')}>{preparation}</p></section>
          </div>
        </div>}
        {mode === 'Timeline' && <div className="ritual-logic-timeline">
          <section aria-label="Ritual function"><span className="ritual-logic-time" style={fontSizeCss(fontSizes, 'meta')}>BEFORE</span><h3 style={fontSizeCss(fontSizes, 'heading')}>Set the scene</h3><p style={fontSizeCss(fontSizes, 'body')}>{ritual}</p></section>
          <section aria-label="Potion pressure"><span className="ritual-logic-time" style={fontSizeCss(fontSizes, 'meta')}>DURING</span><h3 style={fontSizeCss(fontSizes, 'heading')}>Take the strain</h3><p style={fontSizeCss(fontSizes, 'body')}>{survival}</p></section>
          <section aria-label="Sequence rehearsal"><span className="ritual-logic-time" style={fontSizeCss(fontSizes, 'meta')}>AFTER</span><h3 style={fontSizeCss(fontSizes, 'heading')}>Carry the idea</h3><p style={fontSizeCss(fontSizes, 'body')}>{preparation}</p></section>
        </div>}
        <div className="ritual-logic-verdict"><span className="ritual-logic-certainty" style={fontSizeCss(fontSizes, 'meta')}>{certainty}</span><p style={fontSizeCss(fontSizes, 'note')}>{uncertainty || 'The causal reading is supported by the ritual and the resulting powers, but is not stated outright.'}</p></div>
      </div>
    </article>
  )
})

export default RitualLogicCard
