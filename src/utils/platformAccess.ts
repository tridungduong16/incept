const ACCESS_KEY = 'incept-platform-access'

export const hasPlatformAccess = () => {
  if (typeof window === 'undefined') {
    return false
  }

  return window.sessionStorage.getItem(ACCESS_KEY) === 'granted'
}

export const grantPlatformAccess = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(ACCESS_KEY, 'granted')
}

export const revokePlatformAccess = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.removeItem(ACCESS_KEY)
}
