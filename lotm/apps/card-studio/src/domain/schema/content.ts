import { z } from 'zod'
import { ArtifactCardSchema, CharacterCardSchema } from './standard'
import { CoverCardSchema, FullImageCoverCardSchema } from './covers'
import { PathwayCardSchema, TierCardSchema, TierExplanationCardSchema, TierlistCardSchema } from './tiers'
import {
  BreakdownCardSchema,
  GeneralExplanationCardSchema,
  MapCardSchema,
  PathwayExplanationCardSchema,
  SimpleExplanationCardSchema,
  TarotMemberCardSchema,
} from './explanations'
import { CorruptionFileCardSchema, FraudFileCardSchema, RitualLogicCardSchema } from './special'
import { TimelineCardSchema } from './timeline'

export const CardContentSchema = z.discriminatedUnion('type', [
  CharacterCardSchema,
  ArtifactCardSchema,
  CoverCardSchema,
  FullImageCoverCardSchema,
  TierCardSchema,
  TierlistCardSchema,
  PathwayCardSchema,
  TierExplanationCardSchema,
  GeneralExplanationCardSchema,
  SimpleExplanationCardSchema,
  PathwayExplanationCardSchema,
  BreakdownCardSchema,
  MapCardSchema,
  TarotMemberCardSchema,
  FraudFileCardSchema,
  CorruptionFileCardSchema,
  RitualLogicCardSchema,
  TimelineCardSchema,
])

export type CardContent = z.infer<typeof CardContentSchema>
