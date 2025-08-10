import { Outlet } from "react-router-dom";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./parts/app-sidebar";
import { WindowDragger } from "./parts/window-dragger";
import {
  useShortcut,
  useSidebarShortcut,
  useThemeShortcut,
  useToastShortcut,
} from "@/hooks";
import { shortcutRegistry } from "@/lib/shortcuts";
import { HotKeyMapper } from "./hotkey-mapper";

const MainLayout = () => {
  return (
    <SidebarProvider>
      <LayoutWrapper />
    </SidebarProvider>
  );
};

const LayoutWrapper = () => {
  const { state } = useSidebar();
  useSidebarShortcut();
  useThemeShortcut();
  useToastShortcut();
  useShortcut();

  const shortcuts = shortcutRegistry.getShortcuts();

  return (
    <>
      {shortcuts.map((shortcut) => (
        <HotKeyMapper key={shortcut.key} shortcut={shortcut} />
      ))}
      <AppSidebar />
      <SidebarInset>
        <main className="w-full">
          {state == "collapsed" ? "collapsed" : "expand"}
          <WindowDragger />
          <SidebarTrigger />
          <Outlet />
        </main>
      </SidebarInset>
    </>
  );
};

export default MainLayout;
