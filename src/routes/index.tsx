import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ROUTES, buildTradeRoute } from '@/constants/routes'
import { buildAIStudioFeatureRoute, buildSocialFeatureRoute } from '@/constants/routes'
import { aiStudioFeatures } from '@/data/aiStudio'
import { allMarkets } from '@/data/tradingFlow'
import AIStudioFeature from '@/pages/AIStudioFeature'
import EventDetails from '@/pages/EventDetails'
import MainLayout from '@/layouts/MainLayout'
import Home from '@/pages/Home'
import MarketsLobby from '@/pages/MarketsLobby'
import NotFound from '@/pages/NotFound'
import OrderConfirmation from '@/pages/OrderConfirmation'
import Portfolio from '@/pages/Portfolio'
import { socialFeatures } from '@/data/social'
import SocialFeature from '@/pages/SocialFeature'
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
            element: <Navigate to={buildTradeRoute(allMarkets[0].routeId)} replace />,
          },
          {
            path: ROUTES.TRADE_EVENT,
            element: <EventDetails />,
          },
          {
            path: ROUTES.TRADE_CONFIRM,
            element: <OrderConfirmation />,
          },
          {
            path: ROUTES.PORTFOLIO,
            element: <Portfolio />,
          },
          {
            path: ROUTES.AI_STUDIO,
            element: <Navigate to={buildAIStudioFeatureRoute(aiStudioFeatures[0].id)} replace />,
          },
          {
            path: ROUTES.AI_STUDIO_FEATURE,
            element: <AIStudioFeature />,
          },
          {
            path: ROUTES.SOCIAL,
            element: <Navigate to={buildSocialFeatureRoute(socialFeatures[0].id)} replace />,
          },
          {
            path: ROUTES.SOCIAL_FEATURE,
            element: <SocialFeature />,
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
