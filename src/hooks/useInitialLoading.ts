import { useEffect, useState } from 'react'

const useInitialLoading = (delay = 650): boolean => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false)
    }, delay)

    return () => {
      window.clearTimeout(timer)
    }
  }, [delay])

  return isLoading
}

export default useInitialLoading
