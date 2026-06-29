import { useState } from 'react'

const LIME = '#B6F23E'

// ─── PLAN DATA ───────────────────────────────────────────────────────────────

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
  { day: 'Mo', type: 'Intervalle',   detail: '6 × 800 m',          intensity: 'high', km: '8,4' },
  { day: 'Di', type: 'Easy Run',     detail: 'Lockeres Tempo',      intensity: 'low',  km: '7,0' },
  { day: 'Mi', type: 'Ruhe',         detail: 'Dehnen & Mobili.',    intensity: 'rest', km: '—'   },
  { day: 'Do', type: 'Tempo',        detail: '3 km @ Renntempo',    intensity: 'med',  km: '6,0' },
  { day: 'Fr', type: 'Easy Run',     detail: 'Regenerationslauf',   intensity: 'low',  km: '5,0' },
  { day: 'Sa', type: 'Langer Lauf',  detail: 'Aerobe Basis',        intensity: 'med',  km: '14,0'},
  { day: 'So', type: 'Ruhe',         detail: 'Ruhetag',             intensity: 'rest', km: '—'   },
]

// ─── ANALYSE DATA ─────────────────────────────────────────────────────────────

const weekData  = [
  { label:'Mo', value:8.2  },{ label:'Di', value:10.0 },{ label:'Mi', value:0   },
  { label:'Do', value:6.0  },{ label:'Fr', value:0,   today:true },{ label:'Sa', value:0 },{ label:'So', value:0 },
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

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

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
        const isActive = d.today
        return (
          <g key={i}>
            <rect x={x} y={0} width={barW} height={chartH} rx="8" fill="#0D0D0D"/>
            {d.value > 0 && <rect x={x} y={y} width={barW} height={barH} rx="8" fill={isActive ? LIME : '#1E1E1E'}/>}
            <text x={x+barW/2} y={chartH+18} textAnchor="middle" fill={isActive ? LIME : '#4A4A4A'}
              fontSize="11" fontFamily="Hanken Grotesk" fontWeight={isActive?'600':'400'}>{d.label}</text>
            {d.value > 0 && (
              <text x={x+barW/2} y={y-5} textAnchor="middle" fill={isActive ? LIME : '#5A5A5A'}
                fontSize="10" fontFamily="Space Grotesk" fontWeight="700">{d.value}</text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function PaceChart() {
  const pts = [
    {pace:6.2},{pace:6.0},{pace:5.9},{pace:5.85},{pace:5.7},{pace:5.65},{pace:5.58},{pace:5.5}
  ]
  const w=280, h=80, minP=5.4, maxP=6.4
  const toY = p => ((p-minP)/(maxP-minP))*h
  const toX = i => (i/(pts.length-1))*w
  const pathD = pts.map((p,i) => `${i===0?'M':'L'} ${toX(i)} ${h-toY(p.pace)}`).join(' ')
  const areaD = `${pathD} L ${w} ${h} L 0 ${h} Z`
  return (
    <svg viewBox={`0 0 ${w} ${h+20}`} style={{ width:'100%' }}>
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={LIME} stopOpacity="0.15"/>
          <stop offset="100%" stopColor={LIME} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#pg)"/>
      <path d={pathD} fill="none" stroke={LIME} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p,i) => (
        <circle key={i} cx={toX(i)} cy={h-toY(p.pace)}
          r={i===pts.length-1?4:2.5}
          fill={i===pts.length-1?LIME:'#000'} stroke={LIME} strokeWidth="1.5"/>
      ))}
      <text x={w-2} y={h-toY(pts[pts.length-1].pace)-8} textAnchor="end"
        fill={LIME} fontSize="10" fontFamily="Space Grotesk" fontWeight="700">5:30/km</text>
    </svg>
  )
}

// ─── PLAN VIEW ────────────────────────────────────────────────────────────────

function PlanView() {
  const [loading, setLoading]       = useState(false)
  const [planReady, setPlanReady]   = useState(true)
  const [stepIndex, setStepIndex]   = useState(0)
  const [selectedDay, setSelectedDay] = useState(0)

  const handleGenerate = () => {
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
      {/* Plan card */}
      {planReady && !loading && (
        <div style={{ marginBottom:16, animation:'fadeInUp .4s ease' }}>
          <div style={{ background:'#0F0F0F', border:'1px solid #1E1E1E', borderRadius:22, padding:20, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-30, right:-30, width:150, height:150,
              background:'radial-gradient(circle, rgba(182,242,62,.08), transparent 70%)', pointerEvents:'none' }}/>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <div style={{ display:'inline-flex', alignItems:'center', gap:5,
                  background:'rgba(182,242,62,.12)', border:'1px solid rgba(182,242,62,.2)',
                  borderRadius:999, padding:'4px 10px', font:"600 11px 'Hanken Grotesk'",
                  color:LIME, marginBottom:10 }}><svg viewBox="0 0 12 12" width="10" height="10" fill="currentColor" style={{flexShrink:0}}><path d="M7 1L2 7h3.5L4 11l6-6.5H6.5z"/></svg> KI-generiert</div>
                <div style={{ font:"700 22px 'Space Grotesk'", letterSpacing:'-0.4px' }}>10 km in 8 Wochen</div>
                <div style={{ font:"600 14px 'Hanken Grotesk'", color:LIME, marginTop:3 }}>Ziel: Sub 55:00</div>
              </div>
              <div style={{ background:'rgba(182,242,62,.08)', border:'1px solid rgba(182,242,62,.15)',
                borderRadius:14, padding:'10px 14px', textAlign:'center' }}>
                <div style={{ font:"700 20px 'Space Grotesk'", color:LIME }}>3</div>
                <div style={{ font:"400 10px 'Hanken Grotesk'", color:'#6A6A6A' }}>von 8 Wo.</div>
              </div>
            </div>
            <div style={{ margin:'14px 0', padding:12, background:'#151515', borderRadius:12,
              font:"400 12.5px 'Hanken Grotesk'", color:'#8A8A8A' }}>
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

      {/* AI loading */}
      {loading && (
        <div style={{ background:'#0F0F0F', border:'1px solid #1E1E1E', borderRadius:22,
          padding:'30px 20px', textAlign:'center', marginBottom:16, animation:'fadeIn .3s ease' }}>
          <div style={{ width:52, height:52, background:'rgba(182,242,62,.1)',
            border:'1px solid rgba(182,242,62,.2)', borderRadius:'50%',
            display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
            <div style={{ width:26, height:26, border:'2.5px solid rgba(182,242,62,.2)',
              borderTop:`2.5px solid ${LIME}`, borderRadius:'50%', animation:'spin .8s linear infinite' }}/>
          </div>
          <div style={{ font:"600 15px 'Hanken Grotesk'", marginBottom:8 }}>KI erstellt deinen Plan…</div>
          {PLAN_STEPS.map((s,i) => (
            <div key={i} style={{ font:"400 13px 'Hanken Grotesk'",
              color: i<stepIndex ? '#5A5A5A' : i===stepIndex ? LIME : '#2E2E2E',
              marginTop:6, display:'flex', alignItems:'center', justifyContent:'center', gap:6, transition:'color .4s' }}>
              <span>{i<stepIndex?'✓':i===stepIndex?'·':'○'}</span>{s}
            </div>
          ))}
        </div>
      )}

      {/* Week calendar */}
      {planReady && !loading && (
        <>
          <div style={{ font:"700 11px 'Space Mono'", letterSpacing:'2px', color:'#5A5A5A', marginBottom:12 }}>
            DIESE WOCHE
          </div>
          <div style={{ display:'flex', gap:6, marginBottom:14 }}>
            {WEEK_DAYS.map((d,i) => {
              const ic = intensityColors[d.intensity]
              const sel = selectedDay===i
              return (
                <button key={i} onClick={() => setSelectedDay(i)} style={{
                  flex:1, background: sel ? ic.bg : '#0D0D0D',
                  border:`1px solid ${sel ? ic.dot : '#1E1E1E'}`,
                  borderRadius:14, padding:'10px 4px', cursor:'pointer', textAlign:'center', transition:'all .15s'
                }}>
                  <div style={{ font:"400 10px 'Hanken Grotesk'", color:'#5A5A5A', marginBottom:5 }}>{d.day}</div>
                  <div style={{ width:8, height:8, borderRadius:'50%',
                    background: d.intensity==='rest' ? '#2E2E2E' : ic.dot, margin:'0 auto 5px' }}/>
                  <div style={{ font:"600 10px 'Space Grotesk'", color: sel ? ic.color : '#5A5A5A' }}>{d.km}</div>
                </button>
              )
            })}
          </div>

          {/* Day list */}
          <div style={{ background:'#0D0D0D', border:'1px solid #1E1E1E', borderRadius:18, overflow:'hidden', marginBottom:14 }}>
            {WEEK_DAYS.map((day, i) => {
              const dc = intensityColors[day.intensity]
              const sel = i===selectedDay
              return (
                <div key={i} onClick={() => setSelectedDay(i)} style={{
                  display:'flex', alignItems:'center', gap:14, padding:'13px 16px',
                  borderBottom: i<WEEK_DAYS.length-1 ? '1px solid #171717' : 'none',
                  background: sel ? dc.bg : 'transparent', cursor:'pointer', transition:'background .15s'
                }}>
                  <div style={{ width:36, height:36,
                    background: sel ? dc.bg : '#151515', border:`1px solid ${sel ? dc.dot : '#222'}`,
                    borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
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

          {/* Weekly total */}
          <div style={{ background:'#0D0D0D', border:'1px solid #1E1E1E', borderRadius:16,
            padding:16, display:'flex', justifyContent:'space-around', marginBottom:16 }}>
            {[['40,4','km'],['4','Läufe'],['~4,5','Std']].map(([v,u]) => (
              <div key={u} style={{ textAlign:'center' }}>
                <div style={{ font:"700 20px 'Space Grotesk'", color:LIME, letterSpacing:'-0.3px' }}>{v}</div>
                <div style={{ font:"400 11px 'Hanken Grotesk'", color:'#5A5A5A', marginTop:3 }}>{u}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Generate button */}
      <button onClick={handleGenerate} disabled={loading} style={{
        width:'100%', background: loading ? '#151515' : 'transparent',
        color: loading ? '#5A5A5A' : LIME,
        border:`1px solid ${loading ? '#222' : 'rgba(182,242,62,.3)'}`,
        borderRadius:14, padding:16, font:"600 15px 'Hanken Grotesk'",
        cursor: loading ? 'not-allowed' : 'pointer', transition:'all .2s',
        display:'flex', alignItems:'center', justifyContent:'center', gap:8
      }}>
        {loading ? (
          <><div style={{ width:16, height:16, border:'2px solid #333',
            borderTop:`2px solid ${LIME}`, borderRadius:'50%', animation:'spin .7s linear infinite' }}/>Berechne…</>
        ) : <><svg viewBox="0 0 12 12" width="11" height="11" fill="currentColor" style={{flexShrink:0}}><path d="M7 1L2 7h3.5L4 11l6-6.5H6.5z"/></svg> Neuen KI-Plan erstellen</>}
      </button>
      <div style={{ font:"400 12px 'Hanken Grotesk'", color:'#4A4A4A', textAlign:'center', marginTop:8 }}>
        Die KI analysiert dein Level, deine Verfügbarkeit & dein Zielrennen
      </div>
    </div>
  )
}

// ─── ANALYSE VIEW ─────────────────────────────────────────────────────────────

function AnalyseView() {
  const [period, setPeriod] = useState('woche')

  const metrics = [
    { label:'Gesamt km',  value:'28,4', unit:'km',   color:LIME,      sub:'+3.2 ggü. Vorwoche' },
    { label:'Ø Tempo',    value:'5:50', unit:'/km',  color:'#fff',    sub:'10 s schneller' },
    { label:'Gesamtzeit', value:'2h 42m', unit:'',   color:'#fff',    sub:'3 Einheiten' },
    { label:'Höhenmeter', value:'320', unit:'m',     color:'#9B8CFA', sub:'↑ diese Woche' },
  ]

  return (
    <div>
      {/* Period selector */}
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:16 }}>
        <div style={{ display:'inline-flex', background:'#111', border:'1px solid #1E1E1E',
          borderRadius:10, padding:3 }}>
          {['woche','monat'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding:'7px 16px', borderRadius:8, border:'none',
              background: period===p ? LIME : 'transparent',
              color: period===p ? '#000' : '#7A7A7A',
              font:"600 13px 'Hanken Grotesk'", cursor:'pointer', transition:'all .15s',
              textTransform:'capitalize'
            }}>{p.charAt(0).toUpperCase()+p.slice(1)}</button>
          ))}
        </div>
      </div>

      {/* Bar chart */}
      <div style={{ background:'#0D0D0D', border:'1px solid #1E1E1E',
        borderRadius:20, padding:20, marginBottom:12 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:14 }}>
          <div style={{ font:"700 11px 'Space Mono'", letterSpacing:'1.5px', color:'#5A5A5A' }}>DISTANZ (KM)</div>
          <div style={{ font:"700 22px 'Space Grotesk'", color:LIME }}>
            28,4 <span style={{ font:"400 13px 'Hanken Grotesk'", color:'#5A5A5A' }}>km</span>
          </div>
        </div>
        <BarChart data={period==='woche' ? weekData : monthData}/>
      </div>

      {/* Metrics */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
        {metrics.map(m => (
          <div key={m.label} style={{ background:'#0D0D0D', border:'1px solid #1E1E1E', borderRadius:16, padding:16 }}>
            <div style={{ font:"400 11px 'Hanken Grotesk'", color:'#5A5A5A', marginBottom:5 }}>{m.label}</div>
            <div style={{ font:"700 22px 'Space Grotesk'", color:m.color, letterSpacing:'-0.5px', lineHeight:1 }}>
              {m.value}<span style={{ font:"400 12px 'Hanken Grotesk'", color:'#5A5A5A' }}> {m.unit}</span>
            </div>
            <div style={{ font:"400 11px 'Hanken Grotesk'", color:LIME, marginTop:5, opacity:.7 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Pace trend */}
      <div style={{ background:'#0D0D0D', border:'1px solid #1E1E1E', borderRadius:20, padding:20, marginBottom:12 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:14 }}>
          <div style={{ font:"700 11px 'Space Mono'", letterSpacing:'1.5px', color:'#5A5A5A' }}>TEMPO-TREND</div>
          <div style={{ background:'rgba(182,242,62,.1)', border:'1px solid rgba(182,242,62,.2)',
            borderRadius:999, padding:'3px 10px', font:"600 11px 'Hanken Grotesk'", color:LIME }}>
            ↑ Verbesserung
          </div>
        </div>
        <PaceChart/>
        <div style={{ font:"400 12px 'Hanken Grotesk'", color:'#5A5A5A', marginTop:6, textAlign:'center' }}>
          Ø Tempo der letzten 8 Wochen · von 6:12 auf 5:30 /km
        </div>
      </div>

      {/* Zones */}
      <div style={{ background:'#0D0D0D', border:'1px solid #1E1E1E', borderRadius:20, padding:20, marginBottom:12 }}>
        <div style={{ font:"700 11px 'Space Mono'", letterSpacing:'1.5px', color:'#5A5A5A', marginBottom:14 }}>
          TRAININGSZONEN
        </div>
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

      {/* Records */}
      <div style={{ background:'#0D0D0D', border:'1px solid #1E1E1E', borderRadius:18, overflow:'hidden' }}>
        {records.map((r,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'14px 16px', borderBottom: i<records.length-1 ? '1px solid #171717' : 'none' }}>
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

// ─── MAIN TRAINING SCREEN ────────────────────────────────────────────────────

export default function Training() {
  const [view, setView] = useState('plan')

  return (
    <div style={{ padding:'0 0 8px' }}>
      {/* Header */}
      <div style={{ padding:'56px 20px 0' }}>
        <div style={{ font:"700 11px 'Space Mono'", letterSpacing:'2px', color:'#5A5A5A', marginBottom:8 }}>
          {view === 'plan' ? 'KI-TRAININGSPLAN' : 'TRAININGSANALYSE'}
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <div style={{ font:"700 28px 'Space Grotesk'", letterSpacing:'-0.6px' }}>Training</div>

          {/* Segment control */}
          <div style={{ display:'inline-flex', background:'#111', border:'1px solid #1E1E1E',
            borderRadius:12, padding:3 }}>
            {[['plan','Plan'],['analyse','Analyse']].map(([id,label]) => (
              <button key={id} onClick={() => setView(id)} style={{
                padding:'8px 18px', borderRadius:9, border:'none',
                background: view===id ? LIME : 'transparent',
                color: view===id ? '#000' : '#6A6A6A',
                font:`600 13px 'Hanken Grotesk'`, cursor:'pointer', transition:'all .15s'
              }}>{label}</button>
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
