# Sky Jumpers: Game Engine Implementation

This directory contains the core game loop and rendering functionality for Sky Jumpers.

## Key Files
- `engine.ts` - The core game engine that handles the main loop
- `physics.ts` - Handles collisions, gravity, and movement
- `renderer.ts` - Handles drawing to the canvas
- `entities/` - All game objects (player, buildings, enemies, etc.)
- `systems/` - Game systems (camera, scoring, spawning, etc.)

## Core Game Loop
The game uses a custom game loop based on `requestAnimationFrame` to:
1. Process inputs
2. Update game state (physics, collisions, spawning)
3. Render the frame
4. Repeat

See `engine.ts` for implementation details.

## Physics System
Sky Jumpers uses a simple physics system with the following key constants:

```typescript
// Current physics constants
const GRAVITY = 0.4;
const JUMP_VELOCITY = -8;
const TERMINAL_VELOCITY = 10;
```

These can be tuned for different gameplay feels.

## Side-Scrolling Mechanics
The game is designed as a side-scroller with these key elements:

1. **Infinite Level Generation**: Buildings and obstacles are dynamically generated ahead of the player and removed once they're off-screen
2. **Horizontal Camera Movement**: The camera follows the player's horizontal movement while allowing vertical jumps
3. **Forward Momentum**: The game encourages rightward progression with faster movement to the right
4. **Distance-Based Progression**: Score and difficulty increase with horizontal distance traveled

## Camera System
The camera system in `systems/camera.ts` handles:
- Tracking the player horizontally with slight lead distance
- Allowing vertical freedom during jumps
- Setting view boundaries and handling screen transitions

## Input Handling
Input is managed through a unified interface that works across:
- Touch devices (tap to jump, swipe for movement)
- Keyboard (arrow keys/space)

See `systems/input.ts` for detailed implementation.

## Spawn System
The spawn system:
- Generates buildings, powerups, and enemies ahead of the player
- Increases spawn frequency and speed according to player progress
- Ensures playable paths are always generated

## Safety Features
- Frame rate independent physics using delta time
- Error boundaries to prevent game crashes
- Debug flags for development

## KISS Principle (Keep It Simple, Stupid)
We follow the KISS principle throughout the engine:
- Simple rectangular collision over complex shapes
- Direct input mapping rather than complex gesture detection
- Forward-only level generation to avoid complex tracking systems
- Limited entity types with focused behaviors

## Game Entities

- `entities/player.ts` - The stick figure player character
- `entities/building.ts` - Platform buildings for jumping
- `entities/enemy.ts` - Flying enemies/obstacles
- `entities/powerup.ts` - Collectible items and power-ups
- `entities/world.ts` - World generation and management

## References

See [Technical Architecture](../../docs/sky_jumpers_technical_architecture.md) for more details. 