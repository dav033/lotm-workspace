import type { ElementPublicData } from '@/server/domain/tipos'
import type { PublicRitualState } from '@/server/domain/ritualKnowledge'
import type { AppLanguage } from './LanguageProvider'

export function localizedElement<T extends ElementPublicData>(
  element: T,
  language: AppLanguage,
): T {
  if (language !== 'en') return element
  return {
    ...element,
    // Los títulos de las Secuencias son nombres canónicos y se conservan.
    name: element.sequenceLabel ? element.name : element.nameEn?.trim() || element.name,
    description: element.descriptionEn?.trim() || element.description,
  }
}

export function browserLanguage(): AppLanguage {
  if (typeof document === 'undefined') return 'en'
  return document.cookie.split('; ').some((part) => part === 'am-language=es') ? 'es' : 'en'
}

export function localizedRitualState(
  state: PublicRitualState,
  language: AppLanguage,
): PublicRitualState {
  if (language !== 'en' || state.status !== 'UNLOCKED') return state
  return {
    ...state,
    groups: state.groups.map((group) => ({
      ...group,
      options: group.options.map((option) => ({
        ...option,
        optionLabel: option.optionLabelEn?.trim() || option.optionLabel,
        ingredients: option.ingredients.map((ingredient) => ({
          ...ingredient,
          name: ingredient.nameEn?.trim() || ingredient.name,
        })),
      })),
    })),
  }
}
