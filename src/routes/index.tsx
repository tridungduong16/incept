import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ROUTES, buildEventRoute } from '@/constants/routes'
import { allMarkets } from '@/data/tradingFlow'
import EventDetails from '@/pages/EventDetails'
import MainLayout from '@/layouts/MainLayout'
import Home from '@/pages/Home'
import MarketsLobby from '@/pages/MarketsLobby'
import NotFound from '@/pages/NotFound'
import OrderConfirmation from '@/pages/OrderConfirmation'
import Portfolio from '@/pages/Portfolio'
import Settings from '@/pages/Settings'
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
        element: <PlatformGate />,
        children: [
          {
            path: ROUTES.MARKETS,
            element: <MarketsLobby />,
          },
          {
            path: ROUTES.TRADE,
            element: <Navigate to={buildEventRoute(allMarkets[0].routeId)} replace />,
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
            path: ROUTES.SETTINGS,
            element: <Settings />,
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
