import { useState, useEffect } from 'react'
import Logo from '../components/Logo'
import { store } from '../store'

const LIME = '#B6F23E'
const GRAY = '#1A1A1A'

const BASE_FRIENDS = [
  { id: 1, name: 'Patrick',  avatar: 'PA', distance: 58.2, runs: 7, streak: 6 },
  { id: 2, name: 'Nico',     avatar: 'NI', distance: 51.4, runs: 6, streak: 5 },
  { id: 3, name: 'Jonas K.', avatar: 'JK', distance: 41.2, runs: 4, streak: 3 },
  { id: 4, name: 'Du',       avatar: 'MM', distance: 38.5, runs: 5, streak: 4, isMe: true },
  { id: 5, name: 'Lena B.',  avatar: 'LB', distance: 31.0, runs: 4, streak: 2 },
  { id: 6, name: 'Tom W.',   avatar: 'TW', distance: 22.8, runs: 3, streak: 1 },
]

const BASE_FEED = [
  {
    id: 2, user: 'Jonas K.', avatar: 'JK', time: 'vor 1 Std.',
    type: 'run', title: 'Morgenrunde',
    distance: '12,4 km', pace: '4:52 /km', duration: '1:00:20',
    kudos: 5, myKudos: false, hasMap: false
  },
  {
    id: 3, user: 'Sarah M.', avatar: 'SM', time: 'vor 3 Std.',
    type: 'run', title: 'Intervalltraining',
    distance: '8,0 km', pace: '4:30 /km', duration: '36:00',
    kudos: 8, myKudos: true, hasMap: false
  },
  {
    id: 4, user: 'Marco P.', avatar: 'MP', time: 'vor 5 Std.',
    type: 'run', title: 'Recovery Run',
    distance: '6,2 km', pace: '5:45 /km', duration: '35:39',
    kudos: 3, myKudos: false, hasMap: false
  },
]

const CHALLENGES = [
  { id: 1, name: '100km Juni Challenge', current: 38.5, target: 100, participants: 24, daysLeft: 2 },
  { id: 2, name: '5 Läufe in 7 Tagen', current: 4, target: 5, participants: 11, daysLeft: 3, unit: 'Läufe' },
]

const GROUPS = [
  { id: 1, name: 'München Runners', members: 142, recentRun: 'heute', emoji: '🏙️' },
  { id: 2, name: 'Marathon Prep 2026', members: 38, recentRun: 'gestern', emoji: '🏅' },
  { id: 3, name: 'Early Birds 5am', members: 67, recentRun: 'heute', emoji: '🌅' },
]

const BASE_RECIPES = [
  {
    id: 2, user: 'Lena B.', avatar: 'LB', time: 'gestern',
    title: 'Pre-Run Overnight Oats', emoji: '🌙', tag: 'Pre-Workout · Vorbereitung',
    desc: 'Abends vorbereiten, morgens direkt laufen gehen. 45 g Carbs für die erste Stunde.',
    ingredients: ['80 g Haferflocken', '200 ml Hafermilch', '1 EL Erdnussmus', '1 Apfel'],
    nutrients: { kcal: 410, protein: 14, carbs: 62, fat: 9 },
    aiLabel: 'KI-Analyse', photo: 'overnightoats',
    kudos: 11, myKudos: false
  },
]

// ─── FOOD PHOTOS ──────────────────────────────────────────────────────────────

