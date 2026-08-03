import { z } from 'zod'
import {
  BackgroundOpacitySchema,
  ImageSourceSchema,
  MapEntrySchema,
  PathwayNameSchema,
} from './base'

export const GeneralExplanationCardSchema = z
  .object({
    type: z.literal('General Explanation'),
    title: z.string().trim().min(1).max(100).describe('Titulo principal de la explicacion.'),
    description: z.string().trim().min(1).max(800).describe('Texto explicativo general.'),
    sequence: z.int().min(0).max(9).optional().describe(
      'Secuencia tematica opcional. Selecciona el fondo por defecto de esa Secuencia.',
    ),
    pathway: PathwayNameSchema.optional().describe(
      'Pathway concreto opcional. Si se omite, la explicacion es general.',
    ),
    backgroundImageUrl: ImageSourceSchema.optional().describe(
      'Imagen de fondo propia. Si se omite y hay pathway, la carta usa el arte de ese pathway.',
    ),
    backgroundOpacity: BackgroundOpacitySchema,
  })
  .strict()

export const SimpleExplanationCardSchema = z
  .object({
    type: z.literal('Simple Explanation'),
    text: z.string().trim().min(1).max(1000).describe(
      'Texto unico, centrado y autoajustable. La letra se reduce a medida que crece el contenido.',
    ),
    fontSizeMin: z.number().int().min(12).max(36).default(14).describe(
      'Tamano minimo de fuente en pixeles para textos largos.',
    ),
    fontSizeMax: z.number().int().min(16).max(48).default(28).describe(
      'Tamano maximo de fuente en pixeles para textos cortos.',
    ),
    position: z.enum(['top', 'center', 'bottom']).default('center').describe(
      'Distribucion vertical del texto dentro de la carta.',
    ),
  })
  .refine((card) => card.fontSizeMin <= card.fontSizeMax, {
    path: ['fontSizeMin'],
    message: 'fontSizeMin debe ser menor o igual que fontSizeMax.',
  })
  .strict()

export const PathwayExplanationCardSchema = z
  .object({
    type: z.literal('Pathway Explanation'),
    pathway: PathwayNameSchema,
    title: z.string().trim().min(1).max(100).describe(
      'Titulo de la carta. Envuelve la palabra o frase clave en *asteriscos* para resaltarla en color tier.',
    ),
    description: z.string().trim().min(1).max(240).describe('Texto breve mostrado bajo la regla.'),
    backgroundImageUrl: ImageSourceSchema.optional().describe(
      'Imagen de fondo propia. Si se omite, la carta usa el arte de su pathway.',
    ),
    backgroundOpacity: BackgroundOpacitySchema,
  })
  .strict()

export const BreakdownCardSchema = z
  .object({
    type: z.literal('Breakdown'),
    kicker: z.string().trim().max(40).optional().describe(
      'Etiqueta opcional sobre el titulo para agrupar cartas, p. ej. "Authority".',
    ),
    title: z.string().trim().min(1).max(60).describe('Nombre del concepto o autoridad explicada.'),
    does: z.string().trim().min(1).max(240).describe('Que hace este concepto (seccion DOES).'),
    doesNot: z.string().trim().min(1).max(240).describe("Que no hace, para evitar confusiones (seccion DOESN'T)."),
    edgeLabel: z.string().trim().min(1).max(20).default('Edge').describe(
      'Etiqueta de la tercera seccion, p. ej. "Edge" o "Caps at".',
    ),
    edgeText: z.string().trim().min(1).max(240).describe(
      'Limite, matiz o dato clave de la tercera seccion, resaltado en color tier.',
    ),
    backgroundImageUrl: ImageSourceSchema.optional().describe(
      'Imagen de fondo opcional, mostrada bajo un velo oscuro.',
    ),
    backgroundOpacity: BackgroundOpacitySchema,
  })
  .strict()

export const MapCardSchema = z
  .object({
    type: z.literal('Map'),
    title: z.string().trim().min(1).max(100).describe('Titulo de la carta, p. ej. "Where the powers come from".'),
    entries: z.array(MapEntrySchema).min(1).max(8).describe(
      'Filas de la carta, cada una con su etiqueta opcional y su valor.',
    ),
    footerText: z.string().trim().max(160).optional().describe(
      'Texto final opcional bajo una regla, p. ej. "Three roots. Seven powers."',
    ),
    pathway: PathwayNameSchema.optional().describe(
      'Pathway opcional del que la carta toma su color y su imagen de fondo. Si se omite, usa el dorado neutro.',
    ),
    backgroundImageUrl: ImageSourceSchema.optional().describe(
      'Imagen de fondo propia. Tiene prioridad sobre el fondo que aporta el pathway.',
    ),
    backgroundOpacity: BackgroundOpacitySchema,
  })
  .strict()

export const TarotMemberCardSchema = z
  .object({
    type: z.literal('Tarot Member'),
    variant: z.enum(['Portrait', 'Dossier', 'Contrast']).default('Portrait').describe(
      'Composicion visual: Portrait prioriza imagen y nombre; Dossier parece un expediente; Contrast divide percepcion y realidad.',
    ),
    name: z.string().trim().min(1).max(80).describe('Nombre o identidad que se explica.'),
    tarotTitle: z.string().trim().min(1).max(40).describe('Arcano o rol visible, p. ej. The Hanged Man.'),
    description: z.string().trim().min(1).max(360).describe(
      'Descripcion principal; en Contrast es lo que el Club percibe.',
    ),
    detailLabel: z.string().trim().min(1).max(36).default('Club function').describe(
      'Etiqueta de la segunda idea; en Contrast encabeza la realidad.',
    ),
    detailText: z.string().trim().min(1).max(280).describe('Segunda idea, funcion o contraste del personaje.'),
    footerText: z.string().trim().max(180).optional().describe('Remate final breve, divertido pero veraz.'),
    pathway: PathwayNameSchema.optional().describe('Pathway opcional que aporta el color de acento.'),
    accentColor: z.string().regex(/^#[0-9a-f]{6}$/i).optional().describe(
      'Color visual opcional en hexadecimal. Reemplaza el acento del pathway sin presentarse como canon.',
    ),
    imageUrl: ImageSourceSchema.optional().describe('Retrato o arte de fondo opcional.'),
    backgroundOpacity: BackgroundOpacitySchema,
  })
  .strict()
