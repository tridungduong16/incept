export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  MARKETS: '/markets',
  EVENT: '/markets/:eventId',
  CONFIRM: '/markets/:eventId/confirm',
  PORTFOLIO: '/portfolio',
  SETTLEMENT: '/markets/:eventId/settlement',
  NOT_FOUND: '*',
} as const

export const buildEventRoute = (eventId: string) => `/markets/${eventId}`

export const buildConfirmRoute = (eventId: string) => `/markets/${eventId}/confirm`

export const buildSettlementRoute = (eventId: string) => `/markets/${eventId}/settlement`
