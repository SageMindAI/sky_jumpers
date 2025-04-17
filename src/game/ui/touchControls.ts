// Touch Controls UI for mobile gameplay
// Implements Roblox-style controls with a jump button and directional joystick

export interface TouchControl {
  render: (ctx: CanvasRenderingContext2D) => void;
  handleTouchStart: (x: number, y: number, id: number) => boolean;
  handleTouchMove: (x: number, y: number, id: number) => void;
  handleTouchEnd: (id: number) => void;
  isActive: () => boolean;
}

export interface JoystickState {
  centerX: number;
  centerY: number;
  currentX: number;
  currentY: number;
  active: boolean;
  touchId: number | null;
  maxDistance: number;
}

export interface ButtonState {
  x: number;
  y: number;
  radius: number;
  pressed: boolean;
  touchId: number | null;
  active: boolean;
}

export function setupTouchControls(
  canvas: HTMLCanvasElement, 
  onJump: () => void, 
  onMove: (direction: number, force: number) => void,
  onStopMoving: () => void
) {
  // States for touch controls
  const jumpButton: ButtonState = {
    x: 80,
    y: canvas.height - 80,
    radius: 40,
    pressed: false,
    touchId: null,
    active: false
  };
  
  const joystick: JoystickState = {
    centerX: 0,
    centerY: 0,
    currentX: 0,
    currentY: 0,
    active: false,
    touchId: null,
    maxDistance: 80
  };
  
  // Ensure button positions adjust with screen size
  function updatePositions() {
    jumpButton.x = 80;
    jumpButton.y = canvas.height - 80;
  }
  
  // Handle window resize
  window.addEventListener('resize', () => {
    updatePositions();
  });
  
  // Initialize positions
  updatePositions();
  
  // Jump Button Control
  const jumpButtonControl: TouchControl = {
    render(ctx: CanvasRenderingContext2D) {
      if (!jumpButton.active) return;
      
      // Draw jump button
      ctx.save();
      
      // Button background
      ctx.fillStyle = jumpButton.pressed ? 'rgba(255, 140, 0, 0.8)' : 'rgba(255, 140, 0, 0.5)';
      ctx.beginPath();
      ctx.arc(jumpButton.x, jumpButton.y, jumpButton.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Button border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(jumpButton.x, jumpButton.y, jumpButton.radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Jump text/icon
      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('↑', jumpButton.x, jumpButton.y);
      
      ctx.restore();
    },
    
    handleTouchStart(x: number, y: number, id: number): boolean {
      const distance = Math.sqrt(Math.pow(x - jumpButton.x, 2) + Math.pow(y - jumpButton.y, 2));
      
      if (distance <= jumpButton.radius) {
        jumpButton.pressed = true;
        jumpButton.touchId = id;
        onJump(); // Trigger jump action
        return true;
      }
      
      return false;
    },
    
    handleTouchMove(x: number, y: number, id: number) {
      // Only process if this is the touchId we're tracking
      if (jumpButton.touchId !== id) return;
      
      const distance = Math.sqrt(Math.pow(x - jumpButton.x, 2) + Math.pow(y - jumpButton.y, 2));
      
      // Update pressed state based on whether finger is still over button
      jumpButton.pressed = distance <= jumpButton.radius;
    },
    
    handleTouchEnd(id: number) {
      if (jumpButton.touchId === id) {
        jumpButton.pressed = false;
        jumpButton.touchId = null;
      }
    },
    
    isActive() {
      return jumpButton.active;
    }
  };
  
  // Directional Joystick Control
  const joystickControl: TouchControl = {
    render(ctx: CanvasRenderingContext2D) {
      if (!joystick.active) return;
      
      ctx.save();
      
      // Draw the base circle (center point)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(joystick.centerX, joystick.centerY, 40, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw the guide line from center to current position
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(joystick.centerX, joystick.centerY);
      ctx.lineTo(joystick.currentX, joystick.currentY);
      ctx.stroke();
      
      // Draw the position indicator (joystick knob)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(joystick.currentX, joystick.currentY, 25, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    },
    
    handleTouchStart(x: number, y: number, id: number): boolean {
      // Don't handle if we're already active
      if (joystick.active) return false;
      
      // Avoid the jump button area and left side of screen
      if (x < 150) return false;
      
      // Set the joystick center to the initial touch point
      joystick.centerX = x;
      joystick.centerY = y;
      joystick.currentX = x;
      joystick.currentY = y;
      joystick.active = true;
      joystick.touchId = id;
      
      return true;
    },
    
    handleTouchMove(x: number, y: number, id: number) {
      // Only process if this is the touchId we're tracking
      if (joystick.touchId !== id || !joystick.active) return;
      
      // Calculate the distance from center
      const dx = x - joystick.centerX;
      const dy = y - joystick.centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Limit the joystick movement to the maximum distance
      if (distance > joystick.maxDistance) {
        const ratio = joystick.maxDistance / distance;
        joystick.currentX = joystick.centerX + dx * ratio;
        joystick.currentY = joystick.centerY + dy * ratio;
      } else {
        joystick.currentX = x;
        joystick.currentY = y;
      }
      
      // Calculate direction and force
      // For this game, we only care about horizontal movement, so only use dx
      const horizontalDirection = dx / (distance || 1); // Normalized between -1 and 1
      const force = Math.min(1, distance / joystick.maxDistance); // 0 to 1
      
      // Only track horizontal movement (left/right)
      if (Math.abs(horizontalDirection) > 0.1) {
        onMove(horizontalDirection, force);
      } else {
        onStopMoving();
      }
    },
    
    handleTouchEnd(id: number) {
      if (joystick.touchId === id) {
        joystick.active = false;
        joystick.touchId = null;
        // Stop movement when touch ends
        onStopMoving();
      }
    },
    
    isActive() {
      return joystick.active;
    }
  };
  
  // Return an array of all controls
  const controls: TouchControl[] = [
    jumpButtonControl,
    joystickControl
  ];
  
  // Helper to activate/deactivate all controls
  function setActive(active: boolean) {
    jumpButton.active = active;
  }
  
  // Public API
  return {
    controls,
    setActive,
    render: (ctx: CanvasRenderingContext2D) => {
      controls.forEach(control => control.render(ctx));
    }
  };
} 