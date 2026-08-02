/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React from 'react'
import { PATHWAYS } from '../../../domain/pathways'
import { BackgroundField, PathwayCombo } from './primitives'

export default function RitualLogicFields({ state, set, accent, onUploadImage, onDownload }) {
  const pathway = state.ritualPathway in PATHWAYS ? state.ritualPathway : 'Fool'
  return (
    <div key="ritual-logic-fields">
      <div className="field"><label>Pathway</label><PathwayCombo value={pathway} onPick={(value) => set({ ritualPathway: value, ritualSequenceName: PATHWAYS[value][9 - state.ritualSequence] })} /></div>
      <div className="field"><label>Target sequence</label><select value={state.ritualSequence} onChange={(e) => { const sequence = Number(e.target.value); set({ ritualSequence: sequence, ritualSequenceName: PATHWAYS[pathway][9 - sequence] }) }}>{Array.from({ length: 10 }, (_, index) => 9 - index).map((sequence) => <option key={sequence} value={sequence}>Sequence {sequence} · {PATHWAYS[pathway][9 - sequence]}</option>)}</select></div>
      <div className="field"><label>Sequence name</label><input maxLength={80} value={state.ritualSequenceName ?? ''} onChange={(e) => set({ ritualSequenceName: e.target.value })} /></div>
      <div className="field"><label>Ritual</label><textarea rows={4} maxLength={360} value={state.ritualText ?? ''} onChange={(e) => set({ ritualText: e.target.value })} /></div>
      <div className="field"><label>Potion hazard</label><textarea rows={4} maxLength={360} value={state.ritualSurvival ?? ''} onChange={(e) => set({ ritualSurvival: e.target.value })} /></div>
      <div className="field"><label>Concept rehearsal</label><textarea rows={5} maxLength={420} value={state.ritualPreparation ?? ''} onChange={(e) => set({ ritualPreparation: e.target.value })} /></div>
      <div className="field"><label>Explanation certainty</label><div className="toggle">{['Canon', 'Mixed', 'Theory'].map((certainty) => <button key={certainty} className={'seg' + (state.ritualCertainty === certainty ? ' sel' : '')} onClick={() => set({ ritualCertainty: certainty })}>{certainty}</button>)}</div></div>
      <div className="field"><label>Evidence limit (optional)</label><textarea rows={3} maxLength={240} value={state.ritualUncertainty ?? ''} onChange={(e) => set({ ritualUncertainty: e.target.value })} /></div>
      <div className="field"><label>Footer (optional)</label><textarea rows={2} maxLength={180} value={state.ritualFooterText ?? ''} onChange={(e) => set({ ritualFooterText: e.target.value })} /></div>
      <BackgroundField value={state.ritualBackgroundImage} field="ritualBackgroundImage" opacity={state.backgroundOpacity} set={set} onUploadImage={onUploadImage} help={`Using the default ${pathway} background.`} />
      <div className="actions"><button className="btn-dl" style={{ background: accent.c }} onClick={onDownload}>Download PNG</button></div>
    </div>
  )
}
