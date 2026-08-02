import { z } from 'zod'
import { ArtifactCardSchema, CharacterCardSchema } from './standard'
import { CoverCardSchema, FullImageCoverCardSchema } from './covers'
import { PathwayCardSchema, TierCardSchema, TierExplanationCardSchema } from './tiers'
import {
  BreakdownCardSchema,
  GeneralExplanationCardSchema,
  MapCardSchema,
  PathwayExplanationCardSchema,
  TarotMemberCardSchema,
} from './explanations'
import { CorruptionFileCardSchema, RitualLogicCardSchema } from './special'

export const CardContentSchema = z.discriminatedUnion('type', [
  CharacterCardSchema,
  ArtifactCardSchema,
  CoverCardSchema,
  FullImageCoverCardSchema,
  TierCardSchema,
  PathwayCardSchema,
  TierExplanationCardSchema,
  GeneralExplanationCardSchema,
  PathwayExplanationCardSchema,
  BreakdownCardSchema,
  MapCardSchema,
  TarotMemberCardSchema,
  CorruptionFileCardSchema,
  RitualLogicCardSchema,
])

export type CardContent = z.infer<typeof CardContentSchema>
