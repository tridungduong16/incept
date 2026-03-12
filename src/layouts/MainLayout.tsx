import { Outlet, useLocation } from 'react-router-dom'
import AIAssistant from '@/components/AIAssistant'
import { useApp } from '@/hooks/useApp'

const MainLayout = () => {
  useApp()
  const location = useLocation()

  return (
    <div className="app-layout">
      <main key={location.pathname} className="app-main pageTransition">
        <Outlet />
      </main>
      <AIAssistant />
    </div>
  )
}

export default MainLayout
