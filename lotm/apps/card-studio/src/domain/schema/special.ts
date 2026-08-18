import { z } from 'zod'
import { BackgroundOpacitySchema, ImageSourceSchema, PathwayNameSchema } from './base'
import { FontSizeOverridesField } from './fontSizes'

export const DOSSIER_VARIANTS = ['Auto', 'Impact', 'Verdict', 'Contrast', 'Evidence', 'Comment', 'Longform'] as const
export type DossierVariant = typeof DOSSIER_VARIANTS[number]

export const DossierCardSchema = z.object({
  type: z.literal('Dossier'),
  variant: z.enum(DOSSIER_VARIANTS).default('Auto').describe(
    'Composicion visual: Auto reparte el ritmo por sujeto; Impact pone el hook al frente; Verdict pone el remate al frente; Contrast separa dos lecturas; Evidence prioriza la prueba; Comment deja una pregunta abierta; Longform abre una lectura editorial para contenido denso.',
  ),
  name: z.string().trim().min(1).max(80),
  headline: z.string().trim().min(1).max(180),
  evidence: z.string().trim().min(1).max(720),
  counterpoint: z.string().trim().min(1).max(480),
  takeaway: z.string().trim().min(1).max(180),
  sourceLabel: z.string().trim().max(80).default('Source note'),
  backgroundImageUrl: ImageSourceSchema.optional(),
  backgroundOpacity: BackgroundOpacitySchema,
  ...FontSizeOverridesField,
}).strict()

export const CorruptionFileCardSchema = z.object({
  type: z.literal('Corruption File'),
  variant: z.enum(['Warning', 'Evidence', 'Quote']).default('Warning'),
  incident: z.string().trim().min(1).max(90),
  caseLabel: z.string().trim().min(1).max(40).default('Normal explanation'),
  explanation: z.string().trim().min(1).max(320),
  reactionLabel: z.string().trim().min(1).max(40).default('Fandom reaction'),
  reaction: z.string().trim().min(1).max(280),
  footerText: z.string().trim().max(180).optional(),
  corruptionLevel: z.enum(['Low', 'Moderate', 'Severe', 'Catastrophic']).default('Severe'),
  showIncidentNumber: z.boolean().default(false),
  accentColor: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
  imageUrl: ImageSourceSchema.optional(),
  backgroundOpacity: BackgroundOpacitySchema,
  ...FontSizeOverridesField,
}).strict()

export const RitualLogicCardSchema = z.object({
  type: z.literal('Ritual Logic'),
  variant: z.enum(['Chain', 'Split', 'Casefile', 'Pressure', 'Timeline']).default('Chain').describe(
    'Composicion visual: Chain muestra el proceso completo; Split separa requisito y preparacion; Casefile usa una nota de campo; Pressure pone el peligro al frente; Timeline ordena la experiencia antes, durante y despues del trago.',
  ),
  pathway: PathwayNameSchema,
  sequence: z.int().min(0).max(9).describe('Secuencia que se alcanza mediante el ritual.'),
  sequenceName: z.string().trim().min(1).max(80),
  ritual: z.string().trim().min(1).max(360).describe('What the ritual act accomplishes and how it guides assimilation.'),
  survival: z.string().trim().min(1).max(360).describe('What pressure or danger the potion creates during assimilation.'),
  preparation: z.string().trim().min(1).max(420).describe('What power or principle of the new Sequence the ritual rehearses.'),
  certainty: z.enum(['Canon', 'Mixed', 'Theory']).default('Mixed'),
  uncertainty: z.string().trim().max(240).optional(),
  footerText: z.string().trim().max(180).optional(),
  backgroundImageUrl: ImageSourceSchema.optional(),
  backgroundOpacity: BackgroundOpacitySchema,
  ...FontSizeOverridesField,
}).strict()
