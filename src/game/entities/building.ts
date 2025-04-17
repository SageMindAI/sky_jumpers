import { Building } from '../engine'

// Generate random buildings for the game
export function initBuildings(canvasWidth: number, canvasHeight: number): Building[] {
  const buildings: Building[] = []
  const buildingCount = 8 // More buildings
  
  const buildingWidth = canvasWidth / buildingCount
  const minHeight = canvasHeight * 0.4
  const maxHeight = canvasHeight * 0.6
  
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
    const height = Math.random() * (maxHeight - minHeight) + minHeight
    
    // Calculate x position - ensure buildings are within jumping distance
    let x = Math.random() * (canvasWidth - buildingWidth)
    
    // Calculate y position - ensure they're reachable with our jump height
    // Buildings at higher levels
    const y = canvasHeight - height - (Math.random() * maxJumpHeight * 0.7)
    
    // Ensure buildings are positioned properly relative to each other
    // Check if this building would overlap with any existing building
    let overlaps = false
    for (const existing of buildings) {
      if (
        x < existing.x + existing.width + 10 &&
        x + buildingWidth > existing.x - 10
      ) {
        overlaps = true
        break
      }
    }
    
    // Skip if overlapping
    if (overlaps) continue
    
    const building = createBuilding(
      x,
      y,
      buildingWidth - 10,
      height
    )
    
    buildings.push(building)
  }
  
  return buildings
}

// Create a single building
function createBuilding(x: number, y: number, width: number, height: number): Building {
  const colors = ['#8B4513', '#A0522D', '#CD853F', '#D2691E']
  const color = colors[Math.floor(Math.random() * colors.length)]
  
  return {
    x,
    y,
    width,
    height,
    
    update(deltaTime: number) {
      // Buildings don't move in basic implementation
    },
    
    render(ctx: CanvasRenderingContext2D) {
      // Draw building
      ctx.fillStyle = color
      ctx.fillRect(this.x, this.y, this.width, this.height)
      
      // Draw windows
      ctx.fillStyle = '#F8F8FF'
      
      const windowSize = 10
      const windowSpacing = 20
      const windowRows = Math.floor(this.height / windowSpacing) - 2
      const windowCols = Math.floor(this.width / windowSpacing) - 1
      
      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
          ctx.fillRect(
            this.x + windowSpacing + col * windowSpacing,
            this.y + windowSpacing + row * windowSpacing,
            windowSize,
            windowSize
          )
        }
      }
      
      // Draw roof
      ctx.fillStyle = '#696969'
      ctx.fillRect(this.x - 5, this.y, this.width + 10, 5)
    }
  }
} 