import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PATHWAY_BACKGROUNDS } from '../../domain/pathwayBackgrounds'
import { SEQUENCE_BACKGROUNDS } from '../../domain/sequenceBackgrounds'
import { type BuilderCardState } from '../../domain/schema'
import { PATHWAY_ICONS } from '../../domain/pathwayIcons'
import { STYLE_FILES } from '../../cards-ui/styleFiles'
import { CARD_IMAGE_URL_PREFIX, isStoredCardImage, resolveCardImageFile } from '../images'

const MAX_IMAGE_BYTES = 15 * 1024 * 1024

export const FONT_STYLESHEET =
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Space+Grotesk:wght@400;500;700' +
  '&family=Playfair+Display:wght@700;900&family=Archivo:wght@400;500;600;800;900&family=JetBrains+Mono:wght@500;700&display=swap'

export const CARD_STUDIO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')

export type RenderAssets = {
  css: string
  defaultCover: string
  icons: Record<string, string>
}

export type RenderState = BuilderCardState & {
  generalExplanationBackground: string | null
  mapBackground: string | null
  tarotMemberResolvedImage: string | null
}

export async function createRenderAssets(projectRoot: string): Promise<RenderAssets> {
  const root = path.resolve(projectRoot)
  const publicDir = path.join(root, 'public')
  const css = (
    await Promise.all(
      STYLE_FILES.map((file) => fs.readFile(path.join(root, 'src', 'cards-ui', 'styles', file), 'utf8')),
    )
  ).join('\n')
  const iconEntries = await Promise.all(
    Object.entries(PATHWAY_ICONS as Record<string, string>).map(async ([name, source]) => [
      name,
      await resolveImageSource(source, publicDir),
    ] as const),
  )

  return {
    css,
    defaultCover: await resolveImageSource('/cover-default.jpg', publicDir),
    icons: Object.fromEntries(iconEntries),
  }
}

export async function resolveStateImages(
  state: BuilderCardState,
  publicDir: string,
  defaultCover: string,
): Promise<RenderState> {
  // La imagen propia manda; el arte del pathway es el respaldo, y sin pathway no
  // hay respaldo pero la propia se pinta igual.
  const generalExplanationSource = state.type === 'General Explanation'
    ? state.generalExplanationBackgroundImage
      ?? (state.generalExplanationSequence === null
        ? null
        : SEQUENCE_BACKGROUNDS[state.generalExplanationSequence] ?? null)
      ?? (state.explanationPath
        ? (PATHWAY_BACKGROUNDS as Record<string, string>)[state.explanationPath] ?? null
        : null)
    : null
  const pathwayExplanationSource = state.type === 'Pathway Explanation'
    ? state.pathwayExplanationBackgroundImage
      ?? (PATHWAY_BACKGROUNDS as Record<string, string>)[state.pathwayExplanationPath] ?? null
    : null
  // En un Map la imagen propia manda sobre la que aporta el pathway.
  const mapSource = state.type === 'Map'
    ? state.mapBackgroundImage
      ?? (state.mapPathway ? (PATHWAY_BACKGROUNDS as Record<string, string>)[state.mapPathway] ?? null : null)
    : null
  const tierBackgroundSource = state.tierBackgroundImage
    ?? (state.type === 'Tier'
      ? (PATHWAY_BACKGROUNDS as Record<string, string>)[state.tierPath] ?? null
      : null)
  const tierlistBackgroundSource = state.type === 'Tierlist'
    ? state.tierlistBackgroundImage
    : null
  const pathwayCardBackgroundSource = state.pathwayCardBackgroundImage
    ?? (state.type === 'Pathway'
      ? (PATHWAY_BACKGROUNDS as Record<string, string>)[state.pathwayCardPath] ?? null
      : null)
  const ritualBackgroundSource = state.type === 'Ritual Logic'
    ? state.ritualBackgroundImage
      ?? (PATHWAY_BACKGROUNDS as Record<string, string>)[state.ritualPathway] ?? null
    : null
  const timelineBackgroundSource = state.type === 'Timeline'
    ? state.timelineBackgroundImage
      ?? (state.timelinePathway
        ? (PATHWAY_BACKGROUNDS as Record<string, string>)[state.timelinePathway] ?? null
        : null)
    : null

  return {
    ...state,
    image: state.image ? await resolveImageSource(state.image, publicDir) : null,
    coverImage1: state.coverImage1
      ? await resolveImageSource(state.coverImage1, publicDir)
      : null,
    coverImage2: state.coverImage2
      ? await resolveImageSource(state.coverImage2, publicDir)
      : defaultCover,
    fullCoverImage: state.fullCoverImage
      ? await resolveImageSource(state.fullCoverImage, publicDir)
      : null,
    tierBackgroundImage: tierBackgroundSource
      ? await resolveImageSource(tierBackgroundSource, publicDir)
      : null,
    tierlistBackgroundImage: tierlistBackgroundSource
      ? await resolveImageSource(tierlistBackgroundSource, publicDir)
      : null,
    tierExplanationBackgroundImage: state.tierExplanationBackgroundImage
      ? await resolveImageSource(state.tierExplanationBackgroundImage, publicDir)
      : null,
    pathwayCardBackgroundImage: pathwayCardBackgroundSource
      ? await resolveImageSource(pathwayCardBackgroundSource, publicDir)
      : null,
    generalExplanationBackground: generalExplanationSource
      ? await resolveImageSource(generalExplanationSource, publicDir)
      : null,
    mapBackground: mapSource ? await resolveImageSource(mapSource, publicDir) : null,
    tarotMemberResolvedImage: state.tarotMemberImage
      ? await resolveImageSource(state.tarotMemberImage, publicDir)
      : state.type === 'Tarot Member' && state.tarotMemberPathway
        ? await resolveImageSource(
          (PATHWAY_BACKGROUNDS as Record<string, string>)[state.tarotMemberPathway],
          publicDir,
        )
        : null,
    corruptionImage: state.corruptionImage
      ? await resolveImageSource(state.corruptionImage, publicDir)
      : null,
    ritualBackgroundImage: ritualBackgroundSource
      ? await resolveImageSource(ritualBackgroundSource, publicDir)
      : null,
    timelineBackgroundImage: timelineBackgroundSource
      ? await resolveImageSource(timelineBackgroundSource, publicDir)
      : null,
    pathwayExplanationBackgroundImage: pathwayExplanationSource
      ? await resolveImageSource(pathwayExplanationSource, publicDir)
      : null,
    breakdownBackgroundImage: state.breakdownBackgroundImage
      ? await resolveImageSource(state.breakdownBackgroundImage, publicDir)
      : null,
  }
}

