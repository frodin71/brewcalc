import { useState, useMemo } from 'react'

// Corrección de densímetro calibrado a 60°F (15.56°C)
// Fórmula estándar (Brewer's Friend)
function correctSG(measured, tempC) {
  const tF = tempC * 9 / 5 + 32
  const correction =
    1.00130346 -
    0.000134722124 * tF +
    0.00000204052596 * tF * tF -
    0.00000000232820948 * tF * tF * tF
  const calibration =
    1.00130346 -
    0.000134722124 * 60 +
    0.00000204052596 * 60 * 60 -
    0.00000000232820948 * 60 * 60 * 60
  return measured * (correction / calibration)
}

function getDiff(measured, corrected) {
  const diff = (corrected - measured) * 1000
  if (Math.abs(diff) < 0.5) return null
  return diff > 0
    ? `+${diff.toFixed(1)} puntos (la lectura real es MÁS ALTA de lo que marcó el densímetro)`
    : `${diff.toFixed(1)} puntos (la lectura real es MÁS BAJA de lo que marcó el densímetro)`
}

export default function HydrometerCalc({ easyMode }) {
  const [measured, setMeasured] = useState('1.050')
  const [temp, setTemp]         = useState(30)

  const measuredNum = parseFloat(measured) || 1.000
  const corrected   = useMemo(() => correctSG(measuredNum, temp), [measuredNum, temp])
  const diff        = getDiff(measuredNum, corrected)
  const isHot       = temp > 20

  if (easyMode) return (
    <div>
      <div className="card">
        <div className="card-title">🌡️ Corregir lectura del densímetro</div>
        <p className="card-desc">
          El densímetro está calibrado para medir a ~16°C. Si medís el mosto caliente, la lectura está equivocada. Esto la corrige.
        </p>
      </div>

      <div className="card">
        <div className="easy-step-row">
          <span className="easy-step">1</span>
          <strong>¿Qué marcó el densímetro?</strong>
        </div>
        <input type="number" className="form-input gravity-input"
          value={measured} min="1.000" max="1.200" step="0.001"
          onChange={e => setMeasured(e.target.value)} />
      </div>

      <div className="card">
        <div className="easy-step-row">
          <span className="easy-step">2</span>
          <strong>¿A qué temperatura estaba el líquido?</strong>
        </div>
        <input type="number" className="form-input gravity-input"
          value={temp} min="10" max="100" step="1"
          onChange={e => setTemp(parseFloat(e.target.value) || 20)} />
        <input type="range" className="range-input"
          min="10" max="80" step="1" value={Math.min(temp, 80)}
          onChange={e => setTemp(parseFloat(e.target.value))} />
        <div className="range-labels"><span>10°C</span><span>80°C</span></div>
      </div>

      <div className="card">
        <div className="easy-result-hero">
          <div className="easy-result-emoji">{isHot ? '🌡️' : '❄️'}</div>
          <div className="easy-result-abv" style={{ color: '#4CAF50' }}>
            {corrected.toFixed(3)}
          </div>
          <div className="easy-result-label">densidad corregida real</div>
        </div>
        {diff && (
          <div className="info-box warning" style={{ marginTop: '12px', textAlign: 'center' }}>
            {diff}
          </div>
        )}
        {!diff && (
          <div className="info-box" style={{ marginTop: '12px', textAlign: 'center' }}>
            La temperatura es cercana a la de calibración — la corrección es mínima.
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div>
      <div className="card">
        <div className="card-title">🌡️ Corrección de densímetro por temperatura</div>
        <p className="card-desc">
          Los densímetros se calibran a 15.56°C (60°F). Mediciones a otras temperaturas requieren corrección.
        </p>
      </div>

      <div className="card">
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Lectura del densímetro</label>
            <input type="number" className="form-input"
              value={measured} min="1.000" max="1.200" step="0.001"
              onChange={e => setMeasured(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Temperatura de la muestra (°C)</label>
            <input type="number" className="form-input"
              value={temp} min="0" max="100" step="1"
              onChange={e => setTemp(parseFloat(e.target.value) || 20)} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">📊 Resultado</div>
        <div className="result-grid">
          <div className="result-box">
            <div className="result-value" style={{ color: '#888', fontSize: '2rem' }}>
              {measuredNum.toFixed(3)}
            </div>
            <div className="result-label">Lectura original</div>
          </div>
          <div className="result-box green">
            <div className="result-value" style={{ color: '#4CAF50', fontSize: '2rem' }}>
              {corrected.toFixed(3)}
            </div>
            <div className="result-label">Densidad corregida</div>
          </div>
        </div>
        {diff && (
          <div className="info-box warning" style={{ marginTop: '10px' }}>{diff}</div>
        )}
        <div className="info-box" style={{ marginTop: '8px', fontSize: '0.75rem' }}>
          Calibración estándar: 15.56°C (60°F). Fórmula: Brewer's Friend temperature correction.
        </div>
      </div>

      <div className="card">
        <div className="card-title">📖 Referencia rápida</div>
        <div style={{ overflowX: 'auto' }}>
          <table className="abv-table">
            <thead>
              <tr><th>Temperatura</th><th>Corrección aprox.</th></tr>
            </thead>
            <tbody>
              {[10, 15, 20, 25, 30, 40, 50, 60].map(t => {
                const c = correctSG(1.050, t)
                const d = ((c - 1.050) * 1000).toFixed(1)
                return (
                  <tr key={t}>
                    <td>{t}°C</td>
                    <td style={{ color: parseFloat(d) >= 0 ? '#4CAF50' : '#EF5350' }}>
                      {parseFloat(d) >= 0 ? '+' : ''}{d} puntos
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
