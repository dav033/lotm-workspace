/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client'

export default function EditorTopBar({
  projectName,
  editingIndex,
  cardCount,
  saving,
  sessionError,
  onStep,
  onOpenInspector,
}) {
  return (
    <header className="editor-topbar">
      <a className="skip-link" href="#main-content">Skip to editor</a>
      <div className="editor-topbar-project">
        <span className="editor-topbar-kicker">Project</span>
        <strong>{projectName || 'Card Studio'}</strong>
      </div>
      <div className="editor-topbar-nav" aria-label="Card navigation">
        <button className="nav" onClick={() => onStep(-1)} aria-label="Previous card">‹</button>
        <span className="pos">{editingIndex >= 0 ? editingIndex + 1 : '–'} / {cardCount}</span>
        <button className="nav" onClick={() => onStep(1)} aria-label="Next card">›</button>
      </div>
      <span
        className={'editor-topbar-save ' + (sessionError ? 'error' : saving ? 'saving' : 'saved')}
        title={sessionError ?? undefined}
      >
        {sessionError ?? (saving ? 'Saving…' : 'Saved')}
      </span>
      <button className="editor-topbar-inspector" type="button" onClick={onOpenInspector}>
        Inspector
      </button>
    </header>
  )
}
