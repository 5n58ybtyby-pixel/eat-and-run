import { useState, useEffect } from 'react'
import { store } from '../store'

const LIME = '#B6F23E'

const PLAN_STEPS = [
  'Analysiere dein Laufprofil…',
  'Berechne optimale Intensitätszonen…',
  'Plane Progression & Regenerationsphasen…',
  'Erstelle deinen persönlichen 8-Wochen-Plan…'
]

const intensityColors = {
  high: { bg: 'rgba(242,85,90,.12)', color: '#F2555A', dot: '#F2555A' },
  med:  { bg: 'rgba(182,242,62,.1)',  color: LIME,      dot: LIME },
  low:  { bg: 'rgba(90,169,240,.1)', color: '#5AA9F0', dot: '#5AA9F0' },
  rest: { bg: 'rgba(255,255,255,.04)', color: '#4A4A4A', dot: '#2E2E2E' }
}

const WEEK_DAYS = [
  { day: 'Mo', type: '5km Zone 2',      detail: '5 km lockeres Tempo',    intensity: 'low',  km: '5,0' },
  { day: 'Di', type: 'Easy Run',        detail: 'Lockeres Tempo',         intensity: 'low',  km: '7,0' },
  { day: 'Mi', type: 'Ruhe',            detail: 'Dehnen & Mobili.',       intensity: 'rest', km: '—'   },
  { day: 'Do', type: 'Tempo',           detail: '3 km @ Renntempo',       intensity: 'med',  km: '6,0' },
  { day: 'Fr', type: 'Gesprächstempo',  detail: '5 km lockeres Tempo',    intensity: 'low',  km: '5,0' },
  { day: 'Sa', type: 'Langer Lauf',    detail: 'Aerobe Basis',           intensity: 'med',  km: '14,0'},
  { day: 'So', type: 'Ruhe',           detail: 'Ruhetag',                intensity: 'rest', km: '—'   },
]

const weekData  = [
  { label:'Mo', value:8.2  },{ label:'Di', value:10.0 },{ label:'Mi', value:0   },
  { label:'Do', value:6.0  },{ label:'Fr', value:0, today:true },{ label:'Sa', value:0 },{ label:'So', value:0 },
]
const monthData = [
  { label:'KW21', value:32 },{ label:'KW22', value:38 },
  { label:'KW23', value:35 },{ label:'KW24', value:28, today:true },
]
const zones = [
  { name:'Easy',   color:'#5AA9F0', pct:42 },
  { name:'Aerob',  color:LIME,      pct:30 },
  { name:'Tempo',  color:'#F5A524', pct:18 },
  { name:'VO₂max', color:'#F2555A', pct:10 },
]
const RIC = { fill:'none', stroke:'#7A7A7A', strokeWidth:'1.5', strokeLinecap:'round', strokeLinejoin:'round' }
const records = [
  { label:'Längster Lauf',      value:'14,0 km', icon:<svg viewBox="0 0 20 20" width="17" height="17" {...RIC}><path d="M3 15C5 11 7 13 9 10C11 7 13 9 17 6"/><circle cx="3" cy="15" r="1.5" fill="#7A7A7A" stroke="none"/><circle cx="17" cy="6" r="1.5" fill="#7A7A7A" stroke="none"/></svg> },
  { label:'Bestes 5-km-Tempo',  value:'28:12',   icon:<svg viewBox="0 0 20 20" width="17" height="17" {...RIC}><polygon points="8,2 2,10 8,10 7,18 16,8 10,8" fill="#7A7A7A" stroke="none"/></svg> },
  { label:'Bestes 10-km-Tempo', value:'58:40',   icon:<svg viewBox="0 0 20 20" width="17" height="17" {...RIC}><circle cx="12" cy="4" r="2"/><path d="M10 7L12 6L14 9M10 7L8.5 12M12 9L11 13.5M8.5 12L7 15M12 9L14.5 11.5"/></svg> },
  { label:'Monatsdistanz',      value:'112 km',  icon:<svg viewBox="0 0 20 20" width="17" height="17" {...RIC}><rect x="2" y="4" width="16" height="13" rx="2"/><line x1="2" y1="8.5" x2="18" y2="8.5"/><line x1="6.5" y1="2" x2="6.5" y2="6"/><line x1="13.5" y1="2" x2="13.5" y2="6"/><circle cx="7" cy="12" r="1" fill="#7A7A7A" stroke="none"/><circle cx="10" cy="12" r="1" fill="#7A7A7A" stroke="none"/><circle cx="13" cy="12" r="1" fill="#7A7A7A" stroke="none"/></svg> },
]

// ─── MUNICH MAP SVG ───────────────────────────────────────────────────────────

