# Sky Jumpers Source Code

This directory contains all the source code for the Sky Jumpers game.

## Directory Structure

- `/components` - React UI components 
- `/game` - Core game engine implementation
- `/hooks` - Custom React hooks
- `/pages` - Next.js pages and routing
- `/styles` - Global styles and Tailwind configuration
- `/utils` - Utility functions and helpers

## Key Files

- `pages/_app.tsx` - Main Next.js application wrapper
- `pages/index.tsx` - Game entry point
- `game/engine.ts` - Main game loop and engine initialization
- `components/GameCanvas.tsx` - The main canvas component that hosts the game

## Core Design Principles

1. **Keep It Simple** - Prioritize simple, maintainable solutions over complex code
2. **Separation of Concerns** - UI components remain separate from game logic
3. **Performance First** - Optimize for mobile devices, minimize re-renders and memory usage
4. **Type Safety** - Use TypeScript types consistently throughout codebase

## Getting Started

For developers new to the codebase:

1. Start with the main game loop in `/game/engine.ts`
2. Look at how the game connects to React in `components/GameCanvas.tsx`
3. Examine the input handling in `/game/input.ts`

## References

Refer to the [Technical Architecture](../docs/sky_jumpers_technical_architecture.md) for more details on the game's implementation. 