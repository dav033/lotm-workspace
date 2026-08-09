/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React from 'react'
import { BackgroundField } from './primitives'

export default function CorruptionFileFields({ state, set, accent, onUploadImage, onDownload }) {
  return (
    <div key="corruption-file-fields">
      <div className="field"><label>Composition</label><div className="toggle">
        {['Warning', 'Evidence', 'Quote'].map((variant) => <button key={variant} className={'seg' + (state.corruptionVariant === variant ? ' sel' : '')} onClick={() => set({ corruptionVariant: variant })}>{variant}</button>)}
      </div></div>
      <div className="field"><label>Incident</label><input maxLength={90} value={state.corruptionIncident ?? ''} onChange={(e) => set({ corruptionIncident: e.target.value })} /></div>
      <div className="field"><label>Explanation label</label><input maxLength={40} value={state.corruptionCaseLabel ?? ''} onChange={(e) => set({ corruptionCaseLabel: e.target.value })} /></div>
      <div className="field"><label>Explanation</label><textarea rows={4} maxLength={320} value={state.corruptionExplanation ?? ''} onChange={(e) => set({ corruptionExplanation: e.target.value })} /></div>
      <div className="field"><label>Reaction label</label><input maxLength={40} value={state.corruptionReactionLabel ?? ''} onChange={(e) => set({ corruptionReactionLabel: e.target.value })} /></div>
      <div className="field"><label>Fandom reaction</label><textarea rows={4} maxLength={280} value={state.corruptionReaction ?? ''} onChange={(e) => set({ corruptionReaction: e.target.value })} /></div>
      <div className="field"><label>Corruption level</label><select value={state.corruptionLevel} onChange={(e) => set({ corruptionLevel: e.target.value })}>{['Low', 'Moderate', 'Severe', 'Catastrophic'].map((level) => <option key={level}>{level}</option>)}</select></div>
      <div className="field"><label><input type="checkbox" checked={Boolean(state.corruptionShowIncidentNumber)} onChange={(e) => set({ corruptionShowIncidentNumber: e.target.checked })} /> Show incident number</label></div>
      <div className="field"><label>Accent color</label><input type="color" value={state.corruptionAccentColor || '#d84a4a'} onChange={(e) => set({ corruptionAccentColor: e.target.value })} /></div>
      <BackgroundField value={state.corruptionImage} field="corruptionImage" opacity={state.backgroundOpacity} set={set} onUploadImage={onUploadImage} help="Upload background art for the incident." />
      <div className="actions"><button className="btn-dl" style={{ background: accent.c }} onClick={onDownload}>Download PNG</button></div>
    </div>
  )
}
