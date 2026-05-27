# 🍺 BrewCalc

Calculadora de cerveza artesanal — mobile first, dark theme, 100% en el navegador.

## Calculadoras incluidas

| Tab | Descripción |
|-----|-------------|
| 🌾 Receta | OG estimado a partir del grano + eficiencia del mash |
| 📊 ABV | Alcohol por Volumen desde OG y FG, atenuación, calorías |
| 🫧 Carbonatación | Azúcar de priming por refermentación (botella/barril) |
| 🌿 Lúpulos | IBU total con fórmula Tinseth, múltiples adiciones |

## Fórmulas

- **OG** → `puntos = Σ(kg × PPG × eficiencia × 8.345) / litros`
- **ABV** → `(OG − FG) × 131.25`
- **IBU** → Tinseth: `(g × alpha% × utilización × 1000) / L`
- **CO₂ residual** → `3.0378 − 0.050062·T_F + 0.00026555·T_F²`
- **Azúcar priming** → `(CO₂ deseado − CO₂ residual) × factor × litros`

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy a GitHub Pages

```bash
npm run build
# luego publica el directorio dist/
```

---

Hecho con React + Vite. Sin backend, sin tracking, sin cookies.
