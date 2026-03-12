export const ROUTES = {
  HOME: '/',
  MARKETS: '/markets',
  TRADE: '/trade',
  EVENT: '/markets/:eventId',
  CONFIRM: '/markets/:eventId/confirm',
  PORTFOLIO: '/portfolio',
  AI_STUDIO: '/ai-studio',
  AI_STUDIO_FEATURE: '/ai-studio/:featureId',
  SOCIAL: '/social',
  SOCIAL_FEATURE: '/social/:featureId',
  SETTINGS: '/settings',
  NOT_FOUND: '*',
} as const

export const buildEventRoute = (eventId: string) => `/markets/${eventId}`

export const buildConfirmRoute = (eventId: string) => `/markets/${eventId}/confirm`

export const buildAIStudioFeatureRoute = (featureId: string) => `/ai-studio/${featureId}`

export const buildSocialFeatureRoute = (featureId: string) => `/social/${featureId}`
