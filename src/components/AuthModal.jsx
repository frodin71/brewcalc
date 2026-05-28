import { useState } from 'react'
import { useApp } from '../context/AppContext'

function translateError(msg) {
  if (msg.includes('Invalid login credentials')) return 'Correo o contraseña incorrectos'
  if (msg.includes('Email not confirmed')) return 'Confirma tu correo antes de iniciar sesión'
  if (msg.includes('User already registered')) return 'Ya existe una cuenta con ese correo'
  if (msg.includes('Password should be')) return 'La contraseña debe tener al menos 6 caracteres'
  return msg
}

export default function AuthModal({ onClose }) {
  const { signIn, signUp, signInWithGoogle } = useApp()

  const [tab,      setTab]      = useState('login')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)
  const [message,  setMessage]  = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true); setError(null); setMessage(null)
    if (tab === 'login') {
      const { error } = await signIn(email, password)
      if (error) setError(translateError(error.message))
      else onClose()
    } else {
      const { error } = await signUp(email, password)
      if (error) setError(translateError(error.message))
      else setMessage('Revisa tu correo para confirmar la cuenta y luego inicia sesión.')
    }
    setLoading(false)
  }

  async function handleGoogle() {
    setLoading(true)
    await signInWithGoogle()
    setLoading(false)
    // Google will redirect away, modal closes on return via onAuthStateChange
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          borderRadius: '16px',
          padding: '24px',
          width: '100%',
          maxWidth: '380px',
          boxSizing: 'border-box',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '6px' }}>🍺</div>
          <div style={{ fontWeight: '700', fontSize: '1.2rem', marginBottom: '4px' }}>BrewCalc</div>
          <div style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>
            Inicia sesión para sincronizar tus datos
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid var(--color-border)' }}>
          {['login', 'register'].map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(null); setMessage(null) }}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                borderBottom: tab === t ? '2px solid #f59e0b' : '2px solid transparent',
                color: tab === t ? '#f59e0b' : 'var(--color-muted)',
                fontWeight: tab === t ? '600' : '400',
                padding: '10px 0',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.15s',
              }}
            >
              {t === 'login' ? 'Entrar' : 'Registrarse'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-input"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <input
            type="password"
            className="form-input"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '14px' }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: '#f59e0b',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              fontWeight: '700',
              fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {tab === 'login' ? 'Entrar' : 'Registrarse'}
          </button>
        </form>

        {error && (
          <div style={{ color: '#f87171', fontSize: '0.83rem', marginTop: '10px', textAlign: 'center' }}>
            {error}
          </div>
        )}
        {message && (
          <div style={{ color: '#4ade80', fontSize: '0.83rem', marginTop: '10px', textAlign: 'center' }}>
            {message}
          </div>
        )}

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '16px 0' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--color-border)' }} />
          <span style={{ color: 'var(--color-muted)', fontSize: '0.8rem' }}>o</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--color-border)' }} />
        </div>

        {/* Google button */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          style={{
            width: '100%',
            background: '#fff',
            color: '#222',
            border: '1px solid #444',
            borderRadius: '8px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            fontSize: '0.9rem',
            fontWeight: '500',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continuar con Google
        </button>
      </div>
    </div>
  )
}
