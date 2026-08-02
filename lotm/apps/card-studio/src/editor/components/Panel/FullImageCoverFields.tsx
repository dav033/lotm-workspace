/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-vars */
// @ts-nocheck
import React, { useRef } from 'react'
import { PATHWAYS, PATH_NAMES, TIER_RANKS, TIER_RANK_NAMES } from '../../../domain/pathways'
import { PATHWAY_BACKGROUNDS } from '../../../domain/pathwayBackgrounds'
import { BackgroundField, PathwayCombo, SeqSelect } from './primitives'

export default function FullImageCoverFields({ state, set, accent, onUploadImage, onDownload, onGenerateTierBatch, defaultTierBackground, defaultPathwayCardBackground }) {
  return (
          <div key="full-cover-fields">
            <div className="field">
              <label htmlFor="full-cover-title">Title</label>
              <input
                id="full-cover-title"
                maxLength={100}
                value={state.fullCoverTitle ?? ''}
                placeholder="Enter the cover title…"
                autoComplete="off"
                onChange={(event) => set({ fullCoverTitle: event.target.value })}
              />
            </div>
            <p className="hint">
              Click or drop an image onto the card. It fills the body while the title stays in the footer.
            </p>
            <div className="actions">
              <button className="btn-dl" style={{ background: accent.c }} onClick={onDownload}>Download PNG</button>
            </div>
          </div>
  )
}
