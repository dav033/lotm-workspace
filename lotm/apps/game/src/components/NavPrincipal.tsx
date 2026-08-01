'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookMarked, KeyRound, Layers, Trophy, WandSparkles } from 'lucide-react'
import { useLanguage } from '@/i18n/LanguageProvider'

const ENLACES = [
  { href: '/', label: ['Juego', 'Game'], icon: WandSparkles, exact: true },
  { href: '/coleccion', label: ['Colección', 'Collection'], icon: BookMarked, exact: false },
  { href: '/logros', label: ['Logros', 'Achievements'], icon: Trophy, exact: false },
  { href: process.env.NEXT_PUBLIC_CARDS_URL ?? '/cartas', label: ['Cartas', 'Cards'], icon: Layers, exact: false },
  { href: '/admin', label: ['Archivista', 'Archivist'], icon: KeyRound, exact: false },
]

// Barra de navegación global: presente en todas las páginas para saltar entre
// el juego, la colección, el generador de cartas y el panel de administración.
export default function NavPrincipal() {
  const pathname = usePathname()
  const { language, setLanguage, text } = useLanguage()

  return (
    <nav
      aria-label={text('Navegación principal', 'Main navigation')}
      className="border-b border-line bg-ink"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-2">
        <Link
          href="/"
          className="mr-2 shrink-0 font-[family-name:var(--font-display)] text-sm font-bold tracking-wide text-brass hover:brightness-110"
        >
          ✦ {text('Archivo de Misterios', 'Archive of Mysteries')}
        </Link>
        <div className="ml-auto flex items-center gap-1">
          {ENLACES.map(({ href, label, icon: Icon, exact }) => {
            const activo = exact ? pathname === href : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                aria-current={activo ? 'page' : undefined}
                className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition active:scale-[0.97] ${
                  activo
                    ? 'bg-panel2 text-brass'
                    : 'text-fog hover:bg-panel hover:text-parchment'
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {language === 'en' ? label[1] : label[0]}
              </Link>
            )
          })}
          <div className="ml-2 flex rounded-md border border-line2 p-0.5" aria-label={text('Idioma', 'Language')}>
            {(['es', 'en'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setLanguage(option)}
                aria-pressed={language === option}
                className={`rounded px-2 py-1 text-xs uppercase ${language === option ? 'bg-panel2 text-brass' : 'text-fog hover:text-parchment'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
