/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-vars */
// @ts-nocheck
import React, { useRef } from 'react'
import { PATHWAYS, PATH_NAMES, TIER_RANKS, TIER_RANK_NAMES } from '../../../domain/pathways'
import { PATHWAY_BACKGROUNDS } from '../../../domain/pathwayBackgrounds'
import { BackgroundField, PathwayCombo, SeqSelect } from './primitives'

export default function StandardFields({ state, set, accent, onUploadImage, onDownload, onGenerateTierBatch, defaultTierBackground, defaultPathwayCardBackground }) {
  const fileRef = useRef(null)
  return (
          <div key="stat-fields">
            <div className="field">
              <label>Name</label>
              <input value={state.name} onChange={(e) => set({ name: e.target.value })} />
            </div>
  
            <div className="field">
              <label>Pathway (search all 22)</label>
              <PathwayCombo value={state.path} onPick={(n) => set({ path: n, seq: 0 })} />
            </div>
  
            <div className="field">
              <label>Sequence</label>
              <SeqSelect path={state.path} value={state.seq} onChange={(seq) => set({ seq })} />
            </div>
  
            <div className="field">
              <label className="check">
                <input
                  type="checkbox"
                  checked={state.hasSecond}
                  onChange={(e) => set({ hasSecond: e.target.checked })}
                />
                Second sequence (optional)
              </label>
            </div>
  
            {state.hasSecond && (
              <>
                <div className="field">
                  <label>Pathway #2</label>
                  <PathwayCombo value={state.path2} onPick={(n) => set({ path2: n, seq2: 0 })} />
                </div>
  
                <div className="field">
                  <label>Sequence #2</label>
                  <SeqSelect path={state.path2} value={state.seq2} onChange={(seq2) => set({ seq2 })} />
                </div>
              </>
            )}
  
            {state.type === 'Character' && (
              <div className="field">
                <label>Power</label>
                <select value={state.power} onChange={(e) => set({ power: e.target.value })}>
                  <option>Human</option>
                  <option>Low Sequence</option>
                  <option>Mid Sequence</option>
                  <option>Saint</option>
                  <option>Angel</option>
                  <option>King of Angels</option>
                  <option>True God</option>
                </select>
              </div>
            )}
  
            {state.type === 'Artifact' && (
              <div className="field">
                <label>Grade</label>
                <select value={state.grade} onChange={(e) => set({ grade: e.target.value })}>
                  <option>5</option><option>4</option><option>3</option>
                  <option>2</option><option>1</option><option>0</option>
                </select>
              </div>
            )}
  
            <div className="field">
              <label>Modifier — shown in parentheses (optional)</label>
              <input
                value={state.mod}
                placeholder="e.g. latent"
                onChange={(e) => set({ mod: e.target.value })}
              />
            </div>
  
            <div className="field">
              <label>Alter Domain</label>
              <input value={state.dom} onChange={(e) => set({ dom: e.target.value })} />
            </div>
  
            <div className="legend">
              <div className="lt">Tier color system</div>
              <div className="lrow"><span className="sw" style={{ background: '#6e8bc0' }} />Seq 9–7 · Low</div>
              <div className="lrow"><span className="sw" style={{ background: '#46c2a0' }} />Seq 6–4 · Mid</div>
              <div className="lrow"><span className="sw" style={{ background: '#b07ce0' }} />Seq 3–1 · High (Angel)</div>
              <div className="lrow"><span className="sw" style={{ background: '#e8c36b' }} />Seq 0 · Apex (God)</div>
            </div>
  
            <div className="actions">
              <button className="btn-img" onClick={() => fileRef.current.click()}>Upload image</button>
              <button className="btn-dl" style={{ background: accent.c }} onClick={onDownload}>Download PNG</button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => onUploadImage(e.target.files[0])}
            />
  
            <p className="hint">
              Every change auto-saves. Use the strip below the card to switch, reorder
              (drag), or add cards. PNG exports at 960×1280.
            </p>
          </div>
  )
}
