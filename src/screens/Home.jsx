import { useState, useRef, useEffect } from 'react'
import Logo from '../components/Logo'

const LIME = '#B6F23E'

function WorkoutOverlay({ onExit }) {
  const [phase, setPhase] = useState('countdown') // 'countdown' | 'running'
  const [count, setCount] = useState(5)
  const [animKey, setAnimKey] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [distance, setDistance] = useState(0)
  const timerRef = useRef(null)
  const elapsedRef = useRef(null)

  useEffect(() => {
    let c = 5
    timerRef.current = setInterval(() => {
      c -= 1
      setCount(c)
      setAnimKey(k => k + 1)
      if (c <= 1) {
        clearInterval(timerRef.current)
        // Stay at 1, then transition to running after brief pause
        setTimeout(() => {
          setPhase('running')
          let secs = 0
          let dist = 0
          elapsedRef.current = setInterval(() => {
            secs += 1
            setElapsed(secs)
            dist += 0.002
            setDistance(d => parseFloat((d + 0.002).toFixed(3)))
          }, 1000)
        }, 900)
      }
    }, 1000)
    return () => {
      clearInterval(timerRef.current)
      clearInterval(elapsedRef.current)
    }
  }, [])

  const handleExit = () => {
    clearInterval(timerRef.current)
    clearInterval(elapsedRef.current)
    onExit()
  }

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  const R = 100
  const C = 2 * Math.PI * R
  const fill = (5 - count) / 4 // 0 at count=5 ... 1 at count=1
  const offset = C * (1 - fill)

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#000',
      zIndex: 300,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.25s ease'
    }}>
      {/* Lime glow background */}
      <div style={{
        position: 'absolute',
        width: 360, height: 360,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(182,242,62,${phase === 'countdown' ? 0.08 : 0.05}), transparent 70%)`,
        pointerEvents: 'none',
        transition: 'opacity 0.5s'
      }} />

      {/* Exit button */}
      <button
        onClick={handleExit}
        style={{
          position: 'absolute', top: 56, right: 20,
          width: 42, height: 42,
          background: '#111', border: '1px solid #222',
          borderRadius: '50%', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#7A7A7A" strokeWidth="2" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>

      {phase === 'countdown' && (
        <>
          {/* Label */}
          <div style={{
            font: "700 11px 'Space Mono'", letterSpacing: '3px',
            color: '#5A5A5A', marginBottom: 48, textTransform: 'uppercase'
          }}>
            Workout startet in
          </div>

          {/* Ring + Number */}
          <div style={{ position: 'relative', width: 240, height: 240 }}>
            <svg viewBox="0 0 240 240" width="240" height="240" style={{ position: 'absolute', inset: 0 }}>
              {/* Track */}
              <circle cx="120" cy="120" r={R} fill="none" stroke="#111" strokeWidth="8"/>
              {/* Fill */}
              <circle
                cx="120" cy="120" r={R}
                fill="none" stroke={LIME} strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={offset}
                transform="rotate(-90 120 120)"
                style={{ transition: 'stroke-dashoffset 0.85s cubic-bezier(0.4,0,0.2,1)' }}
              />
            </svg>

            {/* Big number */}
            <div
              key={animKey}
              style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                font: "700 96px 'Space Grotesk'",
                color: count === 1 ? LIME : '#fff',
                letterSpacing: '-4px',
                animation: 'countPop 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                transition: 'color 0.3s'
              }}
            >
              {count}
            </div>
          </div>

          {/* Workout info below */}
          <div style={{ marginTop: 48, textAlign: 'center' }}>
            <div style={{ font: "700 22px 'Space Grotesk'", letterSpacing: '-0.3px' }}>Intervalle</div>
            <div style={{ font: "400 14px 'Hanken Grotesk'", color: '#6A6A6A', marginTop: 6 }}>8 × 400 m · 48 Min · 8,2 km</div>
          </div>

          {/* Cancel */}
          <button
            onClick={handleExit}
            style={{
              position: 'absolute', bottom: 48,
              background: 'transparent', color: '#4A4A4A',
              border: '1px solid #222', borderRadius: '14px',
              padding: '14px 40px',
              font: "500 14px 'Hanken Grotesk'", cursor: 'pointer'
            }}
          >
            Abbrechen
          </button>
        </>
      )}

      {phase === 'running' && (
        <div style={{ textAlign: 'center', animation: 'fadeInUp 0.4s ease', width: '100%', padding: '0 32px' }}>
          {/* Status */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(182,242,62,.1)', border: '1px solid rgba(182,242,62,.25)',
            borderRadius: '999px', padding: '6px 16px',
            font: "600 12px 'Hanken Grotesk'", color: LIME, marginBottom: 32
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', background: LIME,
              animation: 'pulse-glow 1.2s ease-in-out infinite'
            }} />
            Workout läuft
          </div>

          {/* Stopwatch */}
          <div style={{
            font: "700 72px 'Space Grotesk'",
            color: '#fff', letterSpacing: '-3px', lineHeight: 1,
            marginBottom: 8
          }}>
            {formatTime(elapsed)}
          </div>
          <div style={{ font: "400 13px 'Hanken Grotesk'", color: '#5A5A5A', marginBottom: 40 }}>
            Intervalle · 8 × 400 m
          </div>

          {/* Live stats */}
          <div style={{
            display: 'flex', justifyContent: 'space-around',
            background: '#0D0D0D', border: '1px solid #1E1E1E',
            borderRadius: '20px', padding: '22px 16px', marginBottom: 32
          }}>
            {[
              { label: 'Distanz', value: `${distance.toFixed(2)} km`, color: LIME },
              { label: 'Tempo', value: elapsed > 0 ? `${(distance > 0 ? (elapsed / 60 / distance).toFixed(1) : '—')} /km` : '— /km', color: '#fff' },
              { label: 'Herzrate', value: elapsed > 3 ? `${148 + Math.floor(Math.random() * 10)} bpm` : '— bpm', color: '#F2555A' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ font: "400 11px 'Hanken Grotesk'", color: '#5A5A5A', marginBottom: 5 }}>{s.label}</div>
                <div style={{ font: "700 18px 'Space Grotesk'", color: s.color, letterSpacing: '-0.3px' }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Stop button */}
          <button
            onClick={handleExit}
            style={{
              width: '100%', background: '#111',
              color: '#F2555A', border: '1px solid rgba(242,85,90,.25)',
              borderRadius: '14px', padding: '16px',
              font: "600 15px 'Hanken Grotesk'", cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="#F2555A">
              <rect x="4" y="4" width="16" height="16" rx="2"/>
            </svg>
            Workout beenden
          </button>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, unit, color }) {
  return (
    <div style={{
      flex: 1,
      background: '#111',
      border: '1px solid #1E1E1E',
      borderRadius: '16px',
      padding: '14px 12px',
      textAlign: 'center'
    }}>
      <div style={{ font: "400 11px 'Hanken Grotesk'", color: '#6A6A6A', marginBottom: '6px' }}>{label}</div>
      <div style={{ font: "700 22px 'Space Grotesk'", color: color || '#fff', letterSpacing: '-0.5px', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ font: "400 11px 'Hanken Grotesk'", color: '#555', marginTop: '3px' }}>{unit}</div>
    </div>
  )
}

export default function Home({ navigate }) {
  const [showWorkout, setShowWorkout] = useState(false)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Guten Morgen' : hour < 17 ? 'Guten Tag' : 'Guten Abend'

  const upcoming = [
    { day: 'Di', date: '01.07', type: 'Lockerer Lauf', detail: '10 km · Easy Pace', color: 'rgba(90,169,240,.14)', dot: '#5AA9F0' },
    { day: 'Mi', date: '02.07', type: 'Ruhetag', detail: 'Erholung & Dehnen', color: 'rgba(255,255,255,.04)', dot: '#3A3A3A' },
    { day: 'Do', date: '03.07', type: 'Krafttraining', detail: 'Ganzkörper · 45 Min', color: 'rgba(155,140,250,.12)', dot: '#9B8CFA' },
  ]

  return (
    <div style={{ padding: '0 0 8px' }}>
      {showWorkout && <WorkoutOverlay onExit={() => setShowWorkout(false)} />}

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '56px 20px 16px'
      }}>
        <Logo />
        <button style={{
          width: 40, height: 40,
          background: '#111', border: '1px solid #1E1E1E',
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative'
        }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#A0A0A0" strokeWidth="1.8" strokeLinecap="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <div style={{
            position: 'absolute', top: '7px', right: '7px',
            width: '8px', height: '8px',
            background: LIME, borderRadius: '50%', border: '2px solid #000'
          }} />
        </button>
      </div>

      {/* Greeting */}
      <div style={{ padding: '4px 20px 20px' }}>
        <div style={{ font: "700 26px 'Space Grotesk'", letterSpacing: '-0.6px', lineHeight: 1.2 }}>
          {greeting}, Max! 👋
        </div>
        <div style={{
          marginTop: '8px',
          background: 'rgba(182,242,62,.07)',
          border: '1px solid rgba(182,242,62,.15)',
          borderRadius: '12px',
          padding: '12px 14px',
          display: 'flex', gap: '10px', alignItems: 'flex-start'
        }}>
          <div style={{ fontSize: '16px', marginTop: '1px' }}>⚡</div>
          <div style={{ font: "400 13.5px 'Hanken Grotesk'", color: '#B8B8B8', lineHeight: 1.5 }}>
            Deine Erholung ist bei <span style={{ color: LIME, fontWeight: 600 }}>92 %</span> — perfekter Tag für intensive Intervalle. Du bist auf Kurs für dein Wochenziel!
          </div>
        </div>
      </div>

      {/* Today's Workout Card */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ font: "700 11px 'Space Mono'", letterSpacing: '2px', color: '#5A5A5A', marginBottom: '12px' }}>
          HEUTIGES WORKOUT
        </div>
        <div style={{
          background: '#0F0F0F',
          border: '1px solid #222',
          borderRadius: '22px',
          padding: '22px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Glow effect */}
          <div style={{
            position: 'absolute', top: '-40px', right: '-40px',
            width: '180px', height: '180px',
            background: 'radial-gradient(circle, rgba(182,242,62,.1), transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(242,85,90,.12)',
                border: '1px solid rgba(242,85,90,.2)',
                borderRadius: '999px', padding: '4px 10px',
                font: "600 11px 'Hanken Grotesk'", color: '#F2555A',
                marginBottom: '12px'
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F2555A' }} />
                Hoch intensiv
              </div>
              <div style={{ font: "700 30px 'Space Grotesk'", letterSpacing: '-0.5px' }}>Intervalle</div>
              <div style={{ font: "600 17px 'Hanken Grotesk'", color: '#C8C8C8', marginTop: '3px' }}>8 × 400 m</div>
            </div>
            <div style={{
              width: 56, height: 56,
              border: '2px solid rgba(182,242,62,.5)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative'
            }}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={LIME} strokeWidth="1.8" strokeLinecap="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
          </div>

          <div style={{
            display: 'flex', gap: '20px',
            margin: '20px 0', paddingTop: '18px',
            borderTop: '1px solid #222'
          }}>
            {[['Dauer', '48 Min'], ['Distanz', '8,2 km'], ['Tempo', '5:50/km']].map(([label, val]) => (
              <div key={label}>
                <div style={{ font: "400 11px 'Hanken Grotesk'", color: '#6A6A6A' }}>{label}</div>
                <div style={{ font: "600 15px 'Hanken Grotesk'", marginTop: '3px' }}>{val}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowWorkout(true)}
            style={{
              width: '100%',
              background: LIME,
              color: '#07090A',
              border: 'none',
              borderRadius: '999px',
              padding: '15px',
              font: "600 15px 'Hanken Grotesk'",
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              animation: 'pulse-glow 2.5s ease-in-out infinite'
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="#07090A">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
            Workout starten
          </button>
        </div>
      </div>

      {/* Weekly Stats */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ font: "700 11px 'Space Mono'", letterSpacing: '2px', color: '#5A5A5A', marginBottom: '12px' }}>
          DIESE WOCHE
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <StatCard label="Distanz" value="28,4" unit="km" color={LIME} />
          <StatCard label="Streak" value="12" unit="Tage" color="#F5A524" />
          <StatCard label="Verbrannt" value="1.840" unit="kcal" color="#9B8CFA" />
        </div>
      </div>

      {/* Upcoming workouts */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          <div style={{ font: "700 11px 'Space Mono'", letterSpacing: '2px', color: '#5A5A5A' }}>
            NÄCHSTE EINHEITEN
          </div>
          <button
            onClick={() => navigate('training')}
            style={{
              background: 'none', border: 'none',
              font: "600 12px 'Hanken Grotesk'", color: LIME, cursor: 'pointer'
            }}
          >
            Alle anzeigen →
          </button>
        </div>
        <div style={{
          background: '#0D0D0D',
          border: '1px solid #1E1E1E',
          borderRadius: '18px',
          overflow: 'hidden'
        }}>
          {upcoming.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 16px',
                borderBottom: i < upcoming.length - 1 ? '1px solid #171717' : 'none'
              }}
            >
              <div style={{
                width: 42, height: 42,
                borderRadius: '12px',
                background: item.color,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <div style={{ font: "700 11px 'Space Grotesk'", color: item.dot }}>{item.day}</div>
                <div style={{ font: "400 10px 'Hanken Grotesk'", color: item.dot, opacity: 0.8 }}>{item.date.split('.')[0]}.{item.date.split('.')[1]}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ font: "600 14px 'Hanken Grotesk'" }}>{item.type}</div>
                <div style={{ font: "400 12px 'Hanken Grotesk'", color: '#6A6A6A', marginTop: '2px' }}>{item.detail}</div>
              </div>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#3A3A3A" strokeWidth="2" strokeLinecap="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* Nutrition Snapshot */}
      <div style={{ padding: '0 20px 8px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          <div style={{ font: "700 11px 'Space Mono'", letterSpacing: '2px', color: '#5A5A5A' }}>
            ERNÄHRUNG HEUTE
          </div>
          <button
            onClick={() => navigate('nutrition')}
            style={{
              background: 'none', border: 'none',
              font: "600 12px 'Hanken Grotesk'", color: LIME, cursor: 'pointer'
            }}
          >
            Details →
          </button>
        </div>
        <div style={{
          background: '#0D0D0D',
          border: '1px solid #1E1E1E',
          borderRadius: '18px',
          padding: '18px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <div style={{ font: "700 24px 'Space Grotesk'", letterSpacing: '-0.5px' }}>
                1.205 <span style={{ font: "400 14px 'Hanken Grotesk'", color: '#6A6A6A' }}>/ 2.200 kcal</span>
              </div>
              <div style={{ font: "400 12px 'Hanken Grotesk'", color: '#6A6A6A', marginTop: '2px' }}>995 kcal noch verfügbar</div>
            </div>
            <div style={{
              width: 52, height: 52,
              position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg viewBox="0 0 52 52" width="52" height="52">
                <circle cx="26" cy="26" r="20" fill="none" stroke="#1E1E1E" strokeWidth="5"/>
                <circle cx="26" cy="26" r="20" fill="none" stroke={LIME} strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - 1205/2200)}`}
                  transform="rotate(-90 26 26)"
                />
              </svg>
              <div style={{ position: 'absolute', font: "700 12px 'Space Grotesk'", color: LIME }}>
                55%
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {[
              { label: 'KH', val: '180g', target: '270g', color: LIME, pct: 67 },
              { label: 'PRO', val: '65g', target: '140g', color: '#9B8CFA', pct: 46 },
              { label: 'FETT', val: '48g', target: '73g', color: '#F2944A', pct: 66 }
            ].map(m => (
              <div key={m.label} style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ font: "700 11px 'Space Mono'", color: m.color }}>{m.label}</span>
                  <span style={{ font: "400 11px 'Hanken Grotesk'", color: '#6A6A6A' }}>{m.val}</span>
                </div>
                <div style={{ height: 4, background: '#222', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${m.pct}%`,
                    background: m.color, borderRadius: '999px'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
