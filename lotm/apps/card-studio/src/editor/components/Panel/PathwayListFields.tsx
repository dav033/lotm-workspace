/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React from 'react'
import { PATHWAYS } from '../../../domain/pathways'
import { BackgroundField, PathwayCombo } from './primitives'

export default function PathwayListFields({ state, set, accent, onUploadImage, onDownload }) {
  return (
    <div key="pathway-list-fields">
      <div className="field">
        <label>Pathway (search all 22)</label>
        <PathwayCombo
          value={PATHWAYS[state.pathwayListPath] ? state.pathwayListPath : 'Fool'}
          onPick={(pathway) => set({ pathwayListPath: pathway })}
        />
      </div>

      <div className="field">
        <label htmlFor="pathway-list-title">Title</label>
        <input
          id="pathway-list-title"
          maxLength={100}
          value={state.pathwayListTitle ?? ''}
          placeholder="The local hazards."
          autoComplete="off"
          onChange={(event) => set({ pathwayListTitle: event.target.value })}
        />
      </div>

      <div className="field">
        <label htmlFor="pathway-list-items">Items</label>
        <textarea
          id="pathway-list-items"
          rows={8}
          maxLength={1200}
          value={state.pathwayListItemsText ?? ''}
          placeholder={'One observation per line.\nKeep each one short.\nLet the card do the spacing.'}
          autoComplete="off"
          onChange={(event) => set({ pathwayListItemsText: event.target.value })}
        />
        <p className="field-help">One item per line. The card numbers them and spaces them out.</p>
      </div>

      <BackgroundField
        value={state.pathwayListBackgroundImage}
        field="pathwayListBackgroundImage"
        opacity={state.backgroundOpacity}
        set={set}
        onUploadImage={onUploadImage}
        help={`Using the default ${state.pathwayListPath || 'pathway'} background. Upload one to override it.`}
      />

      <div className="actions">
        <button className="btn-dl" style={{ background: accent.c }} onClick={onDownload}>Download PNG</button>
      </div>

      <p className="hint">
        The title stays compact; the body is a real list so every observation gets its own breathing room.
      </p>
    </div>
  )
}
