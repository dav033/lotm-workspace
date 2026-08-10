import { z } from 'zod'
import {
  PATH_NAMES,
  POWER_LEVELS,
  TIER_RANK_NAMES,
} from '../pathways'
import { FontSizeOverridesField } from './fontSizes'

const enumFrom = (values: string[]) => z.enum(values as [string, ...string[]])

export const PathwayNameSchema = enumFrom(PATH_NAMES).describe(
  'Nombre canonico de uno de los 22 pathways de Lord of Mysteries.',
)

export const PowerLevelSchema = enumFrom(POWER_LEVELS.map(({ key }) => key)).describe(
  'Nivel de poder mostrado en una carta de personaje.',
)

export const TierRankSchema = enumFrom(TIER_RANK_NAMES).describe(
  'Rango de tier con variantes: S+/S/S-, A+/A/A-, B+/B/B-, C+/C/C-, D+/D/D- o F+/F/F-.',
)

export const ImageSourceSchema = z
  .string()
  .trim()
  .max(2_048)
  .refine(
    (value) => /^https?:\/\//i.test(value) || /^\/(?!\/)/.test(value),
    'La imagen debe ser una URL http(s) o una ruta de /public que empiece por /.',
  )
  .describe(
    'URL http(s) o ruta publica de la imagen. SQLite guarda solo esta referencia textual, nunca el binario.',
  )

export const BackgroundOpacitySchema = z
  .int()
  .min(0)
  .max(100)
  .optional()
  .describe('Visibilidad de la imagen de fondo, de 0 (oculta) a 100 (maxima). Por defecto, 65.')

export const LinkedCardRoleSchema = z.enum(['subject', 'explanation']).describe(
  'Rol dentro de un par: carta principal (subject) o carta que explica su fundamento (explanation).',
)

export const LinkedCardFields = {
  pairId: z.uuid().optional().describe('Identificador compartido por las dos cartas enlazadas.'),
  pairRole: LinkedCardRoleSchema.optional().describe('Rol de esta carta dentro del par enlazado.'),
}

export const SequenceSchema = z.object({
  pathway: PathwayNameSchema,
  sequence: z.int().min(0).max(9).describe('Secuencia entre 0 y 9.'),
})

export const SharedStandardCardSchema = z.object({
  name: z.string().trim().min(1).max(80).describe('Nombre visible de la carta.'),
  pathway: PathwayNameSchema,
  sequence: z.int().min(0).max(9).describe('Secuencia principal entre 0 y 9.'),
  secondSequence: SequenceSchema.optional().describe(
    'Segundo pathway y secuencia para personajes o artefactos duales.',
  ),
  modifier: z.string().trim().max(80).optional().describe('Modificador opcional del poder o grado.'),
  alterDomain: z.string().trim().max(120).optional().describe('Dominio alternativo; por defecto, None.'),
  imageUrl: ImageSourceSchema.optional().describe('Ilustracion principal opcional.'),
  ...LinkedCardFields,
  ...FontSizeOverridesField,
})

export const MapEntrySchema = z
  .object({
    tags: z.string().trim().max(120).describe(
      'Etiquetas de la fila unidas por " · ", p. ej. "Door · Change · King of Space-Time". Puede ir vacio.',
    ),
    value: z.string().trim().min(1).max(120).describe('El valor o resultado que corresponde a esas etiquetas.'),
  })
  .strict()
