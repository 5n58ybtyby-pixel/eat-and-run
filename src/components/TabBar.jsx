export default function TabBar({ active, onChange }) {
  const tabs = [
    {
      id: 'home',
      label: 'Start',
      icon: (color) => (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 11.5 12 4l8 7.5"/>
          <path d="M6 10v9h12v-9"/>
        </svg>
      )
    },
    {
      id: 'plan',
      label: 'Plan',
      icon: (color) => (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="4" width="14" height="17" rx="2"/>
          <path d="M9 9h6M9 13h6M9 17h3"/>
        </svg>
      )
    },
    {
      id: 'analyse',
      label: 'Analyse',
      icon: (color) => (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 19V5"/>
          <path d="M5 19h14"/>
          <path d="M9 16v-4M13 16V8M17 16v-6"/>
        </svg>
      )
    },
    {
      id: 'nutrition',
      label: 'Ernährung',
      icon: (color) => (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21c4-2 6-5 6-9a6 6 0 0 0-12 0c0 4 2 7 6 9Z"/>
          <path d="M12 8v5"/>
        </svg>
      )
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: (color) => (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4"/>
          <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"/>
        </svg>
      )
    }
  ]

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '430px',
      background: 'rgba(0,0,0,0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid #1A1A1A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '10px 0 calc(10px + env(safe-area-inset-bottom, 0px))',
      zIndex: 100
    }}>
      {tabs.map(tab => {
        const isActive = active === tab.id
        const color = isActive ? '#B6F23E' : '#5A5A5A'
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'opacity 0.15s',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            {tab.icon(color)}
            <span style={{
              font: `${isActive ? '600' : '500'} 10px 'Hanken Grotesk'`,
              color,
              transition: 'color 0.15s',
              letterSpacing: '0.2px'
            }}>
              {tab.label}
            </span>
            {isActive && (
              <div style={{
                position: 'absolute',
                bottom: 'calc(0px + env(safe-area-inset-bottom, 0px))',
                width: '20px',
                height: '2px',
                background: '#B6F23E',
                borderRadius: '999px',
                marginTop: '-2px'
              }} />
            )}
          </button>
        )
      })}
    </div>
  )
}