function MagerquarkPhoto() {
  return (
    <svg viewBox="0 0 300 140" style={{ width: '100%', display: 'block' }}>
      <defs>
        <radialGradient id="mqBg" cx="50%" cy="50%"><stop offset="0%" stopColor="#1A1508"/><stop offset="100%" stopColor="#0D0A05"/></radialGradient>
        <radialGradient id="mqBowl" cx="45%" cy="40%"><stop offset="0%" stopColor="#FFFDF8"/><stop offset="100%" stopColor="#E8DDD0"/></radialGradient>
        <radialGradient id="mqQuark" cx="40%" cy="35%"><stop offset="0%" stopColor="#FFFFFE"/><stop offset="100%" stopColor="#F0EAE0"/></radialGradient>
      </defs>
      <rect width="300" height="140" fill="url(#mqBg)"/>
      {/* bowl shadow */}
      <ellipse cx="150" cy="88" rx="86" ry="52" fill="rgba(0,0,0,0.5)"/>
      {/* bowl rim */}
      <ellipse cx="150" cy="82" rx="84" ry="50" fill="url(#mqBowl)"/>
      {/* quark */}
      <ellipse cx="150" cy="80" rx="78" ry="45" fill="url(#mqQuark)"/>
      {/* blueberries */}
      {[[126,68,9],[140,61,10],[155,66,9],[168,62,8],[161,74,7],[147,74,8]].map(([x,y,r],i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill="#1A1042"/>
          <circle cx={x} cy={y} r={r-2} fill="#2E1C6A"/>
          <circle cx={x-1} cy={y-2} r={r*0.35} fill="rgba(90,70,180,0.4)"/>
        </g>
      ))}
      {/* strawberry */}
      <path d="M 115,82 Q 109,72 117,68 Q 126,64 128,74 Q 126,84 115,82 Z" fill="#B02030"/>
      <path d="M 115,82 Q 109,72 117,68 Q 122,66 124,73 Q 122,83 115,82 Z" fill="#D43040"/>
      {[[115,73],[119,70],[117,77],[121,75]].map(([sx,sy],i) => <ellipse key={i} cx={sx} cy={sy} rx="1" ry="1.4" fill="#8A1820" transform={`rotate(${i*18-18} ${sx} ${sy})`}/>)}
      {/* banana slices */}
      <ellipse cx="184" cy="82" rx="13" ry="9" fill="#E8CC30" transform="rotate(-15 184 82)"/>
      <ellipse cx="184" cy="82" rx="10" ry="7" fill="#F5DC48" transform="rotate(-15 184 82)"/>
      <ellipse cx="106" cy="89" rx="11" ry="7.5" fill="#E8CC30" transform="rotate(20 106 89)"/>
      <ellipse cx="106" cy="89" rx="8.5" ry="5.5" fill="#F5DC48" transform="rotate(20 106 89)"/>
      {/* oats/granola */}
      {[[136,90,-20],[148,96,10],[160,92,-15],[172,88,25],[130,94,5]].map(([x,y,rot],i) => (
        <ellipse key={i} cx={x} cy={y} rx="5" ry="2" fill="rgba(185,140,80,0.6)" transform={`rotate(${rot} ${x} ${y})`}/>
      ))}
      {/* honey drizzle */}
      <path d="M 136,78 Q 150,73 162,80 Q 168,85 162,91" fill="none" stroke="#D4A017" strokeWidth="2" strokeOpacity="0.65" strokeLinecap="round"/>
      {/* KI badge */}
      <rect x="8" y="8" width="78" height="18" rx="5" fill="rgba(182,242,62,0.12)" stroke="rgba(182,242,62,0.2)" strokeWidth="0.5"/>
      <text x="14" y="20.5" fill="#B6F23E" fontSize="8.5" fontFamily="Hanken Grotesk" fontWeight="700">📸 KI-ANALYSIERT</text>
    </svg>
  )
}

