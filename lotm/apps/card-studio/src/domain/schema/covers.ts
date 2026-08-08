import { z } from 'zod'
import { ImageSourceSchema } from './base'
import { FontSizeOverridesField } from './fontSizes'

export const CoverCardSchema = z
  .object({
    type: z.literal('Cover'),
    title: z.string().trim().min(1).max(80).describe('Anime o universo que cruza con Lord of Mysteries.'),
    partNumber: z.string().trim().min(1).max(20).describe('Numero o identificador visible de la parte.'),
    topImageUrl: ImageSourceSchema.optional().describe('Imagen superior opcional.'),
    mainImageUrl: ImageSourceSchema.optional().describe('Imagen principal opcional.'),
    ...FontSizeOverridesField,
  })
  .strict()

export const FullImageCoverCardSchema = z
  .object({
    type: z.literal('Full Image Cover'),
    title: z.string().trim().min(1).max(100).describe('Titulo mostrado al pie de la portada.'),
    imageUrl: ImageSourceSchema.optional().describe('Imagen de cuerpo completo opcional.'),
    ...FontSizeOverridesField,
  })
  .strict()
