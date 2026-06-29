const LIME = '#B6F23E'

const TABS = [
  {
    id: 'home',
    label: 'Start',
    icon: (c) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9h12v-9"/>
      </svg>
    )
  },
  {
    id: 'training',
    label: 'Training',
    icon: (c) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    )
  },
  {
    id: 'nutrition',
    label: 'Ernährung',
    icon: (c) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21c4-2 6-5 6-9a6 6 0 0 0-12 0c0 4 2 7 6 9Z"/><path d="M12 8v5"/>
      </svg>
    )
  },
  {
    id: 'community',
    label: 'Community',
    icon: (c) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="7" r="3"/><path d="M3 21v-2a5 5 0 0 1 5-5h2"/>
        <circle cx="17" cy="11" r="3"/><path d="M14 21v-1a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v1"/>
      </svg>
    )
  },
  {
    id: 'profile',
    label: 'Profil',
    icon: (c) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"/>
      </svg>
    )
  }
]

export default function TabBar({ active, onChange }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '430px',
      background: 'rgba(0,0,0,0.94)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid #1A1A1A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '10px 0 calc(10px + env(safe-area-inset-bottom, 0px))',
      zIndex: 100
    }}>
      {TABS.map(tab => {
        const isActive = active === tab.id
        const color = isActive ? LIME : '#5A5A5A'
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '4px',
              padding: '4px 10px',
              background: 'none', border: 'none', cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
              position: 'relative'
            }}
          >
            {tab.icon(color)}
            <span style={{
              font: `${isActive ? '600' : '500'} 9.5px 'Hanken Grotesk'`,
              color, transition: 'color 0.15s', letterSpacing: '0.1px'
            }}>
              {tab.label}
            </span>
            {isActive && (
              <div style={{
                position: 'absolute', bottom: -10,
                width: 18, height: 2,
                background: LIME, borderRadius: '999px'
              }} />
            )}
          </button>
        )
      })}
    </div>
  )
}
