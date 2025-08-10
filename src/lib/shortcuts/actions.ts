import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { WINDOW_LABEL, WINDOW_CONFIGS } from "@/constants/windows";
import { ShortcutAction } from "@/constants/shortcuts";

// Create a function that returns the toggle action with access to sidebar context
export const createSidebarToggleAction = (): ShortcutAction => ({
  id: "toggle-sidebar",
  description: "Toggle sidebar visibility",
  action: () => {
    // Access the global function set by useSidebarShortcut hook
    if (typeof window !== 'undefined' && window.__toggleSidebar) {
      window.__toggleSidebar();
    }
  },
});

// Create a function that returns the theme toggle action
export const createThemeToggleAction = (): ShortcutAction => ({
  id: "toggle-theme",
  description: "Toggle theme (light/dark/system)",
  action: () => {
    // Access the global theme actions set by useThemeShortcut hook
    if (typeof window !== 'undefined' && window.__themeActions) {
      window.__themeActions.toggleTheme();
    }
  },
});

// Create a function that returns the toast action
export const createToastAction = (): ShortcutAction => ({
  id: "show-toast",
  description: "Show a test toast notification",
  action: () => {
    // Access the global toast actions set by useToastShortcut hook
    if (typeof window !== 'undefined' && window.__toastActions) {
      window.__toastActions.showSuccess("Shortcut triggered!");
    }
  },
});

export const createWindowAction = (
  windowLabel: WINDOW_LABEL,
): ShortcutAction => ({
  id: `open-${windowLabel}`,
  description: `Open ${windowLabel} window`,
  action: () => {
    const window = new WebviewWindow(windowLabel, {
      ...WINDOW_CONFIGS[windowLabel]
    });
    
    window.once("tauri://created", async function () {
      // Handle window creation
    });
  },
});

export const shortcutActions = {
  openSettings: createWindowAction(WINDOW_LABEL.SETTINGS),
  openClipboard: createWindowAction(WINDOW_LABEL.CLIPBOARD),
  toggleSidebar: createSidebarToggleAction(),
  toggleTheme: createThemeToggleAction(),
  showToast: createToastAction(),
};
