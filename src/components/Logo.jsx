const LIME = '#B6F23E'

export default function Logo({ size = 36, showWordmark = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <img
        src="/er-logo.png"
        alt="Eat&Run"
        style={{
          width: size,
          height: size,
          borderRadius: `${size * 0.22}px`,
          flexShrink: 0,
          display: 'block',
          objectFit: 'cover',
        }}
      />
      {showWordmark && (
        <div style={{ font: "700 15px 'Space Grotesk'", letterSpacing: '-0.3px' }}>
          Eat<span style={{ color: LIME }}>&</span>Run
        </div>
      )}
    </div>
  )
}
