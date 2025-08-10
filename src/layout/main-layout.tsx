import { Outlet } from "react-router-dom";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./parts/app-sidebar";
import { WindowDragger } from "./parts/window-dragger";
import { useShortcut } from "@/hooks";

const MainLayout = () => {
  return (
    <SidebarProvider>
      <LayoutWrapper />
    </SidebarProvider>
  );
};

const LayoutWrapper = () => {
  const { state } = useSidebar();
  useShortcut();
  return (
    <>
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
