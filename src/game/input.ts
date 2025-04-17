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
  activeTouches: new Map<number, {
    x: number, 
    y: number, 
    control: TouchControl | null,
    startTime: number, // Track when the touch started for tap detection
  }>()
}

// Constants for tap detection
const TAP_MAX_DURATION = 250; // ms
const TAP_MAX_MOVEMENT = 20; // pixels

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
      x, 
      y, 
      control: assignedControl,
      startTime: Date.now() // Record start time for tap detection
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
      // Check for tap behavior - short touch with minimal movement
      const touchDuration = Date.now() - touchData.startTime;
      const touchDistance = Math.sqrt(
        Math.pow(touch.clientX - touchData.x, 2) + 
        Math.pow(touch.clientY - touchData.y, 2)
      );
      
      // If the touch is claimed by a control, forward to that control
      if (touchData.control) {
        touchData.control.handleTouchEnd(touchId);
        
        // Check if this is a tap on the joystick that never activated
        // This allows tap-to-jump even if the joystick claimed the touch
        if (touchDuration < TAP_MAX_DURATION && touchDistance < TAP_MAX_MOVEMENT) {
          // If the touch was claimed by the joystick but never activated movement,
          // we still want to allow tap-to-jump
          const joystickControl = inputState.touchControls.controls.find((c: TouchControl) => 
            c !== inputState.touchControls.controls[0]); // Find the joystick control (second in array)
          
          if (joystickControl && touchData.control === joystickControl) {
            // This was a touch claimed by the joystick that never activated - treat as a tap
            if (inputState.game && inputState.game.state.entities.player) {
              inputState.game.state.entities.player.jump();
              createTapRipple(touch.clientX, touch.clientY);
            }
          }
        }
      } else {
        // If not assigned to a control, check if it's a tap
        if (touchDuration < TAP_MAX_DURATION && touchDistance < TAP_MAX_MOVEMENT) {
          // Trigger jump
          if (inputState.game && inputState.game.state.entities.player) {
            inputState.game.state.entities.player.jump();
            
            // Visual feedback for tap
            createTapRipple(touch.clientX, touch.clientY);
          }
        }
      }
      
      // Remove from tracking
      inputState.activeTouches.delete(touchId);
    }
  }
}

// Visual feedback for tap jumps
function createTapRipple(x: number, y: number) {
  if (!inputState.game || !inputState.game.canvas) return;
  
  // Create ripple element
  const ripple = document.createElement('div');
  ripple.className = 'tap-ripple';
  ripple.style.position = 'absolute';
  ripple.style.left = `${x - 20}px`;
  ripple.style.top = `${y - 20}px`;
  ripple.style.width = '40px';
  ripple.style.height = '40px';
  ripple.style.borderRadius = '50%';
  ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
  ripple.style.transform = 'scale(0)';
  ripple.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
  ripple.style.pointerEvents = 'none';
  
  // Add to document
  document.body.appendChild(ripple);
  
  // Trigger animation
  setTimeout(() => {
    ripple.style.transform = 'scale(1)';
    ripple.style.opacity = '0';
  }, 10);
  
  // Remove after animation
  setTimeout(() => {
    document.body.removeChild(ripple);
  }, 300);
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