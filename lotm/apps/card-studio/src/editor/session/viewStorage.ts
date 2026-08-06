const ACTIVE_PROJECT_KEY = 'lotm-card-studio:active-project'
const OPEN_PROJECTS_KEY = 'lotm-card-studio:open-projects'
const EDITING_CARD_KEY = 'lotm-card-studio:editing-card'
const INSPECTOR_TAB_KEY = 'lotm-card-studio:inspector-tab'
const DOCK_OPEN_KEY = 'lotm-card-studio:dock-open'
const DOCK_TAB_KEY = 'lotm-card-studio:dock-tab'

export type InspectorTab = 'properties' | 'publish'
export type DockTab = 'cards' | 'images'

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

export function readInspectorTab(): InspectorTab {
  return read(INSPECTOR_TAB_KEY) === 'publish' ? 'publish' : 'properties'
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

export function saveInspectorTab(tab: InspectorTab): void {
  write(INSPECTOR_TAB_KEY, tab)
}

export function readDockOpen(): boolean {
  return read(DOCK_OPEN_KEY) === 'true'
}

export function saveDockOpen(open: boolean): void {
  write(DOCK_OPEN_KEY, String(open))
}

export function readDockTab(): DockTab {
  return read(DOCK_TAB_KEY) === 'images' ? 'images' : 'cards'
}

export function saveDockTab(tab: DockTab): void {
  write(DOCK_TAB_KEY, tab)
}
