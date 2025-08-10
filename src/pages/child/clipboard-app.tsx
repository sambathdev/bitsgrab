import { invoke } from "@tauri-apps/api/core";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { PropsWithChildren } from "react";
import { Window } from "@tauri-apps/api/window";
import { Webview } from "@tauri-apps/api/webview";
import CurrentClipBoard from "@/features/clipboard/CurrentClipBoard";
import DownloadImage from "@/features/download-image/DownloadImage";


const ClipboardApp = () => {
  return (
    <div>
      <div>
        <CurrentClipBoard />
      </div>
    </div>
  );
};

export default ClipboardApp;
