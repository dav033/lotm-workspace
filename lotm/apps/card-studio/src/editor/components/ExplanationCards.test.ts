import assert from 'node:assert/strict'
import test from 'node:test'
import React, { type ComponentType } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import TierExplanationCard from '../../cards-ui/TierExplanationCard'
import GeneralExplanationCard from '../../cards-ui/GeneralExplanationCard'
import PathwayExplanationCard from '../../cards-ui/PathwayExplanationCard'
import BreakdownCard from '../../cards-ui/BreakdownCard'
import MapCard from '../../cards-ui/MapCard'
import FullImageCoverCard from '../../cards-ui/FullImageCoverCard'
import TierCard from '../../cards-ui/TierCard'
import TierlistCard from '../../cards-ui/TierlistCard'
import PathwayCard from '../../cards-ui/PathwayCard'
import TarotMemberCard from '../../cards-ui/TarotMemberCard'
import CorruptionFileCard from '../../cards-ui/CorruptionFileCard'
import TimelineCard from '../../cards-ui/TimelineCard'
import RitualLogicCard from '../../cards-ui/RitualLogicCard'
import Panel from './Panel'
import { CardContentSchema, toBuilderCardState } from '../../domain/schema'

const TierExplanation = TierExplanationCard as ComponentType<Record<string, unknown>>
const GeneralExplanation = GeneralExplanationCard as ComponentType<Record<string, unknown>>
const PathwayExplanation = PathwayExplanationCard as ComponentType<Record<string, unknown>>
const Breakdown = BreakdownCard as ComponentType<Record<string, unknown>>
const Map_ = MapCard as ComponentType<Record<string, unknown>>
const FullImageCover = FullImageCoverCard as ComponentType<Record<string, unknown>>
const Tier = TierCard as ComponentType<Record<string, unknown>>
const Tierlist = TierlistCard as ComponentType<Record<string, unknown>>
const Pathway = PathwayCard as ComponentType<Record<string, unknown>>
const TarotMember = TarotMemberCard as ComponentType<Record<string, unknown>>
const CorruptionFile = CorruptionFileCard as ComponentType<Record<string, unknown>>
const Timeline = TimelineCard as ComponentType<Record<string, unknown>>
const RitualLogic = RitualLogicCard as ComponentType<Record<string, unknown>>
const Panel_ = Panel as unknown as ComponentType<Record<string, unknown>>

test('Tarot Member produce composiciones distintas para retrato, expediente y contraste', () => {
  const common = {
    name: 'Klein Moretti', tarotTitle: 'The Fool', description: 'The performance.',
    detailLabel: 'Reality', detailText: 'A man improvising.', footerText: 'Praise the Fool.',
  }
  const portrait = renderToStaticMarkup(React.createElement(TarotMember, { ...common, variant: 'Portrait' }))
  const dossier = renderToStaticMarkup(React.createElement(TarotMember, { ...common, variant: 'Dossier' }))
  const contrast = renderToStaticMarkup(React.createElement(TarotMember, { ...common, variant: 'Contrast' }))
  assert.match(portrait, /tarot-member-portrait/)
  assert.match(dossier, /tarot-member-dossier/)
  assert.match(dossier, /Restricted/)
  assert.match(contrast, /tarot-member-contrast/)
  assert.match(contrast, /What the Club sees/)
  assert.doesNotMatch(portrait, /tarot-member-footer|Praise the Fool\./)
  assert.doesNotMatch(dossier, /tarot-member-footer|Praise the Fool\./)
  assert.doesNotMatch(contrast, /tarot-member-footer|Praise the Fool\./)
})

