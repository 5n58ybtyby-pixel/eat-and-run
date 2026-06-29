import { useState, useRef } from 'react'

const LIME = '#B6F23E'

const MOCK_FOODS = [
  { name: 'Hähnchenbrustfilet mit Reis & Brokkoli', kcal: 450, kh: 52, pro: 38, fett: 8, emoji: '🍗' },
  { name: 'Pasta mit Tomatensoße & Basilikum', kcal: 380, kh: 71, pro: 12, fett: 5, emoji: '🍝' },
  { name: 'Griechischer Joghurt mit Beeren', kcal: 195, kh: 28, pro: 14, fett: 3, emoji: '🫐' },
  { name: 'Haferflocken mit Milch & Banane', kcal: 320, kh: 58, pro: 12, fett: 6, emoji: '🥣' },
  { name: 'Lachsfilet mit Quinoa & Spinat', kcal: 490, kh: 38, pro: 42, fett: 18, emoji: '🐟' },
  { name: 'Avocado-Toast mit Ei', kcal: 340, kh: 28, pro: 16, fett: 19, emoji: '🥑' },
]

const INITIAL_MEALS = {
  breakfast: [
    { name: 'Haferflocken mit Milch', kcal: 320, kh: 58, pro: 12, fett: 6, emoji: '🥣' },
    { name: 'Protein-Shake', kcal: 180, kh: 8, pro: 28, fett: 3, emoji: '💪' },
  ],
  lunch: [
    { name: 'Hähnchenbrustfilet mit Reis', kcal: 450, kh: 52, pro: 38, fett: 8, emoji: '🍗' },
  ],
  dinner: [],
  snacks: [
    { name: 'Apfel', kcal: 80, kh: 21, pro: 0, fett: 0, emoji: '🍎' },
    { name: 'Mandeln (30g)', kcal: 175, kh: 4, pro: 6, fett: 15, emoji: '🌰' },
  ],
}

const MEAL_LABELS = { breakfast: 'Frühstück', lunch: 'Mittagessen', dinner: 'Abendessen', snacks: 'Snacks' }

function CalorieRing({ consumed, goal }) {
  const pct = Math.min(consumed / goal, 1)
  const R = 58
  const C = 2 * Math.PI * R
  const offset = C * (1 - pct)

  return (
    <svg viewBox="0 0 160 160" width="160" height="160">
      <circle cx="80" cy="80" r={R} fill="none" stroke="#1A1A1A" strokeWidth="10"/>
      <circle
        cx="80" cy="80" r={R}
        fill="none" stroke={LIME} strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={C}
        strokeDashoffset={offset}
        transform="rotate(-90 80 80)"
      />
      <text x="80" y="70" textAnchor="middle" fill="#fff" fontSize="26" fontWeight="700" fontFamily="Space Grotesk">
        {consumed.toLocaleString('de')}
      </text>
      <text x="80" y="88" textAnchor="middle" fill="#5A5A5A" fontSize="12" fontFamily="Hanken Grotesk">
        kcal gegessen
      </text>
      <text x="80" y="106" textAnchor="middle" fill={LIME} fontSize="12" fontFamily="Hanken Grotesk" fontWeight="600">
        {(goal - consumed).toLocaleString('de')} kcal übrig
      </text>
    </svg>
  )
}

