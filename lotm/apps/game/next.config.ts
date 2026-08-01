import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Permite validar producción mientras `next dev` usa su propia carpeta.
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
}

export default nextConfig