test('Ritual Logic produce cinco composiciones distintas', () => {
  const common = {
    pathway: 'Fool', sequence: 5, sequenceName: 'Marionettist',
    ritual: 'A mermaid sings while the potion is consumed.',
    survival: 'The potion strains Spirit Body Threads.',
    preparation: 'The aspirant rehearses control without losing self.',
    certainty: 'Mixed', uncertainty: 'The causal link is inferred.', footerText: 'Legacy footer should not render.',
  }
  const chain = renderToStaticMarkup(React.createElement(RitualLogic, { ...common, variant: 'Chain' }))
  const split = renderToStaticMarkup(React.createElement(RitualLogic, { ...common, variant: 'Split' }))
  const casefile = renderToStaticMarkup(React.createElement(RitualLogic, { ...common, variant: 'Casefile' }))
  const pressure = renderToStaticMarkup(React.createElement(RitualLogic, { ...common, variant: 'Pressure' }))
  const timeline = renderToStaticMarkup(React.createElement(RitualLogic, { ...common, variant: 'Timeline' }))
  assert.match(chain, /ritual-logic-chain/)
  assert.match(chain, /Ritual function/)
  assert.match(chain, /Potion pressure/)
  assert.match(chain, /Sequence rehearsal/)
  assert.match(split, /ritual-logic-split/)
  assert.match(split, /What the act does/)
  assert.match(split, /What it trains/)
  assert.match(casefile, /ritual-logic-casefile/)
  assert.match(casefile, /Ritual function/)
  assert.match(pressure, /ritual-logic-pressure-layout/)
  assert.match(pressure, /The part that can kill you/)
  assert.match(pressure, /Ritual function/)
  assert.match(timeline, /ritual-logic-timeline/)
  assert.match(timeline, /aria-label="Ritual function"/)
  assert.match(timeline, /BEFORE/)
  assert.doesNotMatch(chain, /ritual-logic-footer|Legacy footer should not render/)
  assert.doesNotMatch(split, /ritual-logic-footer|Legacy footer should not render/)
  assert.doesNotMatch(casefile, /ritual-logic-footer|Legacy footer should not render/)
  assert.doesNotMatch(pressure, /ritual-logic-footer|Legacy footer should not render/)
  assert.doesNotMatch(timeline, /ritual-logic-footer|Legacy footer should not render/)
  assert.notEqual(chain, split)
  assert.notEqual(split, casefile)
  assert.notEqual(casefile, pressure)
  assert.notEqual(pressure, timeline)
})

test('Ritual Logic pinta el fondo propio en el render principal', () => {
  const html = renderToStaticMarkup(React.createElement(RitualLogic, {
    pathway: 'Moon', sequence: 5, sequenceName: 'Scarlet Scholar', variant: 'Chain',
    ritual: 'Prepare the lunar rite.',
    survival: 'The potion tests the body.',
    preparation: 'Rehearse the new authority.',
    certainty: 'Mixed', uncertainty: 'The link is inferred.',
    backgroundImage: '/api/cards/images/moon.jpg', backgroundOpacity: 58,
  }))
  assert.match(html, /ritual-logic-background[^>]*background-image:url\(&quot;\/api\/cards\/images\/moon\.jpg&quot;\)/)
  assert.match(html, /ritual-logic-background-overlay/)
  assert.match(html, /--background-opacity:0\.58/)
})

test('Ritual Logic marks short content as sparse so the layout can use the card height', () => {
  const html = renderToStaticMarkup(React.createElement(RitualLogic, {
    pathway: 'Door', sequence: 5, sequenceName: 'Traveler', variant: 'Chain',
    ritual: 'Set four distant coordinates in the Spirit World.',
    survival: 'The coordinates point home.',
    preparation: 'Mark a position and return without losing yourself.',
    certainty: 'Mixed', uncertainty: 'The four-point logic is inferred.', footerText: 'Every journey needs a way back.',
  }))
  assert.match(html, /ritual-logic-card[^>]*sparse/)

  const pressureHtml = renderToStaticMarkup(React.createElement(RitualLogic, {
    pathway: 'Fool', sequence: 5, sequenceName: 'Marionettist', variant: 'Pressure',
    ritual: 'Build a small theater and set the stage before the ritual.',
    survival: 'The threads answer to the performer.',
    preparation: 'Keep each motion deliberate.',
    certainty: 'Mixed', uncertainty: 'The exact pressure is inferred.', footerText: 'Control begins with attention.',
  }))
  assert.doesNotMatch(pressureHtml, /ritual-logic-card[^>]*sparse/)
})

