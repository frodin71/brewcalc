import { useState, useMemo } from 'react'

const BITTERNESS_LEVELS = [
  {
    id: 'suave',
    label: 'Suave',
    emoji: '😊',
    desc: 'Casi sin amargor. Se siente apenas.',
    ibu: 12,
    color: '#4FC3F7',
  },
  {
    id: 'moderado',
    label: 'Moderado',
    emoji: '🍺',
    desc: 'Amargor balanceado. Lo típico de una Pale Ale.',
    ibu: 30,
    color: '#4CAF50',
  },
  {
    id: 'amargo',
    label: 'Amargo',
    emoji: '😤',
    desc: 'Amargor notorio. Estilo IPA.',
    ibu: 55,
    color: '#F5A623',
  },
  {
    id: 'muyamargo',
    label: 'Muy amargo',
    emoji: '🔥',
    desc: 'Amargor intenso. Para amantes del lúpulo.',
    ibu: 80,
    color: '#EF5350',
  },
]

const HOP_OPTIONS = [
  { name: 'Cascade',    alpha: 5.5,  desc: 'Cítrico, floral' },
  { name: 'Centennial', alpha: 10.0, desc: 'Cítrico, pino' },
  { name: 'Saaz',       alpha: 3.5,  desc: 'Herbal, terroso — ideal para lager' },
  { name: 'Hallertau',  alpha: 4.5,  desc: 'Floral, suave — clásico alemán' },
  { name: 'Citra',      alpha: 12.0, desc: 'Tropical, muy aromático' },
  { name: 'Simcoe',     alpha: 13.0, desc: 'Pino, fruta del bosque' },
]

// Tinseth simplificado: asumimos 60 min, OG 1.050
function calcGrams(targetIBU, alphaPct, liters) {
  const og = 1.050
  const bigness    = 1.65 * Math.pow(0.000125, og - 1)
  const timeFactor = (1 - Math.exp(-0.04 * 60)) / 4.15
  const u          = bigness * timeFactor
  // IBU = (g * alpha_decimal * u * 1000) / L → g = IBU * L / (alpha_decimal * u * 1000)
  return (targetIBU * liters) / ((alphaPct / 100) * u * 1000)
}

export default function EasyHopCalc() {
  const [liters, setLiters]       = useState(20)
  const [levelId, setLevelId]     = useState('moderado')
  const [hopIdx, setHopIdx]       = useState(0)

  const level = BITTERNESS_LEVELS.find(l => l.id === levelId)
  const hop   = HOP_OPTIONS[hopIdx]

  const grams = useMemo(
    () => calcGrams(level.ibu, hop.alpha, liters),
    [level, hop, liters]
  )

  return (
    <div>
      <div className="card">
        <div className="card-title">🌿 ¿Cuánto lúpulo necesito?</div>
        <p className="card-desc">
          El lúpulo le da el amargor a la cerveza. Te decimos cuánto usar según lo amargo que lo quieras.
        </p>
      </div>

      <div className="card">
        <div className="easy-step-row">
          <span className="easy-step">1</span>
          <strong>¿Cuántos litros de cerveza?</strong>
        </div>
        <input
          type="number"
          className="form-input"
          style={{ fontSize: '1.5rem', textAlign: 'center', fontWeight: 700 }}
          value={liters}
          min="1" max="500"
          onChange={e => setLiters(Math.max(1, parseFloat(e.target.value) || 20))}
        />
      </div>

      <div className="card">
        <div className="easy-step-row">
          <span className="easy-step">2</span>
          <strong>¿Qué tan amargo lo quieres?</strong>
        </div>
        <div className="level-grid">
          {BITTERNESS_LEVELS.map(l => (
            <button
              key={l.id}
              className={`level-btn ${levelId === l.id ? 'active' : ''}`}
              style={levelId === l.id ? { borderColor: l.color, background: `${l.color}18` } : {}}
              onClick={() => setLevelId(l.id)}
            >
              <span className="level-emoji">{l.emoji}</span>
              <span className="level-label" style={levelId === l.id ? { color: l.color } : {}}>
                {l.label}
              </span>
              <span className="level-desc">{l.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="easy-step-row">
          <span className="easy-step">3</span>
          <strong>¿Qué lúpulo tienes?</strong>
        </div>
        <div className="easy-option-col">
          {HOP_OPTIONS.map((h, i) => (
            <button
              key={i}
              className={`easy-hop-btn ${hopIdx === i ? 'active' : ''}`}
              onClick={() => setHopIdx(i)}
            >
              <span className="easy-hop-name">{h.name}</span>
              <span className="easy-hop-desc">{h.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title" style={{ color: level.color }}>✅ Resultado</div>
        <div className="easy-result-hero">
          <div className="easy-result-emoji">{level.emoji}</div>
          <div className="easy-result-abv" style={{ color: level.color }}>
            {grams.toFixed(0)} g
          </div>
          <div className="easy-result-label">de {hop.name}</div>
          <div className="easy-result-desc" style={{ color: level.color }}>
            {level.label} — ~{level.ibu} IBU
          </div>
        </div>

        <div className="info-box" style={{ marginTop: '12px' }}>
          Agrega los <strong>{grams.toFixed(0)}g</strong> de <strong>{hop.name}</strong> al inicio del hervor
          y déjalos hervir durante <strong>60 minutos</strong>.
          {hop.name === 'Cascade' || hop.name === 'Citra' || hop.name === 'Simcoe'
            ? ' Puedes reservar una parte (10–15g) para agregar los últimos 5 min y potenciar el aroma.'
            : ''}
        </div>
      </div>

      <div className="card">
        <div className="card-title">💡 ¿Qué es el IBU?</div>
        <div className="info-box">
          IBU (International Bitterness Units) mide el amargor de la cerveza.
          Una cerveza suave tiene ~10 IBU, una IPA típica ~50 IBU y una Double IPA puede pasar los 80 IBU.
          El amargor que percibes también depende del dulzor de la malta — una cerveza oscura con 40 IBU puede sentirse menos amarga que una rubia con los mismos IBUs.
        </div>
      </div>
    </div>
  )
}
