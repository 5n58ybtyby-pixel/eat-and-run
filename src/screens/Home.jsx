import { useState, useRef, useEffect } from 'react'
import Logo from '../components/Logo'
import { store } from '../store'

const LIME = '#B6F23E'
const TOTAL_TIME = 31 * 60

const ROUTE_D = 'M 70,220 L 70,148 L 138,148 L 138,82 L 202,82 L 202,115 L 282,115 L 282,178 L 202,178 L 202,220 L 138,220 L 70,220'

// ─── MUNICH MAP ───────────────────────────────────────────────────────────────

function MunichMap({ elapsed = 0 }) {
  const pathRef = useRef(null)
  const [pathLen, setPathLen] = useState(900)

  useEffect(() => {
    if (pathRef.current) setPathLen(pathRef.current.getTotalLength())
  }, [])

  const progress = Math.min(elapsed / TOTAL_TIME, 1)
  const filled = progress * pathLen

  let dotX = 70, dotY = 220
  if (pathRef.current && filled > 0) {
    try {
      const pt = pathRef.current.getPointAtLength(Math.min(filled, pathLen - 1))
      dotX = pt.x; dotY = pt.y
    } catch (e) {}
  }

  return (
    <svg viewBox="0 0 390 260" style={{ width: '100%', display: 'block' }}>
      {/* Dark city background */}
      <rect width="390" height="260" fill="#050A07"/>

      {/* City block fills */}
      {[[0,0,68,260],[142,0,58,78],[0,0,390,78]].map(([x,y,w,h],i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill="#060C08"/>
      ))}

      {/* Minor streets (neighborhood grid) */}
      {[32, 100, 170, 244, 322, 360].map(x => (
        <line key={`mv${x}`} x1={x} y1="0" x2={x} y2="260" stroke="#07100A" strokeWidth="2"/>
      ))}
      {[35, 55, 98, 132, 163, 196, 232, 250].map(y => (
        <line key={`mh${y}`} x1="0" y1={y} x2="390" y2={y} stroke="#07100A" strokeWidth="2"/>
      ))}

      {/* Major streets (route streets) */}
      <line x1="70" y1="0" x2="70" y2="260" stroke="#0E1C0E" strokeWidth="5"/>
      <line x1="138" y1="0" x2="138" y2="260" stroke="#0E1C0E" strokeWidth="5"/>
      <line x1="202" y1="0" x2="202" y2="260" stroke="#0E1C0E" strokeWidth="5"/>
      <line x1="282" y1="0" x2="282" y2="260" stroke="#0E1C0E" strokeWidth="5"/>
      <line x1="0" y1="82" x2="390" y2="82" stroke="#0E1C0E" strokeWidth="5"/>
      <line x1="0" y1="115" x2="390" y2="115" stroke="#0E1C0E" strokeWidth="5"/>
      <line x1="0" y1="148" x2="390" y2="148" stroke="#0E1C0E" strokeWidth="5"/>
      <line x1="0" y1="178" x2="390" y2="178" stroke="#0E1C0E" strokeWidth="5"/>
      <line x1="0" y1="220" x2="390" y2="220" stroke="#0E1C0E" strokeWidth="5"/>

      {/* Area label */}
      <text x="84" y="26" fill="#132013" fontSize="8" fontFamily="Hanken Grotesk" fontWeight="600">Englischer Garten · München</text>

      {/* Planned route (dim) */}
      <path d={ROUTE_D} fill="none" stroke="rgba(182,242,62,0.06)" strokeWidth="4"
        strokeLinecap="square" strokeLinejoin="miter"/>

      {/* Filled route - glow layers */}
      <path d={ROUTE_D} fill="none" stroke={LIME} strokeWidth="16" strokeOpacity="0.07"
        strokeLinecap="square" strokeLinejoin="miter"
        strokeDasharray={pathLen} strokeDashoffset={pathLen - filled}
        style={{ transition: 'stroke-dashoffset 1s linear' }}/>
      <path d={ROUTE_D} fill="none" stroke={LIME} strokeWidth="7" strokeOpacity="0.2"
        strokeLinecap="square" strokeLinejoin="miter"
        strokeDasharray={pathLen} strokeDashoffset={pathLen - filled}
        style={{ transition: 'stroke-dashoffset 1s linear' }}/>
      <path ref={pathRef} d={ROUTE_D} fill="none" stroke={LIME} strokeWidth="3"
        strokeLinecap="square" strokeLinejoin="miter"
        strokeDasharray={pathLen} strokeDashoffset={pathLen - filled}
        style={{ transition: 'stroke-dashoffset 1s linear' }}/>

      {/* km markers */}
      <circle cx="138" cy="148" r="3.5" fill={LIME} opacity="0.5"/>
      <text x="143" y="145" fill={LIME} fontSize="7.5" fontFamily="Space Grotesk" opacity="0.5">1 km</text>
      <circle cx="202" cy="82" r="3.5" fill={LIME} opacity="0.5"/>
      <text x="207" y="79" fill={LIME} fontSize="7.5" fontFamily="Space Grotesk" opacity="0.5">2,5 km</text>

      {/* Start dot */}
      <circle cx="70" cy="220" r="8" fill="rgba(182,242,62,0.15)"/>
      <circle cx="70" cy="220" r="4.5" fill={LIME}/>
      <text x="75" y="238" fill={LIME} fontSize="7" fontFamily="Space Grotesk" opacity="0.5">START</text>

      {/* GPS dot */}
      {elapsed > 0 && (
        <>
          <circle cx={dotX} cy={dotY} r="18" fill="rgba(182,242,62,0.08)">
            <animate attributeName="r" values="14;22;14" dur="1.6s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite"/>
          </circle>
          <circle cx={dotX} cy={dotY} r="7" fill={LIME}/>
          <circle cx={dotX} cy={dotY} r="3.5" fill="#000"/>
        </>
      )}
    </svg>
  )
}

