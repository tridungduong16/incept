import type { RootState } from './index'

export const selectIsMobile = (state: RootState) => state.app.isMobile
export const selectIsTablet = (state: RootState) => state.app.isTablet
export const selectIsDesktop = (state: RootState) => state.app.isDesktop
