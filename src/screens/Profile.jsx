import { useState } from 'react'

const LIME = '#B6F23E'

function SettingRow({ icon, label, value, arrow = true, onClick, badge }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      padding: '14px 16px',
      cursor: 'pointer'
    }}>
      <div style={{
        width: 38, height: 38,
        background: '#151515', border: '1px solid #222',
        borderRadius: '11px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '16px', flexShrink: 0
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ font: "500 14px 'Hanken Grotesk'", color: '#D0D0D0' }}>{label}</span>
          {badge && (
            <span style={{
              font: "700 10px 'Space Grotesk'",
              color: '#000', background: LIME,
              borderRadius: '20px', padding: '2px 8px',
              letterSpacing: '0.2px'
            }}>{badge}</span>
          )}
        </div>
        {value && (
          <div style={{ font: "400 12px 'Hanken Grotesk'", color: '#5A5A5A', marginTop: '2px' }}>{value}</div>
        )}
      </div>
      {arrow && (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#3A3A3A" strokeWidth="2" strokeLinecap="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      )}
    </div>
  )
}

export default function Profile() {
  const [goalKm, setGoalKm] = useState(40)
  const [goalKcal, setGoalKcal] = useState(2200)

  const stats = [
    { label: 'Gesamt km', value: '284' },
    { label: 'Läufe', value: '38' },
    { label: 'Wochen', value: '12' },
  ]

  const openSubscription = () => window.open('/landing.html', '_blank')

  const settings = [
    {
      icon: '⭐',
      label: 'Abonnement',
      value: 'Pro-Mitglied · jederzeit kündbar',
      badge: 'PRO',
      onClick: openSubscription
    },
    { icon: '🎯', label: 'Plan & Ziele', value: '10 km Sub-55 · Hamburg 2027' },
    { icon: '🔔', label: 'Benachrichtigungen', value: 'Workout-Erinnerungen aktiv' },
    { icon: '🍏', label: 'Ernährungsziele', value: `${goalKcal.toLocaleString('de')} kcal · ${goalKm} km/Wo` },
    { icon: '👟', label: 'Geräte & Uhren', value: 'Apple Watch Series 9' },
    { icon: '🎨', label: 'Erscheinungsbild', value: 'Dunkel · Lime' },
    { icon: '🔒', label: 'Datenschutz', value: null },
    { icon: '❓', label: 'Hilfe & Support', value: null },
  ]

  return (
    <div style={{ padding: '0 0 8px' }}>
      {/* Header */}
      <div style={{ padding: '56px 20px 20px' }}>
        <div style={{ font: "700 11px 'Space Mono'", letterSpacing: '2px', color: '#5A5A5A', marginBottom: '8px' }}>
          PROFIL
        </div>
        <div style={{ font: "700 28px 'Space Grotesk'", letterSpacing: '-0.6px' }}>Mein Profil</div>
      </div>

      {/* User card */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          background: '#0D0D0D', border: '1px solid #1E1E1E',
          borderRadius: '22px', padding: '24px',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: '-20px', right: '-20px',
            width: '140px', height: '140px',
            background: 'radial-gradient(circle, rgba(182,242,62,.07), transparent 70%)',
            pointerEvents: 'none'
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Avatar */}
            <div style={{
              width: 68, height: 68,
              background: LIME,
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              font: "700 26px 'Space Grotesk'",
              color: '#07090A', flexShrink: 0,
              boxShadow: '0 0 24px rgba(182,242,62,.3)'
            }}>
              MM
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ font: "700 20px 'Space Grotesk'", letterSpacing: '-0.3px' }}>Max Müller</div>
              <div style={{ font: "400 13px 'Hanken Grotesk'", color: LIME, marginTop: '2px' }}>@maxrunner</div>
              <div style={{ font: "400 12px 'Hanken Grotesk'", color: '#5A5A5A', marginTop: '4px' }}>
                Läuft seit 2023 · München 🇩🇪
              </div>
            </div>
            <button style={{
              width: 36, height: 36,
              background: '#151515', border: '1px solid #222',
              borderRadius: '10px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#7A7A7A" strokeWidth="2" strokeLinecap="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex', gap: '0',
            marginTop: '20px', paddingTop: '18px',
            borderTop: '1px solid #1E1E1E'
          }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{
                flex: 1, textAlign: 'center',
                borderRight: i < stats.length - 1 ? '1px solid #1E1E1E' : 'none',
                padding: '0 10px'
              }}>
                <div style={{ font: "700 22px 'Space Grotesk'", color: '#fff', letterSpacing: '-0.5px' }}>
                  {s.value}
                </div>
                <div style={{ font: "400 11px 'Hanken Grotesk'", color: '#5A5A5A', marginTop: '3px' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Goals */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ font: "700 11px 'Space Mono'", letterSpacing: '2px', color: '#5A5A5A', marginBottom: '12px' }}>
          AKTUELLE ZIELE
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{
            background: '#0D0D0D', border: '1px solid #1E1E1E',
            borderRadius: '16px', padding: '16px'
          }}>
            <div style={{ font: "400 11px 'Hanken Grotesk'", color: '#5A5A5A', marginBottom: '6px' }}>
              🏃 Wochenziel
            </div>
            <div style={{ font: "700 24px 'Space Grotesk'", color: LIME, letterSpacing: '-0.5px' }}>
              {goalKm} <span style={{ font: "400 13px 'Hanken Grotesk'", color: '#5A5A5A' }}>km</span>
            </div>
            <div style={{ height: 4, background: '#1E1E1E', borderRadius: '999px', overflow: 'hidden', marginTop: '10px' }}>
              <div style={{ height: '100%', width: '71%', background: LIME, borderRadius: '999px' }} />
            </div>
            <div style={{ font: "400 11px 'Hanken Grotesk'", color: '#5A5A5A', marginTop: '4px' }}>28,4 km erreicht</div>
          </div>
          <div style={{
            background: '#0D0D0D', border: '1px solid #1E1E1E',
            borderRadius: '16px', padding: '16px'
          }}>
            <div style={{ font: "400 11px 'Hanken Grotesk'", color: '#5A5A5A', marginBottom: '6px' }}>
              🍎 Kalorienziel
            </div>
            <div style={{ font: "700 24px 'Space Grotesk'", color: '#9B8CFA', letterSpacing: '-0.5px' }}>
              {goalKcal.toLocaleString('de')} <span style={{ font: "400 12px 'Hanken Grotesk'", color: '#5A5A5A' }}>kcal</span>
            </div>
            <div style={{ height: 4, background: '#1E1E1E', borderRadius: '999px', overflow: 'hidden', marginTop: '10px' }}>
              <div style={{ height: '100%', width: '67%', background: '#9B8CFA', borderRadius: '999px' }} />
            </div>
            <div style={{ font: "400 11px 'Hanken Grotesk'", color: '#5A5A5A', marginTop: '4px' }}>1.480 kcal heute</div>
          </div>
        </div>

        {/* Race goal */}
        <div style={{
          background: '#0D0D0D', border: '1px solid rgba(182,242,62,.2)',
          borderRadius: '16px', padding: '16px', marginTop: '10px',
          display: 'flex', alignItems: 'center', gap: '14px'
        }}>
          <div style={{ fontSize: '24px' }}>🏁</div>
          <div style={{ flex: 1 }}>
            <div style={{ font: "600 13px 'Hanken Grotesk'", color: '#D0D0D0' }}>Zielrennen</div>
            <div style={{ font: "700 16px 'Space Grotesk'", color: LIME, marginTop: '3px' }}>
              Hamburg Marathon 2027
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ font: "700 18px 'Space Grotesk'", color: '#fff' }}>273</div>
            <div style={{ font: "400 11px 'Hanken Grotesk'", color: '#5A5A5A' }}>Tage</div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ font: "700 11px 'Space Mono'", letterSpacing: '2px', color: '#5A5A5A', marginBottom: '12px' }}>
          EINSTELLUNGEN
        </div>
        <div style={{
          background: '#0D0D0D', border: '1px solid #1E1E1E',
          borderRadius: '18px', overflow: 'hidden'
        }}>
          {settings.map((s, i) => (
            <div key={i} style={{ borderBottom: i < settings.length - 1 ? '1px solid #161616' : 'none' }}>
              <SettingRow
                icon={s.icon}
                label={s.label}
                value={s.value}
                badge={s.badge}
                onClick={s.onClick}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Sign out */}
      <div style={{ padding: '0 20px 8px' }}>
        <button style={{
          width: '100%',
          background: 'transparent', color: '#F2555A',
          border: '1px solid rgba(242,85,90,.2)',
          borderRadius: '14px', padding: '16px',
          font: "600 14px 'Hanken Grotesk'", cursor: 'pointer'
        }}>
          Abmelden
        </button>
        <div style={{ font: "400 11px 'Space Mono'", color: '#2E2E2E', textAlign: 'center', marginTop: '14px' }}>
          Eat&Run v0.1.0 · © 2026
        </div>
      </div>
    </div>
  )
}
