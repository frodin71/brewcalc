import { useState, useMemo } from 'react'

function getABVInfo(abv) {
  if (abv < 0.5)  return { emoji: '💧', label: 'Sin alcohol', color: '#4FC3F7' }
  if (abv < 3.5)  return { emoji: '🥤', label: 'Session — muy suave', color: '#4FC3F7' }
  if (abv < 5.0)  return { emoji: '🍺', label: 'Cerveza estándar', color: '#4CAF50' }
  if (abv < 6.5)  return { emoji: '🍺', label: 'Un poco más fuerte de lo normal', color: '#F5A623' }
  if (abv < 8.5)  return { emoji: '🔥', label: 'Bastante fuerte — bébela con calma', color: '#FF9800' }
  return           { emoji: '💀', label: 'Muy fuerte — ojo con esta', color: '#EF5350' }
}

function getAttInfo(att) {
  if (att < 60) return { label: 'Fermentación incompleta — revisa tu levadura', color: '#EF5350' }
  if (att < 75) return { label: 'Fermentación normal', color: '#F5A623' }
  if (att < 85) return { label: 'Buena fermentación', color: '#4CAF50' }
  return         { label: 'Fermentación muy completa — cerveza seca', color: '#4FC3F7' }
}

export default function EasyAbvCalc() {
  const [og, setOG] = useState('1.050')
  const [fg, setFG] = useState('1.010')

  const ogNum = parseFloat(og) || 1.000
  const fgNum = parseFloat(fg) || 1.000
  const valid  = ogNum > 1.000 && fgNum >= 1.000 && fgNum < ogNum

  const results = useMemo(() => {
    if (!valid) return null
    const abv         = (ogNum - fgNum) * 131.25
    const attenuation = ((ogNum - fgNum) / (ogNum - 1)) * 100
    return { abv, attenuation }
  }, [ogNum, fgNum, valid])

  const abvInfo = results ? getABVInfo(results.abv) : null
  const attInfo = results ? getAttInfo(results.attenuation) : null

  return (
    <div>
      <div className="card">
        <div className="card-title">📊 ¿Cuánto alcohol tiene mi cerveza?</div>
        <p className="card-desc">
          Necesitas dos mediciones con tu densímetro: una antes de fermentar y otra al terminar.
        </p>
      </div>

      <div className="card">
        <div className="easy-gravity-block">
          <div className="easy-gravity-label">
            <span className="easy-step">1</span>
            <div>
              <strong>Densidad inicial</strong>
              <div className="easy-hint">La mediste antes de agregar la levadura</div>
            </div>
          </div>
          <input
            type="number"
            className="form-input gravity-input"
            value={og}
            min="1.000" max="1.200" step="0.001"
            onChange={e => setOG(e.target.value)}
          />
          <input
            type="range"
            className="range-input"
            min="1.020" max="1.120" step="0.001"
            value={Math.min(Math.max(ogNum, 1.020), 1.120)}
            onChange={e => setOG(e.target.value)}
          />
          <div className="range-labels">
            <span>Cerveza ligera</span>
            <span>Cerveza fuerte</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="easy-gravity-block">
          <div className="easy-gravity-label">
            <span className="easy-step">2</span>
            <div>
              <strong>Densidad final</strong>
              <div className="easy-hint">La mediste cuando terminó de fermentar</div>
            </div>
          </div>
          <input
            type="number"
            className="form-input gravity-input"
            value={fg}
            min="1.000" max="1.060" step="0.001"
            onChange={e => setFG(e.target.value)}
          />
          <input
            type="range"
            className="range-input"
            min="1.000" max="1.030" step="0.001"
            value={Math.min(Math.max(fgNum, 1.000), 1.030)}
            onChange={e => setFG(e.target.value)}
          />
          <div className="range-labels">
            <span>Muy fermentada</span>
            <span>Poco fermentada</span>
          </div>
        </div>
      </div>

      {results ? (
        <div className="card">
          <div className="easy-result-hero">
            <div className="easy-result-emoji">{abvInfo.emoji}</div>
            <div className="easy-result-abv" style={{ color: abvInfo.color }}>
              {results.abv.toFixed(1)}%
            </div>
            <div className="easy-result-label">de alcohol</div>
            <div className="easy-result-desc" style={{ color: abvInfo.color }}>
              {abvInfo.label}
            </div>
          </div>

          <div className="easy-att-block">
            <div className="easy-att-label">
              Fermentación: <strong style={{ color: attInfo.color }}>{results.attenuation.toFixed(0)}%</strong>
            </div>
            <div className="att-bar-wrap">
              <div className="att-bar" style={{ width: `${Math.min(100, results.attenuation)}%` }} />
            </div>
            <div className="easy-hint" style={{ marginTop: '6px' }}>{attInfo.label}</div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="info-box" style={{ textAlign: 'center' }}>
            La densidad inicial debe ser mayor que la final
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-title">❓ ¿Cómo mido la densidad?</div>
        <div className="info-box">
          Usa un <strong>densímetro</strong> (instrumento de vidrio) o un <strong>refractómetro</strong>.
          Toma una muestra de tu mosto o cerveza, ponla en la probeta y lee el valor donde corta la superficie del líquido.
        </div>
      </div>
    </div>
  )
}
