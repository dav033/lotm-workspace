import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // El juego y el editor comparten dominio; aislar los bundles evita que
  // /_next/* del editor caiga en el contenedor del juego.
  assetPrefix: '/cartas',
  // El estudio conserva sus módulos nativos fuera del bundle de Next.
  serverExternalPackages: ['better-sqlite3', 'ffmpeg-static', 'react-dom'],
  async rewrites() {
    return [
      {
        source: '/cartas/sequence-back/:path*',
        destination: '/sequence-back/:path*',
      },
      {
        source: '/cartas/pathway-back/:path*',
        destination: '/pathway-back/:path*',
      },
      {
        source: '/cartas/pathway-icons/:path*',
        destination: '/pathway-icons/:path*',
      },
    ]
  },
}

export default nextConfig
