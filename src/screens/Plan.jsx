import { useState } from 'react'

const LIME = '#B6F23E'

const PLAN_STEPS = [
  'Analysiere dein Laufprofil…',
  'Berechne optimale Intensitätszonen…',
  'Plane Progression & Regenerationsphasen…',
  'Erstelle deinen persönlichen 8-Wochen-Plan…'
]

const GENERATED_PLAN = {
  name: '10 km in 8 Wochen',
  goal: 'Sub 55:00',
  phase: 'Aufbauphase · Woche 3 von 8',
  weeks: [
    {
      label: 'W3',
      days: [
        { day: 'Mo', type: 'Intervalle', detail: '6 × 800 m', intensity: 'high', km: '8,4' },
        { day: 'Di', type: 'Easy Run', detail: 'Lockeres Tempo', intensity: 'low', km: '7,0' },
        { day: 'Mi', type: 'Ruhe', detail: 'Dehnen & Mobili.', intensity: 'rest', km: '—' },
        { day: 'Do', type: 'Tempo', detail: '3 km @ Renntempo', intensity: 'med', km: '6,0' },
        { day: 'Fr', type: 'Easy Run', detail: 'Regenerationslauf', intensity: 'low', km: '5,0' },
        { day: 'Sa', type: 'Langer Lauf', detail: 'Aerobe Basis', intensity: 'med', km: '14,0' },
        { day: 'So', type: 'Ruhe', detail: 'Ruhetag', intensity: 'rest', km: '—' },
      ]
    }
  ]
}

const intensityColors = {
  high: { bg: 'rgba(242,85,90,.12)', color: '#F2555A', dot: '#F2555A' },
  med: { bg: 'rgba(182,242,62,.1)', color: LIME, dot: LIME },
  low: { bg: 'rgba(90,169,240,.1)', color: '#5AA9F0', dot: '#5AA9F0' },
  rest: { bg: 'rgba(255,255,255,.04)', color: '#4A4A4A', dot: '#2E2E2E' }
}

