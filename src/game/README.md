# Game Engine

This directory contains the core game engine implementation for Sky Jumpers.

## Key Files

- `engine.ts` - Main game loop and engine initialization
- `renderer.ts` - Canvas rendering functionality with camera system
- `physics.ts` - Simple physics system for gravity, collisions, etc.
- `input.ts` - Touch and keyboard input handling
- `entities/` - Game object implementations

## Game Entities

- `entities/player.ts` - The stick figure player character
- `entities/building.ts` - Platform buildings for jumping
- `entities/enemy.ts` - Flying enemies/obstacles
- `entities/powerup.ts` - Collectible items and power-ups
- `entities/world.ts` - World generation and management

## Core Game Loop

The game follows a simple loop pattern:

1. Process input (touch/keyboard)
2. Update game state
3. Render to canvas
4. Repeat

```typescript
// Simplified example
function gameLoop(timestamp) {
  const deltaTime = timestamp - lastTime;
  
  processInput();
  updateGameState(deltaTime);
  render();
  
  requestAnimationFrame(gameLoop);
}
```

## Physics System

The physics system is intentionally simple:

- Gravity-based jumping with adjustable parameters
- Simple rectangle collision detection
- Momentum-based horizontal movement with friction
- Delta-time normalization for consistent gameplay across devices

Constants are tuned for mobile gameplay:
```typescript
const GRAVITY = 0.4
const JUMP_VELOCITY = -8
const TERMINAL_VELOCITY = 10
```

## Camera System

A minimalist camera system follows the player during jumps:

- Subtle vertical tracking that keeps buildings in view
- Limited movement range to prevent disorientation
- Smooth transitions using interpolation
- Automatic reset to base position after jumping

## Input Handling

Touch controls are the primary input method:

- Tap/swipe up to jump
- Swipe left/right to move
- Tap on power-ups to activate

Keyboard controls are available as a fallback for desktop testing:

- Space/Arrow Up to jump
- Left/Right arrows to move
- R key to reset player position

## Safety Features

- Player reset if they go too far off-screen
- Emergency reset button in UI
- Automatic building regeneration on major screen resize
- Boundary checks to keep player in playable area

## KISS Principle

This engine purposely avoids complex implementations. When adding features:

1. Start with the simplest implementation that works
2. Test on mobile devices
3. Optimize only if performance issues arise

## References

See [Technical Architecture](../../docs/sky_jumpers_technical_architecture.md) for more details. 