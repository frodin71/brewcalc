import { useState } from 'react'
import RecipeCalc from './components/RecipeCalc'
import CarbonationCalc from './components/CarbonationCalc'
import HopCalc from './components/HopCalc'
import AbvCalc from './components/AbvCalc'

const TABS = [
  { id: 'recipe',      label: 'Receta',       icon: '🌾' },
  { id: 'abv',         label: 'ABV',           icon: '📊' },
  { id: 'carbonation', label: 'Carbonatación', icon: '🫧' },
  { id: 'hops',        label: 'Lúpulos',       icon: '🌿' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('recipe')

  return (
    <div className="app">
      <header className="app-header">
        <span className="header-icon">🍺</span>
        <div className="header-text">
          <h1>BrewCalc</h1>
          <p>Calculadora de cerveza artesanal</p>
        </div>
      </header>

      <main className="app-main">
        {activeTab === 'recipe'      && <RecipeCalc />}
        {activeTab === 'abv'         && <AbvCalc />}
        {activeTab === 'carbonation' && <CarbonationCalc />}
        {activeTab === 'hops'        && <HopCalc />}
      </main>

      <nav className="bottom-nav">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            aria-label={tab.label}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
