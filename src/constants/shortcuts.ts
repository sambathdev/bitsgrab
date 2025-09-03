export interface ShortcutAction {
  id: string;
  description: string;
  action: () => void | Promise<void>;
  enabled?: boolean;
}

export interface ShortcutDefinition {
  key: string;
  action: ShortcutAction;
  preventDefault?: boolean;
}

export const SHORTCUT_KEYS = {
  OPEN_SIDEBAR: "meta+shift+b",
  TOGGLE_THEME: "meta+shift+t",
} as const;

export type ShortcutKey = keyof typeof SHORTCUT_KEYS;
