import 'server-only'

import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { resolveWorkspacePath } from './paths'

const TOKEN_ENDPOINT = 'https://open.tiktokapis.com/v2/oauth/token/'
const VIDEO_INIT_ENDPOINT = 'https://open.tiktokapis.com/v2/post/publish/inbox/video/init/'
const PHOTO_INIT_ENDPOINT = 'https://open.tiktokapis.com/v2/post/publish/content/init/'
const STATUS_ENDPOINT = 'https://open.tiktokapis.com/v2/post/publish/status/fetch/'
const USER_INFO_ENDPOINT = 'https://open.tiktokapis.com/v2/user/info/?fields=display_name,avatar_url'
const REQUIRED_SCOPE = 'video.upload'
const TOKEN_FILE_VERSION = 1
const MAX_VIDEO_BYTES = 500 * 1024 * 1024
const MIN_CHUNK_BYTES = 5 * 1024 * 1024
const MAX_CHUNK_BYTES = 64 * 1024 * 1024
const MAX_VIDEO_CHUNKS = 1_000
const ALLOWED_VIDEO_TYPES = new Set(['video/mp4', 'video/quicktime', 'video/webm'])

export const TIKTOK_STATE_COOKIE = 'lotm_tiktok_oauth_state'

export type TikTokConfig = {
  clientKey: string
  clientSecret: string
  redirectUri: string
}

export type TikTokConnection = {
  openId: string
  displayName: string | null
  avatarUrl: string | null
  accessToken: string
  refreshToken: string
  accessTokenExpiresAt: number
  refreshTokenExpiresAt: number | null
  scopes: string[]
  updatedAt: string
}

export type TikTokConnectionView = {
  configured: boolean
  connected: boolean
  openId: string | null
  displayName: string | null
  avatarUrl: string | null
  scopes: string[]
  accessTokenExpiresAt: number | null
}

type SealedValue = {
  iv: string
  tag: string
  value: string
}

type StoredConnection = {
  version: number
  openId: string
  displayName: string | null
  avatarUrl: string | null
  accessToken: SealedValue
  refreshToken: SealedValue
  accessTokenExpiresAt: number
  refreshTokenExpiresAt: number | null
  scopes: string[]
  updatedAt: string
}

export function getTikTokConfig(): TikTokConfig {
  const clientKey = process.env.TIKTOK_CLIENT_KEY?.trim()
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET?.trim()
  const redirectUri = process.env.TIKTOK_REDIRECT_URI?.trim()
  if (!clientKey || !clientSecret || !redirectUri) {
    throw new Error('TikTok is not configured. Set TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET and TIKTOK_REDIRECT_URI.')
  }

  const parsed = new URL(redirectUri)
  if (parsed.protocol !== 'https:' && parsed.hostname !== 'localhost') {
    throw new Error('TIKTOK_REDIRECT_URI must use HTTPS outside localhost.')
  }
  if (parsed.hash || parsed.search) throw new Error('TIKTOK_REDIRECT_URI must not contain query or hash parameters.')
  return { clientKey, clientSecret, redirectUri }
}

export function createOAuthState(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function oauthStateCookieOptions(maxAge = 600) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  }
}

export async function getTikTokConnection(): Promise<TikTokConnection | null> {
  const stored = await readStoredConnection()
  if (!stored) return null
  if (stored.version !== TOKEN_FILE_VERSION) throw new Error('Unsupported TikTok connection file version.')
  return {
    openId: stored.openId,
    displayName: stored.displayName,
    avatarUrl: stored.avatarUrl,
    accessToken: open(stored.accessToken),
    refreshToken: open(stored.refreshToken),
    accessTokenExpiresAt: stored.accessTokenExpiresAt,
    refreshTokenExpiresAt: stored.refreshTokenExpiresAt,
    scopes: stored.scopes,
    updatedAt: stored.updatedAt,
  }
}

export function toTikTokConnectionView(
  connection: TikTokConnection | null,
  configured = true,
): TikTokConnectionView {
  return {
    configured,
    connected: Boolean(connection),
    openId: connection?.openId ?? null,
    displayName: connection?.displayName ?? null,
    avatarUrl: connection?.avatarUrl ?? null,
    scopes: connection?.scopes ?? [],
    accessTokenExpiresAt: connection?.accessTokenExpiresAt ?? null,
  }
}

