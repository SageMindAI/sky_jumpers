# Game Engine

This directory contains the core game engine implementation for Sky Jumpers.

## Key Files

- `engine.ts` - Main game loop and engine initialization
- `renderer.ts` - Canvas rendering functionality
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

## Input Handling

Touch controls are the primary input method:

- Tap/swipe up to jump
- Swipe left/right to move
- Tap on power-ups to activate

Keyboard controls are available as a fallback for desktop testing.

## Physics System

The physics system is intentionally simple:

- Basic gravity for jumping mechanics
- Simple rectangle collision detection
- No complex physics simulation to keep performance high on mobile

## Performance Considerations

- Only render entities visible on screen
- Use object pooling for frequently created/destroyed objects
- Minimize garbage collection during gameplay
- Use simple shapes for collision detection

## KISS Principle

This engine purposely avoids complex implementations. When adding features:

1. Start with the simplest implementation that works
2. Test on mobile devices
3. Optimize only if performance issues arise

## References

See [Technical Architecture](../../docs/sky_jumpers_technical_architecture.md) for more details. 