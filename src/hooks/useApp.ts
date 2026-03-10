import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setDeviceType } from '@/store/features/app/appSlice'
import { selectIsDesktop, selectIsMobile, selectIsTablet } from '@/store/selectors'

export const useApp = () => {
  const dispatch = useDispatch()
  const isMobile = useSelector(selectIsMobile)
  const isTablet = useSelector(selectIsTablet)
  const isDesktop = useSelector(selectIsDesktop)

  useEffect(() => {
    const handleResize = () => {
      dispatch(setDeviceType({ width: window.innerWidth }))
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [dispatch])

  return { isMobile, isTablet, isDesktop }
}
