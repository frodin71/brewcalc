import { useState } from 'react'
import { AppProvider } from './context/AppContext'
import RecipeCalc from './components/RecipeCalc'
import CarbonationCalc from './components/CarbonationCalc'
import HopCalc from './components/HopCalc'
import AbvCalc from './components/AbvCalc'
import EasyRecipeCalc from './components/EasyRecipeCalc'
import EasyCarbonationCalc from './components/EasyCarbonationCalc'
import EasyHopCalc from './components/EasyHopCalc'
import EasyAbvCalc from './components/EasyAbvCalc'
import MoreCalcs from './components/MoreCalcs'
import Menu from './components/Menu'
import WikiPage from './components/WikiPage'
import NotesPage from './components/NotesPage'
import AboutPage from './components/AboutPage'
import SavedRecipesPage from './components/SavedRecipesPage'

const TABS = [
  { id: 'recipe',      label: 'Receta',   icon: '🌾' },
  { id: 'abv',         label: 'ABV',      icon: '📊' },
  { id: 'carbonation', label: 'Carbona.', icon: '🫧' },
  { id: 'hops',        label: 'Lúpulos',  icon: '🌿' },
  { id: 'more',        label: 'Otros',    icon: '⚙️' },
]

function AppInner() {
  const [activeTab, setActiveTab]   = useState('recipe')
  const [menuOpen, setMenuOpen]     = useState(false)
  const [easyMode, setEasyMode]     = useState(false)
  const [overlay, setOverlay]       = useState(null) // 'wiki' | 'notes' | 'about' | 'recipes'

  const toggleEasy = () => setEasyMode(v => !v)
  const openOverlay  = (name) => setOverlay(name)
  const closeOverlay = () => setOverlay(null)

  return (
    <div className="app">
      <header className="app-header">
        <span className="header-icon">🍺</span>
        <div className="header-text">
          <h1>BrewCalc</h1>
          <p>{easyMode ? '🌱 Modo Fácil' : '⚗️ Modo Avanzado'}</p>
        </div>
        <button className="hamburger-btn" onClick={() => setMenuOpen(true)} aria-label="Menú">
          <span /><span /><span />
        </button>
      </header>

      <Menu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        easyMode={easyMode}
        onToggle={toggleEasy}
        onOpenWiki={()    => openOverlay('wiki')}
        onOpenNotes={()   => openOverlay('notes')}
        onOpenAbout={()   => openOverlay('about')}
        onOpenRecipes={() => openOverlay('recipes')}
      />

      {overlay === 'wiki'    && <WikiPage          onClose={closeOverlay} />}
      {overlay === 'notes'   && <NotesPage         onClose={closeOverlay} />}
      {overlay === 'about'   && <AboutPage         onClose={closeOverlay} />}
      {overlay === 'recipes' && <SavedRecipesPage  onClose={closeOverlay} />}

      <main className="app-main">
        {activeTab === 'recipe'      && (easyMode ? <EasyRecipeCalc />      : <RecipeCalc />)}
        {activeTab === 'abv'         && (easyMode ? <EasyAbvCalc />         : <AbvCalc />)}
        {activeTab === 'carbonation' && (easyMode ? <EasyCarbonationCalc /> : <CarbonationCalc />)}
        {activeTab === 'hops'        && (easyMode ? <EasyHopCalc />         : <HopCalc />)}
        {activeTab === 'more'        && <MoreCalcs easyMode={easyMode} />}
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

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
