import { useState } from 'react'
import Logo from '../components/Logo'

const LIME = '#B6F23E'
const GRAY = '#1A1A1A'

const FRIENDS = [
  { id: 1, name: 'Jonas K.', avatar: 'JK', distance: 52.3, runs: 6, streak: 5 },
  { id: 2, name: 'Sarah M.', avatar: 'SM', distance: 48.7, runs: 5, streak: 8 },
  { id: 3, name: 'Marco P.', avatar: 'MP', distance: 41.2, runs: 4, streak: 3 },
  { id: 4, name: 'Du', avatar: 'MM', distance: 38.5, runs: 5, streak: 4, isMe: true },
  { id: 5, name: 'Lena B.', avatar: 'LB', distance: 31.0, runs: 4, streak: 2 },
  { id: 6, name: 'Tom W.', avatar: 'TW', distance: 22.8, runs: 3, streak: 1 },
]

const FEED = [
  {
    id: 1, user: 'Jonas K.', avatar: 'JK', time: 'vor 23 Min.',
    type: 'run', title: 'Morgenrunde',
    distance: '12.4 km', pace: '4:52 /km', duration: '1:00:20',
    kudos: 5, myKudos: false
  },
  {
    id: 2, user: 'Sarah M.', avatar: 'SM', time: 'vor 2 Std.',
    type: 'run', title: 'Intervalltraining',
    distance: '8.0 km', pace: '4:30 /km', duration: '36:00',
    kudos: 8, myKudos: true
  },
  {
    id: 3, user: 'Marco P.', avatar: 'MP', time: 'vor 5 Std.',
    type: 'run', title: 'Recovery Run',
    distance: '6.2 km', pace: '5:45 /km', duration: '35:39',
    kudos: 3, myKudos: false
  },
  {
    id: 4, user: 'Lena B.', avatar: 'LB', time: 'gestern',
    type: 'run', title: 'Long Run',
    distance: '18.5 km', pace: '5:10 /km', duration: '1:35:45',
    kudos: 12, myKudos: false
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

function Avatar({ initials, size = 36, highlight }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: highlight ? LIME : '#222',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      font: `700 ${size * 0.35}px 'Space Grotesk'`,
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
    <button
      onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'center', gap: '5px',
        background: active ? 'rgba(182,242,62,0.12)' : 'rgba(255,255,255,0.05)',
        border: active ? `1px solid rgba(182,242,62,0.4)` : '1px solid #2A2A2A',
        borderRadius: '20px',
        padding: '5px 12px',
        cursor: 'pointer',
        transition: 'all 0.15s'
      }}
    >
      <span style={{ fontSize: '14px' }}>👏</span>
      <span style={{
        font: `600 12px 'Hanken Grotesk'`,
        color: active ? LIME : '#888'
      }}>
        {count}
      </span>
    </button>
  )
}

