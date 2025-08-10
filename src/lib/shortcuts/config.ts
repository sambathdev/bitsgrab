import { SHORTCUT_KEYS } from "@/constants/shortcuts";
import { shortcutActions } from "./actions";
import { shortcutRegistry } from "./shortcut-registry";

export function initializeShortcuts() {
  // Register all shortcuts
  shortcutRegistry.register({
    key: SHORTCUT_KEYS.OPEN_SETTINGS,
    action: shortcutActions.openSettings,
    preventDefault: true,
  });

  shortcutRegistry.register({
    key: SHORTCUT_KEYS.OPEN_CLIPBOARD,
    action: shortcutActions.openClipboard,
    preventDefault: true,
  });

  shortcutRegistry.register({
    key: SHORTCUT_KEYS.OPEN_SIDEBAR,
    action: shortcutActions.toggleSidebar,
    preventDefault: true,
  });

  shortcutRegistry.register({
    key: SHORTCUT_KEYS.TOGGLE_THEME,
    action: shortcutActions.toggleTheme,
    preventDefault: true,
  });

  shortcutRegistry.register({
    key: SHORTCUT_KEYS.SHOW_TOAST,
    action: shortcutActions.showToast,
    preventDefault: true,
  });

  // Add more shortcuts as needed
}
