const LIME = '#B6F23E'

export default function Logo({ size = 36, showWordmark = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{
        width: size, height: size,
        background: '#000',
        borderRadius: `${size * 0.22}px`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden',
      }}>
        <svg viewBox="0 0 56 56" width={size} height={size}>
          {/* E: Left vertical bar */}
          <rect x="4" y="4" width="7" height="48" rx="2" fill={LIME}/>
          {/* E: Top bar */}
          <rect x="4" y="4" width="27" height="7" rx="2" fill={LIME}/>
          {/* E: Middle bar (shorter) */}
          <rect x="4" y="24" width="20" height="6" rx="2" fill={LIME}/>
          {/* E: Bottom bar */}
          <rect x="4" y="45" width="27" height="7" rx="2" fill={LIME}/>
          {/* R: Spine (shared vertical bar, right side) */}
          <rect x="24" y="4" width="7" height="48" rx="2" fill={LIME}/>
          {/* R: Bowl with hollow center */}
          <path fill={LIME} fillRule="evenodd" d="M 31,4 C 52,4 52,31 31,31 Z M 31,12 C 43,12 43,23 31,23 Z"/>
          {/* R: Diagonal leg toward lower-left */}
          <path d="M 31,31 L 48,31 L 31,52 L 14,52 Z" fill={LIME}/>
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
