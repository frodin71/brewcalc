# BrewCalc 🍺

Calculadora de cerveza artesanal — PWA mobile-first, 100% gratuita, sin trackers.

## Stack técnico

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite 5 |
| Estilos | CSS puro (variables CSS, dark theme) |
| Base de datos / Auth | Supabase (PostgreSQL + Auth) |
| OAuth | Google Cloud Platform |
| Deploy | GitHub Pages (CI/CD automático) |
| PWA | Web App Manifest + meta tags |

---

## Estructura del proyecto

```
brewcalc/
├── public/
│   ├── manifest.json        # Config PWA (nombre, íconos, colores)
│   └── beer.svg             # Favicon de la pestaña del navegador
│
├── src/
│   ├── main.jsx             # Punto de entrada React
│   ├── App.jsx              # Tabs, menú hamburguesa, overlays, lógica de modo easy/avanzado
│   ├── index.css            # Todos los estilos (variables, componentes, layout)
│   │
│   ├── context/
│   │   └── AppContext.jsx   # Estado global: unidades, notas, recetas, bitácora, usuario, auth
│   │
│   ├── lib/
│   │   └── supabase.js      # Cliente Supabase (URL + anon key)
│   │
│   └── components/
│       ├── NumInput.jsx          # Input numérico con soporte decimal móvil
│       ├── Menu.jsx              # Drawer lateral (modo, unidades, herramientas, cuenta)
│       ├── AuthModal.jsx         # Login/registro con email o Google
│       │
│       ├── FullRecipeCalc.jsx    # ⭐ Receta completa: OG + IBU + SRM + ABV + agua + carbonatación
│       ├── RecipeCalc.jsx        # Calculadora OG simple (modo avanzado, en Otros)
│       ├── EasyRecipeCalc.jsx    # Calculadora OG simple (modo fácil, en Otros)
│       │
│       ├── AbvCalc.jsx           # Tab ABV avanzado
│       ├── EasyAbvCalc.jsx       # Tab ABV fácil
│       ├── CarbonationCalc.jsx   # Tab Carbonatación avanzado
│       ├── EasyCarbonationCalc.jsx
│       ├── HopCalc.jsx           # Tab Lúpulos avanzado
│       ├── EasyHopCalc.jsx
│       │
│       ├── MoreCalcs.jsx         # Tab Otros: Brew Day Timer + Calculadora OG + extras
│       ├── BrewDayTimer.jsx      # Asistente paso a paso para brew day (7 pasos + alertas)
│       ├── StrikeWaterCalc.jsx   # Temperatura de strike
│       ├── ColorCalc.jsx         # Color SRM/EBC
│       ├── HydrometerCalc.jsx    # Corrección densímetro por temperatura
│       ├── WaterCalc.jsx         # Volúmenes mash + sparge
│       │
│       ├── WikiPage.jsx          # Glosario de brewing (ingredientes, proceso, siglas)
│       ├── NotesPage.jsx         # Notas libres sincronizadas con Supabase
│       ├── SavedRecipesPage.jsx  # Recetas guardadas (clickeables, editables)
│       ├── BrewLogPage.jsx       # Bitácora de lotes (clickeable, editar OG/FG real)
│       ├── AboutPage.jsx         # Versión, fórmulas y créditos
│       └── IOSTutorialPage.jsx   # Tutorial de instalación en iPhone/iPad
│
├── .github/
│   └── workflows/
│       └── deploy.yml       # CI/CD: build + push a gh-pages en cada push a main
│
├── index.html               # Entry HTML (favicon, manifest, meta viewport)
├── vite.config.js           # base: '/brewcalc/' para GitHub Pages
└── package.json
```

---

## Base de datos — Supabase

**Proyecto:** `hkzavsbpxkgkyddpqmne`
**URL:** `https://hkzavsbpxkgkyddpqmne.supabase.co`
**Dashboard:** https://supabase.com/dashboard/project/hkzavsbpxkgkyddpqmne

### Tabla: `user_data`

| Columna | Tipo | Descripción |
|---|---|---|
| `user_id` | uuid (PK) | ID del usuario de Supabase Auth |
| `notes` | text | Notas libres del usuario |
| `saved_recipes` | jsonb | Array de recetas guardadas |
| `brew_log` | jsonb | Array de entradas de bitácora |
| `updated_at` | timestamptz | Última sincronización |

