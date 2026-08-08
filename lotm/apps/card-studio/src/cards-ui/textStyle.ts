import type { CSSProperties } from 'react'
import type { FontSizeOverrides, TextStyle } from '../domain/schema'

const FONT_FALLBACKS: Record<NonNullable<TextStyle['fontFamily']>, string> = {
  Archivo: 'Arial, sans-serif',
  'Playfair Display': 'Georgia, serif',
  'JetBrains Mono': 'monospace',
  Cinzel: 'Georgia, serif',
  'Space Grotesk': 'Arial, sans-serif',
}

// Apply only explicit overrides. Missing properties keep each card family's
// responsive defaults, including title fitting and dense-card adjustments.
export function textStyleCss(style?: TextStyle): CSSProperties {
  if (!style) return {}
  const css: CSSProperties = {}
  if (style.fontFamily) css.fontFamily = `'${style.fontFamily}', ${FONT_FALLBACKS[style.fontFamily]}`
  if (style.fontSize !== undefined) css.fontSize = `${style.fontSize}px`
  if (style.fontWeight !== undefined) css.fontWeight = style.fontWeight
  if (style.lineHeight !== undefined) css.lineHeight = style.lineHeight
  if (style.letterSpacing !== undefined) css.letterSpacing = `${style.letterSpacing}em`
  if (style.color) css.color = style.color
  if (style.textTransform) css.textTransform = style.textTransform
  return css
}

export function fontSizeCss(
  sizes: FontSizeOverrides | undefined,
  role: string,
): CSSProperties | undefined {
  const fontSize = sizes?.[role]
  if (fontSize !== undefined) return { fontSize: `${fontSize}px` }

  const scale = sizes?.all
  return scale === undefined || scale === 100 ? undefined : { zoom: scale / 100 }
}
