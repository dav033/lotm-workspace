/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React from 'react'

export default function SimpleExplanationFields({ state, set, accent, onDownload }) {
  return (
    <div key="simple-explanation-fields">
      <div className="field">
        <label htmlFor="simple-explanation-text">Text</label>
        <textarea
          id="simple-explanation-text"
          rows={16}
          maxLength={1000}
          value={state.simpleExplanationText ?? ''}
          placeholder="Write the explanation shown in the center of the card…"
          autoComplete="off"
          onChange={(e) => set({ simpleExplanationText: e.target.value })}
        />
        <p className="field-help">
          {(state.simpleExplanationText ?? '').length}/1000 characters · centered, auto-sizing type
        </p>
      </div>

      <div className="actions">
        <button className="btn-dl" style={{ background: accent.c }} onClick={onDownload}>Download PNG</button>
      </div>
    </div>
  )
}
