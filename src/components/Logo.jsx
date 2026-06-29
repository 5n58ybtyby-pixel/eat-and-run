const LIME = '#B6F23E'

export default function Logo({ size = 36, showWordmark = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{
        width: size, height: size,
        background: '#000',
        borderRadius: `${size * 0.22}px`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1.5px solid rgba(182,242,62,.25)',
        flexShrink: 0,
        overflow: 'hidden',
        boxShadow: '0 0 18px rgba(182,242,62,.15)'
      }}>
        <svg viewBox="0 0 56 56" width={size} height={size}>
          {/* E — lower-left (y 14→52) */}
          <rect x="3"  y="14" width="7"  height="38" rx="2" fill={LIME}/>
          <rect x="3"  y="14" width="22" height="7"  rx="2" fill={LIME}/>
          <rect x="3"  y="28" width="16" height="6"  rx="2" fill={LIME}/>
          <rect x="3"  y="45" width="22" height="7"  rx="2" fill={LIME}/>
          {/* R — upper-right (y 3→41), shifted up by 11px */}
          <rect x="26" y="3"  width="7"  height="38" rx="2" fill={LIME}/>
          <path d="M33 3 Q50 3 50 14 Q50 25 33 25 L33 19 Q43 19 43 14 Q43 9 33 9 Z" fill={LIME}/>
          <path d="M33 21 L47 41 L39 41 L27 21 Z" fill={LIME}/>
        </svg>
      </div>
      {showWordmark && (
        <div style={{ font: "700 15px 'Space Grotesk'", letterSpacing: '-0.3px' }}>
          Eat<span style={{ color: LIME }}>&</span>Run
        </div>
      )}
    </div>
  )
}
