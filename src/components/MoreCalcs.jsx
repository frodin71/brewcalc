import { useState } from 'react'
import BrewDayTimer from './BrewDayTimer'
import RecipeCalc from './RecipeCalc'
import EasyRecipeCalc from './EasyRecipeCalc'
import StrikeWaterCalc from './StrikeWaterCalc'
import ColorCalc from './ColorCalc'
import HydrometerCalc from './HydrometerCalc'
import WaterCalc from './WaterCalc'

const FEATURED = [
  {
    id: 'timer',
    emoji: '⏱️',
    title: 'Brew Day Timer',
    desc: 'Asistente paso a paso para el día de elaboración',
  },
]

const CALCS = [
  {
    id: 'recipe-malta',
    emoji: '🌾',
    title: 'Calculadora de OG',
    desc: 'Estimá la densidad original según tus maltas',
  },
  {
    id: 'strike',
    emoji: '🌡️',
    title: 'Agua de Strike',
    desc: '¿A qué temperatura calentar el agua antes del mash?',
    component: StrikeWaterCalc,
  },
  {
    id: 'color',
    emoji: '🌈',
    title: 'Color de la cerveza',
    desc: 'Estimá el SRM/EBC según tus maltas.',
    component: ColorCalc,
  },
  {
    id: 'hydrometer',
    emoji: '🔬',
    title: 'Corrección de densímetro',
    desc: 'Corregí la lectura si mediste el mosto caliente.',
    component: HydrometerCalc,
  },
  {
    id: 'water',
    emoji: '💧',
    title: 'Agua del lote',
    desc: 'Cuánta agua para el mash y el sparge.',
    component: WaterCalc,
  },
]

export default function MoreCalcs({ easyMode }) {
  const [activeId,    setActiveId]    = useState(null)
  const [timerRecipe, setTimerRecipe] = useState(null)

  if (activeId === 'timer') {
    return (
      <div>
        <button className="back-btn" onClick={() => { setActiveId(null); setTimerRecipe(null) }}>
          ← Otras calculadoras
        </button>
        <div className="calc-page-title card">
          <span style={{ fontSize: '1.6rem' }}>⏱️</span>
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>Brew Day Timer</span>
        </div>
        <BrewDayTimer recipe={timerRecipe} />
      </div>
    )
  }

  if (activeId === 'recipe-malta') {
    return (
      <div>
        <button className="back-btn" onClick={() => setActiveId(null)}>
          ← Otras calculadoras
        </button>
        <div className="calc-page-title card">
          <span style={{ fontSize: '1.6rem' }}>🌾</span>
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>Calculadora de OG</span>
        </div>
        {easyMode ? <EasyRecipeCalc /> : <RecipeCalc />}
      </div>
    )
  }

  const regular = CALCS.find(c => c.id === activeId && c.component)
  if (regular) {
    const Comp = regular.component
    return (
      <div>
        <button className="back-btn" onClick={() => setActiveId(null)}>
          ← Otras calculadoras
        </button>
        <div className="calc-page-title card">
          <span style={{ fontSize: '1.6rem' }}>{regular.emoji}</span>
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>{regular.title}</span>
        </div>
        <Comp easyMode={easyMode} />
      </div>
    )
  }

  return (
    <div>
      <div className="card">
        <div className="card-title">⚙️ Otras calculadoras</div>
        <p className="card-desc">Herramientas extra para el día de elaboración.</p>
      </div>

      <div className="more-calcs-grid">
        {FEATURED.map(c => (
          <button
            key={c.id}
            className="more-calc-card"
            onClick={() => setActiveId(c.id)}
            style={{ borderLeft: '3px solid var(--color-amber)' }}
          >
            <span className="more-calc-emoji">{c.emoji}</span>
            <span className="more-calc-title">
              {c.title}
              <span style={{
                marginLeft: '6px',
                fontSize: '0.65rem',
                background: 'var(--color-amber)',
                color: '#000',
                borderRadius: '4px',
                padding: '1px 5px',
                fontWeight: 700,
                verticalAlign: 'middle',
              }}>NUEVO</span>
            </span>
            <span className="more-calc-desc">{c.desc}</span>
            <span className="more-calc-arrow">→</span>
          </button>
        ))}

        {CALCS.map(c => (
          <button key={c.id} className="more-calc-card" onClick={() => setActiveId(c.id)}>
            <span className="more-calc-emoji">{c.emoji}</span>
            <span className="more-calc-title">{c.title}</span>
            <span className="more-calc-desc">{c.desc}</span>
            <span className="more-calc-arrow">→</span>
          </button>
        ))}
      </div>
    </div>
  )
}
