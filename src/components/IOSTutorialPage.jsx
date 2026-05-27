export default function IOSTutorialPage({ onClose }) {
  const steps = [
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" rx="8" fill="#1C1C1E"/>
          <path d="M18 8v14M12 14l6-6 6 6" stroke="#4FC3F7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="9" y="24" width="18" height="4" rx="2" stroke="#4FC3F7" strokeWidth="2" fill="none"/>
        </svg>
      ),
      title: 'Toca el botón Compartir',
      desc: 'En Safari, toca el ícono de compartir en la barra inferior — es un cuadrado con una flecha apuntando hacia arriba.',
    },
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" rx="8" fill="#1C1C1E"/>
          <rect x="9" y="10" width="18" height="16" rx="3" stroke="#F5A623" strokeWidth="2" fill="none"/>
          <path d="M13 18h10M18 13v10" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Toca "Agregar a pantalla de inicio"',
      desc: 'Desliza hacia abajo en el menú hasta encontrar la opción "Agregar a pantalla de inicio" y tócala.',
    },
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" rx="8" fill="#1C1C1E"/>
          <path d="M11 18l5 5 9-9" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Toca "Agregar"',
      desc: 'En la esquina superior derecha de la ventana que aparece, toca "Agregar". ¡Listo! BrewCalc estará en tu pantalla de inicio.',
    },
  ]

  return (
    <div className="wiki-overlay">
      <div className="wiki-page">
        <div className="wiki-header">
          <button className="wiki-back" onClick={onClose}>← Volver</button>
          <span className="wiki-header-title">📱 Instalar en iPhone / iPad</span>
        </div>

        <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

          <div className="card" style={{ textAlign: 'center', padding: '20px 16px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🍺</div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '6px' }}>
              Agrega BrewCalc a tu pantalla de inicio
            </div>
            <p className="card-desc" style={{ margin: 0 }}>
              En iPhone e iPad, Safari te permite guardar cualquier web como si fuera una app. Así funciona sin conexión y sin barra de Safari.
            </p>
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: '12px' }}>Pasos a seguir</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {steps.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ flexShrink: 0, paddingTop: '2px' }}>{step.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>
                      <span style={{
                        display: 'inline-block',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'var(--color-amber)',
                        color: '#000',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        textAlign: 'center',
                        lineHeight: '20px',
                        marginRight: '8px',
                      }}>{i + 1}</span>
                      {step.title}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--color-muted)', lineHeight: '1.5' }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">⚠️ Importante</div>
            <div className="info-box">
              <div style={{ padding: '4px 0', borderBottom: '1px solid #1E1E1E' }}>
                Solo funciona desde <strong>Safari</strong>. Chrome y otros navegadores en iPhone no tienen esta opción.
              </div>
              <div style={{ padding: '4px 0', borderBottom: '1px solid #1E1E1E', marginTop: '4px' }}>
                Una vez instalada, BrewCalc abre sin la barra de Safari y guarda tus datos localmente.
              </div>
              <div style={{ padding: '4px 0', marginTop: '4px' }}>
                Si ya la abriste desde Chrome, copia la dirección y pégala en Safari.
              </div>
            </div>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>✅</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--color-muted)' }}>
              Después de instalada, búscala en tu pantalla de inicio con el ícono de la cerveza 🍺
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
