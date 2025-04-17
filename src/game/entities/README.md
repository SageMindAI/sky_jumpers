# Game Entities

This directory contains the implementation of game objects used in Sky Jumpers.

## Entity Types

### Player (`player.ts`)

The main character controlled by the user.

- **Physics Properties**: 
  - Horizontal movement with acceleration and friction
  - Vertical movement with gravity and jumping
  - Forward momentum bias (faster rightward movement)
  - Slight auto-movement to encourage progression
  - Customizable jump parameters
- **Controls**:
  - `jump()`: Makes the player jump if on a platform
  - `moveLeft()`: Applies leftward acceleration
  - `moveRight()`: Applies rightward acceleration (with a small speed bonus)
  - `stopMoving()`: Removes horizontal acceleration
- **Animations**:
  - Standing pose
  - Running animation with leg motion
  - Jumping pose with raised arms
  - Arm sway during movement
  - Eye rendering indicating player facing direction

### Buildings (`building.ts`)

Platform buildings that the player jumps between.

- **Generation**: Buildings are procedurally generated ahead of the player in the side-scrolling world
- **Properties**:
  - Variable heights and widths
  - Collision detection for landing
  - Visual styling with windows and rooftops
  - Dynamic difficulty scaling (wider gaps as player progresses)
- **Lifecycle**: Buildings far behind the player are removed to conserve memory
- **Starting Platform**: Special wider platform at the beginning

### Enemies (`enemy.ts`)

Flying obstacles that the player must avoid.

- **Movement**: Autonomous movement with bouncing off walls
- **Collision**: Reduces player score on contact
- **Visual**: Red blob with eyes
- **Generation**: Spawned at intervals ahead of the player with random movement patterns
- **Difficulty**: Spawn rate increases with player's distance traveled

### Powerups (`powerup.ts`)

Collectible items that provide benefits to the player.

- **Types**:
  - Speed: Increases player movement speed
  - Shield: Protects from enemy collisions
  - Points: Increases score
- **Visual**: Distinct shapes and colors for each type
- **Effects**: Activate on collision with player
- **Generation**: Spawned ahead of the player at random intervals

## Entity Structure

All entities follow the GameObject interface providing:

```typescript
interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  update: (deltaTime: number) => void;
  render: (ctx: CanvasRenderingContext2D) => void;
}
```

## View Optimization

Entities implement optimization techniques for side-scrolling:

- **Viewport Culling**: Only entities visible in the current viewport are rendered
- **Memory Management**: Entities far behind the player are removed from memory
- **Dynamic Generation**: New entities are created ahead of the player as they progress
- **Distance-Based Scaling**: Entity properties scale with distance traveled

## KISS Implementation

Entities are kept deliberately simple:

- Basic shapes for rendering (rectangles, circles)
- Simple physics calculations
- Minimal state management
- Optimized for mobile performance

## Adding New Entities

When adding new entities:

1. Follow the GameObject interface pattern
2. Keep rendering simple with basic shapes
3. Use deltaTime for frame-rate independent movement
4. Optimize updates to avoid performance issues
5. Document entity behavior in this README 