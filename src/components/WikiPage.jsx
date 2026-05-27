import { useState } from 'react'

const SECTIONS = [
  {
    id: 'ingredientes',
    emoji: '🌾',
    title: 'Ingredientes',
    items: [
      {
        title: 'Malta — el alma de la cerveza',
        content: `La malta es cebada (u otro cereal) que fue germinada y luego secada/tostada en un horno. Durante la germinación se activan enzimas que más adelante convertirán el almidón en azúcar.

El tostado determina el color y sabor:
• Malta base (Pale, Pilsner): muy suave, aporta la mayoría del azúcar. Color paja.
• Malta Munich/Vienna: más tostada, notas de pan y galleta. Color dorado/ámbar.
• Crystal/Caramel: azúcares ya cristalizados, aportan dulzor y cuerpo. Color naranja a rojo.
• Chocolate/Black: muy tostadas, aportan color oscuro y sabores a café o cacao.

La cantidad total de malta determina la densidad original (OG) y el potencial de alcohol.`,
      },
      {
        title: 'Lúpulo — el amargor y el aroma',
        content: `El lúpulo es la flor de la planta Humulus lupulus. Aporta tres cosas clave:

• Amargor: los ácidos alfa del lúpulo se isomerizan durante el hervido y dan el amargor característico. Se mide en IBU.
• Aroma: aceites esenciales que se evaporan si se hierven. Por eso los lúpulos de aroma se agregan al final del hervido o en el fermentador (dry hopping).
• Conservante: tiene propiedades antibacterianas naturales.

Cuándo agregar:
• 60 min antes del final → máximo amargor, mínimo aroma
• 15-5 min → balance de amargor y aroma
• 0 min (flameout) / dry hop → solo aroma, cero amargor`,
      },
      {
        title: 'Levadura — la magia de la fermentación',
        content: `La levadura es un hongo unicelular que se come los azúcares del mosto y produce alcohol + CO₂. Sin levadura no hay cerveza.

Dos grandes familias:
• Ale (Saccharomyces cerevisiae): fermenta a 18–22°C, más rápida (1–2 semanas), produce ésteres afrutados. Para la mayoría de estilos.
• Lager (Saccharomyces pastorianus): fermenta a 8–12°C, más lenta y limpia. Para pilsner y lagers.

Cuánto agregar (pitch rate):
• Para 20L con OG 1.050 → 1 sobre de levadura seca (~11g) es suficiente.
• Más OG = necesitas más levadura.

La levadura no se "gasta" — se reproduce durante la fermentación. Puedes guardar la torta del fondo del fermentador para próximas tandas.`,
      },
      {
        title: 'Agua — el ingrediente invisible',
        content: `El agua es el 95% de tu cerveza pero es el ingrediente más ignorado por principiantes.

Minerales clave:
• Calcio (Ca²⁺): mejora la claridad, reduce el pH del mash. Ideal: 50–150 ppm.
• Sulfato (SO₄²⁻): potencia el amargor seco del lúpulo. Bueno para IPA.
• Cloruro (Cl⁻): redondea el sabor, resalta la malta. Bueno para stouts y ales maltosas.
• Bicarbonato (HCO₃⁻): sube el pH. En exceso puede dar sabor áspero.

Para empezar: agua de grifo filtrada o agua embotellada baja en minerales funciona bien para la mayoría de estilos. El agua muy calcárea puede dar sabores metálicos o ásperos.`,
      },
    ],
  },
  {
    id: 'proceso',
    emoji: '⚗️',
    title: 'El Proceso',
    items: [
      {
        title: 'Molienda',
        content: `Moler el grano justo antes de usarlo es lo ideal — los granos molidos se oxidan y pierden frescura rápido.

El objetivo: romper la cáscara para exponer el almidón sin pulverizarla. La cáscara actúa como filtro natural durante el lavado.

Si no tienes molino, muchas tiendas de homebrewing muelen el grano al momento de comprarlo.`,
      },
      {
        title: 'Mash (Maceración)',
        content: `Es el paso más importante del proceso. Mezclás los granos molidos con agua caliente y los dejás reposar ~60 minutos.

¿Qué pasa? Las enzimas del grano (alpha y beta amilasas) convierten el almidón en azúcares fermentables que la levadura después puede consumir.

Temperatura del mash:
• 62–65°C → más azúcares fermentables → cerveza más seca y con más alcohol
• 66–68°C → balance entre fermentable y no fermentable → cuerpo medio
• 68–70°C → más dextrinas (no fermentables) → cerveza más dulce y con más cuerpo

Temperatura del agua de entrada (strike water):
Generalmente ~75°C para que al mezclar con el grano frío llegue a los 66–68°C deseados.`,
      },
      {
        title: 'Sparge (Lavado del grano)',
        content: `Después del mash, el grano tiene azúcares atrapados. El sparge consiste en verter agua caliente (~76°C) sobre el grano para extraer esos azúcares restantes.

Dos métodos:
• Batch sparge: vacías el mash, agregas toda el agua de sparge, revuelves y volvés a drenar. Simple.
• Fly sparge: vas vertiendo agua lentamente mientras drenás. Más eficiente pero más complejo.

El agua de sparge no debe pasar de 78°C o puedes extraer taninos astringentes del grano.`,
      },
      {
        title: 'Hervido',
        content: `Hervís el mosto (líquido que extrajiste) durante 60–90 minutos. Durante el hervido:

• Se esteriliza el mosto (matas bacterias)
• Se evaporan compuestos indeseados (DMS, etc.)
• Se isomerizan los ácidos alfa del lúpulo (amargor)
• Se concentra el mosto (evaporación ~10–15% por hora)

Agregar lúpulos:
• Amargor → 60 min antes del final
• Sabor → 15 min antes del final
• Aroma → 5 min o al apagar el fuego (flameout)

Al final del hervido, enfría el mosto lo más rápido posible a la temperatura de fermentación (18–22°C para ales).`,
      },
      {
        title: 'Fermentación',
        content: `Transfiere el mosto frío al fermentador, agrega la levadura (pitching) y cierra con un airlock (válvula de agua que deja salir CO₂ pero no entra aire).

Fases:
• Lag (0–12h): la levadura se adapta, no hay actividad visible
• Fermentación activa (1–4 días): burbujeo intenso, espuma (kräusen)
• Fermentación final (día 5–14): el burbujeo se calma, la levadura termina el trabajo

La fermentación terminó cuando la densidad final (FG) es estable dos días seguidos.

Temperatura constante es clave — los cambios bruscos estresan la levadura y pueden producir sabores off.`,
      },
      {
        title: 'Maduración y Clarificación',
        content: `Después de la fermentación primaria, la cerveza se deja reposar (1–4 semanas más) para:

• Reabsorber compuestos indeseados (diacetilo, acetaldehído)
• Clarificarse (la levadura y proteínas precipitan al fondo)
• Integrar y redondear sabores

Cold crash: enfriar a 2–4°C durante 2–3 días acelera la clarificación significativamente. No es obligatorio pero mejora mucho la claridad.

Dry hopping: agregar lúpulos frescos en esta etapa (sin hervir) para potenciar el aroma. Se deja 3–5 días y luego se retiran.`,
      },
      {
        title: 'Embotellado y Carbonatación',
        content: `Antes de embotellar, agregas azúcar de priming (dextrosa, sacarosa, etc.) al lote completo o en cada botella.

La levadura residual fermenta ese azúcar dentro de la botella herméticamente cerrada, generando CO₂ que queda atrapado y carbonata la cerveza.

Proceso:
1. Disuelve el azúcar en agua hervida y deja enfriar
2. Mezcla suavemente con la cerveza (evita oxidar)
3. Embotella rápido para no perder carbonatación
4. Deja a temperatura ambiente 2 semanas
5. Opcinal: cold crash 24h antes de abrir para que el sedimento se asiente

⚠️ Nunca emboteltes antes de que la FG sea estable — el exceso de azúcar puede explotar las botellas.`,
      },
    ],
  },
  {
    id: 'siglas',
    emoji: '📊',
    title: 'Siglas y Términos',
    items: [
      {
        title: 'OG — Original Gravity (Densidad Original)',
        content: `La densidad del mosto antes de fermentar. Indica cuánto azúcar hay disuelto.

• Agua pura = 1.000
• Cerveza ligera = 1.030–1.040
• Cerveza estándar = 1.045–1.060
• Cerveza fuerte = 1.070–1.100+

Se mide con densímetro (hidrómetro) o refractómetro. Cuanto más alta, más alcohol potencial tiene la cerveza.`,
      },
      {
        title: 'FG — Final Gravity (Densidad Final)',
        content: `La densidad al terminar la fermentación. Indica cuánto azúcar quedó sin fermentar (extracto residual).

• Una FG típica está entre 1.008 y 1.020
• FG baja (1.005–1.010) → cerveza seca, más alcohol
• FG alta (1.018–1.025) → cerveza más dulce y con más cuerpo

Si la FG no baja lo suficiente: puede ser temperatura baja, levadura insuficiente, o mash a temperatura alta.`,
      },
      {
        title: 'ABV — Alcohol By Volume',
        content: `Porcentaje de alcohol en volumen. La fórmula simplificada:

ABV = (OG − FG) × 131.25

Ejemplos:
• OG 1.050, FG 1.010 → ~5.25% ABV
• OG 1.070, FG 1.014 → ~7.35% ABV

Las etiquetas dicen "5.0% vol" — eso es el ABV. La ley en muchos países exige declararlo.`,
      },
      {
        title: 'IBU — International Bitterness Units',
        content: `Mide el amargor percibido en la cerveza. Técnicamente mide los iso-alpha ácidos del lúpulo en partes por millón (ppm).

Escala de referencia:
• 0–10 IBU: sin amargor perceptible
• 10–25 IBU: amargor suave (lager, trigo)
• 25–45 IBU: amargor moderado (pale ale, amber)
• 45–70 IBU: amargo (IPA americana)
• 70–100+ IBU: muy amargo (double IPA, imperial)

Importante: el amargor percibido depende también del dulzor de la malta. Una stout con 40 IBU puede sentirse menos amarga que una pale ale con los mismos IBUs.`,
      },
      {
        title: 'SRM / EBC — Color de la cerveza',
        content: `SRM (Standard Reference Method) y EBC (European Brewery Convention) son escalas para medir el color.

SRM a EBC: EBC ≈ SRM × 1.97

Escala SRM:
• 1–3: pálido como agua (pilsner, wit)
• 4–8: dorado (blonde ale, kölsch)
• 9–14: ámbar (amber ale, märzen)
• 15–22: cobre/rojo (red ale, irish red)
• 23–30: café/castaño (brown ale, porter)
• 35+: negro (stout, schwarzbier)

El color viene principalmente del tipo y cantidad de malta.`,
      },
      {
        title: 'Atenuación',
        content: `Qué tan bien fermentó la levadura, expresado en porcentaje.

Atenuación aparente = (OG − FG) / (OG − 1.000) × 100

Valores típicos:
• <60%: fermentación incompleta (posible problema)
• 65–75%: normal para ales maltosas
• 75–85%: buena atenuación
• 85–95%: muy alta (cepas secas como Chico/US-05)

Cada cepa de levadura tiene un rango de atenuación esperado que el fabricante indica.`,
      },
      {
        title: 'Eficiencia del Mash',
        content: `Qué porcentaje del azúcar potencial de los granos lograste extraer durante el mash.

Eficiencia = (OG obtenida / OG teórica máxima) × 100

Valores típicos:
• 60–70%: sistema básico, nueva para el proceso
• 70–80%: buena eficiencia promedio
• 80–90%: sistema optimizado

Factores que la afectan: molienda del grano, temperatura del mash, relación agua/grano, tiempo de mash, y método de sparge.`,
      },
      {
        title: 'PPG — Points Per Pound Per Gallon',
        content: `Medida del potencial de extracción de azúcar de una malta. Indica cuántos "puntos de gravedad" aporta 1 libra de grano en 1 galón de agua, con 100% de eficiencia.

Ejemplos:
• Malta Pale 2-Row: 37 PPG
• Malta Pilsner: 37 PPG
• Malta Trigo: 38 PPG
• Crystal 60L: 34 PPG
• Malta Chocolate: 28 PPG

En la práctica se multiplica por la eficiencia real del mash (ej: 75%) para calcular el OG esperado.`,
      },
    ],
  },
  {
    id: 'temperaturas',
    emoji: '🌡️',
    title: 'Temperaturas Clave',
    items: [
      {
        title: 'Temperaturas del Mash',
        content: `El mash es muy sensible a la temperatura. Un grado de diferencia cambia el perfil de fermentabilidad.

• 62–64°C: alta fermentabilidad, cerveza seca y con más alcohol, poco cuerpo
• 65–67°C: balance ideal para la mayoría de estilos
• 68–70°C: más cuerpo y dulzor, menos alcohol
• >72°C: inactivación de enzimas (mash out) — se usa para parar la conversión

Temperatura del agua de entrada (strike water):
Regla simple: calentar el agua ~8–10°C por encima de la temperatura de mash objetivo.
Ejemplo: quieres mash a 67°C → calentar agua a ~75°C.`,
      },
      {
        title: 'Temperaturas de Fermentación',
        content: `La temperatura de fermentación afecta enormemente el sabor final.

Ales (levadura tipo ale):
• 18–20°C: fermentación más limpia, menos ésteres
• 20–22°C: más ésteres afrutados (típico para muchas ales)
• >24°C: riesgo de sabores indeseados (fusel alcohols, off-flavors)

Lagers (levadura tipo lager):
• 8–12°C: fermentación lenta y limpia
• Requiere equipo de refrigeración

Temperaturas altas durante fermentación = más ésteres y alcoholes de fusel. Puedes usar estas variaciones intencionalmente para ciertos estilos (hefeweizen: 20°C potencia plátano).`,
      },
      {
        title: 'Cold Crash y Servicio',
        content: `Cold crash (post-fermentación):
• 2–4°C durante 2–3 días
• La levadura, proteínas y partículas precipitan al fondo
• Resultado: cerveza mucho más clara
• No es obligatorio pero mejora la presentación

Temperatura de servicio:
• 2–4°C: lager, pilsner, cerveza de trigo
• 7–10°C: pale ale, IPA, amber
• 10–14°C: stout, porter, cerveza inglesa
• 14–16°C: barleywine, cerveza belga fuerte

Las cervezas más complejas se aprecian mejor a temperaturas más altas — el frío suprime los aromas.`,
      },
    ],
  },
  {
    id: 'carbonatacion',
    emoji: '🫧',
    title: 'Carbonatación',
    items: [
      {
        title: '¿Qué son los volúmenes de CO₂?',
        content: `La carbonatación se mide en "volúmenes de CO₂": cuántos litros de CO₂ hay disueltos por litro de cerveza.

• 1 vol = 1 L de CO₂ por cada L de cerveza
• Agua mineral con gas tiene ~3–4 vol

Referencias por estilo:
• 1.3–2.0 vol: cask ale, cerveza inglesa
• 2.2–2.7 vol: ales americanas
• 2.4–2.9 vol: lager, pilsner
• 3.3–4.5 vol: weizen, cerveza de trigo
• 3.0–4.0 vol: saison, belga

CO₂ residual: toda cerveza tiene CO₂ disuelto naturalmente de la fermentación. La cantidad depende de la temperatura — más frío = más CO₂ disuelto.`,
      },
      {
        title: 'Carbonatación natural (priming)',
        content: `La levadura residual en la cerveza fermenta el azúcar de priming y genera CO₂ que queda atrapado en la botella.

Tipos de azúcar más usados:
• Dextrosa (glucosa/azúcar de maíz): la más popular, fermenta completo, sabor neutro
• Sacarosa (azúcar de mesa): igual de efectiva, misma cantidad en gramos (~10% menos)
• DME (extracto seco de malta): necesitas ~20% más, aporta algo de sabor a malta
• Miel: fermenta diferente, puede dejar aromas propios

Método de solución:
Disuelve todo el azúcar en ~200 mL de agua hervida, deja enfriar, mezcla suavemente con la cerveza antes de embotellar. Así la distribución es uniforme.`,
      },
      {
        title: 'Carbonatación forzada (CO₂ externo)',
        content: `Se usa principalmente con barriles (kegs). Conectás un cilindro de CO₂ al keg y presionás la cerveza.

Método rápido (shaking): 30–40 PSI, agitar 2–3 min, dejar reposar 24h. Riesgo de sobre-carbonatar.

Método lento (set and forget): 10–12 PSI a 2–4°C durante 1–2 semanas. Más preciso y predecible.

Presión de servicio típica: 10–12 PSI para la mayoría de estilos.

Ventajas sobre priming: control exacto, sin sedimento en el fondo, listo más rápido. Requiere equipo (keg, regulador de CO₂, líneas).`,
      },
    ],
  },
  {
    id: 'tiempos',
    emoji: '⏱️',
    title: 'Tiempos y Planificación',
    items: [
      {
        title: 'Día de elaboración (brew day)',
        content: `Un brew day all-grain típico de 20L dura 5–6 horas:

• Molienda y preparación: 30 min
• Calentar agua de mash: 20–30 min
• Mash (maceración): 60 min
• Vorlauf (recircular): 10 min
• Sparge (lavado): 20–30 min
• Calentar a hervor: 20 min
• Hervido: 60–90 min
• Enfriado del mosto: 20–40 min (depende del método)
• Transferencia y pitching: 15 min

Extract brewing (sin mash): el proceso es más corto, ~2–3 horas.`,
      },
      {
        title: 'Tiempos de fermentación y maduración',
        content: `Guía general de tiempos post brew day:

Fermentación primaria:
• Ales simples: 1–2 semanas
• Ales fuertes (OG >1.070): 2–3 semanas
• Lagers: 3–4 semanas a temperatura baja

Maduración:
• Ales livianas: 1 semana es suficiente
• Ales más complejas: 2–4 semanas mejora notablemente
• Lagers: 4–8 semanas (lagering = guardar en frío)

Carbonatación en botella: 2 semanas mínimo a temperatura ambiente

Total mínimo para una ale estándar: 4–5 semanas desde brew day hasta primer sorbo.

Regla de oro: la paciencia siempre mejora la cerveza.`,
      },
      {
        title: '¿Cuándo está lista para embotellar?',
        content: `Checklist antes de embotellar:

✅ La FG es estable 2 días seguidos (misma lectura con densímetro)
✅ La FG está dentro del rango esperado del estilo
✅ El airlock no burbujea (o burbujea muy raramente)
✅ La cerveza huele bien (sin vinagre, azufre persistente u olores raros)
✅ Al probarla, no tiene sabores inusuales ni dulzor excesivo

⚠️ Nunca emboteltes si la FG aún está bajando — el CO₂ extra puede crear presión peligrosa y explotar las botellas.

El test definitivo: mide la densidad con 48 horas de diferencia. Si es exactamente la misma, ya terminó.`,
      },
    ],
  },
  {
    id: 'problemas',
    emoji: '🔧',
    title: 'Problemas Comunes',
    items: [
      {
        title: 'La fermentación no arranca',
        content: `Si pasaron más de 24–48h y no hay actividad:

1. Levadura muerta: la temperatura del mosto estaba muy alta (>35°C) al pitchear. Agregá levadura fresca.
2. Temperatura muy baja: si está a <15°C, la levadura está dormida. Subí la temperatura.
3. El airlock no está sellado: el CO₂ puede escapar por otro lado. Igual puede estar fermentando.
4. Levadura vieja: sobre todo en paquetes de levadura líquida vencida.

Solución: agregar levadura nueva, asegurar temperatura adecuada, verificar sellos.`,
      },
      {
        title: 'La cerveza quedó muy dulce / FG alta',
        content: `Si la FG está muy por encima de lo esperado:

• Temperatura baja: la levadura fue muy lenta o paró. Sube a 20–22°C y agita suavemente.
• Mash a temperatura alta (>70°C): creaste muchos azúcares no fermentables. No tiene solución retroactiva.
• Poco nutrientes para la levadura: poco frecuente en all-grain, más en extract.
• Levadura con baja atenuación: puede ser la cepa equivocada para el estilo.

Si la FG ya lleva 5+ días estable y está alta: puede ser intencional (estilo maltoso) o problema de atenuación.`,
      },
      {
        title: 'Sabores y aromas indeseados',
        content: `Guía rápida de off-flavors:

• Vinagre (acético): contaminación bacteriana. Revisar sanitización.
• Azufre: normal en algunas lagers y cepas, desaparece con tiempo y ventilación.
• Mantequilla (diacetilo): fermentación incompleta. Subir temperatura 2–3°C los últimos días (diacetyl rest).
• Plástico/medicina: cloro en el agua reaccionando con levadura. Usar agua sin cloro o agregar campden tablet.
• Astringente/áspero: temperatura de sparge muy alta o mash muy largo a alta temperatura.
• Cartón/papel (oxidación): exposición al oxígeno post-fermentación. Minimizar movimientos y salpicaduras.`,
      },
      {
        title: 'Sobre-carbonatación / botellas explosivas',
        content: `Causas:
• Embotellado antes de que terminara la fermentación (la más común y peligrosa)
• Demasiado azúcar de priming
• Infección en la botella (levaduras o bacterias salvajes)

Prevención:
✅ Siempre verificar FG estable antes de embotellar
✅ Usar calculadora de priming (como esta app)
✅ Sanitizar todo correctamente

Si sospechas sobre-carbonatación: abrí una botella de prueba en la pileta. Si explota con espuma, refrigerá todas inmediatamente (el frío reduce la presión) y consúmelas pronto.

⚠️ Nunca guardes botellas que podrían explotar en lugares calurosos.`,
      },
    ],
  },
]

function AccordionItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`wiki-item ${open ? 'open' : ''}`}>
      <button className="wiki-item-header" onClick={() => setOpen(v => !v)}>
        <span className="wiki-item-title">{item.title}</span>
        <span className="wiki-item-arrow">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="wiki-item-body">
          {item.content.split('\n').map((line, i) =>
            line === '' ? <br key={i} /> : <p key={i}>{line}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default function WikiPage({ onClose }) {
  const [activeSection, setActiveSection] = useState(null)

  return (
    <div className="wiki-overlay">
      <div className="wiki-page">
        <div className="wiki-header">
          <button className="wiki-back" onClick={onClose} aria-label="Volver">
            ← Volver
          </button>
          <span className="wiki-header-title">📚 Aprende Brewing</span>
        </div>

        <div className="wiki-intro card">
          <p>Todo lo que necesitas saber para hacer cerveza en casa. Toca cualquier tema para expandirlo.</p>
        </div>

        <div className="wiki-sections">
          {SECTIONS.map(section => (
            <div key={section.id} className="wiki-section">
              <button
                className={`wiki-section-header ${activeSection === section.id ? 'open' : ''}`}
                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
              >
                <span className="wiki-section-emoji">{section.emoji}</span>
                <span className="wiki-section-title">{section.title}</span>
                <span className="wiki-section-count">{section.items.length}</span>
                <span className="wiki-section-arrow">
                  {activeSection === section.id ? '▲' : '▼'}
                </span>
              </button>

              {activeSection === section.id && (
                <div className="wiki-items">
                  {section.items.map((item, i) => (
                    <AccordionItem key={i} item={item} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ height: '32px' }} />
      </div>
    </div>
  )
}
