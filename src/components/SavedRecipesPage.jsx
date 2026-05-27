import { useApp } from '../context/AppContext'

export default function SavedRecipesPage({ onClose }) {
  const { savedRecipes, deleteRecipe } = useApp()

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
              <div key={i} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-amber)' }}>
                      {r.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: '2px' }}>
                      Guardada el {r.savedAt}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteRecipe(i)}
                    style={{
                      background: 'none', border: 'none', color: '#EF5350',
                      cursor: 'pointer', fontSize: '1rem', padding: '2px 6px'
                    }}
                  >✕</button>
                </div>

                <div className="info-grid" style={{ marginTop: '10px' }}>
                  <div className="info-item">
                    <span className="info-label">OG</span>
                    <span className="info-value">{r.og}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Volumen</span>
                    <span className="info-value">{r.batchSize} L</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Eficiencia</span>
                    <span className="info-value">{r.efficiency}%</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Maltas</span>
                    <span className="info-value">{r.grains?.length || 0}</span>
                  </div>
                </div>

                {r.grains?.length > 0 && (
                  <div className="info-box" style={{ marginTop: '10px' }}>
                    {r.grains.map((g, j) => (
                      <div key={j} style={{ padding: '3px 0', fontSize: '0.82rem',
                        borderBottom: j < r.grains.length - 1 ? '1px solid #222' : 'none' }}>
                        • {g.name}: <strong>{g.kg} kg</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
