import type { Pathway } from './pathways'

// Each of the 22 pathways mapped to its icon (filenames don't always match the
// name). Served from /public through the studio namespace in production.
const icon = (file: string) => `/cartas/pathway-icons/${file}.webp`

export const PATHWAY_ICONS: Record<Pathway, string> = {
  "Fool": icon('fool'),
  "Door": icon('door'),
  "Error": icon('error'),
  "Visionary": icon('visionary'),
  "Sun": icon('sun'),
  "Tyrant": icon('tyrant'),
  "White Tower": icon('white-tower'),
  "Hanged Man": icon('hanged-man'),
  "Darkness": icon('darkness'),
  "Death": icon('death'),
  "Twilight Giant": icon('giant'),
  "Demoness": icon('demoness'),
  "Red Priest": icon('red-priest'),
  "Hermit": icon('hermit'),
  "Paragon": icon('paragon'),
  "Wheel of Fortune": icon('fortune'),
  "Mother": icon('mother'),
  "Moon": icon('moon'),
  "Abyss": icon('abyss'),
  "Chained": icon('chained'),
  "Black Emperor": icon('black-emperor'),
  "Justiciar": icon('justiciar'),
}
