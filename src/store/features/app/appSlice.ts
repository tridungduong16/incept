import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface AppState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

const initialState: AppState = {
  isMobile: false,
  isTablet: false,
  isDesktop: true,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setDeviceType(state, action: PayloadAction<{ width: number }>) {
      const { width } = action.payload
      state.isMobile = width < 768
      state.isTablet = width >= 768 && width < 992
      state.isDesktop = width >= 992
    },
  },
})

export const { setDeviceType } = appSlice.actions
export default appSlice.reducer