export default function Nutrition() {
  const [meals, setMeals] = useState(INITIAL_MEALS)
  const [scanState, setScanState] = useState('idle') // idle | scanning | result
  const [scanResult, setScanResult] = useState(null)
  const [addTarget, setAddTarget] = useState(null)
  const [expandedMeal, setExpandedMeal] = useState(null)
  const fileRef = useRef()

  const allFoods = Object.values(meals).flat()
  const totalKcal = allFoods.reduce((s, f) => s + f.kcal, 0)
  const totalKh = allFoods.reduce((s, f) => s + f.kh, 0)
  const totalPro = allFoods.reduce((s, f) => s + f.pro, 0)
  const totalFett = allFoods.reduce((s, f) => s + f.fett, 0)

  const GOAL_KCAL = 2200
  const GOAL_KH = 270
  const GOAL_PRO = 140
  const GOAL_FETT = 73

  const handleCameraClick = (mealKey) => {
    setAddTarget(mealKey)
    fileRef.current?.click()
  }

  const handleFileChange = (e) => {
    if (!e.target.files?.length) return
    e.target.value = ''
    setScanState('scanning')
    setTimeout(() => {
      const result = MOCK_FOODS[Math.floor(Math.random() * MOCK_FOODS.length)]
      setScanResult(result)
      setScanState('result')
    }, 2200)
  }

  const handleAddFood = () => {
    if (!scanResult || !addTarget) return
    setMeals(prev => ({
      ...prev,
      [addTarget]: [...prev[addTarget], scanResult]
    }))
    setScanState('idle')
    setScanResult(null)
    setAddTarget(null)
  }

  const handleDismissScan = () => {
    setScanState('idle')
    setScanResult(null)
    setAddTarget(null)
  }

  const mealTotalKcal = (key) => meals[key].reduce((s, f) => s + f.kcal, 0)

  return (
    <div style={{ padding: '0 0 8px' }}>
      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '56px 20px 20px'
      }}>
        <div>
          <div style={{ font: "700 11px 'Space Mono'", letterSpacing: '2px', color: '#5A5A5A', marginBottom: '8px' }}>
            ERNÄHRUNG
          </div>
          <div style={{ font: "700 28px 'Space Grotesk'", letterSpacing: '-0.6px' }}>Heute</div>
        </div>
        <div style={{ font: "400 13px 'Hanken Grotesk'", color: '#5A5A5A', textAlign: 'right' }}>
          <div>Sonntag</div>
          <div style={{ color: '#3A3A3A' }}>29. Jun 2026</div>
        </div>
      </div>

      {/* Calorie Ring */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          background: '#0D0D0D', border: '1px solid #1E1E1E',
          borderRadius: '22px', padding: '24px 20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <CalorieRing consumed={totalKcal} goal={GOAL_KCAL} />
            <div style={{ flex: 1 }}>
              <div style={{ font: "700 11px 'Space Mono'", letterSpacing: '1.5px', color: '#5A5A5A', marginBottom: '14px' }}>
                MAKROS
              </div>
              {[
                { label: 'KH', val: totalKh, goal: GOAL_KH, color: LIME },
                { label: 'PRO', val: totalPro, goal: GOAL_PRO, color: '#9B8CFA' },
                { label: 'FETT', val: totalFett, goal: GOAL_FETT, color: '#F2944A' },
              ].map(m => (
                <div key={m.label} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ font: "700 11px 'Space Mono'", color: m.color }}>{m.label}</span>
                    <span style={{ font: "400 11px 'Hanken Grotesk'", color: '#5A5A5A' }}>
                      {m.val}g / {m.goal}g
                    </span>
                  </div>
                  <div style={{ height: 5, background: '#1E1E1E', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min((m.val / m.goal) * 100, 100)}%`,
                      background: m.color, borderRadius: '999px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scan overlay */}
      {scanState !== 'idle' && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.92)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          zIndex: 200, padding: '20px',
          animation: 'fadeIn 0.2s ease'
        }}>
          {scanState === 'scanning' && (
            <div style={{ textAlign: 'center' }}>
              {/* Camera viewfinder */}
              <div style={{
                width: 240, height: 240,
                border: `2px solid ${LIME}`,
                borderRadius: '24px',
                position: 'relative',
                margin: '0 auto 24px',
                overflow: 'hidden',
                background: '#0A0A0A'
              }}>
                {/* Corner decorations */}
                {[['0','0','right','bottom'],['auto','0','left','bottom'],['0','auto','right','top'],['auto','auto','left','top']].map(([t,b,r,l], i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    top: t, bottom: b === 'auto' ? undefined : b === '0' ? 0 : undefined,
                    right: r === 'auto' ? undefined : 0, left: l === 'auto' ? undefined : 0,
                    width: 24, height: 24,
                    borderTop: (t === '0') ? `3px solid ${LIME}` : 'none',
                    borderBottom: (b === '0') ? `3px solid ${LIME}` : 'none',
                    borderLeft: (l !== 'auto') ? `3px solid ${LIME}` : 'none',
                    borderRight: (r !== 'auto') ? `3px solid ${LIME}` : 'none',
                  }} />
                ))}
                {/* Scan line */}
                <div style={{
                  position: 'absolute', left: 0, right: 0,
                  height: 2, background: LIME,
                  boxShadow: `0 0 10px ${LIME}`,
                  top: 0,
                  animation: 'scan-line 1.5s linear infinite'
                }} />
              </div>
              <div style={{
                width: 48, height: 48,
                border: `3px solid rgba(182,242,62,.2)`,
                borderTop: `3px solid ${LIME}`,
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 16px'
              }} />
              <div style={{ font: "600 17px 'Space Grotesk'", letterSpacing: '-0.3px', marginBottom: '6px' }}>
                Analysiere Mahlzeit…
              </div>
              <div style={{ font: "400 13px 'Hanken Grotesk'", color: '#6A6A6A' }}>
                KI erkennt Zutaten und berechnet Nährwerte
              </div>
            </div>
          )}

          {scanState === 'result' && scanResult && (
            <div style={{
              width: '100%', maxWidth: 360,
              animation: 'fadeInUp 0.4s ease'
            }}>
              <div style={{ font: "700 11px 'Space Mono'", letterSpacing: '2px', color: LIME, textAlign: 'center', marginBottom: '16px' }}>
                <svg viewBox="0 0 12 12" width="10" height="10" fill={LIME} style={{marginRight:6,flexShrink:0}}><path d="M7 1L2 7h3.5L4 11l6-6.5H6.5z"/></svg> KI-ERKENNUNG ABGESCHLOSSEN
              </div>
              <div style={{
                background: '#111', border: `1px solid rgba(182,242,62,.25)`,
                borderRadius: '24px', padding: '24px',
                boxShadow: '0 0 40px rgba(182,242,62,.1)'
              }}>
                <div style={{ display:'flex', justifyContent:'center', marginBottom:'12px' }}>
                  <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(182,242,62,0.1)', border:'2px solid rgba(182,242,62,0.25)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#B6F23E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                </div>
                <div style={{ font: "600 18px 'Space Grotesk'", textAlign: 'center', letterSpacing: '-0.3px', marginBottom: '4px' }}>
                  {scanResult.name}
                </div>
                <div style={{ font: "400 13px 'Hanken Grotesk'", color: '#6A6A6A', textAlign: 'center', marginBottom: '20px' }}>
                  Erkannt mit ~95 % Genauigkeit
                </div>

                {/* Calories big */}
                <div style={{
                  background: 'rgba(182,242,62,.08)', border: '1px solid rgba(182,242,62,.15)',
                  borderRadius: '16px', padding: '16px', textAlign: 'center', marginBottom: '16px'
                }}>
                  <div style={{ font: "700 36px 'Space Grotesk'", color: LIME, letterSpacing: '-1px' }}>
                    {scanResult.kcal}
                  </div>
                  <div style={{ font: "400 12px 'Hanken Grotesk'", color: '#7A7A7A' }}>Kalorien (kcal)</div>
                </div>

                {/* Macros */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  {[
                    { label: 'Kohlenhydrate', val: scanResult.kh, unit: 'g', color: LIME },
                    { label: 'Protein', val: scanResult.pro, unit: 'g', color: '#9B8CFA' },
                    { label: 'Fett', val: scanResult.fett, unit: 'g', color: '#F2944A' },
                  ].map(m => (
                    <div key={m.label} style={{
                      flex: 1, background: '#0D0D0D', border: '1px solid #222',
                      borderRadius: '12px', padding: '10px 8px', textAlign: 'center'
                    }}>
                      <div style={{ font: "700 18px 'Space Grotesk'", color: m.color }}>{m.val}{m.unit}</div>
                      <div style={{ font: "400 10px 'Hanken Grotesk'", color: '#5A5A5A', marginTop: '2px' }}>
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ font: "400 12px 'Hanken Grotesk'", color: '#5A5A5A', textAlign: 'center', marginBottom: '16px' }}>
                  Hinzufügen zu: <span style={{ color: '#B0B0B0' }}>{MEAL_LABELS[addTarget] || 'Mahlzeit'}</span>
                </div>

                <button
                  onClick={handleAddFood}
                  style={{
                    width: '100%', background: LIME, color: '#07090A',
                    border: 'none', borderRadius: '14px', padding: '16px',
                    font: "700 15px 'Hanken Grotesk'", cursor: 'pointer', marginBottom: '10px'
                  }}
                >
                  Hinzufügen
                </button>
                <button
                  onClick={handleDismissScan}
                  style={{
                    width: '100%', background: 'transparent', color: '#5A5A5A',
                    border: '1px solid #222', borderRadius: '14px', padding: '14px',
                    font: "500 14px 'Hanken Grotesk'", cursor: 'pointer'
                  }}
                >
                  Abbrechen
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Meals */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ font: "700 11px 'Space Mono'", letterSpacing: '2px', color: '#5A5A5A', marginBottom: '14px' }}>
          MAHLZEITEN
        </div>

        {Object.entries(MEAL_LABELS).map(([key, label]) => {
          const items = meals[key]
          const kcal = mealTotalKcal(key)
          const isExpanded = expandedMeal === key

          return (
            <div key={key} style={{
              background: '#0D0D0D', border: '1px solid #1E1E1E',
              borderRadius: '18px', marginBottom: '10px', overflow: 'hidden'
            }}>
              {/* Meal header */}
              <div
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', cursor: 'pointer'
                }}
                onClick={() => setExpandedMeal(isExpanded ? null : key)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ font: "600 15px 'Hanken Grotesk'" }}>{label}</div>
                  {items.length > 0 && (
                    <span style={{
                      background: 'rgba(182,242,62,.1)', color: LIME,
                      font: "600 11px 'Space Grotesk'",
                      padding: '2px 8px', borderRadius: '999px'
                    }}>
                      {items.length}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ font: "600 14px 'Space Grotesk'", color: kcal > 0 ? '#fff' : '#3A3A3A' }}>
                    {kcal > 0 ? `${kcal} kcal` : '—'}
                  </span>
                  <svg
                    viewBox="0 0 24 24" width="16" height="16" fill="none"
                    stroke="#3A3A3A" strokeWidth="2" strokeLinecap="round"
                    style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                  >
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
              </div>

              {/* Items */}
              {isExpanded && (
                <div style={{ borderTop: '1px solid #171717' }}>
                  {items.map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '10px 16px',
                      borderBottom: i < items.length - 1 ? '1px solid #141414' : 'none'
                    }}>
                      <div style={{ width:22, height:22, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="#4A4A4A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="9" r="5"/><path d="M5.5 4.5L6 3M8 4V2.5M10.5 4.5L10 3"/></svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ font: "500 13px 'Hanken Grotesk'" }}>{item.name}</div>
                        <div style={{ font: "400 11px 'Hanken Grotesk'", color: '#5A5A5A', marginTop: '2px' }}>
                          KH {item.kh}g · PRO {item.pro}g · Fett {item.fett}g
                        </div>
                      </div>
                      <div style={{ font: "600 13px 'Space Grotesk'", color: '#A0A0A0' }}>
                        {item.kcal} kcal
                      </div>
                    </div>
                  ))}

                  {/* Add buttons */}
                  <div style={{ padding: '10px 16px 14px', display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleCameraClick(key)}
                      style={{
                        flex: 1, background: LIME, color: '#07090A',
                        border: 'none', borderRadius: '10px', padding: '10px',
                        font: "600 13px 'Hanken Grotesk'", cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                      KI-Scan
                    </button>
                    <button
                      style={{
                        flex: 1, background: 'transparent', color: '#7A7A7A',
                        border: '1px solid #222', borderRadius: '10px', padding: '10px',
                        font: "600 13px 'Hanken Grotesk'", cursor: 'pointer'
                      }}
                    >
                      + Manuell
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Camera FAB */}
      <div style={{ padding: '0 20px 8px' }}>
        <button
          onClick={() => handleCameraClick('snacks')}
          style={{
            width: '100%',
            background: LIME, color: '#07090A',
            border: 'none', borderRadius: '16px', padding: '18px',
            font: "700 16px 'Hanken Grotesk'", cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            boxShadow: '0 0 28px rgba(182,242,62,0.3)',
            animation: 'pulse-glow 3s ease-in-out infinite'
          }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          Mahlzeit fotografieren · KI
        </button>
        <div style={{ font: "400 11.5px 'Hanken Grotesk'", color: '#4A4A4A', textAlign: 'center', marginTop: '8px' }}>
          KI erkennt Lebensmittel & berechnet Kalorien und Makros
        </div>
      </div>
    </div>
  )
}
