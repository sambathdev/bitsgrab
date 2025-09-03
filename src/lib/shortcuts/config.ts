/* eslint-disable import/order */
import { SHORTCUT_KEYS } from "@/constants/shortcuts";
import { shortcutActions } from "./actions";
import { shortcutRegistry } from "./shortcut-registry";

export function initializeShortcuts() {
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
}