export default function Community() {
  const [activeTab, setActiveTab] = useState('feed')
  const [feed, setFeed] = useState(FEED)

  const toggleKudos = (id) => {
    setFeed(prev => prev.map(item => {
      if (item.id !== id) return item
      const wasActive = item.myKudos
      return { ...item, myKudos: !wasActive, kudos: wasActive ? item.kudos - 1 : item.kudos + 1 }
    }))
  }

  return (
    <div style={{ minHeight: '100%', background: '#000', paddingBottom: '20px' }}>
      {/* Header */}
      <div style={{
        padding: '52px 20px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <Logo size={32} />
        <div style={{ font: "700 18px 'Space Grotesk'", letterSpacing: '-0.3px' }}>
          Community
        </div>
        <button style={{
          background: GRAY, border: 'none', borderRadius: '50%',
          width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>

      {/* Sub-tabs */}
      <div style={{
        display: 'flex', gap: '0', padding: '0 20px 20px'
      }}>
        {[
          { id: 'feed', label: 'Feed' },
          { id: 'leaderboard', label: 'Rangliste' },
          { id: 'challenges', label: 'Challenges' },
          { id: 'groups', label: 'Gruppen' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              flex: 1,
              padding: '8px 4px',
              background: 'none', border: 'none',
              borderBottom: activeTab === t.id ? `2px solid ${LIME}` : '2px solid #1A1A1A',
              color: activeTab === t.id ? LIME : '#555',
              font: `${activeTab === t.id ? '600' : '500'} 11px 'Hanken Grotesk'`,
              cursor: 'pointer',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Feed */}
      {activeTab === 'feed' && (
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {feed.map(item => (
            <div key={item.id} style={{
              background: GRAY, borderRadius: '16px', padding: '16px',
              border: '1px solid #2A2A2A'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <Avatar initials={item.avatar} size={38} />
                <div style={{ flex: 1 }}>
                  <div style={{ font: "600 14px 'Space Grotesk'", color: '#fff' }}>{item.user}</div>
                  <div style={{ font: "400 12px 'Hanken Grotesk'", color: '#555', marginTop: '1px' }}>{item.time}</div>
                </div>
                <div style={{
                  background: 'rgba(182,242,62,0.1)', borderRadius: '8px',
                  padding: '4px 8px',
                  font: "600 11px 'Space Grotesk'", color: LIME
                }}>
                  {item.title}
                </div>
              </div>

              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                gap: '8px', marginBottom: '14px'
              }}>
                {[
                  { label: 'Distanz', value: item.distance },
                  { label: 'Pace', value: item.pace },
                  { label: 'Zeit', value: item.duration },
                ].map(stat => (
                  <div key={stat.label} style={{
                    background: 'rgba(255,255,255,0.04)', borderRadius: '10px',
                    padding: '10px 8px', textAlign: 'center'
                  }}>
                    <div style={{ font: "700 14px 'Space Mono'", color: '#fff' }}>{stat.value}</div>
                    <div style={{ font: "400 10px 'Hanken Grotesk'", color: '#555', marginTop: '2px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <KudosButton
                  count={item.kudos}
                  active={item.myKudos}
                  onToggle={() => toggleKudos(item.id)}
                />
                <button style={{
                  background: 'none', border: '1px solid #2A2A2A',
                  borderRadius: '20px', padding: '5px 14px',
                  font: "500 12px 'Hanken Grotesk'", color: '#555',
                  cursor: 'pointer'
                }}>
                  Kommentieren
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div style={{ padding: '0 20px' }}>
          <div style={{
            background: GRAY, borderRadius: '16px', overflow: 'hidden',
            border: '1px solid #2A2A2A', marginBottom: '16px'
          }}>
            <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid #2A2A2A',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <span style={{ font: "700 14px 'Space Grotesk'", color: '#fff' }}>Diese Woche</span>
              <span style={{ font: "400 12px 'Hanken Grotesk'", color: '#555' }}>nach Distanz</span>
            </div>

            {FRIENDS.map((f, i) => (
              <div key={f.id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px',
                background: f.isMe ? 'rgba(182,242,62,0.06)' : 'transparent',
                borderBottom: i < FRIENDS.length - 1 ? '1px solid #161616' : 'none'
              }}>
                <div style={{
                  width: 24, textAlign: 'center',
                  font: `${i < 3 ? '700' : '500'} 14px 'Space Grotesk'`,
                  color: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : '#444'
                }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                </div>
                <Avatar initials={f.avatar} size={34} highlight={f.isMe} />
                <div style={{ flex: 1 }}>
                  <div style={{
                    font: `${f.isMe ? '700' : '600'} 13px 'Space Grotesk'`,
                    color: f.isMe ? LIME : '#fff'
                  }}>
                    {f.name}
                  </div>
                  <div style={{ font: "400 11px 'Hanken Grotesk'", color: '#555', marginTop: '1px' }}>
                    {f.runs} Läufe · 🔥 {f.streak} Tage
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ font: "700 14px 'Space Mono'", color: f.isMe ? LIME : '#fff' }}>
                    {f.distance}
                  </div>
                  <div style={{ font: "400 10px 'Hanken Grotesk'", color: '#555' }}>km</div>
                </div>
              </div>
            ))}
          </div>

          {/* Weekly summary */}
          <div style={{
            background: 'rgba(182,242,62,0.06)', border: `1px solid rgba(182,242,62,0.2)`,
            borderRadius: '14px', padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <div style={{ fontSize: '28px' }}>🏃</div>
            <div>
              <div style={{ font: "600 13px 'Space Grotesk'", color: LIME }}>Platz 4 diese Woche</div>
              <div style={{ font: "400 12px 'Hanken Grotesk'", color: '#888', marginTop: '2px' }}>
                Noch 2.7 km bis Platz 3 — du schaffst das!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Challenges */}
      {activeTab === 'challenges' && (
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ font: "600 13px 'Hanken Grotesk'", color: '#555', marginBottom: '4px', letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '11px' }}>
            Aktive Challenges
          </div>

          {CHALLENGES.map(c => {
            const pct = Math.min(100, Math.round((c.current / c.target) * 100))
            const unit = c.unit || 'km'
            return (
              <div key={c.id} style={{
                background: GRAY, borderRadius: '16px', padding: '18px',
                border: '1px solid #2A2A2A'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div>
                    <div style={{ font: "700 14px 'Space Grotesk'", color: '#fff', marginBottom: '4px' }}>{c.name}</div>
                    <div style={{ font: "400 12px 'Hanken Grotesk'", color: '#555' }}>
                      {c.participants} Teilnehmer · noch {c.daysLeft} Tage
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ font: "700 20px 'Space Mono'", color: LIME }}>{pct}%</div>
                  </div>
                </div>

                <div style={{
                  background: '#111', borderRadius: '99px',
                  height: '8px', overflow: 'hidden', marginBottom: '10px'
                }}>
                  <div style={{
                    width: `${pct}%`, height: '100%',
                    background: `linear-gradient(90deg, ${LIME}, #7cc518)`,
                    borderRadius: '99px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ font: "500 12px 'Hanken Grotesk'", color: '#888' }}>
                    {c.current} / {c.target} {unit}
                  </span>
                  <span style={{
                    font: "600 11px 'Space Grotesk'", color: '#000',
                    background: LIME, borderRadius: '20px', padding: '3px 10px'
                  }}>
                    Mitmachen
                  </span>
                </div>
              </div>
            )
          })}

          {/* Discover challenges */}
          <div style={{ font: "600 11px 'Hanken Grotesk'", color: '#555', letterSpacing: '0.5px', textTransform: 'uppercase', marginTop: '8px' }}>
            Weitere Challenges
          </div>
          {[
            { name: 'Halbmarathon Vorbereitung', participants: 89, emoji: '🎯' },
            { name: 'Frühaufsteher-Club 5am', participants: 31, emoji: '🌅' },
            { name: '10km unter 50 Min.', participants: 56, emoji: '⚡' },
          ].map((c, i) => (
            <div key={i} style={{
              background: GRAY, borderRadius: '14px', padding: '14px 16px',
              border: '1px solid #2A2A2A',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <div style={{ fontSize: '24px' }}>{c.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ font: "600 13px 'Space Grotesk'", color: '#fff' }}>{c.name}</div>
                <div style={{ font: "400 11px 'Hanken Grotesk'", color: '#555', marginTop: '2px' }}>
                  {c.participants} aktive Läufer
                </div>
              </div>
              <span style={{
                font: "500 11px 'Space Grotesk'", color: '#555',
                border: '1px solid #2A2A2A', borderRadius: '20px', padding: '4px 10px'
              }}>
                Beitreten
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Groups */}
      {activeTab === 'groups' && (
        <div style={{ padding: '0 20px' }}>
          <div style={{ font: "600 11px 'Hanken Grotesk'", color: '#555', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '12px' }}>
            Deine Gruppen
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {GROUPS.map(g => (
              <div key={g.id} style={{
                background: GRAY, borderRadius: '14px', padding: '14px 16px',
                border: '1px solid #2A2A2A',
                display: 'flex', alignItems: 'center', gap: '12px'
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '12px',
                  background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', border: '1px solid #2A2A2A'
                }}>
                  {g.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ font: "600 14px 'Space Grotesk'", color: '#fff' }}>{g.name}</div>
                  <div style={{ font: "400 11px 'Hanken Grotesk'", color: '#555', marginTop: '2px' }}>
                    {g.members} Mitglieder · zuletzt aktiv {g.recentRun}
                  </div>
                </div>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#444" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            ))}
          </div>

          <button style={{
            width: '100%', padding: '14px',
            background: 'none', border: `1.5px dashed #2A2A2A`,
            borderRadius: '14px',
            font: "600 14px 'Space Grotesk'", color: '#444',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}>
            <span style={{ fontSize: '18px' }}>+</span>
            Gruppe erstellen oder beitreten
          </button>

          <div style={{ font: "600 11px 'Hanken Grotesk'", color: '#555', letterSpacing: '0.5px', textTransform: 'uppercase', margin: '20px 0 12px' }}>
            Entdecken
          </div>
          {[
            { name: 'Tri-Athletes München', members: 78, emoji: '🏊' },
            { name: 'Ultramarathon DE', members: 203, emoji: '🏔️' },
            { name: 'Nachtläufer', members: 45, emoji: '🌙' },
          ].map((g, i) => (
            <div key={i} style={{
              background: GRAY, borderRadius: '14px', padding: '14px 16px',
              border: '1px solid #2A2A2A',
              display: 'flex', alignItems: 'center', gap: '12px',
              marginBottom: '10px'
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '12px',
                background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', border: '1px solid #2A2A2A'
              }}>
                {g.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ font: "600 14px 'Space Grotesk'", color: '#fff' }}>{g.name}</div>
                <div style={{ font: "400 11px 'Hanken Grotesk'", color: '#555', marginTop: '2px' }}>
                  {g.members} Mitglieder
                </div>
              </div>
              <span style={{
                font: "500 11px 'Space Grotesk'", color: '#000',
                background: LIME, borderRadius: '20px', padding: '4px 10px'
              }}>
                Folgen
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
