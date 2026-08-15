import {
  PATH_NAMES,
  PATHWAY_COLORS,
  PATHWAYS,
  TIER_RANKS,
  powerTier,
  tierColor,
  type Pathway,
} from '../domain/pathways'
import { PATHWAY_BACKGROUNDS } from '../domain/pathwayBackgrounds'
import { PATHWAY_ICONS } from '../domain/pathwayIcons'
import { SEQUENCE_BACKGROUNDS } from '../domain/sequenceBackgrounds'
import type { BuilderCardState, CardContent } from '../domain/schema'
import { toBuilderCardState } from '../domain/schema'
import type { CardUiProps } from './types'

export type CardKind =
  | 'Character'
  | 'Artifact'
  | 'Cover'
  | 'Full Image Cover'
  | 'Tier'
  | 'Tierlist'
  | 'Pathway'
  | 'Tier Explanation'
  | 'General Explanation'
  | 'Simple Explanation'
  | 'Pathway Explanation'
  | 'Breakdown'
  | 'Map'
  | 'Tarot Member'
  | 'Fraud File'
  | 'Corruption File'
  | 'Ritual Logic'
  | 'Timeline'

export type CardViewHandlers = {
  onUploadImage?: (file: File | undefined, field?: string) => void
  onDropImages?: (files: File[]) => void
  onDropBackground?: (file: File) => void
}

export type CardPropsResult = {
  kind: CardKind
  props: CardUiProps
}

function asPathway(value: string | null | undefined): Pathway | null {
  return value && value in PATHWAYS ? value as Pathway : null
}

function background(value: string | null | undefined, fallback: string | null): string | null {
  return value || fallback
}

function darkenHex(color: string, factor = 0.34): string {
  const value = color.replace('#', '')
  const channel = (offset: number) => Math.round(Number.parseInt(value.slice(offset, offset + 2), 16) * factor)
    .toString(16).padStart(2, '0')
  return `#${channel(0)}${channel(2)}${channel(4)}`
}

