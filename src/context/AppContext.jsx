import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

const LS_UNITS   = 'brewcalc_units'
const LS_NOTES   = 'brewcalc_notes'
const LS_RECIPES = 'brewcalc_recipes'
const LS_LOG     = 'brewcalc_log'

export function AppProvider({ children }) {
  const [units,       setUnits]       = useState(() => localStorage.getItem(LS_UNITS)   || 'metric')
  const [notes,       setNotes]       = useState(() => localStorage.getItem(LS_NOTES)   || '')
  const [savedRecipes, setSavedRecipes] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_RECIPES)) || [] } catch { return [] }
  })
  const [brewLog, setBrewLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_LOG)) || [] } catch { return [] }
  })
  const [installPrompt, setInstallPrompt] = useState(null)

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const toggleUnits = () => {
    const next = units === 'metric' ? 'imperial' : 'metric'
    setUnits(next)
    localStorage.setItem(LS_UNITS, next)
  }

  const saveNotes = (text) => {
    setNotes(text)
    localStorage.setItem(LS_NOTES, text)
  }

  const saveRecipe = (recipe) => {
    const updated = [{ ...recipe, savedAt: new Date().toLocaleDateString('es') }, ...savedRecipes].slice(0, 20)
    setSavedRecipes(updated)
    localStorage.setItem(LS_RECIPES, JSON.stringify(updated))
  }

  const deleteRecipe = (i) => {
    const updated = savedRecipes.filter((_, idx) => idx !== i)
    setSavedRecipes(updated)
    localStorage.setItem(LS_RECIPES, JSON.stringify(updated))
  }

  const addBrewEntry = (entry) => {
    const updated = [entry, ...brewLog].slice(0, 50)
    setBrewLog(updated)
    localStorage.setItem(LS_LOG, JSON.stringify(updated))
  }

  const deleteBrewEntry = (id) => {
    const updated = brewLog.filter(e => e.id !== id)
    setBrewLog(updated)
    localStorage.setItem(LS_LOG, JSON.stringify(updated))
  }

  const triggerInstall = async () => {
    if (!installPrompt) return false
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setInstallPrompt(null)
    return outcome === 'accepted'
  }

  return (
    <AppContext.Provider value={{
      units, toggleUnits,
      notes, saveNotes,
      savedRecipes, saveRecipe, deleteRecipe,
      brewLog, addBrewEntry, deleteBrewEntry,
      installPrompt, triggerInstall,
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
