/* eslint-disable @typescript-eslint/ban-ts-comment, react/no-unescaped-entities, @typescript-eslint/no-unused-vars */
// @ts-nocheck
import React, { useRef } from 'react'
import { PATHWAYS, PATH_NAMES, TIER_RANKS, TIER_RANK_NAMES } from '../../../domain/pathways'
import { PATHWAY_BACKGROUNDS } from '../../../domain/pathwayBackgrounds'
import { BackgroundField, PathwayCombo, SeqSelect } from './primitives'

export default function PathwayFields({ state, set, accent, onUploadImage, onDownload, onGenerateTierBatch, defaultTierBackground, defaultPathwayCardBackground }) {
  return (
          <div key="pathway-card-fields">
            <div className="field">
              <label>Pathway (search all 22)</label>
              <PathwayCombo
                value={PATHWAYS[state.pathwayCardPath] ? state.pathwayCardPath : 'Fool'}
                onPick={(n) => set({ pathwayCardPath: n })}
              />
            </div>
  
            <div className="field">
              <label>Subject</label>
              <div className="toggle">
                <button
                  className={'seg' + (state.pathwayCardSeq === null ? ' sel' : '')}
                  onClick={() => set({ pathwayCardSeq: null })}
                >
                  Whole pathway
                </button>
                <button
                  className={'seg' + (state.pathwayCardSeq !== null ? ' sel' : '')}
                  onClick={() => set({ pathwayCardSeq: state.pathwayCardSeq ?? 9 })}
                >
                  Specific sequence
                </button>
              </div>
            </div>
  
            {state.pathwayCardSeq !== null && (
              <div className="field">
                <label>Sequence</label>
                <SeqSelect
                  path={PATHWAYS[state.pathwayCardPath] ? state.pathwayCardPath : 'Fool'}
                  value={state.pathwayCardSeq}
                  onChange={(pathwayCardSeq) => set({ pathwayCardSeq })}
                />
              </div>
            )}
  
            <BackgroundField
              value={state.pathwayCardBackgroundImage}
              field="pathwayCardBackgroundImage"
              opacity={state.backgroundOpacity}
              set={set}
              onUploadImage={onUploadImage}
              help={defaultPathwayCardBackground
                ? `Using the default ${state.pathwayCardPath} background.`
                : `No default background exists for ${state.pathwayCardPath}.`}
            />
  
            <div className="field">
              <label htmlFor="pathway-card-explanation">Explanation points (one per line)</label>
              <p className="field-help" id="pathway-card-explanation-help">
                Each non-empty line becomes a bullet. A leading -, *, or • is optional.
              </p>
              <textarea
                className="tier-textarea"
                id="pathway-card-explanation"
                name="pathwayCardText"
                rows={10}
                value={state.pathwayCardText ?? ''}
                placeholder={'Strong at low sequences…\nFlexible across matchups…\nFalls off at the highest levels…'}
                aria-describedby="pathway-card-explanation-help"
                autoComplete="off"
                onChange={(e) => set({ pathwayCardText: e.target.value })}
              />
            </div>
  
            <div className="actions">
              <button className="btn-dl" style={{ background: accent.c }} onClick={onDownload}>Download PNG</button>
            </div>
  
            <p className="hint">
              Same layout as a Tier slide, without the rank badge — the pathway's own
              color tints the whole card instead.
            </p>
          </div>
  )
}