function cardPropsFromBuilderStateBase(
  state: BuilderCardState,
  handlers: CardViewHandlers = {},
): CardPropsResult {
  if (state.type === 'Cover') {
    return {
      kind: 'Cover',
      props: {
        image1: state.coverImage1,
        image2: state.coverImage2,
        title: state.coverTitle,
        part: state.coverPartNum,
        onUploadImage: handlers.onUploadImage,
      },
    }
  }

  if (state.type === 'Full Image Cover') {
    return {
      kind: 'Full Image Cover',
      props: {
        image: state.fullCoverImage,
        title: state.fullCoverTitle,
        onUploadImage: handlers.onUploadImage,
      },
    }
  }

  if (state.type === 'Tier') {
    const path = asPathway(state.tierPath) ?? 'Fool'
    const rank = state.tierRank in TIER_RANKS ? state.tierRank : 'S'
    const tierSequence = state.tierSeq
    const sequence = typeof tierSequence === 'number' && Number.isInteger(tierSequence) && tierSequence >= 0 && tierSequence <= 9
      ? tierSequence
      : null
    return {
      kind: 'Tier',
      props: {
        path,
        icon: PATHWAY_ICONS[path],
        sequence,
        sequenceName: sequence === null ? null : PATHWAYS[path][9 - sequence],
        rank,
        tier: TIER_RANKS[rank as keyof typeof TIER_RANKS],
        text: state.tierText || '',
        footerText: state.tierFooterText || '',
        backgroundImage: background(state.tierBackgroundImage, PATHWAY_BACKGROUNDS[path]),
        backgroundOpacity: state.backgroundOpacity,
      },
    }
  }

  if (state.type === 'Tierlist') {
    const rank = state.tierlistRank in TIER_RANKS ? state.tierlistRank : 'S'
    return {
      kind: 'Tierlist',
      props: {
        title: state.tierlistTitle || 'Tierlist',
        rank,
        tier: TIER_RANKS[rank as keyof typeof TIER_RANKS],
        text: state.tierlistText || '',
        footerText: state.tierlistFooterText || '',
        backgroundImage: state.tierlistBackgroundImage,
        backgroundOpacity: state.backgroundOpacity,
      },
    }
  }

  if (state.type === 'Pathway') {
    const path = asPathway(state.pathwayCardPath) ?? 'Fool'
    const pathwaySequence = state.pathwayCardSeq
    const sequence = typeof pathwaySequence === 'number' && Number.isInteger(pathwaySequence) && pathwaySequence >= 0 && pathwaySequence <= 9
      ? pathwaySequence
      : null
    return {
      kind: 'Pathway',
      props: {
        path,
        icon: PATHWAY_ICONS[path],
        sequence,
        sequenceName: sequence === null ? null : PATHWAYS[path][9 - sequence],
        tier: PATHWAY_COLORS[path],
        text: state.pathwayCardText || '',
        footerText: state.pathwayCardFooterText || '',
        backgroundImage: background(state.pathwayCardBackgroundImage, PATHWAY_BACKGROUNDS[path]),
        backgroundOpacity: state.backgroundOpacity,
      },
    }
  }

  if (state.type === 'Tier Explanation') {
    const rank = state.tierRank in TIER_RANKS ? state.tierRank : 'S'
    return {
      kind: 'Tier Explanation',
      props: {
        rank,
        tier: TIER_RANKS[rank as keyof typeof TIER_RANKS],
        description: state.tierExplanationText || '',
        backgroundImage: state.tierExplanationBackgroundImage,
        backgroundOpacity: state.backgroundOpacity,
        scope: 'All pathways',
      },
    }
  }

  if (state.type === 'General Explanation') {
    const pathway = asPathway(state.explanationPath)
    const sequenceBackground = state.generalExplanationSequence === null
      ? null
      : SEQUENCE_BACKGROUNDS[state.generalExplanationSequence] ?? null
    return {
      kind: 'General Explanation',
      props: {
        title: state.generalExplanationTitle || '',
        description: state.generalExplanationText || '',
        scope: pathway ?? 'All pathways',
        pathway,
        icon: pathway ? PATHWAY_ICONS[pathway] : null,
        backgroundImage: background(
          state.generalExplanationBackgroundImage,
          sequenceBackground ?? (pathway ? PATHWAY_BACKGROUNDS[pathway] : null),
        ),
        backgroundOpacity: state.backgroundOpacity,
        onDropBackground: handlers.onDropBackground,
      },
    }
  }

  if (state.type === 'Simple Explanation') {
    return {
      kind: 'Simple Explanation',
      props: {
        text: state.simpleExplanationText || '',
        fontSizeMin: state.simpleExplanationMinFontSize,
        fontSizeMax: state.simpleExplanationMaxFontSize,
        position: state.simpleExplanationPosition,
      },
    }
  }

  if (state.type === 'Pathway Explanation') {
    const pathway = asPathway(state.pathwayExplanationPath) ?? 'Fool'
    return {
      kind: 'Pathway Explanation',
      props: {
        pathway,
        index: PATH_NAMES.indexOf(pathway) + 1,
        total: PATH_NAMES.length,
        title: state.pathwayExplanationTitle || '',
        description: state.pathwayExplanationText || '',
        backgroundImage: background(
          state.pathwayExplanationBackgroundImage,
          PATHWAY_BACKGROUNDS[pathway],
        ),
        backgroundOpacity: state.backgroundOpacity,
        tier: PATHWAY_COLORS[pathway],
        onDropBackground: handlers.onDropBackground,
      },
    }
  }

  if (state.type === 'Breakdown') {
    return {
      kind: 'Breakdown',
      props: {
        kicker: state.breakdownKicker || '',
        title: state.breakdownTitle || '',
        does: state.breakdownDoes || '',
        doesNot: state.breakdownDoesNot || '',
        edgeLabel: state.breakdownEdgeLabel || 'Edge',
        edgeText: state.breakdownEdgeText || '',
        backgroundImage: state.breakdownBackgroundImage,
        backgroundOpacity: state.backgroundOpacity,
        onDropBackground: handlers.onDropBackground,
      },
    }
  }

  if (state.type === 'Map') {
    const pathway = asPathway(state.mapPathway)
    return {
      kind: 'Map',
      props: {
        title: state.mapTitle || '',
        entriesText: state.mapEntriesText || '',
        footerText: state.mapFooterText || '',
        textStyles: state.mapTextStyles,
        pathway,
        tier: pathway ? PATHWAY_COLORS[pathway] : null,
        backgroundImage: background(
          state.mapBackgroundImage,
          pathway ? PATHWAY_BACKGROUNDS[pathway] : null,
        ),
        backgroundOpacity: state.backgroundOpacity,
        onDropBackground: handlers.onDropBackground,
      },
    }
  }

  if (state.type === 'Tarot Member') {
    const pathway = asPathway(state.tarotMemberPathway)
    const customAccent = state.tarotMemberAccentColor
    return {
      kind: 'Tarot Member',
      props: {
        variant: state.tarotMemberVariant,
        name: state.tarotMemberName,
        tarotTitle: state.tarotMemberTitle,
        description: state.tarotMemberDescription,
        detailLabel: state.tarotMemberDetailLabel,
        detailText: state.tarotMemberDetailText,
        footerText: state.tarotMemberFooterText,
        image: background(state.tarotMemberImage, pathway ? PATHWAY_BACKGROUNDS[pathway] : null),
        backgroundOpacity: state.backgroundOpacity,
        tier: customAccent
          ? { c: customAccent, d: darkenHex(customAccent) }
          : pathway ? PATHWAY_COLORS[pathway] : null,
        onDropBackground: handlers.onDropBackground,
      },
    }
  }

  if (state.type === 'Fraud File') {
    return {
      kind: 'Fraud File',
      props: {
        name: state.fraudName,
        allegation: state.fraudAllegation,
        evidence: state.fraudEvidence,
        counterpoint: state.fraudCounterpoint,
        verdict: state.fraudVerdict,
        sourceLabel: state.fraudSourceLabel,
        backgroundImage: state.fraudBackgroundImage,
        backgroundOpacity: state.backgroundOpacity,
        onDropBackground: handlers.onDropBackground,
      },
    }
  }

  if (state.type === 'Corruption File') {
    return { kind: 'Corruption File', props: {
      variant: state.corruptionVariant, incident: state.corruptionIncident,
      caseLabel: state.corruptionCaseLabel, explanation: state.corruptionExplanation,
      reactionLabel: state.corruptionReactionLabel, reaction: state.corruptionReaction,
      footerText: state.corruptionFooterText, corruptionLevel: state.corruptionLevel,
      showIncidentNumber: state.corruptionShowIncidentNumber,
      accentColor: state.corruptionAccentColor || '#d84a4a', image: state.corruptionImage,
      backgroundOpacity: state.backgroundOpacity, onDropBackground: handlers.onDropBackground,
    } }
  }

  if (state.type === 'Ritual Logic') {
    const pathway = asPathway(state.ritualPathway) ?? 'Fool'
    return { kind: 'Ritual Logic', props: {
      variant: state.ritualVariant, pathway, sequence: state.ritualSequence, sequenceName: state.ritualSequenceName,
      ritual: state.ritualText, survival: state.ritualSurvival, preparation: state.ritualPreparation,
      certainty: state.ritualCertainty, uncertainty: state.ritualUncertainty,
      footerText: state.ritualFooterText, tier: PATHWAY_COLORS[pathway],
      backgroundImage: background(state.ritualBackgroundImage, PATHWAY_BACKGROUNDS[pathway]),
      backgroundOpacity: state.backgroundOpacity, onDropBackground: handlers.onDropBackground,
    } }
  }

  if (state.type === 'Timeline') {
    const pathway = asPathway(state.timelinePathway)
    return { kind: 'Timeline', props: {
      variant: state.timelineVariant, pathway, era: state.timelineEra, kicker: state.timelineKicker,
      title: state.timelineTitle, text: state.timelineText,
      step: state.timelineStep, total: state.timelineTotal,
      certainty: state.timelineCertainty, note: state.timelineNote,
      moves: state.timelineMovesText.split('\n').map((move) => move.trim()).filter(Boolean),
      footerText: state.timelineFooterText, ghost: state.timelineGhost,
      icon: pathway ? PATHWAY_ICONS[pathway] : null,
      tier: pathway ? PATHWAY_COLORS[pathway] : null,
      backgroundImage: background(
        state.timelineBackgroundImage,
        pathway ? PATHWAY_BACKGROUNDS[pathway] : null,
      ),
      backgroundOpacity: state.backgroundOpacity, onDropBackground: handlers.onDropBackground,
    } }
  }

  const sequences = [
    { path: asPathway(state.path), seq: state.seq },
    ...(state.hasSecond ? [{ path: asPathway(state.path2), seq: state.seq2 }] : []),
  ]
    .filter((item): item is { path: Pathway; seq: number } => Boolean(item.path))
    .map(({ path, seq }) => ({
      path,
      seq,
      rank: PATHWAYS[path][9 - seq],
      icon: PATHWAY_ICONS[path],
      tier: tierColor(seq),
    }))
  const isCharacter = state.type === 'Character'
  const baseValue = isCharacter ? state.power : state.grade
  const powerValue = baseValue + (state.mod.trim() ? ' (' + state.mod.trim() + ')' : '')
  return {
    kind: state.type,
    props: {
      name: state.name,
      image: state.image,
      accent: powerTier(state.type, state.power, state.grade),
      sequences,
      pathLabel: [...new Set(sequences.map((item) => item.path))].join(' · '),
      dom: state.dom,
      powerLabel: isCharacter ? 'Power' : 'Grade',
      powerValue,
      onUploadImage: handlers.onUploadImage,
      onDropImages: handlers.onDropImages,
    },
  }
}