// ─── WORKOUT OVERLAY ──────────────────────────────────────────────────────────

function WorkoutOverlay({ onClose, navigate }) {
  const [phase, setPhase] = useState('countdown')
  const [count, setCount] = useState(5)
  const [animKey, setAnimKey] = useState(0)
  const [elapsed, setElapsed] = useState(0)

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
  const dist = ((elapsed / TOTAL_TIME) * 5)

  useEffect(() => {
    if (phase !== 'countdown') return
    let c = 5
    const t = setInterval(() => {
      c -= 1; setCount(c); setAnimKey(k => k + 1)
      if (c <= 0) { clearInterval(t); setTimeout(() => setPhase('running'), 600) }
    }, 1000)
    return () => clearInterval(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'running') return
    const t = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(t)
  }, [phase])

  const handleEnd = () => setPhase('done')

  const handleShare = () => {
    store.workoutPost = {
      id: 99, user: 'Patrick', avatar: 'PA', time: 'gerade eben',
      type: 'run', title: '5km Zone 2',
      distance: '5,0 km',
      pace: '6:12 /km', duration: '31:00',
      kudos: 0, myKudos: false, hasMap: true, isNew: true
    }
    navigate('community')
    onClose()
  }

  const R = 100, C = 2 * Math.PI * R
  const fill = (5 - count) / 5
  const dashOffset = C * (1 - fill)
  const base = { position: 'fixed', inset: 0, background: '#000', zIndex: 300 }

  // ── Countdown ──
  if (phase === 'countdown') return (
    <div style={{ ...base, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(182,242,62,0.08), transparent 70%)', pointerEvents: 'none' }}/>
      <button onClick={onClose} style={{ position: 'absolute', top: 56, right: 20, width: 42, height: 42, background: '#111', border: '1px solid #222', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#7A7A7A" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <div style={{ font: "700 11px 'Space Mono'", letterSpacing: '3px', color: '#5A5A5A', marginBottom: 48 }}>WORKOUT STARTET IN</div>
      <div style={{ position: 'relative', width: 240, height: 240 }}>
        <svg viewBox="0 0 240 240" width="240" height="240" style={{ position: 'absolute', inset: 0 }}>
          <circle cx="120" cy="120" r={R} fill="none" stroke="#111" strokeWidth="8"/>
          <circle cx="120" cy="120" r={R} fill="none" stroke={LIME} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={dashOffset} transform="rotate(-90 120 120)"
            style={{ transition: 'stroke-dashoffset 0.85s cubic-bezier(0.4,0,0.2,1)' }}/>
        </svg>
        <div key={animKey} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', font: "700 96px 'Space Grotesk'", color: count <= 1 ? LIME : '#fff', letterSpacing: '-4px', animation: 'countPop 0.3s cubic-bezier(0.34,1.56,0.64,1)', transition: 'color 0.3s' }}>
          {count}
        </div>
      </div>
      <div style={{ marginTop: 48, textAlign: 'center' }}>
        <div style={{ font: "700 22px 'Space Grotesk'", letterSpacing: '-0.3px' }}>5km Zone 2</div>
        <div style={{ font: "400 14px 'Hanken Grotesk'", color: '#6A6A6A', marginTop: 6 }}>Lockeres Gesprächstempo · ~31 Min</div>
      </div>
      <button onClick={onClose} style={{ position: 'absolute', bottom: 48, background: 'transparent', color: '#4A4A4A', border: '1px solid #222', borderRadius: 14, padding: '14px 40px', font: "500 14px 'Hanken Grotesk'", cursor: 'pointer' }}>Abbrechen</button>
    </div>
  )

  // ── Done ──
  if (phase === 'done') return (
    <div style={{ ...base, overflowY: 'auto' }}>
      <div style={{ padding: '60px 20px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>🎉</div>
          <div style={{ font: "700 24px 'Space Grotesk'", letterSpacing: '-0.4px', marginBottom: 4 }}>Training beendet!</div>
          <div style={{ font: "400 13px 'Hanken Grotesk'", color: '#666' }}>5km Zone 2 · Englischer Garten</div>
        </div>
        <div style={{ background: '#0D0D0D', border: '1px solid #1E1E1E', borderRadius: 20, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[['Distanz', '5,0 km'], ['Zeit', '31 min'], ['Tempo', '6:12 /km']].map(([l,v]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ font: "700 18px 'Space Grotesk'", color: LIME, letterSpacing: '-0.3px', lineHeight: 1.2 }}>{v}</div>
                <div style={{ font: "400 10px 'Hanken Grotesk'", color: '#555', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: '#040C06', border: '1px solid #0D1A0D', borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
          <MunichMap elapsed={TOTAL_TIME}/>
        </div>
        <button onClick={handleShare} style={{ width: '100%', padding: '16px', background: LIME, border: 'none', borderRadius: 14, font: "700 15px 'Space Grotesk'", color: '#000', cursor: 'pointer', marginBottom: 10 }}>
          In Community teilen →
        </button>
        <button onClick={onClose} style={{ width: '100%', padding: '14px', background: 'transparent', border: '1px solid #222', borderRadius: 14, font: "500 14px 'Hanken Grotesk'", color: '#666', cursor: 'pointer' }}>
          Ohne Teilen schließen
        </button>
      </div>
    </div>
  )

  // ── Running ──
  return (
    <div style={{ ...base, display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <MunichMap elapsed={elapsed} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 50, background: 'linear-gradient(transparent,#000)', pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(182,242,62,0.3)', borderRadius: 20, padding: '5px 10px' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: LIME, animation: 'pulse-glow 1.4s ease-in-out infinite' }}/>
          <span style={{ font: "700 9px 'Space Mono'", color: LIME, letterSpacing: '1px' }}>LIVE GPS</span>
        </div>
      </div>
      <div style={{ flex: 1, padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ font: "700 10px 'Space Mono'", letterSpacing: '2px', color: '#4A4A4A' }}>5 KM ZONE 2</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: '#0D0D0D', border: '1px solid #1E1E1E', borderRadius: 16, padding: '14px', textAlign: 'center' }}>
            <div style={{ font: "700 34px 'Space Grotesk'", color: LIME, letterSpacing: '-1px', lineHeight: 1 }}>{fmt(elapsed)}</div>
            <div style={{ font: "400 10px 'Hanken Grotesk'", color: '#555', marginTop: 5 }}>Zeit</div>
          </div>
          <div style={{ background: '#0D0D0D', border: '1px solid #1E1E1E', borderRadius: 16, padding: '14px', textAlign: 'center' }}>
            <div style={{ font: "700 34px 'Space Grotesk'", color: '#fff', letterSpacing: '-1px', lineHeight: 1 }}>{dist.toFixed(2).replace('.',',')}</div>
            <div style={{ font: "400 10px 'Hanken Grotesk'", color: '#555', marginTop: 5 }}>km</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[['Tempo', '6:12 /km'], ['HF', '142 bpm'], ['kcal', '~185']].map(([l, v]) => (
            <div key={l} style={{ background: '#0D0D0D', border: '1px solid #181818', borderRadius: 12, padding: '10px 6px', textAlign: 'center' }}>
              <div style={{ font: "600 12px 'Space Grotesk'", color: '#fff' }}>{v}</div>
              <div style={{ font: "400 10px 'Hanken Grotesk'", color: '#555', marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>
        <button onClick={handleEnd} style={{ width: '100%', padding: '15px', background: 'rgba(242,85,90,0.1)', border: '1px solid rgba(242,85,90,0.3)', borderRadius: 14, font: "700 14px 'Hanken Grotesk'", color: '#F2555A', cursor: 'pointer', marginTop: 'auto' }}>
          Training beenden
        </button>
      </div>
    </div>
  )
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────

function StatCard({ label, value, unit, color }) {
  return (
    <div style={{ flex: 1, background: '#111', border: '1px solid #1E1E1E', borderRadius: 16, padding: '14px 12px', textAlign: 'center' }}>
      <div style={{ font: "400 11px 'Hanken Grotesk'", color: '#6A6A6A', marginBottom: 6 }}>{label}</div>
      <div style={{ font: "700 22px 'Space Grotesk'", color: color || '#fff', letterSpacing: '-0.5px', lineHeight: 1 }}>{value}</div>
      <div style={{ font: "400 11px 'Hanken Grotesk'", color: '#555', marginTop: 3 }}>{unit}</div>
    </div>
  )
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────

export default function Home({ navigate }) {
  const [showWorkout, setShowWorkout] = useState(false)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Guten Morgen' : hour < 17 ? 'Guten Tag' : 'Guten Abend'

  const upcoming = [
    { day: 'Di', date: '01.07', type: 'Easy Run',        detail: '7 km · Lockeres Tempo',    color: 'rgba(90,169,240,.14)', dot: '#5AA9F0' },
    { day: 'Mi', date: '02.07', type: 'Ruhetag',         detail: 'Erholung & Dehnen',         color: 'rgba(255,255,255,.04)', dot: '#3A3A3A' },
    { day: 'Do', date: '03.07', type: 'Tempo',           detail: '3 km @ Renntempo',          color: 'rgba(182,242,62,.12)', dot: LIME },
  ]

  return (
    <div style={{ padding: '0 0 8px' }}>
      {showWorkout && <WorkoutOverlay onClose={() => setShowWorkout(false)} navigate={navigate}/>}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '56px 20px 16px' }}>
        <Logo />
        <button style={{ width: 40, height: 40, background: '#111', border: '1px solid #1E1E1E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#A0A0A0" strokeWidth="1.8" strokeLinecap="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <div style={{ position: 'absolute', top: 7, right: 7, width: 8, height: 8, background: LIME, borderRadius: '50%', border: '2px solid #000' }}/>
        </button>
      </div>

      {/* Greeting */}
      <div style={{ padding: '4px 20px 20px' }}>
        <div style={{ font: "700 26px 'Space Grotesk'", letterSpacing: '-0.6px', lineHeight: 1.2 }}>{greeting}, Max! 👋</div>
        <div style={{ marginTop: 8, background: 'rgba(182,242,62,.07)', border: '1px solid rgba(182,242,62,.15)', borderRadius: 12, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <svg viewBox="0 0 12 12" width="15" height="15" fill={LIME} style={{ marginTop: 1, flexShrink: 0 }}><path d="M7 1L2 7h3.5L4 11l6-6.5H6.5z"/></svg>
          <div style={{ font: "400 13.5px 'Hanken Grotesk'", color: '#B8B8B8', lineHeight: 1.5 }}>
            Erholung bei <span style={{ color: LIME, fontWeight: 600 }}>92 %</span> — perfekter Tag für dein 5km Zone 2 Training!
          </div>
        </div>
      </div>

      {/* Today's Workout Card */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ font: "700 11px 'Space Mono'", letterSpacing: '2px', color: '#5A5A5A', marginBottom: 12 }}>HEUTIGES WORKOUT</div>
        <div style={{ background: '#0F0F0F', border: '1px solid #222', borderRadius: 22, padding: 22, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, background: 'radial-gradient(circle, rgba(182,242,62,.1), transparent 70%)', pointerEvents: 'none' }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(90,169,240,.12)', border: '1px solid rgba(90,169,240,.2)', borderRadius: 999, padding: '4px 10px', font: "600 11px 'Hanken Grotesk'", color: '#5AA9F0', marginBottom: 12 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#5AA9F0' }}/>
                Zone 2 · Niedrig intensiv
              </div>
              <div style={{ font: "700 30px 'Space Grotesk'", letterSpacing: '-0.5px' }}>5km Zone 2</div>
              <div style={{ font: "600 17px 'Hanken Grotesk'", color: '#C8C8C8', marginTop: 3 }}>Lockeres Gesprächstempo</div>
            </div>
            <div style={{ width: 56, height: 56, border: '2px solid rgba(182,242,62,.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={LIME} strokeWidth="1.8" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20, margin: '20px 0', paddingTop: 18, borderTop: '1px solid #222' }}>
            {[['Dauer', '~31 Min'], ['Distanz', '5 km'], ['Tempo', '6:12/km']].map(([label, val]) => (
              <div key={label}>
                <div style={{ font: "400 11px 'Hanken Grotesk'", color: '#6A6A6A' }}>{label}</div>
                <div style={{ font: "600 15px 'Hanken Grotesk'", marginTop: 3 }}>{val}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowWorkout(true)}
            style={{ width: '100%', background: LIME, color: '#07090A', border: 'none', borderRadius: 999, padding: 15, font: "600 15px 'Hanken Grotesk'", cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, animation: 'pulse-glow 2.5s ease-in-out infinite' }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="#07090A"><polygon points="5,3 19,12 5,21"/></svg>
            Workout starten
          </button>
        </div>
      </div>

      {/* Weekly Stats */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ font: "700 11px 'Space Mono'", letterSpacing: '2px', color: '#5A5A5A', marginBottom: 12 }}>DIESE WOCHE</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <StatCard label="Distanz" value="28,4" unit="km" color={LIME}/>
          <StatCard label="Streak" value="12" unit="Tage" color="#F5A524"/>
          <StatCard label="Verbrannt" value="1.840" unit="kcal" color="#9B8CFA"/>
        </div>
      </div>

      {/* Upcoming workouts */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ font: "700 11px 'Space Mono'", letterSpacing: '2px', color: '#5A5A5A' }}>NÄCHSTE EINHEITEN</div>
          <button onClick={() => navigate('training')} style={{ background: 'none', border: 'none', font: "600 12px 'Hanken Grotesk'", color: LIME, cursor: 'pointer' }}>Alle anzeigen →</button>
        </div>
        <div style={{ background: '#0D0D0D', border: '1px solid #1E1E1E', borderRadius: 18, overflow: 'hidden' }}>
          {upcoming.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderBottom: i < upcoming.length - 1 ? '1px solid #171717' : 'none' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: item.color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ font: "700 11px 'Space Grotesk'", color: item.dot }}>{item.day}</div>
                <div style={{ font: "400 10px 'Hanken Grotesk'", color: item.dot, opacity: 0.8 }}>{item.date.split('.').slice(0,2).join('.')}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ font: "600 14px 'Hanken Grotesk'" }}>{item.type}</div>
                <div style={{ font: "400 12px 'Hanken Grotesk'", color: '#6A6A6A', marginTop: 2 }}>{item.detail}</div>
              </div>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#3A3A3A" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </div>
          ))}
        </div>
      </div>

      {/* Nutrition Snapshot */}
      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ font: "700 11px 'Space Mono'", letterSpacing: '2px', color: '#5A5A5A' }}>ERNÄHRUNG HEUTE</div>
          <button onClick={() => navigate('nutrition')} style={{ background: 'none', border: 'none', font: "600 12px 'Hanken Grotesk'", color: LIME, cursor: 'pointer' }}>Details →</button>
        </div>
        <div style={{ background: '#0D0D0D', border: '1px solid #1E1E1E', borderRadius: 18, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div style={{ font: "700 24px 'Space Grotesk'", letterSpacing: '-0.5px' }}>1.205 <span style={{ font: "400 14px 'Hanken Grotesk'", color: '#6A6A6A' }}>/ 2.200 kcal</span></div>
              <div style={{ font: "400 12px 'Hanken Grotesk'", color: '#6A6A6A', marginTop: 2 }}>995 kcal noch verfügbar</div>
            </div>
            <div style={{ width: 52, height: 52, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 52 52" width="52" height="52">
                <circle cx="26" cy="26" r="22" fill="none" stroke="#1A1A1A" strokeWidth="5"/>
                <circle cx="26" cy="26" r="22" fill="none" stroke={LIME} strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={2*Math.PI*22} strokeDashoffset={2*Math.PI*22*(1-0.548)} transform="rotate(-90 26 26)"/>
              </svg>
              <div style={{ position: 'absolute', font: "700 11px 'Space Grotesk'", color: LIME }}>55%</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[['Protein', '68', 'g'], ['Kohlenhydrate', '142', 'g'], ['Fett', '38', 'g']].map(([n, v, u]) => (
              <div key={n} style={{ background: '#151515', borderRadius: 10, padding: '8px 10px' }}>
                <div style={{ font: "400 10px 'Hanken Grotesk'", color: '#5A5A5A' }}>{n}</div>
                <div style={{ font: "700 15px 'Space Grotesk'", marginTop: 2 }}>{v}<span style={{ font: "400 10px 'Hanken Grotesk'", color: '#5A5A5A' }}> {u}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
