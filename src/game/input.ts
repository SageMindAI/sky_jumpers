import { resetPlayerToStartingPlatform } from './engine'
import { setupTouchControls, TouchControl } from './ui/touchControls'

// Input state
const inputState = {
  isMobile: false,
  keyDown: {
    left: false,
    right: false,
    up: false
  },
  game: null as any,
  touchControls: null as any,
  activeTouches: new Map<number, {x: number, y: number, control: TouchControl | null}>()
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
  
  // Initialize touch controls if on mobile
  if (inputState.isMobile) {
    // Only setup touch controls if we have a canvas
    if (game && game.canvas) {
      inputState.touchControls = setupTouchControls(
        game.canvas,
        // Jump callback
        () => {
          if (game.state.entities.player) {
            game.state.entities.player.jump();
          }
        },
        // Move callback (direction, force)
        (direction, force) => {
          if (game.state.entities.player) {
            if (direction > 0) {
              game.state.entities.player.moveRight(force);
            } else {
              game.state.entities.player.moveLeft(force);
            }
          }
        },
        // Stop moving callback
        () => {
          if (game.state.entities.player) {
            game.state.entities.player.stopMoving();
          }
        }
      );
      
      // Set controls to active
      inputState.touchControls.setActive(true);
      
      // Add touch event listeners to the canvas
      game.canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      game.canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      game.canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
      game.canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });
    }
  }
  
  // Listen for orientation or resize changes
  window.addEventListener('resize', () => {
    inputState.isMobile = detectMobile()
  })
}

// Touch handlers
export function handleTouchStart(e: TouchEvent) {
  e.preventDefault();
  if (!inputState.game || !inputState.touchControls) return;
  
  // Process each touch
  for (let i = 0; i < e.changedTouches.length; i++) {
    const touch = e.changedTouches[i];
    const touchId = touch.identifier;
    const x = touch.clientX;
    const y = touch.clientY;
    
    // Try to assign to a control
    let assignedControl: TouchControl | null = null;
    
    // Check each control to see if it claims this touch
    for (const control of inputState.touchControls.controls) {
      if (control.handleTouchStart(x, y, touchId)) {
        assignedControl = control;
        break;
      }
    }
    
    // Store touch data
    inputState.activeTouches.set(touchId, {
      x, y, control: assignedControl
    });
  }
}

export function handleTouchMove(e: TouchEvent) {
  e.preventDefault();
  if (!inputState.game || !inputState.touchControls) return;
  
  // Process each changed touch
  for (let i = 0; i < e.changedTouches.length; i++) {
    const touch = e.changedTouches[i];
    const touchId = touch.identifier;
    const x = touch.clientX;
    const y = touch.clientY;
    
    // Check if we're tracking this touch
    const touchData = inputState.activeTouches.get(touchId);
    if (touchData) {
      // Update stored position
      touchData.x = x;
      touchData.y = y;
      
      // Forward to the control if assigned
      if (touchData.control) {
        touchData.control.handleTouchMove(x, y, touchId);
      }
    }
  }
}

export function handleTouchEnd(e: TouchEvent) {
  e.preventDefault();
  if (!inputState.game || !inputState.touchControls) return;
  
  // Process each ended touch
  for (let i = 0; i < e.changedTouches.length; i++) {
    const touch = e.changedTouches[i];
    const touchId = touch.identifier;
    
    // Check if we're tracking this touch
    const touchData = inputState.activeTouches.get(touchId);
    if (touchData) {
      // Forward to the control if assigned
      if (touchData.control) {
        touchData.control.handleTouchEnd(touchId);
      }
      
      // Remove from tracking
      inputState.activeTouches.delete(touchId);
    }
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

// Get touch controls for rendering
export function getTouchControls() {
  return inputState.touchControls;
} 