import { useState } from 'react'
import { store } from '../store'

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

const INSPO_SECTIONS = [
  {
    id: 'breakfast', label: 'Frühstück', dishes: [
      { id: 1, title: 'Avocado Toast mit Ei', kcal: 380, protein: 18, carbs: 32, fat: 22, time: '8 min', photo: '/avocado-toast.webp', tag: 'Gesunde Fette' },
      { id: 2, title: 'Overnight Oats', kcal: 410, protein: 14, carbs: 62, fat: 9, time: '10 min', photo: '/overnight-oats.png', tag: 'Carb-Loading' },
      { id: 23, title: 'Magerquark Bowl', kcal: 312, protein: 38, carbs: 28, fat: 4, time: '5 min', photo: '/magerquark-bowl.png', tag: 'Protein-reich' },
    ]
  },
  {
    id: 'mealprep', label: 'Meal Prep', dishes: [
      { id: 6, title: 'Hähnchen & Süßkartoffel', kcal: 520, protein: 42, carbs: 48, fat: 12, time: '25 min', photo: '/haehnchen-suesskartoffel.webp', tag: 'Meal Prep' },
      { id: 7, title: 'Lachs & Quinoa Bowl', kcal: 490, protein: 36, carbs: 42, fat: 18, time: '20 min', photo: '/lachs-quinoa.webp', tag: 'Omega-3' },
      { id: 9, title: 'Linsen Curry & Reis', kcal: 440, protein: 18, carbs: 72, fat: 8, time: '30 min', photo: '/linsen-curry.webp', tag: 'Vegan' },
      { id: 10, title: 'Meatballs & Pasta', kcal: 390, protein: 34, carbs: 30, fat: 14, time: '35 min', photo: '/meatballs-pasta.webp', tag: 'Meal Prep' },
    ]
  },
  {
    id: 'smoothies', label: 'Smoothies', dishes: [
      { id: 11, title: 'Grüner Power Smoothie', kcal: 180, protein: 8, carbs: 28, fat: 3, time: '3 min', photo: '/green-smoothie.webp', tag: 'Antioxidantien' },
      { id: 13, title: 'Berry Recovery Shake', kcal: 210, protein: 16, carbs: 30, fat: 3, time: '3 min', photo: '/berry-shake.webp', tag: 'Regeneration' },
      { id: 14, title: 'Mango Kurkuma Shake', kcal: 195, protein: 8, carbs: 34, fat: 2, time: '3 min', photo: '/mango-shake.jpg', tag: 'Entzündungshemmend' },
    ]
  },
]

function InspoCard({ d, saved, onSave }) {
  return (
    <div style={{ width: 158, flexShrink: 0, background: '#0D0D0D', border: '1px solid #1E1E1E', borderRadius: 16, overflow: 'hidden' }}>
      {d.photo ? (
        <img src={d.photo} alt={d.title} style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }}/>
      ) : (
        <div style={{ height: 110, background: d.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>{d.emoji}</div>
      )}
      <div style={{ padding: '10px 10px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4, marginBottom: 6 }}>
          <div style={{ font: "600 12.5px 'Space Grotesk'", lineHeight: 1.3, letterSpacing: '-0.1px' }}>{d.title}</div>
          <button onClick={() => onSave(d.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: saved ? LIME : '#3A3A3A', fontSize: 15, lineHeight: 1, flexShrink: 0 }}>
            {saved ? '♥' : '♡'}
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ font: "700 12px 'Space Grotesk'", color: LIME }}>{d.kcal}</span>
          <span style={{ font: "400 10px 'Hanken Grotesk'", color: '#4A4A4A' }}>kcal · {d.time}</span>
        </div>
        <div style={{ background: 'rgba(182,242,62,.06)', border: '1px solid rgba(182,242,62,.12)', borderRadius: 99, padding: '3px 8px', display: 'inline-block', font: "600 9px 'Hanken Grotesk'", color: LIME }}>{d.tag}</div>
      </div>
    </div>
  )
}

