import { useState, useMemo } from 'react'
import NumInput from './NumInput'

// Palmer metric: Strike = (0.41 / ratio_L_kg) × (Tmash - Tgrain) + Tmash
function strikeTemp(tmash, tgrain, ratio) {
  return (0.41 / ratio) * (tmash - tgrain) + tmash
}

const RATIO_PRESETS = [
  { label: 'Espeso (2.5 L/kg)',  ratio: 2.5, desc: 'Más extracto, menos conversión' },
  { label: 'Normal (3 L/kg)',    ratio: 3.0, desc: 'El más común en homebrewing' },
  { label: 'Delgado (4 L/kg)',   ratio: 4.0, desc: 'Mejor conversión, más azúcar' },
]

export default function StrikeWaterCalc({ easyMode }) {
  const [tmash,  setTmash]  = useState(67)
  const [tgrain, setTgrain] = useState(20)
  const [ratio,  setRatio]  = useState(3.0)
  const [ratioPreset, setRatioPreset] = useState(1)

  const strike = useMemo(() => strikeTemp(tmash, tgrain, ratio), [tmash, tgrain, ratio])

  const applyPreset = (i) => {
    setRatioPreset(i)
    setRatio(RATIO_PRESETS[i].ratio)
  }

  if (easyMode) return (
    <div>
      <div className="card">
        <div className="card-title">🌡️ ¿A qué temperatura calentar el agua?</div>
        <p className="card-desc">
          Si calientas el agua a la temperatura del mash, al mezclar con el grano frío la temperatura bajará. Esta calculadora dice a cuánto calentar para compensar.
        </p>
      </div>

      <div className="card">
        <div className="easy-step-row">
          <span className="easy-step">1</span>
          <strong>¿A qué temperatura quieres hacer el mash?</strong>
        </div>
        <input type="number" className="form-input gravity-input"
          value={tmash} min="60" max="72" step="0.5"
          onChange={e => setTmash(parseFloat(e.target.value) || 67)} />
        <input type="range" className="range-input"
          min="62" max="70" step="0.5" value={tmash}
          onChange={e => setTmash(parseFloat(e.target.value))} />
        <div className="range-labels">
          <span>62°C (seco)</span>
          <span>68°C (dulce)</span>
        </div>
      </div>

      <div className="card">
        <div className="easy-step-row">
          <span className="easy-step">2</span>
          <strong>¿Dónde está guardado el grano?</strong>
        </div>
        <div className="easy-option-row">
          {[
            { label: 'A temperatura ambiente (~20°C)', temp: 20 },
            { label: 'Recién salido del frío (~10°C)',  temp: 10 },
          ].map((o, i) => (
            <button key={i}
              className={`easy-option-btn ${tgrain === o.temp ? 'active' : ''}`}
              onClick={() => setTgrain(o.temp)}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="easy-result-hero">
          <div className="easy-result-emoji">🚰</div>
          <div className="easy-result-abv" style={{ color: '#F5A623' }}>
            {strike.toFixed(1)}°C
          </div>
          <div className="easy-result-label">temperatura del agua antes de agregar el grano</div>
        </div>
        <div className="info-box" style={{ marginTop: '12px', textAlign: 'center' }}>
          Calienta el agua a <strong>{strike.toFixed(1)}°C</strong> y al mezclar con el grano llegarás a <strong>{tmash}°C</strong>
        </div>
      </div>

      <div className="card">
        <div className="card-title">💡 ¿Por qué importa?</div>
        <div className="info-box">
          Las enzimas que convierten el almidón en azúcar trabajan en un rango estrecho. Si el agua está muy fría o muy caliente, la conversión no será óptima.
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <div className="card">
        <div className="card-title">🌡️ Temperatura de Strike Water</div>
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Temp. objetivo del mash (°C)</label>
            <NumInput
              value={tmash}
              min={60} max={75}
              onChange={setTmash}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Temp. del grano (°C)</label>
            <NumInput
              value={tgrain}
              min={5} max={30}
              onChange={setTgrain}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Relación agua/grano</label>
          <div className="easy-option-row" style={{ marginBottom: '8px' }}>
            {RATIO_PRESETS.map((p, i) => (
              <button key={i}
                className={`easy-option-btn ${ratioPreset === i ? 'active' : ''}`}
                onClick={() => applyPreset(i)}>
                {p.label}
              </button>
            ))}
          </div>
          <NumInput
            value={ratio}
            min={2} max={6}
            onChange={v => { setRatio(v); setRatioPreset(-1) }}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-title">📊 Resultado</div>
        <div className="result-box amber" style={{ padding: '20px' }}>
          <div className="result-value" style={{ color: '#F5A623', fontSize: '3rem' }}>
            {strike.toFixed(1)}°C
          </div>
          <div className="result-label">temperatura del agua de strike</div>
        </div>
        <div className="info-grid" style={{ marginTop: '10px' }}>
          <div className="info-item">
            <span className="info-label">Temp. mash objetivo</span>
            <span className="info-value">{tmash}°C</span>
          </div>
          <div className="info-item">
            <span className="info-label">Relación agua/grano</span>
            <span className="info-value">{ratio} L/kg</span>
          </div>
        </div>
        <div className="info-box" style={{ marginTop: '10px' }}>
          Fórmula Palmer (métrico): T_strike = (0.41 / ratio) × (T_mash − T_grano) + T_mash
        </div>
      </div>
    </div>
  )
}
