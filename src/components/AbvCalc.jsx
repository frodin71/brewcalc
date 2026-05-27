import { useState, useMemo } from 'react'

// ABV = (OG − FG) × 131.25
// Atenuación aparente = (OG − FG) / (OG − 1) × 100
// Calorías estimadas por 355 mL (12 oz): de alcohol + carbohidratos residuales
function calcResults(og, fg) {
  const ogValid = og > 1.000 && og <= 1.200
  const fgValid = fg >= 1.000 && fg < og

  if (!ogValid || !fgValid) return null

  const abv         = (og - fg) * 131.25
  const attenuation = ((og - fg) / (og - 1.000)) * 100
  const points      = (og - fg) * 1000

  // Calorías por 355 mL (12 oz): alcohol + extracto residual
  const alcoholCal  = abv * 0.789 * 7.09 * 3.55   // g/ml × g × kcal/g × dl
  const carbCal     = (fg - 1.000) * 1000 * 3.55 * 4 * 0.82 // residual extract × kcal/g × dl × correction
  const calories    = alcoholCal + carbCal

  return { abv, attenuation, points, calories }
}

function getABVDesc(abv) {
  if (abv < 3.5)  return 'Session — muy baja graduación'
  if (abv < 4.5)  return 'Estándar ligera'
  if (abv < 5.5)  return 'Estándar'
  if (abv < 7.0)  return 'Alta graduación'
  if (abv < 9.0)  return 'Muy alta'
  if (abv < 12.0) return 'Extrema — barleywine / imperial'
  return 'Altísima graduación'
}

function getABVColor(abv) {
  if (abv < 4.0)  return '#4FC3F7'
  if (abv < 6.0)  return '#4CAF50'
  if (abv < 8.0)  return '#F5A623'
  return '#EF5350'
}

function getAttColor(att) {
  if (att < 60) return '#EF5350'
  if (att < 75) return '#F5A623'
  if (att < 85) return '#4CAF50'
  return '#4FC3F7'
}

const STYLE_TABLE = [
  ['Session Beer',       '< 3.5%'],
  ['Lager / Pilsner',   '4.0–5.5%'],
  ['Pale Ale / APA',    '4.5–6.2%'],
  ['IPA americano',     '5.5–7.5%'],
  ['Amber / Rojo',      '5.0–6.5%'],
  ['Porter / Stout',    '4.5–8.0%'],
  ['Double IPA',        '7.5–10.0%'],
  ['Belgian Strong Ale','7.0–11.0%'],
  ['Imperial Stout',    '8.0–13.0%'],
  ['Barleywine',        '8.0–14.0%'],
]

export default function AbvCalc() {
  const [og, setOG] = useState('1.050')
  const [fg, setFG] = useState('1.010')

  const ogNum = parseFloat(og) || 1.000
  const fgNum = parseFloat(fg) || 1.000

  const results = useMemo(() => calcResults(ogNum, fgNum), [ogNum, fgNum])

  const abvColor  = results ? getABVColor(results.abv)          : '#888'
  const attColor  = results ? getAttColor(results.attenuation)  : '#888'
  const attPct    = results ? Math.min(100, results.attenuation) : 0

  return (
    <div>
      <div className="card">
        <div className="card-title">📊 Calculadora de ABV</div>
        <p className="card-desc">
          Ingresa la densidad original (OG) y la densidad final (FG) para calcular el alcohol.
        </p>
      </div>

      <div className="card">
        <div className="gravity-block">
          <label className="form-label">OG — Densidad Original (antes de fermentar)</label>
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
            min="1.000" max="1.150" step="0.001"
            value={ogNum}
            onChange={e => setOG(e.target.value)}
          />
        </div>

        <div className="gravity-arrow">↓ fermenta ↓</div>

        <div className="gravity-block" style={{ marginTop: '4px' }}>
          <label className="form-label">FG — Densidad Final (después de fermentar)</label>
          <input
            type="number"
            className="form-input gravity-input"
            value={fg}
            min="1.000" max="1.200" step="0.001"
            onChange={e => setFG(e.target.value)}
          />
          <input
            type="range"
            className="range-input"
            min="1.000" max="1.060" step="0.001"
            value={Math.min(fgNum, 1.060)}
            onChange={e => setFG(e.target.value)}
          />
        </div>
      </div>

      {results ? (
        <>
          <div className="card">
            <div className="abv-display">
              <div className="abv-value" style={{ color: abvColor }}>
                {results.abv.toFixed(2)}%
              </div>
              <div className="abv-label">ABV (Alcohol por Volumen)</div>
              <div className="abv-desc" style={{ color: abvColor }}>
                {getABVDesc(results.abv)}
              </div>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Atenuación aparente</span>
                <span className="info-value" style={{ color: attColor }}>
                  {results.attenuation.toFixed(1)}%
                </span>
                <div className="att-bar-wrap">
                  <div className="att-bar" style={{ width: `${attPct}%` }} />
                </div>
              </div>
              <div className="info-item">
                <span className="info-label">Puntos fermentados</span>
                <span className="info-value">{results.points.toFixed(1)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Calorías* (355 mL)</span>
                <span className="info-value">{results.calories.toFixed(0)} kcal</span>
              </div>
              <div className="info-item">
                <span className="info-label">Alcohol (g/L)</span>
                <span className="info-value">{(results.abv * 7.894).toFixed(1)}</span>
              </div>
            </div>

            <div className="info-box" style={{ marginTop: '10px', fontSize: '0.75rem' }}>
              * Calorías estimadas. Incluye alcohol + extracto residual fermentable.
            </div>
          </div>
        </>
      ) : (
        <div className="card">
          <div className="info-box" style={{ textAlign: 'center' }}>
            Ingresa valores válidos: OG {'>'} FG, ambos entre 1.000 y 1.200
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-title">📖 ABV por estilo</div>
        <table className="abv-table">
          <thead>
            <tr>
              <th>Estilo</th>
              <th style={{ textAlign: 'right' }}>ABV típico</th>
            </tr>
          </thead>
          <tbody>
            {STYLE_TABLE.map(([style, abv], i) => (
              <tr key={i}>
                <td>{style}</td>
                <td>{abv}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
