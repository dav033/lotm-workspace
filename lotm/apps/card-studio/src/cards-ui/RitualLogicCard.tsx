import React, { forwardRef } from 'react'
import { useBackgroundDrop } from './useBackgroundDrop'

const STEP_META = [['01', 'Ritual'], ['02', 'Potion hazard'], ['03', 'Concept rehearsal']] as const

type RitualLogicCardProps = {
  variant?: 'Chain' | 'Split' | 'Casefile'
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
  const mode = ['Chain', 'Split', 'Casefile'].includes(variant) ? variant : 'Chain'
  const steps = [ritual, survival, preparation]
  const dense = steps.join('').length > 620
  return (
    <article className={`ficha ritual-logic-card certainty-${certainty.toLowerCase()}${dense ? ' dense' : ''}${dragging ? ' dragover' : ''}`} id="card" ref={ref}
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
          <section className="ritual-logic-pane"><span className="ritual-logic-pane-number">01</span><span className="ritual-logic-label">Setup</span><h3>What must happen</h3><p>{ritual}</p></section>
          <section className="ritual-logic-pane"><span className="ritual-logic-pane-number">02</span><span className="ritual-logic-label">Rehearsal</span><h3>What it trains</h3><p>{preparation}</p></section>
          <section className="ritual-logic-pressure"><span className="ritual-logic-label">Pressure to survive</span><p>{survival}</p></section>
        </div>}
        {mode === 'Casefile' && <div className="ritual-logic-casefile">
          <div className="ritual-logic-casebar"><span>Field note</span><strong>{certainty}</strong></div>
          <section><span className="ritual-logic-label">Observed requirement</span><p>{ritual}</p></section>
          <section><span className="ritual-logic-label">Advancement pressure</span><p>{survival}</p></section>
          <section><span className="ritual-logic-label">Conceptual reading</span><p>{preparation}</p></section>
        </div>}
        <div className="ritual-logic-verdict"><span className="ritual-logic-certainty">{certainty}</span><p>{uncertainty || 'The causal reading is supported by the ritual and the resulting powers, but is not stated outright.'}</p></div>
        {footerText && <p className="ritual-logic-footer">{footerText}</p>}
      </div>
    </article>
  )
})

export default RitualLogicCard
