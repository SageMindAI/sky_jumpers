# Sky Jumpers: The Battle Above the Blocks

A mobile-first web game where stick-figure heroes leap across rooftops, dodge flying enemies, and save their world from a solar anomaly.

## Core Purpose
Simple, fun, touch-based platforming game playable on mobile devices and deployable to Vercel.

## Key Features
- Intuitive touch controls for jumping between buildings
- Dodge dynamic flying enemies
- Collect power-ups and energy orbs
- Whimsical hand-drawn art style

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

# Start the development server
pnpm dev
```

## Documentation Strategy
This project uses hierarchical READMEs throughout the codebase:
- **Always start here** for high-level context
- Check directory-specific READMEs for detailed context about each area
- Reference the technical architecture in `docs/sky_jumpers_technical_architecture.md`

## Guiding Principles
- **KISS (Keep It Simple, Stupid)**: Prioritize simple, robust implementations over complex ones
- **Mobile-First**: Design for touch screens first
- **Performance**: Optimize for smooth gameplay on mobile devices 