function MunichMap({ running = false, mini = false }) {
  const h = mini ? 130 : 260
  const routeD = 'M 82,232 L 82,192 Q 82,165 98,145 L 122,120 Q 155,92 200,82 Q 245,74 278,88 L 305,112 Q 322,138 312,175 L 294,205 Q 270,228 228,242 L 172,250 Q 128,252 100,246 Z'
  return (
    <svg viewBox={`0 0 390 ${h}`} style={{ width:'100%', display:'block' }}>
      <rect width="390" height={h} fill="#040C06"/>
      {/* Park fill */}
      <ellipse cx="195" cy={h * 0.48} rx="175" ry={h * 0.42} fill="#060E08"/>
      {/* Isar river right edge */}
      <path d={`M 355,0 Q 375,${h*0.3} 365,${h*0.6} Q 355,${h*0.85} 360,${h} L 390,${h} L 390,0 Z`}
        fill="rgba(30,60,160,0.18)"/>
      {/* Streets */}
      <line x1="0" y1={h - 20} x2="390" y2={h - 20} stroke="#0E1C0E" strokeWidth="7"/>
      <line x1="0" y1={h - 20} x2="390" y2={h - 20} stroke="#141E14" strokeWidth="2"/>
      <line x1="80" y1="0" x2="80" y2={h} stroke="#0B160B" strokeWidth="4"/>
      <line x1="310" y1="0" x2="310" y2={h} stroke="#0B160B" strokeWidth="4"/>
      <line x1="0" y1={h * 0.38} x2="390" y2={h * 0.38} stroke="#0A140A" strokeWidth="3"/>
      {/* Street labels */}
      {!mini && <text x="18" y={h - 7} fill="#1C2E1C" fontSize="7" fontFamily="Hanken Grotesk">Prinzregentenstraße</text>}
      {!mini && <text x="135" y={h * 0.55} fill="#122012" fontSize="9" fontFamily="Hanken Grotesk" fontWeight="600">Englischer Garten</text>}
      {/* Chinese Tower marker */}
      {!mini && (
        <>
          <polygon points="196,74 202,74 199,68" fill="rgba(255,255,255,0.07)"/>
          <rect x="197" y="74" width="4" height="7" fill="rgba(255,255,255,0.05)"/>
        </>
      )}

      {/* Route glow layers */}
      <path d={routeD} fill="none" stroke={LIME} strokeWidth="14" strokeOpacity="0.07" strokeLinecap="round" strokeLinejoin="round"/>
      <path d={routeD} fill="none" stroke={LIME} strokeWidth="6" strokeOpacity="0.18" strokeLinecap="round" strokeLinejoin="round"/>
      <path d={routeD} fill="none" stroke={LIME} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>

      {/* km markers */}
      {!mini && (
        <>
          <circle cx="122" cy="120" r="3" fill={LIME} opacity="0.5"/>
          <text x="128" y="118" fill={LIME} fontSize="7" fontFamily="Space Grotesk" opacity="0.5">1 km</text>
          <circle cx="278" cy="88" r="3" fill={LIME} opacity="0.5"/>
          <text x="284" y="86" fill={LIME} fontSize="7" fontFamily="Space Grotesk" opacity="0.5">2,5 km</text>
        </>
      )}

      {/* Start/end dot */}
      <circle cx="82" cy="232" r={mini ? 5 : 8} fill="rgba(182,242,62,0.2)"/>
      <circle cx="82" cy="232" r={mini ? 3 : 4.5} fill={LIME}/>

      {/* Running position indicator */}
      {running && (
        <>
          <circle cx="296" cy="202" r="18" fill="rgba(182,242,62,0.1)">
            <animate attributeName="r" values="14;22;14" dur="1.6s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite"/>
          </circle>
          <circle cx="296" cy="202" r="7" fill={LIME}/>
          <circle cx="296" cy="202" r="3.5" fill="#000"/>
        </>
      )}
    </svg>
  )
}

// ─── PLAN WIZARD ─────────────────────────────────────────────────────────────

