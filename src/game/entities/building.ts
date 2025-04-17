import { Building } from '../engine'

// Building color palette
const BUILDING_COLORS = [
  { base: '#995533', highlight: '#aa6644', shadow: '#884422' }, // Brown
  { base: '#884422', highlight: '#995533', shadow: '#773311' }, // Dark brown
  { base: '#663311', highlight: '#774422', shadow: '#552200' }, // Darker brown
  { base: '#BA8C63', highlight: '#D6A87D', shadow: '#9A6E49' }, // Tan
];

// Generate random buildings for the game
export function initBuildings(canvasWidth: number, canvasHeight: number): Building[] {
  const buildings: Building[] = []
  const buildingCount = 8 // More buildings
  
  const buildingWidth = canvasWidth / buildingCount
  
  // Adjust building heights for landscape mode
  // Make buildings shorter in landscape mode (wide screen)
  const isLandscape = canvasWidth > canvasHeight;
  const maxHeightFactor = isLandscape ? 0.4 : 0.6; // Lower max height in landscape
  const minHeightFactor = isLandscape ? 0.25 : 0.4; // Lower min height in landscape
  
  const minHeight = canvasHeight * minHeightFactor;
  const maxHeight = canvasHeight * maxHeightFactor;
  
  // Calculate max jump height to ensure buildings are within reach
  const maxJumpHeight = 180 // Approximate max jump height based on physics
  
  // Generate main platform at the bottom as a starting point
  buildings.push(
    createBuilding(
      canvasWidth / 2 - buildingWidth,
      canvasHeight - minHeight,
      buildingWidth * 2,
      minHeight
    )
  )
  
  // Then generate the rest of the buildings with proper spacing
  for (let i = 0; i < buildingCount - 1; i++) {
    const height = Math.random() * (maxHeight - minHeight) + minHeight;
    
    // Calculate x position - ensure buildings are within jumping distance
    let x = Math.random() * (canvasWidth - buildingWidth);
    
    // Calculate y position - ensure they're reachable with our jump height
    // In landscape mode, keep buildings lower to the ground
    const maxBuildingY = isLandscape ? 
      canvasHeight - height - (maxJumpHeight * 0.3) : 
      canvasHeight - height - (maxJumpHeight * 0.7);
    
    const y = Math.max(canvasHeight * 0.3, maxBuildingY);
    
    // Ensure buildings are positioned properly relative to each other
    // Check if this building would overlap with any existing building
    let overlaps = false;
    for (const existing of buildings) {
      if (
        x < existing.x + existing.width + 10 &&
        x + buildingWidth > existing.x - 10
      ) {
        overlaps = true;
        break;
      }
    }
    
    // Skip if overlapping
    if (overlaps) continue;
    
    const building = createBuilding(
      x,
      y,
      buildingWidth - 10,
      height
    );
    
    buildings.push(building);
  }
  
  return buildings;
}

// Create a single building
export function createBuilding(x: number, y: number, width: number, height: number): Building {
  // Select a random color from the palette
  const colorSet = BUILDING_COLORS[Math.floor(Math.random() * BUILDING_COLORS.length)];
  
  // Create window pattern
  const windowRows = Math.max(3, Math.floor(height / 30));
  const windowCols = Math.max(3, Math.floor(width / 30));
  const windowSpacingX = width / (windowCols + 1);
  const windowSpacingY = height / (windowRows + 1);
  
  // Random window lighting pattern (some windows lit, some not)
  const windowLights = [];
  for (let row = 0; row < windowRows; row++) {
    for (let col = 0; col < windowCols; col++) {
      windowLights.push(Math.random() > 0.3); // 70% chance of window being lit
    }
  }
  
  return {
    x,
    y,
    width,
    height,
    colorSet,
    windowPattern: {
      rows: windowRows,
      cols: windowCols,
      spacingX: windowSpacingX,
      spacingY: windowSpacingY,
      lights: windowLights
    },
    
    update(deltaTime: number) {
      // Buildings don't need update logic
    },
    
    render(ctx: CanvasRenderingContext2D) {
      // Save context for transformations
      ctx.save();
      
      // Main building body with 3D perspective effect
      // Base building
      ctx.fillStyle = this.colorSet.base;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.width, this.y);
      ctx.lineTo(this.x + this.width, this.y + this.height);
      ctx.lineTo(this.x, this.y + this.height);
      ctx.closePath();
      ctx.fill();
      
      // Top highlight (roof)
      ctx.fillStyle = this.colorSet.highlight;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.width, this.y);
      ctx.lineTo(this.x + this.width, this.y + 10);
      ctx.lineTo(this.x, this.y + 10);
      ctx.closePath();
      ctx.fill();
      
      // Right side highlight for 3D effect
      ctx.fillStyle = this.colorSet.highlight;
      ctx.beginPath();
      ctx.moveTo(this.x + this.width - 8, this.y);
      ctx.lineTo(this.x + this.width, this.y);
      ctx.lineTo(this.x + this.width, this.y + this.height);
      ctx.lineTo(this.x + this.width - 8, this.y + this.height);
      ctx.closePath();
      ctx.fill();
      
      // Draw windows
      const { rows, cols, spacingX, spacingY, lights } = this.windowPattern;
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const windowIndex = row * cols + col;
          const isLit = lights[windowIndex];
          
          const windowX = this.x + (col + 1) * spacingX - spacingX/2;
          const windowY = this.y + (row + 1) * spacingY - spacingY/2;
          const windowWidth = spacingX * 0.7;
          const windowHeight = spacingY * 0.7;
          
          // Window frame (darker than building)
          ctx.fillStyle = this.colorSet.shadow;
          ctx.fillRect(
            windowX - 1, 
            windowY - 1, 
            windowWidth + 2, 
            windowHeight + 2
          );
          
          // Window interior (lit or unlit)
          ctx.fillStyle = isLit ? 
            'rgba(255, 255, 200, 0.8)' : // Warm yellow light
            'rgba(100, 150, 180, 0.5)';  // Dark blue for unlit
          
          ctx.fillRect(
            windowX, 
            windowY, 
            windowWidth, 
            windowHeight
          );
          
          // Window panes
          if (windowWidth > 15 && windowHeight > 15) {
            ctx.strokeStyle = this.colorSet.shadow;
            ctx.lineWidth = 1;
            
            // Horizontal divider
            ctx.beginPath();
            ctx.moveTo(windowX, windowY + windowHeight/2);
            ctx.lineTo(windowX + windowWidth, windowY + windowHeight/2);
            ctx.stroke();
            
            // Vertical divider
            ctx.beginPath();
            ctx.moveTo(windowX + windowWidth/2, windowY);
            ctx.lineTo(windowX + windowWidth/2, windowY + windowHeight);
            ctx.stroke();
          }
        }
      }
      
      // Draw slight shadow at the bottom
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.moveTo(this.x - 10, this.y + this.height);
      ctx.lineTo(this.x + this.width + 10, this.y + this.height);
      ctx.lineTo(this.x + this.width + 10, this.y + this.height + 10);
      ctx.lineTo(this.x - 10, this.y + this.height + 10);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    }
  }
} 