**RLS (Row Level Security):** activada — cada usuario solo puede leer/escribir su propia fila.

### Estructura de un objeto en `saved_recipes`

```json
{
  "name": "IPA de Verano",
  "batchSize": 20,
  "efficiency": 75,
  "mashTemp": 67,
  "mashDuration": 60,
  "boilDuration": 60,
  "yeast": "US-05 (American Ale)",
  "grains": [{ "name": "Malta Pale 2-Row", "kg": 4.5 }],
  "hops": [{ "name": "Citra", "grams": 30, "time": 60 }],
  "og": 1.055,
  "fgEst": 1.012,
  "abvEst": 5.6,
  "ibu": 42.3,
  "srm": 6.1,
  "strikeTemp": 72.4,
  "strikeVol": 13.5,
  "spargeVol": 18.2,
  "carbTarget": 2.5,
  "sugarGrams": 142,
  "savedAt": "28/5/2026"
}
```

### Estructura de un objeto en `brew_log`

Igual que `saved_recipes` pero con campos adicionales de medición real:
```json
{
  "date": "2026-05-28",
  "ogTarget": 1.055,
  "ogActual": 1.052,
  "fgActual": 1.011,
  "abvActual": 5.38,
  "notes": "Fermentación a 19°C, resultado excelente"
}
```

---

## Autenticación

Supabase Auth maneja registro, login y sesiones.

**Métodos habilitados:**
- Email + contraseña (con confirmación de correo)
- Google OAuth

**Flujo de datos al iniciar sesión:**
1. Si el usuario ya tiene fila en `user_data` → carga sus datos en el estado de React + localStorage
2. Si es la primera vez → sube los datos locales (localStorage) a Supabase como punto de partida
3. Cada cambio (guardar receta, agregar nota, etc.) actualiza localStorage Y hace upsert en Supabase

---

## Google OAuth — GCP

**Dónde está configurado:** Google Cloud Platform → APIs & Services → Credentials

El Client ID y Client Secret de OAuth 2.0 están pegados en Supabase:
`Dashboard Supabase → Authentication → Providers → Google`

**URLs autorizadas configuradas en GCP:**
- `https://hkzavsbpxkgkyddpqmne.supabase.co/auth/v1/callback`

El redirect post-login apunta a `window.location.href` para funcionar tanto en localhost como en producción.

---

## Deploy — GitHub Pages

**URL de producción:** https://frodin71.github.io/brewcalc/

**Flujo:**
1. `git push` a la rama `main`
2. GitHub Actions ejecuta `.github/workflows/deploy.yml`
3. Hace `npm install` + `npm run build`
4. Publica la carpeta `dist/` en la rama `gh-pages` con `peaceiris/actions-gh-pages@v3`
5. GitHub Pages sirve esa rama automáticamente

**Base URL de Vite:** `/brewcalc/` — necesario para que los assets carguen bien desde un subdirectorio de GitHub Pages.

---

## Git — SSH multi-cuenta

El remote está configurado con un alias SSH para manejar múltiples cuentas de GitHub en el mismo Mac.

```bash
# Ver remote:
git remote -v
# origin  git@github-personal:frodin71/brewcalc.git

# Para pushear:
git push git@github-personal:frodin71/brewcalc.git main
```

El alias `github-personal` está definido en `~/.ssh/config` y apunta a la clave SSH de la cuenta `frodin71`.

---

## Comandos útiles

```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Deploy (basta con pushear a main, el CI hace el resto)
git push git@github-personal:frodin71/brewcalc.git main

# Ver historial
git log --oneline -10
```

---

## Modo fácil vs. avanzado

Controlado por `easyMode` en `App.jsx`. El toggle está en el menú lateral (desmarcado = fácil, marcado = avanzado).

La tab "Receta" siempre muestra `FullRecipeCalc`. El modo fácil/avanzado afecta las tabs ABV, Carbonatación, Lúpulos y la "Calculadora de OG" en Otros.

---

## Persistencia de datos

```
Sin login  →  solo localStorage (se pierde si se limpia el navegador)
Con login  →  localStorage (inmediato) + Supabase (sincronizado en cada cambio)
```

Claves de localStorage:
- `brewcalc_units` — sistema de unidades (metric / imperial)
- `brewcalc_notes` — notas libres
- `brewcalc_recipes` — array JSON de recetas (máx. 20)
- `brewcalc_log` — array JSON de bitácora (máx. 50)
