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
          {/* E — bold block letter */}
          <rect x="6"  y="10" width="7"  height="36" rx="2" fill={LIME}/>
          <rect x="6"  y="10" width="20" height="7"  rx="2" fill={LIME}/>
          <rect x="6"  y="24.5" width="16" height="7" rx="2" fill={LIME}/>
          <rect x="6"  y="39" width="20" height="7"  rx="2" fill={LIME}/>
          {/* R — bold block letter */}
          <rect x="31" y="10" width="7"  height="36" rx="2" fill={LIME}/>
          {/* R bowl */}
          <path d="M38 10 Q52 10 52 21 Q52 32 38 32 L38 25 Q44 25 44 21 Q44 17 38 17 Z" fill={LIME}/>
          {/* R leg */}
          <path d="M38 29 L50 46 L42 46 L31 29 Z" fill={LIME}/>
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