export function cardPropsFromBuilderState(
  state: BuilderCardState,
  handlers: CardViewHandlers = {},
): CardPropsResult {
  const result = cardPropsFromBuilderStateBase(state, handlers)
  return {
    ...result,
    props: { ...result.props, fontSizes: state.fontSizes },
  }
}

export function cardPropsFromContent(content: CardContent, handlers: CardViewHandlers = {}): CardPropsResult {
  return cardPropsFromBuilderState(toBuilderCardState(content), handlers)
}

/** Acento dorado de portadas y de las familias sin rango del que derivarlo. */
const COVER_ACCENT = { c: '#d9b869', d: '#4a3a17', pct: 100 } as const

export type CardAccent = { c: string; d: string; pct: number }

/**
 * Color de acento de una carta, para cualquier familia.
 *
 * Las props que consume cada componente solo llevan `accent` en la familia
 * estandar, porque el resto lo deriva de su propio rango. El editor, en cambio,
 * tiñe su cromo (botones de descarga, ZIP y MP4) con el acento de la carta
 * abierta sea del tipo que sea, asi que necesita esta cadena completa.
 */
export function accentForState(state: BuilderCardState): CardAccent {
  const type = state.type

  if (type === 'Cover' || type === 'Full Image Cover') return { ...COVER_ACCENT }

  if (type === 'Tier' || type === 'Tierlist' || type === 'Tier Explanation') {
    const rawRank = type === 'Tierlist' ? state.tierlistRank : state.tierRank
    const rank = rawRank in TIER_RANKS ? (rawRank as keyof typeof TIER_RANKS) : 'S'
    return { ...TIER_RANKS[rank], pct: 100 }
  }

  if (type === 'Pathway') {
    const path = state.pathwayCardPath in PATHWAYS ? (state.pathwayCardPath as Pathway) : 'Fool'
    return { ...PATHWAY_COLORS[path], pct: 100 }
  }

  if (type === 'Ritual Logic') {
    const path = state.ritualPathway in PATHWAYS ? state.ritualPathway as Pathway : 'Fool'
    return { ...PATHWAY_COLORS[path], pct: 100 }
  }

  if (type === 'Timeline') {
    const pathway =
      state.timelinePathway && state.timelinePathway in PATHWAYS ? (state.timelinePathway as Pathway) : null
    return pathway ? { ...PATHWAY_COLORS[pathway], pct: 100 } : { ...COVER_ACCENT }
  }

  if (type === 'Corruption File') {
    const color = state.corruptionAccentColor || '#d84a4a'
    return { c: color, d: '#351317', pct: 100 }
  }

  if (type === 'Fraud File') return { ...COVER_ACCENT }

  if (type === 'Map') {
    const pathway =
      state.mapPathway && state.mapPathway in PATHWAYS ? (state.mapPathway as Pathway) : null
    return pathway ? { ...PATHWAY_COLORS[pathway], pct: 100 } : { ...COVER_ACCENT }
  }

  if (
    type === 'General Explanation' ||
    type === 'Simple Explanation' ||
    type === 'Pathway Explanation' ||
    type === 'Breakdown' ||
    type === 'Tarot Member'
  ) {
    return { ...COVER_ACCENT }
  }

  return powerTier(state.type, state.power, state.grade)
}
