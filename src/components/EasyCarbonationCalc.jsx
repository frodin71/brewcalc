import { useState, useMemo } from 'react'

// CO₂ residual según temperatura
function residualCO2(tempC) {
  const tF = tempC * 9 / 5 + 32
  return Math.max(0, 3.0378 - 0.050062 * tF + 0.00026555 * tF * tF)
}

const LEVELS = [
  {
    id: 'baja',
    label: 'Baja',
    emoji: '😌',
    desc: 'Suave, casi sin burbuja. Estilo inglés.',
    co2: 1.8,
    color: '#4FC3F7',
  },
  {
    id: 'media',
    label: 'Media',
    emoji: '🍺',
    desc: 'La carbonatación típica de una cerveza.',
    co2: 2.5,
    color: '#4CAF50',
  },
  {
    id: 'alta',
    label: 'Alta',
    emoji: '🫧',
    desc: 'Muy burbujeante. Estilo lager o trigo.',
    co2: 3.3,
    color: '#F5A623',
  },
]

const BOTTLE_SIZES = [
  { label: '330 mL',  ml: 330  },
  { label: '500 mL',  ml: 500  },
  { label: '750 mL',  ml: 750  },
  { label: '1 L',     ml: 1000 },
]

const TEMP_OPTIONS = [
  { label: 'Temperatura ambiente (~20°C)',        temp: 20 },
  { label: 'Fermentó en frío (~12°C)',             temp: 12 },
  { label: 'Mixta: primero ambiente, luego frío', temp: 16 },
]

export default function EasyCarbonationCalc() {
  const [liters, setLiters]         = useState(20)
  const [levelId, setLevelId]       = useState('media')
  const [bottleIdx, setBottleIdx]   = useState(0)
  const [tempIdx, setTempIdx]       = useState(0)
  const [dissolveML, setDissolveML] = useState(200)

  const level      = LEVELS.find(l => l.id === levelId)
  const bottleML   = BOTTLE_SIZES[bottleIdx].ml
  const temp       = TEMP_OPTIONS[tempIdx].temp

  const { sugarG, mlPerBottle, bottleCount } = useMemo(() => {
    const residual  = residualCO2(temp)
    const co2ToAdd  = Math.max(0, level.co2 - residual)
    // sucrose factor: 4.0 g per CO2 volume per liter
    const sugarG    = co2ToAdd * 4.0 * liters
    // mL de solución por botella = dissolveML × bottleML / (liters × 1000)
    const mlPerBottle = (dissolveML * bottleML) / (liters * 1000)
    const bottleCount = Math.floor((liters * 1000) / bottleML)
    return { sugarG, mlPerBottle, bottleCount }
  }, [liters, level, temp, dissolveML, bottleML])

  return (
    <div>
      <div className="card">
        <div className="card-title">🫧 ¿Cuánto azúcar para carbonatar?</div>
        <p className="card-desc">
          Agrega azúcar antes de embotellar para que la cerveza genere gas dentro de la botella.
        </p>
      </div>

      <div className="card">
        <div className="easy-step-row">
          <span className="easy-step">1</span>
          <strong>¿Cuántos litros de cerveza tienes?</strong>
        </div>
        <input
          type="number"
          className="form-input"
          style={{ fontSize: '1.5rem', textAlign: 'center', fontWeight: 700 }}
          value={liters}
          min="1" max="500"
          onChange={e => setLiters(Math.max(1, parseFloat(e.target.value) || 20))}
        />
      </div>

      <div className="card">
        <div className="easy-step-row">
          <span className="easy-step">2</span>
          <strong>¿Dónde fermentaste?</strong>
        </div>
        <div className="easy-option-row">
          {TEMP_OPTIONS.map((t, i) => (
            <button
              key={i}
              className={`easy-option-btn ${tempIdx === i ? 'active' : ''}`}
              onClick={() => setTempIdx(i)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="easy-step-row">
          <span className="easy-step">3</span>
          <strong>¿Qué carbonatación quieres?</strong>
        </div>
        <div className="level-grid">
          {LEVELS.map(l => (
            <button
              key={l.id}
              className={`level-btn ${levelId === l.id ? 'active' : ''}`}
              style={levelId === l.id ? { borderColor: l.color, background: `${l.color}18` } : {}}
              onClick={() => setLevelId(l.id)}
            >
              <span className="level-emoji">{l.emoji}</span>
              <span className="level-label" style={levelId === l.id ? { color: l.color } : {}}>
                {l.label}
              </span>
              <span className="level-desc">{l.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="easy-step-row">
          <span className="easy-step">4</span>
          <strong>¿Qué tamaño de botella usas?</strong>
        </div>
        <div className="easy-pill-row">
          {BOTTLE_SIZES.map((b, i) => (
            <button
              key={i}
              className={`easy-pill ${bottleIdx === i ? 'active' : ''}`}
              onClick={() => setBottleIdx(i)}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {sugarG > 0 ? (
        <div className="card">
          <div className="card-title" style={{ color: level.color }}>✅ Lo que tienes que hacer</div>

          <div className="easy-steps-result">
            <div className="easy-step-result-item">
              <span className="easy-step-result-num">1</span>
              <div>
                Pesa <strong style={{ color: level.color, fontSize: '1.2rem' }}>{sugarG.toFixed(1)} g</strong> de azúcar de mesa
              </div>
            </div>

            <div className="easy-step-result-item">
              <span className="easy-step-result-num">2</span>
              <div>
                Disuélvela en{' '}
                <strong style={{ color: level.color }}>{dissolveML} mL</strong>{' '}
                de agua hervida y deja enfriar
                <div style={{ marginTop: '8px' }}>
                  <label className="form-label">Cantidad de agua (mL)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={dissolveML}
                    min="100" max="500" step="50"
                    onChange={e => setDissolveML(Math.max(100, parseFloat(e.target.value) || 200))}
                    style={{ maxWidth: '140px' }}
                  />
                </div>
              </div>
            </div>

            <div className="easy-step-result-item">
              <span className="easy-step-result-num">3</span>
              <div>
                Con una jeringa, agrega{' '}
                <strong style={{ color: level.color, fontSize: '1.2rem' }}>
                  {mlPerBottle.toFixed(1)} mL
                </strong>{' '}
                de la solución a cada botella de {BOTTLE_SIZES[bottleIdx].label}
              </div>
            </div>

            <div className="easy-step-result-item">
              <span className="easy-step-result-num">4</span>
              <div>
                Tapa y deja reposar <strong>2 semanas a temperatura ambiente</strong>
              </div>
            </div>
          </div>

          <div className="info-grid" style={{ marginTop: '12px' }}>
            <div className="info-item">
              <span className="info-label">Botellas estimadas</span>
              <span className="info-value">{bottleCount}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Azúcar por botella</span>
              <span className="info-value">
                {(sugarG / bottleCount).toFixed(1)} g
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="info-box" style={{ textAlign: 'center' }}>
            La cerveza ya tiene suficiente CO₂ disuelto para esta carbonatación — no necesitas agregar azúcar.
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-title">💡 ¿Por qué funciona esto?</div>
        <div className="info-box">
          La levadura que quedó en tu cerveza se "come" el azúcar que agregas y produce CO₂.
          Como la botella está tapada, el gas queda atrapado y carbonata la cerveza.
          Por eso es importante que la fermentación principal esté <strong>completamente terminada</strong> antes de embotellar.
        </div>
      </div>
    </div>
  )
}
