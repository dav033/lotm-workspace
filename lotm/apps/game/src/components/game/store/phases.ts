export function openingSlugsFromResponse(value: unknown): string[] {
  if (!value || typeof value !== 'object' || !('openingElementSlugs' in value)) return []
  const slugs = (value as { openingElementSlugs?: unknown }).openingElementSlugs
  return Array.isArray(slugs)
    ? slugs.filter((slug): slug is string => typeof slug === 'string')
    : []
}
