import React, { type ComponentType } from 'react'
import Card from '../../cards-ui/Card'
import CoverCard from '../../cards-ui/CoverCard'
import FullImageCoverCard from '../../cards-ui/FullImageCoverCard'
import TierCard from '../../cards-ui/TierCard'
import TierlistCard from '../../cards-ui/TierlistCard'
import PathwayCard from '../../cards-ui/PathwayCard'
import TierExplanationCard from '../../cards-ui/TierExplanationCard'
import GeneralExplanationCard from '../../cards-ui/GeneralExplanationCard'
import SimpleExplanationCard from '../../cards-ui/SimpleExplanationCard'
import PathwayExplanationCard from '../../cards-ui/PathwayExplanationCard'
import PathwayListCard from '../../cards-ui/PathwayListCard'
import BreakdownCard from '../../cards-ui/BreakdownCard'
import MapCard from '../../cards-ui/MapCard'
import TarotMemberCard from '../../cards-ui/TarotMemberCard'
import DossierCard from '../../cards-ui/DossierCard'
import RitualLogicCard from '../../cards-ui/RitualLogicCard'
import TimelineCard from '../../cards-ui/TimelineCard'
import { cardPropsFromBuilderState } from '../../cards-ui/cardProps'
import type { CardUiProps } from '../../cards-ui/types'
import { type RenderState } from './assets'

const StaticCard = Card as unknown as ComponentType<Record<string, unknown>>
const StaticCoverCard = CoverCard as unknown as ComponentType<Record<string, unknown>>
const StaticFullImageCoverCard = FullImageCoverCard as unknown as ComponentType<Record<string, unknown>>
const StaticTierCard = TierCard as unknown as ComponentType<Record<string, unknown>>
const StaticTierlistCard = TierlistCard as unknown as ComponentType<Record<string, unknown>>
const StaticPathwayCard = PathwayCard as unknown as ComponentType<Record<string, unknown>>
const StaticTierExplanationCard = TierExplanationCard as unknown as ComponentType<Record<string, unknown>>
const StaticGeneralExplanationCard = GeneralExplanationCard as unknown as ComponentType<Record<string, unknown>>
const StaticSimpleExplanationCard = SimpleExplanationCard as unknown as ComponentType<Record<string, unknown>>
const StaticPathwayExplanationCard = PathwayExplanationCard as unknown as ComponentType<Record<string, unknown>>
const StaticPathwayListCard = PathwayListCard as unknown as ComponentType<Record<string, unknown>>
const StaticBreakdownCard = BreakdownCard as unknown as ComponentType<Record<string, unknown>>
const StaticMapCard = MapCard as unknown as ComponentType<Record<string, unknown>>
const StaticTarotMemberCard = TarotMemberCard as unknown as ComponentType<Record<string, unknown>>
const StaticDossierCard = DossierCard as unknown as ComponentType<Record<string, unknown>>
const StaticRitualLogicCard = RitualLogicCard as unknown as ComponentType<Record<string, unknown>>
const StaticTimelineCard = TimelineCard as unknown as ComponentType<Record<string, unknown>>

function iconFor(icons: Record<string, string>, pathway: unknown) {
  return typeof pathway === 'string' ? icons[pathway] : undefined
}

function resolvedProps(state: RenderState, icons: Record<string, string>): Record<string, unknown> {
  const mapped = cardPropsFromBuilderState(state)
  const props = mapped.props as CardUiProps & Record<string, unknown>
  const sequences = Array.isArray(props.sequences)
    ? props.sequences.map((sequence) => ({
      ...sequence,
      icon: iconFor(icons, sequence.path),
    }))
    : props.sequences

  const backgroundImage = mapped.kind === 'General Explanation'
    ? state.generalExplanationBackground
    : mapped.kind === 'Tierlist'
      ? state.tierlistBackgroundImage
    : mapped.kind === 'Map'
      ? state.mapBackground
      : mapped.kind === 'Tarot Member'
        ? state.tarotMemberResolvedImage
      : mapped.kind === 'Dossier'
        ? state.dossierBackground
      : mapped.kind === 'Timeline'
          ? state.timelineBackgroundImage
      : mapped.kind === 'Pathway List'
          ? state.pathwayListBackgroundImage
          : props.backgroundImage

  return {
    ...props,
    ...(sequences ? { sequences } : {}),
    ...(mapped.kind === 'Tier' ? { icon: iconFor(icons, state.tierPath) } : {}),
    ...(mapped.kind === 'Pathway' ? { icon: iconFor(icons, state.pathwayCardPath) } : {}),
    ...(mapped.kind === 'General Explanation'
      ? { icon: iconFor(icons, state.explanationPath) }
      : {}),
    ...(mapped.kind === 'Timeline' ? { icon: iconFor(icons, state.timelinePathway) } : {}),
    ...(backgroundImage !== undefined ? { backgroundImage } : {}),
    onUploadImage: () => undefined,
    onDropImages: () => undefined,
    onDropBackground: () => undefined,
  }
}

export function CardMarkup({ state, icons }: { state: RenderState; icons: Record<string, string> }) {
  const { kind } = cardPropsFromBuilderState(state)
  const props = resolvedProps(state, icons)

  if (kind === 'Cover') return <StaticCoverCard {...props} />
  if (kind === 'Full Image Cover') return <StaticFullImageCoverCard {...props} />
  if (kind === 'Tier') return <StaticTierCard {...props} />
  if (kind === 'Tierlist') return <StaticTierlistCard {...props} />
  if (kind === 'Pathway') return <StaticPathwayCard {...props} />
  if (kind === 'Tier Explanation') return <StaticTierExplanationCard {...props} />
  if (kind === 'General Explanation') return <StaticGeneralExplanationCard {...props} />
  if (kind === 'Simple Explanation') return <StaticSimpleExplanationCard {...props} />
  if (kind === 'Pathway Explanation') return <StaticPathwayExplanationCard {...props} />
  if (kind === 'Pathway List') return <StaticPathwayListCard {...props} />
  if (kind === 'Breakdown') return <StaticBreakdownCard {...props} />
  if (kind === 'Map') return <StaticMapCard {...props} />
  if (kind === 'Tarot Member') return <StaticTarotMemberCard {...props} />
  if (kind === 'Dossier') return <StaticDossierCard {...props} />
  if (kind === 'Ritual Logic') return <StaticRitualLogicCard {...props} />
  if (kind === 'Timeline') return <StaticTimelineCard {...props} />
  return <StaticCard {...props} />
}