export async function saveTikTokConnection(connection: TikTokConnection): Promise<void> {
  const stored: StoredConnection = {
    version: TOKEN_FILE_VERSION,
    openId: connection.openId,
    displayName: connection.displayName,
    avatarUrl: connection.avatarUrl,
    accessToken: seal(connection.accessToken),
    refreshToken: seal(connection.refreshToken),
    accessTokenExpiresAt: connection.accessTokenExpiresAt,
    refreshTokenExpiresAt: connection.refreshTokenExpiresAt,
    scopes: connection.scopes,
    updatedAt: connection.updatedAt,
  }
  const file = resolveConnectionPath()
  await fs.mkdir(path.dirname(file), { recursive: true })
  const temporary = `${file}.${crypto.randomUUID()}.tmp`
  await fs.writeFile(temporary, JSON.stringify(stored, null, 2), { encoding: 'utf8', mode: 0o600 })
  await fs.rename(temporary, file)
}

export async function disconnectTikTok(): Promise<void> {
  try {
    await fs.unlink(resolveConnectionPath())
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
  }
}

export async function exchangeTikTokCode(code: string): Promise<TikTokConnection> {
  const config = getTikTokConfig()
  const body = new URLSearchParams({
    client_key: config.clientKey,
    client_secret: config.clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: config.redirectUri,
  })
  const data = await fetchTikTokJson(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  const scopes = parseScopes(data.scope)
  if (!scopes.includes(REQUIRED_SCOPE)) throw new Error('TikTok account did not grant video.upload.')
  if (!data.access_token || !data.refresh_token || !data.open_id) throw new Error('TikTok token response is incomplete.')

  let displayName: string | null = null
  let avatarUrl: string | null = null
  try {
    const profile = await fetchTikTokJson(USER_INFO_ENDPOINT, {
      headers: { Authorization: `Bearer ${data.access_token}` },
    })
    displayName = typeof profile.data?.user?.display_name === 'string' ? profile.data.user.display_name : null
    avatarUrl = typeof profile.data?.user?.avatar_url === 'string' ? profile.data.user.avatar_url : null
  } catch {
    // Basic profile data is optional for Upload API; open_id still identifies connection.
  }

  const connection: TikTokConnection = {
    openId: String(data.open_id),
    displayName,
    avatarUrl,
    accessToken: String(data.access_token),
    refreshToken: String(data.refresh_token),
    accessTokenExpiresAt: Date.now() + numberValue(data.expires_in, 0) * 1_000,
    refreshTokenExpiresAt: data.refresh_expires_in == null
      ? null
      : Date.now() + numberValue(data.refresh_expires_in, 0) * 1_000,
    scopes,
    updatedAt: new Date().toISOString(),
  }
  await saveTikTokConnection(connection)
  return connection
}

export async function getValidTikTokAccessToken(): Promise<string> {
  const connection = await getTikTokConnection()
  if (!connection) throw new Error('TikTok is not connected.')
  if (connection.accessTokenExpiresAt > Date.now() + 60_000) return connection.accessToken
  if (connection.refreshTokenExpiresAt !== null && connection.refreshTokenExpiresAt <= Date.now()) {
    throw new Error('TikTok refresh token expired. Reconnect TikTok.')
  }

  const config = getTikTokConfig()
  const data = await fetchTikTokJson(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_key: config.clientKey,
      client_secret: config.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: connection.refreshToken,
    }),
  })
  if (!data.access_token) throw new Error('TikTok refresh response is incomplete. Reconnect TikTok.')
  await saveTikTokConnection({
    ...connection,
    accessToken: String(data.access_token),
    refreshToken: typeof data.refresh_token === 'string' ? data.refresh_token : connection.refreshToken,
    accessTokenExpiresAt: Date.now() + numberValue(data.expires_in, 0) * 1_000,
    refreshTokenExpiresAt: data.refresh_expires_in == null
      ? connection.refreshTokenExpiresAt
      : Date.now() + numberValue(data.refresh_expires_in, 0) * 1_000,
    scopes: parseScopes(data.scope).length ? parseScopes(data.scope) : connection.scopes,
    updatedAt: new Date().toISOString(),
  })
  return String(data.access_token)
}

export async function uploadTikTokVideo(file: File): Promise<{ publishId: string; chunks: number }> {
  if (!ALLOWED_VIDEO_TYPES.has(file.type)) throw new Error('Only MP4, QuickTime and WebM videos are supported.')
  if (!file.size) throw new Error('Video file is empty.')
  if (file.size > MAX_VIDEO_BYTES) throw new Error('Video exceeds the 500 MB upload limit.')

  const chunkSize = file.size < MIN_CHUNK_BYTES ? file.size : Math.min(MAX_CHUNK_BYTES, file.size)
  const totalChunks = Math.ceil(file.size / chunkSize)
  if (totalChunks < 1 || totalChunks > MAX_VIDEO_CHUNKS) throw new Error('Video has too many chunks.')
  const accessToken = await getValidTikTokAccessToken()
  const init = await fetchTikTokJson(VIDEO_INIT_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      source_info: {
        source: 'FILE_UPLOAD',
        video_size: file.size,
        chunk_size: chunkSize,
        total_chunk_count: totalChunks,
      },
    }),
  })
  const publishId = String(init.data?.publish_id ?? '')
  const uploadUrl = typeof init.data?.upload_url === 'string' ? init.data.upload_url : ''
  if (!publishId || !uploadUrl) throw new Error('TikTok did not return an upload URL.')

  const bytes = new Uint8Array(await file.arrayBuffer())
  for (let start = 0; start < file.size; start += chunkSize) {
    const end = Math.min(start + chunkSize, file.size)
    const chunk = bytes.subarray(start, end)
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
        'Content-Length': String(chunk.byteLength),
        'Content-Range': `bytes ${start}-${end - 1}/${file.size}`,
      },
      body: chunk as unknown as BodyInit,
    })
    if (![200, 201, 206].includes(response.status)) {
      throw new Error(`TikTok media upload failed with HTTP ${response.status}.`)
    }
  }
  return { publishId, chunks: totalChunks }
}

