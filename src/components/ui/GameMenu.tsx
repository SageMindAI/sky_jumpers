import React from 'react'
import { usePlatformDetection } from '@/hooks/usePlatformDetection'

interface GameMenuProps {
  onStart: () => void
}

const GameMenu: React.FC<GameMenuProps> = ({ onStart }) => {
  const platform = usePlatformDetection()
  
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Sky Jumpers</h1>
      <h2 className="text-xl mb-8">The Battle Above the Blocks</h2>
      
      <div className="max-w-md mb-8">
        <p className="mb-4">Jump between buildings, dodge enemies, and collect power-ups in this fast-paced mobile game!</p>
      </div>
      
      <button
        className="bg-primary text-white px-8 py-4 rounded-lg text-xl font-bold"
        onClick={onStart}
      >
        Play Now
      </button>
      
      <div className="mt-6 text-sm bg-black bg-opacity-50 p-3 rounded-lg text-white">
        {platform === 'mobile' ? (
          <p>Controls: Tap to jump | Swipe to move</p>
        ) : (
          <p>Controls: Space/Up to jump | Left/Right to move</p>
        )}
      </div>
    </div>
  )
}

export default GameMenu 