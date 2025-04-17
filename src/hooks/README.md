# Custom React Hooks

This directory contains custom hooks used throughout the Sky Jumpers game.

## Available Hooks

### `usePlatformDetection`

Detects whether the user is on a mobile or desktop platform.

```typescript
import { usePlatformDetection } from '@/hooks/usePlatformDetection'

const MyComponent = () => {
  const platform = usePlatformDetection() // Returns 'mobile' or 'desktop'
  
  return (
    <div>
      {platform === 'mobile' ? (
        <p>Mobile controls</p>
      ) : (
        <p>Desktop controls</p>
      )}
    </div>
  )
}
```

#### Implementation Details

- Uses `navigator.maxTouchPoints` to detect touch capability
- Considers screen size as a secondary indicator
- Re-evaluates on window resize
- Returns a stable value via React state

## Best Practices

- Hooks should be focused on a single responsibility
- Maintain consistent naming conventions (`useXxx`)
- Include proper cleanup in `useEffect` returns
- Minimize rerenders and side effects
- Include TypeScript types for all hooks

## KISS Principle

Keep hooks simple and focused:

1. Prefer built-in React hooks over custom implementations when possible
2. Only extract logic to hooks when it will be reused
3. Avoid complex state management in hooks; prefer to pass state as parameters

## Adding New Hooks

When adding new hooks, follow these guidelines:

1. Create one hook per file
2. Export the hook as the default export
3. Include TypeScript types
4. Document usage with examples
5. Add the hook to this README 