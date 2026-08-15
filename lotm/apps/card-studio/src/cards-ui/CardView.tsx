import React, { forwardRef } from 'react'
import Card from './Card'
import CoverCard from './CoverCard'
import FullImageCoverCard from './FullImageCoverCard'
import TierCard from './TierCard'
import TierlistCard from './TierlistCard'
import PathwayCard from './PathwayCard'
import TierExplanationCard from './TierExplanationCard'
import GeneralExplanationCard from './GeneralExplanationCard'
import SimpleExplanationCard from './SimpleExplanationCard'
import PathwayExplanationCard from './PathwayExplanationCard'
import BreakdownCard from './BreakdownCard'
import MapCard from './MapCard'
import TarotMemberCard from './TarotMemberCard'
import FraudFileCard from './FraudFileCard'
import CorruptionFileCard from './CorruptionFileCard'
import RitualLogicCard from './RitualLogicCard'
import TimelineCard from './TimelineCard'
import { cardPropsFromBuilderState, type CardViewHandlers } from './cardProps'
import type { BuilderCardState } from '../domain/schema'

export type CardViewProps = CardViewHandlers & {
  state: BuilderCardState
}

const CardView = forwardRef<HTMLElement, CardViewProps>(function CardView(
  { state, onUploadImage, onDropImages, onDropBackground },
  ref,
) {
  const { kind, props } = cardPropsFromBuilderState(state, {
    onUploadImage,
    onDropImages,
    onDropBackground,
  })

  if (kind === 'Cover') return <CoverCard {...props} ref={ref as React.Ref<HTMLDivElement>} />
  if (kind === 'Full Image Cover') return <FullImageCoverCard {...props} ref={ref} />
  if (kind === 'Tier') return <TierCard {...props} ref={ref} />
  if (kind === 'Tierlist') return <TierlistCard {...props} ref={ref} />
  if (kind === 'Pathway') return <PathwayCard {...props} ref={ref} />
  if (kind === 'Tier Explanation') return <TierExplanationCard {...props} ref={ref} />
  if (kind === 'General Explanation') return <GeneralExplanationCard {...props} ref={ref} />
  if (kind === 'Simple Explanation') return <SimpleExplanationCard {...props} ref={ref} />
  if (kind === 'Pathway Explanation') return <PathwayExplanationCard {...props} ref={ref} />
  if (kind === 'Breakdown') return <BreakdownCard {...props} ref={ref} />
  if (kind === 'Map') return <MapCard {...props} ref={ref} />
  if (kind === 'Tarot Member') return <TarotMemberCard {...props} ref={ref} />
  if (kind === 'Fraud File') return <FraudFileCard {...props} ref={ref} />
  if (kind === 'Corruption File') return <CorruptionFileCard {...props} ref={ref} />
  if (kind === 'Ritual Logic') return <RitualLogicCard {...props} ref={ref} />
  if (kind === 'Timeline') return <TimelineCard {...props} ref={ref} />
  return <Card {...props} ref={ref as React.Ref<HTMLDivElement>} />
})

export default CardView
