# UI Components

This directory contains React components for Sky Jumpers.

## Component Organization

- `/ui` - Reusable UI primitives (buttons, menus, etc.)
- `/game` - Game-specific components
- `/layout` - Page layout components

## Key Components

- `GameCanvas.tsx` - The main canvas component that hosts the game
- `TouchControls.tsx` - Overlay for mobile touch controls
- `GameMenu.tsx` - Main menu interface
- `ControlHints.tsx` - Contextual control hints based on platform
- `ScoreDisplay.tsx` - HUD component for showing score/progress
- `PowerupIndicator.tsx` - Shows active power-ups

## Platform Detection

The game automatically detects the user's platform (mobile/desktop) and adjusts:

- Control schemes (touch vs. keyboard)
- UI elements and their positioning
- Control instructions shown to the user
- Input sensitivity

Implementation via the `usePlatformDetection` hook checks for:
- Touch capability using navigator.maxTouchPoints
- Screen size thresholds
- Orientation changes

## UI Features

- **Adaptive Control Hints**: Different instructions based on detected platform
- **Control Toggle**: Button to show/hide control instructions
- **Reset Button**: Emergency reset if player gets stuck
- **Platform Indicator**: Shows current platform mode in the corner
- **Debug Information**: Display of player state and position (development only)

## UI Design Principles

1. **Mobile-First** - All components designed for touch interaction first
2. **Minimal UI** - Keep interface elements minimal to maximize game view
3. **Performance** - Avoid unnecessary re-renders
4. **Accessibility** - Support screen readers and keyboard controls where possible

## Component Guidelines

When creating new components:

- Use functional components with hooks
- Utilize TypeScript interfaces for props
- Keep components small and focused on a single responsibility
- Minimize state in UI components - game state should live in the game engine

## Styling

- Tailwind CSS for styling
- CSS Modules for component-specific styles
- Consistent color scheme defined in `tailwind.config.js`

Example component structure:

```tsx
import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  onClick: () => void;
  label: string;
}

export const Button: React.FC<ButtonProps> = ({ onClick, label }) => {
  return (
    <button 
      className="bg-primary text-white px-4 py-2 rounded-lg"
      onClick={onClick}
    >
      {label}
    </button>
  );
};
```

## KISS Principle

Follow these guidelines to keep components simple:

1. Start with the minimal implementation needed
2. Add complexity only when necessary
3. Prefer composition over inheritance
4. Use built-in React features before reaching for external libraries

## References

See the [Technical Architecture](../../docs/sky_jumpers_technical_architecture.md) for more details on UI implementation. 