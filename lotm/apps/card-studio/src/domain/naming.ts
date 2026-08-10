import type { CardContent } from './schema/content'
import { slugify } from './slug'

export function titleForCard(content: CardContent): string {
  if (content.type === 'Ritual Logic') {
    const base = `${content.pathway} Sequence ${content.sequence} — ${content.sequenceName}`
    return base
  }
  if (content.type === 'Timeline') {
    const position = content.step + '/' + content.total
    return content.era ? content.title + ' (' + content.era + ') - ' + position : content.title + ' - ' + position
  }
  if (content.type === 'Corruption File') return `Corruption File: ${content.incident}`
  if (content.type === 'Cover') return content.title + ' - Part ' + content.partNumber
  if (content.type === 'Full Image Cover') return content.title
  if (content.type === 'Tier') {
    return content.pathway + (content.sequence === undefined ? '' : ' Sequence ' + content.sequence) + ' - Tier ' + content.rank
  }
  if (content.type === 'Tierlist') return content.title + ' - Tier ' + content.rank
  if (content.type === 'Pathway') {
    return content.pathway + (content.sequence === undefined ? '' : ' Sequence ' + content.sequence) + ' - Pathway'
  }
  if (content.type === 'Tier Explanation') {
    return 'Tier ' + content.rank + ' Explanation'
  }
  if (content.type === 'General Explanation') {
    return content.pathway ? content.title + ' - ' + content.pathway : content.title
  }
  if (content.type === 'Simple Explanation') {
    return content.text.replace(/\s+/g, ' ').trim().slice(0, 80) || 'Simple Explanation'
  }
  if (content.type === 'Pathway Explanation') {
    return content.pathway + ' - ' + content.title.replace(/\*/g, '')
  }
  if (content.type === 'Breakdown') {
    return content.kicker ? content.kicker + ': ' + content.title : content.title
  }
  if (content.type === 'Map') {
    return content.title
  }
  if (content.type === 'Tarot Member') return content.tarotTitle + ': ' + content.name
  return content.name
}

function tierRankSlug(rank: string): string {
  return rank.toLowerCase().replace(/-/g, '-minus').replace(/\+/g, '-plus')
}

export function filenameForCard(content: CardContent): string {
  if (content.type === 'Ritual Logic') {
    const suffix = content.variant === 'Chain' ? '' : `_${slugify(content.variant)}`
    return `ritual-logic_${slugify(content.pathway)}_seq${content.sequence}${suffix}`
  }
  if (content.type === 'Timeline') {
    return 'timeline_' + String(content.step).padStart(2, '0') + '_' + slugify(content.title)
  }
  if (content.type === 'Corruption File') return `corruption-file_${slugify(content.incident)}`
  if (content.type === 'Cover') return slugify(content.title) + '_part-' + slugify(content.partNumber)
  if (content.type === 'Full Image Cover') return 'full-cover_' + slugify(content.title)
  if (content.type === 'Tier') {
    const base = 'tier-' + tierRankSlug(content.rank) + '_' + slugify(content.pathway)
    return content.sequence === undefined ? base : base + '_seq-' + content.sequence
  }
  if (content.type === 'Tierlist') return 'tierlist-' + tierRankSlug(content.rank) + '_' + slugify(content.title)
  if (content.type === 'Pathway') {
    const base = 'pathway_' + slugify(content.pathway)
    return content.sequence === undefined ? base : base + '_seq-' + content.sequence
  }
  if (content.type === 'Tier Explanation') {
    return 'tier-explanation-' + tierRankSlug(content.rank)
  }
  if (content.type === 'General Explanation') {
    const base = 'general-explanation_' + slugify(content.title)
    return content.pathway ? base + '_' + slugify(content.pathway) : base
  }
  if (content.type === 'Simple Explanation') {
    return 'simple-explanation_' + (slugify(content.text).slice(0, 80) || 'untitled')
  }
  if (content.type === 'Pathway Explanation') {
    return 'pathway-explanation_' + slugify(content.pathway)
  }
  if (content.type === 'Breakdown') {
    return 'breakdown_' + slugify(content.title)
  }
  if (content.type === 'Map') {
    return 'map_' + slugify(content.title)
  }
  if (content.type === 'Tarot Member') {
    return 'tarot-member_' + slugify(content.tarotTitle) + '_' + slugify(content.name)
  }
  return slugify(content.name) + '_seq-' + content.sequence
}
