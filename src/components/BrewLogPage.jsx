import { useState } from 'react'
import { useApp } from '../context/AppContext'

const TODAY = new Date().toISOString().slice(0, 10)

function formatDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

function DetailView({ entry, onBack, onDelete }) {
  const { updateBrewEntry } = useApp()

  const [ogActual, setOgActual] = useState(entry.ogActual != null ? String(entry.ogActual) : '')
  const [fgActual, setFgActual] = useState(entry.fgActual != null ? String(entry.fgActual) : '')
  const [notes,    setNotes]    = useState(entry.notes || '')
  const [saved,    setSaved]    = useState(false)

  function handleUpdate() {
    const og = parseFloat(ogActual)
    const fg = parseFloat(fgActual)
    const abvActual = og && fg ? parseFloat(((og - fg) * 131.25).toFixed(2)) : null
    updateBrewEntry(entry.id, {
      ogActual: og || null,
      fgActual: fg || null,
      abvActual,
      notes,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const abv = entry.abvActual != null
    ? entry.abvActual.toFixed(1)
    : entry.abvEst != null
      ? `~${entry.abvEst.toFixed(1)}`
      : null

  return (
    <div className="wiki-overlay">
      <div className="wiki-page">
        <div className="wiki-header">
          <button className="wiki-back" onClick={onBack}>←</button>
          <div className="wiki-header-title">{entry.name || 'Sin nombre'}</div>
        </div>

        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Header info */}
          <div className="card">
            <div style={{ color: 'var(--color-muted)', fontSize: '0.82rem', marginBottom: '8px' }}>
              📅 {formatDate(entry.date)}
            </div>
            <div className="info-grid">
              {entry.ogTarget && (
                <div className="info-item">
                  <div className="info-label">OG objetivo</div>
                  <div className="info-value">{entry.ogTarget.toFixed(3)}</div>
                </div>
              )}
              {entry.fgEst && (
                <div className="info-item">
                  <div className="info-label">FG estimada</div>
                  <div className="info-value">{entry.fgEst.toFixed(3)}</div>
                </div>
              )}
              {entry.abvEst != null && (
                <div className="info-item">
                  <div className="info-label">ABV estimado</div>
                  <div className="info-value">~{entry.abvEst.toFixed(1)}%</div>
                </div>
              )}
              {entry.ibu != null && (
                <div className="info-item">
                  <div className="info-label">IBU</div>
                  <div className="info-value">{entry.ibu}</div>
                </div>
              )}
              {entry.srm != null && (
                <div className="info-item">
                  <div className="info-label">SRM</div>
                  <div className="info-value">{entry.srm}</div>
                </div>
              )}
              {entry.batchSize && (
                <div className="info-item">
                  <div className="info-label">Volumen</div>
                  <div className="info-value">{entry.batchSize} L</div>
                </div>
              )}
              {entry.efficiency && (
                <div className="info-item">
                  <div className="info-label">Eficiencia</div>
                  <div className="info-value">{entry.efficiency}%</div>
                </div>
              )}
            </div>
          </div>

          {/* Process params */}
          {(entry.mashTemp || entry.mashDuration || entry.boilDuration || entry.yeast) && (
            <div className="card">
              <div className="card-title">⚙️ Proceso</div>
              <div className="info-grid">
                {entry.mashTemp && (
                  <div className="info-item">
                    <div className="info-label">Temp. mash</div>
                    <div className="info-value">{entry.mashTemp}°C</div>
                  </div>
                )}
                {entry.mashDuration && (
                  <div className="info-item">
                    <div className="info-label">Duración mash</div>
                    <div className="info-value">{entry.mashDuration} min</div>
                  </div>
                )}
                {entry.boilDuration && (
                  <div className="info-item">
                    <div className="info-label">Hervor</div>
                    <div className="info-value">{entry.boilDuration} min</div>
                  </div>
                )}
                {entry.yeast && (
                  <div className="info-item" style={{ gridColumn: '1 / -1' }}>
                    <div className="info-label">Levadura</div>
                    <div className="info-value" style={{ fontSize: '0.88rem' }}>{entry.yeast}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Water */}
          {(entry.strikeVol || entry.strikeTemp || entry.spargeVol) && (
            <div className="card">
              <div className="card-title">💧 Agua de mash</div>
              <div className="info-grid">
                {entry.strikeTemp && (
                  <div className="info-item">
                    <div className="info-label">Temp. strike</div>
                    <div className="info-value">{entry.strikeTemp}°C</div>
                  </div>
                )}
                {entry.strikeVol && (
                  <div className="info-item">
                    <div className="info-label">Vol. strike</div>
                    <div className="info-value">{entry.strikeVol} L</div>
                  </div>
                )}
                {entry.spargeVol && (
                  <div className="info-item">
                    <div className="info-label">Vol. sparge</div>
                    <div className="info-value">{entry.spargeVol} L</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Grains */}
          {entry.grains && entry.grains.length > 0 && (
            <div className="card">
              <div className="card-title">🌾 Grain Bill</div>
              {entry.grains.map((g, i) => (
                <div key={i} className="style-ref-row">
                  <span>{g.name}</span>
                  <span>{g.kg} kg</span>
                </div>
              ))}
            </div>
          )}

          {/* Hops */}
          {entry.hops && entry.hops.length > 0 && (
            <div className="card">
              <div className="card-title">🌿 Lúpulos</div>
              {entry.hops.map((h, i) => (
                <div key={i} className="style-ref-row">
                  <span>{h.name}</span>
                  <span>{h.grams}g @ {h.time} min</span>
                </div>
              ))}
            </div>
          )}

          {/* Carbonation */}
          {(entry.carbTarget || entry.sugarGrams) && (
            <div className="card">
              <div className="card-title">🫧 Carbonatación</div>
              <div className="info-grid">
                {entry.carbTarget && (
                  <div className="info-item">
                    <div className="info-label">CO₂ objetivo</div>
                    <div className="info-value">{entry.carbTarget} vol</div>
                  </div>
                )}
                {entry.sugarGrams != null && (
                  <div className="info-item">
                    <div className="info-label">Azúcar</div>
                    <div className="info-value">{entry.sugarGrams} g</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actual measurements + notes (editable) */}
          <div className="card">
            <div className="card-title">📋 Mediciones reales</div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">OG real</label>
                <input
                  className="form-input"
                  type="number"
                  step="0.001"
                  placeholder="1.048"
                  value={ogActual}
                  onChange={e => setOgActual(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">FG real</label>
                <input
                  className="form-input"
                  type="number"
                  step="0.001"
                  placeholder="1.010"
                  value={fgActual}
                  onChange={e => setFgActual(e.target.value)}
                />
              </div>
            </div>

            {ogActual && fgActual && (
              <div className="info-box" style={{ marginBottom: '10px', textAlign: 'center' }}>
                ABV real: <strong>{((parseFloat(ogActual) - parseFloat(fgActual)) * 131.25).toFixed(1)}%</strong>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Notas</label>
              <textarea
                className="form-input"
                rows={4}
                placeholder="Observaciones, resultado final..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            <button
              className={`action-btn${saved ? ' success' : ''}`}
              style={{ width: '100%', fontWeight: 700 }}
              onClick={handleUpdate}
            >
              {saved ? '✅ Guardado' : '💾 Guardar mediciones'}
            </button>
          </div>

          {/* Delete */}
          <button
            onClick={() => { onDelete(entry.id); onBack() }}
            style={{
              background: 'none',
              border: '1px solid #c0392b',
              borderRadius: '10px',
              color: '#c0392b',
              cursor: 'pointer',
              padding: '10px',
              fontSize: '0.88rem',
              width: '100%',
            }}
          >
            🗑 Eliminar elaboración
          </button>

        </div>
      </div>
    </div>
  )
}

export default function BrewLogPage({ onClose }) {
  const { brewLog, addBrewEntry, deleteBrewEntry } = useApp()

  const [showForm,   setShowForm]   = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [form, setForm] = useState({
    name: '',
    date: TODAY,
    ogTarget: '',
    ogActual: '',
    fgActual: '',
    notes: '',
  })

  function updateForm(field, val) {
    setForm(prev => ({ ...prev, [field]: val }))
  }

  function handleSave() {
    const ogActual = parseFloat(form.ogActual)
    const fgActual = parseFloat(form.fgActual)
    const abvActual = ogActual && fgActual ? (ogActual - fgActual) * 131.25 : null

    addBrewEntry({
      id: Date.now(),
      ...form,
      ogTarget: parseFloat(form.ogTarget) || null,
      ogActual: ogActual || null,
      fgActual: fgActual || null,
      abvActual,
    })

    setForm({ name: '', date: TODAY, ogTarget: '', ogActual: '', fgActual: '', notes: '' })
    setShowForm(false)
  }

  const selectedEntry = selectedId != null ? brewLog.find(e => e.id === selectedId) : null

  if (selectedEntry) {
    return (
      <DetailView
        entry={selectedEntry}
        onBack={() => setSelectedId(null)}
        onDelete={(id) => { deleteBrewEntry(id); setSelectedId(null) }}
      />
    )
  }

  const totalBrews = brewLog.length
  const validAbvs  = brewLog.filter(e => e.abvActual != null).map(e => e.abvActual)
  const avgAbv     = validAbvs.length > 0
    ? (validAbvs.reduce((s, v) => s + v, 0) / validAbvs.length).toFixed(1)
    : null

  return (
    <div className="wiki-overlay">
      <div className="wiki-page">
        <div className="wiki-header">
          <button className="wiki-back" onClick={onClose}>←</button>
          <div className="wiki-header-title">📈 Bitácora de Elaboraciones</div>
        </div>

        <div style={{ padding: '16px' }}>

          {/* Stats card */}
          <div className="card">
            <div className="card-title">Resumen</div>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">Total elaboraciones</div>
                <div className="info-value">{totalBrews}</div>
              </div>
              {avgAbv && (
                <div className="info-item">
                  <div className="info-label">ABV promedio</div>
                  <div className="info-value">{avgAbv}%</div>
                </div>
              )}
            </div>
          </div>

          {/* Add button */}
          {!showForm && (
            <button
              className="action-btn"
              style={{ width: '100%', background: 'var(--color-amber)', color: '#000', fontWeight: 700, marginBottom: '12px' }}
              onClick={() => setShowForm(true)}
            >
              + Agregar elaboración
            </button>
          )}

          {/* Add form */}
          {showForm && (
            <div className="card">
              <div className="card-title">Nueva elaboración</div>

              <div className="form-group">
                <label className="form-label">Nombre / Estilo</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Ej: IPA de Verano"
                  value={form.name}
                  onChange={e => updateForm('name', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Fecha</label>
                <input
                  className="form-input"
                  type="date"
                  value={form.date}
                  onChange={e => updateForm('date', e.target.value)}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">OG Objetivo</label>
                  <input
                    className="form-input"
                    type="number"
                    step="0.001"
                    placeholder="1.050"
                    value={form.ogTarget}
                    onChange={e => updateForm('ogTarget', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">OG Real (medido)</label>
                  <input
                    className="form-input"
                    type="number"
                    step="0.001"
                    placeholder="1.048"
                    value={form.ogActual}
                    onChange={e => updateForm('ogActual', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">FG Real (medido)</label>
                <input
                  className="form-input"
                  type="number"
                  step="0.001"
                  placeholder="1.010"
                  value={form.fgActual}
                  onChange={e => updateForm('fgActual', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notas</label>
                <textarea
                  className="form-input"
                  rows={4}
                  placeholder="Observaciones, cambios, resultado final..."
                  value={form.notes}
                  onChange={e => updateForm('notes', e.target.value)}
                  style={{ resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="action-btn success"
                  style={{ flex: 1, fontWeight: 700 }}
                  onClick={handleSave}
                >
                  Guardar
                </button>
                <button
                  className="action-btn"
                  style={{ flex: 1 }}
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {brewLog.length === 0 && !showForm && (
            <div className="card" style={{ textAlign: 'center', color: 'var(--color-muted)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📋</div>
              <div>Sin elaboraciones registradas</div>
              <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>
                Agrega tu primer lote para empezar el historial.
              </div>
            </div>
          )}

          {/* Log entries */}
          {brewLog.map(entry => {
            const abv = entry.abvActual != null
              ? entry.abvActual.toFixed(1)
              : entry.abvEst != null
                ? `~${entry.abvEst.toFixed(1)}`
                : null

            return (
              <div
                key={entry.id}
                className="card"
                style={{ position: 'relative', cursor: 'pointer' }}
                onClick={() => setSelectedId(entry.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                      {entry.name || 'Sin nombre'}
                    </div>
                    <div style={{ color: 'var(--color-muted)', fontSize: '0.78rem' }}>
                      {formatDate(entry.date)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'var(--color-muted)', fontSize: '0.75rem' }}>Ver detalle →</span>
                    <button
                      onClick={e => { e.stopPropagation(); deleteBrewEntry(entry.id) }}
                      style={{
                        background: 'none',
                        border: '1px solid #c0392b',
                        borderRadius: '6px',
                        color: '#c0392b',
                        cursor: 'pointer',
                        padding: '2px 8px',
                        fontSize: '0.8rem',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="info-grid">
                  {entry.ogTarget && (
                    <div className="info-item">
                      <div className="info-label">OG objetivo</div>
                      <div className="info-value">{entry.ogTarget.toFixed(3)}</div>
                    </div>
                  )}
                  {entry.ogActual && (
                    <div className="info-item">
                      <div className="info-label">OG real</div>
                      <div className="info-value">{entry.ogActual.toFixed(3)}</div>
                    </div>
                  )}
                  {entry.fgActual && (
                    <div className="info-item">
                      <div className="info-label">FG real</div>
                      <div className="info-value">{entry.fgActual.toFixed(3)}</div>
                    </div>
                  )}
                  {abv && (
                    <div className="info-item">
                      <div className="info-label">ABV</div>
                      <div className="info-value">{abv}%</div>
                    </div>
                  )}
                  {entry.ibu != null && (
                    <div className="info-item">
                      <div className="info-label">IBU</div>
                      <div className="info-value">{entry.ibu}</div>
                    </div>
                  )}
                </div>

                {entry.notes ? (
                  <div style={{ marginTop: '8px', color: 'var(--color-muted)', fontSize: '0.82rem', fontStyle: 'italic' }}>
                    {entry.notes}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
