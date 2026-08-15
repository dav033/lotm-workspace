import { parseMapEntries } from '../mapEntries'
import type { CardContent } from './content'
import { DEFAULT_MAP_TEXT_STYLES, type MapTextStyles } from './textStyles'
import type { FontSizeOverrides } from './fontSizes'

export type BuilderCardState = {
  type: 'Character' | 'Artifact' | 'Cover' | 'Full Image Cover' | 'Tier' | 'Tierlist' | 'Pathway' | 'Tier Explanation' | 'General Explanation' | 'Simple Explanation' | 'Pathway Explanation' | 'Breakdown' | 'Map' | 'Tarot Member' | 'Dossier' | 'Corruption File' | 'Ritual Logic' | 'Timeline'
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
  pairId: string | null
  pairRole: 'subject' | 'explanation' | null
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
  tierlistTitle: string
  tierlistRank: string
  tierlistText: string
  tierlistFooterText: string
  tierlistBackgroundImage: string | null
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
  generalExplanationSequence: number | null
  generalExplanationBackgroundImage: string | null
  simpleExplanationText: string
  simpleExplanationMinFontSize: number
  simpleExplanationMaxFontSize: number
  simpleExplanationPosition: 'top' | 'center' | 'bottom'
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
  mapTextStyles: MapTextStyles
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
  tarotMemberAccentColor: string | null
  tarotMemberImage: string | null
  dossierName: string
  dossierHeadline: string
  dossierEvidence: string
  dossierCounterpoint: string
  dossierTakeaway: string
  dossierSourceLabel: string
  dossierBackgroundImage: string | null
  corruptionVariant: 'Warning' | 'Evidence' | 'Quote'
  corruptionIncident: string
  corruptionCaseLabel: string
  corruptionExplanation: string
  corruptionReactionLabel: string
  corruptionReaction: string
  corruptionFooterText: string
  corruptionLevel: 'Low' | 'Moderate' | 'Severe' | 'Catastrophic'
  corruptionShowIncidentNumber: boolean
  corruptionAccentColor: string | null
  corruptionImage: string | null
  ritualPathway: string
  ritualSequence: number
  ritualVariant: 'Chain' | 'Split' | 'Casefile' | 'Pressure' | 'Timeline'
  ritualSequenceName: string
  ritualText: string
  ritualSurvival: string
  ritualPreparation: string
  ritualCertainty: 'Canon' | 'Mixed' | 'Theory'
  ritualUncertainty: string
  ritualFooterText: string
  ritualBackgroundImage: string | null
  timelineVariant: 'Open' | 'Beat' | 'Turn' | 'Arc'
  timelinePathway: string | null
  timelineEra: string
  timelineKicker: string
  timelineTitle: string
  timelineText: string
  timelineStep: number
  timelineTotal: number
  timelineCertainty: 'Canon' | 'Mixed' | 'Secondary' | 'Reconstruction'
  timelineNote: string
  timelineMovesText: string
  timelineGhost: string
  timelineFooterText: string
  timelineBackgroundImage: string | null
  fontSizes: FontSizeOverrides
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
  pairId: null,
  pairRole: null,
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
  tierlistTitle: '',
  tierlistRank: 'S',
  tierlistText: '',
  tierlistFooterText: '',
  tierlistBackgroundImage: null,
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
  generalExplanationSequence: null,
  generalExplanationBackgroundImage: null,
  simpleExplanationText: '',
  simpleExplanationMinFontSize: 14,
  simpleExplanationMaxFontSize: 28,
  simpleExplanationPosition: 'center',
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
  mapTextStyles: DEFAULT_MAP_TEXT_STYLES,
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
  tarotMemberAccentColor: null,
  tarotMemberImage: null,
  dossierName: '',
  dossierHeadline: '',
  dossierEvidence: '',
  dossierCounterpoint: '',
  dossierTakeaway: '',
  dossierSourceLabel: 'Source note',
  dossierBackgroundImage: null,
  corruptionVariant: 'Warning',
  corruptionIncident: '',
  corruptionCaseLabel: 'Normal explanation',
  corruptionExplanation: '',
  corruptionReactionLabel: 'Fandom reaction',
  corruptionReaction: '',
  corruptionFooterText: '',
  corruptionLevel: 'Severe',
  corruptionShowIncidentNumber: false,
  corruptionAccentColor: null,
  corruptionImage: null,
  ritualPathway: 'Fool',
  ritualSequence: 5,
  ritualVariant: 'Chain',
  ritualSequenceName: '',
  ritualText: '',
  ritualSurvival: '',
  ritualPreparation: '',
  ritualCertainty: 'Mixed',
  ritualUncertainty: '',
  ritualFooterText: '',
  ritualBackgroundImage: null,
  timelineVariant: 'Beat',
  timelinePathway: null,
  timelineEra: '',
  timelineKicker: '',
  timelineTitle: '',
  timelineText: '',
  timelineStep: 1,
  timelineTotal: 11,
  timelineCertainty: 'Canon',
  timelineNote: '',
  timelineMovesText: '',
  timelineGhost: '',
  timelineFooterText: '',
  timelineBackgroundImage: null,
  fontSizes: {},
  backgroundOpacity: 65,
}

