import { parseMapEntries } from '../mapEntries'
import type { CardContent } from './content'

export type BuilderCardState = {
  type: 'Character' | 'Artifact' | 'Cover' | 'Full Image Cover' | 'Tier' | 'Pathway' | 'Tier Explanation' | 'General Explanation' | 'Pathway Explanation' | 'Breakdown' | 'Map' | 'Tarot Member'
  name: string
  path: string
  seq: number
  hasSecond: boolean
  path2: string
  seq2: number
  power: string
  grade: string
  mod: string
  dom: string
  image: string | null
  coverImage1: string | null
  coverImage2: string | null
  coverTitle: string
  coverPartNum: string
  fullCoverImage: string | null
  fullCoverTitle: string
  tierPath: string
  tierSeq: number | null
  tierRank: string
  tierText: string
  tierFooterText: string
  tierBackgroundImage: string | null
  pathwayCardPath: string
  pathwayCardSeq: number | null
  pathwayCardText: string
  pathwayCardFooterText: string
  pathwayCardBackgroundImage: string | null
  explanationPath: string | null
  tierExplanationText: string
  tierExplanationBackgroundImage: string | null
  generalExplanationTitle: string
  generalExplanationText: string
  generalExplanationBackgroundImage: string | null
  pathwayExplanationPath: string
  pathwayExplanationTitle: string
  pathwayExplanationText: string
  pathwayExplanationBackgroundImage: string | null
  breakdownKicker: string
  breakdownTitle: string
  breakdownDoes: string
  breakdownDoesNot: string
  breakdownEdgeLabel: string
  breakdownEdgeText: string
  breakdownBackgroundImage: string | null
  mapTitle: string
  mapEntriesText: string
  mapFooterText: string
  mapPathway: string | null
  mapBackgroundImage: string | null
  tarotMemberVariant: 'Portrait' | 'Dossier' | 'Contrast'
  tarotMemberName: string
  tarotMemberTitle: string
  tarotMemberDescription: string
  tarotMemberDetailLabel: string
  tarotMemberDetailText: string
  tarotMemberFooterText: string
  tarotMemberPathway: string | null
  tarotMemberImage: string | null
  backgroundOpacity: number
}

const DEFAULT_BUILDER_STATE: BuilderCardState = {
  type: 'Character',
  name: '',
  path: 'Fool',
  seq: 9,
  hasSecond: false,
  path2: 'Fool',
  seq2: 9,
  power: 'Human',
  grade: '5',
  mod: '',
  dom: 'None',
  image: null,
  coverImage1: null,
  coverImage2: null,
  coverTitle: '',
  coverPartNum: '1',
  fullCoverImage: null,
  fullCoverTitle: '',
  tierPath: 'Fool',
  tierSeq: null,
  tierRank: 'S',
  tierText: '',
  tierFooterText: '',
  tierBackgroundImage: null,
  pathwayCardPath: 'Fool',
  pathwayCardSeq: null,
  pathwayCardText: '',
  pathwayCardFooterText: '',
  pathwayCardBackgroundImage: null,
  explanationPath: null,
  tierExplanationText: '',
  tierExplanationBackgroundImage: null,
  generalExplanationTitle: '',
  generalExplanationText: '',
  generalExplanationBackgroundImage: null,
  pathwayExplanationPath: 'Fool',
  pathwayExplanationTitle: '',
  pathwayExplanationText: '',
  pathwayExplanationBackgroundImage: null,
  breakdownKicker: '',
  breakdownTitle: '',
  breakdownDoes: '',
  breakdownDoesNot: '',
  breakdownEdgeLabel: 'Edge',
  breakdownEdgeText: '',
  breakdownBackgroundImage: null,
  mapTitle: '',
  mapEntriesText: '',
  mapFooterText: '',
  mapPathway: null,
  mapBackgroundImage: null,
  tarotMemberVariant: 'Portrait',
  tarotMemberName: '',
  tarotMemberTitle: '',
  tarotMemberDescription: '',
  tarotMemberDetailLabel: 'Club function',
  tarotMemberDetailText: '',
  tarotMemberFooterText: '',
  tarotMemberPathway: null,
  tarotMemberImage: null,
  backgroundOpacity: 65,
}

