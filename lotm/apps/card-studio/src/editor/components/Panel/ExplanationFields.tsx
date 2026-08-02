/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-vars */
// @ts-nocheck
import React, { useRef } from 'react'
import { PATHWAYS, PATH_NAMES, TIER_RANKS, TIER_RANK_NAMES } from '../../../domain/pathways'
import { PATHWAY_BACKGROUNDS } from '../../../domain/pathwayBackgrounds'
import { BackgroundField, PathwayCombo, SeqSelect } from './primitives'

export default function ExplanationFields({ state, set, accent, onUploadImage, onDownload, onGenerateTierBatch, defaultTierBackground, defaultPathwayCardBackground }) {
  const isGeneralExplanation = state.type === 'General Explanation'
  const isTierExplanation = state.type === 'Tier Explanation'
  return (
          <div key="explanation-fields">
            {isGeneralExplanation && (
              <>
                <div className="field">
                  <label>Explanation scope</label>
                  <div className="toggle">
                    <button
                      className={'seg' + (!state.explanationPath ? ' sel' : '')}
                      onClick={() => set({ explanationPath: null })}
                    >
                      All pathways
                    </button>
                    <button
                      className={'seg' + (state.explanationPath ? ' sel' : '')}
                      onClick={() => set({ explanationPath: state.explanationPath || 'Fool' })}
                    >
                      Specific pathway
                    </button>
                  </div>
                </div>
  
                {state.explanationPath && (
                  <div className="field">
                    <label>Pathway (search all 22)</label>
                    <PathwayCombo
                      value={PATHWAYS[state.explanationPath] ? state.explanationPath : 'Fool'}
                      onPick={(n) => set({ explanationPath: n })}
                    />
                  </div>
                )}
  
                {/* Siempre, no solo con pathway: sin pathway no hay fondo por
                    defecto, pero una imagen propia se puede poner igual. */}
                <BackgroundField
                  value={state.generalExplanationBackgroundImage}
                  field="generalExplanationBackgroundImage"
                  opacity={state.backgroundOpacity}
                  set={set}
                  onUploadImage={onUploadImage}
                  help={state.explanationPath
                    ? `Using the default ${state.explanationPath} background. Upload one to override it.`
                    : 'No background image selected.'}
                />
              </>
            )}
  
            {isTierExplanation ? (
              <>
                <BackgroundField
                  value={state.tierExplanationBackgroundImage}
                  field="tierExplanationBackgroundImage"
                  opacity={state.backgroundOpacity}
                  set={set}
                  onUploadImage={onUploadImage}
                  help="No background image selected."
                />
  
                <div className="field">
                  <label>Tier</label>
                  <div className="toggle tier-toggle">
                    {TIER_RANK_NAMES.map((r) => (
                      <button
                        key={r}
                        className={'seg' + (state.tierRank === r ? ' sel' : '')}
                        style={state.tierRank === r
                          ? { background: TIER_RANKS[r].c, borderColor: TIER_RANKS[r].c, color: '#0a0a11' }
                          : { color: TIER_RANKS[r].c }}
                        onClick={() => set({ tierRank: r })}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="tier-short-explanation">Short description</label>
                  <textarea
                    id="tier-short-explanation"
                    rows={5}
                    maxLength={240}
                    value={state.tierExplanationText ?? ''}
                    placeholder="A defining tier with exceptional versatility…"
                    autoComplete="off"
                    onChange={(e) => set({ tierExplanationText: e.target.value })}
                  />
                  <p className="field-help">{(state.tierExplanationText ?? '').length}/240 characters</p>
                </div>
              </>
            ) : (
              <>
                <div className="field">
                  <label htmlFor="general-explanation-title">Title</label>
                  <input
                    id="general-explanation-title"
                    maxLength={100}
                    value={state.generalExplanationTitle ?? ''}
                    placeholder="Understanding the pathways…"
                    autoComplete="off"
                    onChange={(e) => set({ generalExplanationTitle: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label htmlFor="general-explanation-text">Description</label>
                  <textarea
                    id="general-explanation-text"
                    rows={10}
                    maxLength={800}
                    value={state.generalExplanationText ?? ''}
                    placeholder="Write the general explanation shown on the card…"
                    autoComplete="off"
                    onChange={(e) => set({ generalExplanationText: e.target.value })}
                  />
                  <p className="field-help">{(state.generalExplanationText ?? '').length}/800 characters</p>
                </div>
              </>
            )}
  
            <div className="actions">
              <button className="btn-dl" style={{ background: accent.c }} onClick={onDownload}>Download PNG</button>
            </div>
          </div>
  )
}
