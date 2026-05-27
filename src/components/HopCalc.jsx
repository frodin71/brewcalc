import { useState, useMemo } from 'react'
import NumInput from './NumInput'

const HOP_VARIETIES = [
  { name: 'Amarillo',          alpha: 9.5  },
  { name: 'Cascade',           alpha: 5.5  },
  { name: 'Centennial',        alpha: 10.0 },
  { name: 'Chinook',           alpha: 12.0 },
  { name: 'Citra',             alpha: 12.0 },
  { name: 'Columbus / CTZ',    alpha: 15.0 },
  { name: 'El Dorado',         alpha: 15.0 },
  { name: 'Galaxy',            alpha: 14.0 },
  { name: 'Hallertau Mittelfrüh', alpha: 4.5 },
  { name: 'Magnum',            alpha: 13.0 },
  { name: 'Mosaic',            alpha: 12.5 },
  { name: 'Saaz',              alpha: 3.5  },
  { name: 'Simcoe',            alpha: 13.0 },
  { name: 'Styrian Goldings',  alpha: 5.5  },
  { name: 'Tettnang',          alpha: 4.5  },
  { name: 'Willamette',        alpha: 5.0  },
  { name: '— Personalizado —', alpha: null },
]

// Tinseth IBU (métrico)
// utilization = bigness × time_factor
// bigness = 1.65 × 0.000125^(OG − 1)
// time_factor = (1 − e^(−0.04×min)) / 4.15
// IBU ≈ (g × alpha_decimal × utilization × 1000) / L
function tinsethIBU(grams, alphaPct, minutes, og, volumeL) {
  if (!grams || !alphaPct || !minutes || !volumeL) return 0
  const bigness    = 1.65 * Math.pow(0.000125, og - 1)
  const timeFactor = (1 - Math.exp(-0.04 * minutes)) / 4.15
  const u          = bigness * timeFactor
  return (grams * (alphaPct / 100) * u * 1000) / volumeL
}

const IBU_STYLES = [
  { name: 'Lager suave / Kölsch',   range: '8–18'   },
  { name: 'Wheat Beer / Trigo',     range: '10–25'  },
  { name: 'Pale Ale americano',     range: '25–40'  },
  { name: 'IPA americano',          range: '40–70'  },
  { name: 'Double IPA',             range: '65–100' },
  { name: 'Stout / Porter',         range: '25–40'  },
  { name: 'Pilsner',                range: '25–45'  },
  { name: 'Barleywine',             range: '50–100' },
]

function getIBUDesc(ibu) {
  if (ibu < 10)  return 'Casi sin amargor'
  if (ibu < 20)  return 'Muy suave'
  if (ibu < 30)  return 'Moderado'
  if (ibu < 45)  return 'Amargo'
  if (ibu < 65)  return 'Muy amargo'
  if (ibu < 90)  return 'Intensamente amargo'
  return 'Extremo'
}

function getIBUColor(ibu) {
  if (ibu < 30) return '#4CAF50'
  if (ibu < 60) return '#F5A623'
  return '#EF5350'
}

