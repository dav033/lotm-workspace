import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // El estudio conserva sus módulos nativos fuera del bundle de Next.
  serverExternalPackages: ['better-sqlite3', 'ffmpeg-static'],
}

export default nextConfig