function PlanWizard({ onComplete, onCancel }) {
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState(null)
  const [times, setTimes] = useState({ km5: '', km10: '', hm: '' })
  const [perWeek, setPerWeek] = useState(null)
  const [days, setDays] = useState([])

  const goals = [
    { id: 'event',    emoji: '🏆', label: 'Ich habe ein Laufevent',  desc: 'Marathon, HM oder 10-km-Rennen' },
    { id: 'beginner', emoji: '🏃', label: 'Ich bin Einsteiger',      desc: 'Ich starte neu oder nach einer Pause' },
    { id: 'faster',   emoji: '⚡', label: 'Ich will schneller werden', desc: 'Mein Tempo und meine Ausdauer verbessern' },
  ]
  const weekdays = ['Mo','Di','Mi','Do','Fr','Sa','So']
  const toggleDay = d => setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])

  const overlay = {
    position:'fixed', inset:0, background:'rgba(0,0,0,0.97)', zIndex:300,
    display:'flex', flexDirection:'column', padding:'0 20px', overflowY:'auto'
  }

  return (
    <div style={overlay}>
      <div style={{ padding:'58px 0 18px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ font:"700 18px 'Space Grotesk'", letterSpacing:'-0.3px' }}>KI-Plan erstellen</div>
        <button onClick={onCancel} style={{ background:'#1A1A1A', border:'1px solid #2A2A2A', borderRadius:'50%', width:36, height:36, color:'#888', cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
      </div>

      {/* Progress bar */}
      <div style={{ display:'flex', gap:6, marginBottom:28 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ height:3, flex:1, borderRadius:2, background: i <= step ? LIME : '#1E1E1E', transition:'background .3s' }}/>
        ))}
      </div>

      {/* Step 1 — Goal */}
      {step === 0 && (
        <div style={{ animation:'fadeIn .25s ease' }}>
          <div style={{ font:"500 13px 'Hanken Grotesk'", color:'#555', marginBottom:6 }}>Schritt 1 von 4</div>
          <div style={{ font:"700 22px 'Space Grotesk'", letterSpacing:'-0.4px', marginBottom:4 }}>Was ist dein Ziel?</div>
          <div style={{ font:"400 14px 'Hanken Grotesk'", color:'#666', marginBottom:24 }}>Die KI passt deinen Plan genau darauf an.</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {goals.map(g => (
              <button key={g.id} onClick={() => { setGoal(g.id); setStep(1) }} style={{
                background: goal===g.id ? 'rgba(182,242,62,0.09)' : '#0E0E0E',
                border:`1px solid ${goal===g.id ? 'rgba(182,242,62,0.4)' : '#1E1E1E'}`,
                borderRadius:14, padding:'16px', textAlign:'left', cursor:'pointer',
                display:'flex', alignItems:'center', gap:14, transition:'all .15s'
              }}>
                <span style={{ fontSize:28 }}>{g.emoji}</span>
                <div>
                  <div style={{ font:"600 15px 'Space Grotesk'", color:'#fff', marginBottom:2 }}>{g.label}</div>
                  <div style={{ font:"400 12px 'Hanken Grotesk'", color:'#666' }}>{g.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 — Times */}
      {step === 1 && (
        <div style={{ animation:'fadeIn .25s ease' }}>
          <div style={{ font:"500 13px 'Hanken Grotesk'", color:'#555', marginBottom:6 }}>Schritt 2 von 4</div>
          <div style={{ font:"700 22px 'Space Grotesk'", letterSpacing:'-0.4px', marginBottom:4 }}>Wie schnell bist du?</div>
          <div style={{ font:"400 14px 'Hanken Grotesk'", color:'#666', marginBottom:24 }}>Lass ein Feld leer wenn du diese Distanz noch nicht gelaufen bist.</div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {[
              { key:'km5',  label:'5 km',         placeholder:'z.B. 28:30' },
              { key:'km10', label:'10 km',        placeholder:'z.B. 58:00' },
              { key:'hm',   label:'Halbmarathon', placeholder:'z.B. 2:05:00' },
            ].map(f => (
              <div key={f.key}>
                <div style={{ font:"600 12px 'Hanken Grotesk'", color:'#888', marginBottom:6 }}>{f.label}</div>
                <input value={times[f.key]} onChange={e => setTimes(t => ({...t, [f.key]: e.target.value}))}
                  placeholder={f.placeholder} style={{
                    width:'100%', background:'#0E0E0E', border:'1px solid #222',
                    borderRadius:12, padding:'13px 16px', font:"600 16px 'Space Grotesk'",
                    color:'#fff', outline:'none', boxSizing:'border-box'
                  }}/>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:10, marginTop:28 }}>
            <button onClick={() => setStep(0)} style={{ flex:1, padding:'14px', background:'#111', border:'1px solid #222', borderRadius:12, font:"600 14px 'Hanken Grotesk'", color:'#888', cursor:'pointer' }}>Zurück</button>
            <button onClick={() => setStep(2)} style={{ flex:2, padding:'14px', background:LIME, border:'none', borderRadius:12, font:"700 14px 'Hanken Grotesk'", color:'#000', cursor:'pointer' }}>Weiter →</button>
          </div>
        </div>
      )}

      {/* Step 3 — Per week */}
      {step === 2 && (
        <div style={{ animation:'fadeIn .25s ease' }}>
          <div style={{ font:"500 13px 'Hanken Grotesk'", color:'#555', marginBottom:6 }}>Schritt 3 von 4</div>
          <div style={{ font:"700 22px 'Space Grotesk'", letterSpacing:'-0.4px', marginBottom:4 }}>Wie oft pro Woche?</div>
          <div style={{ font:"400 14px 'Hanken Grotesk'", color:'#666', marginBottom:24 }}>Wähle eine realistische Zahl — Qualität vor Quantität.</div>
          <div style={{ display:'flex', gap:8 }}>
            {[2,3,4,5,6].map(n => (
              <button key={n} onClick={() => { setPerWeek(n); setStep(3) }} style={{
                flex:1, padding:'18px 6px', background: perWeek===n ? 'rgba(182,242,62,0.1)' : '#0E0E0E',
                border:`1px solid ${perWeek===n ? 'rgba(182,242,62,0.4)' : '#1E1E1E'}`,
                borderRadius:14, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:4, transition:'all .15s'
              }}>
                <span style={{ font:"800 22px 'Space Grotesk'", color: perWeek===n ? LIME : '#fff' }}>{n}×</span>
                <span style={{ font:"400 10px 'Hanken Grotesk'", color:'#555' }}>/ Woche</span>
              </button>
            ))}
          </div>
          <button onClick={() => setStep(1)} style={{ width:'100%', marginTop:24, padding:'14px', background:'#111', border:'1px solid #222', borderRadius:12, font:"600 14px 'Hanken Grotesk'", color:'#888', cursor:'pointer' }}>Zurück</button>
        </div>
      )}

      {/* Step 4 — Days */}
      {step === 3 && (
        <div style={{ animation:'fadeIn .25s ease' }}>
          <div style={{ font:"500 13px 'Hanken Grotesk'", color:'#555', marginBottom:6 }}>Schritt 4 von 4</div>
          <div style={{ font:"700 22px 'Space Grotesk'", letterSpacing:'-0.4px', marginBottom:4 }}>An welchen Tagen?</div>
          <div style={{ font:"400 14px 'Hanken Grotesk'", color:'#666', marginBottom:24 }}>
            Mindestens {perWeek} Tage auswählen.
          </div>
          <div style={{ display:'flex', gap:7 }}>
            {weekdays.map(d => {
              const sel = days.includes(d)
              return (
                <button key={d} onClick={() => toggleDay(d)} style={{
                  flex:1, padding:'16px 2px', background: sel ? 'rgba(182,242,62,0.12)' : '#0E0E0E',
                  border:`1px solid ${sel ? 'rgba(182,242,62,0.4)' : '#1E1E1E'}`,
                  borderRadius:12, cursor:'pointer', font:`700 13px 'Space Grotesk'`, color: sel ? LIME : '#555', transition:'all .15s'
                }}>{d}</button>
              )
            })}
          </div>
          <div style={{ display:'flex', gap:10, marginTop:28 }}>
            <button onClick={() => setStep(2)} style={{ flex:1, padding:'14px', background:'#111', border:'1px solid #222', borderRadius:12, font:"600 14px 'Hanken Grotesk'", color:'#888', cursor:'pointer' }}>Zurück</button>
            <button onClick={onComplete} disabled={days.length < (perWeek || 2)} style={{
              flex:2, padding:'14px', border:'none', borderRadius:12, font:"700 14px 'Hanken Grotesk'", cursor: days.length >= (perWeek||2) ? 'pointer' : 'not-allowed',
              background: days.length >= (perWeek||2) ? LIME : '#1A1A1A',
              color: days.length >= (perWeek||2) ? '#000' : '#444', transition:'all .2s'
            }}>Plan erstellen ✓</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── WORKOUT VIEW ─────────────────────────────────────────────────────────────

function WorkoutView({ navigate, onClose }) {
  const [phase, setPhase] = useState('countdown')
  const [count, setCount] = useState(5)
  const [elapsed, setElapsed] = useState(0)
  const [dist, setDist] = useState(0)

  useEffect(() => {
    if (phase !== 'countdown') return
    const t = setTimeout(() => {
      if (count > 0) setCount(c => c - 1)
      else setPhase('running')
    }, 1000)
    return () => clearTimeout(t)
  }, [phase, count])

  useEffect(() => {
    if (phase !== 'running') return
    const t = setInterval(() => {
      setElapsed(e => e + 1)
      setDist(d => parseFloat(Math.min(5.0, d + 5.0 / (31 * 60)).toFixed(3)))
    }, 1000)
    return () => clearInterval(t)
  }, [phase])

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`

  const handlePost = () => {
    store.workoutPost = {
      id: 99, user: 'Du', avatar: 'MM', time: 'gerade eben',
      type: 'run', title: 'Gesprächstempo',
      distance: `${dist.toFixed(1).replace('.',',')} km`,
      pace: '6:12 /km', duration: fmt(Math.max(elapsed, 1)),
      kudos: 0, myKudos: false, hasMap: true, isNew: true
    }
    navigate('community')
  }

  const base = { position:'fixed', inset:0, background:'#000', zIndex:200 }

  // Countdown
  if (phase === 'countdown') return (
    <div style={{ ...base, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' }}>
      <div style={{ font:"800 96px 'Space Grotesk'", color:LIME, letterSpacing:'-4px', lineHeight:1, animation:'fadeIn .2s ease' }}>
        {count > 0 ? count : 'LOS!'}
      </div>
      <div style={{ font:"500 16px 'Hanken Grotesk'", color:'#666', marginTop:14 }}>
        {count > 0 ? '5 km Gesprächstempo · Bereit machen…' : 'Viel Erfolg! 💪'}
      </div>
    </div>
  )

  // Done
  if (phase === 'done') return (
    <div style={{ ...base, overflowY:'auto' }}>
      <div style={{ padding:'60px 20px 40px' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontSize:44, marginBottom:10 }}>🎉</div>
          <div style={{ font:"700 24px 'Space Grotesk'", letterSpacing:'-0.4px', marginBottom:4 }}>Training beendet!</div>
          <div style={{ font:"400 13px 'Hanken Grotesk'", color:'#666' }}>5 km Gesprächstempo</div>
        </div>

        {/* Stats */}
        <div style={{ background:'#0D0D0D', border:'1px solid #1E1E1E', borderRadius:20, padding:20, marginBottom:16 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
            {[['Distanz', `${dist.toFixed(1).replace('.',',')} km`], ['Zeit', fmt(elapsed)], ['Tempo', '6:12 /km']].map(([l,v]) => (
              <div key={l} style={{ textAlign:'center' }}>
                <div style={{ font:"700 18px 'Space Grotesk'", color:LIME, letterSpacing:'-0.3px', lineHeight:1.2 }}>{v}</div>
                <div style={{ font:"400 10px 'Hanken Grotesk'", color:'#555', marginTop:4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mini map */}
        <div style={{ background:'#040C06', border:'1px solid #0D1A0D', borderRadius:16, overflow:'hidden', marginBottom:16 }}>
          <MunichMap mini={false} running={false}/>
        </div>

        <button onClick={handlePost} style={{
          width:'100%', padding:'16px', background:LIME, border:'none',
          borderRadius:14, font:"700 15px 'Space Grotesk'", color:'#000', cursor:'pointer', marginBottom:10
        }}>
          In Community teilen →
        </button>
        <button onClick={onClose} style={{
          width:'100%', padding:'14px', background:'transparent', border:'1px solid #222',
          borderRadius:14, font:"500 14px 'Hanken Grotesk'", color:'#666', cursor:'pointer'
        }}>
          Ohne Teilen schließen
        </button>
      </div>
    </div>
  )

  // Running
  return (
    <div style={{ ...base, display:'flex', flexDirection:'column' }}>
      {/* Map */}
      <div style={{ position:'relative', flexShrink:0 }}>
        <MunichMap running={true}/>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:50, background:'linear-gradient(transparent,#000)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', top:14, right:14, display:'flex', alignItems:'center', gap:5, background:'rgba(0,0,0,0.75)', border:'1px solid rgba(182,242,62,0.3)', borderRadius:20, padding:'5px 10px' }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:LIME, animation:'pulse-dot 1.4s ease-in-out infinite' }}/>
          <span style={{ font:"700 9px 'Space Grotesk'", color:LIME, letterSpacing:'1px' }}>LIVE</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ flex:1, padding:'16px 20px 20px', display:'flex', flexDirection:'column', gap:12 }}>
        <div style={{ font:"700 10px 'Space Mono'", letterSpacing:'2px', color:'#4A4A4A' }}>5 KM GESPRÄCHSTEMPO</div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <div style={{ background:'#0D0D0D', border:'1px solid #1E1E1E', borderRadius:16, padding:'14px', textAlign:'center' }}>
            <div style={{ font:"700 34px 'Space Grotesk'", color:LIME, letterSpacing:'-1px', lineHeight:1 }}>{fmt(elapsed)}</div>
            <div style={{ font:"400 10px 'Hanken Grotesk'", color:'#555', marginTop:5 }}>Zeit</div>
          </div>
          <div style={{ background:'#0D0D0D', border:'1px solid #1E1E1E', borderRadius:16, padding:'14px', textAlign:'center' }}>
            <div style={{ font:"700 34px 'Space Grotesk'", color:'#fff', letterSpacing:'-1px', lineHeight:1 }}>{dist.toFixed(2).replace('.',',')}</div>
            <div style={{ font:"400 10px 'Hanken Grotesk'", color:'#555', marginTop:5 }}>km</div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
          {[['Tempo','6:12 /km'],['HF','142 bpm'],['Kalorien','~185 kcal']].map(([l,v]) => (
            <div key={l} style={{ background:'#0D0D0D', border:'1px solid #181818', borderRadius:12, padding:'10px 6px', textAlign:'center' }}>
              <div style={{ font:"600 12px 'Space Grotesk'", color:'#fff' }}>{v}</div>
              <div style={{ font:"400 10px 'Hanken Grotesk'", color:'#555', marginTop:3 }}>{l}</div>
            </div>
          ))}
        </div>

        <button onClick={() => setPhase('done')} style={{
          width:'100%', padding:'15px', background:'rgba(242,85,90,0.1)', border:'1px solid rgba(242,85,90,0.3)',
          borderRadius:14, font:"700 14px 'Hanken Grotesk'", color:'#F2555A', cursor:'pointer', marginTop:'auto'
        }}>
          Training beenden
        </button>
      </div>
    </div>
  )
}

// ─── PLAN VIEW ────────────────────────────────────────────────────────────────

function PlanView() {
  const [loading, setLoading]     = useState(false)
  const [planReady, setPlanReady] = useState(true)
  const [stepIndex, setStepIndex] = useState(0)
  const [selectedDay, setSelectedDay] = useState(4)
  const [wizardOpen, setWizardOpen]   = useState(false)

  const handleGenerate = () => {
    setWizardOpen(false)
    setLoading(true); setPlanReady(false); setStepIndex(0)
    let i = 0
    const tick = () => {
      if (i < PLAN_STEPS.length) { setStepIndex(i); i++; setTimeout(tick, 900) }
      else { setTimeout(() => { setLoading(false); setPlanReady(true) }, 400) }
    }
    tick()
  }

  return (
    <div>
      {wizardOpen && <PlanWizard onComplete={handleGenerate} onCancel={() => setWizardOpen(false)}/>}

      {/* Plan card */}
      {planReady && !loading && (
        <div style={{ marginBottom:16, animation:'fadeInUp .4s ease' }}>
          <div style={{ background:'#0F0F0F', border:'1px solid #1E1E1E', borderRadius:22, padding:20, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-30, right:-30, width:150, height:150, background:'radial-gradient(circle, rgba(182,242,62,.08), transparent 70%)', pointerEvents:'none' }}/>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <div style={{ display:'inline-flex', alignItems:'center', gap:5, background:'rgba(182,242,62,.12)', border:'1px solid rgba(182,242,62,.2)', borderRadius:999, padding:'4px 10px', font:"600 11px 'Hanken Grotesk'", color:LIME, marginBottom:10 }}>
                  <svg viewBox="0 0 12 12" width="10" height="10" fill="currentColor"><path d="M7 1L2 7h3.5L4 11l6-6.5H6.5z"/></svg> KI-generiert
                </div>
                <div style={{ font:"700 22px 'Space Grotesk'", letterSpacing:'-0.4px' }}>10 km in 8 Wochen</div>
                <div style={{ font:"600 14px 'Hanken Grotesk'", color:LIME, marginTop:3 }}>Ziel: Sub 55:00</div>
              </div>
              <div style={{ background:'rgba(182,242,62,.08)', border:'1px solid rgba(182,242,62,.15)', borderRadius:14, padding:'10px 14px', textAlign:'center' }}>
                <div style={{ font:"700 20px 'Space Grotesk'", color:LIME }}>3</div>
                <div style={{ font:"400 10px 'Hanken Grotesk'", color:'#6A6A6A' }}>von 8 Wo.</div>
              </div>
            </div>
            <div style={{ margin:'14px 0', padding:12, background:'#151515', borderRadius:12, font:"400 12.5px 'Hanken Grotesk'", color:'#8A8A8A' }}>
              📍 Aufbauphase · Woche 3 von 8
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ font:"400 12px 'Hanken Grotesk'", color:'#6A6A6A' }}>Gesamtfortschritt</span>
              <span style={{ font:"600 12px 'Hanken Grotesk'", color:LIME }}>37,5 %</span>
            </div>
            <div style={{ height:6, background:'#1E1E1E', borderRadius:999, overflow:'hidden' }}>
              <div style={{ height:'100%', width:'37.5%', background:LIME, borderRadius:999 }}/>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div style={{ background:'#0F0F0F', border:'1px solid #1E1E1E', borderRadius:22, padding:'30px 20px', textAlign:'center', marginBottom:16, animation:'fadeIn .3s ease' }}>
          <div style={{ width:52, height:52, background:'rgba(182,242,62,.1)', border:'1px solid rgba(182,242,62,.2)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
            <div style={{ width:26, height:26, border:'2.5px solid rgba(182,242,62,.2)', borderTop:`2.5px solid ${LIME}`, borderRadius:'50%', animation:'spin .8s linear infinite' }}/>
          </div>
          <div style={{ font:"600 15px 'Hanken Grotesk'", marginBottom:8 }}>KI erstellt deinen Plan…</div>
          {PLAN_STEPS.map((s,i) => (
            <div key={i} style={{ font:"400 13px 'Hanken Grotesk'", color: i<stepIndex ? '#5A5A5A' : i===stepIndex ? LIME : '#2E2E2E', marginTop:6, display:'flex', alignItems:'center', justifyContent:'center', gap:6, transition:'color .4s' }}>
              <span>{i<stepIndex?'✓':i===stepIndex?'·':'○'}</span>{s}
            </div>
          ))}
        </div>
      )}

      {planReady && !loading && (
        <>
          <div style={{ font:"700 11px 'Space Mono'", letterSpacing:'2px', color:'#5A5A5A', marginBottom:12 }}>DIESE WOCHE</div>
          <div style={{ display:'flex', gap:6, marginBottom:14 }}>
            {WEEK_DAYS.map((d,i) => {
              const ic = intensityColors[d.intensity]
              const sel = selectedDay===i
              return (
                <button key={i} onClick={() => setSelectedDay(i)} style={{ flex:1, background: sel ? ic.bg : '#0D0D0D', border:`1px solid ${sel ? ic.dot : '#1E1E1E'}`, borderRadius:14, padding:'10px 4px', cursor:'pointer', textAlign:'center', transition:'all .15s' }}>
                  <div style={{ font:"400 10px 'Hanken Grotesk'", color:'#5A5A5A', marginBottom:5 }}>{d.day}</div>
                  <div style={{ width:8, height:8, borderRadius:'50%', background: d.intensity==='rest' ? '#2E2E2E' : ic.dot, margin:'0 auto 5px' }}/>
                  <div style={{ font:"600 10px 'Space Grotesk'", color: sel ? ic.color : '#5A5A5A' }}>{d.km}</div>
                </button>
              )
            })}
          </div>

          {/* Day detail list */}
          <div style={{ background:'#0D0D0D', border:'1px solid #1E1E1E', borderRadius:18, overflow:'hidden', marginBottom:14 }}>
            {WEEK_DAYS.map((day, i) => {
              const dc = intensityColors[day.intensity]
              const sel = i===selectedDay
              return (
                <div key={i} onClick={() => setSelectedDay(i)} style={{ display:'flex', alignItems:'center', gap:14, padding:'13px 16px', borderBottom: i<WEEK_DAYS.length-1 ? '1px solid #171717' : 'none', background: sel ? dc.bg : 'transparent', cursor:'pointer', transition:'background .15s' }}>
                  <div style={{ width:36, height:36, background: sel ? dc.bg : '#151515', border:`1px solid ${sel ? dc.dot : '#222'}`, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <div style={{ font:"700 11px 'Space Grotesk'", color: sel ? dc.color : '#5A5A5A' }}>{day.day}</div>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ font:"600 14px 'Hanken Grotesk'", color: day.intensity==='rest' ? '#4A4A4A' : '#fff' }}>{day.type}</div>
                    <div style={{ font:"400 12px 'Hanken Grotesk'", color:'#5A5A5A', marginTop:1 }}>{day.detail}</div>
                  </div>
                  <div style={{ font:"600 14px 'Space Grotesk'", color: day.intensity==='rest' ? '#3A3A3A' : '#fff' }}>
                    {day.km}{day.km!=='—' && <span style={{ font:"400 10px 'Hanken Grotesk'", color:'#5A5A5A', marginLeft:2 }}>km</span>}
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ background:'#0D0D0D', border:'1px solid #1E1E1E', borderRadius:16, padding:16, display:'flex', justifyContent:'space-around', marginBottom:16 }}>
            {[['40,4','km'],['4','Läufe'],['~4,5','Std']].map(([v,u]) => (
              <div key={u} style={{ textAlign:'center' }}>
                <div style={{ font:"700 20px 'Space Grotesk'", color:LIME, letterSpacing:'-0.3px' }}>{v}</div>
                <div style={{ font:"400 11px 'Hanken Grotesk'", color:'#5A5A5A', marginTop:3 }}>{u}</div>
              </div>
            ))}
          </div>
        </>
      )}

      <button onClick={() => setWizardOpen(true)} disabled={loading} style={{
        width:'100%',
        background: loading ? '#151515' : LIME,
        color: loading ? '#5A5A5A' : '#07090A',
        border: loading ? '1px solid #222' : 'none',
        borderRadius:999, padding:18, font:"700 16px 'Hanken Grotesk'",
        cursor: loading ? 'not-allowed' : 'pointer', transition:'all .2s',
        display:'flex', alignItems:'center', justifyContent:'center', gap:10,
        boxShadow: loading ? 'none' : '0 0 28px rgba(182,242,62,0.3)',
        animation: loading ? 'none' : 'pulse-glow 3s ease-in-out infinite'
      }}>
        {loading ? (
          <><div style={{ width:16, height:16, border:'2px solid #333', borderTop:`2px solid ${LIME}`, borderRadius:'50%', animation:'spin .7s linear infinite' }}/>Berechne…</>
        ) : (
          <><svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><rect x="2" y="4" width="12" height="10" rx="1.5" ry="1.5"/><rect x="5" y="2" width="2" height="4" rx="1" ry="1" fill="#07090A"/><rect x="9" y="2" width="2" height="4" rx="1" ry="1" fill="#07090A"/><rect x="4.5" y="8" width="2" height="2" rx="0.5" fill="#07090A" opacity="0.6"/><rect x="7" y="8" width="2" height="2" rx="0.5" fill="#07090A" opacity="0.6"/><rect x="9.5" y="8" width="2" height="2" rx="0.5" fill="#07090A" opacity="0.6"/><rect x="4.5" y="10.5" width="2" height="1.5" rx="0.5" fill="#07090A" opacity="0.4"/><rect x="7" y="10.5" width="2" height="1.5" rx="0.5" fill="#07090A" opacity="0.4"/></svg> Neuen KI-Plan erstellen</>
        )}
      </button>
      <div style={{ font:"400 11.5px 'Hanken Grotesk'", color:'#4A4A4A', textAlign:'center', marginTop:8 }}>
        Die KI analysiert dein Level, deine Verfügbarkeit & dein Zielrennen
      </div>
    </div>
  )
}

// ─── ANALYSE VIEW ─────────────────────────────────────────────────────────────

function BarChart({ data }) {
  const maxVal = Math.max(...data.map(d => d.value), 1)
  const barW = 28, gap = 8, chartH = 110
  const totalW = data.length * (barW + gap) - gap
  return (
    <svg width={Math.max(totalW + 20, 300)} height={chartH + 36}
      viewBox={`0 0 ${Math.max(totalW+20,300)} ${chartH+36}`}
      style={{ display:'block', minWidth:'100%' }}>
      {data.map((d, i) => {
        const barH = d.value > 0 ? Math.max((d.value/maxVal)*chartH, 4) : 0
        const x = i * (barW + gap), y = chartH - barH
        return (
          <g key={i}>
            <rect x={x} y={0} width={barW} height={chartH} rx="8" fill="#0D0D0D"/>
            {d.value > 0 && <rect x={x} y={y} width={barW} height={barH} rx="8" fill={d.today ? LIME : '#1E1E1E'}/>}
            <text x={x+barW/2} y={chartH+18} textAnchor="middle" fill={d.today ? LIME : '#4A4A4A'} fontSize="11" fontFamily="Hanken Grotesk" fontWeight={d.today?'600':'400'}>{d.label}</text>
            {d.value > 0 && <text x={x+barW/2} y={y-5} textAnchor="middle" fill={d.today ? LIME : '#5A5A5A'} fontSize="10" fontFamily="Space Grotesk" fontWeight="700">{d.value}</text>}
          </g>
        )
      })}
    </svg>
  )
}

function PaceChart() {
  const pts = [{pace:6.2},{pace:6.0},{pace:5.9},{pace:5.85},{pace:5.7},{pace:5.65},{pace:5.58},{pace:5.5}]
  const w=280, h=80, minP=5.4, maxP=6.4
  const toY = p => ((p-minP)/(maxP-minP))*h
  const toX = i => (i/(pts.length-1))*w
  const pathD = pts.map((p,i) => `${i===0?'M':'L'} ${toX(i)} ${h-toY(p.pace)}`).join(' ')
  const areaD = `${pathD} L ${w} ${h} L 0 ${h} Z`
  return (
    <svg viewBox={`0 0 ${w} ${h+20}`} style={{ width:'100%' }}>
      <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={LIME} stopOpacity="0.15"/><stop offset="100%" stopColor={LIME} stopOpacity="0"/></linearGradient></defs>
      <path d={areaD} fill="url(#pg)"/>
      <path d={pathD} fill="none" stroke={LIME} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p,i) => <circle key={i} cx={toX(i)} cy={h-toY(p.pace)} r={i===pts.length-1?4:2.5} fill={i===pts.length-1?LIME:'#000'} stroke={LIME} strokeWidth="1.5"/>)}
      <text x={w-2} y={h-toY(pts[pts.length-1].pace)-8} textAnchor="end" fill={LIME} fontSize="10" fontFamily="Space Grotesk" fontWeight="700">5:30/km</text>
    </svg>
  )
}

function AnalyseView() {
  const [period, setPeriod] = useState('woche')
  const metrics = [
    { label:'Gesamt km',  value:'28,4', unit:'km',  color:LIME,   sub:'+3.2 ggü. Vorwoche' },
    { label:'Ø Tempo',    value:'5:50', unit:'/km', color:'#fff', sub:'10 s schneller' },
    { label:'Gesamtzeit', value:'2h 42m', unit:'',  color:'#fff', sub:'3 Einheiten' },
    { label:'Höhenmeter', value:'320', unit:'m',    color:'#9B8CFA', sub:'↑ diese Woche' },
  ]
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:16 }}>
        <div style={{ display:'inline-flex', background:'#111', border:'1px solid #1E1E1E', borderRadius:10, padding:3 }}>
          {['woche','monat'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{ padding:'7px 16px', borderRadius:8, border:'none', background: period===p ? LIME : 'transparent', color: period===p ? '#000' : '#7A7A7A', font:"600 13px 'Hanken Grotesk'", cursor:'pointer', transition:'all .15s', textTransform:'capitalize' }}>{p.charAt(0).toUpperCase()+p.slice(1)}</button>
          ))}
        </div>
      </div>
      <div style={{ background:'#0D0D0D', border:'1px solid #1E1E1E', borderRadius:20, padding:20, marginBottom:12 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:14 }}>
          <div style={{ font:"700 11px 'Space Mono'", letterSpacing:'1.5px', color:'#5A5A5A' }}>DISTANZ (KM)</div>
          <div style={{ font:"700 22px 'Space Grotesk'", color:LIME }}>28,4 <span style={{ font:"400 13px 'Hanken Grotesk'", color:'#5A5A5A' }}>km</span></div>
        </div>
        <BarChart data={period==='woche' ? weekData : monthData}/>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
        {metrics.map(m => (
          <div key={m.label} style={{ background:'#0D0D0D', border:'1px solid #1E1E1E', borderRadius:16, padding:16 }}>
            <div style={{ font:"400 11px 'Hanken Grotesk'", color:'#5A5A5A', marginBottom:5 }}>{m.label}</div>
            <div style={{ font:"700 22px 'Space Grotesk'", color:m.color, letterSpacing:'-0.5px', lineHeight:1 }}>{m.value}<span style={{ font:"400 12px 'Hanken Grotesk'", color:'#5A5A5A' }}> {m.unit}</span></div>
            <div style={{ font:"400 11px 'Hanken Grotesk'", color:LIME, marginTop:5, opacity:.7 }}>{m.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ background:'#0D0D0D', border:'1px solid #1E1E1E', borderRadius:20, padding:20, marginBottom:12 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:14 }}>
          <div style={{ font:"700 11px 'Space Mono'", letterSpacing:'1.5px', color:'#5A5A5A' }}>TEMPO-TREND</div>
          <div style={{ background:'rgba(182,242,62,.1)', border:'1px solid rgba(182,242,62,.2)', borderRadius:999, padding:'3px 10px', font:"600 11px 'Hanken Grotesk'", color:LIME }}>↑ Verbesserung</div>
        </div>
        <PaceChart/>
        <div style={{ font:"400 12px 'Hanken Grotesk'", color:'#5A5A5A', marginTop:6, textAlign:'center' }}>Ø Tempo der letzten 8 Wochen · von 6:12 auf 5:30 /km</div>
      </div>
      <div style={{ background:'#0D0D0D', border:'1px solid #1E1E1E', borderRadius:20, padding:20, marginBottom:12 }}>
        <div style={{ font:"700 11px 'Space Mono'", letterSpacing:'1.5px', color:'#5A5A5A', marginBottom:14 }}>TRAININGSZONEN</div>
        {zones.map(z => (
          <div key={z.name} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
            <div style={{ width:52, font:"400 12px 'Hanken Grotesk'", color:'#7A7A7A' }}>{z.name}</div>
            <div style={{ flex:1, height:8, background:'#1A1A1A', borderRadius:999, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${z.pct}%`, background:z.color, borderRadius:999 }}/>
            </div>
            <div style={{ width:32, textAlign:'right', font:"600 12px 'Space Grotesk'", color:z.color }}>{z.pct}%</div>
          </div>
        ))}
      </div>
      <div style={{ background:'#0D0D0D', border:'1px solid #1E1E1E', borderRadius:18, overflow:'hidden' }}>
        {records.map((r,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderBottom: i<records.length-1 ? '1px solid #171717' : 'none' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ fontSize:18 }}>{r.icon}</span>
              <span style={{ font:"400 13.5px 'Hanken Grotesk'", color:'#B0B0B0' }}>{r.label}</span>
            </div>
            <span style={{ font:"600 14px 'Space Grotesk'" }}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function Training({ navigate }) {
  const [view, setView] = useState('plan')

  return (
    <div style={{ padding:'0 0 8px' }}>
      <div style={{ padding:'56px 20px 0' }}>
        <div style={{ font:"700 11px 'Space Mono'", letterSpacing:'2px', color:'#5A5A5A', marginBottom:8 }}>
          {view === 'plan' ? 'KI-TRAININGSPLAN' : 'TRAININGSANALYSE'}
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <div style={{ font:"700 28px 'Space Grotesk'", letterSpacing:'-0.6px' }}>Training</div>
          <div style={{ display:'inline-flex', background:'#111', border:'1px solid #1E1E1E', borderRadius:12, padding:3 }}>
            {[['plan','Plan'],['analyse','Analyse']].map(([id,label]) => (
              <button key={id} onClick={() => setView(id)} style={{ padding:'8px 18px', borderRadius:9, border:'none', background: view===id ? LIME : 'transparent', color: view===id ? '#000' : '#6A6A6A', font:`600 13px 'Hanken Grotesk'`, cursor:'pointer', transition:'all .15s' }}>{label}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding:'0 20px' }}>
        {view === 'plan'    && <PlanView/>}
        {view === 'analyse' && <AnalyseView/>}
      </div>
    </div>
  )
}
