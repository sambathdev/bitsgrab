import { useComponentShortcut } from './use-component-shortcut';
import { useTheme } from '../use-theme';

export function useThemeShortcut() {
  const themeState = useTheme();
  
  useComponentShortcut(
    () => ({ 
      toggleTheme: themeState.toggleTheme,
      setTheme: themeState.setTheme,
      theme: themeState.theme 
    }),
    '__themeActions'
  );
}
