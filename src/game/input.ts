import { resetPlayerToStartingPlatform } from './engine'

// Input state
const inputState = {
  touchStartY: 0,
  touchStartX: 0,
  swipeThreshold: 50,
  isMobile: false,
  keyDown: {
    left: false,
    right: false,
    up: false
  },
  game: null as any
}

// Detect if the user is on a mobile device
function detectMobile(): boolean {
  return (
    'maxTouchPoints' in navigator && 
    navigator.maxTouchPoints > 0
  ) || window.innerWidth <= 768
}

// Setup input handlers
export function setupInputHandlers(game: any) {
  inputState.game = game
  inputState.isMobile = detectMobile()
  
  // Adjust swipe threshold based on device
  inputState.swipeThreshold = inputState.isMobile ? 30 : 50
  
  // Listen for orientation or resize changes
  window.addEventListener('resize', () => {
    inputState.isMobile = detectMobile()
  })
}

// Touch handlers
export function handleTouchStart(e: TouchEvent) {
  if (!inputState.game) return
  
  const touch = e.touches[0]
  inputState.touchStartY = touch.clientY
  inputState.touchStartX = touch.clientX
}

export function handleTouchMove(e: TouchEvent) {
  if (!inputState.game) return
  
  // Prevent scrolling
  e.preventDefault()
}

export function handleTouchEnd(e: TouchEvent) {
  if (!inputState.game || !inputState.game.state.entities.player) return
  
  const touch = e.changedTouches[0]
  const diffY = inputState.touchStartY - touch.clientY
  const diffX = touch.clientX - inputState.touchStartX
  
  // Swipe up = jump (more sensitive on mobile)
  if (diffY > inputState.swipeThreshold) {
    inputState.game.state.entities.player.jump()
  }
  
  // Swipe left/right = move
  if (Math.abs(diffX) > inputState.swipeThreshold) {
    const force = Math.min(1.5, Math.abs(diffX) / 100); // Stronger swipe = faster movement
    if (diffX > 0) {
      inputState.game.state.entities.player.moveRight(force)
      
      // Stop movement after a short time (simulates a swipe)
      setTimeout(() => {
        if (inputState.game && inputState.game.state.entities.player) {
          inputState.game.state.entities.player.stopMoving()
        }
      }, 300)
    } else {
      inputState.game.state.entities.player.moveLeft(force)
      
      // Stop movement after a short time (simulates a swipe)
      setTimeout(() => {
        if (inputState.game && inputState.game.state.entities.player) {
          inputState.game.state.entities.player.stopMoving()
        }
      }, 300)
    }
  }
  
  // Short tap = simple jump
  if (Math.abs(diffY) < 20 && Math.abs(diffX) < 20) {
    inputState.game.state.entities.player.jump()
  }
}

// Keyboard handlers for testing on desktop
export function setupKeyboardHandlers(game: any) {
  inputState.game = game // Ensure game is set for keyboard controls too
  
  window.addEventListener('keydown', (e) => {
    if (!inputState.game || !inputState.game.state.entities.player) return
    
    switch (e.key) {
      case ' ':
      case 'ArrowUp':
        inputState.keyDown.up = true
        inputState.game.state.entities.player.jump()
        break
      case 'ArrowLeft':
        inputState.keyDown.left = true
        inputState.game.state.entities.player.moveLeft()
        break
      case 'ArrowRight':
        inputState.keyDown.right = true
        inputState.game.state.entities.player.moveRight()
        break
      case 'r':
      case 'R':
        // Reset player position if stuck
        if (typeof resetPlayerToStartingPlatform === 'function') {
          resetPlayerToStartingPlatform();
        } else if (inputState.game && inputState.game.state.entities.buildings 
                  && inputState.game.state.entities.buildings[0]) {
          const startingPlatform = inputState.game.state.entities.buildings[0];
          const player = inputState.game.state.entities.player;
          
          // Reset player position and velocity
          player.x = startingPlatform.x + startingPlatform.width / 2 - 15
          player.y = startingPlatform.y - 50
          player.velocityY = 0
          player.velocityX = 0
          player.isJumping = false
        }
        break;
    }
  })
  
  window.addEventListener('keyup', (e) => {
    if (!inputState.game || !inputState.game.state.entities.player) return
    
    switch (e.key) {
      case ' ':
      case 'ArrowUp':
        inputState.keyDown.up = false
        break
      case 'ArrowLeft':
        inputState.keyDown.left = false
        if (!inputState.keyDown.right) {
          inputState.game.state.entities.player.stopMoving()
        } else {
          inputState.game.state.entities.player.moveRight()
        }
        break
      case 'ArrowRight':
        inputState.keyDown.right = false
        if (!inputState.keyDown.left) {
          inputState.game.state.entities.player.stopMoving()
        } else {
          inputState.game.state.entities.player.moveLeft()
        }
        break
    }
  })
}

// Helper function to move player - kept for backward compatibility
function movePlayer(amount: number) {
  if (!inputState.game || !inputState.game.state.entities.player) return
  
  const player = inputState.game.state.entities.player
  if (amount > 0) {
    player.moveRight()
  } else {
    player.moveLeft()
  }
} 