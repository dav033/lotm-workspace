/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-vars */
// @ts-nocheck
import React, { useRef } from 'react'
import { PATHWAYS, PATH_NAMES, TIER_RANKS, TIER_RANK_NAMES } from '../../../domain/pathways'
import { PATHWAY_BACKGROUNDS } from '../../../domain/pathwayBackgrounds'
import { BackgroundField, PathwayCombo, SeqSelect } from './primitives'

export default function TarotMemberFields({ state, set, accent, onUploadImage, onDownload, onGenerateTierBatch, defaultTierBackground, defaultPathwayCardBackground }) {
  return (
          <div key="tarot-member-fields">
            <div className="field">
              <label>Composition</label>
              <div className="toggle">
                {['Portrait', 'Dossier', 'Contrast'].map((variant) => (
                  <button
                    key={variant}
                    className={'seg' + (state.tarotMemberVariant === variant ? ' sel' : '')}
                    onClick={() => set({ tarotMemberVariant: variant })}
                  >{variant}</button>
                ))}
              </div>
              <p className="field-help">Each option changes hierarchy and layout, not only the colors.</p>
            </div>
  
            <div className="field">
              <label>Accent pathway (optional)</label>
              <div className="toggle">
                <button className={'seg' + (!state.tarotMemberPathway ? ' sel' : '')} onClick={() => set({ tarotMemberPathway: null })}>Neutral</button>
                <button className={'seg' + (state.tarotMemberPathway ? ' sel' : '')} onClick={() => set({ tarotMemberPathway: state.tarotMemberPathway || 'Fool' })}>Pathway</button>
              </div>
            </div>
            {state.tarotMemberPathway && (
              <div className="field">
                <label>Pathway</label>
                <PathwayCombo value={state.tarotMemberPathway} onPick={(pathway) => set({ tarotMemberPathway: pathway })} />
              </div>
            )}
            <div className="field">
              <label>Custom accent (optional)</label>
              <div className="toggle">
                <input
                  type="color"
                  value={state.tarotMemberAccentColor || '#d8b76b'}
                  onChange={(e) => set({ tarotMemberAccentColor: e.target.value })}
                />
                {state.tarotMemberAccentColor && (
                  <button className="seg" onClick={() => set({ tarotMemberAccentColor: null })}>Use pathway color</button>
                )}
              </div>
            </div>
  
            <div className="field"><label>Name or identity</label><input maxLength={80} value={state.tarotMemberName ?? ''} onChange={(e) => set({ tarotMemberName: e.target.value })} /></div>
            <div className="field"><label>Tarot title</label><input maxLength={40} value={state.tarotMemberTitle ?? ''} placeholder="The Hanged Man" onChange={(e) => set({ tarotMemberTitle: e.target.value })} /></div>
            <div className="field"><label>{state.tarotMemberVariant === 'Contrast' ? 'What the Club sees' : 'Description'}</label><textarea rows={4} maxLength={360} value={state.tarotMemberDescription ?? ''} onChange={(e) => set({ tarotMemberDescription: e.target.value })} /></div>
            <div className="field"><label>Second section label</label><input maxLength={36} value={state.tarotMemberDetailLabel ?? ''} placeholder="What is actually happening" onChange={(e) => set({ tarotMemberDetailLabel: e.target.value })} /></div>
            <div className="field"><label>Second section</label><textarea rows={4} maxLength={280} value={state.tarotMemberDetailText ?? ''} onChange={(e) => set({ tarotMemberDetailText: e.target.value })} /></div>
            <div className="field"><label>Footer punchline (optional)</label><textarea rows={2} maxLength={180} value={state.tarotMemberFooterText ?? ''} onChange={(e) => set({ tarotMemberFooterText: e.target.value })} /></div>
  
            <BackgroundField
              value={state.tarotMemberImage}
              field="tarotMemberImage"
              opacity={state.backgroundOpacity}
              set={set}
              onUploadImage={onUploadImage}
              help={state.tarotMemberPathway ? `Using the default ${state.tarotMemberPathway} art. Upload a portrait to override it.` : 'Upload a portrait or atmospheric background.'}
            />
            <div className="actions"><button className="btn-dl" style={{ background: accent.c }} onClick={onDownload}>Download PNG</button></div>
          </div>
  )
}
