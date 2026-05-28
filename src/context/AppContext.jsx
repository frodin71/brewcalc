import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AppContext = createContext(null)

const LS_UNITS   = 'brewcalc_units'
const LS_NOTES   = 'brewcalc_notes'
const LS_RECIPES = 'brewcalc_recipes'
const LS_LOG     = 'brewcalc_log'

export function AppProvider({ children }) {
  const [units,        setUnits]        = useState(() => localStorage.getItem(LS_UNITS)   || 'metric')
  const [notes,        setNotes]        = useState(() => localStorage.getItem(LS_NOTES)   || '')
  const [savedRecipes, setSavedRecipes] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_RECIPES)) || [] } catch { return [] }
  })
  const [brewLog, setBrewLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_LOG)) || [] } catch { return [] }
  })
  const [installPrompt, setInstallPrompt] = useState(null)
  const [user,          setUser]          = useState(null)

  // ── Auth state listener ────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        loadUserData(session.user.id)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadUserData(session.user.id)
    })

    return () => subscription.unsubscribe()
  }, [])

  // ── PWA install prompt ─────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  // ── Cloud helpers ──────────────────────────────────────────────────────────
  async function loadUserData(userId) {
    const { data } = await supabase
      .from('user_data')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (data) {
      setNotes(data.notes || '')
      setSavedRecipes(data.saved_recipes || [])
      setBrewLog(data.brew_log || [])
      localStorage.setItem(LS_NOTES,   data.notes || '')
      localStorage.setItem(LS_RECIPES, JSON.stringify(data.saved_recipes || []))
      localStorage.setItem(LS_LOG,     JSON.stringify(data.brew_log || []))
    } else {
      // First login — upload local data to cloud
      await supabase.from('user_data').upsert({
        user_id:       userId,
        notes:         localStorage.getItem(LS_NOTES) || '',
        saved_recipes: JSON.parse(localStorage.getItem(LS_RECIPES) || '[]'),
        brew_log:      JSON.parse(localStorage.getItem(LS_LOG)     || '[]'),
        updated_at:    new Date().toISOString(),
      })
    }
  }

  function syncCloud(overrides = {}) {
    if (!user) return
    supabase.from('user_data').upsert({
      user_id:       user.id,
      notes:         overrides.notes         ?? localStorage.getItem(LS_NOTES) ?? '',
      saved_recipes: overrides.saved_recipes ?? JSON.parse(localStorage.getItem(LS_RECIPES) || '[]'),
      brew_log:      overrides.brew_log      ?? JSON.parse(localStorage.getItem(LS_LOG)     || '[]'),
      updated_at:    new Date().toISOString(),
    }, { onConflict: 'user_id' })
  }

  // ── Local actions ──────────────────────────────────────────────────────────
  const toggleUnits = () => {
    const next = units === 'metric' ? 'imperial' : 'metric'
    setUnits(next)
    localStorage.setItem(LS_UNITS, next)
  }

  const saveNotes = (text) => {
    setNotes(text)
    localStorage.setItem(LS_NOTES, text)
    syncCloud({ notes: text })
  }

  const saveRecipe = (recipe) => {
    const updated = [{ ...recipe, savedAt: new Date().toLocaleDateString('es') }, ...savedRecipes].slice(0, 20)
    setSavedRecipes(updated)
    localStorage.setItem(LS_RECIPES, JSON.stringify(updated))
    syncCloud({ saved_recipes: updated })
  }

  const deleteRecipe = (i) => {
    const updated = savedRecipes.filter((_, idx) => idx !== i)
    setSavedRecipes(updated)
    localStorage.setItem(LS_RECIPES, JSON.stringify(updated))
    syncCloud({ saved_recipes: updated })
  }

  const addBrewEntry = (entry) => {
    const updated = [entry, ...brewLog].slice(0, 50)
    setBrewLog(updated)
    localStorage.setItem(LS_LOG, JSON.stringify(updated))
    syncCloud({ brew_log: updated })
  }

  const updateBrewEntry = (id, updates) => {
    const updated = brewLog.map(e => e.id === id ? { ...e, ...updates } : e)
    setBrewLog(updated)
    localStorage.setItem(LS_LOG, JSON.stringify(updated))
    syncCloud({ brew_log: updated })
  }

  const deleteBrewEntry = (id) => {
    const updated = brewLog.filter(e => e.id !== id)
    setBrewLog(updated)
    localStorage.setItem(LS_LOG, JSON.stringify(updated))
    syncCloud({ brew_log: updated })
  }

  const triggerInstall = async () => {
    if (!installPrompt) return false
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setInstallPrompt(null)
    return outcome === 'accepted'
  }

  // ── Auth functions ─────────────────────────────────────────────────────────
  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signUp = (email, password) =>
    supabase.auth.signUp({ email, password })

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href },
    })

  return (
    <AppContext.Provider value={{
      units, toggleUnits,
      notes, saveNotes,
      savedRecipes, saveRecipe, deleteRecipe,
      brewLog, addBrewEntry, updateBrewEntry, deleteBrewEntry,
      installPrompt, triggerInstall,
      user, signIn, signUp, signOut, signInWithGoogle,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)

// ── Conversión de unidades ──────────────────────────────────────────────────

export function useUnits() {
  const { units } = useApp()
  const imp = units === 'imperial'

  return {
    units,
    // Volumen
    vol: (l) => imp ? `${(l / 3.785).toFixed(2)} gal` : `${l} L`,
    volLabel: imp ? 'gal' : 'L',
    volFactor: imp ? 1 / 3.785 : 1,
    volFromInput: (v) => imp ? v * 3.785 : v,   // input en unidad actual → litros internos
    // Peso
    mass: (kg) => imp ? `${(kg * 2.205).toFixed(2)} lb` : `${kg} kg`,
    massLabel: imp ? 'lb' : 'kg',
    massFactor: imp ? 2.205 : 1,
    massFromInput: (v) => imp ? v / 2.205 : v,  // input en unidad actual → kg internos
    // Gramos / onzas
    grams: (g) => imp ? `${(g / 28.35).toFixed(2)} oz` : `${g.toFixed(1)} g`,
    gramsLabel: imp ? 'oz' : 'g',
    // Temperatura
    temp: (c) => imp ? `${(c * 9/5 + 32).toFixed(1)}°F` : `${c}°C`,
    tempLabel: imp ? '°F' : '°C',
    tempFromInput: (v) => imp ? (v - 32) * 5/9 : v,
  }
}