export function toBuilderCardState(content: CardContent): BuilderCardState {
  const state = {
    ...DEFAULT_BUILDER_STATE,
    type: content.type,
    backgroundOpacity: 'backgroundOpacity' in content ? content.backgroundOpacity ?? 65 : 65,
  }

  if (content.type === 'Cover') {
    return {
      ...state,
      coverTitle: content.title,
      coverPartNum: content.partNumber,
      coverImage1: content.topImageUrl ?? null,
      coverImage2: content.mainImageUrl ?? null,
    }
  }

  if (content.type === 'Full Image Cover') {
    return {
      ...state,
      fullCoverTitle: content.title,
      fullCoverImage: content.imageUrl ?? null,
    }
  }

  if (content.type === 'Tier') {
    return {
      ...state,
      tierPath: content.pathway,
      tierSeq: content.sequence ?? null,
      tierRank: content.rank,
      tierText: content.points.join('\n'),
      tierFooterText: content.footerText ?? '',
      tierBackgroundImage: content.backgroundImageUrl ?? null,
    }
  }

  if (content.type === 'Pathway') {
    return {
      ...state,
      pathwayCardPath: content.pathway,
      pathwayCardSeq: content.sequence ?? null,
      pathwayCardText: content.points.join('\n'),
      pathwayCardFooterText: content.footerText ?? '',
      pathwayCardBackgroundImage: content.backgroundImageUrl ?? null,
    }
  }

  if (content.type === 'Tier Explanation') {
    return {
      ...state,
      tierRank: content.rank,
      tierExplanationText: content.description,
      tierExplanationBackgroundImage: content.backgroundImageUrl ?? null,
    }
  }

  if (content.type === 'General Explanation') {
    return {
      ...state,
      explanationPath: content.pathway ?? null,
      generalExplanationTitle: content.title,
      generalExplanationText: content.description,
      generalExplanationBackgroundImage: content.backgroundImageUrl ?? null,
    }
  }

  if (content.type === 'Pathway Explanation') {
    return {
      ...state,
      pathwayExplanationPath: content.pathway,
      pathwayExplanationTitle: content.title,
      pathwayExplanationText: content.description,
      pathwayExplanationBackgroundImage: content.backgroundImageUrl ?? null,
    }
  }

  if (content.type === 'Breakdown') {
    return {
      ...state,
      breakdownKicker: content.kicker ?? '',
      breakdownTitle: content.title,
      breakdownDoes: content.does,
      breakdownDoesNot: content.doesNot,
      breakdownEdgeLabel: content.edgeLabel,
      breakdownEdgeText: content.edgeText,
      breakdownBackgroundImage: content.backgroundImageUrl ?? null,
    }
  }

  if (content.type === 'Map') {
    return {
      ...state,
      mapTitle: content.title,
      mapEntriesText: content.entries
        .map(({ tags, value }) => (tags ? tags + ' -> ' + value : value))
        .join('\n'),
      mapFooterText: content.footerText ?? '',
      mapPathway: content.pathway ?? null,
      mapBackgroundImage: content.backgroundImageUrl ?? null,
    }
  }

  if (content.type === 'Tarot Member') {
    return {
      ...state,
      tarotMemberVariant: content.variant,
      tarotMemberName: content.name,
      tarotMemberTitle: content.tarotTitle,
      tarotMemberDescription: content.description,
      tarotMemberDetailLabel: content.detailLabel,
      tarotMemberDetailText: content.detailText,
      tarotMemberFooterText: content.footerText ?? '',
      tarotMemberPathway: content.pathway ?? null,
      tarotMemberImage: content.imageUrl ?? null,
    }
  }

  return {
    ...state,
    name: content.name,
    path: content.pathway,
    seq: content.sequence,
    hasSecond: Boolean(content.secondSequence),
    path2: content.secondSequence?.pathway ?? 'Fool',
    seq2: content.secondSequence?.sequence ?? 9,
    power: content.type === 'Character' ? content.power : 'Human',
    grade: content.type === 'Artifact' ? content.grade : '5',
    mod: content.modifier ?? '',
    dom: content.alterDomain ?? 'None',
    image: content.imageUrl ?? null,
  }
}

