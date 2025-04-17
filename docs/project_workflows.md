# Sky Jumpers Development Workflows

This document outlines the recommended workflows and best practices for developing the Sky Jumpers game.

## Development Environment Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```

## Development Workflow

### 1. Understand Before Coding

Before making changes:
- Read the relevant README.md files for the area you're working on
- Understand the existing patterns and architecture
- Reference the technical architecture document

### 2. Follow the KISS Principle

- Start with the simplest solution that works
- Only add complexity when necessary
- Prioritize readability and maintainability over cleverness
- Consider mobile performance for all changes

### 3. Test on Mobile Devices

- Use browser dev tools mobile emulation during development
- Test on actual mobile devices before considering features complete
- Verify touch controls work as expected
- Check performance metrics

### 4. Update Documentation

- When adding new features or making significant changes, update relevant README.md files
- Keep documentation simple and concise
- Focus on intent and purpose rather than implementation details

## Coding Practices

### Game Engine Development

- Maintain separation between game logic and rendering
- Keep the game loop simple and efficient
- Use object pooling for frequently created entities
- Minimize garbage collection during gameplay

### UI Component Development  

- Create small, focused components
- Use TypeScript interfaces for props
- Keep state management simple
- Design for touch first

### Performance Optimizations

- Profile before optimizing
- Focus on critical rendering path
- Minimize objects created during gameplay
- Use sprite atlases for game assets
- Keep DOM elements to a minimum

## Using AI Assistants

When using Cursor or other AI assistants:

1. Start by providing context from the appropriate README files
2. Emphasize the KISS principle and mobile-first approach
3. Ask for simple solutions before complex ones
4. Verify suggested code works on mobile devices

## Deployment

1. Build the project:
   ```bash
   pnpm build
   ```

2. Test the production build locally:
   ```bash
   pnpm start
   ```

3. Deploy to Vercel:
   ```bash
   vercel
   ```

## Project Structure Reference

```
sky_jumpers/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   ├── game/            # Game engine code
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Next.js pages
│   ├── styles/          # Global styles
│   └── utils/           # Utility functions
├── docs/                # Documentation
└── .cursor/rules/       # Cursor AI assistant rules
``` 