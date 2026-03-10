import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { hasPlatformAccess } from '@/utils/platformAccess'

const PlatformGate = () => {
  const location = useLocation()

  if (!hasPlatformAccess()) {
    return <Navigate to={ROUTES.HOME} replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export default PlatformGate
