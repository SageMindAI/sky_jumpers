// Constants
export const GRAVITY = 0.4         // Increased gravity for shorter jumps
export const JUMP_VELOCITY = -8    // Reduced jump for better visibility
export const TERMINAL_VELOCITY = 10 // Same terminal velocity

// Physics system
export function setupPhysics() {
  // Game state reference - will be set during initialization
  let gameState: any = null
  
  function setGameState(state: any) {
    gameState = state
  }
  
  function update(deltaTime: number) {
    if (!gameState || !gameState.entities.player) return
    
    // Normalize deltaTime for consistent physics across devices
    // Target is 60fps (16.67ms per frame)
    const normalizedDelta = deltaTime / 16.67
    
    const player = gameState.entities.player
    
    // Apply gravity to player (adjusted by delta time)
    player.velocityY += GRAVITY * normalizedDelta
    
    // Limit terminal velocity
    if (player.velocityY > TERMINAL_VELOCITY) {
      player.velocityY = TERMINAL_VELOCITY
    }
    
    // Update player vertical position based on velocity
    player.y += player.velocityY * normalizedDelta
    
    // Prevent player from going off the top of the screen
    if (player.y < 0) {
      player.y = 0;
      player.velocityY = 0; // Stop upward movement
    }
    
    // Check building collisions
    const buildings = gameState.entities.buildings
    let onBuilding = false
    
    for (const building of buildings) {
      if (
        player.x + player.width > building.x &&
        player.x < building.x + building.width &&
        player.y + player.height > building.y &&
        player.y + player.height < building.y + 20 && // Small tolerance for landing
        player.velocityY > 0 // Only collide when falling
      ) {
        player.y = building.y - player.height
        player.velocityY = 0
        player.isJumping = false
        onBuilding = true
        break
      }
    }
    
    // Handle falling off screen - spawn at top with a small delay
    if (player.y > gameState.canvasHeight) {
      player.y = 0
      player.velocityY = 0
      gameState.score = Math.max(0, gameState.score - 50)
    }
    
    // Keep player within horizontal bounds
    if (player.x < 0) {
      player.x = 0
      player.velocityX = 0
    } else if (player.x + player.width > gameState.canvasWidth) {
      player.x = gameState.canvasWidth - player.width
      player.velocityX = 0
    }
    
    // Update enemy positions
    gameState.entities.enemies.forEach((enemy: any) => {
      enemy.x += enemy.velocityX * normalizedDelta
      enemy.y += enemy.velocityY * normalizedDelta
      
      // Bounce off edges
      if (enemy.x <= 0 || enemy.x + enemy.width >= gameState.canvasWidth) {
        enemy.velocityX *= -1
      }
      
      // Check collision with player
      if (
        player.x < enemy.x + enemy.width &&
        player.x + player.width > enemy.x &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y
      ) {
        // Handle collision (reduce score, etc.)
        gameState.score = Math.max(0, gameState.score - 10)
      }
    })
    
    // Check powerup collisions
    gameState.entities.powerups.forEach((powerup: any, index: number) => {
      if (
        powerup.active &&
        player.x < powerup.x + powerup.width &&
        player.x + player.width > powerup.x &&
        player.y < powerup.y + powerup.height &&
        player.y + player.height > powerup.y
      ) {
        // Activate powerup
        powerup.activate()
        powerup.active = false
        
        // Remove powerup
        gameState.entities.powerups.splice(index, 1)
        
        // Increase score
        gameState.score += 25
      }
    })
  }
  
  function checkCollision(a: any, b: any) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    )
  }
  
  return {
    setGameState,
    update,
    GRAVITY,
    JUMP_VELOCITY,
    checkCollision
  }
} 