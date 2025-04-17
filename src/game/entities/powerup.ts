import { PowerUp } from '../engine'

// Types of powerups
const POWERUP_TYPES = ['speed', 'shield', 'points'] as const

// Create a new powerup
export function createPowerup(x: number, y: number): PowerUp {
  const type = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)]
  
  return {
    x,
    y,
    width: 20,
    height: 20,
    type,
    active: true,
    
    update(deltaTime: number) {
      // Powerups don't move in basic implementation
    },
    
    render(ctx: CanvasRenderingContext2D) {
      if (!this.active) return
      
      // Draw powerup shape based on type
      ctx.beginPath()
      
      const centerX = this.x + this.width / 2
      const centerY = this.y + this.height / 2
      const radius = this.width / 2
      
      switch (this.type) {
        case 'speed':
          // Speed powerup (lightning bolt)
          ctx.fillStyle = '#FFD700' // Gold
          ctx.beginPath()
          ctx.moveTo(centerX, centerY - radius)
          ctx.lineTo(centerX + radius - 5, centerY)
          ctx.lineTo(centerX, centerY + radius)
          ctx.lineTo(centerX - radius + 5, centerY)
          ctx.closePath()
          break
          
        case 'shield':
          // Shield powerup (circle)
          ctx.fillStyle = '#4169E1' // Royal Blue
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
          break
          
        case 'points':
          // Points powerup (star)
          ctx.fillStyle = '#7CFC00' // Lawn Green
          
          // Draw a simple square for simplicity
          ctx.fillRect(this.x, this.y, this.width, this.height)
          ctx.fillStyle = 'white'
          ctx.fillText('+', centerX - 3, centerY + 3)
          return
      }
      
      ctx.fill()
    },
    
    activate() {
      // Apply powerup effect (would be expanded in a real game)
      console.log(`Powerup ${this.type} activated!`)
      
      // Set to inactive so it's not rendered
      this.active = false
    }
  }
}

// Spawn a powerup at a random position
export function spawnRandomPowerup(canvasWidth: number, canvasHeight: number): PowerUp {
  const x = Math.random() * (canvasWidth - 20)
  const y = Math.random() * (canvasHeight / 2)
  
  return createPowerup(x, y)
} 