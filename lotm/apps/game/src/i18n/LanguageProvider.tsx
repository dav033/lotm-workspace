'use client'

import { createContext, useContext } from 'react'

export type AppLanguage = 'es' | 'en'

type LanguageContextValue = {
  language: AppLanguage
  text: (spanish: string, english: string) => string
  setLanguage: (language: AppLanguage) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({
  initialLanguage,
  children,
}: {
  initialLanguage: AppLanguage
  children: React.ReactNode
}) {
  const setLanguage = (language: AppLanguage) => {
    document.cookie = `am-language=${language}; path=/; max-age=31536000; samesite=lax`
    window.location.reload()
  }

  return (
    <LanguageContext.Provider
      value={{
        language: initialLanguage,
        text: (spanish, english) => (initialLanguage === 'en' ? english : spanish),
        setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useLanguage debe usarse dentro de LanguageProvider')
  return value
}

