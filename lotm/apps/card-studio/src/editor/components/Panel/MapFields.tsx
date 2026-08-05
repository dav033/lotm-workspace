/* eslint-disable @typescript-eslint/ban-ts-comment, react/no-unescaped-entities, @typescript-eslint/no-unused-vars */
// @ts-nocheck
import React, { useRef } from 'react'
import { PATHWAYS, PATH_NAMES, TIER_RANKS, TIER_RANK_NAMES } from '../../../domain/pathways'
import { PATHWAY_BACKGROUNDS } from '../../../domain/pathwayBackgrounds'
import { BackgroundField, PathwayCombo, SeqSelect } from './primitives'
import TextStyleField from './TextStyleField'

export default function MapFields({ state, set, accent, onUploadImage, onDownload, onGenerateTierBatch, defaultTierBackground, defaultPathwayCardBackground }) {
  return (
          <div key="map-fields">
            <div className="field">
              <label>Theme</label>
              <div className="toggle">
                <button
                  className={'seg' + (!state.mapPathway ? ' sel' : '')}
                  onClick={() => set({ mapPathway: null })}
                >
                  Neutral
                </button>
                <button
                  className={'seg' + (state.mapPathway ? ' sel' : '')}
                  onClick={() => set({ mapPathway: state.mapPathway || 'Fool' })}
                >
                  Pathway
                </button>
              </div>
              <p className="field-help">A pathway tints the card and adds its background art.</p>
            </div>
  
            {state.mapPathway && (
              <div className="field">
                <label>Pathway (search all 22)</label>
                <PathwayCombo
                  value={PATHWAYS[state.mapPathway] ? state.mapPathway : 'Fool'}
                  onPick={(n) => set({ mapPathway: n })}
                />
              </div>
            )}
  
            <div className="field">
              <label htmlFor="map-title">Title</label>
              <input
                id="map-title"
                maxLength={100}
                value={state.mapTitle ?? ''}
                placeholder="e.g. Where the powers come from"
                autoComplete="off"
                onChange={(e) => set({ mapTitle: e.target.value })}
              />
            </div>
  
            <div className="field">
              <label htmlFor="map-entries">Rows (one per line, up to 8)</label>
              <p className="field-help" id="map-entries-help">
                Format: "tags -&gt; value". The arrow is optional — without it, the whole line becomes the value.
              </p>
              <textarea
                className="tier-textarea"
                id="map-entries"
                rows={8}
                value={state.mapEntriesText ?? ''}
                placeholder={'Door · Change · King of Space-Time -> Door, Space, Seals, Alternate Worlds\nBizarreness · Spirit World -> Replication'}
                aria-describedby="map-entries-help"
                autoComplete="off"
                onChange={(e) => set({ mapEntriesText: e.target.value })}
              />
            </div>
  
            <div className="field">
              <label htmlFor="map-footer-text">Footer tagline (optional)</label>
              <textarea
                id="map-footer-text"
                rows={2}
                maxLength={160}
                value={state.mapFooterText ?? ''}
                placeholder="e.g. Three roots. Seven powers."
                autoComplete="off"
                onChange={(e) => set({ mapFooterText: e.target.value })}
              />
            </div>
  
            <BackgroundField
              value={state.mapBackgroundImage}
              field="mapBackgroundImage"
              opacity={state.backgroundOpacity}
              set={set}
              onUploadImage={onUploadImage}
              help={state.mapPathway
                ? `Using the default ${state.mapPathway} background. Upload one to override it.`
                : 'No background image selected.'}
            />

            <div className="typography-controls">
              <div className="typography-controls-head">
                <label>Typography</label>
                <p className="field-help">Tune each text role independently. Changes save with the card.</p>
              </div>
              {[
                ['title', 'Title'],
                ['label', 'Labels'],
                ['value', 'Values'],
                ['footer', 'Footer'],
              ].map(([role, label]) => (
                <TextStyleField
                  key={role}
                  role={role}
                  label={label}
                  value={state.mapTextStyles?.[role] ?? {}}
                  onChange={(patch) => set({
                    mapTextStyles: {
                      ...(state.mapTextStyles ?? {}),
                      [role]: { ...(state.mapTextStyles?.[role] ?? {}), ...patch },
                    },
                  })}
                  onReset={() => set({
                    mapTextStyles: {
                      ...(state.mapTextStyles ?? {}),
                      [role]: {},
                    },
                  })}
                />
              ))}
            </div>
  
            <div className="actions">
              <button className="btn-dl" style={{ background: accent.c }} onClick={onDownload}>Download PNG</button>
            </div>
          </div>
  )
}