export async function uploadTikTokCarousel(input: {
  title?: string
  description?: string
  photoUrls: string[]
  coverIndex?: number
}): Promise<{ publishId: string }> {
  if (!Array.isArray(input.photoUrls) || input.photoUrls.length < 1 || input.photoUrls.length > 35) {
    throw new Error('Carousel must contain between 1 and 35 image URLs.')
  }
  const photoUrls = input.photoUrls.map((value) => {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Image URLs must be public HTTPS URLs.')
    return url.toString()
  })
  const coverIndex = input.coverIndex ?? 0
  if (!Number.isInteger(coverIndex) || coverIndex < 0 || coverIndex >= photoUrls.length) {
    throw new Error('Carousel cover index is invalid.')
  }
  const title = input.title?.trim() ?? ''
  const description = input.description?.trim() ?? ''
  if (title.length > 90) throw new Error('Photo title cannot exceed 90 characters.')
  if (description.length > 4_000) throw new Error('Photo description cannot exceed 4,000 characters.')

  const accessToken = await getValidTikTokAccessToken()
  const data = await fetchTikTokJson(PHOTO_INIT_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      post_mode: 'MEDIA_UPLOAD',
      media_type: 'PHOTO',
      post_info: { title, description },
      source_info: {
        source: 'PULL_FROM_URL',
        photo_images: photoUrls,
        photo_cover_index: coverIndex,
      },
    }),
  })
  const publishId = String(data.data?.publish_id ?? '')
  if (!publishId) throw new Error('TikTok did not return a carousel publish ID.')
  return { publishId }
}

export async function fetchTikTokStatus(publishId: string): Promise<unknown> {
  if (!publishId || publishId.length > 64) throw new Error('Publish ID is invalid.')
  const accessToken = await getValidTikTokAccessToken()
  return fetchTikTokJson(STATUS_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ publish_id: publishId }),
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchTikTokJson(url: string, init?: RequestInit): Promise<any> {
  const response = await fetch(url, { ...init, cache: 'no-store' })
  const data = await response.json().catch(() => null)
  if (!response.ok || data?.error?.code && data.error.code !== 'ok') {
    const code = typeof data?.error?.code === 'string' ? data.error.code : `http_${response.status}`
    throw new Error(`TikTok API error: ${code}.`)
  }
  return data
}

async function readStoredConnection(): Promise<StoredConnection | null> {
  try {
    return JSON.parse(await fs.readFile(resolveConnectionPath(), 'utf8')) as StoredConnection
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
    throw error
  }
}

function resolveConnectionPath(): string {
  return resolveWorkspacePath(process.env.TIKTOK_CONNECTION_PATH, 'data/tiktok-connection.json')
}

function encryptionKey(): Buffer {
  const secret = process.env.TIKTOK_TOKEN_ENCRYPTION_KEY?.trim()
  if (!secret || secret.length < 32) throw new Error('TIKTOK_TOKEN_ENCRYPTION_KEY must contain at least 32 characters.')
  return crypto.createHash('sha256').update(secret).digest()
}

function seal(value: string): SealedValue {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey(), iv)
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
  return {
    iv: iv.toString('base64url'),
    tag: cipher.getAuthTag().toString('base64url'),
    value: encrypted.toString('base64url'),
  }
}

function open(value: SealedValue): string {
  const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey(), Buffer.from(value.iv, 'base64url'))
  decipher.setAuthTag(Buffer.from(value.tag, 'base64url'))
  return Buffer.concat([decipher.update(Buffer.from(value.value, 'base64url')), decipher.final()]).toString('utf8')
}

function parseScopes(value: unknown): string[] {
  return typeof value === 'string' ? value.split(/[ ,]+/).map((scope) => scope.trim()).filter(Boolean) : []
}

function numberValue(value: unknown, fallback: number): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}
