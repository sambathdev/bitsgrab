import { useComponentShortcut } from "./use-component-shortcut";
import { toast } from "sonner";

export function useToastShortcut() {
  const toastActions = {
    showSuccess: (message: string) => {
      if (Math.random() < 0.5) {
        toast.success(message);
      } else {
        toast.error(message)
      }
    },
    showError: (message: string) => toast.error(message),
    showInfo: (message: string) => toast.info(message),
    showWarning: (message: string) => toast.warning(message),
    dismissAll: () => toast.dismiss(),
  };

  useComponentShortcut(() => toastActions, "__toastActions");
}