export function fromBuilderCardState(state: BuilderCardState): CardContent {
  if (state.type === 'Cover') {
    return {
      type: 'Cover',
      title: state.coverTitle.trim(),
      partNumber: state.coverPartNum.trim(),
      ...(state.coverImage1 ? { topImageUrl: state.coverImage1 } : {}),
      ...(state.coverImage2 ? { mainImageUrl: state.coverImage2 } : {}),
    }
  }
  if (state.type === 'Full Image Cover') {
    return {
      type: 'Full Image Cover',
      title: state.fullCoverTitle.trim(),
      ...(state.fullCoverImage ? { imageUrl: state.fullCoverImage } : {}),
    }
  }
  if (state.type === 'Tier') {
    return {
      type: 'Tier', pathway: state.tierPath, rank: state.tierRank as CardContent & { rank: string }['rank'],
      ...(state.tierSeq === null ? {} : { sequence: state.tierSeq }),
      points: state.tierText.split('\n').map((point) => point.trim()).filter(Boolean),
      ...(state.tierFooterText.trim() ? { footerText: state.tierFooterText.trim() } : {}),
      ...(state.tierBackgroundImage ? { backgroundImageUrl: state.tierBackgroundImage } : {}),
      backgroundOpacity: state.backgroundOpacity,
    }
  }
  if (state.type === 'Pathway') {
    return {
      type: 'Pathway', pathway: state.pathwayCardPath,
      ...(state.pathwayCardSeq === null ? {} : { sequence: state.pathwayCardSeq }),
      points: state.pathwayCardText.split('\n').map((point) => point.trim()).filter(Boolean),
      ...(state.pathwayCardFooterText.trim() ? { footerText: state.pathwayCardFooterText.trim() } : {}),
      ...(state.pathwayCardBackgroundImage ? { backgroundImageUrl: state.pathwayCardBackgroundImage } : {}),
      backgroundOpacity: state.backgroundOpacity,
    }
  }
  if (state.type === 'Tier Explanation') {
    return {
      type: 'Tier Explanation', rank: state.tierRank as CardContent & { rank: string }['rank'],
      description: state.tierExplanationText.trim(),
      ...(state.tierExplanationBackgroundImage ? { backgroundImageUrl: state.tierExplanationBackgroundImage } : {}),
      backgroundOpacity: state.backgroundOpacity,
    }
  }
  if (state.type === 'General Explanation') {
    return {
      type: 'General Explanation', title: state.generalExplanationTitle.trim(),
      description: state.generalExplanationText.trim(),
      ...(state.explanationPath ? { pathway: state.explanationPath } : {}),
      ...(state.generalExplanationBackgroundImage
        ? { backgroundImageUrl: state.generalExplanationBackgroundImage }
        : {}),
      backgroundOpacity: state.backgroundOpacity,
    }
  }
  if (state.type === 'Pathway Explanation') {
    return {
      type: 'Pathway Explanation',
      pathway: state.pathwayExplanationPath,
      title: state.pathwayExplanationTitle.trim(),
      description: state.pathwayExplanationText.trim(),
      ...(state.pathwayExplanationBackgroundImage
        ? { backgroundImageUrl: state.pathwayExplanationBackgroundImage }
        : {}),
      backgroundOpacity: state.backgroundOpacity,
    }
  }
  if (state.type === 'Breakdown') {
    return {
      type: 'Breakdown',
      ...(state.breakdownKicker.trim() ? { kicker: state.breakdownKicker.trim() } : {}),
      title: state.breakdownTitle.trim(),
      does: state.breakdownDoes.trim(),
      doesNot: state.breakdownDoesNot.trim(),
      edgeLabel: state.breakdownEdgeLabel.trim() || 'Edge',
      edgeText: state.breakdownEdgeText.trim(),
      ...(state.breakdownBackgroundImage ? { backgroundImageUrl: state.breakdownBackgroundImage } : {}),
      backgroundOpacity: state.backgroundOpacity,
    }
  }
  if (state.type === 'Map') {
    return {
      type: 'Map',
      title: state.mapTitle.trim(),
      entries: parseMapEntries(state.mapEntriesText),
      ...(state.mapFooterText.trim() ? { footerText: state.mapFooterText.trim() } : {}),
      ...(state.mapPathway ? { pathway: state.mapPathway } : {}),
      ...(state.mapBackgroundImage ? { backgroundImageUrl: state.mapBackgroundImage } : {}),
      backgroundOpacity: state.backgroundOpacity,
    }
  }
  if (state.type === 'Tarot Member') {
    return {
      type: 'Tarot Member',
      variant: state.tarotMemberVariant,
      name: state.tarotMemberName.trim(),
      tarotTitle: state.tarotMemberTitle.trim(),
      description: state.tarotMemberDescription.trim(),
      detailLabel: state.tarotMemberDetailLabel.trim() || 'Club function',
      detailText: state.tarotMemberDetailText.trim(),
      ...(state.tarotMemberFooterText.trim() ? { footerText: state.tarotMemberFooterText.trim() } : {}),
      ...(state.tarotMemberPathway ? { pathway: state.tarotMemberPathway } : {}),
      ...(state.tarotMemberImage ? { imageUrl: state.tarotMemberImage } : {}),
      backgroundOpacity: state.backgroundOpacity,
    }
  }
  const standard = {
    name: state.name.trim(),
    pathway: state.path,
    sequence: state.seq,
    ...(state.hasSecond ? { secondSequence: { pathway: state.path2, sequence: state.seq2 } } : {}),
    ...(state.mod.trim() ? { modifier: state.mod.trim() } : {}),
    ...(state.dom.trim() && state.dom !== 'None' ? { alterDomain: state.dom.trim() } : {}),
    ...(state.image ? { imageUrl: state.image } : {}),
  }
  if (state.type === 'Character') return { ...standard, type: 'Character', power: state.power }
  return { ...standard, type: 'Artifact', grade: state.grade as '0' | '1' | '2' | '3' | '4' | '5' }
}
