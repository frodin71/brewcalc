import { useEffect } from 'react'
import { useApp } from '../context/AppContext'

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches

export default function Menu({ open, onClose, easyMode, onToggle, onOpenWiki, onOpenNotes, onOpenAbout, onOpenRecipes, onOpenIOSTutorial, onOpenBrewLog }) {
  const { units, toggleUnits, installPrompt, triggerInstall } = useApp()

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleInstall = async () => {
    await triggerInstall()
    onClose()
  }

  return (
    <>
      <div className={`menu-overlay ${open ? 'visible' : ''}`} onClick={onClose} />
      <div className={`menu-drawer ${open ? 'open' : ''}`}>
        <div className="menu-header">
          <span className="menu-title">Menú</span>
          <button className="menu-close" onClick={onClose}>✕</button>
        </div>

        {/* Modo fácil / avanzado */}
        <div className="menu-section">
          <div className="menu-section-title">Modo</div>
          <div className="mode-toggle-card" onClick={onToggle}>
            <div className="mode-toggle-info">
              <span className="mode-toggle-icon">{easyMode ? '🌱' : '⚗️'}</span>
              <div>
                <div className="mode-toggle-label">{easyMode ? 'Modo Fácil' : 'Modo Avanzado'}</div>
                <div className="mode-toggle-desc">
                  {easyMode ? 'Simplificado para principiantes' : 'Todas las opciones y fórmulas'}
                </div>
              </div>
            </div>
            <div className={`toggle-switch ${easyMode ? 'on' : ''}`}>
              <div className="toggle-knob" />
            </div>
          </div>
        </div>

        {/* Unidades */}
        <div className="menu-section">
          <div className="menu-section-title">Unidades</div>
          <div className="mode-toggle-card" onClick={toggleUnits}>
            <div className="mode-toggle-info">
              <span className="mode-toggle-icon">{units === 'metric' ? '🇪🇺' : '🇺🇸'}</span>
              <div>
                <div className="mode-toggle-label">
                  {units === 'metric' ? 'Métrico (L / kg / °C)' : 'Imperial (gal / lb / °F)'}
                </div>
                <div className="mode-toggle-desc">Toca para cambiar de sistema</div>
              </div>
            </div>
            <div className={`toggle-switch ${units === 'imperial' ? 'on' : ''}`}>
              <div className="toggle-knob" />
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="menu-section">
          <div className="menu-section-title">Herramientas</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

            <button className="menu-wiki-btn" onClick={() => { onClose(); onOpenWiki() }}>
              <span className="menu-wiki-icon">📚</span>
              <div>
                <div className="menu-wiki-label">Aprende Brewing</div>
                <div className="menu-wiki-desc">Ingredientes, proceso, siglas y más</div>
              </div>
              <span className="menu-wiki-arrow">→</span>
            </button>

            <button className="menu-wiki-btn" onClick={() => { onClose(); onOpenNotes() }}>
              <span className="menu-wiki-icon">🗒️</span>
              <div>
                <div className="menu-wiki-label">Mis Notas</div>
                <div className="menu-wiki-desc">Apuntes del brew day y recetas</div>
              </div>
              <span className="menu-wiki-arrow">→</span>
            </button>

            <button className="menu-wiki-btn" onClick={() => { onClose(); onOpenRecipes() }}>
              <span className="menu-wiki-icon">💾</span>
              <div>
                <div className="menu-wiki-label">Recetas Guardadas</div>
                <div className="menu-wiki-desc">Tus recetas anteriores</div>
              </div>
              <span className="menu-wiki-arrow">→</span>
            </button>

            <button className="menu-wiki-btn" onClick={() => { onClose(); onOpenBrewLog() }}>
              <span className="menu-wiki-icon">📈</span>
              <div>
                <div className="menu-wiki-label">Bitácora de Elaboraciones</div>
                <div className="menu-wiki-desc">Registro de tus lotes con OG, FG y notas</div>
              </div>
              <span className="menu-wiki-arrow">→</span>
            </button>

            {installPrompt && (
              <button className="menu-wiki-btn" onClick={handleInstall}>
                <span className="menu-wiki-icon">📱</span>
                <div>
                  <div className="menu-wiki-label">Instalar App</div>
                  <div className="menu-wiki-desc">Agregar a la pantalla de inicio</div>
                </div>
                <span className="menu-wiki-arrow">↓</span>
              </button>
            )}

            {isIOS && !isStandalone && !installPrompt && (
              <button className="menu-wiki-btn" onClick={() => { onClose(); onOpenIOSTutorial() }}>
                <span className="menu-wiki-icon">📱</span>
                <div>
                  <div className="menu-wiki-label">Instalar en iPhone / iPad</div>
                  <div className="menu-wiki-desc">Cómo agregar a la pantalla de inicio</div>
                </div>
                <span className="menu-wiki-arrow">→</span>
              </button>
            )}

            <button className="menu-wiki-btn" onClick={() => { onClose(); onOpenAbout() }}>
              <span className="menu-wiki-icon">ℹ️</span>
              <div>
                <div className="menu-wiki-label">Acerca de BrewCalc</div>
                <div className="menu-wiki-desc">Versión, fórmulas y créditos</div>
              </div>
              <span className="menu-wiki-arrow">→</span>
            </button>

          </div>
        </div>

        <div className="menu-footer">🍺 BrewCalc — 100% gratis, sin trackers</div>
      </div>
    </>
  )
}
