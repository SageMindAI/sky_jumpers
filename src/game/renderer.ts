// Renderer for the game
export function setupRenderer(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  // Setup any rendering configuration
  ctx.imageSmoothingEnabled = true
  
  // Get game state reference - will be set during initialization
  let gameState: any = null
  
  // Camera position for smooth scrolling/following
  let cameraY = 0
  const cameraSmoothing = 0.05 // Reduced smoothing for less dramatic camera movement
  
  function setGameState(state: any) {
    gameState = state
  }
  
  function render() {
    if (!gameState) return
    
    // Clear the entire canvas first
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw background first (before any transformations)
    ctx.fillStyle = '#87CEEB' // Sky blue
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Only update camera if player exists and is jumping
    if (gameState.entities.player) {
      const player = gameState.entities.player;
      
      // Only move camera if player is significantly above the middle of the screen
      // and is jumping - this prevents the camera from moving too much
      if (player.isJumping && player.y < canvas.height / 2 - 50) {
        // Target position is the player's y position minus half the canvas height
        // This keeps the player in the center of the screen vertically
        // But with a much smaller range of movement to avoid losing buildings
        const targetCameraY = Math.max(
          0, 
          Math.min(
            (player.y - (canvas.height * 0.7)) * 0.5, // Only move camera partially up
            player.y // Don't go beyond player position
          )
        )
        
        // Apply very mild smoothing to camera movement
        cameraY += (targetCameraY - cameraY) * cameraSmoothing;
      } else if (!player.isJumping) {
        // Gradually return camera to ground position when not jumping
        cameraY *= 0.9;
      }
    }
    
    // Prevent camera from going negative
    if (cameraY < 0) cameraY = 0;
    
    // Apply camera transformation with protection
    ctx.save();
    ctx.translate(0, -Math.min(cameraY, 200)); // Limit camera movement upward
    
    // DEBUG: Draw a horizontal line at the camera position for reference
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.moveTo(0, cameraY);
    ctx.lineTo(canvas.width, cameraY);
    ctx.stroke();
    
    // Render buildings - no need to cull most buildings as they're not typically offscreen
    gameState.entities.buildings.forEach((building: any) => {
      building.render(ctx)
    });
    
    // Render player
    if (gameState.entities.player) {
      gameState.entities.player.render(ctx)
    }
    
    // Render enemies
    gameState.entities.enemies.forEach((enemy: any) => {
      enemy.render(ctx)
    });
    
    // Render powerups
    gameState.entities.powerups.forEach((powerup: any) => {
      powerup.render(ctx)
    });
    
    // Restore context for UI elements (which should be fixed on screen)
    ctx.restore();
    
    // Render score (fixed position)
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${gameState.score}`, 20, 40);
    
    // Render jump state debug info if player exists
    if (gameState.entities.player) {
      const player = gameState.entities.player;
      ctx.fillStyle = 'black';
      ctx.font = '12px Arial';
      ctx.fillText(
        `Y: ${Math.round(player.y)} | isJumping: ${player.isJumping} | velocityY: ${player.velocityY.toFixed(1)} | CameraY: ${Math.round(cameraY)}`,
        20, 70
      );
    }
  }
  
  return {
    setGameState,
    render
  }
} 