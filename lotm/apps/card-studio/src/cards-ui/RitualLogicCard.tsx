import React, { forwardRef } from 'react'
import { useBackgroundDrop } from './useBackgroundDrop'

const STEP_META = [['01', 'Ritual function'], ['02', 'Potion pressure'], ['03', 'Sequence rehearsal']] as const

type RitualLogicCardProps = {
  variant?: 'Chain' | 'Split' | 'Casefile' | 'Pressure' | 'Timeline'
  pathway?: string; sequence?: number; sequenceName?: string; ritual?: string; survival?: string
  preparation?: string; certainty?: 'Canon' | 'Mixed' | 'Theory'; uncertainty?: string
  footerText?: string; tier?: { c: string }; backgroundImage?: string | null
  backgroundOpacity?: number; onDropBackground?: (file: File) => void
}

const RitualLogicCard = forwardRef<HTMLElement, RitualLogicCardProps>(function RitualLogicCard({
  variant = 'Chain', pathway, sequence, sequenceName, ritual, survival, preparation, certainty = 'Mixed',
  uncertainty, footerText, tier, backgroundImage, backgroundOpacity = 65, onDropBackground,
}, ref) {
  const { dragging, dropProps } = useBackgroundDrop(onDropBackground)
  const mode = ['Chain', 'Split', 'Casefile', 'Pressure', 'Timeline'].includes(variant) ? variant : 'Chain'
  const steps = [ritual, survival, preparation]
  const contentLength = steps.join('').length + (uncertainty || '').length + (footerText || '').length
  const dense = contentLength > 620
  // Pressure keeps its frozen visual baseline; other short layouts can redistribute the spare height.
  const sparse = mode !== 'Pressure' && contentLength < 360
  return (
    <article className={`ficha ritual-logic-card certainty-${certainty.toLowerCase()}${dense ? ' dense' : ''}${sparse ? ' sparse' : ''}${dragging ? ' dragover' : ''}`} id="card" ref={ref}
      style={{ '--tier': tier?.c || '#d9b869', '--background-opacity': backgroundOpacity / 100 } as React.CSSProperties}
      aria-label={`${pathway} Sequence ${sequence} ${sequenceName} advancement ritual`} {...dropProps}>
      {backgroundImage && <><div className="tier-background" style={{ backgroundImage: `url("${backgroundImage}")` }} aria-hidden="true" /><div className="tier-background-overlay" aria-hidden="true" /></>}
      <div className="ritual-logic-ghost" aria-hidden="true">{sequence}</div>
      <div className="ritual-logic-content">
        <header className="ritual-logic-head"><span>Advancement ritual</span><span className="ritual-logic-sequence">Sequence {sequence}</span></header>
        <p className="ritual-logic-pathway">{pathway} pathway</p>
        <h2 className="ficha-name ritual-logic-title">{sequenceName}</h2>
        <div className="ritual-logic-rule" aria-hidden="true" />
        {mode === 'Chain' && <div className="ritual-logic-chain">{steps.map((text, index) => <section className="ritual-logic-step" key={STEP_META[index][1]}><div className="ritual-logic-node" aria-hidden="true">{STEP_META[index][0]}</div><div><span className="ritual-logic-label">{STEP_META[index][1]}</span><p>{text}</p></div></section>)}</div>}
        {mode === 'Split' && <div className="ritual-logic-split">
          <section className="ritual-logic-pane"><span className="ritual-logic-pane-number">01</span><span className="ritual-logic-label">Ritual function</span><h3>What the act does</h3><p>{ritual}</p></section>
          <section className="ritual-logic-pane"><span className="ritual-logic-pane-number">02</span><span className="ritual-logic-label">Sequence rehearsal</span><h3>What it trains</h3><p>{preparation}</p></section>
          <section className="ritual-logic-pressure"><span className="ritual-logic-label">Potion pressure</span><p>{survival}</p></section>
        </div>}
        {mode === 'Casefile' && <div className="ritual-logic-casefile">
          <div className="ritual-logic-casebar"><span>Field note</span><strong>{certainty}</strong></div>
          <section><span className="ritual-logic-label">Ritual function</span><p>{ritual}</p></section>
          <section><span className="ritual-logic-label">Potion pressure</span><p>{survival}</p></section>
          <section><span className="ritual-logic-label">Sequence rehearsal</span><p>{preparation}</p></section>
        </div>}
        {mode === 'Pressure' && <div className="ritual-logic-pressure-layout">
          <section className="ritual-logic-threat">
            <span className="ritual-logic-label">The part that can kill you</span>
            <p>{survival}</p>
          </section>
          <div className="ritual-logic-pressure-notes">
            <section><span className="ritual-logic-label">Ritual function</span><p>{ritual}</p></section>
            <section><span className="ritual-logic-label">Sequence rehearsal</span><p>{preparation}</p></section>
          </div>
        </div>}
        {mode === 'Timeline' && <div className="ritual-logic-timeline">
          <section aria-label="Ritual function"><span className="ritual-logic-time">BEFORE</span><h3>Set the scene</h3><p>{ritual}</p></section>
          <section aria-label="Potion pressure"><span className="ritual-logic-time">DURING</span><h3>Take the strain</h3><p>{survival}</p></section>
          <section aria-label="Sequence rehearsal"><span className="ritual-logic-time">AFTER</span><h3>Carry the idea</h3><p>{preparation}</p></section>
        </div>}
        <div className="ritual-logic-verdict"><span className="ritual-logic-certainty">{certainty}</span><p>{uncertainty || 'The causal reading is supported by the ritual and the resulting powers, but is not stated outright.'}</p></div>
        {footerText && <p className="ritual-logic-footer">{footerText}</p>}
      </div>
    </article>
  )
})

export default RitualLogicCard
