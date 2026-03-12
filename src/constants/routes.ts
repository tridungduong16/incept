export const ROUTES = {
  HOME: '/',
  MARKETS: '/markets',
  TRADE: '/trade',
  TRADE_EVENT: '/trade/:eventId',
  TRADE_CONFIRM: '/trade/:eventId/confirm',
  PORTFOLIO: '/portfolio',
  AI_STUDIO: '/ai-studio',
  AI_STUDIO_FEATURE: '/ai-studio/:featureId',
  SOCIAL: '/social',
  SOCIAL_FEATURE: '/social/:featureId',
  SETTINGS: '/settings',
  NOT_FOUND: '*',
} as const

export const buildTradeRoute = (eventId: string) => `/trade/${eventId}`

export const buildConfirmRoute = (eventId: string) => `/trade/${eventId}/confirm`

export const buildAIStudioFeatureRoute = (featureId: string) => `/ai-studio/${featureId}`

export const buildSocialFeatureRoute = (featureId: string) => `/social/${featureId}`
