import { Outlet } from 'react-router-dom'
import { useApp } from '@/hooks/useApp'

const MainLayout = () => {
  useApp()

  return (
    <div className="app-layout">
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
