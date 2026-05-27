import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function NotesPage({ onClose }) {
  const { notes, saveNotes } = useApp()
  const [text, setText] = useState(notes)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    saveNotes(text)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleCopy = () => {
    navigator.clipboard?.writeText(text)
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  return (
    <div className="wiki-overlay">
      <div className="wiki-page">
        <div className="wiki-header">
          <button className="wiki-back" onClick={onClose}>← Volver</button>
          <span className="wiki-header-title">🗒️ Mis Notas</span>
        </div>

        <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="card">
            <p className="card-desc">
              Anota ingredientes, parámetros de recetas, observaciones del brew day o cualquier cosa que quieras recordar. Se guarda automáticamente en este dispositivo.
            </p>
          </div>

          <div className="card" style={{ padding: '10px' }}>
            <textarea
              className="notes-textarea"
              value={text}
              onChange={e => { setText(e.target.value); setSaved(false) }}
              placeholder="Ej: Receta IPA Verano&#10;- 5kg Malta Pale&#10;- 0.5kg Crystal 60L&#10;- 30g Citra 60min&#10;- 20g Mosaic flameout&#10;OG esperado: 1.058"
            />
            <div className="notes-footer">
              <span className="notes-word-count">{wordCount} palabras</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="notes-btn secondary" onClick={handleCopy}>
                  Copiar
                </button>
                <button
                  className={`notes-btn ${saved ? 'saved' : 'primary'}`}
                  onClick={handleSave}
                >
                  {saved ? '✓ Guardado' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>

          {text.trim() === '' && (
            <div className="card">
              <div className="card-title">💡 Ideas para anotar</div>
              <div className="info-box">
                {[
                  'Grain bill y cantidades de tu receta actual',
                  'Parámetros reales del brew day (OG real, eficiencia)',
                  'Temperatura de fermentación y levadura usada',
                  'Observaciones de sabor al embotellar',
                  'Ajustes para la próxima vez',
                ].map((tip, i) => (
                  <div key={i} style={{ padding: '4px 0', borderBottom: i < 4 ? '1px solid #1E1E1E' : 'none' }}>
                    • {tip}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
