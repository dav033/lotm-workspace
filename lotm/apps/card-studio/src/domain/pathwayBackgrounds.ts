import type { Pathway } from './pathways'

const background = (file: string) => `/pathway-back/${file}.jpg`

export const PATHWAY_BACKGROUNDS: Record<Pathway, string> = {
  Fool: background('fool'),
  Door: background('door'),
  Error: background('error'),
  Visionary: background('visionary'),
  Sun: background('sun'),
  Tyrant: background('tyrant'),
  'White Tower': background('whitetower'),
  'Hanged Man': background('hangedman'),
  Darkness: background('darkness'),
  Death: background('death'),
  'Twilight Giant': background('giant'),
  Demoness: background('demoness'),
  'Red Priest': background('redpriest'),
  Hermit: background('hermit'),
  Paragon: background('paragon'),
  'Wheel of Fortune': background('wheel'),
  Mother: background('mother'),
  Moon: background('moon'),
  Abyss: background('abyss'),
  Chained: background('chained'),
  'Black Emperor': background('black-emperor'),
  Justiciar: background('justiciar'),
}
