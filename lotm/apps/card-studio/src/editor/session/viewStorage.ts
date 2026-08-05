const ACTIVE_PROJECT_KEY = 'lotm-card-studio:active-project'
const OPEN_PROJECTS_KEY = 'lotm-card-studio:open-projects'
const EDITING_CARD_KEY = 'lotm-card-studio:editing-card'

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Private browsing or blocked storage should not stop the editor.
  }
}

export function readActiveProjectId(): string | null {
  return read(ACTIVE_PROJECT_KEY)
}

export function readOpenProjectIds(): string[] {
  try {
    const value = JSON.parse(read(OPEN_PROJECTS_KEY) ?? '[]')
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}

export function readEditingCardId(): string | null {
  return read(EDITING_CARD_KEY)
}

export function saveViewSelection(activeProjectId: string | null, openProjectIds: string[]): void {
  if (activeProjectId) write(ACTIVE_PROJECT_KEY, activeProjectId)
  else {
    try { window.localStorage.removeItem(ACTIVE_PROJECT_KEY) } catch { /* ignore */ }
  }
  write(OPEN_PROJECTS_KEY, JSON.stringify(openProjectIds))
}

export function saveEditingCardId(cardId: string | null): void {
  if (cardId) write(EDITING_CARD_KEY, cardId)
  else {
    try { window.localStorage.removeItem(EDITING_CARD_KEY) } catch { /* ignore */ }
  }
}
