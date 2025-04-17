import { useState, useEffect } from 'react'

type Platform = 'mobile' | 'desktop'

export function usePlatformDetection(): Platform {
  const [platform, setPlatform] = useState<Platform>('desktop')

  useEffect(() => {
    // Function to detect platform
    const detectPlatform = () => {
      // Check if device has touch capability (primary indicator for mobile)
      const hasTouchCapability = 
        'maxTouchPoints' in navigator && 
        navigator.maxTouchPoints > 0

      // Check if it's a small screen (secondary indicator)
      const isSmallScreen = window.innerWidth <= 768

      // Consider it mobile if it has touch capability or small screen
      if (hasTouchCapability || isSmallScreen) {
        setPlatform('mobile')
      } else {
        setPlatform('desktop')
      }
    }

    // Detect on mount
    detectPlatform()

    // Re-detect on resize
    window.addEventListener('resize', detectPlatform)
    
    // Cleanup
    return () => window.removeEventListener('resize', detectPlatform)
  }, [])

  return platform
} 