function InspirationFeed() {
  const [saved, setSaved] = useState({})
  const toggle = id => setSaved(s => ({ ...s, [id]: !s[id] }))
  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ font: "400 13px 'Hanken Grotesk'", color: '#5A5A5A', padding: '0 20px 16px' }}>
        KI-kuratierte Gerichte passend zu deinem Trainingsplan
      </div>
      {INSPO_SECTIONS.map(sec => (
        <div key={sec.id} style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: 12 }}>
            <div style={{ font: "700 16px 'Space Grotesk'", letterSpacing: '-0.2px' }}>{sec.label}</div>
            <div style={{ font: "400 12px 'Hanken Grotesk'", color: '#5A5A5A' }}>{sec.dishes.length} Gerichte</div>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingLeft: 20, paddingRight: 20, paddingBottom: 4 }}>
            {sec.dishes.map(d => (
              <InspoCard key={d.id} d={d} saved={!!saved[d.id]} onSave={toggle}/>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const WEIGHT_DATA = [
  { date: '01.05', weight: 84.2 },
  { date: '08.05', weight: 83.8 },
  { date: '15.05', weight: 83.1 },
  { date: '22.05', weight: 82.7 },
  { date: '01.06', weight: 82.3 },
  { date: '08.06', weight: 81.8 },
  { date: '15.06', weight: 81.5 },
  { date: '22.06', weight: 81.0 },
  { date: 'Heute', weight: 80.6 },
]

const GOAL_WEIGHT = 78.0

// ─── CALORIE RING ─────────────────────────────────────────────────────────────

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

// ─── WEIGHT CHART ─────────────────────────────────────────────────────────────

function WeightChart({ data, goalWeight }) {
  const PAD_L = 8, PAD_R = 8, PAD_T = 20, PAD_B = 28
  const W = 300, H = 140
  const plotW = W - PAD_L - PAD_R
  const plotH = H - PAD_T - PAD_B

  const minW = Math.min(...data.map(d => d.weight), goalWeight) - 0.8
  const maxW = Math.max(...data.map(d => d.weight)) + 0.5
  const toX = i => PAD_L + (i / (data.length - 1)) * plotW
  const toY = v => PAD_T + plotH - ((v - minW) / (maxW - minW)) * plotH

  const pathD = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)} ${toY(d.weight).toFixed(1)}`).join(' ')
  const areaD = `${pathD} L ${toX(data.length - 1).toFixed(1)} ${(PAD_T + plotH).toFixed(1)} L ${toX(0).toFixed(1)} ${(PAD_T + plotH).toFixed(1)} Z`
  const goalY = toY(goalWeight)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
      <defs>
        <linearGradient id="wgrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={LIME} stopOpacity="0.28"/>
          <stop offset="100%" stopColor={LIME} stopOpacity="0"/>
        </linearGradient>
      </defs>

      {/* Ziel-Linie */}
      <line x1={PAD_L} y1={goalY} x2={W - PAD_R} y2={goalY}
        stroke="rgba(182,242,62,0.22)" strokeWidth="1" strokeDasharray="5,4"/>
      <text x={W - PAD_R - 2} y={goalY - 5} textAnchor="end"
        fill="rgba(182,242,62,0.45)" fontSize="9.5" fontFamily="Hanken Grotesk">
        Ziel {goalWeight} kg
      </text>

      {/* Fläche unter Linie */}
      <path d={areaD} fill="url(#wgrad)"/>

      {/* Glow-Effekt (dicker, transparenter Strich) */}
      <path d={pathD} fill="none" stroke={LIME} strokeWidth="10" strokeOpacity="0.1"
        strokeLinecap="round" strokeLinejoin="round"/>
      <path d={pathD} fill="none" stroke={LIME} strokeWidth="4" strokeOpacity="0.2"
        strokeLinecap="round" strokeLinejoin="round"/>

      {/* Hauptlinie */}
      <path d={pathD} fill="none" stroke={LIME} strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"/>

      {/* Datenpunkte */}
      {data.map((d, i) => {
        const x = toX(i), y = toY(d.weight)
        const isLast = i === data.length - 1
        const showDate = i === 0 || i === 4 || isLast
        return (
          <g key={i}>
            {isLast && <circle cx={x} cy={y} r="9" fill={LIME} fillOpacity="0.15"/>}
            <circle cx={x} cy={y} r={isLast ? 5 : 3}
              fill={isLast ? LIME : '#0A0A0A'} stroke={LIME} strokeWidth="1.8"/>
            {isLast && (
              <text x={x} y={y - 10} textAnchor="middle"
                fill={LIME} fontSize="10" fontFamily="Space Grotesk" fontWeight="700">
                {d.weight}
              </text>
            )}
            {showDate && (
              <text x={x} y={H - 4}
                textAnchor={i === 0 ? 'start' : isLast ? 'end' : 'middle'}
                fill={isLast ? LIME : '#4A4A4A'} fontSize="9.5" fontFamily="Hanken Grotesk">
                {d.date}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

// ─── GEWICHT VIEW ─────────────────────────────────────────────────────────────

function GewichtView() {
  const [entries, setEntries] = useState(WEIGHT_DATA)
  const [inputVal, setInputVal] = useState('')
  const [showInput, setShowInput] = useState(false)

  const latest = entries[entries.length - 1]
  const first = entries[0]
  const change = (latest.weight - first.weight).toFixed(1)
  const toGoal = (latest.weight - GOAL_WEIGHT).toFixed(1)
  const isLoss = parseFloat(change) < 0

  const handleAdd = () => {
    const w = parseFloat(inputVal.replace(',', '.'))
    if (!isNaN(w) && w > 30 && w < 300) {
      setEntries(prev => [...prev, { date: 'Heute', weight: Math.round(w * 10) / 10 }])
      setInputVal('')
      setShowInput(false)
    }
  }

  const reversed = [...entries].reverse()

  return (
    <>
      {/* Aktuelles Gewicht */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{
          background: '#0D0D0D', border: '1px solid #1E1E1E',
          borderRadius: 22, padding: 20,
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: -40, right: -40,
            width: 160, height: 160,
            background: 'radial-gradient(circle, rgba(182,242,62,.07), transparent 70%)',
            pointerEvents: 'none'
          }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: showInput ? 16 : 0 }}>
            <div>
              <div style={{ font: "700 11px 'Space Mono'", letterSpacing: '1.5px', color: '#5A5A5A', marginBottom: 8 }}>
                AKTUELLES GEWICHT
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ font: "700 52px 'Space Grotesk'", color: LIME, letterSpacing: '-2px', lineHeight: 1 }}>
                  {latest.weight}
                </span>
                <span style={{ font: "400 20px 'Hanken Grotesk'", color: '#5A5A5A' }}>kg</span>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6, marginTop: 8,
                font: "500 13px 'Hanken Grotesk'",
                color: isLoss ? LIME : '#F2555A'
              }}>
                <svg viewBox="0 0 10 10" width="10" height="10" fill="currentColor">
                  {isLoss
                    ? <polygon points="5,8 1,2 9,2"/>
                    : <polygon points="5,2 9,8 1,8"/>}
                </svg>
                {Math.abs(change)} kg seit {first.date}
              </div>
            </div>
            <button
              onClick={() => setShowInput(!showInput)}
              style={{
                background: showInput ? '#1A1A1A' : LIME,
                color: showInput ? '#5A5A5A' : '#000',
                border: showInput ? '1px solid #2A2A2A' : 'none',
                borderRadius: 12, padding: '10px 16px',
                font: "600 13px 'Hanken Grotesk'", cursor: 'pointer',
                transition: 'all .15s'
              }}
            >
              {showInput ? 'Abbrechen' : '+ Eintragen'}
            </button>
          </div>

          {showInput && (
            <div style={{ display: 'flex', gap: 8, animation: 'fadeInUp .2s ease' }}>
              <input
                type="number" step="0.1" min="30" max="300"
                placeholder="z.B. 80.3"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                autoFocus
                style={{
                  flex: 1, background: '#151515', border: '1px solid #2A2A2A',
                  borderRadius: 10, padding: '13px 14px',
                  font: "400 17px 'Space Grotesk'", color: '#fff',
                  outline: 'none', WebkitAppearance: 'none'
                }}
              />
              <button
                onClick={handleAdd}
                style={{
                  background: LIME, color: '#000', border: 'none', borderRadius: 10,
                  padding: '13px 20px', font: "700 14px 'Hanken Grotesk'", cursor: 'pointer'
                }}
              >
                OK
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Verlaufs-Chart */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{
          background: '#0D0D0D', border: '1px solid #1E1E1E',
          borderRadius: 22, padding: '20px 16px 14px'
        }}>
          <div style={{ font: "700 11px 'Space Mono'", letterSpacing: '1.5px', color: '#5A5A5A', marginBottom: 16 }}>
            GEWICHTSVERLAUF
          </div>
          <WeightChart data={entries} goalWeight={GOAL_WEIGHT} />
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{
          background: '#0D0D0D', border: '1px solid #1E1E1E',
          borderRadius: 18, padding: 16,
          display: 'flex', justifyContent: 'space-around'
        }}>
          {[
            { label: 'Startgewicht', val: `${first.weight} kg` },
            { label: 'Zielgewicht', val: `${GOAL_WEIGHT} kg` },
            { label: 'Noch', val: `${toGoal} kg` },
          ].map(({ label, val }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ font: "700 18px 'Space Grotesk'", color: LIME, letterSpacing: '-0.3px' }}>{val}</div>
              <div style={{ font: "400 11px 'Hanken Grotesk'", color: '#5A5A5A', marginTop: 3 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Letzte Einträge */}
      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ font: "700 11px 'Space Mono'", letterSpacing: '1.5px', color: '#5A5A5A', marginBottom: 12 }}>
          LETZTE EINTRÄGE
        </div>
        <div style={{ background: '#0D0D0D', border: '1px solid #1E1E1E', borderRadius: 18, overflow: 'hidden' }}>
          {reversed.slice(0, 5).map((e, i) => {
            const prev = reversed[i + 1]
            const diff = prev ? (e.weight - prev.weight).toFixed(1) : null
            const isDown = diff !== null && parseFloat(diff) < 0
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '13px 16px',
                borderBottom: i < 4 ? '1px solid #171717' : 'none',
                background: i === 0 ? 'rgba(182,242,62,0.04)' : 'transparent'
              }}>
                <span style={{ font: "400 13px 'Hanken Grotesk'", color: i === 0 ? '#C0C0C0' : '#6A6A6A' }}>
                  {e.date}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {diff !== null && (
                    <span style={{
                      font: "500 11px 'Hanken Grotesk'",
                      color: isDown ? LIME : '#F2555A',
                      display: 'flex', alignItems: 'center', gap: 3
                    }}>
                      <svg viewBox="0 0 10 10" width="8" height="8" fill="currentColor">
                        {isDown ? <polygon points="5,8 1,2 9,2"/> : <polygon points="5,2 9,8 1,8"/>}
                      </svg>
                      {Math.abs(diff)} kg
                    </span>
                  )}
                  <span style={{ font: "600 14px 'Space Grotesk'", color: i === 0 ? LIME : '#7A7A7A' }}>
                    {e.weight} kg
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

// ─── MAIN NUTRITION SCREEN ────────────────────────────────────────────────────

export default function Nutrition({ navigate }) {
  const [view, setView] = useState('nutrition')
  const [meals, setMeals] = useState(INITIAL_MEALS)
  const [scanState, setScanState] = useState('idle')
  const [scanResult, setScanResult] = useState(null)
  const [addTarget, setAddTarget] = useState(null)
  const [expandedMeal, setExpandedMeal] = useState(null)
  const [flashActive, setFlashActive] = useState(false)

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
    setAddTarget(mealKey || 'breakfast')
    setScanState('camera')
  }

  const handleShutter = () => {
    setFlashActive(true)
    setTimeout(() => setFlashActive(false), 220)
    setTimeout(() => {
      setScanState('scanning')
      setTimeout(() => {
        setScanResult({ name: 'Magerquark Bowl', kcal: 312, kh: 28, pro: 38, fett: 4, emoji: '🥛' })
        setScanState('result')
      }, 2200)
    }, 280)
  }

  const handleAddFood = () => {
    if (!scanResult || !addTarget) return
    setMeals(prev => ({ ...prev, [addTarget]: [...prev[addTarget], scanResult] }))
    setScanState('idle')
    setScanResult(null)
    setAddTarget(null)
  }

  const handleDismissScan = () => {
    setScanState('idle')
    setScanResult(null)
    setAddTarget(null)
  }

  const handleShareToCommunity = () => {
    if (!scanResult) return
    store.recipePost = {
      id: 999, user: 'Nico', avatar: 'NI', time: 'gerade eben',
      title: 'Magerquark Bowl', emoji: '🥛', tag: 'Frühstück · Post-Workout',
      desc: 'Mein Frühstück nach dem Morgenrun. Einfach, proteinreich, perfekt für die Regeneration.',
      ingredients: ['250 g Magerquark (0,2 %)', '1 Banane', '30 g Haferflocken', '100 g TK-Beeren', '1 TL Honig'],
      nutrients: { kcal: 312, protein: 38, carbs: 28, fat: 4 },
      aiLabel: 'KI-Analyse', photo: 'magerquark',
      kudos: 0, myKudos: false, isNew: true
    }
    setScanState('idle')
    setScanResult(null)
    setAddTarget(null)
    navigate('community')
  }

  const mealTotalKcal = (key) => meals[key].reduce((s, f) => s + f.kcal, 0)

  return (
    <div style={{ padding: '0 0 8px' }}>

      {/* Camera overlay */}
      {scanState === 'camera' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          display: 'flex', flexDirection: 'column', background: '#000',
          animation: 'fadeIn 0.15s ease'
        }}>
          {/* Flash effect */}
          {flashActive && (
            <div style={{ position: 'absolute', inset: 0, background: '#fff', zIndex: 20, opacity: 0.9 }}/>
          )}

          {/* Top bar */}
          <div style={{
            padding: '52px 20px 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(0,0,0,0.8)', flexShrink: 0
          }}>
            <button onClick={handleDismissScan} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer', lineHeight: 1, padding: '4px 8px' }}>✕</button>
            <span style={{ font: "600 14px 'Space Grotesk'", color: '#fff', letterSpacing: '0.2px' }}>Mahlzeit fotografieren</span>
            <div style={{ width: 40 }}/>
          </div>

          {/* Viewfinder */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#000' }}>
            {/* Real food photo as camera preview */}
            <img src="/magerquark-bowl.png" alt="" style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center'
            }}/>
            {/* Rule-of-thirds grid */}
            <div style={{ position: 'absolute', top: 0, left: '33.33%', width: 1, height: '100%', background: 'rgba(255,255,255,0.12)' }}/>
            <div style={{ position: 'absolute', top: 0, left: '66.66%', width: 1, height: '100%', background: 'rgba(255,255,255,0.12)' }}/>
            <div style={{ position: 'absolute', top: '33.33%', left: 0, width: '100%', height: 1, background: 'rgba(255,255,255,0.12)' }}/>
            <div style={{ position: 'absolute', top: '66.66%', left: 0, width: '100%', height: 1, background: 'rgba(255,255,255,0.12)' }}/>
            {/* Corner brackets */}
            {[
              { top: '14%', left: '8%', borderTop: '2.5px solid rgba(255,255,255,0.9)', borderLeft: '2.5px solid rgba(255,255,255,0.9)' },
              { top: '14%', right: '8%', borderTop: '2.5px solid rgba(255,255,255,0.9)', borderRight: '2.5px solid rgba(255,255,255,0.9)' },
              { bottom: '14%', left: '8%', borderBottom: '2.5px solid rgba(255,255,255,0.9)', borderLeft: '2.5px solid rgba(255,255,255,0.9)' },
              { bottom: '14%', right: '8%', borderBottom: '2.5px solid rgba(255,255,255,0.9)', borderRight: '2.5px solid rgba(255,255,255,0.9)' },
            ].map((s, i) => (
              <div key={i} style={{ position: 'absolute', width: 30, height: 30, ...s }}/>
            ))}
            {/* Focus indicator */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 70, height: 70, borderRadius: '50%',
              border: `2px solid ${LIME}`, boxShadow: `0 0 12px ${LIME}40`
            }}/>
            <div style={{
              position: 'absolute', bottom: '8%', left: 0, right: 0,
              textAlign: 'center', font: "400 12px 'Hanken Grotesk'",
              color: 'rgba(255,255,255,0.7)', textShadow: '0 1px 4px rgba(0,0,0,0.8)'
            }}>
              Mahlzeit in den Rahmen positionieren
            </div>
          </div>

          {/* Shutter row */}
          <div style={{
            padding: '28px 20px 44px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#0A0A0A', gap: 40, flexShrink: 0
          }}>
            <div style={{ width: 40 }}/>
            <button onClick={handleShutter} style={{
              width: 74, height: 74, borderRadius: '50%', background: '#fff',
              border: '3px solid rgba(255,255,255,0.35)',
              outline: '2.5px solid rgba(255,255,255,0.6)', outlineOffset: '5px',
              cursor: 'pointer', flexShrink: 0,
              boxShadow: '0 0 24px rgba(255,255,255,0.12)'
            }}/>
            <div style={{ width: 40 }}/>
          </div>
        </div>
      )}

      {/* Scan overlay */}
      {(scanState === 'scanning' || scanState === 'result') && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, padding: '20px', animation: 'fadeIn 0.2s ease'
        }}>
          {scanState === 'scanning' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 240, height: 240, border: `2px solid ${LIME}`, borderRadius: '24px',
                position: 'relative', margin: '0 auto 24px', overflow: 'hidden', background: '#0A0A0A'
              }}>
                <img src="/magerquark-bowl.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.75 }}/>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }}/>
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
                <div style={{
                  position: 'absolute', left: 0, right: 0, height: 2,
                  background: LIME, boxShadow: `0 0 10px ${LIME}`,
                  top: 0, animation: 'scan-line 1.5s linear infinite'
                }} />
              </div>
              <div style={{
                width: 48, height: 48, border: `3px solid rgba(182,242,62,.2)`,
                borderTop: `3px solid ${LIME}`, borderRadius: '50%',
                animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
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
            <div style={{ width: '100%', maxWidth: 360, animation: 'fadeInUp 0.4s ease' }}>
              <div style={{ font: "700 11px 'Space Mono'", letterSpacing: '2px', color: LIME, textAlign: 'center', marginBottom: '16px' }}>
                <svg viewBox="0 0 12 12" width="10" height="10" fill={LIME} style={{ marginRight: 6, flexShrink: 0 }}><path d="M7 1L2 7h3.5L4 11l6-6.5H6.5z"/></svg>
                KI-ERKENNUNG ABGESCHLOSSEN
              </div>
              <div style={{
                background: '#111', border: `1px solid rgba(182,242,62,.25)`,
                borderRadius: '24px', padding: '24px',
                boxShadow: '0 0 40px rgba(182,242,62,.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(182,242,62,0.1)', border: '2px solid rgba(182,242,62,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#B6F23E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                </div>
                <div style={{ font: "600 18px 'Space Grotesk'", textAlign: 'center', letterSpacing: '-0.3px', marginBottom: '4px' }}>
                  {scanResult.name}
                </div>
                <div style={{ font: "400 13px 'Hanken Grotesk'", color: '#6A6A6A', textAlign: 'center', marginBottom: '20px' }}>
                  Erkannt mit ~95 % Genauigkeit
                </div>
                <div style={{
                  background: 'rgba(182,242,62,.08)', border: '1px solid rgba(182,242,62,.15)',
                  borderRadius: '16px', padding: '16px', textAlign: 'center', marginBottom: '16px'
                }}>
                  <div style={{ font: "700 36px 'Space Grotesk'", color: LIME, letterSpacing: '-1px' }}>
                    {scanResult.kcal}
                  </div>
                  <div style={{ font: "400 12px 'Hanken Grotesk'", color: '#7A7A7A' }}>Kalorien (kcal)</div>
                </div>
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
                <button onClick={handleAddFood} style={{
                  width: '100%', background: LIME, color: '#07090A',
                  border: 'none', borderRadius: '14px', padding: '16px',
                  font: "700 15px 'Hanken Grotesk'", cursor: 'pointer', marginBottom: '10px'
                }}>
                  Hinzufügen
                </button>
                <button onClick={handleShareToCommunity} style={{
                  width: '100%', background: 'transparent', color: LIME,
                  border: `1px solid rgba(182,242,62,0.4)`, borderRadius: '14px', padding: '14px',
                  font: "600 14px 'Hanken Grotesk'", cursor: 'pointer', marginBottom: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={LIME} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
                  In Community teilen
                </button>
                <button onClick={handleDismissScan} style={{
                  width: '100%', background: 'transparent', color: '#5A5A5A',
                  border: '1px solid #222', borderRadius: '14px', padding: '14px',
                  font: "500 14px 'Hanken Grotesk'", cursor: 'pointer'
                }}>
                  Abbrechen
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div style={{ padding: '56px 20px 0' }}>
        <div style={{ font: "700 11px 'Space Mono'", letterSpacing: '2px', color: '#5A5A5A', marginBottom: 8 }}>
          {{ nutrition: 'ERNÄHRUNG', inspiration: 'INSPIRATION', gewicht: 'GEWICHTSPROTOKOLL' }[view]}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ font: "700 28px 'Space Grotesk'", letterSpacing: '-0.6px' }}>
            {{ nutrition: 'Heute', inspiration: 'Gerichte', gewicht: 'Gewicht' }[view]}
          </div>

          {/* Segment control */}
          <div style={{
            display: 'inline-flex', background: '#111', border: '1px solid #1E1E1E',
            borderRadius: 12, padding: 3
          }}>
            {[['nutrition', 'Ernährung'], ['inspiration', 'Inspiration'], ['gewicht', 'Gewicht']].map(([id, label]) => (
              <button key={id} onClick={() => setView(id)} style={{
                padding: '8px 11px', borderRadius: 9, border: 'none',
                background: view === id ? LIME : 'transparent',
                color: view === id ? '#000' : '#6A6A6A',
                font: `600 12px 'Hanken Grotesk'`, cursor: 'pointer', transition: 'all .15s'
              }}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── ERNÄHRUNG VIEW ── */}
      {view === 'nutrition' && (
        <>
          {/* Calorie Ring */}
          <div style={{ padding: '0 20px 20px' }}>
            <div style={{ background: '#0D0D0D', border: '1px solid #1E1E1E', borderRadius: '22px', padding: '24px 20px' }}>
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
                          height: '100%', width: `${Math.min((m.val / m.goal) * 100, 100)}%`,
                          background: m.color, borderRadius: '999px', transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Camera button */}
          <div style={{ padding: '0 20px 16px' }}>
            <button
              onClick={() => handleCameraClick('snacks')}
              style={{
                width: '100%', background: LIME, color: '#07090A',
                border: 'none', borderRadius: '999px', padding: '18px',
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
                  <div
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', cursor: 'pointer' }}
                    onClick={() => setExpandedMeal(isExpanded ? null : key)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ font: "600 15px 'Hanken Grotesk'" }}>{label}</div>
                      {items.length > 0 && (
                        <span style={{ background: 'rgba(182,242,62,.1)', color: LIME, font: "600 11px 'Space Grotesk'", padding: '2px 8px', borderRadius: '999px' }}>
                          {items.length}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ font: "600 14px 'Space Grotesk'", color: kcal > 0 ? '#fff' : '#3A3A3A' }}>
                        {kcal > 0 ? `${kcal} kcal` : '—'}
                      </span>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#3A3A3A" strokeWidth="2" strokeLinecap="round"
                        style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ borderTop: '1px solid #171717' }}>
                      {items.map((item, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          padding: '10px 16px',
                          borderBottom: i < items.length - 1 ? '1px solid #141414' : 'none'
                        }}>
                          <div style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="#4A4A4A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="8" cy="9" r="5"/><path d="M5.5 4.5L6 3M8 4V2.5M10.5 4.5L10 3"/>
                            </svg>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ font: "500 13px 'Hanken Grotesk'" }}>{item.name}</div>
                            <div style={{ font: "400 11px 'Hanken Grotesk'", color: '#5A5A5A', marginTop: '2px' }}>
                              KH {item.kh}g · PRO {item.pro}g · Fett {item.fett}g
                            </div>
                          </div>
                          <div style={{ font: "600 13px 'Space Grotesk'", color: '#A0A0A0' }}>{item.kcal} kcal</div>
                        </div>
                      ))}
                      <div style={{ padding: '10px 16px 14px', display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleCameraClick(key)} style={{
                          flex: 1, background: LIME, color: '#07090A', border: 'none', borderRadius: '10px', padding: '10px',
                          font: "600 13px 'Hanken Grotesk'", cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                        }}>
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                            <circle cx="12" cy="13" r="4"/>
                          </svg>
                          KI-Scan
                        </button>
                        <button style={{
                          flex: 1, background: 'transparent', color: '#7A7A7A',
                          border: '1px solid #222', borderRadius: '10px', padding: '10px',
                          font: "600 13px 'Hanken Grotesk'", cursor: 'pointer'
                        }}>
                          + Manuell
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

        </>
      )}

      {/* ── INSPIRATION VIEW ── */}
      {view === 'inspiration' && <InspirationFeed />}

      {/* ── GEWICHT VIEW ── */}
      {view === 'gewicht' && <GewichtView />}
    </div>
  )
}
