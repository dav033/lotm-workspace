import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LOTM Card Studio',
  description: 'LOTM TikTok card editor and renderer.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Space+Grotesk:wght@400;500;700&family=Playfair+Display:wght@700;900&family=Archivo:wght@400;500;600;800;900&family=JetBrains+Mono:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
