import { z } from 'zod'
import {
  PowerLevelSchema,
  SharedStandardCardSchema,
} from './base'

export const CharacterCardSchema = SharedStandardCardSchema.extend({
  type: z.literal('Character'),
  power: PowerLevelSchema,
}).strict()

export const ArtifactCardSchema = SharedStandardCardSchema.extend({
  type: z.literal('Artifact'),
  grade: z.enum(['0', '1', '2', '3', '4', '5']).describe('Grado del artefacto, de 5 a 0.'),
}).strict()
