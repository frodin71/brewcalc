import { useState } from 'react'
import { useApp } from '../context/AppContext'

const TODAY = new Date().toISOString().slice(0, 10)

function formatDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

export default function BrewLogPage({ onClose }) {
  const { brewLog, addBrewEntry, deleteBrewEntry } = useApp()

  const [showForm, setShowForm] = useState(false)
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
              <div key={entry.id} className="card" style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                      {entry.name || 'Sin nombre'}
                    </div>
                    <div style={{ color: 'var(--color-muted)', fontSize: '0.78rem' }}>
                      {formatDate(entry.date)}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteBrewEntry(entry.id)}
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

                <div className="info-grid">
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
                  {entry.ogTarget && (
                    <div className="info-item">
                      <div className="info-label">OG objetivo</div>
                      <div className="info-value">{entry.ogTarget.toFixed(3)}</div>
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
