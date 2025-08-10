declare global {
  interface Window {
    __toggleSidebar?: () => void;
    __themeActions?: {
      toggleTheme: () => void;
      setTheme: (theme: string) => void;
      theme: string;
    };
    __toastActions?: {
      showSuccess: (message: string) => void,
      showError: (message: string) => void,
      showInfo: (message: string) => void,
      showWarning: (message: string) => void,
      dismissAll: () => void,
    }
    [key: string]: any; // Allow any component actions
  }
}

export {};