test('Tier Explanation muestra solo tier y descripción general', () => {
  const html = renderToStaticMarkup(React.createElement(TierExplanation, {
    rank: 'S',
    tier: { c: '#fff', d: '#333' },
    description: 'Versatilidad excepcional.',
    scope: 'All pathways',
    backgroundImage: '/tier-explanation-background.jpg',
  }))
  assert.match(html, />S</)
  assert.match(html, /Versatilidad excepcional/)
  assert.match(html, /All pathways/)
  assert.match(html, /tier-explanation-background\.jpg/)
  assert.doesNotMatch(html, /<img/)
})

test('General Explanation muestra título y descripción sin exigir pathway', () => {
  const html = renderToStaticMarkup(React.createElement(GeneralExplanation, {
    title: 'El mundo espiritual',
    description: 'Conecta lugares y criaturas.',
    scope: 'All pathways',
  }))
  assert.match(html, /El mundo espiritual/)
  assert.match(html, /Conecta lugares y criaturas/)
  assert.match(html, /All pathways/)
})

test('Pathway Explanation muestra el contador, el título con la palabra resaltada y la descripción', () => {
  const html = renderToStaticMarkup(React.createElement(PathwayExplanation, {
    pathway: 'Door',
    index: 2,
    total: 22,
    title: "Door isn't a *teleport* pathway.",
    description: "It's access and exclusion.",
  }))
  assert.match(html, />2 \/ 22 PATHWAYS</)
  assert.match(html, /pathway-explanation-highlight">teleport</)
  assert.match(html, /It&#x27;s access and exclusion\./)
  assert.doesNotMatch(html, /\*/)
})

test('Breakdown muestra el kicker, el título y las tres secciones con la etiqueta libre resaltada', () => {
  const html = renderToStaticMarkup(React.createElement(Breakdown, {
    kicker: 'Authority',
    title: 'Replication',
    does: 'Recreates powers, scenes and instances it has understood.',
    doesNot: 'Copy the person. Only the power.',
    edgeLabel: 'Edge',
    edgeText: 'Needs understanding, not storage.',
  }))
  assert.match(html, /breakdown-chip[^"]*">Authority</)
  assert.match(html, /breakdown-title[^"]*">Replication</)
  assert.match(html, /Recreates powers, scenes and instances it has understood\./)
  assert.match(html, /Copy the person\. Only the power\./)
  assert.match(html, /breakdown-edge">[\s\S]*?Edge[\s\S]*?Needs understanding, not storage\./)
})

test('Breakdown deriva los pips de la secuencia escrita en el kicker', () => {
  const conRango = renderToStaticMarkup(React.createElement(Breakdown, {
    kicker: 'Authority · Seq 1→0', title: 'Seals',
    does: 'a', doesNot: 'b', edgeLabel: 'Edge', edgeText: 'c',
  }))
  const sinSecuencia = renderToStaticMarkup(React.createElement(Breakdown, {
    kicker: 'Authority · From Bizarreness', title: 'Concealment',
    does: 'a', doesNot: 'b', edgeLabel: 'Edge', edgeText: 'c',
  }))

  // [ "] evita contar el contenedor .breakdown-pips como si fuera un pip.
  assert.equal((conRango.match(/breakdown-pip[ "]/g) ?? []).length, 10, 'una fila de 10 secuencias')
  assert.match(conRango, /breakdown-pip full/, 'Seq 0 con control completo')
  assert.match(conRango, /breakdown-pip partial/, 'Seq 1 con control parcial')
  assert.match(conRango, /breakdown-ghost[^>]*>0</, 'la cifra fantasma repite la secuencia')
  // Sin secuencia en el texto no hay nada que dibujar.
  assert.doesNotMatch(sinSecuencia, /breakdown-pip/)
  assert.doesNotMatch(sinSecuencia, /breakdown-ghost/)
})

test('Breakdown y Pathway Explanation pintan la imagen de fondo bajo su velo', () => {
  const breakdown = renderToStaticMarkup(React.createElement(Breakdown, {
    kicker: 'Authority', title: 'Seals', does: 'a', doesNot: 'b', edgeLabel: 'Edge', edgeText: 'c',
    backgroundImage: '/covers/seals.jpg',
  }))
  const explicacion = renderToStaticMarkup(React.createElement(PathwayExplanation, {
    pathway: 'Door', index: 2, total: 22, title: 'Un *gancho*.', description: 'Texto.',
    backgroundImage: '/covers/door.jpg',
  }))

  assert.match(breakdown, /tier-background[\s\S]*?covers\/seals\.jpg/)
  assert.match(breakdown, /tier-background-overlay/)
  assert.match(explicacion, /tier-background[\s\S]*?covers\/door\.jpg/)
  // Sin imagen no se emite ningun nodo de fondo.
  const pelado = renderToStaticMarkup(React.createElement(Breakdown, {
    kicker: 'Authority', title: 'Seals', does: 'a', doesNot: 'b', edgeLabel: 'Edge', edgeText: 'c',
  }))
  assert.doesNotMatch(pelado, /tier-background/)
})

test('Breakdown sin kicker no reserva espacio para él', () => {
  const html = renderToStaticMarkup(React.createElement(Breakdown, {
    title: 'Door',
    does: 'Opens or closes access.',
    doesNot: 'Move you. It grants the passage.',
    edgeLabel: 'Caps at',
    edgeText: 'Sequence 0.',
  }))
  assert.doesNotMatch(html, /breakdown-kicker/)
  assert.match(html, /breakdown-edge">[\s\S]*?Caps at/)
})

test('Map muestra el título y las filas, e ignora footer legado', () => {
  const html = renderToStaticMarkup(React.createElement(Map_, {
    title: 'Where the powers come from',
    entriesText: 'Door · Change · King of Space-Time -> Door, Space, Seals, Alternate Worlds\nSolo un valor',
    footerText: 'Three roots. Seven powers.',
  }))
  assert.match(html, /map-title[^"]*">Where the powers come from/)
  assert.match(html, /map-entry-tags">Door · Change · King of Space-Time/)
  assert.match(html, /map-entry-value">Door, Space, Seals, Alternate Worlds/)
  assert.match(html, /map-entry-value">Solo un valor/)
  assert.doesNotMatch(html, /map-footer-text|Three roots\. Seven powers\./)
})

test('Map oculta footer que repite el pathway', () => {
  const html = renderToStaticMarkup(React.createElement(Map_, {
    title: 'The path of the scholar',
    entriesText: 'Reader -> Acquires the object of study',
    pathway: 'White Tower',
    footerText: 'White Tower',
  }))
  assert.doesNotMatch(html, /map-footer-text/)
})

test('Map sin footer no muestra la regla final ni fondo de pathway', () => {
  const html = renderToStaticMarkup(React.createElement(Map_, {
    title: 'Sin footer',
    entriesText: 'Tags -> Value',
  }))
  assert.doesNotMatch(html, /map-footer/)
  assert.doesNotMatch(html, /tier-background/)
})

test('Map con pathway toma su color y su fondo', () => {
  const html = renderToStaticMarkup(React.createElement(Map_, {
    title: 'Where the powers come from',
    entriesText: 'Door -> Replication',
    tier: { c: '#6a5acd', d: '#241c4a' },
    backgroundImage: '/backgrounds/door.jpg',
    backgroundOpacity: 45,
  }))
  assert.match(html, /--tier:#6a5acd/)
  assert.match(html, /--tier-deep:#241c4a/)
  assert.match(html, /tier-background[\s\S]*?backgrounds\/door\.jpg/)
  assert.match(html, /--background-opacity:0\.45/)
})

test('todas las familias de fondo usan el mismo porcentaje y el panel ofrece presets', () => {
  const common = { backgroundImage: '/background.jpg', backgroundOpacity: 45 }
  const cards = [
    React.createElement(Tier, {
      path: 'Fool', icon: '/fool.png', sequence: null, sequenceName: null,
      rank: 'S', tier: { c: '#fff', d: '#333' }, text: '', ...common,
    }),
    React.createElement(Pathway, {
      path: 'Door', icon: '/door.png', sequence: null, sequenceName: null,
      tier: { c: '#fff', d: '#333' }, text: '', ...common,
    }),
    React.createElement(TierExplanation, {
      rank: 'S', tier: { c: '#fff', d: '#333' }, description: 'Text', scope: 'All', ...common,
    }),
    React.createElement(GeneralExplanation, {
      title: 'Title', description: 'Text', scope: 'Door', pathway: 'Door', ...common,
    }),
    React.createElement(PathwayExplanation, {
      pathway: 'Door', index: 2, total: 22, title: 'Title', description: 'Text', ...common,
    }),
    React.createElement(Breakdown, {
      title: 'Door', does: 'a', doesNot: 'b', edgeLabel: 'Edge', edgeText: 'c', ...common,
    }),
    React.createElement(Map_, { title: 'Map', entriesText: 'Door -> Space', ...common }),
  ]
  const state = toBuilderCardState(CardContentSchema.parse({
    type: 'Map', title: 'The chain', entries: [{ tags: 'Means', value: 'Door' }],
    pathway: 'Door', backgroundOpacity: 45,
  }))
  const panel = renderToStaticMarkup(React.createElement(Panel_, {
    state,
    set: () => undefined,
    accent: { c: '#fff' },
    onUploadImage: () => undefined,
    onDownload: () => undefined,
    onGenerateTierBatch: () => undefined,
  }))

  for (const card of cards) {
    assert.match(renderToStaticMarkup(card), /--background-opacity:0\.45/)
  }
  assert.match(panel, /type="range"[^>]*value="45"/)
  for (const preset of ['Low', 'Medium', 'High', 'Very high']) {
    assert.match(panel, new RegExp(`aria-pressed="(?:true|false)"[^>]*>${preset}<`))
  }
})

test('Full Image Cover muestra la imagen a cuerpo completo y el título superpuesto', () => {
  const html = renderToStaticMarkup(React.createElement(FullImageCover, {
    image: '/cover.jpg',
    title: 'The Fool Returns',
    onUploadImage: () => undefined,
  }))
  assert.match(html, /full-cover-image/)
  assert.match(html, /cover\.jpg/)
  assert.match(html, /full-cover-title[^>]*>The Fool Returns/)
  assert.doesNotMatch(html, /<footer/)
})

test('Tier muestra una secuencia específica del pathway', () => {
  const html = renderToStaticMarkup(React.createElement(Tier, {
    path: 'Fool',
    icon: '/fool.png',
    sequence: 9,
    sequenceName: 'Seer',
    rank: 'A',
    tier: { c: '#fff', d: '#333' },
    text: 'Useful divination.',
    footerText: 'A powerful information specialist.',
    backgroundImage: '/background.jpg',
  }))
  assert.match(html, /Seq 9/)
  assert.match(html, /Seer/)
  assert.doesNotMatch(html, /tier-footer-text|A powerful information specialist/)
  assert.match(html, /background\.jpg/)
  assert.match(html, /tier-body/)
})

test('Tierlist no muestra pathway ni secuencia', () => {
  const html = renderToStaticMarkup(React.createElement(Tierlist, {
    title: 'Klein Duos', rank: 'S', tier: { c: '#fff', d: '#333' },
    text: 'Azik: deepest bond', footerText: 'No pathway required.',
  }))
  assert.match(html, /tierlist-card/)
  assert.match(html, /Klein Duos/)
  assert.match(html, /Azik: deepest bond/)
  assert.doesNotMatch(html, /Pathway|Seq /)
})

test('Corruption File y Timeline ignoran footer legado', () => {
  const corruption = renderToStaticMarkup(React.createElement(CorruptionFile, {
    variant: 'Warning', incident: 'A corrupted explanation', explanation: 'The explanation.',
    reaction: 'The reaction.', footerText: 'Legacy footer should not render.',
  }))
  const timelineOpen = renderToStaticMarkup(React.createElement(Timeline, {
    variant: 'Open', title: 'The opening', text: 'The consequence.',
    footerText: 'Legacy footer should not render.',
  }))
  const timelineArc = renderToStaticMarkup(React.createElement(Timeline, {
    variant: 'Arc', title: 'The arc', moves: ['First move'],
    footerText: 'Legacy footer should not render.',
  }))
  const pathway = renderToStaticMarkup(React.createElement(Pathway, {
    path: 'Door', icon: '/door.png', sequence: null, sequenceName: null,
    tier: { c: '#fff', d: '#333' }, text: 'Opens passage.',
    footerText: 'Legacy footer should not render.',
  }))

  for (const html of [corruption, timelineOpen, timelineArc, pathway]) {
    assert.doesNotMatch(html, /corruption-file-footer|timeline-foot|timeline-footer|tier-footer-text|Legacy footer should not render\./)
  }
})
