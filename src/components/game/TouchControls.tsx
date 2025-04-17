import { useEffect } from 'react'
import { handleTouchStart, handleTouchMove, handleTouchEnd } from '@/game/input'

const TouchControls = () => {
  useEffect(() => {
    const touchStart = (e: TouchEvent) => handleTouchStart(e)
    const touchMove = (e: TouchEvent) => handleTouchMove(e)
    const touchEnd = (e: TouchEvent) => handleTouchEnd(e)
    
    document.addEventListener('touchstart', touchStart)
    document.addEventListener('touchmove', touchMove)
    document.addEventListener('touchend', touchEnd)
    
    return () => {
      document.removeEventListener('touchstart', touchStart)
      document.removeEventListener('touchmove', touchMove)
      document.removeEventListener('touchend', touchEnd)
    }
  }, [])
  
  return (
    // Transparent overlay for touch controls
    <div className="absolute top-0 left-0 w-full h-full z-10" />
  )
}

export default TouchControls 