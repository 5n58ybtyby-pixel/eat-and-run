import { useState } from 'react'
import TabBar from './components/TabBar'
import Home from './screens/Home'
import Plan from './screens/Plan'
import Analyse from './screens/Analyse'
import Nutrition from './screens/Nutrition'
import Profile from './screens/Profile'

export default function App() {
  const [tab, setTab] = useState('home')

  const screens = {
    home: Home,
    plan: Plan,
    analyse: Analyse,
    nutrition: Nutrition,
    profile: Profile
  }

  const Screen = screens[tab]

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#050505',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '430px',
        height: '100dvh',
        background: '#000',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 0 80px rgba(0,0,0,0.8)'
      }}>
        <div
          key={tab}
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            paddingBottom: '80px',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <Screen navigate={setTab} />
        </div>
        <TabBar active={tab} onChange={setTab} />
      </div>
    </div>
  )
}
