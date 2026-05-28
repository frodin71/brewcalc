import { useState, useMemo } from 'react'
import NumInput from './NumInput'
import { useApp } from '../context/AppContext'

const GRAINS = [
  { name: 'Malta Pale 2-Row',            ppg: 37, lovibond: 2   },
  { name: 'Malta Pilsner',               ppg: 37, lovibond: 1.5 },
  { name: 'Malta Munich',                ppg: 35, lovibond: 9   },
  { name: 'Malta Vienna',                ppg: 36, lovibond: 4   },
  { name: 'Trigo (Wheat Malt)',          ppg: 38, lovibond: 2   },
  { name: 'Crystal / Caramel 20L',       ppg: 35, lovibond: 20  },
  { name: 'Crystal / Caramel 60L',       ppg: 34, lovibond: 60  },
  { name: 'Crystal / Caramel 120L',      ppg: 33, lovibond: 120 },
  { name: 'Malta Chocolate',             ppg: 28, lovibond: 350 },
  { name: 'Malta Negra (Black Pattern)', ppg: 25, lovibond: 500 },
  { name: 'Cebada Tostada (Roasted)',    ppg: 25, lovibond: 300 },
  { name: 'Avena (Oats)',                ppg: 33, lovibond: 2   },
  { name: 'Maíz en Copos',              ppg: 37, lovibond: 1   },
  { name: 'Arroz en Copos',             ppg: 37, lovibond: 1   },
  { name: 'Extracto Seco Malta (DME)',   ppg: 45, lovibond: 8   },
]

const HOPS = [
  { name: 'Amarillo',             alpha: 9.5  },
  { name: 'Cascade',              alpha: 5.5  },
  { name: 'Centennial',           alpha: 10.0 },
  { name: 'Chinook',              alpha: 12.0 },
  { name: 'Citra',                alpha: 12.0 },
  { name: 'Columbus / CTZ',       alpha: 15.0 },
  { name: 'El Dorado',            alpha: 15.0 },
  { name: 'Galaxy',               alpha: 14.0 },
  { name: 'Hallertau Mittelfrüh', alpha: 4.5  },
  { name: 'Magnum',               alpha: 13.0 },
  { name: 'Mosaic',               alpha: 12.5 },
  { name: 'Saaz',                 alpha: 3.5  },
  { name: 'Simcoe',               alpha: 13.0 },
  { name: 'Styrian Goldings',     alpha: 5.5  },
  { name: 'Tettnang',             alpha: 4.5  },
  { name: 'Willamette',           alpha: 5.0  },
]

const YEASTS = [
  { name: 'US-05 (American Ale)',      attenuation: 0.77 },
  { name: 'S-04 (English Ale)',        attenuation: 0.73 },
  { name: 'WLP001 / Wyeast 1056',      attenuation: 0.77 },
  { name: 'Safale WB-06 (Weizen)',     attenuation: 0.73 },
  { name: 'Safale T-58 (Belga)',       attenuation: 0.78 },
  { name: 'W-34/70 (Lager)',           attenuation: 0.82 },
  { name: 'Nottingham (Ale)',          attenuation: 0.80 },
  { name: 'Kveik (Voss)',              attenuation: 0.80 },
  { name: '— Atenuación manual —',    attenuation: null  },
]

function srmToRgb(srm) {
  const r = Math.round(Math.min(255, Math.max(0, 255 * Math.exp(-0.0271 * srm))))
  const g = Math.round(Math.min(255, Math.max(0, 255 * Math.exp(-0.0813 * srm))))
  const b = Math.round(Math.min(255, Math.max(0, 255 * Math.exp(-0.2732 * srm))))
  return `rgb(${r},${g},${b})`
}

function guessStyle(og, ibu) {
  if (og < 1.035) return '🥤 Session / Light'
  if (og < 1.050 && ibu < 25) return '🌾 Cream Ale / Wheat'
  if (og < 1.050 && ibu >= 25) return '🍋 American Pale Ale'
  if (og < 1.060 && ibu < 30) return '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Amber Ale / ESB'
  if (og < 1.060 && ibu >= 30) return '🍊 IPA Clásica'
  if (og < 1.075 && ibu >= 50) return '💥 West Coast IPA'
  if (og < 1.075) return '🍎 Strong Ale'
  if (og < 1.090) return '🏋️ Double IPA / Barleywine'
  return '🔥 Imperial Ale'
}

