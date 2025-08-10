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
  OPEN_SETTINGS: "meta+s",
  OPEN_CLIPBOARD: "meta+c", 
  OPEN_SIDEBAR: "meta+t",
  TOGGLE_THEME: "meta+shift+t",
  SHOW_TOAST: "meta+shift+o",
} as const;

export type ShortcutKey = keyof typeof SHORTCUT_KEYS;
