'use client'

import '@/cards-ui/styles/index.css'
import DossierCard from '@/cards-ui/DossierCard'
import './dossier-lab.css'

const variants = ['Impact', 'Verdict', 'Contrast', 'Evidence', 'Comment', 'Longform'] as const

const sample = {
  name: 'Hermit',
  headline: 'Celestial Master makes knowledge revolt against its owner.',
  evidence: 'As the High-Dimensional Overseer tries to dismantle the formation from above, the Celestial Master pours knowledge through several dimensions. The information takes the shape of creatures, tears at the Overseer\'s mind, and turns what it already knows into a source of internal damage.',
  counterpoint: 'The battle is a team effort, and the Celestial Master is using a temporary, elevated state. The feat is still a direct answer to a higher-dimensional opponent.',
  takeaway: 'The answer is so large it starts biting back.',
  sourceLabel: 'Canon event',
  backgroundOpacity: 52,
}

export default function DossierLabPage() {
  return (
    <main className="dossier-lab">
      <header className="dossier-lab-header">
        <div>
          <p className="dossier-lab-kicker">LOTM / FORMAT LAB</p>
          <h1>Dossier compositions</h1>
          <p>Same Greatest Feats copy. Six reading systems. Longform is the dense-text candidate.</p>
        </div>
        <span className="dossier-lab-count">{variants.length} variants</span>
      </header>
      <section className="dossier-lab-grid" aria-label="Dossier variant mirror">
        {variants.map((variant) => (
          <article className="dossier-lab-item" key={variant}>
            <div className="dossier-lab-card">
              <DossierCard {...sample} variant={variant} />
            </div>
            <div className="dossier-lab-label">
              <span>{variant}</span>
              <small>{variant === 'Longform' ? 'dense reading' : 'existing rhythm'}</small>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
