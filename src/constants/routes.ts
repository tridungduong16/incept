export const ROUTES = {
  HOME: '/',
  MARKETS: '/markets',
  TRADE: '/trade',
  EVENT: '/markets/:eventId',
  CONFIRM: '/markets/:eventId/confirm',
  PORTFOLIO: '/portfolio',
  SETTINGS: '/settings',
  NOT_FOUND: '*',
} as const

export const buildEventRoute = (eventId: string) => `/markets/${eventId}`

export const buildConfirmRoute = (eventId: string) => `/markets/${eventId}/confirm`