export default function Plan() {
  const [loading, setLoading] = useState(false)
  const [planGenerated, setPlanGenerated] = useState(true)
  const [stepIndex, setStepIndex] = useState(0)
  const [selectedDay, setSelectedDay] = useState(0)

  const handleGeneratePlan = () => {
    setLoading(true)
    setPlanGenerated(false)
    setStepIndex(0)

    const tick = (i) => {
      if (i < PLAN_STEPS.length) {
        setStepIndex(i)
        setTimeout(() => tick(i + 1), 900)
      } else {
        setTimeout(() => {
          setLoading(false)
          setPlanGenerated(true)
        }, 400)
      }
    }
    tick(0)
  }

  const days = GENERATED_PLAN.weeks[0].days

  return (
    <div style={{ padding: '0 0 8px' }}>
      {/* Header */}
      <div style={{ padding: '56px 20px 20px' }}>
        <div style={{ font: "700 11px 'Space Mono'", letterSpacing: '2px', color: '#5A5A5A', marginBottom: '8px' }}>
          KI-TRAININGSPLAN
        </div>
        <div style={{ font: "700 28px 'Space Grotesk'", letterSpacing: '-0.6px' }}>
          Dein Plan
        </div>
      </div>

      {/* Plan card */}
      {planGenerated && !loading && (
        <div style={{ padding: '0 20px 20px', animation: 'fadeInUp 0.4s ease' }}>
          <div style={{
            background: '#0F0F0F',
            border: '1px solid #1E1E1E',
            borderRadius: '22px',
            padding: '20px',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', top: '-30px', right: '-30px',
              width: '150px', height: '150px',
              background: 'radial-gradient(circle, rgba(182,242,62,.08), transparent 70%)',
              pointerEvents: 'none'
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  background: 'rgba(182,242,62,.12)', border: '1px solid rgba(182,242,62,.2)',
                  borderRadius: '999px', padding: '4px 10px',
                  font: "600 11px 'Hanken Grotesk'", color: LIME, marginBottom: '10px'
                }}>
                  ⚡ KI-generiert
                </div>
                <div style={{ font: "700 22px 'Space Grotesk'", letterSpacing: '-0.4px' }}>
                  {GENERATED_PLAN.name}
                </div>
                <div style={{ font: "600 14px 'Hanken Grotesk'", color: LIME, marginTop: '3px' }}>
                  Ziel: {GENERATED_PLAN.goal}
                </div>
              </div>
              <div style={{
                background: 'rgba(182,242,62,.08)', border: '1px solid rgba(182,242,62,.15)',
                borderRadius: '14px', padding: '10px 14px', textAlign: 'center'
              }}>
                <div style={{ font: "700 20px 'Space Grotesk'", color: LIME }}>3</div>
                <div style={{ font: "400 10px 'Hanken Grotesk'", color: '#6A6A6A' }}>von 8 Wo.</div>
              </div>
            </div>

            <div style={{
              margin: '16px 0', padding: '12px',
              background: '#151515', borderRadius: '12px',
              font: "400 12.5px 'Hanken Grotesk'", color: '#8A8A8A'
            }}>
              📍 {GENERATED_PLAN.phase}
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ font: "400 12px 'Hanken Grotesk'", color: '#6A6A6A' }}>Gesamtfortschritt</span>
              <span style={{ font: "600 12px 'Hanken Grotesk'", color: LIME }}>37,5 %</span>
            </div>
            <div style={{ height: 6, background: '#1E1E1E', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: '37.5%',
                background: LIME, borderRadius: '999px'
              }} />
            </div>
          </div>
        </div>
      )}

      {/* AI Loading */}
      {loading && (
        <div style={{ padding: '0 20px 20px', animation: 'fadeIn 0.3s ease' }}>
          <div style={{
            background: '#0F0F0F', border: '1px solid #1E1E1E',
            borderRadius: '22px', padding: '30px 20px',
            textAlign: 'center'
          }}>
            <div style={{
              width: 56, height: 56,
              background: 'rgba(182,242,62,.1)',
              border: '1px solid rgba(182,242,62,.2)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <div style={{
                width: 28, height: 28,
                border: '2.5px solid rgba(182,242,62,.2)',
                borderTop: `2.5px solid ${LIME}`,
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
            </div>
            <div style={{ font: "600 15px 'Hanken Grotesk'", marginBottom: '8px' }}>
              KI erstellt deinen Plan…
            </div>
            {PLAN_STEPS.map((step, i) => (
              <div key={i} style={{
                font: "400 13px 'Hanken Grotesk'",
                color: i <= stepIndex ? (i === stepIndex ? LIME : '#5A5A5A') : '#2E2E2E',
                marginTop: '6px',
                transition: 'color 0.4s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}>
                <span>{i < stepIndex ? '✓' : i === stepIndex ? '·' : '○'}</span>
                {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Week Calendar */}
      {planGenerated && !loading && (
        <>
          <div style={{ padding: '0 20px 16px' }}>
            <div style={{ font: "700 11px 'Space Mono'", letterSpacing: '2px', color: '#5A5A5A', marginBottom: '14px' }}>
              DIESE WOCHE
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {days.map((d, i) => {
                const ic = intensityColors[d.intensity]
                const isSelected = selectedDay === i
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDay(i)}
                    style={{
                      flex: 1,
                      background: isSelected ? ic.bg : '#0D0D0D',
                      border: `1px solid ${isSelected ? ic.dot : '#1E1E1E'}`,
                      borderRadius: '14px', padding: '10px 4px',
                      cursor: 'pointer', textAlign: 'center',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ font: "400 10px 'Hanken Grotesk'", color: '#5A5A5A', marginBottom: '6px' }}>{d.day}</div>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: d.intensity === 'rest' ? '#2E2E2E' : ic.dot,
                      margin: '0 auto 6px'
                    }} />
                    <div style={{ font: "600 10px 'Space Grotesk'", color: isSelected ? ic.color : '#5A5A5A' }}>
                      {d.km}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Selected day detail */}
          <div style={{ padding: '0 20px 20px' }}>
            {(() => {
              const d = days[selectedDay]
              const ic = intensityColors[d.intensity]
              return (
                <div style={{
                  background: '#0D0D0D', border: '1px solid #1E1E1E',
                  borderRadius: '18px', overflow: 'hidden',
                  animation: 'fadeInUp 0.2s ease'
                }}>
                  {days.map((day, i) => {
                    const dc = intensityColors[day.intensity]
                    const isSelected = i === selectedDay
                    return (
                      <div
                        key={i}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '14px',
                          padding: '14px 16px',
                          borderBottom: i < days.length - 1 ? '1px solid #171717' : 'none',
                          background: isSelected ? dc.bg : 'transparent',
                          cursor: 'pointer', transition: 'background 0.15s'
                        }}
                        onClick={() => setSelectedDay(i)}
                      >
                        <div style={{
                          width: 36, height: 36,
                          background: isSelected ? dc.bg : '#151515',
                          border: `1px solid ${isSelected ? dc.dot : '#222'}`,
                          borderRadius: '10px',
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                          <div style={{ font: "700 11px 'Space Grotesk'", color: isSelected ? dc.color : '#5A5A5A' }}>{day.day}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ font: "600 14px 'Hanken Grotesk'", color: day.intensity === 'rest' ? '#4A4A4A' : '#fff' }}>
                            {day.type}
                          </div>
                          <div style={{ font: "400 12px 'Hanken Grotesk'", color: '#5A5A5A', marginTop: '1px' }}>
                            {day.detail}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ font: "600 14px 'Space Grotesk'", color: day.intensity === 'rest' ? '#3A3A3A' : '#fff' }}>
                            {day.km}
                          </div>
                          {day.km !== '—' && (
                            <div style={{ font: "400 10px 'Hanken Grotesk'", color: '#5A5A5A' }}>km</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })()}
          </div>

          {/* Weekly total */}
          <div style={{ padding: '0 20px 20px' }}>
            <div style={{
              background: '#0D0D0D', border: '1px solid #1E1E1E',
              borderRadius: '16px', padding: '16px',
              display: 'flex', justifyContent: 'space-around'
            }}>
              {[['40,4', 'km'], ['4', 'Läufe'], ['~4,5', 'Std']].map(([val, unit]) => (
                <div key={unit} style={{ textAlign: 'center' }}>
                  <div style={{ font: "700 20px 'Space Grotesk'", color: LIME, letterSpacing: '-0.3px' }}>{val}</div>
                  <div style={{ font: "400 11px 'Hanken Grotesk'", color: '#5A5A5A', marginTop: '3px' }}>{unit}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Generate Plan Button */}
      <div style={{ padding: '0 20px 8px' }}>
        <button
          onClick={handleGeneratePlan}
          disabled={loading}
          style={{
            width: '100%',
            background: loading ? '#151515' : 'transparent',
            color: loading ? '#5A5A5A' : LIME,
            border: `1px solid ${loading ? '#222' : 'rgba(182,242,62,.3)'}`,
            borderRadius: '14px',
            padding: '16px',
            font: "600 15px 'Hanken Grotesk'",
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}
        >
          {loading ? (
            <>
              <div style={{
                width: 16, height: 16,
                border: '2px solid #333',
                borderTop: `2px solid ${LIME}`,
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite'
              }} />
              Berechne…
            </>
          ) : (
            <>⚡ Neuen KI-Plan erstellen</>
          )}
        </button>
        <div style={{ font: "400 12px 'Hanken Grotesk'", color: '#4A4A4A', textAlign: 'center', marginTop: '10px' }}>
          Die KI analysiert dein Level, deine Verfügbarkeit & dein Zielrennen
        </div>
      </div>
    </div>
  )
}
