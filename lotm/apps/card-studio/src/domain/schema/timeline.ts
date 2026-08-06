import { z } from 'zod'
import { BackgroundOpacitySchema, ImageSourceSchema, PathwayNameSchema } from './base'

export const TimelineCardSchema = z.object({
  type: z.literal('Timeline'),
  variant: z.enum(['Open', 'Beat', 'Turn', 'Arc']).default('Beat').describe(
    'Composicion: Open abre el video con medallon y rango de eras; Beat es el hito normal con el texto arriba; Turn marca un punto de inflexion con la imagen abierta y el texto abajo; Arc cierra con los movimientos del arco.',
  ),
  pathway: PathwayNameSchema.optional().describe('Pathway del que se hereda el color de acento y el fondo por defecto.'),
  era: z.string().trim().max(40).optional().describe('Epoca, anio o rango de capitulos del hito. Va en el chip superior; no se repite en ningun otro sitio de la carta.'),
  kicker: z.string().trim().max(60).optional().describe('Solo para Open: rotulo sobre el titulo.'),
  title: z.string().trim().min(1).max(60).describe('El hito, en frase nominal corta. No es una conclusion ni un remate.'),
  text: z.string().trim().max(180).optional().describe('Una sola consecuencia del hito. Nunca repite el titulo ni la era.'),
  step: z.int().min(1).max(24).default(1).describe('Posicion del hito dentro del video. Enciende el nodo de la espina.'),
  total: z.int().min(1).max(24).default(11).describe('Numero de hitos del video. Define cuantos nodos dibuja la espina.'),
  certainty: z.enum(['Canon', 'Mixed', 'Secondary', 'Reconstruction']).default('Canon').describe(
    'Procedencia del hito: Canon es evidencia directa de capitulo; Mixed mezcla capitulo y captura secundaria; Secondary viene de la wiki preservada en el vault; Reconstruction es sintesis propia del vault.',
  ),
  note: z.string().trim().max(160).optional().describe('Limite de la evidencia: el capitulo, o por que el dato no se puede elevar a canon.'),
  moves: z.array(z.string().trim().min(1).max(140)).max(4).default([]).describe('Solo para Arc: los movimientos del arco, en orden.'),
  footerText: z.string().trim().max(180).optional(),
  ghost: z.string().trim().max(4).optional().describe('Solo para Turn: numeral o cifra de fondo, por ejemplo IV o 0.'),
  backgroundImageUrl: ImageSourceSchema.optional(),
  backgroundOpacity: BackgroundOpacitySchema,
}).strict()
