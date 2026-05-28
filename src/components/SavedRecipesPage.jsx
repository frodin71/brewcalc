import { useState } from 'react'
import { useApp } from '../context/AppContext'

function DetailView({ recipe, idx, onBack, onDelete }) {
  const { updateRecipe } = useApp()
  const [name,  setName]  = useState(recipe.name  || '')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    updateRecipe(idx, { name })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="wiki-overlay">
      <div className="wiki-page">
        <div className="wiki-header">
          <button className="wiki-back" onClick={onBack}>←</button>
          <div className="wiki-header-title">💾 {recipe.name}</div>
        </div>

        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Edit name */}
          <div className="card">
            <div className="card-title">✏️ Nombre</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                className="form-input"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                className={`action-btn${saved ? ' success' : ''}`}
                style={{ whiteSpace: 'nowrap', padding: '0 16px' }}
                onClick={handleSave}
              >
                {saved ? '✅' : 'Guardar'}
              </button>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: '6px' }}>
              Guardada el {recipe.savedAt}
            </div>
          </div>

          {/* Main stats */}
          <div className="card">
            <div className="card-title">📊 Estadísticas</div>
            <div className="info-grid">
              {recipe.og && (
                <div className="info-item">
                  <div className="info-label">OG estimada</div>
                  <div className="info-value">{typeof recipe.og === 'number' ? recipe.og.toFixed(3) : recipe.og}</div>
                </div>
              )}
              {recipe.fgEst && (
                <div className="info-item">
                  <div className="info-label">FG estimada</div>
                  <div className="info-value">{typeof recipe.fgEst === 'number' ? recipe.fgEst.toFixed(3) : recipe.fgEst}</div>
                </div>
              )}
              {recipe.abvEst != null && (
                <div className="info-item">
                  <div className="info-label">ABV est.</div>
                  <div className="info-value">{recipe.abvEst.toFixed(1)}%</div>
                </div>
              )}
              {recipe.ibu != null && (
                <div className="info-item">
                  <div className="info-label">IBU</div>
                  <div className="info-value">{recipe.ibu}</div>
                </div>
              )}
              {recipe.srm != null && (
                <div className="info-item">
                  <div className="info-label">SRM</div>
                  <div className="info-value">{recipe.srm}</div>
                </div>
              )}
              {recipe.batchSize && (
                <div className="info-item">
                  <div className="info-label">Volumen</div>
                  <div className="info-value">{recipe.batchSize} L</div>
                </div>
              )}
              {recipe.efficiency && (
                <div className="info-item">
                  <div className="info-label">Eficiencia</div>
                  <div className="info-value">{recipe.efficiency}%</div>
                </div>
              )}
            </div>
          </div>

          {/* Process */}
          {(recipe.mashTemp || recipe.mashDuration || recipe.boilDuration || recipe.yeast) && (
            <div className="card">
              <div className="card-title">⚙️ Proceso</div>
              <div className="info-grid">
                {recipe.mashTemp && (
                  <div className="info-item">
                    <div className="info-label">Temp. mash</div>
                    <div className="info-value">{recipe.mashTemp}°C</div>
                  </div>
                )}
                {recipe.mashDuration && (
                  <div className="info-item">
                    <div className="info-label">Duración mash</div>
                    <div className="info-value">{recipe.mashDuration} min</div>
                  </div>
                )}
                {recipe.boilDuration && (
                  <div className="info-item">
                    <div className="info-label">Hervor</div>
                    <div className="info-value">{recipe.boilDuration} min</div>
                  </div>
                )}
                {recipe.yeast && (
                  <div className="info-item" style={{ gridColumn: '1 / -1' }}>
                    <div className="info-label">Levadura</div>
                    <div className="info-value" style={{ fontSize: '0.88rem' }}>{recipe.yeast}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Water */}
          {(recipe.strikeVol || recipe.strikeTemp || recipe.spargeVol) && (
            <div className="card">
              <div className="card-title">💧 Agua de mash</div>
              <div className="info-grid">
                {recipe.strikeTemp && (
                  <div className="info-item">
                    <div className="info-label">Temp. strike</div>
                    <div className="info-value">{recipe.strikeTemp}°C</div>
                  </div>
                )}
                {recipe.strikeVol && (
                  <div className="info-item">
                    <div className="info-label">Vol. strike</div>
                    <div className="info-value">{recipe.strikeVol} L</div>
                  </div>
                )}
                {recipe.spargeVol && (
                  <div className="info-item">
                    <div className="info-label">Vol. sparge</div>
                    <div className="info-value">{recipe.spargeVol} L</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Grains */}
          {recipe.grains?.length > 0 && (
            <div className="card">
              <div className="card-title">🌾 Grain Bill</div>
              {recipe.grains.map((g, i) => (
                <div key={i} className="style-ref-row">
                  <span>{g.name}</span>
                  <span>{g.kg} kg</span>
                </div>
              ))}
            </div>
          )}

          {/* Hops */}
          {recipe.hops?.length > 0 && (
            <div className="card">
              <div className="card-title">🌿 Lúpulos</div>
              {recipe.hops.map((h, i) => (
                <div key={i} className="style-ref-row">
                  <span>{h.name}</span>
                  <span>{h.grams}g @ {h.time} min</span>
                </div>
              ))}
            </div>
          )}

          {/* Carbonation */}
          {(recipe.carbTarget || recipe.sugarGrams != null) && (
            <div className="card">
              <div className="card-title">🫧 Carbonatación</div>
              <div className="info-grid">
                {recipe.carbTarget && (
                  <div className="info-item">
                    <div className="info-label">CO₂ objetivo</div>
                    <div className="info-value">{recipe.carbTarget} vol</div>
                  </div>
                )}
                {recipe.sugarGrams != null && (
                  <div className="info-item">
                    <div className="info-label">Azúcar</div>
                    <div className="info-value">{recipe.sugarGrams} g</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Delete */}
          <button
            onClick={() => { onDelete(idx); onBack() }}
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
            🗑 Eliminar receta
          </button>

        </div>
      </div>
    </div>
  )
}

export default function SavedRecipesPage({ onClose }) {
  const { savedRecipes, deleteRecipe } = useApp()
  const [selectedIdx, setSelectedIdx] = useState(null)

  const selected = selectedIdx != null ? savedRecipes[selectedIdx] : null

  if (selected) {
    return (
      <DetailView
        recipe={selected}
        idx={selectedIdx}
        onBack={() => setSelectedIdx(null)}
        onDelete={(i) => { deleteRecipe(i); setSelectedIdx(null) }}
      />
    )
  }

  return (
    <div className="wiki-overlay">
      <div className="wiki-page">
        <div className="wiki-header">
          <button className="wiki-back" onClick={onClose}>← Volver</button>
          <span className="wiki-header-title">💾 Recetas Guardadas</span>
        </div>

        <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {savedRecipes.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '32px 16px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📭</div>
              <div style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
                Todavía no guardaste ninguna receta.<br />
                Usá el botón <strong>"Guardar receta"</strong> en la calculadora de Receta.
              </div>
            </div>
          ) : (
            savedRecipes.map((r, i) => (
              <div
                key={i}
                className="card"
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedIdx(i)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-amber)' }}>
                      {r.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: '2px' }}>
                      Guardada el {r.savedAt}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'var(--color-muted)', fontSize: '0.75rem' }}>Ver →</span>
                    <button
                      onClick={e => { e.stopPropagation(); deleteRecipe(i) }}
                      style={{
                        background: 'none', border: 'none', color: '#EF5350',
                        cursor: 'pointer', fontSize: '1rem', padding: '2px 6px'
                      }}
                    >✕</button>
                  </div>
                </div>

                <div className="info-grid" style={{ marginTop: '10px' }}>
                  {r.og && (
                    <div className="info-item">
                      <span className="info-label">OG</span>
                      <span className="info-value">{typeof r.og === 'number' ? r.og.toFixed(3) : r.og}</span>
                    </div>
                  )}
                  {r.abvEst != null && (
                    <div className="info-item">
                      <span className="info-label">ABV est.</span>
                      <span className="info-value">{r.abvEst.toFixed(1)}%</span>
                    </div>
                  )}
                  {r.ibu != null && (
                    <div className="info-item">
                      <span className="info-label">IBU</span>
                      <span className="info-value">{r.ibu}</span>
                    </div>
                  )}
                  <div className="info-item">
                    <span className="info-label">Volumen</span>
                    <span className="info-value">{r.batchSize} L</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
