import { useState, useMemo } from 'react'
import NumInput from './NumInput'

const STYLES = [
  {
    id: 'rubia',
    label: 'Rubia',
    emoji: '🟡',
    desc: 'Ligera, refrescante. La más popular.',
    grains: [
      { name: 'Malta Pale 2-Row', ratio: 0.90 },
      { name: 'Malta Vienna',     ratio: 0.10 },
    ],
    ogTarget: 1.048,
  },
  {
    id: 'roja',
    label: 'Roja / Amber',
    emoji: '🔴',
    desc: 'Color cobre, maltosa y caramelizada.',
    grains: [
      { name: 'Malta Pale 2-Row',       ratio: 0.75 },
      { name: 'Malta Munich',            ratio: 0.15 },
      { name: 'Crystal/Caramel 60L',     ratio: 0.10 },
    ],
    ogTarget: 1.052,
  },
  {
    id: 'negra',
    label: 'Negra / Stout',
    emoji: '⚫',
    desc: 'Oscura, con notas a café y chocolate.',
    grains: [
      { name: 'Malta Pale 2-Row',   ratio: 0.72 },
      { name: 'Malta Munich',        ratio: 0.10 },
      { name: 'Malta Chocolate',     ratio: 0.10 },
      { name: 'Cebada Tostada',      ratio: 0.08 },
    ],
    ogTarget: 1.055,
  },
  {
    id: 'trigo',
    label: 'Trigo / Weizen',
    emoji: '🌾',
    desc: 'Turbia, afrutada, con notas de plátano.',
    grains: [
      { name: 'Malta de Trigo',   ratio: 0.55 },
      { name: 'Malta Pale 2-Row', ratio: 0.45 },
    ],
    ogTarget: 1.050,
  },
]

// kg necesarios: OG_points = kg * PPG * eff * 8.345 / L
// kg = OG_points * L / (PPG * eff * 8.345)
const PPG = 36 // promedio
const EFF = 0.72

function calcGrainBill(style, liters) {
  const ogPoints = (style.ogTarget - 1) * 1000
  const totalKg  = (ogPoints * liters) / (PPG * EFF * 8.345)
  return style.grains.map(g => ({
    name:   g.name,
    kg:     (totalKg * g.ratio).toFixed(2),
    pct:    Math.round(g.ratio * 100),
  }))
}

export default function EasyRecipeCalc() {
  const [liters, setLiters]   = useState(20)
  const [styleId, setStyleId] = useState('rubia')

  const style     = STYLES.find(s => s.id === styleId)
  const grainBill = useMemo(() => calcGrainBill(style, liters), [style, liters])
  const totalKg   = grainBill.reduce((s, g) => s + parseFloat(g.kg), 0)

  return (
    <div>
      <div className="card">
        <div className="card-title">🌾 ¿Qué necesito para hacer mi cerveza?</div>
        <p className="card-desc">
          Te damos una receta base según el estilo que quieres hacer.
        </p>
      </div>

      <div className="card">
        <div className="easy-step-row">
          <span className="easy-step">1</span>
          <strong>¿Cuántos litros quieres hacer?</strong>
        </div>
        <NumInput
          value={liters}
          min={5} max={200}
          onChange={setLiters}
        />
      </div>

      <div className="card">
        <div className="easy-step-row">
          <span className="easy-step">2</span>
          <strong>¿Qué estilo de cerveza?</strong>
        </div>
        <div className="style-card-grid">
          {STYLES.map(s => (
            <button
              key={s.id}
              className={`style-card ${styleId === s.id ? 'active' : ''}`}
              onClick={() => setStyleId(s.id)}
            >
              <span className="style-card-emoji">{s.emoji}</span>
              <span className="style-card-label">{s.label}</span>
              <span className="style-card-desc">{s.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title" style={{ color: '#4CAF50' }}>
          ✅ Receta base para {liters}L de {style.label.toLowerCase()}
        </div>

        <div className="easy-grain-bill">
          {grainBill.map((g, i) => (
            <div key={i} className="easy-grain-row">
              <div className="easy-grain-info">
                <span className="easy-grain-name">{g.name}</span>
                <span className="easy-grain-pct">{g.pct}%</span>
              </div>
              <span className="easy-grain-kg">{g.kg} kg</span>
              <div className="easy-grain-bar-wrap">
                <div className="easy-grain-bar" style={{ width: `${g.pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="info-grid" style={{ marginTop: '12px' }}>
          <div className="info-item">
            <span className="info-label">Total de malta</span>
            <span className="info-value">{totalKg.toFixed(2)} kg</span>
          </div>
          <div className="info-item">
            <span className="info-label">Densidad esperada</span>
            <span className="info-value">{style.ogTarget.toFixed(3)}</span>
          </div>
        </div>

        <div className="info-box warning" style={{ marginTop: '10px' }}>
          Receta orientativa con 72% de eficiencia. Ajusta según tu sistema.
        </div>
      </div>

      <div className="card">
        <div className="card-title">💡 ¿Qué hago con estas maltas?</div>
        <div className="info-box">
          Muele las maltas, mézclala con agua caliente (~67°C) durante 60 minutos
          <strong> (mash)</strong>, luego cuela y hierve el líquido durante 60–90 min
          <strong> (hervido)</strong>. Enfría, transfiere al fermentador y agrega levadura.
        </div>
      </div>
    </div>
  )
}
