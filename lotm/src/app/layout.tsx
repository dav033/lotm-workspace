import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import NavPrincipal from '@/components/NavPrincipal'
import { LanguageProvider, type AppLanguage } from '@/i18n/LanguageProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Archivo de Misterios',
  description:
    'Un juego de combinación y descubrimiento de ambientación victoriana y esotérica.',
}

// El contenido y el progreso viven en PostgreSQL; ninguna ruta del juego debe
// consultar la base durante `next build`.
export const dynamic = 'force-dynamic'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const savedLanguage = (await cookies()).get('am-language')?.value
  const language: AppLanguage = savedLanguage === 'en' ? 'en' : 'es'
  return (
    <html lang={language}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Cinzel: títulos · Cinzel Decorative: rótulos rituales · Inter: texto · Space Grotesk: cartas */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Cinzel+Decorative:wght@700;900&family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Space+Grotesk:wght@400;500;700&family=Playfair+Display:wght@700;900&family=Archivo:wght@400;500;600;800;900&family=JetBrains+Mono:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LanguageProvider initialLanguage={language}>
          <NavPrincipal />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
