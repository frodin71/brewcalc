import { useState } from 'react'
import StrikeWaterCalc from './StrikeWaterCalc'
import ColorCalc from './ColorCalc'
import HydrometerCalc from './HydrometerCalc'
import WaterCalc from './WaterCalc'

const CALCS = [
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
  const [activeId, setActiveId] = useState(null)

  const active = CALCS.find(c => c.id === activeId)

  if (active) {
    const Comp = active.component
    return (
      <div>
        <button className="back-btn" onClick={() => setActiveId(null)}>
          ← Otras calculadoras
        </button>
        <div className="calc-page-title card">
          <span style={{ fontSize: '1.6rem' }}>{active.emoji}</span>
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>{active.title}</span>
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
