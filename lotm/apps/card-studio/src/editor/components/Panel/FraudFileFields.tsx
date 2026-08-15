/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React from 'react'
import { BackgroundField } from './primitives'

export default function FraudFileFields({ state, set, onUploadImage, onDownload, accent }) {
  return (
    <div key="fraud-file-fields">
      <p className="field-help">
        Fraud File keeps one allegation, its receipts, a counterpoint, and a verdict in a single editorial composition.
      </p>

      <div className="field">
        <label htmlFor="fraud-name">Subject</label>
        <input
          id="fraud-name"
          maxLength={80}
          value={state.fraudName ?? ''}
          placeholder="Edwina"
          autoComplete="off"
          onChange={(event) => set({ fraudName: event.target.value })}
        />
      </div>

      <div className="field">
        <label htmlFor="fraud-allegation">The charge</label>
        <input
          id="fraud-allegation"
          maxLength={140}
          value={state.fraudAllegation ?? ''}
          placeholder="GREAT SETUP. THEN NOTHING?"
          autoComplete="off"
          onChange={(event) => set({ fraudAllegation: event.target.value })}
        />
      </div>

      <div className="field">
        <label htmlFor="fraud-evidence">Receipts</label>
        <textarea
          id="fraud-evidence"
          rows={6}
          maxLength={420}
          value={state.fraudEvidence ?? ''}
          placeholder="What makes the accusation land?"
          onChange={(event) => set({ fraudEvidence: event.target.value })}
        />
        <p className="field-help">{(state.fraudEvidence ?? '').length}/420 characters</p>
      </div>

      <div className="field">
        <label htmlFor="fraud-counterpoint">Counterpoint</label>
        <textarea
          id="fraud-counterpoint"
          rows={4}
          maxLength={280}
          value={state.fraudCounterpoint ?? ''}
          placeholder="Give the defense its strongest version."
          onChange={(event) => set({ fraudCounterpoint: event.target.value })}
        />
        <p className="field-help">{(state.fraudCounterpoint ?? '').length}/280 characters</p>
      </div>

      <div className="field">
        <label htmlFor="fraud-verdict">Verdict</label>
        <input
          id="fraud-verdict"
          maxLength={120}
          value={state.fraudVerdict ?? ''}
          placeholder="DISAPPOINTMENT, NOT INCOMPETENCE."
          autoComplete="off"
          onChange={(event) => set({ fraudVerdict: event.target.value })}
        />
      </div>

      <div className="field">
        <label htmlFor="fraud-source">Source label</label>
        <input
          id="fraud-source"
          maxLength={80}
          value={state.fraudSourceLabel ?? ''}
          placeholder="Source mood: Reddit"
          autoComplete="off"
          onChange={(event) => set({ fraudSourceLabel: event.target.value })}
        />
      </div>

      <BackgroundField
        value={state.fraudBackgroundImage}
        field="fraudBackgroundImage"
        opacity={state.backgroundOpacity}
        set={set}
        onUploadImage={onUploadImage}
        help="Optional. The card already has a built-in dark dossier atmosphere."
      />

      <div className="actions">
        <button className="btn-dl" style={{ background: accent.c }} onClick={onDownload}>Download PNG</button>
      </div>
    </div>
  )
}
