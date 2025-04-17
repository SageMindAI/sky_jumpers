import { setupRenderer } from './renderer'
import { setupPhysics } from './physics'
import { initPlayer } from './entities/player'
import { initBuildings, createBuilding } from './entities/building'
import { initEnemies, addEnemy } from './entities/enemy'
import { setupInputHandlers, setupKeyboardHandlers } from './input'
import { createPowerup } from './entities/powerup'

// Import physics constants
import { TERMINAL_VELOCITY } from './physics'

// Game state
export interface GameState {
  running: boolean
  score: number
  canvasWidth: number
  canvasHeight: number
  worldWidth: number    // Total playable world width
  difficulty: number    // Increases as player moves right
  distanceTraveled: number // Track how far player has moved
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
  facingLeft: boolean
  animations: {
    idle: {
      frameCount: number;
      frameDuration: number;
      currentFrame: number;
      lastFrameTime: number;
    };
    running: {
      frameCount: number;
      frameDuration: number;
      currentFrame: number;
      lastFrameTime: number;
    };
    jumping: {
      frameCount: number;
      frameDuration: number;
      currentFrame: number;
      lastFrameTime: number;
    };
  }
  jump: () => void
  moveLeft: (force?: number) => void
  moveRight: (force?: number) => void
  stopMoving: () => void
  renderBody?: (ctx: CanvasRenderingContext2D, bounceEffect: number, animState: 'idle' | 'running' | 'jumping', frame: number) => void
  renderLegs?: (ctx: CanvasRenderingContext2D, bounceEffect: number, animState: 'idle' | 'running' | 'jumping', frame: number) => void
  renderHead?: (ctx: CanvasRenderingContext2D, bounceEffect: number, animState: 'idle' | 'running' | 'jumping', frame: number) => void
}

export interface Building extends GameObject {
  // Building-specific properties
  colorSet: {
    base: string;
    highlight: string;
    shadow: string;
  };
  windowPattern: {
    rows: number;
    cols: number;
    spacingX: number;
    spacingY: number;
    lights: boolean[];
  };
}

export interface Enemy extends GameObject {
  velocityX: number
  velocityY: number
  type: {
    name: string;
    baseColor: string;
    eyeColor: string;
    pupilColor: string;
    highlightColor: string;
  };
  bobbleOffset: number;
  eyeOffset: number;
  renderSlime?: (ctx: CanvasRenderingContext2D) => void;
  renderGhost?: (ctx: CanvasRenderingContext2D) => void;
  renderBird?: (ctx: CanvasRenderingContext2D) => void;
  renderEyes?: (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) => void;
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
    const player = game.state.entities.player;
    player.update(deltaTime)
    
    // Track the farthest distance traveled to the right
    if (player.x > game.state.distanceTraveled) {
      game.state.distanceTraveled = player.x;
      
      // Increase score based on distance
      game.state.score = Math.floor(player.x / 100);
      
      // Increase difficulty gradually
      game.state.difficulty = 1 + (player.x / 5000);
    }
    
    // Keep player visible - emergency reset if player gets stuck offscreen
    // Check if player is way off the top of the screen
    if (player.y < -300) {
      resetPlayerToStartingPlatform()
    }
    
    // Additional check for falling too fast or going too far off screen
    if (player.velocityY > TERMINAL_VELOCITY * 1.5 || player.y > game.canvas.height * 1.5) {
      resetPlayerToStartingPlatform()
    }
    
    // Check if we need to generate more buildings ahead
    const furthestBuilding = getFurthestBuilding();
    if (furthestBuilding && player.x > furthestBuilding.x - game.canvas.width) {
      generateBuildingsAhead(furthestBuilding.x + furthestBuilding.width);
    }
    
    // Spawn enemies occasionally
    if (Math.random() < 0.005 * game.state.difficulty) {
      const enemy = addEnemy(
        player.x + game.canvas.width, // Spawn ahead of player
        Math.random() * game.canvas.height / 2
      );
      game.state.entities.enemies.push(enemy);
    }
    
    // Spawn powerups occasionally
    if (Math.random() < 0.002 * game.state.difficulty) {
      const x = player.x + game.canvas.width + (Math.random() * game.canvas.width / 2);
      const y = Math.random() * game.canvas.height / 2;
      game.state.entities.powerups.push(createPowerup(x, y));
    }
    
    // Clean up entities that are far behind the player
    cleanupEntities(player.x - game.canvas.width * 2);
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

// Helper to get the furthest building to the right
function getFurthestBuilding() {
  if (!game) return null;
  
  let furthest = null;
  let maxX = -Infinity;
  
  for (const building of game.state.entities.buildings) {
    const rightEdge = building.x + building.width;
    if (rightEdge > maxX) {
      maxX = rightEdge;
      furthest = building;
    }
  }
  
  return furthest;
}

// Generate buildings ahead of the player as they move right
function generateBuildingsAhead(startX: number) {
  if (!game) return;
  
  const { canvasWidth, canvasHeight, difficulty } = game.state;
  const buildingCount = 5 + Math.floor(Math.random() * 3);
  const minGap = 80; // Minimum gap between buildings
  const maxGap = 180 + (difficulty * 20); // Gap increases with difficulty
  
  let currentX = startX + minGap;
  
  for (let i = 0; i < buildingCount; i++) {
    // Randomize building dimensions
    const width = 80 + Math.random() * 120;
    const height = canvasHeight * (0.3 + Math.random() * 0.3);
    
    // Randomize the Y position (higher buildings as difficulty increases)
    const maxHeightVariation = difficulty * 50;
    const y = canvasHeight - height - (Math.random() * maxHeightVariation);
    
    const building = createBuilding(currentX, y, width, height);
    game.state.entities.buildings.push(building);
    
    // Move to next building position with random gap
    currentX += width + minGap + Math.random() * (maxGap - minGap);
  }
  
  // Update world width
  game.state.worldWidth = Math.max(game.state.worldWidth, currentX + 1000);
}

// Clean up entities that are far behind the player
function cleanupEntities(minX: number) {
  if (!game) return;
  
  // Keep the first few buildings as a safe zone to return to
  const keepCount = 5;
  let sortedBuildings = [...game.state.entities.buildings].sort((a, b) => a.x - b.x);
  
  // Remove buildings that are far behind, keeping the first few
  if (sortedBuildings.length > keepCount) {
    game.state.entities.buildings = [
      ...sortedBuildings.slice(0, keepCount),  // Keep first few buildings
      ...sortedBuildings.slice(keepCount).filter(b => b.x + b.width > minX)  // Filter the rest
    ];
  }
  
  // Clean up enemies and powerups
  game.state.entities.enemies = game.state.entities.enemies.filter(e => e.x + e.width > minX);
  game.state.entities.powerups = game.state.entities.powerups.filter(p => p.x + p.width > minX);
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
  
  // Define initial world size
  const initialWorldWidth = canvas.width * 5;
  
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
      worldWidth: initialWorldWidth,
      difficulty: 1,
      distanceTraveled: 0,
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
  
  // Generate initial buildings ahead
  generateBuildingsAhead(canvas.width);
  
  // Initialize a few enemies
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