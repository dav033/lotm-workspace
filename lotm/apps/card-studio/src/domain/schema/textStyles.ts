import { z } from 'zod'

export const TEXT_STYLE_FONTS = [
  'Archivo',
  'Playfair Display',
  'JetBrains Mono',
  'Cinzel',
  'Space Grotesk',
] as const

export const TextStyleSchema = z.object({
  fontFamily: z.enum(TEXT_STYLE_FONTS).optional(),
  fontSize: z.number().int().min(8).max(96).optional(),
  fontWeight: z.union([
    z.literal(400), z.literal(500), z.literal(600),
    z.literal(700), z.literal(800), z.literal(900),
  ]).optional(),
  lineHeight: z.number().min(0.75).max(2).optional(),
  letterSpacing: z.number().min(-0.08).max(0.35).optional(),
  color: z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
  textTransform: z.enum(['none', 'uppercase']).optional(),
}).strict()

export const MapTextStylesSchema = z.object({
  title: TextStyleSchema.optional(),
  label: TextStyleSchema.optional(),
  value: TextStyleSchema.optional(),
  footer: TextStyleSchema.optional(),
}).strict()

export type TextStyle = z.infer<typeof TextStyleSchema>
export type MapTextStyles = z.infer<typeof MapTextStylesSchema>

export const DEFAULT_MAP_TEXT_STYLES: MapTextStyles = {
  title: {},
  label: {},
  value: {},
  footer: {},
}
