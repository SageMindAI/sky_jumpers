# Sky Jumpers: The Battle Above the Blocks

A mobile-first web game where stick-figure heroes leap across rooftops, dodge flying enemies, and save their world from a solar anomaly.

## Core Purpose
Simple, fun, touch-based side-scrolling platformer game playable on mobile devices and deployable to Vercel.

## Key Features
- Intuitive touch controls for jumping between buildings
- Infinite side-scrolling level generation
- Camera that tracks player horizontally while allowing vertical jumps
- Forward-focused gameplay with optimized movement mechanics
- Dodge dynamic flying enemies
- Collect power-ups and energy orbs
- Whimsical hand-drawn art style
- Progressive difficulty as you travel further

## Tech Stack
- **Framework**: Next.js with TypeScript
- **Game Engine**: HTML5 Canvas with custom game loop
- **Styling**: TailwindCSS
- **Package Manager**: pnpm

## Project Structure
- `/docs` - Project documentation and specifications
- `/public` - Static assets (sprites, sounds)
- `/src` - Source code
  - `/components` - React components
  - `/game` - Game engine code
  - `/hooks` - Custom React hooks
  - `/pages` - Next.js pages
  - `/styles` - Global styles
  - `/utils` - Utility functions

## Getting Started
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
pnpm install
# or if pnpm is not available
npm install

# Start the development server
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Game Controls
- **Mobile**: Tap to jump, swipe left/right to move (right movement is faster for progression)
- **Desktop**: Space/Up Arrow to jump, Left/Right Arrows to move

## Current Status & Known Issues
- Infinite side-scrolling gameplay implemented with dynamic building generation
- Player position is optimized for forward (rightward) movement
- Enemies and powerups spawn ahead of the player as they progress
- The game is still in early development
- For best experience, test on a mobile device or emulator
- Score increases based on distance traveled

## Future Improvements
- Add more diverse enemy types with unique movement patterns
- Implement a proper game over screen
- Add sound effects and background music
- Implement a high score leaderboard
- Add more varied power-ups with unique effects
- Visual enhancements for distance milestones

## Documentation Strategy
This project uses hierarchical READMEs throughout the codebase:
- **Always start here** for high-level context
- Check directory-specific READMEs for detailed context about each area
- Reference the technical architecture in `docs/sky_jumpers_technical_architecture.md`

## Guiding Principles
- **KISS (Keep It Simple, Stupid)**: Prioritize simple, robust implementations over complex ones
- **Mobile-First**: Design for touch screens first
- **Performance**: Optimize for smooth gameplay on mobile devices 