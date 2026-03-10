import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import EventDetails from '@/pages/EventDetails'
import MainLayout from '@/layouts/MainLayout'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import MarketsLobby from '@/pages/MarketsLobby'
import NotFound from '@/pages/NotFound'
import OrderConfirmation from '@/pages/OrderConfirmation'
import Portfolio from '@/pages/Portfolio'
import Settlement from '@/pages/Settlement'
import PlatformGate from '@/routes/PlatformGate'

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <Home />,
      },
      {
        path: ROUTES.LOGIN,
        element: <Login />,
      },
      {
        element: <PlatformGate />,
        children: [
          {
            path: ROUTES.MARKETS,
            element: <MarketsLobby />,
          },
          {
            path: ROUTES.EVENT,
            element: <EventDetails />,
          },
          {
            path: ROUTES.CONFIRM,
            element: <OrderConfirmation />,
          },
          {
            path: ROUTES.PORTFOLIO,
            element: <Portfolio />,
          },
          {
            path: ROUTES.SETTLEMENT,
            element: <Settlement />,
          },
        ],
      },
      {
        path: ROUTES.NOT_FOUND,
        element: <NotFound />,
      },
    ],
  },
])
