/* eslint-disable @typescript-eslint/ban-ts-comment, react/no-unescaped-entities, @typescript-eslint/no-unused-vars */
// @ts-nocheck
import React, { useRef } from 'react'
import { PATHWAYS, PATH_NAMES, TIER_RANKS, TIER_RANK_NAMES } from '../../../domain/pathways'
import { PATHWAY_BACKGROUNDS } from '../../../domain/pathwayBackgrounds'
import { BackgroundField, PathwayCombo, SeqSelect } from './primitives'

export default function BreakdownFields({ state, set, accent, onUploadImage, onDownload, onGenerateTierBatch, defaultTierBackground, defaultPathwayCardBackground }) {
  return (
          <div key="breakdown-fields">
            <div className="field">
              <label htmlFor="breakdown-kicker">Kicker (optional)</label>
              <input
                id="breakdown-kicker"
                maxLength={40}
                value={state.breakdownKicker ?? ''}
                placeholder="e.g. Authority"
                autoComplete="off"
                onChange={(e) => set({ breakdownKicker: e.target.value })}
              />
            </div>
  
            <div className="field">
              <label htmlFor="breakdown-title">Title</label>
              <input
                id="breakdown-title"
                maxLength={60}
                value={state.breakdownTitle ?? ''}
                placeholder="e.g. Replication"
                autoComplete="off"
                onChange={(e) => set({ breakdownTitle: e.target.value })}
              />
            </div>
  
            <div className="field">
              <label htmlFor="breakdown-does">Does</label>
              <textarea
                id="breakdown-does"
                rows={3}
                maxLength={240}
                value={state.breakdownDoes ?? ''}
                placeholder="What this does…"
                autoComplete="off"
                onChange={(e) => set({ breakdownDoes: e.target.value })}
              />
            </div>
  
            <div className="field">
              <label htmlFor="breakdown-doesnot">Doesn't</label>
              <textarea
                id="breakdown-doesnot"
                rows={3}
                maxLength={240}
                value={state.breakdownDoesNot ?? ''}
                placeholder="What it doesn't do…"
                autoComplete="off"
                onChange={(e) => set({ breakdownDoesNot: e.target.value })}
              />
            </div>
  
            <div className="field">
              <label htmlFor="breakdown-edge-label">Third section label</label>
              <input
                id="breakdown-edge-label"
                maxLength={20}
                value={state.breakdownEdgeLabel ?? 'Edge'}
                placeholder="Edge"
                autoComplete="off"
                onChange={(e) => set({ breakdownEdgeLabel: e.target.value })}
              />
              <p className="field-help">e.g. "Edge" or "Caps at" — shown highlighted in the tier color.</p>
            </div>
  
            <div className="field">
              <label htmlFor="breakdown-edge-text">Third section text</label>
              <textarea
                id="breakdown-edge-text"
                rows={3}
                maxLength={240}
                value={state.breakdownEdgeText ?? ''}
                placeholder="The key nuance…"
                autoComplete="off"
                onChange={(e) => set({ breakdownEdgeText: e.target.value })}
              />
            </div>
  
            <BackgroundField
              value={state.breakdownBackgroundImage}
              field="breakdownBackgroundImage"
              opacity={state.backgroundOpacity}
              set={set}
              onUploadImage={onUploadImage}
              help="No background image selected."
            />
  
            <div className="actions">
              <button className="btn-dl" style={{ background: accent.c }} onClick={onDownload}>Download PNG</button>
            </div>
          </div>
  )
}
