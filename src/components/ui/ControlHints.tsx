import React from 'react'
import { usePlatformDetection } from '@/hooks/usePlatformDetection'

const ControlHints: React.FC = () => {
  const platform = usePlatformDetection()
  
  return (
    <div className="absolute bottom-4 left-0 right-0 mx-auto text-center p-2 bg-black bg-opacity-50 text-white rounded-lg max-w-sm">
      {platform === 'mobile' ? (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">Mobile Controls:</p>
          <p className="text-xs">• Tap to jump</p>
          <p className="text-xs">• Swipe left/right to move</p>
          <p className="text-xs">• Swipe up for higher jump</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">Keyboard Controls:</p>
          <p className="text-xs">• Space / Up Arrow to jump</p>
          <p className="text-xs">• Left / Right Arrows to move</p>
        </div>
      )}
    </div>
  )
}

export default ControlHints 