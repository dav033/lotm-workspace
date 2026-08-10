/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React from 'react'
import { TIER_RANKS, TIER_RANK_NAMES } from '../../../domain/pathways'
import { BackgroundField } from './primitives'

export default function TierlistFields({ state, set, accent, onUploadImage, onDownload }) {
  return (
    <div key="tierlist-fields">
      <div className="field">
        <label htmlFor="tierlist-title">Title</label>
        <input
          id="tierlist-title"
          name="tierlistTitle"
          value={state.tierlistTitle ?? ''}
          placeholder="Klein's best duos…"
          onChange={(event) => set({ tierlistTitle: event.target.value })}
        />
      </div>

      <div className="field">
        <label>Tier</label>
        <div className="toggle tier-toggle">
          {TIER_RANK_NAMES.map((rank) => (
            <button
              key={rank}
              type="button"
              className={'seg' + (state.tierlistRank === rank ? ' sel' : '')}
              style={state.tierlistRank === rank
                ? { background: TIER_RANKS[rank].c, borderColor: TIER_RANKS[rank].c, color: '#0a0a11' }
                : { color: TIER_RANKS[rank].c }}
              onClick={() => set({ tierlistRank: rank })}
            >
              {rank}
            </button>
          ))}
        </div>
      </div>

      <BackgroundField
        value={state.tierlistBackgroundImage}
        field="tierlistBackgroundImage"
        opacity={state.backgroundOpacity}
        set={set}
        onUploadImage={onUploadImage}
        help="Optional custom background. No pathway background is applied."
      />

      <div className="field">
        <label htmlFor="tierlist-explanation">Explanation points (one per line)</label>
        <p className="field-help" id="tierlist-explanation-help">
          Each non-empty line becomes a bullet. A leading -, *, or • is optional.
        </p>
        <textarea
          className="tier-textarea"
          id="tierlist-explanation"
          name="tierlistExplanation"
          rows={10}
          value={state.tierlistText ?? ''}
          placeholder={'Best emotional support…\nMost chaotic teammate…'}
          aria-describedby="tierlist-explanation-help"
          autoComplete="off"
          onChange={(event) => set({ tierlistText: event.target.value })}
        />
      </div>

      <div className="field">
        <label htmlFor="tierlist-footer">Footer (optional)</label>
        <input
          id="tierlist-footer"
          name="tierlistFooter"
          value={state.tierlistFooterText ?? ''}
          placeholder="Final verdict…"
          onChange={(event) => set({ tierlistFooterText: event.target.value })}
        />
      </div>

      <div className="actions">
        <button className="btn-dl" style={{ background: accent.c }} onClick={onDownload}>Download PNG</button>
      </div>
      <p className="hint">Standalone ranking card. No pathway, sequence, icon or default lore background.</p>
    </div>
  )
}
