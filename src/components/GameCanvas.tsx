import { useEffect, useRef, useState } from 'react'
import { initGame, resetPlayerToStartingPlatform } from '@/game/engine'
import TouchControls from '@/components/game/TouchControls'
import ControlHints from '@/components/ui/ControlHints'
import { usePlatformDetection } from '@/hooks/usePlatformDetection'

const GAME_VERSION = '0.1.0'

const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showHints, setShowHints] = useState(true)
  const platform = usePlatformDetection()
  
  // Function to reset player position
  const handleResetPlayer = () => {
    resetPlayerToStartingPlatform()
  }
  
  useEffect(() => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const game = initGame(canvas)
    
    // Hide hints after 5 seconds
    const timer = setTimeout(() => {
      setShowHints(false)
    }, 5000)
    
    return () => {
      // Cleanup game resources when component unmounts
      game.cleanup()
      clearTimeout(timer)
    }
  }, [])
  
  return (
    <div className="relative w-full h-screen">
      <canvas 
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
      <TouchControls />
      
      {/* Control hints */}
      {showHints && <ControlHints />}
      
      {/* Hints toggle button */}
      <button 
        className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center"
        onClick={() => setShowHints(!showHints)}
        aria-label={showHints ? "Hide controls" : "Show controls"}
      >
        {showHints ? "✕" : "?"}
      </button>
      
      {/* Reset player button */}
      <button 
        className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded-md flex items-center justify-center text-sm"
        onClick={handleResetPlayer}
      >
        Reset Player (R)
      </button>
      
      {/* Version and platform indicator */}
      <div className="absolute bottom-1 right-1 text-xs text-white bg-black bg-opacity-30 p-1 rounded">
        v{GAME_VERSION} • {platform} mode
      </div>
    </div>
  )
}

export default GameCanvas 