export default function HopCalc() {
  const [hops, setHops]             = useState([{ variety: 0, grams: '', time: 60, customAlpha: '' }])
  const [batchSize, setBatchSize]   = useState(20)
  const [wortOG, setWortOG]         = useState(1.050)

  const addHop    = () => setHops([...hops, { variety: 0, grams: '', time: 60, customAlpha: '' }])
  const removeHop = (i) => setHops(hops.filter((_, idx) => idx !== i))
  const updateHop = (i, field, value) => {
    const copy = [...hops]
    copy[i] = { ...copy[i], [field]: value }
    setHops(copy)
  }

  const getAlpha = (hop) => {
    const variety = HOP_VARIETIES[hop.variety]
    return variety.alpha !== null ? variety.alpha : (parseFloat(hop.customAlpha) || 0)
  }

  const hopIBUs = useMemo(() => hops.map(h =>
    tinsethIBU(
      parseFloat(h.grams) || 0,
      getAlpha(h),
      parseFloat(h.time) || 0,
      wortOG,
      batchSize,
    )
  ), [hops, wortOG, batchSize])

  const totalIBU  = hopIBUs.reduce((s, v) => s + v, 0)
  const ibuPct    = Math.min(100, (totalIBU / 100) * 100)
  const ibuColor  = getIBUColor(totalIBU)

  return (
    <div>
      <div className="card">
        <div className="card-title">⚙️ Parámetros</div>
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Volumen final (L)</label>
            <NumInput
              value={batchSize}
              min={1}
              onChange={setBatchSize}
            />
          </div>
          <div className="form-group">
            <label className="form-label">OG del mosto</label>
            <NumInput
              value={wortOG}
              min={1.000} max={1.200}
              onChange={setWortOG}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">🌿 Adiciones de lúpulo</div>

        {hops.map((hop, i) => (
          <div key={i} className="hop-row">
            <div className="form-group">
              <label className="form-label">Variedad</label>
              <select
                className="form-select"
                value={hop.variety}
                onChange={e => updateHop(i, 'variety', parseInt(e.target.value))}
              >
                {HOP_VARIETIES.map((h, idx) => (
                  <option key={idx} value={idx}>
                    {h.name}{h.alpha !== null ? ` (~${h.alpha}% AA)` : ''}
                  </option>
                ))}
              </select>
            </div>

            {HOP_VARIETIES[hop.variety].alpha === null && (
              <div className="form-group">
                <label className="form-label">Alpha Ácido (%)</label>
                <input
                  type="number"
                  className="form-input"
                  value={hop.customAlpha}
                  placeholder="10.0"
                  min="1" max="25" step="0.5"
                  onChange={e => updateHop(i, 'customAlpha', e.target.value)}
                />
              </div>
            )}

            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Gramos</label>
                <input
                  type="number"
                  className="form-input"
                  value={hop.grams}
                  placeholder="28"
                  min="0"
                  onChange={e => updateHop(i, 'grams', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tiempo (min)</label>
                <input
                  type="number"
                  className="form-input"
                  value={hop.time}
                  min="0" max="120"
                  onChange={e => updateHop(i, 'time', e.target.value)}
                />
              </div>
              <div className="ibu-badge">{hopIBUs[i].toFixed(1)}<br/><span style={{fontSize:'0.65rem',fontWeight:400}}>IBU</span></div>
            </div>

            {hops.length > 1 && (
              <button className="btn-remove-row" onClick={() => removeHop(i)}>
                ✕ Eliminar esta adición
              </button>
            )}
          </div>
        ))}

        <button className="btn-add" onClick={addHop}>＋ Agregar lúpulo</button>
      </div>

      <div className="card">
        <div className="card-title">📊 Total IBU</div>

        <div className="result-box" style={{ padding: '20px', marginBottom: '10px' }}>
          <div className="result-value" style={{ color: ibuColor, fontSize: '3.5rem' }}>
            {totalIBU.toFixed(1)}
          </div>
          <div className="result-label">IBU (International Bitterness Units)</div>
          <div className="ibu-bar-wrap">
            <div className="ibu-bar" style={{ width: `${ibuPct}%` }} />
          </div>
          <div style={{ color: ibuColor, fontWeight: 700, marginTop: '8px', fontSize: '0.9rem' }}>
            {getIBUDesc(totalIBU)}
          </div>
        </div>

        <div className="info-box">
          <strong>Referencia por estilo:</strong>
          <div style={{ marginTop: '6px' }}>
            {IBU_STYLES.map((s, i) => (
              <div key={i} className="style-ref-row">
                <span>{s.name}</span>
                <span>{s.range} IBU</span>
              </div>
            ))}
          </div>
        </div>

        <div className="info-box warning" style={{ marginTop: '8px' }}>
          Cálculo con fórmula Tinseth. Los lúpulos de whirlpool/flameout (0 min) aportan amargor mínimo y no se incluyen en este modelo.
        </div>
      </div>
    </div>
  )
}
