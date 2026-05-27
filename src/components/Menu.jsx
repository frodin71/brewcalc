import { useEffect } from 'react'

export default function Menu({ open, onClose, easyMode, onToggle }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <div className={`menu-overlay ${open ? 'visible' : ''}`} onClick={onClose} />
      <div className={`menu-drawer ${open ? 'open' : ''}`}>
        <div className="menu-header">
          <span className="menu-title">Opciones</span>
          <button className="menu-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <div className="menu-section">
          <div className="mode-toggle-card" onClick={onToggle}>
            <div className="mode-toggle-info">
              <span className="mode-toggle-icon">{easyMode ? '🌱' : '⚗️'}</span>
              <div>
                <div className="mode-toggle-label">
                  {easyMode ? 'Modo Fácil' : 'Modo Avanzado'}
                </div>
                <div className="mode-toggle-desc">
                  {easyMode
                    ? 'Calculadoras simplificadas para principiantes'
                    : 'Todas las opciones y fórmulas completas'}
                </div>
              </div>
            </div>
            <div className={`toggle-switch ${easyMode ? 'on' : ''}`}>
              <div className="toggle-knob" />
            </div>
          </div>
        </div>

        <div className="menu-section">
          <div className="menu-section-title">Modos</div>
          <div className="mode-detail">
            <div className={`mode-pill ${!easyMode ? 'active-adv' : ''}`}>
              ⚗️ Avanzado
            </div>
            <div className="mode-detail-text">
              Control total: PPG, IBU Tinseth, CO₂ residual exacto, múltiples maltas y lúpulos.
            </div>
          </div>
          <div className="mode-detail" style={{ marginTop: '10px' }}>
            <div className={`mode-pill ${easyMode ? 'active-easy' : ''}`}>
              🌱 Fácil
            </div>
            <div className="mode-detail-text">
              Diseñado para principiantes: menos datos, lenguaje simple, resultados directos.
            </div>
          </div>
        </div>

        <div className="menu-footer">
          <span>🍺 BrewCalc — 100% gratis, sin trackers</span>
        </div>
      </div>
    </>
  )
}
