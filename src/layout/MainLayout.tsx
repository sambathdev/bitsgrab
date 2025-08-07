import { invoke } from "@tauri-apps/api/core";
import { PropsWithChildren } from "react";

interface MainLayoutProps extends PropsWithChildren {}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div>
      <div className="titlebar h-[32px]" data-tauri-drag-region>
        <span className="select-none" data-tauri-drag-region>
          My App
        </span>
        {/* <button onclick="closeApp()" style="-webkit-app-region: no-drag;"> */}
        <button>✖</button>
      </div>
      <div className="flex" style={{ height: "calc(100vh - 32px)" }}>
        <div className="bg-red-400 max-w-[200px] min-w-[200px]">
          <p
            onClick={async () => {
              try {
                await invoke("enable_click_through");
              } catch (e) {
                console.error("Download failed:", e);
              }
            }}
          >
            Menu1
          </p>
          <p
            onClick={async () => {
              try {
                await invoke("disable_click_through");
              } catch (e) {
                console.error("Download failed:", e);
              }
            }}
          >
            Menu2
          </p>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
