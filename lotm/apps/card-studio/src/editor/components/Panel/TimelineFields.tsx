/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React from 'react'
import { PATHWAYS } from '../../../domain/pathways'
import { BackgroundField, PathwayCombo } from './primitives'

const VARIANTS = ['Open', 'Beat', 'Turn', 'Arc']
const CERTAINTIES = ['Canon', 'Mixed', 'Secondary', 'Reconstruction']

export default function TimelineFields({ state, set, accent, onUploadImage, onDownload }) {
  const pathway = state.timelinePathway && state.timelinePathway in PATHWAYS ? state.timelinePathway : null
  const variant = state.timelineVariant || 'Beat'
  return (
    <div key="timeline-fields">
      <div className="field"><label>Composition</label><div className="toggle">{VARIANTS.map((option) => <button type="button" key={option} className={'seg' + (variant === option ? ' sel' : '')} onClick={() => set({ timelineVariant: option })}>{option}</button>)}</div></div>
      <div className="field"><label>Pathway (optional)</label><PathwayCombo value={pathway ?? ''} onPick={(value) => set({ timelinePathway: value })} />{pathway && <div className="actions"><button className="btn-img" onClick={() => set({ timelinePathway: null })}>Clear pathway</button></div>}</div>
      <div className="field"><label>Step</label><div className="row"><input type="number" min={1} max={24} value={state.timelineStep ?? 1} onChange={(e) => set({ timelineStep: Number(e.target.value) })} /><input type="number" min={1} max={24} value={state.timelineTotal ?? 11} onChange={(e) => set({ timelineTotal: Number(e.target.value) })} /></div><p className="field-help">Paso y total de hitos. Gobiernan la espina; en Open y Arc no se dibuja.</p></div>
      {variant === 'Open' ? <div className="field"><label>Kicker</label><input maxLength={60} value={state.timelineKicker ?? ''} onChange={(e) => set({ timelineKicker: e.target.value })} /></div> : null}
      {variant !== 'Open' && variant !== 'Arc' ? <div className="field"><label>Era</label><input maxLength={40} value={state.timelineEra ?? ''} onChange={(e) => set({ timelineEra: e.target.value })} /><p className="field-help">Epoca, anio o rango de capitulos. No lo repitas en el texto.</p></div> : null}
      <div className="field"><label>Title</label><input maxLength={60} value={state.timelineTitle ?? ''} onChange={(e) => set({ timelineTitle: e.target.value })} /></div>
      {variant !== 'Arc' ? <div className="field"><label>Consequence</label><textarea rows={3} maxLength={180} value={state.timelineText ?? ''} onChange={(e) => set({ timelineText: e.target.value })} /><p className="field-help">Una sola consecuencia, hasta 22 palabras.</p></div> : null}
      {variant === 'Arc' ? <div className="field"><label>Movements</label><textarea rows={6} maxLength={600} value={state.timelineMovesText ?? ''} onChange={(e) => set({ timelineMovesText: e.target.value })} /><p className="field-help">Uno por linea, maximo cuatro.</p></div> : null}
      {variant === 'Turn' ? <div className="field"><label>Ghost numeral (optional)</label><input maxLength={4} value={state.timelineGhost ?? ''} onChange={(e) => set({ timelineGhost: e.target.value })} /></div> : null}
      {variant !== 'Open' && variant !== 'Arc' ? <div className="field"><label>Source</label><div className="toggle">{CERTAINTIES.map((option) => <button type="button" key={option} className={'seg' + ((state.timelineCertainty || 'Canon') === option ? ' sel' : '')} onClick={() => set({ timelineCertainty: option })}>{option}</button>)}</div></div> : null}
      {variant !== 'Open' && variant !== 'Arc' ? <div className="field"><label>Evidence limit (optional)</label><textarea rows={2} maxLength={160} value={state.timelineNote ?? ''} onChange={(e) => set({ timelineNote: e.target.value })} /></div> : null}
      {variant === 'Open' || variant === 'Arc' ? <div className="field"><label>Footer (optional)</label><textarea rows={2} maxLength={180} value={state.timelineFooterText ?? ''} onChange={(e) => set({ timelineFooterText: e.target.value })} /></div> : null}
      {variant !== 'Arc' ? <BackgroundField value={state.timelineBackgroundImage} field="timelineBackgroundImage" opacity={state.backgroundOpacity} set={set} onUploadImage={onUploadImage} help={pathway ? 'Using the default ' + pathway + ' background.' : 'No pathway selected: the card stays flat.'} /> : null}
      <div className="actions"><button className="btn-dl" style={{ background: accent.c }} onClick={onDownload}>Download PNG</button></div>
    </div>
  )
}
