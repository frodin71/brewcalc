export default function AboutPage({ onClose }) {
  return (
    <div className="wiki-overlay">
      <div className="wiki-page">
        <div className="wiki-header">
          <button className="wiki-back" onClick={onClose}>← Volver</button>
          <span className="wiki-header-title">ℹ️ Acerca de BrewCalc</span>
        </div>

        <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="card" style={{ textAlign: 'center', padding: '28px 16px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🍺</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-amber)' }}>BrewCalc</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-muted)', marginTop: '4px' }}>v2.0 — Calculadora de cerveza artesanal</div>
          </div>

          <div className="card">
            <div className="card-title">🧮 Fórmulas utilizadas</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                ['OG (densidad original)',   'PPG × kg × eficiencia × 8.345 / L'],
                ['ABV',                      '(OG − FG) × 131.25'],
                ['IBU (Tinseth)',             'g × alpha% × utilización × 1000 / L'],
                ['CO₂ residual',             '3.0378 − 0.050062·T°F + 0.00026555·T°F²'],
                ['Color SRM (Morey)',        '1.4922 × MCU^0.6859'],
                ['Strike water (Palmer)',    '(0.41 / ratio) × (T_mash − T_grano) + T_mash'],
                ['Corrección densímetro',    'Fórmula Brewer\'s Friend (cal. 60°F)'],
              ].map(([name, formula], i) => (
                <div key={i} style={{ borderBottom: '1px solid #222', paddingBottom: '8px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)' }}>{name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontFamily: 'monospace', marginTop: '2px' }}>{formula}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">📱 Características</div>
            <div className="info-box">
              {[
                '100% gratis — sin publicidad, sin tracking, sin cookies',
                'Funciona offline después de instalada',
                'Mobile-first — diseñada para el brew day',
                'Modo Fácil para principiantes + Modo Avanzado',
                'Mini wiki con guía de elaboración completa',
                'Disponible en español',
              ].map((f, i) => (
                <div key={i} style={{ padding: '4px 0', borderBottom: i < 5 ? '1px solid #1E1E1E' : 'none' }}>
                  ✓ {f}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">🔗 Proyecto abierto</div>
            <div className="info-box">
              El código fuente está disponible en GitHub. Si encuentras un error o quieres sugerir una mejora, puedes abrir un issue.
            </div>
            <div style={{ marginTop: '10px', fontSize: '0.82rem', color: 'var(--color-muted)', fontFamily: 'monospace' }}>
              github.com/frodin71/brewcalc
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
