import { useState, useMemo } from 'react'

const SUGAR_TYPES = [
  { name: 'Dextrosa (Azúcar de maíz)',    factor: 4.5  },
  { name: 'Sacarosa (Azúcar de mesa)',     factor: 4.0  },
  { name: 'Extracto Seco de Malta (DME)', factor: 5.4  },
  { name: 'Miel',                          factor: 5.3  },
  { name: 'Jarabe de maíz (corn syrup)',   factor: 5.0  },
]

// CO₂ residual según temperatura (Tanner/Fix)
// Fórmula: CO₂ = 3.0378 - 0.050062·T_F + 0.00026555·T_F²
// T_F = T_C * 9/5 + 32
function residualCO2(tempC) {
  const tF = tempC * 9 / 5 + 32
  const val = 3.0378 - 0.050062 * tF + 0.00026555 * tF * tF
  return Math.max(0, val)
}

const CO2_STYLES = [
  { name: 'Cask / Ale Inglesa',         mid: 1.6,  range: '1.3–2.0' },
  { name: 'Ale Americano',               mid: 2.4,  range: '2.2–2.7' },
  { name: 'Lager / Pilsner',             mid: 2.6,  range: '2.4–2.9' },
  { name: 'Trigo / Weizen',              mid: 3.9,  range: '3.3–4.5' },
  { name: 'Saison / Farmhouse',          mid: 3.5,  range: '3.0–4.0' },
  { name: 'Lambic / Gueuze',             mid: 2.8,  range: '2.4–3.1' },
  { name: 'Cerveza belga',               mid: 3.2,  range: '2.8–3.6' },
  { name: 'Stout / Porter',              mid: 2.2,  range: '1.7–2.5' },
]

function getCO2Desc(co2) {
  if (co2 < 1.5) return 'Muy baja'
  if (co2 < 2.0) return 'Baja (cask/ale inglesa)'
  if (co2 < 2.5) return 'Moderada'
  if (co2 < 3.0) return 'Alta (lager/americano)'
  if (co2 < 3.8) return 'Muy alta (saison/belga)'
  return 'Extrema (weizen)'
}

export default function CarbonationCalc() {
  const [volume, setVolume]         = useState(20)
  const [temp, setTemp]             = useState(20)
  const [desiredCO2, setDesiredCO2] = useState(2.5)
  const [sugarType, setSugarType]   = useState(0)

  const { residual, sugarGrams, co2ToAdd } = useMemo(() => {
    const residual   = residualCO2(temp)
    const co2ToAdd   = Math.max(0, desiredCO2 - residual)
    const sugarGrams = co2ToAdd * SUGAR_TYPES[sugarType].factor * volume
    return { residual, sugarGrams, co2ToAdd }
  }, [volume, temp, desiredCO2, sugarType])

  const activeStyles = CO2_STYLES.filter(s => {
    const [min, max] = s.range.split('–').map(parseFloat)
    return desiredCO2 >= min && desiredCO2 <= max
  })

  return (
    <div>
      <div className="card">
        <div className="card-title">🫧 Carbonatación por priming</div>
        <p className="card-desc">
          Calcula la cantidad de azúcar para carbonatar en botella o barril por refermentación.
        </p>
      </div>

      <div className="card">
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Volumen de cerveza (L)</label>
            <input
              type="number"
              className="form-input"
              value={volume}
              min="1" max="1000"
              onChange={e => setVolume(Math.max(1, parseFloat(e.target.value) || 20))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Temperatura al embotellar (°C)</label>
            <input
              type="number"
              className="form-input"
              value={temp}
              min="0" max="30"
              onChange={e => setTemp(Math.min(30, Math.max(0, parseFloat(e.target.value) || 20)))}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Tipo de azúcar de priming</label>
          <select
            className="form-select"
            value={sugarType}
            onChange={e => setSugarType(parseInt(e.target.value))}
          >
            {SUGAR_TYPES.map((s, i) => (
              <option key={i} value={i}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            CO₂ deseado:{' '}
            <strong style={{ color: '#F5A623' }}>{desiredCO2.toFixed(1)} vol</strong>
            {' '}— {getCO2Desc(desiredCO2)}
          </label>
          <input
            type="range"
            className="range-input"
            min="1.0" max="5.0" step="0.1"
            value={desiredCO2}
            onChange={e => setDesiredCO2(parseFloat(e.target.value))}
          />
          <div className="range-labels">
            <span>1.0 vol</span>
            <span></span>
            <span>5.0 vol</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">🍺 Estilos de referencia — toca para aplicar</div>
        <div className="style-grid">
          {CO2_STYLES.map((s, i) => (
            <button
              key={i}
              className={`style-chip ${desiredCO2 === s.mid ? 'active' : ''}`}
              onClick={() => setDesiredCO2(s.mid)}
            >
              <span>{s.name}</span>
              <span className="style-range">{s.range} vol</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title">✅ Resultado</div>

        <div className="result-box green" style={{ marginBottom: '10px', padding: '20px' }}>
          <div className="result-value" style={{ color: '#4CAF50', fontSize: '3rem' }}>
            {sugarGrams.toFixed(1)} g
          </div>
          <div className="result-unit" style={{ fontSize: '0.9rem', marginTop: '4px' }}>
            {SUGAR_TYPES[sugarType].name}
          </div>
        </div>

        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">CO₂ residual</span>
            <span className="info-value">{residual.toFixed(2)} vol</span>
          </div>
          <div className="info-item">
            <span className="info-label">CO₂ a agregar</span>
            <span className="info-value">{co2ToAdd.toFixed(2)} vol</span>
          </div>
          <div className="info-item">
            <span className="info-label">Por litro</span>
            <span className="info-value">
              {volume > 0 ? (sugarGrams / volume).toFixed(2) : '—'} g/L
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Por botella 330 mL</span>
            <span className="info-value">
              {(sugarGrams / volume * 0.33).toFixed(2)} g
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Por botella 500 mL</span>
            <span className="info-value">
              {(sugarGrams / volume * 0.5).toFixed(2)} g
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Equivalente en oz</span>
            <span className="info-value">
              {(sugarGrams / 28.35).toFixed(2)} oz
            </span>
          </div>
        </div>

        {activeStyles.length > 0 && (
          <div className="info-box" style={{ marginTop: '10px', textAlign: 'center' }}>
            ✅ <strong>{desiredCO2.toFixed(1)} vol</strong> es adecuado para:{' '}
            {activeStyles.map(s => s.name).join(', ')}
          </div>
        )}

        <div className="info-box warning" style={{ marginTop: '8px' }}>
          ⚠️ El CO₂ residual depende de la temperatura más alta alcanzada por la cerveza durante la fermentación, no necesariamente la temperatura actual.
        </div>
      </div>
    </div>
  )
}
