const MAX_FRAME_SIDE = 1920

export function imageToPng(url: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      const scale = Math.min(1, MAX_FRAME_SIDE / Math.max(image.naturalWidth, image.naturalHeight))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
      canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error(`No se pudo convertir ${url}.`))),
        'image/png',
      )
    }
    image.onerror = () => reject(new Error(`No se pudo cargar ${url}.`))
    image.src = url
  })
}

export function filenameFromResponse(response: Response) {
  const match = /filename="([^"]+)"/.exec(response.headers.get('Content-Disposition') ?? '')
  return match?.[1] ?? null
}

export function fileSafe(label: string) {
  return label.replace(/[/\\:*?"<>|]+/g, '-').replace(/\.+$/, '').trim() || 'carta'
}

export function labelFor(state: Record<string, unknown>) {
  if (state.type === 'Cover') return `${state.coverTitle || 'cover'}_part${state.coverPartNum || ''}`.replace(/\s+/g, '_')
  if (state.type === 'Full Image Cover') return `full_cover_${state.fullCoverTitle || 'untitled'}`.replace(/\s+/g, '_')
  if (state.type === 'Tier') {
    return `tier_${state.tierRank || 'S'}_${state.tierPath || 'pathway'}${Number.isInteger(state.tierSeq) ? `_seq${state.tierSeq}` : ''}`.replace(/\s+/g, '_')
  }
  if (state.type === 'Tierlist') {
    return `tierlist_${state.tierlistRank || 'S'}_${state.tierlistTitle || 'untitled'}`.replace(/\s+/g, '_')
  }
  if (state.type === 'Pathway') {
    return `pathway_${state.pathwayCardPath || 'pathway'}${Number.isInteger(state.pathwayCardSeq) ? `_seq${state.pathwayCardSeq}` : ''}`.replace(/\s+/g, '_')
  }
  if (state.type === 'Tier Explanation') {
    return `tier_explanation_${state.tierRank || 'S'}${state.explanationPath ? `_${state.explanationPath}` : ''}`.replace(/\s+/g, '_')
  }
  if (state.type === 'General Explanation') {
    return `general_explanation_${state.generalExplanationTitle || 'untitled'}${state.explanationPath ? `_${state.explanationPath}` : ''}`.replace(/\s+/g, '_')
  }
  if (state.type === 'Simple Explanation') {
    return `simple_explanation_${String(state.simpleExplanationText || 'untitled').slice(0, 60)}`.replace(/\s+/g, '_')
  }
  if (state.type === 'Pathway Explanation') {
    return `pathway_explanation_${state.pathwayExplanationPath || 'pathway'}`.replace(/\s+/g, '_')
  }
  if (state.type === 'Breakdown') return `breakdown_${state.breakdownTitle || 'untitled'}`.replace(/\s+/g, '_')
  if (state.type === 'Map') return `map_${state.mapTitle || 'untitled'}`.replace(/\s+/g, '_')
  if (state.type === 'Tarot Member') {
    return `tarot_member_${state.tarotMemberTitle || 'arcana'}_${state.tarotMemberName || 'member'}`.replace(/\s+/g, '_')
  }
  if (state.type === 'Fraud File') return `fraud_file_${state.fraudName || 'untitled'}`.replace(/\s+/g, '_')
  if (state.type === 'Ritual Logic') {
    return `ritual_logic_${state.ritualPathway || 'pathway'}_seq${state.ritualSequence}_${state.ritualVariant || 'Chain'}`.replace(/\s+/g, '_')
  }
  if (state.type === 'Timeline') {
    return `timeline_${state.timelineStep}_${state.timelineTitle || 'untitled'}`.replace(/\s+/g, '_')
  }
  return `${state.name || 'card'}_seq${state.seq}`
}
