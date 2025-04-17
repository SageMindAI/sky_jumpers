import { Enemy } from '../engine'

// Enemy types with colors and properties
const ENEMY_TYPES = [
  { 
    name: 'slime', 
    baseColor: '#e74c3c', 
    eyeColor: 'white',
    pupilColor: 'black',
    highlightColor: '#f85c4c'
  },
  { 
    name: 'ghost', 
    baseColor: '#9b59b6', 
    eyeColor: 'white',
    pupilColor: 'black',
    highlightColor: '#ac6ac7'
  },
  { 
    name: 'bird', 
    baseColor: '#3498db', 
    eyeColor: 'white',
    pupilColor: 'black',
    highlightColor: '#45a9ec'
  }
];

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
  const type = ENEMY_TYPES[Math.floor(Math.random() * ENEMY_TYPES.length)];
  const size = 25 + Math.random() * 15;
  
  return {
    x,
    y,
    width: size,
    height: size,
    velocityX: -1 - Math.random(), // Move left at random speed
    velocityY: Math.random() * 2 - 1, // Random vertical movement
    type,
    bobbleOffset: 0,
    eyeOffset: 0,
    
    update(deltaTime: number) {
      // Update position
      this.x += this.velocityX;
      this.y += this.velocityY;
      
      // Bobble animation - makes the enemy pulsate slightly
      this.bobbleOffset = Math.sin(Date.now() / 200) * 2;
      
      // Eye animation - makes the eyes move around
      this.eyeOffset = Math.sin(Date.now() / 500) * 2;
      
      // Bounce off invisible walls above and below
      if (this.y <= 0 || this.y + this.height >= 600) {
        this.velocityY *= -1;
      }
    },
    
    render(ctx: CanvasRenderingContext2D) {
      ctx.save();
      
      // Draw shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(
        this.x + this.width/2, 
        this.y + this.height + 5, 
        this.width/2, 
        this.height/6, 
        0, 0, Math.PI * 2
      );
      ctx.fill();
      
      // Choose drawing method based on enemy type
      if (this.type.name === 'slime') {
        this.renderSlime(ctx);
      } else if (this.type.name === 'ghost') {
        this.renderGhost(ctx);
      } else {
        this.renderBird(ctx);
      }
      
      ctx.restore();
    },
    
    renderSlime(ctx: CanvasRenderingContext2D) {
      const centerX = this.x + this.width / 2;
      const centerY = this.y + this.height / 2;
      const radius = (this.width / 2) + this.bobbleOffset;
      
      // Create gradient for body
      const gradient = ctx.createRadialGradient(
        centerX - radius/3, centerY - radius/3, 0,
        centerX, centerY, radius
      );
      gradient.addColorStop(0, this.type.highlightColor);
      gradient.addColorStop(1, this.type.baseColor);
      
      // Draw slime body
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw drippy bottom
      ctx.beginPath();
      ctx.moveTo(centerX - radius, centerY);
      ctx.bezierCurveTo(
        centerX - radius, centerY + radius,
        centerX + radius, centerY + radius,
        centerX + radius, centerY
      );
      ctx.fill();
      
      // Draw eyes
      this.renderEyes(ctx, centerX, centerY, radius);
    },
    
    renderGhost(ctx: CanvasRenderingContext2D) {
      const centerX = this.x + this.width / 2;
      const centerY = this.y + this.height / 2;
      const radius = (this.width / 2) + this.bobbleOffset;
      
      // Create gradient for body
      const gradient = ctx.createRadialGradient(
        centerX - radius/3, centerY - radius/3, 0,
        centerX, centerY, radius * 1.5
      );
      gradient.addColorStop(0, this.type.highlightColor);
      gradient.addColorStop(1, this.type.baseColor);
      
      // Ghost body
      ctx.fillStyle = gradient;
      ctx.beginPath();
      
      // Top semi-circle
      ctx.arc(centerX, centerY, radius, Math.PI, 0, true);
      
      // Wavy bottom
      const segments = 5;
      const segmentWidth = (radius * 2) / segments;
      
      for (let i = 0; i <= segments; i++) {
        const waveY = centerY + radius + Math.sin(Date.now() / 200 + i) * 5;
        ctx.lineTo(centerX + radius - (i * segmentWidth), waveY);
      }
      
      ctx.fill();
      
      // Draw eyes
      this.renderEyes(ctx, centerX, centerY - radius/4, radius);
    },
    
    renderBird(ctx: CanvasRenderingContext2D) {
      const centerX = this.x + this.width / 2;
      const centerY = this.y + this.height / 2;
      const radius = (this.width / 3) + this.bobbleOffset;
      
      // Wing animation
      const wingOffset = Math.sin(Date.now() / 100) * (radius/2);
      
      // Body
      ctx.fillStyle = this.type.baseColor;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radius, radius * 1.2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Wings
      ctx.fillStyle = this.type.highlightColor;
      
      // Left wing
      ctx.beginPath();
      ctx.ellipse(
        centerX - radius, 
        centerY, 
        radius * 0.8, 
        radius * 0.4, 
        Math.PI / 4 + wingOffset/10, 
        0, Math.PI * 2
      );
      ctx.fill();
      
      // Right wing
      ctx.beginPath();
      ctx.ellipse(
        centerX + radius, 
        centerY, 
        radius * 0.8, 
        radius * 0.4, 
        -Math.PI / 4 - wingOffset/10, 
        0, Math.PI * 2
      );
      ctx.fill();
      
      // Head
      ctx.fillStyle = this.type.baseColor;
      ctx.beginPath();
      ctx.arc(centerX, centerY - radius * 0.8, radius * 0.7, 0, Math.PI * 2);
      ctx.fill();
      
      // Beak
      ctx.fillStyle = '#f39c12';
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - radius * 0.8);
      ctx.lineTo(centerX + radius * 0.8, centerY - radius * 0.6);
      ctx.lineTo(centerX, centerY - radius * 0.5);
      ctx.fill();
      
      // Draw eyes
      this.renderEyes(ctx, centerX - radius * 0.2, centerY - radius, radius * 0.6);
    },
    
    renderEyes(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) {
      const eyeSize = radius * 0.3;
      const pupilSize = eyeSize * 0.6;
      const eyeSpacing = radius * 0.4;
      
      // Left eye
      ctx.fillStyle = this.type.eyeColor;
      ctx.beginPath();
      ctx.arc(
        centerX - eyeSpacing + this.eyeOffset/2, 
        centerY - this.eyeOffset/2, 
        eyeSize, 
        0, Math.PI * 2
      );
      ctx.fill();
      
      // Left pupil
      ctx.fillStyle = this.type.pupilColor;
      ctx.beginPath();
      ctx.arc(
        centerX - eyeSpacing + this.eyeOffset, 
        centerY - this.eyeOffset, 
        pupilSize, 
        0, Math.PI * 2
      );
      ctx.fill();
      
      // Right eye
      ctx.fillStyle = this.type.eyeColor;
      ctx.beginPath();
      ctx.arc(
        centerX + eyeSpacing + this.eyeOffset/2, 
        centerY - this.eyeOffset/2, 
        eyeSize, 
        0, Math.PI * 2
      );
      ctx.fill();
      
      // Right pupil
      ctx.fillStyle = this.type.pupilColor;
      ctx.beginPath();
      ctx.arc(
        centerX + eyeSpacing + this.eyeOffset, 
        centerY - this.eyeOffset, 
        pupilSize, 
        0, Math.PI * 2
      );
      ctx.fill();
      
      // Angry eyebrows for slimes
      if (this.type.name === 'slime') {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        
        // Left eyebrow
        ctx.beginPath();
        ctx.moveTo(centerX - eyeSpacing - eyeSize, centerY - eyeSize);
        ctx.lineTo(centerX - eyeSpacing + eyeSize, centerY - eyeSize * 1.5);
        ctx.stroke();
        
        // Right eyebrow
        ctx.beginPath();
        ctx.moveTo(centerX + eyeSpacing - eyeSize, centerY - eyeSize * 1.5);
        ctx.lineTo(centerX + eyeSpacing + eyeSize, centerY - eyeSize);
        ctx.stroke();
      }
    }
  }
} 