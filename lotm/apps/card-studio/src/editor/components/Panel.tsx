/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React from 'react'
import { PATHWAY_BACKGROUNDS } from '../../domain/pathwayBackgrounds'
import CardTypeToggle from './Panel/CardTypeToggle'
import ExplanationFields from './Panel/ExplanationFields'
import SimpleExplanationFields from './Panel/SimpleExplanationFields'
import TierFields from './Panel/TierFields'
import PathwayFields from './Panel/PathwayFields'
import PathwayExplanationFields from './Panel/PathwayExplanationFields'
import BreakdownFields from './Panel/BreakdownFields'
import MapFields from './Panel/MapFields'
import TarotMemberFields from './Panel/TarotMemberFields'
import CoverFields from './Panel/CoverFields'
import FullImageCoverFields from './Panel/FullImageCoverFields'
import StandardFields from './Panel/StandardFields'
import CorruptionFileFields from './Panel/CorruptionFileFields'
import RitualLogicFields from './Panel/RitualLogicFields'
import TimelineFields from './Panel/TimelineFields'

export default function Panel(props) {
  const { state, set } = props
  const defaultTierBackground = PATHWAY_BACKGROUNDS[state.tierPath] ?? null
  const defaultPathwayCardBackground = PATHWAY_BACKGROUNDS[state.pathwayCardPath] ?? null
  const fieldProps = { ...props, defaultTierBackground, defaultPathwayCardBackground }

  return (
    <aside className="panel">
      <h1>Card builder</h1>
      <p className="sub">
        Search a pathway, pick the sequence (auto-colors by tier), and your work
        saves automatically. Export at 960×1280.
      </p>

      <div className="field">
        <label>Type</label>
        <CardTypeToggle type={state.type} set={set} />
      </div>

      {state.type === 'Tier Explanation' || state.type === 'General Explanation' ? <ExplanationFields {...fieldProps} /> : null}
      {state.type === 'Simple Explanation' ? <SimpleExplanationFields {...fieldProps} /> : null}
      {state.type === 'Tier' ? <TierFields {...fieldProps} /> : null}
      {state.type === 'Pathway' ? <PathwayFields {...fieldProps} /> : null}
      {state.type === 'Pathway Explanation' ? <PathwayExplanationFields {...fieldProps} /> : null}
      {state.type === 'Breakdown' ? <BreakdownFields {...fieldProps} /> : null}
      {state.type === 'Map' ? <MapFields {...fieldProps} /> : null}
      {state.type === 'Tarot Member' ? <TarotMemberFields {...fieldProps} /> : null}
      {state.type === 'Corruption File' ? <CorruptionFileFields {...fieldProps} /> : null}
      {state.type === 'Ritual Logic' ? <RitualLogicFields {...fieldProps} /> : null}
      {state.type === 'Timeline' ? <TimelineFields {...fieldProps} /> : null}
      {state.type === 'Cover' ? <CoverFields {...fieldProps} /> : null}
      {state.type === 'Full Image Cover' ? <FullImageCoverFields {...fieldProps} /> : null}
      {state.type !== 'Tier Explanation' &&
      state.type !== 'General Explanation' &&
      state.type !== 'Simple Explanation' &&
      state.type !== 'Tier' &&
      state.type !== 'Pathway' &&
      state.type !== 'Pathway Explanation' &&
      state.type !== 'Breakdown' &&
      state.type !== 'Map' &&
      state.type !== 'Tarot Member' &&
      state.type !== 'Corruption File' &&
      state.type !== 'Ritual Logic' &&
      state.type !== 'Timeline' &&
      state.type !== 'Cover' &&
      state.type !== 'Full Image Cover' ? <StandardFields {...fieldProps} /> : null}
    </aside>
  )
}
