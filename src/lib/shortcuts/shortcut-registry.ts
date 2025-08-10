import { ShortcutDefinition, ShortcutAction } from "@/constants/shortcuts";

class ShortcutRegistry {
  private shortcuts = new Map<string, ShortcutDefinition>();

  register(shortcut: ShortcutDefinition) {
    this.shortcuts.set(shortcut.key, shortcut);
  }

  unregister(key: string) {
    this.shortcuts.delete(key);
  }

  getShortcuts(): ShortcutDefinition[] {
    return Array.from(this.shortcuts.values());
  }

  getShortcut(key: string): ShortcutDefinition | undefined {
    return this.shortcuts.get(key);
  }

  clear() {
    this.shortcuts.clear();
  }
}

export const shortcutRegistry = new ShortcutRegistry();
