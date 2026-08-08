import { z } from 'zod'

export const FontSizeOverridesSchema = z
  .record(
    z.string().regex(/^[a-z][a-zA-Z0-9]*$/),
    z.number().int().min(8).max(200),
  )
  .refine((sizes) => Object.keys(sizes).length <= 16, 'No se permiten mas de 16 roles tipograficos.')
  .refine(
    (sizes) => sizes.all === undefined || (sizes.all >= 60 && sizes.all <= 160),
    'La escala tipografica general debe estar entre 60 y 160 por ciento.',
  )
  .describe('Escala general opcional en fontSizes.all (porcentaje), con soporte heredado para tamanos por rol en pixeles.')

export type FontSizeOverrides = z.infer<typeof FontSizeOverridesSchema>

export const FontSizeOverridesField = {
  fontSizes: FontSizeOverridesSchema.optional(),
} as const