export function toBuilderCardState(content: CardContent): BuilderCardState {
  const state = {
    ...DEFAULT_BUILDER_STATE,
    type: content.type,
    fontSizes: 'fontSizes' in content ? content.fontSizes ?? {} : {},
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

  if (content.type === 'Tierlist') {
    return {
      ...state,
      tierlistTitle: content.title,
      tierlistRank: content.rank,
      tierlistText: content.points.join('\n'),
      tierlistFooterText: content.footerText ?? '',
      tierlistBackgroundImage: content.backgroundImageUrl ?? null,
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
      generalExplanationSequence: content.sequence ?? null,
      generalExplanationBackgroundImage: content.backgroundImageUrl ?? null,
      pairId: content.pairId ?? null,
      pairRole: content.pairRole ?? null,
    }
  }

  if (content.type === 'Simple Explanation') {
    return {
      ...state,
      simpleExplanationText: content.text,
      simpleExplanationMinFontSize: content.fontSizeMin,
      simpleExplanationMaxFontSize: content.fontSizeMax,
      simpleExplanationPosition: content.position,
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
      mapTextStyles: content.textStyles ?? DEFAULT_MAP_TEXT_STYLES,
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
      tarotMemberAccentColor: content.accentColor ?? null,
      tarotMemberImage: content.imageUrl ?? null,
    }
  }

  if (content.type === 'Dossier') {
    return {
      ...state,
      dossierName: content.name,
      dossierHeadline: content.headline,
      dossierEvidence: content.evidence,
      dossierCounterpoint: content.counterpoint,
      dossierTakeaway: content.takeaway,
      dossierSourceLabel: content.sourceLabel,
      dossierBackgroundImage: content.backgroundImageUrl ?? null,
    }
  }

  if (content.type === 'Corruption File') {
    return {
      ...state,
      corruptionVariant: content.variant,
      corruptionIncident: content.incident,
      corruptionCaseLabel: content.caseLabel,
      corruptionExplanation: content.explanation,
      corruptionReactionLabel: content.reactionLabel,
      corruptionReaction: content.reaction,
      corruptionFooterText: content.footerText ?? '',
      corruptionLevel: content.corruptionLevel,
      corruptionShowIncidentNumber: content.showIncidentNumber,
      corruptionAccentColor: content.accentColor ?? null,
      corruptionImage: content.imageUrl ?? null,
    }
  }

  if (content.type === 'Ritual Logic') {
    return {
      ...state,
      ritualPathway: content.pathway,
      ritualSequence: content.sequence,
      ritualVariant: content.variant,
      ritualSequenceName: content.sequenceName,
      ritualText: content.ritual,
      ritualSurvival: content.survival,
      ritualPreparation: content.preparation,
      ritualCertainty: content.certainty,
      ritualUncertainty: content.uncertainty ?? '',
      ritualFooterText: content.footerText ?? '',
      ritualBackgroundImage: content.backgroundImageUrl ?? null,
    }
  }

  if (content.type === 'Timeline') {
    return {
      ...state,
      timelineVariant: content.variant,
      timelinePathway: content.pathway ?? null,
      timelineEra: content.era ?? '',
      timelineKicker: content.kicker ?? '',
      timelineTitle: content.title,
      timelineText: content.text ?? '',
      timelineStep: content.step,
      timelineTotal: content.total,
      timelineCertainty: content.certainty,
      timelineNote: content.note ?? '',
      timelineMovesText: content.moves.join('\n'),
      timelineGhost: content.ghost ?? '',
      timelineFooterText: content.footerText ?? '',
      timelineBackgroundImage: content.backgroundImageUrl ?? null,
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
    pairId: content.pairId ?? null,
    pairRole: content.pairRole ?? null,
  }
}

function fromBuilderCardStateBase(state: BuilderCardState): CardContent {
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
  if (state.type === 'Tierlist') {
    return {
      type: 'Tierlist',
      title: state.tierlistTitle.trim(),
      rank: state.tierlistRank as CardContent & { rank: string }['rank'],
      points: state.tierlistText.split('\n').map((point) => point.trim()).filter(Boolean),
      ...(state.tierlistFooterText.trim() ? { footerText: state.tierlistFooterText.trim() } : {}),
      ...(state.tierlistBackgroundImage ? { backgroundImageUrl: state.tierlistBackgroundImage } : {}),
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
      ...(state.generalExplanationSequence !== null
        ? { sequence: state.generalExplanationSequence }
        : {}),
      ...(state.explanationPath ? { pathway: state.explanationPath } : {}),
      ...(state.generalExplanationBackgroundImage
        ? { backgroundImageUrl: state.generalExplanationBackgroundImage }
        : {}),
      ...(state.pairId ? { pairId: state.pairId } : {}),
      ...(state.pairRole ? { pairRole: state.pairRole } : {}),
      backgroundOpacity: state.backgroundOpacity,
    }
  }
  if (state.type === 'Simple Explanation') {
    return {
      type: 'Simple Explanation',
      text: state.simpleExplanationText.trim(),
      fontSizeMin: state.simpleExplanationMinFontSize,
      fontSizeMax: state.simpleExplanationMaxFontSize,
      position: state.simpleExplanationPosition,
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
      ...(Object.values(state.mapTextStyles).some((style) => style && Object.keys(style).length)
        ? { textStyles: state.mapTextStyles }
        : {}),
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
      ...(state.tarotMemberAccentColor ? { accentColor: state.tarotMemberAccentColor } : {}),
      ...(state.tarotMemberImage ? { imageUrl: state.tarotMemberImage } : {}),
      backgroundOpacity: state.backgroundOpacity,
    }
  }
  if (state.type === 'Dossier') {
    return {
      type: 'Dossier',
      name: state.dossierName.trim(),
      headline: state.dossierHeadline.trim(),
      evidence: state.dossierEvidence.trim(),
      counterpoint: state.dossierCounterpoint.trim(),
      takeaway: state.dossierTakeaway.trim(),
      sourceLabel: state.dossierSourceLabel.trim() || 'Source note',
      ...(state.dossierBackgroundImage ? { backgroundImageUrl: state.dossierBackgroundImage } : {}),
      backgroundOpacity: state.backgroundOpacity,
    }
  }
  if (state.type === 'Corruption File') {
    return {
      type: 'Corruption File',
      variant: state.corruptionVariant,
      incident: state.corruptionIncident.trim(),
      caseLabel: state.corruptionCaseLabel.trim() || 'Normal explanation',
      explanation: state.corruptionExplanation.trim(),
      reactionLabel: state.corruptionReactionLabel.trim() || 'Fandom reaction',
      reaction: state.corruptionReaction.trim(),
      ...(state.corruptionFooterText.trim() ? { footerText: state.corruptionFooterText.trim() } : {}),
      corruptionLevel: state.corruptionLevel,
      showIncidentNumber: state.corruptionShowIncidentNumber,
      ...(state.corruptionAccentColor ? { accentColor: state.corruptionAccentColor } : {}),
      ...(state.corruptionImage ? { imageUrl: state.corruptionImage } : {}),
      backgroundOpacity: state.backgroundOpacity,
    }
  }
  if (state.type === 'Ritual Logic') {
    return {
      type: 'Ritual Logic',
      variant: state.ritualVariant,
      pathway: state.ritualPathway,
      sequence: state.ritualSequence,
      sequenceName: state.ritualSequenceName.trim(),
      ritual: state.ritualText.trim(),
      survival: state.ritualSurvival.trim(),
      preparation: state.ritualPreparation.trim(),
      certainty: state.ritualCertainty,
      ...(state.ritualUncertainty.trim() ? { uncertainty: state.ritualUncertainty.trim() } : {}),
      ...(state.ritualFooterText.trim() ? { footerText: state.ritualFooterText.trim() } : {}),
      ...(state.ritualBackgroundImage ? { backgroundImageUrl: state.ritualBackgroundImage } : {}),
      backgroundOpacity: state.backgroundOpacity,
    }
  }
  if (state.type === 'Timeline') {
    return {
      type: 'Timeline',
      variant: state.timelineVariant,
      ...(state.timelinePathway ? { pathway: state.timelinePathway } : {}),
      ...(state.timelineEra.trim() ? { era: state.timelineEra.trim() } : {}),
      ...(state.timelineKicker.trim() ? { kicker: state.timelineKicker.trim() } : {}),
      title: state.timelineTitle.trim(),
      ...(state.timelineText.trim() ? { text: state.timelineText.trim() } : {}),
      step: state.timelineStep,
      total: state.timelineTotal,
      certainty: state.timelineCertainty,
      ...(state.timelineNote.trim() ? { note: state.timelineNote.trim() } : {}),
      moves: state.timelineMovesText.split('\n').map((move) => move.trim()).filter(Boolean).slice(0, 4),
      ...(state.timelineGhost.trim() ? { ghost: state.timelineGhost.trim() } : {}),
      ...(state.timelineFooterText.trim() ? { footerText: state.timelineFooterText.trim() } : {}),
      ...(state.timelineBackgroundImage ? { backgroundImageUrl: state.timelineBackgroundImage } : {}),
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
    ...(state.pairId ? { pairId: state.pairId } : {}),
    ...(state.pairRole ? { pairRole: state.pairRole } : {}),
  }
  if (state.type === 'Character') return { ...standard, type: 'Character', power: state.power }
  return { ...standard, type: 'Artifact', grade: state.grade as '0' | '1' | '2' | '3' | '4' | '5' }
}

export function fromBuilderCardState(state: BuilderCardState): CardContent {
  const content = fromBuilderCardStateBase(state)
  if (Object.keys(state.fontSizes).length === 0) return content

  return { ...content, fontSizes: state.fontSizes } as CardContent
}