export default function FullRecipeCalc({ onStartTimer }) {
  const { addBrewEntry } = useApp()

  const [recipeName,        setRecipeName]        = useState('')
  const [batchSize,         setBatchSize]          = useState(20)
  const [efficiency,        setEfficiency]         = useState(75)
  const [mashTemp,          setMashTemp]           = useState(67)
  const [mashDuration,      setMashDuration]       = useState(60)
  const [boilDuration,      setBoilDuration]       = useState(60)
  const [grainTemp,         setGrainTemp]          = useState(20)
  const [mashRatio,         setMashRatio]          = useState(3.0)
  const [carbTemp,          setCarbTemp]           = useState(20)
  const [carbTarget,        setCarbTarget]         = useState(2.5)
  const [grains,            setGrains]             = useState([{ type: 0, kg: '' }, { type: 5, kg: '' }])
  const [hops,              setHops]               = useState([{ variety: 0, grams: '', time: 60 }])
  const [yeastIdx,          setYeastIdx]           = useState(0)
  const [customAttenuation, setCustomAttenuation]  = useState(75)
  const [copied,            setCopied]             = useState(false)
  const [logSaved,          setLogSaved]           = useState(false)

  const calc = useMemo(() => {
    const totalGrainKg = grains.reduce((s, g) => s + (parseFloat(g.kg) || 0), 0)

    const og = totalGrainKg > 0
      ? 1 + (grains.reduce((s, g) => {
          const kg  = parseFloat(g.kg) || 0
          const ppg = GRAINS[g.type].ppg
          return s + kg * ppg * (efficiency / 100) * 8.345
        }, 0) / batchSize) / 1000
      : 1.000

    const yeast = YEASTS[yeastIdx]
    const attenuation = yeast.attenuation ?? (customAttenuation / 100)
    const fgEst  = og - (og - 1) * attenuation
    const abvEst = (og - fgEst) * 131.25

    const ibu = hops.reduce((sum, h) => {
      const grams = parseFloat(h.grams) || 0
      const time  = parseFloat(h.time)  || 0
      if (grams === 0 || time === 0) return sum
      const alpha      = HOPS[h.variety].alpha
      const bigness    = 1.65 * Math.pow(0.000125, og - 1)
      const timeFactor = (1 - Math.exp(-0.04 * time)) / 4.15
      return sum + (grams * (alpha / 100) * bigness * timeFactor * 1000 / batchSize)
    }, 0)

    const mcu = grains.reduce((s, g) => {
      const kg       = parseFloat(g.kg) || 0
      const lovibond = GRAINS[g.type].lovibond
      return s + (kg * lovibond * 8.345 / batchSize)
    }, 0)
    const srm      = mcu > 0 ? 1.4922 * Math.pow(mcu, 0.6859) : 0
    const srmColor = srmToRgb(srm)

    const strikeTemp = (0.41 / mashRatio) * (mashTemp - grainTemp) + mashTemp
    const strikeVol  = totalGrainKg * mashRatio
    const grainAbsorption = totalGrainKg * 0.8
    const preBoilVol = batchSize * 1.1
    const spargeVol  = Math.max(0, preBoilVol + grainAbsorption - strikeVol)

    const tF          = carbTemp * 9 / 5 + 32
    const residualCO2 = 3.0378 - 0.050062 * tF + 0.00026555 * tF * tF
    const sugarGrams  = Math.max(0, carbTarget - residualCO2) * 4.0 * batchSize

    const styleGuess = guessStyle(og, ibu)

    return {
      totalGrainKg, og, fgEst, abvEst, ibu, srm, srmColor,
      strikeTemp, strikeVol, spargeVol, residualCO2, sugarGrams, styleGuess,
    }
  }, [grains, hops, batchSize, efficiency, mashTemp, mashRatio, grainTemp, yeastIdx, customAttenuation, carbTemp, carbTarget])

  function hopIbu(h) {
    const grams = parseFloat(h.grams) || 0
    const time  = parseFloat(h.time)  || 0
    if (grams === 0 || time === 0) return 0
    const alpha      = HOPS[h.variety].alpha
    const bigness    = 1.65 * Math.pow(0.000125, calc.og - 1)
    const timeFactor = (1 - Math.exp(-0.04 * time)) / 4.15
    return grams * (alpha / 100) * bigness * timeFactor * 1000 / batchSize
  }

  function addGrain() {
    setGrains(prev => [...prev, { type: 0, kg: '' }])
  }

  function removeGrain(i) {
    setGrains(prev => prev.filter((_, idx) => idx !== i))
  }

  function updateGrain(i, field, val) {
    setGrains(prev => prev.map((g, idx) => idx === i ? { ...g, [field]: val } : g))
  }

  function addHop() {
    setHops(prev => [...prev, { variety: 0, grams: '', time: 60 }])
  }

  function removeHop(i) {
    setHops(prev => prev.filter((_, idx) => idx !== i))
  }

  function updateHop(i, field, val) {
    setHops(prev => prev.map((h, idx) => idx === i ? { ...h, [field]: val } : h))
  }

  function buildRecipeObj() {
    return {
      name: recipeName || `Receta ${batchSize}L`,
      batchSize, efficiency, mashTemp, mashDuration, boilDuration,
      grainTemp, mashRatio,
      totalGrainKg: calc.totalGrainKg,
      strikeTemp: calc.strikeTemp,
      strikeVol: calc.strikeVol,
      spargeVol: calc.spargeVol,
      hops: hops
        .filter(h => parseFloat(h.grams) > 0)
        .map(h => ({
          name:  HOPS[h.variety].name,
          grams: parseFloat(h.grams),
          time:  parseFloat(h.time) || 0,
        })),
      og: calc.og,
      fgEst: calc.fgEst,
      abvEst: calc.abvEst,
      ibu: calc.ibu,
      srm: calc.srm,
    }
  }

  function handleCopy() {
    const r = calc
    const text = [
      `🍺 ${recipeName || `Receta ${batchSize}L`}`,
      `Lote: ${batchSize} L | Eficiencia: ${efficiency}%`,
      `OG: ${r.og.toFixed(3)} | FG est: ${r.fgEst.toFixed(3)}`,
      `ABV est: ${r.abvEst.toFixed(1)}% | IBU: ${r.ibu.toFixed(0)} | SRM: ${r.srm.toFixed(1)}`,
      `Strike: ${r.strikeVol.toFixed(1)} L a ${r.strikeTemp.toFixed(1)}°C`,
      `Sparge: ${r.spargeVol.toFixed(1)} L`,
      `CO₂ objetivo: ${carbTarget} vol | Azúcar: ${r.sugarGrams.toFixed(0)} g`,
    ].join('\n')
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleSaveLog() {
    const r = calc
    addBrewEntry({
      id: Date.now(),
      name: recipeName || `Receta ${batchSize}L`,
      date: new Date().toISOString().slice(0, 10),
      ogTarget: parseFloat(r.og.toFixed(3)),
      ogActual: '',
      fgActual: '',
      notes: '',
      abvEst: parseFloat(r.abvEst.toFixed(2)),
      ibu: parseFloat(r.ibu.toFixed(0)),
      srm: parseFloat(r.srm.toFixed(1)),
      batchSize,
    })
    setLogSaved(true)
    setTimeout(() => setLogSaved(false), 2000)
  }

  const { totalGrainKg, og, fgEst, abvEst, ibu, srm, srmColor, strikeTemp, strikeVol, spargeVol, residualCO2, sugarGrams, styleGuess } = calc

  const ibuClass = ibu < 20 ? 'amber' : ibu < 50 ? 'green' : 'amber'

  return (
    <div>
      {/* Card 1: Recipe name */}
      <div className="card">
        <div className="card-title">🍺 Receta Completa</div>
        <p className="card-desc">Calculadora unificada: OG, IBU, SRM, ABV, agua y carbonatación.</p>
        <div className="form-group">
          <label className="form-label">Nombre de la receta</label>
          <input
            className="form-input"
            type="text"
            placeholder="Ej: IPA de Verano"
            value={recipeName}
            onChange={e => setRecipeName(e.target.value)}
          />
        </div>
      </div>

      {/* Card 2: Batch parameters */}
      <div className="card">
        <div className="card-title">⚙️ Parámetros del lote</div>
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Volumen final (L)</label>
            <NumInput value={batchSize} min={1} max={500} onChange={setBatchSize} />
          </div>
          <div className="form-group">
            <label className="form-label">Eficiencia (%)</label>
            <NumInput value={efficiency} min={1} max={100} onChange={setEfficiency} />
          </div>
        </div>
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Temp. mash (°C)</label>
            <NumInput value={mashTemp} min={50} max={80} onChange={setMashTemp} />
          </div>
          <div className="form-group">
            <label className="form-label">Duración mash (min)</label>
            <NumInput value={mashDuration} min={1} max={120} onChange={setMashDuration} />
          </div>
        </div>
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Duración hervor (min)</label>
            <NumInput value={boilDuration} min={1} max={120} onChange={setBoilDuration} />
          </div>
          <div className="form-group">
            <label className="form-label">Ratio mash (L/kg)</label>
            <NumInput value={mashRatio} min={1} max={6} onChange={setMashRatio} />
          </div>
        </div>
      </div>

      {/* Card 3: Grain bill */}
      <div className="card">
        <div className="card-title">🌾 Grain Bill</div>
        {grains.map((g, i) => (
          <div key={i} className="ingredient-row">
            <select
              className="form-select"
              value={g.type}
              onChange={e => updateGrain(i, 'type', parseInt(e.target.value))}
              style={{ flex: 2 }}
            >
              {GRAINS.map((gr, idx) => (
                <option key={idx} value={idx}>{gr.name}</option>
              ))}
            </select>
            <input
              className="form-input"
              type="number"
              placeholder="kg"
              min="0"
              step="0.1"
              value={g.kg}
              onChange={e => updateGrain(i, 'kg', e.target.value)}
              style={{ flex: 1 }}
            />
            {grains.length > 1 && (
              <button className="btn-remove" onClick={() => removeGrain(i)}>✕</button>
            )}
          </div>
        ))}
        <button className="btn-add" onClick={addGrain}>+ Agregar malta</button>
        {totalGrainKg > 0 && (
          <div style={{ marginTop: '8px', color: 'var(--color-muted)', fontSize: '0.82rem' }}>
            Total: {totalGrainKg.toFixed(2)} kg
          </div>
        )}
      </div>

      {/* Card 4: Hops */}
      <div className="card">
        <div className="card-title">🌿 Lúpulos</div>
        {hops.map((h, i) => {
          const ibuVal = hopIbu(h)
          return (
            <div key={i} style={{ marginBottom: '12px' }}>
              <div className="ingredient-row">
                <select
                  className="form-select"
                  value={h.variety}
                  onChange={e => updateHop(i, 'variety', parseInt(e.target.value))}
                  style={{ flex: 2 }}
                >
                  {HOPS.map((hp, idx) => (
                    <option key={idx} value={idx}>{hp.name} ({hp.alpha}% α)</option>
                  ))}
                </select>
                {hops.length > 1 && (
                  <button className="btn-remove" onClick={() => removeHop(i)}>✕</button>
                )}
              </div>
              <div className="ingredient-row" style={{ marginTop: '6px' }}>
                <input
                  className="form-input"
                  type="number"
                  placeholder="gramos"
                  min="0"
                  step="1"
                  value={h.grams}
                  onChange={e => updateHop(i, 'grams', e.target.value)}
                  style={{ flex: 1 }}
                />
                <input
                  className="form-input"
                  type="number"
                  placeholder="min hervor"
                  min="0"
                  max="120"
                  step="1"
                  value={h.time}
                  onChange={e => updateHop(i, 'time', e.target.value)}
                  style={{ flex: 1 }}
                />
                {ibuVal > 0 && (
                  <span style={{
                    background: 'var(--color-amber)',
                    color: '#000',
                    borderRadius: '12px',
                    padding: '2px 8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}>
                    {ibuVal.toFixed(1)} IBU
                  </span>
                )}
              </div>
            </div>
          )
        })}
        <button className="btn-add" onClick={addHop}>+ Agregar lúpulo</button>
      </div>

      {/* Card 5: Yeast + carbonation */}
      <div className="card">
        <div className="card-title">🧫 Levadura + Carbonatación</div>
        <div className="form-group">
          <label className="form-label">Levadura</label>
          <select
            className="form-select"
            value={yeastIdx}
            onChange={e => setYeastIdx(parseInt(e.target.value))}
          >
            {YEASTS.map((y, idx) => (
              <option key={idx} value={idx}>{y.name}</option>
            ))}
          </select>
        </div>
        {YEASTS[yeastIdx].attenuation === null && (
          <div className="form-group">
            <label className="form-label">Atenuación esperada (%)</label>
            <NumInput value={customAttenuation} min={50} max={100} onChange={setCustomAttenuation} />
          </div>
        )}
        <div className="form-row-2" style={{ marginTop: '12px' }}>
          <div className="form-group">
            <label className="form-label">Temp. carbonatación (°C)</label>
            <NumInput value={carbTemp} min={0} max={30} onChange={setCarbTemp} />
          </div>
          <div className="form-group">
            <label className="form-label">CO₂ objetivo (vol)</label>
            <NumInput value={carbTarget} min={1} max={4} onChange={setCarbTarget} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Temp. grano para strike (°C)</label>
          <NumInput value={grainTemp} min={0} max={40} onChange={setGrainTemp} />
        </div>
      </div>

      {/* Card 6: Results */}
      <div className="card">
        <div className="card-title">📊 Resultados</div>

        <div className="form-row-2" style={{ gap: '8px', marginBottom: '8px' }}>
          <div className="result-box amber" style={{ flex: 1 }}>
            <div className="result-value">{og.toFixed(3)}</div>
            <div className="result-label">OG estimada</div>
          </div>
          <div className="result-box green" style={{ flex: 1 }}>
            <div className="result-value">{abvEst.toFixed(1)}%</div>
            <div className="result-label">ABV est.</div>
          </div>
          <div className={`result-box ${ibuClass}`} style={{ flex: 1 }}>
            <div className="result-value">{ibu.toFixed(0)}</div>
            <div className="result-label">IBU</div>
          </div>
        </div>

        <div className="form-row-2" style={{ gap: '8px', marginBottom: '12px' }}>
          <div className="result-box" style={{ flex: 1 }}>
            <div className="result-value">{fgEst.toFixed(3)}</div>
            <div className="result-label">FG est.</div>
          </div>
          <div className="result-box" style={{ flex: 1 }}>
            <div className="result-value" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              {srm > 0 && (
                <span style={{
                  display: 'inline-block',
                  width: '16px',
                  height: '16px',
                  borderRadius: '4px',
                  background: srmColor,
                  verticalAlign: 'middle',
                  marginRight: '6px',
                  flexShrink: 0,
                }} />
              )}
              {srm.toFixed(1)}
            </div>
            <div className="result-label">SRM</div>
          </div>
        </div>

        <div className="info-box" style={{ marginBottom: '12px' }}>
          <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '0.85rem' }}>💧 Agua</div>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Temp. strike</div>
              <div className="info-value">{totalGrainKg > 0 ? `${strikeTemp.toFixed(1)} °C` : '—'}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Vol. strike</div>
              <div className="info-value">{totalGrainKg > 0 ? `${strikeVol.toFixed(1)} L` : '—'}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Vol. sparge</div>
              <div className="info-value">{totalGrainKg > 0 ? `${spargeVol.toFixed(1)} L` : '—'}</div>
            </div>
          </div>
        </div>

        <div className="info-box" style={{ marginBottom: '12px' }}>
          <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '0.85rem' }}>🫧 Carbonatación</div>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">CO₂ residual</div>
              <div className="info-value">{residualCO2.toFixed(2)} vol</div>
            </div>
            <div className="info-item">
              <div className="info-label">Azúcar (tabla)</div>
              <div className="info-value">{sugarGrams.toFixed(0)} g</div>
            </div>
          </div>
        </div>

        {totalGrainKg > 0 && (
          <div className="info-box">
            <div className="info-label">Estilo estimado</div>
            <div style={{ fontWeight: 600, marginTop: '4px' }}>{styleGuess}</div>
          </div>
        )}
      </div>

      {/* Card 7: Actions (only when grain is set) */}
      {totalGrainKg > 0 && (
        <div className="card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              className={`action-btn${copied ? ' success' : ''}`}
              onClick={handleCopy}
            >
              {copied ? '✅ Copiado' : '📋 Copiar resumen'}
            </button>
            <button
              className="action-btn"
              style={{ background: 'var(--color-amber)', color: '#000', fontWeight: 700 }}
              onClick={() => onStartTimer && onStartTimer(buildRecipeObj())}
            >
              ⏱️ Iniciar Brew Day
            </button>
            <button
              className={`action-btn${logSaved ? ' success' : ''}`}
              onClick={handleSaveLog}
            >
              {logSaved ? '✅ Guardado en bitácora' : '📈 Guardar en bitácora'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
