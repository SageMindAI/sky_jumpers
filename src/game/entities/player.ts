import { Player } from '../engine'
import { JUMP_VELOCITY } from '../physics'

export function initPlayer(x: number, y: number): Player {
  // Animation states and timing
  const animations = {
    idle: {
      frameCount: 4,
      frameDuration: 200, // ms per frame
      currentFrame: 0,
      lastFrameTime: 0
    },
    running: {
      frameCount: 6,
      frameDuration: 100,
      currentFrame: 0,
      lastFrameTime: 0
    },
    jumping: {
      frameCount: 2,
      frameDuration: 300,
      currentFrame: 0,
      lastFrameTime: 0
    }
  };
  
  return {
    x,
    y,
    width: 30,
    height: 50,
    velocityY: 0,
    velocityX: 0,
    maxVelocityX: 5,
    accelerationX: 0,
    friction: 0.9,
    isJumping: false,
    jumpForce: JUMP_VELOCITY,
    jumpCooldown: 0,
    facingLeft: false,
    animations,
    
    update(deltaTime: number) {
      // Apply horizontal movement with friction
      this.velocityX += this.accelerationX * (deltaTime / 16)
      
      // Apply friction when not accelerating
      if (this.accelerationX === 0) {
        this.velocityX *= this.friction;
      }
      
      // Cap horizontal velocity (allow faster movement to the right)
      if (this.velocityX > this.maxVelocityX * 1.2) {
        this.velocityX = this.maxVelocityX * 1.2;
      } else if (this.velocityX < -this.maxVelocityX) {
        this.velocityX = -this.maxVelocityX;
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
      
      // Update facing direction
      if (this.velocityX < -0.1) {
        this.facingLeft = true;
      } else if (this.velocityX > 0.1) {
        this.facingLeft = false;
      }
      
      // Update animation frames
      const now = Date.now();
      
      // Determine current animation
      let currentAnim;
      if (this.isJumping) {
        currentAnim = this.animations.jumping;
      } else if (Math.abs(this.velocityX) > 0.5) {
        currentAnim = this.animations.running;
      } else {
        currentAnim = this.animations.idle;
      }
      
      // Update frame if needed
      if (now - currentAnim.lastFrameTime > currentAnim.frameDuration) {
        currentAnim.currentFrame = (currentAnim.currentFrame + 1) % currentAnim.frameCount;
        currentAnim.lastFrameTime = now;
      }
    },
    
    render(ctx: CanvasRenderingContext2D) {
      ctx.save();
      
      // Flip context if facing left
      if (this.facingLeft) {
        ctx.translate(this.x + this.width, 0);
        ctx.scale(-1, 1);
        ctx.translate(-this.x, 0);
      }
      
      // Determine current animation state
      let animState;
      let bounceEffect = 0;
      
      if (this.isJumping) {
        animState = 'jumping';
        bounceEffect = Math.sin(Date.now() / 150) * 2;
      } else if (Math.abs(this.velocityX) > 0.5) {
        animState = 'running';
        // Add a slight bounce when running
        bounceEffect = Math.sin(Date.now() / 100) * 3;
      } else {
        animState = 'idle';
        // Gentle breathing animation when idle
        bounceEffect = Math.sin(Date.now() / 600) * 1.5;
      }
      
      const currentFrame = this.animations[animState].currentFrame;
      
      // Body
      this.renderBody(ctx, bounceEffect, animState, currentFrame);
      
      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.beginPath();
      ctx.ellipse(
        this.x + this.width/2,
        this.y + this.height - 2,
        this.width/2,
        5,
        0, 0, Math.PI * 2
      );
      ctx.fill();
      
      ctx.restore();
    },
    
    renderBody(ctx: CanvasRenderingContext2D, bounceEffect: number, animState: string, frame: number) {
      const centerX = this.x + this.width / 2;
      const centerY = this.y + this.height / 2 - 10 + bounceEffect;
      
      // Base body shape - slightly rounded rectangle
      ctx.fillStyle = '#3498db'; // Blue
      
      // Main body - adjust shape based on animation
      if (animState === 'jumping') {
        // Stretched body for jumping
        ctx.beginPath();
        ctx.roundRect(
          this.x, 
          this.y - 5 + bounceEffect, 
          this.width, 
          this.height - 10, 
          8
        );
        ctx.fill();
        
        // Arms up
        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        // Left arm
        ctx.roundRect(
          this.x - 5, 
          this.y + 5 + bounceEffect, 
          8, 
          20, 
          4
        );
        // Right arm
        ctx.roundRect(
          this.x + this.width - 3, 
          this.y + 5 + bounceEffect, 
          8, 
          20, 
          4
        );
        ctx.fill();
      } else {
        // Normal body
        ctx.beginPath();
        ctx.roundRect(
          this.x, 
          this.y + bounceEffect, 
          this.width, 
          this.height - 15, 
          8
        );
        ctx.fill();
        
        // Arms
        const armSwing = animState === 'running' ? 
          Math.sin(Date.now() / 100 + frame) * 10 : 
          Math.sin(Date.now() / 400) * 3;
        
        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        // Left arm
        ctx.roundRect(
          this.x - 5, 
          this.y + 10 + bounceEffect + armSwing, 
          8, 
          20, 
          4
        );
        // Right arm
        ctx.roundRect(
          this.x + this.width - 3, 
          this.y + 10 + bounceEffect - armSwing, 
          8, 
          20, 
          4
        );
        ctx.fill();
      }
      
      // Legs
      this.renderLegs(ctx, bounceEffect, animState, frame);
      
      // Head
      this.renderHead(ctx, bounceEffect, animState, frame);
    },
    
    renderLegs(ctx: CanvasRenderingContext2D, bounceEffect: number, animState: string, frame: number) {
      // Legs animations
      ctx.fillStyle = '#2980b9'; // Slightly darker blue
      
      if (animState === 'running') {
        // Running legs with alternating positions
        const legOffset = Math.sin(Date.now() / 100) * 8;
        
        // Left leg
        ctx.beginPath();
        ctx.roundRect(
          this.x + 5, 
          this.y + this.height - 25 + bounceEffect + legOffset, 
          8, 
          25, 
          4
        );
        ctx.fill();
        
        // Right leg
        ctx.beginPath();
        ctx.roundRect(
          this.x + this.width - 13, 
          this.y + this.height - 25 + bounceEffect - legOffset, 
          8, 
          25, 
          4
        );
        ctx.fill();
      } else if (animState === 'jumping') {
        // Jumping legs (together and bent)
        ctx.beginPath();
        ctx.roundRect(
          this.x + 8, 
          this.y + this.height - 20 + bounceEffect, 
          14, 
          20, 
          5
        );
        ctx.fill();
      } else {
        // Idle legs (slightly apart)
        ctx.beginPath();
        ctx.roundRect(
          this.x + 5, 
          this.y + this.height - 25 + bounceEffect, 
          8, 
          25, 
          4
        );
        ctx.fill();
        
        ctx.beginPath();
        ctx.roundRect(
          this.x + this.width - 13, 
          this.y + this.height - 25 + bounceEffect, 
          8, 
          25, 
          4
        );
        ctx.fill();
      }
    },
    
    renderHead(ctx: CanvasRenderingContext2D, bounceEffect: number, animState: string, frame: number) {
      const headY = this.y - 15 + bounceEffect;
      
      // Head
      const gradient = ctx.createRadialGradient(
        this.x + this.width/2 - 2, 
        headY + 10, 
        2,
        this.x + this.width/2,
        headY + 15,
        20
      );
      gradient.addColorStop(0, '#3498db');
      gradient.addColorStop(1, '#2980b9');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(
        this.x + this.width/2,
        headY + 15,
        20,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      // Face features
      
      // Eyes
      const eyeY = headY + 10;
      const blinkState = Math.floor(Date.now() / 3000) % 10 === 0;
      
      if (blinkState) {
        // Blinking eyes
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        
        // Left eye
        ctx.beginPath();
        ctx.moveTo(this.x + this.width/2 - 8, eyeY);
        ctx.lineTo(this.x + this.width/2 - 3, eyeY);
        ctx.stroke();
        
        // Right eye
        ctx.beginPath();
        ctx.moveTo(this.x + this.width/2 + 3, eyeY);
        ctx.lineTo(this.x + this.width/2 + 8, eyeY);
        ctx.stroke();
      } else {
        // Normal eyes
        ctx.fillStyle = 'white';
        
        // Left eye
        ctx.beginPath();
        ctx.arc(
          this.x + this.width/2 - 6,
          eyeY,
          4,
          0,
          Math.PI * 2
        );
        ctx.fill();
        
        // Right eye
        ctx.beginPath();
        ctx.arc(
          this.x + this.width/2 + 6,
          eyeY,
          4,
          0,
          Math.PI * 2
        );
        ctx.fill();
        
        // Pupils
        ctx.fillStyle = 'black';
        
        // Pupil position changes based on movement
        const pupilOffset = animState === 'running' ? 1.5 : 0;
        
        // Left pupil
        ctx.beginPath();
        ctx.arc(
          this.x + this.width/2 - 5 + pupilOffset,
          eyeY,
          2,
          0,
          Math.PI * 2
        );
        ctx.fill();
        
        // Right pupil
        ctx.beginPath();
        ctx.arc(
          this.x + this.width/2 + 7 + pupilOffset,
          eyeY,
          2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      
      // Mouth
      if (animState === 'jumping') {
        // Open mouth when jumping
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.ellipse(
          this.x + this.width/2,
          headY + 25,
          5,
          3,
          0, 0, Math.PI * 2
        );
        ctx.fill();
      } else {
        // Smile
        ctx.strokeStyle = '#34495e';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(
          this.x + this.width/2,
          headY + 20,
          8,
          0.2,
          Math.PI - 0.2
        );
        ctx.stroke();
      }
    },
    
    jump() {
      if (!this.isJumping && this.jumpCooldown <= 0) {
        this.velocityY = this.jumpForce;
        this.isJumping = true;
        this.jumpCooldown = 250; // Same cooldown between jumps
        
        // Add a small horizontal boost in the direction the player is moving
        if (this.velocityX > 0.5) {
          this.velocityX += 0.5; // Small horizontal boost
        } else if (this.velocityX < -0.5) {
          this.velocityX -= 0.5; // Small horizontal boost
        }
      }
    },
    
    moveLeft(force = 0.6) {
      this.accelerationX = -force;
    },
    
    moveRight(force = 0.6) {
      // Allow stronger acceleration to the right
      this.accelerationX = force * 1.1;
    },
    
    stopMoving() {
      this.accelerationX = 0;
    }
  }
} 