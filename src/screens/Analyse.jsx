import { useState } from 'react'

const LIME = '#B6F23E'

const weekData = [
  { label: 'Mo', value: 8.2, today: false },
  { label: 'Di', value: 10.0, today: false },
  { label: 'Mi', value: 0, today: false },
  { label: 'Do', value: 6.0, today: false },
  { label: 'Fr', value: 0, today: true },
  { label: 'Sa', value: 0, today: false },
  { label: 'So', value: 0, today: false },
]

const monthData = [
  { label: 'KW21', value: 32 },
  { label: 'KW22', value: 38 },
  { label: 'KW23', value: 35 },
  { label: 'KW24', value: 28, today: true },
]

function BarChart({ data, unit = 'km' }) {
  const maxVal = Math.max(...data.map(d => d.value), 1)
  const barW = 28
  const gap = 8
  const chartH = 110
  const totalW = data.length * (barW + gap) - gap

  return (
    <div style={{ overflowX: 'auto', paddingBottom: '4px' }}>
      <svg
        width={Math.max(totalW + 20, 300)}
        height={chartH + 36}
        viewBox={`0 0 ${Math.max(totalW + 20, 300)} ${chartH + 36}`}
        style={{ display: 'block', minWidth: '100%' }}
      >
        {data.map((d, i) => {
          const barH = d.value > 0 ? Math.max((d.value / maxVal) * chartH, 4) : 0
          const x = i * (barW + gap)
          const y = chartH - barH
          const isActive = d.today
          const color = isActive ? LIME : d.value > 0 ? '#1E1E1E' : '#111'
          const textColor = isActive ? LIME : d.value > 0 ? '#7A7A7A' : '#333'

          return (
            <g key={i}>
              {/* Background track */}
              <rect
                x={x} y={0}
                width={barW} height={chartH}
                rx="8" fill="#0D0D0D"
              />
              {/* Value bar */}
              {d.value > 0 && (
                <rect
                  x={x} y={y}
                  width={barW} height={barH}
                  rx="8" fill={color}
                />
              )}
              {/* Day label */}
              <text
                x={x + barW / 2} y={chartH + 18}
                textAnchor="middle"
                fill={isActive ? LIME : '#4A4A4A'}
                fontSize="11" fontFamily="Hanken Grotesk"
                fontWeight={isActive ? '600' : '400'}
              >
                {d.label}
              </text>
              {/* Value */}
              {d.value > 0 && (
                <text
                  x={x + barW / 2} y={y - 5}
                  textAnchor="middle"
                  fill={textColor}
                  fontSize="10" fontFamily="Space Grotesk" fontWeight="700"
                >
                  {d.value}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function PaceChart() {
  const pts = [
    { x: 0, pace: 6.2 }, { x: 1, pace: 6.0 }, { x: 2, pace: 5.9 },
    { x: 3, pace: 5.85 }, { x: 4, pace: 5.7 }, { x: 5, pace: 5.65 },
    { x: 6, pace: 5.58 }, { x: 7, pace: 5.5 }
  ]
  const w = 280, h = 80
  const minP = 5.4, maxP = 6.4
  const toY = (p) => ((p - minP) / (maxP - minP)) * h
  const toX = (i) => (i / (pts.length - 1)) * w

  const pathD = pts.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${toX(i)} ${h - toY(p.pace)}`
  ).join(' ')

  const areaD = `${pathD} L ${w} ${h} L 0 ${h} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h + 20}`} style={{ width: '100%' }}>
      <defs>
        <linearGradient id="paceGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={LIME} stopOpacity="0.15"/>
          <stop offset="100%" stopColor={LIME} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#paceGrad)"/>
      <path d={pathD} fill="none" stroke={LIME} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p, i) => (
        <circle key={i} cx={toX(i)} cy={h - toY(p.pace)} r={i === pts.length - 1 ? 4 : 2.5}
          fill={i === pts.length - 1 ? LIME : '#000'} stroke={LIME} strokeWidth="1.5"/>
      ))}
      <text x={w - 2} y={h - toY(pts[pts.length-1].pace) - 8}
        textAnchor="end" fill={LIME} fontSize="10" fontFamily="Space Grotesk" fontWeight="700">
        5:30/km
      </text>
    </svg>
  )
}

export default function Analyse() {
  const [period, setPeriod] = useState('woche')

  const metrics = [
    { label: 'Gesamt km', value: '28,4', unit: 'km', color: LIME, sub: '+3.2 ggü. Vorwoche' },
    { label: 'Ø Tempo', value: '5:50', unit: '/km', color: '#fff', sub: '10 s schneller' },
    { label: 'Gesamtzeit', value: '2h 42m', unit: '', color: '#fff', sub: '3 Einheiten' },
    { label: 'Höhenmeter', value: '320', unit: 'm', color: '#9B8CFA', sub: '↑ diese Woche' },
  ]

  const zones = [
    { name: 'Easy', color: '#5AA9F0', pct: 42 },
    { name: 'Aerob', color: LIME, pct: 30 },
    { name: 'Tempo', color: '#F5A524', pct: 18 },
    { name: 'VO₂max', color: '#F2555A', pct: 10 },
  ]

  const RIC = { fill:'none', stroke:'#7A7A7A', strokeWidth:'1.5', strokeLinecap:'round', strokeLinejoin:'round' }
  const records = [
    { label: 'Längster Lauf',      value: '14,0 km', icon: <svg viewBox="0 0 20 20" width="17" height="17" {...RIC}><path d="M3 15C5 11 7 13 9 10C11 7 13 9 17 6"/><circle cx="3" cy="15" r="1.5" fill="#7A7A7A" stroke="none"/><circle cx="17" cy="6" r="1.5" fill="#7A7A7A" stroke="none"/></svg> },
    { label: 'Bestes 5-km-Tempo',  value: '28:12',   icon: <svg viewBox="0 0 20 20" width="17" height="17" {...RIC}><polygon points="8,2 2,10 8,10 7,18 16,8 10,8" fill="#7A7A7A" stroke="none"/></svg> },
    { label: 'Bestes 10-km-Tempo', value: '58:40',   icon: <svg viewBox="0 0 20 20" width="17" height="17" {...RIC}><circle cx="12" cy="4" r="2"/><path d="M10 7L12 6L14 9M10 7L8.5 12M12 9L11 13.5M8.5 12L7 15M12 9L14.5 11.5"/></svg> },
    { label: 'Monatsdistanz',      value: '112 km',  icon: <svg viewBox="0 0 20 20" width="17" height="17" {...RIC}><rect x="2" y="4" width="16" height="13" rx="2"/><line x1="2" y1="8.5" x2="18" y2="8.5"/><line x1="6.5" y1="2" x2="6.5" y2="6"/><line x1="13.5" y1="2" x2="13.5" y2="6"/><circle cx="7" cy="12" r="1" fill="#7A7A7A" stroke="none"/><circle cx="10" cy="12" r="1" fill="#7A7A7A" stroke="none"/><circle cx="13" cy="12" r="1" fill="#7A7A7A" stroke="none"/></svg> },
  ]

  return (
    <div style={{ padding: '0 0 8px' }}>
      {/* Header */}
      <div style={{ padding: '56px 20px 20px' }}>
        <div style={{ font: "700 11px 'Space Mono'", letterSpacing: '2px', color: '#5A5A5A', marginBottom: '8px' }}>
          TRAININGSANALYSE
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ font: "700 28px 'Space Grotesk'", letterSpacing: '-0.6px' }}>Analyse</div>
          {/* Period selector */}
          <div style={{
            display: 'inline-flex',
            background: '#111', border: '1px solid #1E1E1E',
            borderRadius: '10px', padding: '3px'
          }}>
            {['woche', 'monat'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: period === p ? LIME : 'transparent',
                  color: period === p ? '#000' : '#7A7A7A',
                  font: `600 13px 'Hanken Grotesk'`,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  textTransform: 'capitalize'
                }}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main chart */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          background: '#0D0D0D', border: '1px solid #1E1E1E',
          borderRadius: '20px', padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
            <div style={{ font: "700 11px 'Space Mono'", letterSpacing: '1.5px', color: '#5A5A5A' }}>
              DISTANZ (KM)
            </div>
            <div style={{ font: "700 22px 'Space Grotesk'", color: LIME, letterSpacing: '-0.3px' }}>
              28,4 <span style={{ font: "400 13px 'Hanken Grotesk'", color: '#5A5A5A' }}>km</span>
            </div>
          </div>
          <BarChart data={period === 'woche' ? weekData : monthData} />
        </div>
      </div>

      {/* Metrics grid */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {metrics.map(m => (
            <div key={m.label} style={{
              background: '#0D0D0D', border: '1px solid #1E1E1E',
              borderRadius: '16px', padding: '16px'
            }}>
              <div style={{ font: "400 11px 'Hanken Grotesk'", color: '#5A5A5A', marginBottom: '6px' }}>{m.label}</div>
              <div style={{ font: "700 22px 'Space Grotesk'", color: m.color, letterSpacing: '-0.5px', lineHeight: 1 }}>
                {m.value}
                <span style={{ font: "400 12px 'Hanken Grotesk'", color: '#5A5A5A' }}> {m.unit}</span>
              </div>
              <div style={{ font: "400 11px 'Hanken Grotesk'", color: LIME, marginTop: '5px', opacity: 0.7 }}>
                {m.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pace trend */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          background: '#0D0D0D', border: '1px solid #1E1E1E',
          borderRadius: '20px', padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
            <div style={{ font: "700 11px 'Space Mono'", letterSpacing: '1.5px', color: '#5A5A5A' }}>
              TEMPO-TREND
            </div>
            <div style={{
              background: 'rgba(182,242,62,.1)', border: '1px solid rgba(182,242,62,.2)',
              borderRadius: '999px', padding: '3px 10px',
              font: "600 11px 'Hanken Grotesk'", color: LIME
            }}>
              ↑ Verbesserung
            </div>
          </div>
          <PaceChart />
          <div style={{ font: "400 12px 'Hanken Grotesk'", color: '#5A5A5A', marginTop: '6px', textAlign: 'center' }}>
            Ø Tempo der letzten 8 Wochen · von 6:12 auf 5:30 /km
          </div>
        </div>
      </div>

      {/* Training zones */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          background: '#0D0D0D', border: '1px solid #1E1E1E',
          borderRadius: '20px', padding: '20px'
        }}>
          <div style={{ font: "700 11px 'Space Mono'", letterSpacing: '1.5px', color: '#5A5A5A', marginBottom: '16px' }}>
            TRAININGSZONEN · DIESE WOCHE
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {zones.map(z => (
              <div key={z.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 52, font: "400 12px 'Hanken Grotesk'", color: '#7A7A7A' }}>{z.name}</div>
                <div style={{ flex: 1, height: 8, background: '#1A1A1A', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${z.pct}%`, background: z.color, borderRadius: '999px' }} />
                </div>
                <div style={{ width: 32, textAlign: 'right', font: "600 12px 'Space Grotesk'", color: z.color }}>
                  {z.pct}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personal records */}
      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ font: "700 11px 'Space Mono'", letterSpacing: '2px', color: '#5A5A5A', marginBottom: '12px' }}>
          PERSÖNLICHE BESTLEISTUNGEN
        </div>
        <div style={{
          background: '#0D0D0D', border: '1px solid #1E1E1E',
          borderRadius: '18px', overflow: 'hidden'
        }}>
          {records.map((r, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px',
              borderBottom: i < records.length - 1 ? '1px solid #171717' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '18px' }}>{r.icon}</div>
                <div style={{ font: "400 13.5px 'Hanken Grotesk'", color: '#B0B0B0' }}>{r.label}</div>
              </div>
              <div style={{ font: "600 14px 'Space Grotesk'", color: '#fff' }}>{r.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
