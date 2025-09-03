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

export const shortcutActions = {
  toggleSidebar: createSidebarToggleAction(),
  toggleTheme: createThemeToggleAction(),
};
