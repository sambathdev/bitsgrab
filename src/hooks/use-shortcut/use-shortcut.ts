import { useEffect, useRef } from "react";
import { initializeShortcuts } from "@/lib/shortcuts/config";

export function useShortcut() {
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      initializeShortcuts();
      initialized.current = true;
    }
  }, []);
}
