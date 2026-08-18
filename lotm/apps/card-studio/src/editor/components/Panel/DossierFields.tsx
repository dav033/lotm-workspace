/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React from 'react'
import { BackgroundField } from './primitives'

export default function DossierFields({ state, set, onUploadImage, onDownload, accent }) {
  return (
    <div key="dossier-fields">
      <p className="field-help">
        Same content, different rhythm. Pick a composition for the platform or leave Auto to vary it by subject.
      </p>

      <div className="field">
        <label htmlFor="dossier-variant">Composition</label>
        <select
          id="dossier-variant"
          value={state.dossierVariant ?? 'Auto'}
          onChange={(event) => set({ dossierVariant: event.target.value })}
        >
          <option value="Auto">Auto — vary by subject</option>
          <option value="Impact">Impact — hook first</option>
          <option value="Verdict">Verdict — payoff first</option>
          <option value="Contrast">Contrast — two readings</option>
          <option value="Evidence">Evidence — receipt first</option>
          <option value="Comment">Comment — open thread</option>
          <option value="Longform">Longform — dense reading</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="dossier-name">Subject</label>
        <input
          id="dossier-name"
          maxLength={80}
          value={state.dossierName ?? ''}
          placeholder="Edwina"
          autoComplete="off"
          onChange={(event) => set({ dossierName: event.target.value })}
        />
      </div>

      <div className="field">
        <label htmlFor="dossier-headline">The point</label>
        <input
          id="dossier-headline"
          maxLength={180}
          value={state.dossierHeadline ?? ''}
          placeholder="A strong setup left an unfinished thread."
          autoComplete="off"
          onChange={(event) => set({ dossierHeadline: event.target.value })}
        />
      </div>

      <div className="field">
        <label htmlFor="dossier-evidence">Evidence / context</label>
        <textarea
          id="dossier-evidence"
          rows={6}
          maxLength={720}
          value={state.dossierEvidence ?? ''}
          placeholder="What supports or explains the point?"
          onChange={(event) => set({ dossierEvidence: event.target.value })}
        />
        <p className="field-help">{(state.dossierEvidence ?? '').length}/720 characters</p>
      </div>

      <div className="field">
        <label htmlFor="dossier-counterpoint">Counterpoint</label>
        <textarea
          id="dossier-counterpoint"
          rows={4}
          maxLength={480}
          value={state.dossierCounterpoint ?? ''}
          placeholder="Give the strongest alternate reading."
          onChange={(event) => set({ dossierCounterpoint: event.target.value })}
        />
        <p className="field-help">{(state.dossierCounterpoint ?? '').length}/480 characters</p>
      </div>

      <div className="field">
        <label htmlFor="dossier-takeaway">Bottom line</label>
        <input
          id="dossier-takeaway"
          maxLength={180}
          value={state.dossierTakeaway ?? ''}
          placeholder="Interesting, but not fully developed."
          autoComplete="off"
          onChange={(event) => set({ dossierTakeaway: event.target.value })}
        />
      </div>

      <div className="field">
        <label htmlFor="dossier-source">Source label</label>
        <input
          id="dossier-source"
          maxLength={80}
          value={state.dossierSourceLabel ?? ''}
          placeholder="Source note"
          autoComplete="off"
          onChange={(event) => set({ dossierSourceLabel: event.target.value })}
        />
      </div>

      <BackgroundField
        value={state.dossierBackgroundImage}
        field="dossierBackgroundImage"
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
