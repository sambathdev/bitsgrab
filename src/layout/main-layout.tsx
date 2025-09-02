import { Outlet, useLocation } from "react-router-dom";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
  // useSidebar,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./parts/app-sidebar";
// import { WindowDragger } from "./parts/window-dragger";
import {
  useLayoutSize,
  useShortcut,
  useSidebarShortcut,
  useThemeShortcut,
  useToastShortcut,
} from "@/hooks";
import { shortcutRegistry } from "@/lib/shortcuts";
import { HotKeyMapper } from "./hotkey-mapper";
import { useRef } from "react";
import { invoke } from "@tauri-apps/api/core";

const MainLayout = () => {
  return (
    <SidebarProvider>
      <LayoutWrapper />
    </SidebarProvider>
  );
};

const LayoutWrapper = () => {
  const runOnce = useRef(false);
  const { state, isMobile } = useSidebar();
  const { layoutSize } = useLayoutSize();
  useSidebarShortcut();
  useThemeShortcut();
  useToastShortcut();
  useShortcut();

  if (!runOnce.current) {
    try {
      const gg = async () => {
        await invoke("start_clipboard_listener");
        console.log('Keyboard listen.')
      };
      gg();
    } catch (e) {
      console.error("Listen failed:", e);
    }
    runOnce.current = true;
  }

  const shortcuts = shortcutRegistry.getShortcuts();
  const location = useLocation();
  const locationMapToTitle = {
    "/main/video-downloader/tiktok": "Tiktok Downloader",
    "/main/video-downloader/youtube": "Youtube Downloader",
    "/main/video-downloader/url-streamable": "Url Streamable Downloader",
  };
  const title = (locationMapToTitle as any)[location.pathname];
  return (
    <>
      {shortcuts.map((shortcut) => (
        <HotKeyMapper key={shortcut.key} shortcut={shortcut} />
      ))}
      <AppSidebar />
      <SidebarInset>
        <div
          style={{
            left: isMobile
              ? "0px"
              : layoutSize == "compact"
              ? state == "collapsed"
                ? "36px"
                : "192px"
              : state == "collapsed"
              ? "48px"
              : "256px",
          }}
          className="flex bg-background w-full fixed z-50 h-[28px] top-0 items-center transition-all duration-200"
          data-tauri-drag-region
        >
          <SidebarTrigger />
          {!!title && (
            <span className="select-none cursor-default" data-tauri-drag-region>
              {title}
            </span>
          )}
        </div>
        <main
          className="w-full mt-[28px] overflow-y-scroll"
          style={{
            maxHeight: "calc(100vh - 28px)",
            maxWidth: isMobile
              ? "100vw"
              : layoutSize == "normal"
              ? state == "collapsed"
                ? "calc(100vw - 48px)"
                : "calc(100vw - 256px)"
              : state == "collapsed"
              ? "calc(100vw - 36px)"
              : "calc(100vw - 192px)",
          }}
        >
          <Outlet />
        </main>
      </SidebarInset>
    </>
  );
};

export default MainLayout;