async function resolveImageSource(source: string, publicDir: string): Promise<string> {
  // Las imagenes subidas desde el editor viven junto a la base, no en /public.
  if (isStoredCardImage(source)) {
    // Stored image URLs may carry a cache-busting query string. Resolve only
    // the pathname so the query never becomes part of the filename.
    const pathname = new URL(source, 'http://cards.local').pathname
    const file = resolveCardImageFile(pathname.slice(CARD_IMAGE_URL_PREFIX.length))
    const buffer = await fs.readFile(file)
    if (buffer.byteLength > MAX_IMAGE_BYTES) throw new Error(`La imagen ${source} supera 15 MB.`)
    return `data:${mimeFor(file)};base64,${buffer.toString('base64')}`
  }

  if (/^https?:\/\//i.test(source)) {
    const response = await fetch(source, { signal: AbortSignal.timeout(15_000) })
    if (!response.ok) throw new Error(`No se pudo descargar la imagen ${source}: HTTP ${response.status}.`)
    const mime = response.headers.get('content-type')?.split(';')[0]
    if (!mime?.startsWith('image/')) throw new Error(`La URL ${source} no devolvio una imagen.`)
    const declaredSize = Number(response.headers.get('content-length') ?? 0)
    if (declaredSize > MAX_IMAGE_BYTES) throw new Error(`La imagen ${source} supera 15 MB.`)
    const buffer = Buffer.from(await response.arrayBuffer())
    if (buffer.byteLength > MAX_IMAGE_BYTES) throw new Error(`La imagen ${source} supera 15 MB.`)
    return `data:${mime};base64,${buffer.toString('base64')}`
  }

  const pathname = decodeURIComponent(new URL(source, 'http://cards.local').pathname)
  const publicPath = pathname.startsWith('/cartas/') ? pathname.slice('/cartas'.length) : pathname
  const file = path.resolve(publicDir, `.${publicPath}`)
  const root = `${path.resolve(publicDir)}${path.sep}`
  if (!file.startsWith(root)) throw new Error(`Ruta de imagen no permitida: ${source}`)
  const buffer = await fs.readFile(file)
  if (buffer.byteLength > MAX_IMAGE_BYTES) throw new Error(`La imagen ${source} supera 15 MB.`)
  return `data:${mimeFor(file)};base64,${buffer.toString('base64')}`
}

function mimeFor(file: string): string {
  const extension = path.extname(file).toLowerCase()
  if (extension === '.png') return 'image/png'
  if (extension === '.jpg' || extension === '.jpeg') return 'image/jpeg'
  if (extension === '.gif') return 'image/gif'
  if (extension === '.svg') return 'image/svg+xml'
  if (extension === '.avif') return 'image/avif'
  return 'image/webp'
}
