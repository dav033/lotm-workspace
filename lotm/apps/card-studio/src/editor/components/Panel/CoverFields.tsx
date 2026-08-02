/* eslint-disable @typescript-eslint/ban-ts-comment, react/no-unescaped-entities, @typescript-eslint/no-unused-vars */
// @ts-nocheck
import React, { useRef } from 'react'
import { PATHWAYS, PATH_NAMES, TIER_RANKS, TIER_RANK_NAMES } from '../../../domain/pathways'
import { PATHWAY_BACKGROUNDS } from '../../../domain/pathwayBackgrounds'
import { BackgroundField, PathwayCombo, SeqSelect } from './primitives'

export default function CoverFields({ state, set, accent, onUploadImage, onDownload, onGenerateTierBatch, defaultTierBackground, defaultPathwayCardBackground }) {
  return (
          <div key="cover-fields">
            <div className="field">
              <label>Title (crossover series)</label>
              <input
                value={state.coverTitle ?? ''}
                placeholder="e.g. Fate"
                onChange={(e) => set({ coverTitle: e.target.value })}
              />
            </div>
  
            <div className="field">
              <label>Part</label>
              <input
                value={state.coverPartNum ?? ''}
                placeholder="e.g. 1"
                onChange={(e) => set({ coverPartNum: e.target.value })}
              />
            </div>
  
            <p className="hint">
              Everything else — "Pathways in", "Part", "Lord of Mysteries ×" —
              is fixed. Click or drop images directly onto the top and main
              panels of the cover to upload them. Every change auto-saves.
            </p>
          </div>
  )
}
