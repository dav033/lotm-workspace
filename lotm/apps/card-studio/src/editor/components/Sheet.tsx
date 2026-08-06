/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client'

import { useEffect, useRef, useState } from 'react'

const FOCUSABLE = 'button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href]'

export default function Sheet({ open, title, onClose, children }) {
  const overlayRef = useRef(null)
  const dialogRef = useRef(null)
  const dragStart = useRef(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!open) return undefined
    const dialog = dialogRef.current
    const stage = document.querySelector('.editor-main')
    const inspector = document.querySelector('.app > .inspector')
    const inertTargets = [stage, inspector].filter(Boolean)
    const previousFocus = document.activeElement

    inertTargets.forEach((target) => { target.inert = true })
    dialog?.querySelector(FOCUSABLE)?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        if (history.state?.lotmSheet) history.back()
        else onClose()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = [...dialog.querySelectorAll(FOCUSABLE)]
      if (!focusable.length) {
        event.preventDefault()
        dialog.focus()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    const onPopState = () => onClose()
    history.pushState({ ...(history.state ?? {}), lotmSheet: true }, '')
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('popstate', onPopState)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('popstate', onPopState)
      inertTargets.forEach((target) => { target.inert = false })
      if (previousFocus instanceof HTMLElement) previousFocus.focus()
    }
  }, [open, onClose])

  if (!open) return null

  const closeFromHistory = () => {
    if (history.state?.lotmSheet) history.back()
    else onClose()
  }

  const onPointerDown = (event) => {
    dragStart.current = event.clientY
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const onPointerUp = (event) => {
    if (dragStart.current === null) return
    const delta = event.clientY - dragStart.current
    dragStart.current = null
    if (delta > 60) closeFromHistory()
    else if (delta < -60) setExpanded(true)
  }

  return (
    <div className="sheet-overlay" ref={overlayRef} onMouseDown={(event) => {
      if (event.target === event.currentTarget) closeFromHistory()
    }}>
      <section
        className={'sheet' + (expanded ? ' expanded' : '')}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        tabIndex={-1}
        onFocusCapture={(event) => {
          if (event.target.matches?.('input,select,textarea')) {
            window.setTimeout(() => event.target.scrollIntoView({ block: 'center' }), 0)
          }
        }}
      >
        <button
          className="sheet-handle"
          type="button"
          aria-label={expanded ? 'Shrink sheet' : 'Expand sheet'}
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        />
        <div className="sheet-head">
          <h2 id="sheet-title">{title}</h2>
          <button type="button" className="sheet-close" onClick={closeFromHistory} aria-label="Close">×</button>
        </div>
        <div className="sheet-body">{children}</div>
      </section>
    </div>
  )
}
