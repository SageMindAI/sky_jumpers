import { setupRenderer } from './renderer'
import { setupPhysics } from './physics'
import { initPlayer } from './entities/player'
import { initBuildings } from './entities/building'
import { initEnemies } from './entities/enemy'
import { setupInputHandlers, setupKeyboardHandlers } from './input'

// Import physics constants
import { TERMINAL_VELOCITY } from './physics'

// Game state
export interface GameState {
  running: boolean
  score: number
  canvasWidth: number
  canvasHeight: number
  entities: {
    player: Player | null
    buildings: Building[]
    enemies: Enemy[]
    powerups: PowerUp[]
  }
}

// Game interfaces
export interface GameObject {
  x: number
  y: number
  width: number
  height: number
  update: (deltaTime: number) => void
  render: (ctx: CanvasRenderingContext2D) => void
}

export interface Player extends GameObject {
  velocityY: number
  velocityX: number
  maxVelocityX: number
  accelerationX: number
  friction: number
  isJumping: boolean
  jumpForce: number
  jumpCooldown: number
  jump: () => void
  moveLeft: (force?: number) => void
  moveRight: (force?: number) => void
  stopMoving: () => void
}

export interface Building extends GameObject {
  // Building-specific properties
}

export interface Enemy extends GameObject {
  velocityX: number
  velocityY: number
}

export interface PowerUp extends GameObject {
  type: 'speed' | 'shield' | 'points'
  active: boolean
  activate: () => void
}

// Game singleton
let game: {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D | null
  state: GameState
  lastTime: number
  renderer: ReturnType<typeof setupRenderer>
  physics: ReturnType<typeof setupPhysics>
  animationFrameId: number
  cleanup: () => void
} | null = null

// Main game loop
function gameLoop(timestamp: number) {
  if (!game || !game.ctx) return
  
  // Calculate delta time in milliseconds
  const deltaTime = game.lastTime === 0 ? 16.67 : timestamp - game.lastTime
  game.lastTime = timestamp
  
  // Clear canvas
  game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height)
  
  // Update physics with delta time
  game.physics.update(deltaTime)
  
  // Update entities with delta time
  if (game.state.entities.player) {
    game.state.entities.player.update(deltaTime)
    
    // Keep player visible - emergency reset if player gets stuck offscreen
    const player = game.state.entities.player;
    
    // Check if player is way off the top of the screen
    if (player.y < -300) {
      resetPlayerToStartingPlatform()
    }
    
    // Additional check for falling too fast or going too far off screen
    if (player.velocityY > TERMINAL_VELOCITY * 1.5 || player.y > game.canvas.height * 1.5) {
      resetPlayerToStartingPlatform()
    }
  }
  
  game.state.entities.buildings.forEach(building => building.update(deltaTime))
  game.state.entities.enemies.forEach(enemy => enemy.update(deltaTime))
  game.state.entities.powerups.forEach(powerup => powerup.update(deltaTime))
  
  // Render everything
  game.renderer.render()
  
  // Continue loop
  if (game.state.running) {
    game.animationFrameId = requestAnimationFrame(gameLoop)
  }
}

// Helper function to reset player to starting platform
export function resetPlayerToStartingPlatform() {
  if (!game || !game.state.entities.player) return
  
  const startingPlatform = game.state.entities.buildings[0]
  
  // Reset player position and velocity
  game.state.entities.player.x = startingPlatform.x + startingPlatform.width / 2 - 15
  game.state.entities.player.y = startingPlatform.y - 50
  game.state.entities.player.velocityY = 0
  game.state.entities.player.velocityX = 0
  game.state.entities.player.isJumping = false
}

// Initialize game
export function initGame(canvas: HTMLCanvasElement) {
  // Set canvas size to match display
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Could not get 2D context from canvas')
  }
  
  // Initialize game object
  game = {
    canvas,
    ctx,
    lastTime: 0,
    state: {
      running: true,
      score: 0,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      entities: {
        player: null,
        buildings: [],
        enemies: [],
        powerups: []
      }
    },
    renderer: setupRenderer(canvas, ctx),
    physics: setupPhysics(),
    animationFrameId: 0,
    cleanup: () => {
      if (game) {
        game.state.running = false
        cancelAnimationFrame(game.animationFrameId)
        game = null
      }
    }
  }
  
  // Set game state for renderer and physics
  game.renderer.setGameState(game.state)
  game.physics.setGameState(game.state)
  
  // Initialize entities
  game.state.entities.buildings = initBuildings(canvas.width, canvas.height)
  
  // Find the starting platform (the largest one at the bottom)
  let startingPlatform = game.state.entities.buildings[0];
  
  // Place player on the starting platform
  game.state.entities.player = initPlayer(
    startingPlatform.x + startingPlatform.width / 2 - 15, 
    startingPlatform.y - 50 // Place above the platform
  )
  
  game.state.entities.enemies = initEnemies()
  
  // Setup input handlers
  setupInputHandlers(game)
  setupKeyboardHandlers(game)
  
  // Start the game loop
  game.animationFrameId = requestAnimationFrame(gameLoop)
  
  // Handle window resize
  const handleResize = () => {
    if (!game) return
    
    // Store the previous dimensions for ratio calculation
    const oldWidth = game.canvas.width
    const oldHeight = game.canvas.height
    
    // Update canvas dimensions
    game.canvas.width = window.innerWidth
    game.canvas.height = window.innerHeight
    
    // Update canvas dimensions in the state as well
    game.state.canvasWidth = game.canvas.width
    game.state.canvasHeight = game.canvas.height
    
    // If player exists, ensure they stay in bounds after resize
    if (game.state.entities.player) {
      // Keep player within horizontal bounds
      if (game.state.entities.player.x + game.state.entities.player.width > game.canvas.width) {
        game.state.entities.player.x = game.canvas.width - game.state.entities.player.width
      }
      
      // If player is off screen vertically, reset them to the starting platform
      if (game.state.entities.player.y < 0 || game.state.entities.player.y > game.canvas.height) {
        resetPlayerToStartingPlatform()
      }
    }
    
    // Regenerate buildings if necessary for drastic resizes
    if (Math.abs(oldWidth - game.canvas.width) > oldWidth * 0.3 ||
        Math.abs(oldHeight - game.canvas.height) > oldHeight * 0.3) {
      // The screen size has changed dramatically, recreate the buildings
      game.state.entities.buildings = initBuildings(game.canvas.width, game.canvas.height)
      
      // Reset player to the new starting platform
      resetPlayerToStartingPlatform()
    }
  }
  
  window.addEventListener('resize', handleResize)
  
  return game
} 