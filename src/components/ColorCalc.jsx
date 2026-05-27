import { useState, useMemo } from 'react'

const GRAINS = [
  { name: 'Malta Pale 2-Row',          lovibond: 2   },
  { name: 'Malta Pilsner',              lovibond: 1.5 },
  { name: 'Malta Munich',               lovibond: 9   },
  { name: 'Malta Vienna',               lovibond: 4   },
  { name: 'Malta de Trigo (Wheat)',     lovibond: 2   },
  { name: 'Caramel / Crystal 20L',      lovibond: 20  },
  { name: 'Caramel / Crystal 60L',      lovibond: 60  },
  { name: 'Caramel / Crystal 120L',     lovibond: 120 },
  { name: 'Malta Chocolate',            lovibond: 350 },
  { name: 'Malta Negra (Black Patent)', lovibond: 500 },
  { name: 'Cebada Tostada (Roasted)',   lovibond: 300 },
  { name: 'Avena (Oats)',               lovibond: 2   },
]

// Morey formula (metric): MCU = sum(kg × lovibond) × 8.345 / liters
// SRM = 1.4922 × MCU^0.6859
function calcSRM(grains, liters) {
  const mcu = grains.reduce((s, g) => {
    return s + (parseFloat(g.kg) || 0) * GRAINS[g.type].lovibond * 8.345 / liters
  }, 0)
  return 1.4922 * Math.pow(mcu, 0.6859)
}

function srmToRgb(srm) {
  const r = Math.min(255, Math.max(0, Math.round(255 * Math.exp(-0.0271 * srm))))
  const g = Math.min(255, Math.max(0, Math.round(255 * Math.exp(-0.0813 * srm))))
  const b = Math.min(255, Math.max(0, Math.round(255 * Math.exp(-0.2732 * srm))))
  return `rgb(${r},${g},${b})`
}

function srmDesc(srm) {
  if (srm < 3)  return 'Paja / Muy pálido'
  if (srm < 6)  return 'Dorado'
  if (srm < 10) return 'Ámbar claro'
  if (srm < 15) return 'Ámbar / Cobre'
  if (srm < 22) return 'Rojo / Castaño'
  if (srm < 30) return 'Marrón oscuro'
  return 'Negro'
}

const STYLE_COLORS = [
  { name: 'Pilsner / Lager',  srm: 2  },
  { name: 'Pale Ale',         srm: 5  },
  { name: 'Amber Ale',        srm: 12 },
  { name: 'Red Ale',          srm: 18 },
  { name: 'Brown Ale',        srm: 22 },
  { name: 'Porter',           srm: 30 },
  { name: 'Stout',            srm: 40 },
]

export default function ColorCalc({ easyMode }) {
  const [grains, setGrains]   = useState([{ type: 0, kg: '' }])
  const [liters, setLiters]   = useState(20)

  const addGrain    = () => setGrains([...grains, { type: 0, kg: '' }])
  const removeGrain = (i) => setGrains(grains.filter((_, idx) => idx !== i))
  const updateGrain = (i, field, value) => {
    const copy = [...grains]; copy[i] = { ...copy[i], [field]: value }; setGrains(copy)
  }

  const srm   = useMemo(() => calcSRM(grains, liters), [grains, liters])
  const ebc   = srm * 1.97
  const color = srmToRgb(Math.min(srm, 80))
  const textColor = srm > 15 ? '#fff' : '#000'

  return (
    <div>
      <div className="card">
        <div className="card-title">🌈 Color estimado de la cerveza</div>
        {!easyMode && <p className="card-desc">Fórmula Morey. Usa el mismo grain bill de tu receta.</p>}
        {easyMode  && <p className="card-desc">Ingresá tus maltas y litros para ver de qué color quedará tu cerveza.</p>}
      </div>

      <div className="card">
        <div className="form-group">
          <label className="form-label">Volumen final (L)</label>
          <input type="number" className="form-input"
            value={liters} min="1" max="500"
            onChange={e => setLiters(Math.max(1, parseFloat(e.target.value) || 20))} />
        </div>

        <div className="card-title" style={{ marginTop: '4px' }}>Maltas</div>
        {grains.map((g, i) => (
          <div key={i} className="ingredient-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Malta</label>
              <select className="form-select" value={g.type}
                onChange={e => updateGrain(i, 'type', parseInt(e.target.value))}>
                {GRAINS.map((gr, idx) => (
                  <option key={idx} value={idx}>{gr.name} ({gr.lovibond}°L)</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">kg</label>
              <input type="number" className="form-input"
                value={g.kg} placeholder="0.0" min="0" step="0.1"
                onChange={e => updateGrain(i, 'kg', e.target.value)} />
            </div>
            {grains.length > 1 && (
              <button className="btn-remove" onClick={() => removeGrain(i)}>✕</button>
            )}
          </div>
        ))}
        <button className="btn-add" onClick={addGrain}>＋ Agregar malta</button>
      </div>

      <div className="card">
        <div className="card-title">🎨 Resultado</div>
        <div className="color-swatch-big" style={{ background: color }}>
          <span style={{ color: textColor, fontWeight: 800, fontSize: '1.4rem' }}>
            {srm.toFixed(1)} SRM
          </span>
          <span style={{ color: textColor, opacity: 0.8, fontSize: '0.85rem', marginTop: '4px' }}>
            {ebc.toFixed(1)} EBC — {srmDesc(srm)}
          </span>
        </div>

        <div className="color-scale">
          {STYLE_COLORS.map((s, i) => (
            <div key={i} className="color-scale-item">
              <div className="color-scale-dot" style={{ background: srmToRgb(s.srm) }} />
              <span className="color-scale-label">{s.name}</span>
              <span className="color-scale-srm">{s.srm}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
