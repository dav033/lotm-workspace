import React, { forwardRef } from 'react'
import { titleSizeClass } from '../domain/titleFit'
import { useBackgroundDrop } from './useBackgroundDrop'
import type { FontSizeOverrides } from '../domain/schema'
import { fontSizeCss } from './textStyle'

function colorWithAlpha(color: string, alpha: number) {
  const match = /^#([0-9a-f]{6})$/i.exec(color || '')
  if (!match) return color
  const value = Number.parseInt(match[1], 16)
  return `rgba(${value >> 16},${(value >> 8) & 255},${value & 255},${alpha})`
}

type CorruptionFileCardProps = {
  variant?: 'Warning' | 'Evidence' | 'Quote'; incident?: string; caseLabel?: string
  explanation?: string; reactionLabel?: string; reaction?: string; footerText?: string
  corruptionLevel?: 'Low' | 'Moderate' | 'Severe' | 'Catastrophic'; accentColor?: string
  image?: string | null; showIncidentNumber?: boolean; backgroundOpacity?: number
  fontSizes?: FontSizeOverrides
  onDropBackground?: (file: File) => void
}

const CorruptionFileCard = forwardRef<HTMLElement, CorruptionFileCardProps>(function CorruptionFileCard({
  variant = 'Warning', incident, caseLabel, explanation, reactionLabel, reaction,
  corruptionLevel = 'Severe', accentColor = '#d84a4a', image = null,
  showIncidentNumber = false, backgroundOpacity = 45, fontSizes, onDropBackground,
}, ref) {
  const { dragging, dropProps } = useBackgroundDrop(onDropBackground)
  const mode = variant
  const evidenceLayout = mode === 'Evidence' && (incident || '').length > 24 ? 'stacked' : 'columns'
  const incidentNumber = String((incident || 'UNKNOWN').length * 73).padStart(4, '0')
  const accent = /^#[0-9a-f]{6}$/i.test(accentColor || '') ? accentColor : '#d84a4a'
  const imageVisibility = Math.max(0, Math.min(100, backgroundOpacity)) / 100
  const veilOpacity = Number((0.92 - imageVisibility * 0.72).toFixed(3))
  const style = {
    '--corruption': accent, '--corruption-12': colorWithAlpha(accent, 0.12),
    '--corruption-25': colorWithAlpha(accent, 0.25), '--corruption-55': colorWithAlpha(accent, 0.55),
    '--background-opacity': imageVisibility, '--background-veil': veilOpacity,
  } as React.CSSProperties
  return (
    <article className={`ficha corruption-file-card corruption-file-${mode.toLowerCase()} corruption-evidence-${evidenceLayout}${dragging ? ' dragover' : ''}`} id="card" ref={ref} style={style} aria-label={`${incident || 'Corruption incident'} file`} {...dropProps}>
      {image && <div className="corruption-file-image" style={{ backgroundImage: `url("${image}")` }} aria-hidden="true" />}
      <div className="corruption-file-veil" aria-hidden="true" /><div className="corruption-file-grid" aria-hidden="true" />
      {showIncidentNumber && <div className="corruption-file-index" aria-hidden="true">{incidentNumber}</div>}<div className="corruption-file-tape" aria-hidden="true" />
      <div className="corruption-file-content">
        <header className="corruption-file-head"><div><span className="corruption-file-kicker" style={fontSizeCss(fontSizes, 'meta')}>LOTM context damage unit</span><strong style={fontSizeCss(fontSizes, 'meta')}>INCIDENT FILE{showIncidentNumber ? ` / ${incidentNumber}` : ''}</strong></div><span className="corruption-file-level" style={fontSizeCss(fontSizes, 'meta')}>{corruptionLevel} corruption</span></header>
        {mode === 'Warning' && <div className="corruption-warning-mark" aria-hidden="true">!</div>}{mode === 'Evidence' && <span className="corruption-evidence-tag" style={fontSizeCss(fontSizes, 'meta')}>MEME AUTOPSY / CONTEXT COMPROMISED</span>}{mode === 'Quote' && <span className="corruption-quote-mark" aria-hidden="true">“</span>}
        <main className="corruption-file-main"><h2 className={`corruption-file-title ${titleSizeClass(incident || 'Unknown incident')}`} style={fontSizeCss(fontSizes, 'title')}>{incident || 'Unknown incident'}</h2><div className="corruption-file-panels"><section className="corruption-file-panel corruption-file-explanation"><span style={fontSizeCss(fontSizes, 'label')}>{caseLabel || 'Normal explanation'}</span><p style={fontSizeCss(fontSizes, 'body')}>{explanation || 'A perfectly reasonable explanation should appear here.'}</p></section><section className="corruption-file-panel corruption-file-reaction"><span style={fontSizeCss(fontSizes, 'label')}>{reactionLabel || 'Fandom reaction'}</span><p style={fontSizeCss(fontSizes, 'body')}>{reaction || 'The reasonable response was immediately abandoned.'}</p></section></div></main>
      </div>
    </article>
  )
})

export default CorruptionFileCard
