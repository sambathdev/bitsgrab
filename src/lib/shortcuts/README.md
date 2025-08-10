# Shortcut System

This directory contains the shortcut management system for the application.

## Architecture

### Files Structure

- `shortcut-registry.ts` - Manages shortcut registrations
- `actions.ts` - Defines shortcut actions (window opening, sidebar toggle, etc.)
- `config.ts` - Registers shortcuts with the registry
- `index.ts` - Exports all shortcut-related functionality

### Key Components

1. **ShortcutRegistry**: A singleton class that manages all registered shortcuts
2. **ShortcutAction**: Interface defining a shortcut action with id, description, and action function
3. **ShortcutDefinition**: Interface defining a shortcut with key, action, and preventDefault option

## Usage

### Adding a New Shortcut

1. **Define the action** in `actions.ts`:
```typescript
export const myAction: ShortcutAction = {
  id: "my-action",
  description: "My custom action",
  action: () => {
    // Your action logic here
  },
};
```

2. **Add the shortcut key** in `src/constants/shortcuts.ts`:
```typescript
export const SHORTCUT_KEYS = {
  // ... existing keys
  MY_ACTION: "meta+a",
} as const;
```

3. **Register the shortcut** in `config.ts`:
```typescript
shortcutRegistry.register({
  key: SHORTCUT_KEYS.MY_ACTION,
  action: myAction,
  preventDefault: true,
});
```

### Connecting to Component State (Approach 1 - Recommended)

For actions that need access to component state, follow this pattern:

1. **Create a component shortcut hook** using the generic `useComponentShortcut`:
```typescript
// src/hooks/use-my-component-shortcut.ts
import { useComponentShortcut } from './use-component-shortcut';
import { useMyComponent } from './use-my-component';

export function useMyComponentShortcut() {
  const myComponentState = useMyComponent();
  
  useComponentShortcut(
    () => ({ 
      myAction: myComponentState.myAction,
      myOtherAction: myComponentState.myOtherAction 
    }),
    '__myComponentActions'
  );
}
```

2. **Use the hook** in your layout:
```typescript
// src/layout/main-layout.tsx
const LayoutWrapper = () => {
  useMyComponentShortcut(); // This connects component to global shortcuts
  useShortcut();
  // ... rest of component
};
```

3. **Create an action** that accesses the global functions:
```typescript
// src/lib/shortcuts/actions.ts
export const createMyComponentAction = (): ShortcutAction => ({
  id: "my-component-action",
  description: "My component action",
  action: () => {
    if (typeof window !== 'undefined' && window.__myComponentActions) {
      window.__myComponentActions.myAction();
    }
  },
});
```

4. **Register the shortcut** in config:
```typescript
// src/lib/shortcuts/config.ts
shortcutRegistry.register({
  key: SHORTCUT_KEYS.MY_ACTION,
  action: shortcutActions.myComponentAction,
  preventDefault: true,
});
```

## Current Shortcuts

- `meta+s` - Open Settings window
- `meta+c` - Open Clipboard window  
- `meta+t` - Toggle sidebar
- `meta+shift+t` - Toggle theme
- `meta+shift+o` - Show test toast

## Benefits

- **Type Safety**: Full TypeScript support
- **Extensibility**: Easy to add new shortcuts
- **Separation of Concerns**: Actions, registration, and configuration are separated
- **Maintainability**: Clear structure and documentation
- **Reusability**: Actions can be reused across the app