function OvernightOatsPhoto() {
  return (
    <svg viewBox="0 0 300 140" style={{ width: '100%', display: 'block' }}>
      <defs>
        <linearGradient id="ooBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#110C07"/><stop offset="100%" stopColor="#0A0806"/></linearGradient>
        <linearGradient id="ooTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D4A86C"/><stop offset="100%" stopColor="#B88848"/></linearGradient>
        <linearGradient id="ooMid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C89850"/><stop offset="100%" stopColor="#A07030"/></linearGradient>
      </defs>
      <rect width="300" height="140" fill="url(#ooBg)"/>
      {/* jar shadow */}
      <ellipse cx="150" cy="134" rx="62" ry="8" fill="rgba(0,0,0,0.5)"/>
      {/* jar body */}
      <rect x="90" y="18" width="120" height="112" rx="9" fill="#080604" stroke="#1C1408" strokeWidth="1.5"/>
      {/* lid */}
      <rect x="84" y="8" width="132" height="14" rx="5" fill="#1A1208" stroke="#2A1E10" strokeWidth="1"/>
      <rect x="88" y="11" width="124" height="8" rx="3" fill="#241A0C"/>
      <rect x="84" y="20" width="132" height="4" rx="1" fill="#120E06"/>
      {/* bottom oat layer */}
      <rect x="92" y="100" width="116" height="28" rx="0 0 7 7" fill="#5C3818"/>
      {/* middle layer */}
      <rect x="92" y="64" width="116" height="38" fill="url(#ooMid)"/>
      {/* top layer */}
      <rect x="92" y="28" width="116" height="38" fill="url(#ooTop)"/>
      {/* layer divider */}
      <line x1="92" y1="64" x2="208" y2="64" stroke="rgba(220,195,140,0.4)" strokeWidth="1.5"/>
      {/* apple chunks */}
      <ellipse cx="128" cy="42" rx="16" ry="11" fill="#E8D478" transform="rotate(-12 128 42)"/>
      <ellipse cx="128" cy="42" rx="13" ry="9" fill="#F2E08A" transform="rotate(-12 128 42)"/>
      <path d="M 115 36 Q 120 30 130 33" fill="none" stroke="rgba(160,50,50,0.45)" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="165" cy="40" rx="13" ry="9" fill="#E8D478" transform="rotate(18 165 40)"/>
      <ellipse cx="165" cy="40" rx="11" ry="7.5" fill="#F2E08A" transform="rotate(18 165 40)"/>
      <path d="M 158 34 Q 163 28 170 31" fill="none" stroke="rgba(160,50,50,0.35)" strokeWidth="2" strokeLinecap="round"/>
      {/* oat flakes */}
      {[[108,52,12],[120,57,5],[135,52,18],[148,57,-8],[155,51,25],[170,54,-15],[182,49,10]].map(([x,y,rot],i) => (
        <ellipse key={i} cx={x} cy={y} rx="5" ry="2.2" fill="rgba(185,150,90,0.55)" transform={`rotate(${rot} ${x} ${y})`}/>
      ))}
      {/* peanut butter drizzle */}
      <path d="M 94 64 Q 130 59 168 64 Q 185 67 206 64" fill="none" stroke="#8A5818" strokeWidth="3.5" strokeOpacity="0.7" strokeLinecap="round"/>
      <path d="M 94 64 Q 130 59 168 64 Q 185 67 206 64" fill="none" stroke="#C07A28" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round"/>
      {/* glass shine */}
      <rect x="90" y="18" width="14" height="112" rx="9 0 0 9" fill="rgba(255,255,255,0.035)"/>
      {/* KI badge */}
      <rect x="8" y="8" width="78" height="18" rx="5" fill="rgba(182,242,62,0.12)" stroke="rgba(182,242,62,0.2)" strokeWidth="0.5"/>
      <text x="14" y="20.5" fill="#B6F23E" fontSize="8.5" fontFamily="Hanken Grotesk" fontWeight="700">📸 KI-ANALYSIERT</text>
    </svg>
  )
}

// ─── MINI MAP ─────────────────────────────────────────────────────────────────

function MiniMap() {
  const routeD = 'M 29,85 L 29,57 L 57,57 L 57,32 L 82,32 L 82,44 L 116,44 L 116,68 L 82,68 L 82,85 L 57,85 L 29,85'
  return (
    <svg viewBox="0 0 160 100" style={{ width:'100%', display:'block' }}>
      <rect width="160" height="100" fill="#050A07"/>
      {/* Street grid */}
      {[14, 42, 70, 100, 130, 148].map(x => (
        <line key={`x${x}`} x1={x} y1="0" x2={x} y2="100" stroke="#0A120B" strokeWidth="2"/>
      ))}
      {[18, 44, 57, 68, 80].map(y => (
        <line key={`y${y}`} x1="0" y1={y} x2="160" y2={y} stroke="#0A120B" strokeWidth="2"/>
      ))}
      {/* Route streets (brighter) */}
      {[29, 57, 82, 116].map(x => (
        <line key={`rx${x}`} x1={x} y1="0" x2={x} y2="100" stroke="#0E1C0E" strokeWidth="3"/>
      ))}
      {[32, 44, 57, 68, 85].map(y => (
        <line key={`ry${y}`} x1="0" y1={y} x2="160" y2={y} stroke="#0E1C0E" strokeWidth="3"/>
      ))}
      {/* Full green route */}
      <path d={routeD} fill="none" stroke={LIME} strokeWidth="10" strokeOpacity="0.08" strokeLinecap="square" strokeLinejoin="miter"/>
      <path d={routeD} fill="none" stroke={LIME} strokeWidth="4" strokeOpacity="0.2" strokeLinecap="square" strokeLinejoin="miter"/>
      <path d={routeD} fill="none" stroke={LIME} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"/>
      <circle cx="29" cy="85" r="4" fill="rgba(182,242,62,0.2)"/>
      <circle cx="29" cy="85" r="2.5" fill={LIME}/>
      <text x="6" y="97" fill="#132013" fontSize="5" fontFamily="Hanken Grotesk">Englischer Garten · München</text>
    </svg>
  )
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function Avatar({ initials, size = 36, highlight, color }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: highlight ? LIME : (color || '#222'),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      font: `700 ${Math.round(size * 0.35)}px 'Space Grotesk'`,
      color: highlight ? '#000' : '#aaa',
      flexShrink: 0,
      border: highlight ? 'none' : '1.5px solid #2A2A2A'
    }}>
      {initials}
    </div>
  )
}

