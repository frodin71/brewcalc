import { useState, useEffect, useRef } from 'react'
import NumInput from './NumInput'

function buildSteps(cfg) {
  return [
    {
      id: 'prep',
      label: 'Preparación',
      emoji: '🔥',
      type: 'manual',
      desc: `Calentar ${cfg.strikeVol?.toFixed(1) || '—'} L de agua a ${cfg.strikeTemp?.toFixed(1) || '—'}°C`,
    },
    {
      id: 'mash',
      label: 'Mash',
      emoji: '🌾',
      type: 'countdown',
      duration: (cfg.mashDuration || 60) * 60,
      desc: `Mantener a ${cfg.mashTemp || 67}°C con ${cfg.totalGrainKg?.toFixed(2) || '—'} kg de malta`,
    },
    {
      id: 'lauter',
      label: 'Filtrado',
      emoji: '🚿',
      type: 'manual',
      desc: 'Recircular el mosto (vorlauf) y filtrar hacia la olla de cocción',
    },
    {
      id: 'heatup',
      label: 'Calentar al hervor',
      emoji: '🌡️',
      type: 'manual',
      desc: 'Llevar el mosto a hervor completo (100°C)',
    },
    {
      id: 'boil',
      label: 'Hervor',
      emoji: '♨️',
      type: 'boil',
      duration: (cfg.boilDuration || 60) * 60,
      desc: `Hervir ${cfg.boilDuration || 60} minutos`,
      hopAdditions: [...(cfg.hops || [])].filter(h => h.grams > 0).sort((a, b) => b.time - a.time),
    },
    {
      id: 'chill',
      label: 'Enfriado',
      emoji: '❄️',
      type: 'manual',
      desc: 'Enfriar el mosto a temperatura de pitcheo (~20°C)',
    },
    {
      id: 'done',
      label: '¡Inocular!',
      emoji: '🧫',
      type: 'done',
      desc: 'Transferir al fermentador, oxigenar e inocular con la levadura',
    },
  ]
}

function playBeep(freq = 880, dur = 0.4, repeats = 1) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    for (let i = 0; i < repeats; i++) {
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = freq
      osc.type = 'sine'
      const t = ctx.currentTime + i * (dur + 0.1)
      gain.gain.setValueAtTime(0.6, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur)
      osc.start(t)
      osc.stop(t + dur)
    }
  } catch (e) {}
}

