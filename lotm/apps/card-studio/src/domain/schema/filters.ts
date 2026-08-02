import { z } from 'zod'
import { CardContentSchema } from './content'

export const UniverseInputSchema = z
  .object({
    name: z.string().trim().min(1).max(120).describe('Nombre del anime o universo.'),
    description: z.string().trim().max(4_000).optional().describe('Contexto textual opcional para la IA.'),
  })
  .strict()

export const PartInputSchema = z
  .object({
    name: z.string().trim().min(1).max(120).describe('Nombre de la parte, arco o lote.'),
    number: z.int().positive().optional().describe('Orden numerico opcional dentro del universo.'),
    description: z.string().trim().max(4_000).optional().describe('Contexto textual opcional de esta parte.'),
  })
  .strict()

export const SaveCardBatchSchema = z
  .object({
    universe: UniverseInputSchema,
    part: PartInputSchema,
    cards: z.array(CardContentSchema).min(1).max(100).describe('Cartas que se agregaran en orden.'),
  })
  .strict()

export const CardFilterSchema = z
  .object({
    universe: z.string().trim().min(1).max(120).optional().describe('Nombre o slug del universo.'),
    part: z.string().trim().min(1).max(120).optional().describe('Nombre o slug de la parte.'),
  })
  .strict()

export const ListCardLibrarySchema = CardFilterSchema.extend({
  includeContent: z.boolean().default(true).describe('Incluye el contenido completo de cada carta.'),
})

export const UpdateCardSchema = z
  .object({
    cardId: z.uuid().describe('ID de la carta que se reemplazara.'),
    card: CardContentSchema,
  })
  .strict()

export const SaveCardImageSchema = z
  .object({
    mimeType: z
      .enum(['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'])
      .describe('Tipo de la imagen que se envia.'),
    data: z
      .string()
      .min(1)
      .describe(
        'Contenido de la imagen en base64, sin el prefijo "data:...;base64,". ' +
        'Hasta 15 MB ya decodificados.',
      ),
  })
  .strict()

export const MoveCardsSchema = z
  .object({
    cardIds: z
      .array(z.uuid())
      .min(1)
      .max(100)
      .describe('IDs de las cartas que se moveran, en el orden que tendran dentro de la seccion.'),
    universe: UniverseInputSchema.optional().describe(
      'Universo destino. Si se omite, las cartas se quedan en el universo que ya tenian.',
    ),
    part: PartInputSchema.describe('Seccion destino. Se crea si no existe.'),
  })
  .strict()

export const DeleteCardsSchema = z
  .object({
    cardIds: z.array(z.uuid()).min(1).max(100).describe('IDs de las cartas que se eliminaran.'),
  })
  .strict()

export const ExportCardsSchema = CardFilterSchema.extend({
  filename: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .optional()
    .describe('Nombre opcional del ZIP, sin ruta.'),
})

export type SaveCardBatchInput = z.infer<typeof SaveCardBatchSchema>
export type CardFilter = z.infer<typeof CardFilterSchema>
