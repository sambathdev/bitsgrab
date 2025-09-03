/* eslint-disable import/order */
import { useEffect, useRef } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { useComponentShortcut } from "./use-component-shortcut";

// This hook connects the sidebar state to global shortcut actions
export function useSidebarShortcut() {
  const { toggleSidebar } = useSidebar();
  const toggleSidebarRef = useRef(toggleSidebar);

  // Keep the ref updated with the latest toggleSidebar function
  useEffect(() => {
    toggleSidebarRef.current = toggleSidebar;
  }, [toggleSidebar]);

  useComponentShortcut(() => {
    return () => {
      toggleSidebarRef.current();
    };
  }, "__toggleSidebar");
}
