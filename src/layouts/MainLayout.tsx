import { Outlet } from 'react-router-dom'
import AIAssistant from '@/components/AIAssistant'
import { useApp } from '@/hooks/useApp'

const MainLayout = () => {
  useApp()

  return (
    <div className="app-layout">
      <main>
        <Outlet />
      </main>
      <AIAssistant />
    </div>
  )
}

export default MainLayout
