import { Player } from '../engine'
import { JUMP_VELOCITY } from '../physics'

export function initPlayer(x: number, y: number): Player {
  return {
    x,
    y,
    width: 30,
    height: 50,
    velocityY: 0,
    velocityX: 0,
    maxVelocityX: 8,
    accelerationX: 0,
    friction: 0.9, // Friction to slow down horizontal movement
    isJumping: false,
    jumpForce: JUMP_VELOCITY,
    jumpCooldown: 0, // Add a cooldown to prevent rapid jumps
    
    update(deltaTime: number) {
      // Apply horizontal movement with friction
      this.velocityX += this.accelerationX * (deltaTime / 16)
      
      // Apply friction when not accelerating
      if (this.accelerationX === 0) {
        this.velocityX *= this.friction;
      }
      
      // Cap horizontal velocity
      if (Math.abs(this.velocityX) > this.maxVelocityX) {
        this.velocityX = this.maxVelocityX * Math.sign(this.velocityX);
      }
      
      // Stop if very slow
      if (Math.abs(this.velocityX) < 0.1) {
        this.velocityX = 0;
      }
      
      // Update horizontal position based on velocity
      this.x += this.velocityX;
      
      // Update jump cooldown
      if (this.jumpCooldown > 0) {
        this.jumpCooldown -= deltaTime;
      }
    },
    
    render(ctx: CanvasRenderingContext2D) {
      // Draw player as stick figure
      ctx.fillStyle = 'black'
      
      // Head
      ctx.beginPath()
      ctx.arc(this.x + this.width / 2, this.y + 10, 10, 0, Math.PI * 2)
      ctx.fill()
      
      // Body
      ctx.beginPath()
      ctx.moveTo(this.x + this.width / 2, this.y + 20)
      ctx.lineTo(this.x + this.width / 2, this.y + 35)
      ctx.stroke()
      
      // Arms - different pose when jumping
      const armOffset = this.isJumping ? 
        Math.min(5, Math.abs(this.velocityY) / 2) : // Arms up when jumping based on velocity
        Math.sin(Date.now() / 150) * 2;             // Gentle swing when not jumping
      
      ctx.beginPath()
      
      if (this.isJumping) {
        // Arms up when jumping
        ctx.moveTo(this.x + this.width / 2, this.y + 25)
        ctx.lineTo(this.x + 10, this.y + 25 - armOffset)
        ctx.moveTo(this.x + this.width / 2, this.y + 25)
        ctx.lineTo(this.x + this.width - 10, this.y + 25 - armOffset)
      } else {
        // Normal arm position
        ctx.moveTo(this.x + 10, this.y + 25 + armOffset)
        ctx.lineTo(this.x + this.width - 10, this.y + 25 - armOffset)
      }
      
      ctx.stroke()
      
      // Don't draw the legs twice - clear the default legs
      // if we're going to show the running animation
      if (this.isJumping) {
        // Legs in jumping position - together and slightly bent
        ctx.beginPath()
        ctx.moveTo(this.x + this.width / 2, this.y + 35)
        ctx.lineTo(this.x + this.width / 2, this.y + 45)
        ctx.stroke()
      } else if (Math.abs(this.velocityX) <= 0.5) {
        // Legs - normal stance
        ctx.beginPath()
        ctx.moveTo(this.x + this.width / 2, this.y + 35)
        ctx.lineTo(this.x + 10, this.y + 50)
        ctx.moveTo(this.x + this.width / 2, this.y + 35)
        ctx.lineTo(this.x + this.width - 10, this.y + 50)
        ctx.stroke()
      } else {
        // Running animation
        const legOffset = Math.sin(Date.now() / 100) * 5; // Increased amplitude
        
        ctx.beginPath()
        ctx.moveTo(this.x + this.width / 2, this.y + 35)
        ctx.lineTo(this.x + 10 + legOffset, this.y + 50)
        ctx.moveTo(this.x + this.width / 2, this.y + 35)
        ctx.lineTo(this.x + this.width - 10 - legOffset, this.y + 50)
        ctx.stroke()
      }
    },
    
    jump() {
      if (!this.isJumping && this.jumpCooldown <= 0) {
        // Reduced jump force for more controlled jumps
        this.velocityY = this.jumpForce * 0.9;
        this.isJumping = true;
        this.jumpCooldown = 250; // Same cooldown between jumps
        
        // Add a small horizontal boost in the direction the player is moving
        // but keep it modest to prevent flying off too far
        if (this.velocityX > 0.5) {
          this.velocityX += 0.5; // Reduced horizontal boost
        } else if (this.velocityX < -0.5) {
          this.velocityX -= 0.5; // Reduced horizontal boost
        }
      }
    },
    
    moveLeft(force = 0.8) {
      this.accelerationX = -force;
    },
    
    moveRight(force = 0.8) {
      this.accelerationX = force;
    },
    
    stopMoving() {
      this.accelerationX = 0;
    }
  }
} 