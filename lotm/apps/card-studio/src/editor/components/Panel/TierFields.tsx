/* eslint-disable @typescript-eslint/ban-ts-comment, react/no-unescaped-entities, @typescript-eslint/no-unused-vars */
// @ts-nocheck
import React, { useRef } from 'react'
import { PATHWAYS, PATH_NAMES, TIER_RANKS, TIER_RANK_NAMES } from '../../../domain/pathways'
import { PATHWAY_BACKGROUNDS } from '../../../domain/pathwayBackgrounds'
import { BackgroundField, PathwayCombo, SeqSelect } from './primitives'

export default function TierFields({ state, set, accent, onUploadImage, onDownload, onGenerateTierBatch, defaultTierBackground, defaultPathwayCardBackground }) {
  return (
          <div key="tier-fields">
            <div className="field">
              <label>Pathway (search all 22)</label>
              <PathwayCombo
                value={PATHWAYS[state.tierPath] ? state.tierPath : 'Fool'}
                onPick={(n) => set({ tierPath: n })}
              />
            </div>
  
            <div className="field">
              <label>Tier subject</label>
              <div className="toggle">
                <button
                  className={'seg' + (state.tierSeq === null ? ' sel' : '')}
                  onClick={() => set({ tierSeq: null })}
                >
                  Whole pathway
                </button>
                <button
                  className={'seg' + (state.tierSeq !== null ? ' sel' : '')}
                  onClick={() => set({ tierSeq: state.tierSeq ?? 9 })}
                >
                  Specific sequence
                </button>
              </div>
            </div>
  
            {state.tierSeq !== null && (
              <div className="field">
                <label>Sequence</label>
                <SeqSelect
                  path={PATHWAYS[state.tierPath] ? state.tierPath : 'Fool'}
                  value={state.tierSeq}
                  onChange={(tierSeq) => set({ tierSeq })}
                />
              </div>
            )}
  
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
  
            <BackgroundField
              value={state.tierBackgroundImage}
              field="tierBackgroundImage"
              opacity={state.backgroundOpacity}
              set={set}
              onUploadImage={onUploadImage}
              help={defaultTierBackground
                ? `Using the default ${state.tierPath} background.`
                : `No default background exists for ${state.tierPath}.`}
            />
  
            <div className="field">
              <label htmlFor="tier-explanation">Explanation points (one per line)</label>
              <p className="field-help" id="tier-explanation-help">
                Each non-empty line becomes a bullet. A leading -, *, or • is optional.
              </p>
              <textarea
                className="tier-textarea"
                id="tier-explanation"
                name="tierExplanation"
                rows={10}
                value={state.tierText ?? ''}
                placeholder={'Strong at low sequences…\nFlexible across matchups…\nFalls off at the highest levels…'}
                aria-describedby="tier-explanation-help"
                autoComplete="off"
                onChange={(e) => set({ tierText: e.target.value })}
              />
            </div>
  
            <button className="batch-add" onClick={onGenerateTierBatch}>
              Generate all 22 pathway slides
            </button>
  
            <div className="actions">
              <button className="btn-dl" style={{ background: accent.c }} onClick={onDownload}>Download PNG</button>
            </div>
  
            <p className="hint">
              One slide per pathway: pick it, rank it, add explanation points. The rank
              color tints the whole card. "Generate all 22" appends one slide per
              pathway in canon order so you can rank them one by one.
            </p>
          </div>
  )
}