function KudosButton({ count, active, onToggle }) {
  return (
    <button onClick={onToggle} style={{
      display: 'flex', alignItems: 'center', gap: '5px',
      background: active ? 'rgba(182,242,62,0.12)' : 'rgba(255,255,255,0.05)',
      border: active ? `1px solid rgba(182,242,62,0.4)` : '1px solid #2A2A2A',
      borderRadius: '20px', padding: '5px 12px', cursor: 'pointer', transition: 'all 0.15s'
    }}>
      <span style={{ fontSize: '14px' }}>👏</span>
      <span style={{ font: `600 12px 'Hanken Grotesk'`, color: active ? LIME : '#888' }}>{count}</span>
    </button>
  )
}

// ─── RECIPE CARD ──────────────────────────────────────────────────────────────

function RecipeCard({ r, onKudos }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: GRAY, borderRadius: '18px', border: '1px solid #2A2A2A', overflow:'hidden' }}>
      {/* Header */}
      <div style={{ padding:'16px 16px 0' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
          <Avatar initials={r.avatar} size={38}/>
          <div style={{ flex:1 }}>
            <div style={{ font:"600 14px 'Space Grotesk'", color:'#fff' }}>{r.user}</div>
            <div style={{ font:"400 12px 'Hanken Grotesk'", color:'#555', marginTop:'1px' }}>{r.time}</div>
          </div>
          <div style={{ background:'rgba(182,242,62,0.1)', border:'1px solid rgba(182,242,62,0.2)', borderRadius:'8px', padding:'4px 8px', font:"600 10px 'Space Grotesk'", color:LIME }}>Rezept</div>
        </div>

        {/* Food photo */}
        <div style={{ borderRadius:'12px', overflow:'hidden', marginBottom:'12px', border:'1px solid #1A2A1A' }}>
          {r.photo === 'magerquark' ? <MagerquarkPhoto/> :
           r.photo === 'overnightoats' ? <OvernightOatsPhoto/> : (
            <div style={{ background:'linear-gradient(135deg,#0A1A08,#061006)', height:'120px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6 }}>
              <div style={{ fontSize:40 }}>{r.emoji}</div>
              <div style={{ font:"600 11px 'Hanken Grotesk'", color:'rgba(182,242,62,0.6)', letterSpacing:'1px' }}>📸 KI-ANALYSIERT</div>
            </div>
          )}
        </div>

        <div style={{ font:"700 15px 'Space Grotesk'", color:'#fff', marginBottom:4 }}>{r.title}</div>
        <div style={{ font:"400 11px 'Hanken Grotesk'", color:LIME, marginBottom:6, opacity:0.7 }}>{r.tag}</div>
        <div style={{ font:"400 13px 'Hanken Grotesk'", color:'#888', lineHeight:1.6, marginBottom:14 }}>{r.desc}</div>

        {/* KI Nutrition */}
        <div style={{ background:'#111', border:'1px solid #1E1E1E', borderRadius:'12px', padding:'12px', marginBottom:'12px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
            <svg viewBox="0 0 12 12" width="10" height="10" fill={LIME}><path d="M7 1L2 7h3.5L4 11l6-6.5H6.5z"/></svg>
            <span style={{ font:"700 10px 'Space Grotesk'", color:LIME, letterSpacing:'1px' }}>KI-ERNÄHRUNGSANALYSE</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:8 }}>
            {[
              ['Kalorien', r.nutrients.kcal, 'kcal', '#fff'],
              ['Protein',  r.nutrients.protein, 'g', LIME],
              ['Carbs',    r.nutrients.carbs, 'g', '#F5A524'],
              ['Fett',     r.nutrients.fat, 'g', '#5AA9F0'],
            ].map(([l,v,u,c]) => (
              <div key={l} style={{ textAlign:'center' }}>
                <div style={{ font:`700 16px 'Space Grotesk'`, color:c, lineHeight:1 }}>{v}</div>
                <div style={{ font:"400 9px 'Hanken Grotesk'", color:'#555', marginTop:2 }}>{u}</div>
                <div style={{ font:"400 9px 'Hanken Grotesk'", color:'#444', marginTop:1 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Ingredients toggle */}
        <button onClick={() => setOpen(o => !o)} style={{ background:'none', border:'none', color:LIME, font:"600 13px 'Hanken Grotesk'", cursor:'pointer', padding:0, marginBottom: open ? 8 : 14, display:'flex', alignItems:'center', gap:5 }}>
          {open ? '▲' : '▼'} Zutaten {open ? 'ausblenden' : 'anzeigen'}
        </button>
        {open && (
          <ul style={{ margin:'0 0 14px', padding:'0 0 0 16px' }}>
            {r.ingredients.map((ing,i) => (
              <li key={i} style={{ font:"400 13px 'Hanken Grotesk'", color:'#999', marginBottom:4 }}>{ing}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding:'0 16px 14px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <KudosButton count={r.kudos} active={r.myKudos} onToggle={onKudos}/>
        <button style={{ background:'none', border:'1px solid #2A2A2A', borderRadius:'20px', padding:'5px 14px', font:"500 12px 'Hanken Grotesk'", color:'#555', cursor:'pointer' }}>
          Kommentieren
        </button>
      </div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function Community() {
  const [activeTab, setActiveTab] = useState('feed')

  const [feed, setFeed] = useState(() => {
    if (store.workoutPost) return [store.workoutPost, ...BASE_FEED]
    return BASE_FEED
  })

  const [recipes, setRecipes] = useState(() => {
    if (store.recipePost) return [store.recipePost, ...BASE_RECIPES]
    return BASE_RECIPES
  })

  // Slowly auto-increment likes on newly shared recipe
  useEffect(() => {
    if (!store.recipePost) return
    const delays = [6000, 13000, 22000, 35000, 52000, 75000]
    const timers = delays.map(d => setTimeout(() => {
      setRecipes(prev => prev.map(r => r.isNew ? { ...r, kudos: r.kudos + 1 } : r))
    }, d))
    return () => timers.forEach(clearTimeout)
  }, [])

  const toggleKudos = (id) => {
    setFeed(prev => prev.map(item => {
      if (item.id !== id) return item
      // First like on a freshly shared post jumps to 12
      if (item.isNew && !item.myKudos) return { ...item, myKudos: true, kudos: 12 }
      return { ...item, myKudos: !item.myKudos, kudos: item.myKudos ? item.kudos - 1 : item.kudos + 1 }
    }))
  }

  const toggleRecipeKudos = (id) => {
    setRecipes(prev => prev.map(r => {
      if (r.id !== id) return r
      return { ...r, myKudos: !r.myKudos, kudos: r.myKudos ? r.kudos - 1 : r.kudos + 1 }
    }))
  }

  const tabs = [
    { id: 'feed',        label: 'Feed' },
    { id: 'leaderboard', label: 'Rangliste' },
    { id: 'rezepte',     label: 'Rezepte' },
    { id: 'challenges',  label: 'Challenges' },
  ]

  return (
    <div style={{ minHeight: '100%', background: '#000', paddingBottom: '20px' }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo size={32}/>
        <div style={{ font: "700 18px 'Space Grotesk'", letterSpacing: '-0.3px' }}>Community</div>
        <button style={{ background: GRAY, border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>

      {/* Sub-tabs */}
      <div style={{ display: 'flex', padding: '0 20px 20px' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex: 1, padding: '8px 2px', background: 'none', border: 'none',
            borderBottom: activeTab === t.id ? `2px solid ${LIME}` : '2px solid #1A1A1A',
            color: activeTab === t.id ? LIME : '#555',
            font: `${activeTab === t.id ? '600' : '500'} 11px 'Hanken Grotesk'`,
            cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap'
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── FEED ── */}
      {activeTab === 'feed' && (
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {feed.map(item => {
            if (item.type === 'recipe') {
              return (
                <RecipeCard key={item.id} r={item} onKudos={() => toggleKudos(item.id)}/>
              )
            }
            return (
              <div key={item.id} style={{ background: GRAY, borderRadius: '16px', padding: '16px', border: item.isNew ? `1px solid rgba(182,242,62,0.3)` : '1px solid #2A2A2A' }}>
                {item.isNew && (
                  <div style={{ font:"600 10px 'Space Grotesk'", color:LIME, letterSpacing:'1px', marginBottom:8 }}>✓ GERADE GETEILT</div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Avatar initials={item.avatar} size={38} highlight={item.isNew}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ font: "600 14px 'Space Grotesk'", color: item.isNew ? LIME : '#fff' }}>{item.user}</div>
                    <div style={{ font: "400 12px 'Hanken Grotesk'", color: '#555', marginTop: '1px' }}>{item.time}</div>
                  </div>
                  <div style={{ background: 'rgba(182,242,62,0.1)', borderRadius: '8px', padding: '4px 8px', font: "600 11px 'Space Grotesk'", color: LIME }}>{item.title}</div>
                </div>

                {/* Mini map for runs with map */}
                {item.hasMap && (
                  <div style={{ borderRadius:'10px', overflow:'hidden', marginBottom:'12px', border:'1px solid #0D1A0D' }}>
                    <MiniMap/>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                  {[
                    { label: 'Distanz', value: item.distance },
                    { label: 'Pace', value: item.pace },
                    { label: 'Zeit', value: item.duration },
                  ].map(stat => (
                    <div key={stat.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px 8px', textAlign: 'center' }}>
                      <div style={{ font: "700 13px 'Space Mono'", color: '#fff' }}>{stat.value}</div>
                      <div style={{ font: "400 10px 'Hanken Grotesk'", color: '#555', marginTop: '2px' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <KudosButton count={item.kudos} active={item.myKudos} onToggle={() => toggleKudos(item.id)}/>
                  <button style={{ background: 'none', border: '1px solid #2A2A2A', borderRadius: '20px', padding: '5px 14px', font: "500 12px 'Hanken Grotesk'", color: '#555', cursor: 'pointer' }}>Kommentieren</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── LEADERBOARD ── */}
      {activeTab === 'leaderboard' && (
        <div style={{ padding: '0 20px' }}>
          <div style={{ background: GRAY, borderRadius: '16px', overflow: 'hidden', border: '1px solid #2A2A2A', marginBottom: '16px' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ font: "700 14px 'Space Grotesk'", color: '#fff' }}>Diese Woche</span>
              <span style={{ font: "400 12px 'Hanken Grotesk'", color: '#555' }}>nach Distanz</span>
            </div>
            {BASE_FRIENDS.map((f, i) => (
              <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: f.isMe ? 'rgba(182,242,62,0.06)' : 'transparent', borderBottom: i < BASE_FRIENDS.length - 1 ? '1px solid #161616' : 'none' }}>
                <div style={{ width: 24, textAlign: 'center', font: `${i < 3 ? '700' : '500'} 14px 'Space Grotesk'`, color: i===0?'#FFD700':i===1?'#C0C0C0':i===2?'#CD7F32':'#444' }}>
                  {i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}
                </div>
                <Avatar initials={f.avatar} size={34} highlight={f.isMe}/>
                <div style={{ flex: 1 }}>
                  <div style={{ font: `${f.isMe?'700':'600'} 13px 'Space Grotesk'`, color: f.isMe ? LIME : '#fff' }}>{f.name}</div>
                  <div style={{ font: "400 11px 'Hanken Grotesk'", color: '#555', marginTop: '1px' }}>{f.runs} Läufe · 🔥 {f.streak} Tage</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ font: "700 14px 'Space Mono'", color: f.isMe ? LIME : '#fff' }}>{f.distance}</div>
                  <div style={{ font: "400 10px 'Hanken Grotesk'", color: '#555' }}>km</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(182,242,62,0.06)', border: `1px solid rgba(182,242,62,0.2)`, borderRadius: '14px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '28px' }}>🏃</div>
            <div>
              <div style={{ font: "600 13px 'Space Grotesk'", color: LIME }}>Platz 4 diese Woche</div>
              <div style={{ font: "400 12px 'Hanken Grotesk'", color: '#888', marginTop: '2px' }}>Noch 2.7 km bis Platz 3 — du schaffst das!</div>
            </div>
          </div>
        </div>
      )}

      {/* ── REZEPTE ── */}
      {activeTab === 'rezepte' && (
        <div style={{ padding: '0 20px', display:'flex', flexDirection:'column', gap:'12px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
            <div style={{ font:"600 11px 'Hanken Grotesk'", color:'#555', letterSpacing:'0.5px', textTransform:'uppercase' }}>Community-Rezepte</div>
            <button style={{ background:LIME, border:'none', borderRadius:20, padding:'5px 14px', font:"700 11px 'Space Grotesk'", color:'#000', cursor:'pointer' }}>
              + Rezept teilen
            </button>
          </div>
          {recipes.map(r => (
            <RecipeCard key={r.id} r={r} onKudos={() => toggleRecipeKudos(r.id)}/>
          ))}
        </div>
      )}

      {/* ── CHALLENGES ── */}
      {activeTab === 'challenges' && (
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ font: "600 11px 'Hanken Grotesk'", color: '#555', marginBottom: '4px', letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '11px' }}>Aktive Challenges</div>
          {CHALLENGES.map(c => {
            const pct = Math.min(100, Math.round((c.current / c.target) * 100))
            const unit = c.unit || 'km'
            return (
              <div key={c.id} style={{ background: GRAY, borderRadius: '16px', padding: '18px', border: '1px solid #2A2A2A' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div>
                    <div style={{ font: "700 14px 'Space Grotesk'", color: '#fff', marginBottom: '4px' }}>{c.name}</div>
                    <div style={{ font: "400 12px 'Hanken Grotesk'", color: '#555' }}>{c.participants} Teilnehmer · noch {c.daysLeft} Tage</div>
                  </div>
                  <div style={{ font: "700 20px 'Space Mono'", color: LIME }}>{pct}%</div>
                </div>
                <div style={{ background: '#111', borderRadius: '99px', height: '8px', overflow: 'hidden', marginBottom: '10px' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${LIME}, #7cc518)`, borderRadius: '99px' }}/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ font: "500 12px 'Hanken Grotesk'", color: '#888' }}>{c.current} / {c.target} {unit}</span>
                  <span style={{ font: "600 11px 'Space Grotesk'", color: '#000', background: LIME, borderRadius: '20px', padding: '3px 10px' }}>Mitmachen</span>
                </div>
              </div>
            )
          })}
          <div style={{ font: "600 11px 'Hanken Grotesk'", color: '#555', letterSpacing: '0.5px', textTransform: 'uppercase', marginTop: '8px' }}>Weitere Challenges</div>
          {[
            { name: 'Halbmarathon Vorbereitung', participants: 89, emoji: '🎯' },
            { name: 'Frühaufsteher-Club 5am', participants: 31, emoji: '🌅' },
            { name: '10km unter 50 Min.', participants: 56, emoji: '⚡' },
          ].map((c, i) => (
            <div key={i} style={{ background: GRAY, borderRadius: '14px', padding: '14px 16px', border: '1px solid #2A2A2A', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '24px' }}>{c.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ font: "600 13px 'Space Grotesk'", color: '#fff' }}>{c.name}</div>
                <div style={{ font: "400 11px 'Hanken Grotesk'", color: '#555', marginTop: '2px' }}>{c.participants} aktive Läufer</div>
              </div>
              <span style={{ font: "500 11px 'Space Grotesk'", color: '#555', border: '1px solid #2A2A2A', borderRadius: '20px', padding: '4px 10px' }}>Beitreten</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
