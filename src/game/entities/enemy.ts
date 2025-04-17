import { Enemy } from '../engine'

// Spawn initial enemies
export function initEnemies(): Enemy[] {
  const enemies: Enemy[] = []
  
  // Start with one enemy for simplicity
  enemies.push(createEnemy(100, 100))
  
  return enemies
}

// Create a single enemy
function createEnemy(x: number, y: number): Enemy {
  return {
    x,
    y,
    width: 40,
    height: 20,
    velocityX: 1.5 * (Math.random() > 0.5 ? 1 : -1),
    velocityY: 0.5 * (Math.random() > 0.5 ? 1 : -1),
    
    update(deltaTime: number) {
      // Movement is handled by physics system
      
      // Keep enemy within top half of screen
      if (this.y < 0 || this.y > 300) {
        this.velocityY *= -1
      }
    },
    
    render(ctx: CanvasRenderingContext2D) {
      // Draw enemy (flying blob)
      ctx.fillStyle = '#CC0000'
      
      // Body
      ctx.beginPath()
      ctx.ellipse(
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.width / 2,
        this.height / 2,
        0,
        0,
        Math.PI * 2
      )
      ctx.fill()
      
      // Eyes
      ctx.fillStyle = 'white'
      ctx.beginPath()
      ctx.arc(this.x + 15, this.y + 8, 5, 0, Math.PI * 2)
      ctx.arc(this.x + 25, this.y + 8, 5, 0, Math.PI * 2)
      ctx.fill()
      
      // Pupils
      ctx.fillStyle = 'black'
      ctx.beginPath()
      ctx.arc(this.x + 15, this.y + 8, 2, 0, Math.PI * 2)
      ctx.arc(this.x + 25, this.y + 8, 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

// Function to add more enemies (can be called later)
export function addEnemy(x: number, y: number): Enemy {
  return createEnemy(x, y)
} 