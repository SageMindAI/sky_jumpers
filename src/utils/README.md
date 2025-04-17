# Utility Functions

This directory contains utility functions and helpers used throughout the Sky Jumpers game.

## Purpose

These utilities provide reusable, pure functions that handle common tasks without side-effects. They follow functional programming principles and are designed to be:

- Pure (same input always produces same output)
- Simple (focused on single responsibility)
- Well-tested
- Easy to import and use across the project

## Planned Utilities

### Math Utilities

- Collision detection helpers
- Random number generators with seeds
- Vector calculations
- Linear interpolation

### Game Utilities

- Score calculation
- Difficulty scaling
- Level generation helpers

### General Utilities

- Type guards and type conversions
- Data formatters
- Performance monitoring

## KISS Principle

All utilities should follow the KISS principle:

1. Start with the simplest implementation that works
2. Avoid premature optimization
3. Prefer standard JavaScript methods when available
4. Only add complexity when proven necessary

## Usage Patterns

```typescript
// Import specific utilities
import { checkCollision } from '@/utils/collision';

// Use in components or game logic
if (checkCollision(playerRect, enemyRect)) {
  // Handle collision
}
```

## Adding New Utilities

When adding new utilities:

1. Group related functions in a single file
2. Export each function individually
3. Include TypeScript types
4. Consider adding tests for complex utilities
5. Document the utility in this README 