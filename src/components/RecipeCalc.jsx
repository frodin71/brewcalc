import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import NumInput from './NumInput'

const GRAIN_TYPES = [
  { name: 'Malta Pale 2-Row',         ppg: 37 },
  { name: 'Malta Pilsner',             ppg: 37 },
  { name: 'Malta Munich',              ppg: 35 },
  { name: 'Malta Vienna',              ppg: 36 },
  { name: 'Malta de Trigo (Wheat)',    ppg: 38 },
  { name: 'Caramel / Crystal 20L',     ppg: 35 },
  { name: 'Caramel / Crystal 60L',     ppg: 34 },
  { name: 'Caramel / Crystal 120L',    ppg: 33 },
  { name: 'Malta Chocolate',           ppg: 28 },
  { name: 'Malta Negra (Black Patent)', ppg: 25 },
  { name: 'Cebada Tostada (Roasted)',  ppg: 25 },
  { name: 'Avena (Oats)',              ppg: 33 },
  { name: 'Maíz en Copos',             ppg: 37 },
  { name: 'Arroz en Copos',            ppg: 37 },
  { name: 'Extracto Seco Malta (DME)', ppg: 45 },
]

// Imperial gravity_points = lbs * PPG * eff / gallons
// Metric equivalent: kg * PPG * eff * (2.205 / 0.2642) / L = kg * PPG * eff * 8.345 / L
function calcOG(grains, batchL, efficiency) {
  const totalPoints = grains.reduce((sum, g) => {
    const kg = parseFloat(g.kg) || 0
    return sum + kg * GRAIN_TYPES[g.type].ppg * (efficiency / 100) * 8.345
  }, 0)
  return 1 + totalPoints / batchL / 1000
}

function getStyleGuess(og) {
  if (og < 1.010) return '—'
  if (og < 1.030) return 'Session ligera'
  if (og < 1.040) return 'Session Ale / Lager ligera'
  if (og < 1.050) return 'Pale Ale / Kölsch'
  if (og < 1.060) return 'IPA / Amber Ale'
  if (og < 1.070) return 'Strong Ale / Porter'
  if (og < 1.080) return 'Double IPA / Imperial Stout'
  if (og < 1.100) return 'Barleywine / Imperial'
  return 'High Gravity extremo'
}

function getOGColor(og) {
  if (og < 1.040) return '#4FC3F7'
  if (og < 1.060) return '#4CAF50'
  if (og < 1.080) return '#F5A623'
  return '#EF5350'
}

