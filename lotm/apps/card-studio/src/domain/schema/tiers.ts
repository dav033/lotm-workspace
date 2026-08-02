import { z } from 'zod'
import { BackgroundOpacitySchema, ImageSourceSchema, PathwayNameSchema, TierRankSchema } from './base'

export const TierCardSchema = z
  .object({
    type: z.literal('Tier'),
    pathway: PathwayNameSchema,
    sequence: z.int().min(0).max(9).optional().describe(
      'Secuencia concreta opcional entre 0 y 9. Si se omite, aplica al pathway completo.',
    ),
    rank: TierRankSchema,
    points: z
      .array(z.string().trim().min(1).max(180))
      .max(14)
      .describe('Puntos de explicacion, uno por linea en la carta.'),
    footerText: z.string().trim().max(240).optional().describe(
      'Texto destacado opcional mostrado al pie de la carta.',
    ),
    backgroundImageUrl: ImageSourceSchema.optional().describe(
      'Imagen de fondo opcional, mostrada bajo un overlay oscuro.',
    ),
    backgroundOpacity: BackgroundOpacitySchema,
  })
  .strict()

export const PathwayCardSchema = z
  .object({
    type: z.literal('Pathway'),
    pathway: PathwayNameSchema,
    sequence: z.int().min(0).max(9).optional().describe(
      'Secuencia concreta opcional entre 0 y 9. Si se omite, aplica al pathway completo.',
    ),
    points: z
      .array(z.string().trim().min(1).max(180))
      .max(14)
      .describe('Puntos de explicacion, uno por linea en la carta.'),
    footerText: z.string().trim().max(240).optional().describe(
      'Texto destacado opcional mostrado al pie de la carta.',
    ),
    backgroundImageUrl: ImageSourceSchema.optional().describe(
      'Imagen de fondo opcional, mostrada bajo un overlay oscuro.',
    ),
    backgroundOpacity: BackgroundOpacitySchema,
  })
  .strict()

export const TierExplanationCardSchema = z
  .object({
    type: z.literal('Tier Explanation'),
    rank: TierRankSchema,
    description: z.string().trim().min(1).max(240).describe('Descripcion breve mostrada debajo del tier.'),
    backgroundImageUrl: ImageSourceSchema.optional().describe(
      'Imagen de fondo opcional, mostrada bajo un overlay oscuro.',
    ),
    backgroundOpacity: BackgroundOpacitySchema,
  })
  .strict()