function fmt(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function BrewDayTimer({ recipe }) {
  const [phase,       setPhase]      = useState(recipe ? 'running' : 'setup')
  const [stepIndex,   setStepIndex]  = useState(0)
  const [timeLeft,    setTimeLeft]   = useState(0)
  const [running,     setRunning]    = useState(false)
  const [currentAlert, setCurrentAlert] = useState(null)

  const [manualMash,  setManualMash]  = useState(60)
  const [manualBoil,  setManualBoil]  = useState(60)
  const [manualHops,  setManualHops]  = useState([])

  const alertedHops = useRef(new Set())
  const intervalRef = useRef(null)
  const steps       = useRef([])

  function initSteps(cfg) {
    steps.current = buildSteps(cfg)
    alertedHops.current = new Set()
    const first = steps.current[0]
    setTimeLeft(first.duration || 0)
    setStepIndex(0)
    setRunning(false)
    setCurrentAlert(null)
  }

  useEffect(() => {
    if (recipe) {
      initSteps(recipe)
    }
  }, [])

  useEffect(() => {
    if (phase !== 'running') return
    const step = steps.current[stepIndex]
    if (!step) return

    if (running && (step.type === 'countdown' || step.type === 'boil')) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const next = prev - 1

          if (step.type === 'boil' && step.hopAdditions) {
            step.hopAdditions.forEach(h => {
              const key = `${h.name}-${h.time}`
              if (!alertedHops.current.has(key) && next <= h.time * 60) {
                alertedHops.current.add(key)
                playBeep(880, 0.3, 3)
                const msg = `🌿 ¡Agregar ${h.grams}g de ${h.name}! (${h.time} min restantes)`
                setCurrentAlert(msg)
                setTimeout(() => setCurrentAlert(null), 5000)
              }
            })
          }

          if (next <= 0) {
            playBeep(523, 0.5, 1)
            clearInterval(intervalRef.current)
            setRunning(false)
            return 0
          }
          return next
        })
      }, 1000)
    }

    return () => clearInterval(intervalRef.current)
  }, [running, stepIndex, phase])

  function goNext() {
    const nextIdx = stepIndex + 1
    if (nextIdx >= steps.current.length) return
    const nextStep = steps.current[nextIdx]
    setStepIndex(nextIdx)
    setTimeLeft(nextStep.duration || 0)
    setRunning(false)
    setCurrentAlert(null)
  }

  function resetStep() {
    const step = steps.current[stepIndex]
    clearInterval(intervalRef.current)
    setRunning(false)
    setTimeLeft(step.duration || 0)
  }

  function handleStart() {
    const cfg = {
      mashDuration: manualMash,
      boilDuration: manualBoil,
      hops: manualHops,
      mashTemp: 67,
    }
    initSteps(cfg)
    setPhase('running')
  }

  function handleReset() {
    clearInterval(intervalRef.current)
    steps.current = []
    alertedHops.current = new Set()
    setPhase(recipe ? 'running' : 'setup')
    setStepIndex(0)
    setTimeLeft(0)
    setRunning(false)
    setCurrentAlert(null)
    if (recipe) initSteps(recipe)
  }

  function addManualHop() {
    setManualHops(prev => [...prev, { name: '', grams: '', time: 60 }])
  }

  function updateManualHop(i, field, val) {
    setManualHops(prev => prev.map((h, idx) => idx === i ? { ...h, [field]: val } : h))
  }

  function removeManualHop(i) {
    setManualHops(prev => prev.filter((_, idx) => idx !== i))
  }

  if (phase === 'setup') {
    return (
      <div>
        <div className="card">
          <div className="card-title">⏱️ Brew Day Timer</div>
          <p className="card-desc">Configura los tiempos para comenzar el asistente de elaboración.</p>
          <div className="form-group">
            <label className="form-label">Duración del mash (min)</label>
            <NumInput value={manualMash} min={1} max={120} onChange={setManualMash} />
          </div>
          <div className="form-group">
            <label className="form-label">Duración del hervor (min)</label>
            <NumInput value={manualBoil} min={1} max={120} onChange={setManualBoil} />
          </div>
        </div>

        <div className="card">
          <div className="card-title">🌿 Adiciones de lúpulo (opcional)</div>
          {manualHops.map((h, i) => (
            <div key={i} className="ingredient-row" style={{ marginBottom: '8px' }}>
              <input
                className="form-input"
                type="text"
                placeholder="Nombre (ej: Cascade)"
                value={h.name}
                onChange={e => updateManualHop(i, 'name', e.target.value)}
                style={{ flex: 2 }}
              />
              <input
                className="form-input"
                type="number"
                placeholder="g"
                min="0"
                value={h.grams}
                onChange={e => updateManualHop(i, 'grams', e.target.value)}
                style={{ flex: 1 }}
              />
              <input
                className="form-input"
                type="number"
                placeholder="min"
                min="0"
                max="120"
                value={h.time}
                onChange={e => updateManualHop(i, 'time', e.target.value)}
                style={{ flex: 1 }}
              />
              <button className="btn-remove" onClick={() => removeManualHop(i)}>✕</button>
            </div>
          ))}
          {manualHops.length < 3 && (
            <button className="btn-add" onClick={addManualHop}>+ Agregar lúpulo</button>
          )}
        </div>

        <div className="card">
          <button
            className="action-btn"
            style={{ background: 'var(--color-amber)', color: '#000', fontWeight: 700, width: '100%' }}
            onClick={handleStart}
          >
            🚀 Iniciar Brew Day
          </button>
        </div>
      </div>
    )
  }

  const step    = steps.current[stepIndex]
  const total   = steps.current.length
  const nextStep = steps.current[stepIndex + 1]
  const isTimer  = step?.type === 'countdown' || step?.type === 'boil'
  const progress = ((stepIndex) / (total - 1)) * 100

  const alertedSet = alertedHops.current
  const hopSchedule = step?.type === 'boil' ? (step.hopAdditions || []) : []

  return (
    <div>
      {/* Progress bar */}
      <div style={{ padding: '0 0 8px' }}>
        <div style={{
          height: '4px',
          background: 'var(--color-border)',
          borderRadius: '2px',
          overflow: 'hidden',
          marginBottom: '6px',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'var(--color-amber)',
            borderRadius: '2px',
            transition: 'width 0.4s',
          }} />
        </div>
        <div style={{ color: 'var(--color-muted)', fontSize: '0.78rem', textAlign: 'center' }}>
          Paso {stepIndex + 1} de {total}
        </div>
      </div>

      {/* Alert */}
      {currentAlert && (
        <div style={{
          border: '2px solid var(--color-amber)',
          borderRadius: '12px',
          background: 'rgba(245,166,35,0.12)',
          padding: '14px 16px',
          marginBottom: '12px',
          fontWeight: 700,
          fontSize: '1rem',
          color: 'var(--color-amber)',
          textAlign: 'center',
          boxShadow: '0 0 16px rgba(245,166,35,0.3)',
        }}>
          {currentAlert}
        </div>
      )}

      {/* Current step card */}
      {step?.type === 'done' ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🎉</div>
          <div className="card-title">¡Elaboración completa!</div>
          <p className="card-desc">{step.desc}</p>
          <button
            className="action-btn"
            style={{ marginTop: '16px', background: 'var(--color-green)', color: '#fff', fontWeight: 700 }}
            onClick={handleReset}
          >
            🔄 Nueva elaboración
          </button>
        </div>
      ) : (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '2.4rem' }}>{step?.emoji}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{step?.label}</div>
              <div style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>{step?.desc}</div>
            </div>
          </div>

          {isTimer && (
            <>
              <div style={{
                fontSize: '3rem',
                fontWeight: 800,
                color: 'var(--color-amber)',
                textAlign: 'center',
                letterSpacing: '2px',
                margin: '16px 0',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {fmt(timeLeft)}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="action-btn"
                  style={{ flex: 1, background: running ? '#444' : 'var(--color-amber)', color: running ? 'var(--color-text)' : '#000', fontWeight: 700 }}
                  onClick={() => setRunning(r => !r)}
                >
                  {running ? '⏸ Pausar' : '▶ Iniciar'}
                </button>
                <button
                  className="action-btn"
                  style={{ flex: 1 }}
                  onClick={resetStep}
                >
                  ↺ Reiniciar
                </button>
              </div>
              {timeLeft === 0 && (
                <button
                  className="action-btn"
                  style={{ marginTop: '10px', width: '100%', background: 'var(--color-green)', color: '#fff', fontWeight: 700 }}
                  onClick={goNext}
                >
                  ✅ Continuar al siguiente paso
                </button>
              )}
            </>
          )}

          {step?.type === 'manual' && (
            <button
              className="action-btn"
              style={{ marginTop: '12px', width: '100%', background: 'var(--color-green)', color: '#fff', fontWeight: 700 }}
              onClick={goNext}
            >
              ✅ Listo — siguiente paso
            </button>
          )}
        </div>
      )}

      {/* Hop schedule for boil step */}
      {hopSchedule.length > 0 && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: '8px' }}>🌿 Adiciones de lúpulo</div>
          {hopSchedule.map((h, i) => {
            const key   = `${h.name}-${h.time}`
            const done  = alertedSet.has(key)
            return (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: '1px solid var(--color-border)',
                opacity: done ? 0.5 : 1,
              }}>
                <span style={{ textDecoration: done ? 'line-through' : 'none' }}>
                  {done ? '✅' : '⏳'} {h.grams}g {h.name}
                </span>
                <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>
                  {h.time} min
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Next step preview */}
      {nextStep && step?.type !== 'done' && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '10px',
          padding: '10px 14px',
          marginTop: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: 'var(--color-muted)',
          fontSize: '0.85rem',
        }}>
          <span style={{ fontSize: '1.2rem' }}>{nextStep.emoji}</span>
          <span>Siguiente: <strong style={{ color: 'var(--color-text)' }}>{nextStep.label}</strong></span>
        </div>
      )}
    </div>
  )
}
