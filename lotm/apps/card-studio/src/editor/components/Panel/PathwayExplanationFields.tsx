/* eslint-disable @typescript-eslint/ban-ts-comment, react/no-unescaped-entities, @typescript-eslint/no-unused-vars */
// @ts-nocheck
import React, { useRef } from 'react'
import { PATHWAYS, PATH_NAMES, TIER_RANKS, TIER_RANK_NAMES } from '../../../domain/pathways'
import { PATHWAY_BACKGROUNDS } from '../../../domain/pathwayBackgrounds'
import { BackgroundField, PathwayCombo, SeqSelect } from './primitives'

export default function PathwayExplanationFields({ state, set, accent, onUploadImage, onDownload, onGenerateTierBatch, defaultTierBackground, defaultPathwayCardBackground }) {
  return (
          <div key="pathway-explanation-fields">
            <div className="field">
              <label>Pathway (search all 22)</label>
              <PathwayCombo
                value={PATHWAYS[state.pathwayExplanationPath] ? state.pathwayExplanationPath : 'Fool'}
                onPick={(n) => set({ pathwayExplanationPath: n })}
              />
            </div>
  
            <div className="field">
              <label htmlFor="pathway-explanation-title">Title</label>
              <input
                id="pathway-explanation-title"
                maxLength={100}
                value={state.pathwayExplanationTitle ?? ''}
                placeholder="Door isn't a *teleport* pathway."
                autoComplete="off"
                onChange={(e) => set({ pathwayExplanationTitle: e.target.value })}
              />
              <p className="field-help">Wrap a word or phrase in *asterisks* to highlight it in the tier color.</p>
            </div>
  
            <div className="field">
              <label htmlFor="pathway-explanation-text">Description</label>
              <textarea
                id="pathway-explanation-text"
                rows={5}
                maxLength={240}
                value={state.pathwayExplanationText ?? ''}
                placeholder="It's access and exclusion."
                autoComplete="off"
                onChange={(e) => set({ pathwayExplanationText: e.target.value })}
              />
              <p className="field-help">{(state.pathwayExplanationText ?? '').length}/240 characters</p>
            </div>
  
            <BackgroundField
              value={state.pathwayExplanationBackgroundImage}
              field="pathwayExplanationBackgroundImage"
              opacity={state.backgroundOpacity}
              set={set}
              onUploadImage={onUploadImage}
              help={`Using the default ${state.pathwayExplanationPath || 'pathway'} background. Upload one to override it.`}
            />
  
            <div className="actions">
              <button className="btn-dl" style={{ background: accent.c }} onClick={onDownload}>Download PNG</button>
            </div>
  
            <p className="hint">
              The "N / 22 PATHWAYS" counter is automatic — it's the pathway's position
              in canon order, not something you set.
            </p>
          </div>
  )
}
