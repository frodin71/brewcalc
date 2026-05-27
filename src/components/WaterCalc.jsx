import { useState, useMemo } from 'react'

// Absorción del grano: ~0.8 L/kg
// Agua de mash = grainKg × ratio
// Evaporación = boilRate × (boilMin / 60)
// Preboil = postBoil + evaporation + trubLoss
// Agua sparge = preboil - mashWater + grainAbsorption
// Total = mashWater + spargeWater

function calcWater(postBoil, grainKg, ratio, boilMin, boilRate, trub) {
  const grainAbsorption = grainKg * 0.8
  const evaporation     = boilRate * (boilMin / 60)
  const preboil         = postBoil + evaporation + trub
  const mashWater       = grainKg * ratio
  const spargeWater     = Math.max(0, preboil - mashWater + grainAbsorption)
  const total           = mashWater + spargeWater
  return { grainAbsorption, evaporation, preboil, mashWater, spargeWater, total }
}

export default function WaterCalc({ easyMode }) {
  const [postBoil,  setPostBoil]  = useState(20)
  const [grainKg,   setGrainKg]   = useState(5)
  const [ratio,     setRatio]     = useState(3)
  const [boilMin,   setBoilMin]   = useState(60)
  const [boilRate,  setBoilRate]  = useState(3.5)
  const [trub,      setTrub]      = useState(0.5)

  const r = useMemo(
    () => calcWater(postBoil, grainKg, ratio, boilMin, boilRate, trub),
    [postBoil, grainKg, ratio, boilMin, boilRate, trub]
  )

  if (easyMode) return (
    <div>
      <div className="card">
        <div className="card-title">💧 ¿Cuánta agua necesito?</div>
        <p className="card-desc">
          Calculá cuánta agua poner en el mash y cuánta para el sparge, considerando que el grano absorbe agua y parte se evapora en el hervido.
        </p>
      </div>

      <div className="card">
        <div className="easy-step-row"><span className="easy-step">1</span>
          <strong>¿Cuántos litros de cerveza querés terminar?</strong>
        </div>
        <input type="number" className="form-input"
          style={{ fontSize: '1.5rem', textAlign: 'center', fontWeight: 700 }}
          value={postBoil} min="5" max="200"
          onChange={e => setPostBoil(Math.max(1, parseFloat(e.target.value) || 20))} />
      </div>

      <div className="card">
        <div className="easy-step-row"><span className="easy-step">2</span>
          <strong>¿Cuántos kg de grano usás?</strong>
        </div>
        <input type="number" className="form-input"
          style={{ fontSize: '1.5rem', textAlign: 'center', fontWeight: 700 }}
          value={grainKg} min="0.5" max="50" step="0.5"
          onChange={e => setGrainKg(Math.max(0.5, parseFloat(e.target.value) || 5))} />
      </div>

      <div className="card">
        <div className="card-title" style={{ color: '#4CAF50' }}>✅ Agua necesaria</div>
        <div className="easy-steps-result">
          <div className="easy-step-result-item">
            <span className="easy-step-result-num">1</span>
            <div>
              Agua de <strong>mash</strong>:{' '}
              <strong style={{ color: '#4FC3F7', fontSize: '1.2rem' }}>{r.mashWater.toFixed(1)} L</strong>
              <div className="easy-hint">A ~75°C para llegar a 67°C con el grano</div>
            </div>
          </div>
          <div className="easy-step-result-item">
            <span className="easy-step-result-num">2</span>
            <div>
              Agua de <strong>sparge</strong>:{' '}
              <strong style={{ color: '#F5A623', fontSize: '1.2rem' }}>{r.spargeWater.toFixed(1)} L</strong>
              <div className="easy-hint">A ~76°C para lavar el grano</div>
            </div>
          </div>
        </div>
        <div className="result-box amber" style={{ marginTop: '12px', padding: '16px' }}>
          <div className="result-value" style={{ color: '#F5A623' }}>
            {r.total.toFixed(1)} L
          </div>
          <div className="result-label">agua total necesaria</div>
        </div>
        <div className="info-grid" style={{ marginTop: '10px' }}>
          <div className="info-item">
            <span className="info-label">Absorción del grano</span>
            <span className="info-value">−{r.grainAbsorption.toFixed(1)} L</span>
          </div>
          <div className="info-item">
            <span className="info-label">Evaporación (~60 min)</span>
            <span className="info-value">−{r.evaporation.toFixed(1)} L</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <div className="card">
        <div className="card-title">💧 Calculadora de agua del lote</div>
      </div>

      <div className="card">
        <div className="card-title">⚙️ Parámetros</div>
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Volumen final post-hervor (L)</label>
            <input type="number" className="form-input"
              value={postBoil} min="1"
              onChange={e => setPostBoil(Math.max(1, parseFloat(e.target.value) || 20))} />
          </div>
          <div className="form-group">
            <label className="form-label">Cantidad de grano (kg)</label>
            <input type="number" className="form-input"
              value={grainKg} min="0.5" step="0.5"
              onChange={e => setGrainKg(Math.max(0.5, parseFloat(e.target.value) || 5))} />
          </div>
          <div className="form-group">
            <label className="form-label">Relación agua/grano (L/kg)</label>
            <input type="number" className="form-input"
              value={ratio} min="2" max="6" step="0.5"
              onChange={e => setRatio(parseFloat(e.target.value) || 3)} />
          </div>
          <div className="form-group">
            <label className="form-label">Tiempo de hervido (min)</label>
            <input type="number" className="form-input"
              value={boilMin} min="30" max="120" step="15"
              onChange={e => setBoilMin(parseFloat(e.target.value) || 60)} />
          </div>
          <div className="form-group">
            <label className="form-label">Tasa de evaporación (L/hr)</label>
            <input type="number" className="form-input"
              value={boilRate} min="1" max="8" step="0.5"
              onChange={e => setBoilRate(parseFloat(e.target.value) || 3.5)} />
          </div>
          <div className="form-group">
            <label className="form-label">Pérdida por trub (L)</label>
            <input type="number" className="form-input"
              value={trub} min="0" max="5" step="0.5"
              onChange={e => setTrub(parseFloat(e.target.value) || 0.5)} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">📊 Resultado</div>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Agua de mash</span>
            <span className="info-value" style={{ color: '#4FC3F7' }}>{r.mashWater.toFixed(1)} L</span>
          </div>
          <div className="info-item">
            <span className="info-label">Agua de sparge</span>
            <span className="info-value" style={{ color: '#F5A623' }}>{r.spargeWater.toFixed(1)} L</span>
          </div>
          <div className="info-item">
            <span className="info-label">Volumen pre-hervor</span>
            <span className="info-value">{r.preboil.toFixed(1)} L</span>
          </div>
          <div className="info-item">
            <span className="info-label">Absorción del grano</span>
            <span className="info-value">−{r.grainAbsorption.toFixed(1)} L</span>
          </div>
          <div className="info-item">
            <span className="info-label">Evaporación</span>
            <span className="info-value">−{r.evaporation.toFixed(1)} L</span>
          </div>
          <div className="info-item">
            <span className="info-label">Pérdida trub</span>
            <span className="info-value">−{trub.toFixed(1)} L</span>
          </div>
        </div>
        <div className="result-box amber" style={{ marginTop: '10px', padding: '16px' }}>
          <div className="result-value" style={{ color: '#F5A623' }}>
            {r.total.toFixed(1)} L
          </div>
          <div className="result-label">agua total necesaria</div>
        </div>
      </div>
    </div>
  )
}
