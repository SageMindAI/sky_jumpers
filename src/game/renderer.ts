// Renderer for the game
import { setupBackgrounds } from './backgrounds';

export function setupRenderer(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  // Setup any rendering configuration
  ctx.imageSmoothingEnabled = true
  
  // Get game state reference - will be set during initialization
  let gameState: any = null
  
  // Camera position for smooth scrolling/following
  let cameraY = 0
  let cameraX = 0
  const cameraSmoothing = 0.1 // Camera smoothing factor
  
  // Initialize the parallax background system
  const backgrounds = setupBackgrounds(canvas, ctx);
  
  function setGameState(state: any) {
    gameState = state
  }
  
  function render() {
    if (!gameState) return
    
    // Clear the entire canvas first
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Update camera position if player exists
    if (gameState.entities.player) {
      const player = gameState.entities.player;
      
      // Horizontal scrolling - keep player in the middle third of the screen
      const targetCameraX = Math.max(
        0,
        player.x - canvas.width / 3 // Player stays in the first third of the screen
      );
      
      // Vertical camera - only follow when jumping
      // Only move camera if player is significantly above the middle of the screen
      // and is jumping
      let targetCameraY = 0;
      if (player.isJumping && player.y < canvas.height / 2 - 50) {
        targetCameraY = Math.max(
          0, 
          Math.min(
            (player.y - (canvas.height * 0.7)) * 0.5, // Only move camera partially up
            player.y // Don't go beyond player position
          )
        );
      }
      
      // Apply smoothing to camera movement
      cameraX += (targetCameraX - cameraX) * cameraSmoothing;
      cameraY += (targetCameraY - cameraY) * cameraSmoothing;
      
      // Reset vertical camera when not jumping
      if (!player.isJumping) {
        cameraY *= 0.9;
      }
    }
    
    // Prevent camera from going negative
    if (cameraY < 0) cameraY = 0;
    if (cameraX < 0) cameraX = 0;
    
    // Render the parallax backgrounds first (fixed position relative to camera)
    backgrounds.renderBackgrounds(cameraX, cameraY, performance.now());
    
    // Apply camera transformation for game entities
    ctx.save();
    ctx.translate(-cameraX, -cameraY);
    
    // DEBUG: Draw camera bounds for reference
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.rect(cameraX, cameraY, canvas.width, canvas.height);
    ctx.stroke();
    
    // Render buildings - only those visible in viewport
    gameState.entities.buildings.forEach((building: any) => {
      if (isInViewport(building, cameraX, cameraY, canvas.width, canvas.height)) {
        building.render(ctx);
      }
    });
    
    // Render player
    if (gameState.entities.player) {
      gameState.entities.player.render(ctx);
    }
    
    // Render enemies - only those visible in viewport
    gameState.entities.enemies.forEach((enemy: any) => {
      if (isInViewport(enemy, cameraX, cameraY, canvas.width, canvas.height)) {
        enemy.render(ctx);
      }
    });
    
    // Render powerups - only those visible in viewport
    gameState.entities.powerups.forEach((powerup: any) => {
      if (isInViewport(powerup, cameraX, cameraY, canvas.width, canvas.height)) {
        powerup.render(ctx);
      }
    });
    
    // Restore context for UI elements (which should be fixed on screen)
    ctx.restore();
    
    // Render score (fixed position)
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${gameState.score}`, 20, 40);
    
    // Draw level progress indicator
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(20, 60, 200, 10);
    ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
    const progressWidth = Math.min(200, (cameraX / gameState.worldWidth) * 200);
    ctx.fillRect(20, 60, progressWidth, 10);
    
    // Render debug info if player exists
    if (gameState.entities.player) {
      const player = gameState.entities.player;
      ctx.fillStyle = 'black';
      ctx.font = '12px Arial';
      ctx.fillText(
        `X: ${Math.round(player.x)} | Y: ${Math.round(player.y)} | CameraX: ${Math.round(cameraX)}`,
        20, 90
      );
    }
  }
  
  // Helper to check if entity is in viewport
  function isInViewport(entity: any, cameraX: number, cameraY: number, width: number, height: number) {
    return (
      entity.x + entity.width >= cameraX &&
      entity.x <= cameraX + width &&
      entity.y + entity.height >= cameraY &&
      entity.y <= cameraY + height
    );
  }
  
  return {
    setGameState,
    render
  }
} 