export default function RecipeCalc() {
  const { saveRecipe } = useApp()
  const [grains, setGrains]         = useState([{ type: 0, kg: '' }, { type: 5, kg: '' }])
  const [batchSize, setBatchSize]   = useState(20)
  const [efficiency, setEfficiency] = useState(75)
  const [copied, setCopied]         = useState(false)
  const [savedMsg, setSavedMsg]     = useState(false)

  const addGrain    = () => setGrains([...grains, { type: 0, kg: '' }])
  const removeGrain = (i) => setGrains(grains.filter((_, idx) => idx !== i))
  const updateGrain = (i, field, value) => {
    const copy = [...grains]
    copy[i] = { ...copy[i], [field]: value }
    setGrains(copy)
  }

  const { og, totalKg } = useMemo(() => {
    const og = calcOG(grains, batchSize, efficiency)
    const totalKg = grains.reduce((s, g) => s + (parseFloat(g.kg) || 0), 0)
    return { og, totalKg }
  }, [grains, batchSize, efficiency])

  const ogColor = getOGColor(og)
  const kgPerL  = totalKg > 0 ? (totalKg / batchSize).toFixed(3) : '—'

  const handleCopyList = () => {
    const lines = [
      `🍺 LISTA DE COMPRAS — BrewCalc`,
      `Lote: ${batchSize}L | Eficiencia: ${efficiency}% | OG: ${og.toFixed(3)}`,
      ``,
      `MALTAS:`,
      ...grains
        .filter(g => parseFloat(g.kg) > 0)
        .map(g => `  • ${GRAIN_TYPES[g.type].name}: ${g.kg} kg`),
      `  ─────────────────`,
      `  TOTAL: ${totalKg.toFixed(2)} kg`,
    ]
    navigator.clipboard?.writeText(lines.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleSaveRecipe = () => {
    saveRecipe({
      name: `Receta ${batchSize}L — OG ${og.toFixed(3)}`,
      batchSize, efficiency,
      og: og.toFixed(3),
      grains: grains.filter(g => parseFloat(g.kg) > 0).map(g => ({
        name: GRAIN_TYPES[g.type].name, kg: g.kg,
      })),
    })
    setSavedMsg(true)
    setTimeout(() => setSavedMsg(false), 2500)
  }

  return (
    <div>
      <div className="card">
        <div className="card-title">⚙️ Parámetros del lote</div>
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Volumen final (L)</label>
            <NumInput
              value={batchSize}
              min={1} max={500}
              onChange={setBatchSize}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Eficiencia del mash (%)</label>
            <NumInput
              value={efficiency}
              min={0} max={100}
              onChange={setEfficiency}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">🌾 Granos / Maltas</div>

        {grains.map((grain, i) => (
          <div key={i} className="ingredient-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Tipo de malta</label>
              <select
                className="form-select"
                value={grain.type}
                onChange={e => updateGrain(i, 'type', parseInt(e.target.value))}
              >
                {GRAIN_TYPES.map((g, idx) => (
                  <option key={idx} value={idx}>{g.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Cantidad (kg)</label>
              <input
                type="number"
                className="form-input"
                value={grain.kg}
                placeholder="0.0"
                min="0" step="0.1"
                onChange={e => updateGrain(i, 'kg', e.target.value)}
              />
            </div>
            {grains.length > 1 && (
              <button className="btn-remove" onClick={() => removeGrain(i)} aria-label="Eliminar">✕</button>
            )}
          </div>
        ))}

        <button className="btn-add" onClick={addGrain}>＋ Agregar malta</button>
      </div>

      <div className="card">
        <div className="card-title">📊 Resultado</div>

        <div className="result-grid" style={{ marginBottom: '10px' }}>
          <div className="result-box amber">
            <div className="result-value" style={{ color: ogColor, fontSize: '2.2rem' }}>
              {og > 1 ? og.toFixed(3) : '—'}
            </div>
            <div className="result-label">Densidad Original (OG)</div>
          </div>
          <div className="result-box">
            <div className="result-value" style={{ color: '#4FC3F7', fontSize: '2.2rem' }}>
              {totalKg > 0 ? totalKg.toFixed(1) : '—'}
            </div>
            <div className="result-label">Total malta (kg)</div>
          </div>
        </div>

        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Puntos OG</span>
            <span className="info-value">
              {og > 1 ? ((og - 1) * 1000).toFixed(1) : '—'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">kg/L de mosto</span>
            <span className="info-value">{kgPerL}</span>
          </div>
        </div>

        {og > 1.005 && (
          <div className="info-box" style={{ marginTop: '10px', textAlign: 'center' }}>
            <strong style={{ color: ogColor }}>Estilo estimado:</strong>{' '}
            {getStyleGuess(og)}
          </div>
        )}
      </div>

      {totalKg > 0 && (
        <div className="card">
          <div className="action-btn-row">
            <button className={`action-btn ${copied ? 'success' : ''}`} onClick={handleCopyList}>
              {copied ? '✓ Copiado' : '📋 Lista de compras'}
            </button>
            <button className={`action-btn ${savedMsg ? 'success' : ''}`} onClick={handleSaveRecipe}>
              {savedMsg ? '✓ Guardada' : '💾 Guardar receta'}
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-title">📖 Potencial de maltas (PPG)</div>
        <div className="info-box">
          Los valores PPG (puntos por libra por galón) son potenciales teóricos máximos.
          La eficiencia real del mash se aplica automáticamente al cálculo.
        </div>
        <div style={{ marginTop: '10px' }}>
          {GRAIN_TYPES.map((g, i) => (
            <div key={i} className="style-ref-row">
              <span>{g.name}</span>
              <span>{g.ppg} PPG</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
