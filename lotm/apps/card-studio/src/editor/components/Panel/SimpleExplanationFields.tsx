/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React from 'react'

export default function SimpleExplanationFields({ state, set, accent, onDownload }) {
  const minFontSize = Number(state.simpleExplanationMinFontSize ?? 14)
  const maxFontSize = Number(state.simpleExplanationMaxFontSize ?? 28)

  return (
    <div key="simple-explanation-fields">
      <div className="field">
        <label htmlFor="simple-explanation-text">Text</label>
        <textarea
          id="simple-explanation-text"
          rows={12}
          maxLength={1000}
          value={state.simpleExplanationText ?? ''}
          placeholder="Write the explanation shown on the card…"
          autoComplete="off"
          onChange={(e) => set({ simpleExplanationText: e.target.value })}
        />
        <p className="field-help">
          {(state.simpleExplanationText ?? '').length}/1000 characters · auto-sizing type
        </p>
      </div>

      <div className="field">
        <label>Font size range</label>
        <div className="range-control">
          <div className="range-control-head"><span>Minimum</span><output>{minFontSize}px</output></div>
          <input
            type="range"
            min="12"
            max="36"
            step="1"
            value={minFontSize}
            aria-label="Minimum font size"
            onChange={(e) => set({
              simpleExplanationMinFontSize: Math.min(Number(e.target.value), maxFontSize),
            })}
          />
          <div className="range-control-head"><span>Maximum</span><output>{maxFontSize}px</output></div>
          <input
            type="range"
            min="16"
            max="48"
            step="1"
            value={maxFontSize}
            aria-label="Maximum font size"
            onChange={(e) => set({
              simpleExplanationMaxFontSize: Math.max(Number(e.target.value), minFontSize),
            })}
          />
          <p className="field-help">Short text uses maximum size; long text approaches minimum.</p>
        </div>
      </div>

      <div className="field">
        <label>Text position</label>
        <div className="toggle">
          {[['top', 'Top'], ['center', 'Center'], ['bottom', 'Bottom']].map(([value, label]) => (
            <button
              type="button"
              key={value}
              className={'seg' + (state.simpleExplanationPosition === value ? ' sel' : '')}
              onClick={() => set({ simpleExplanationPosition: value })}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="actions">
        <button className="btn-dl" style={{ background: accent.c }} onClick={onDownload}>Download PNG</button>
      </div>
    </div>
  )
}
