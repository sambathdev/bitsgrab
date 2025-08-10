import { useHotkeys } from "react-hotkeys-hook";

export function useShortcut() {
  useHotkeys("meta+t, meta+m, meta+k, meta+o, meta+s", (e) => {
    e.preventDefault();
    //  const settingWindow = new WebviewWindow(WINDOW_LABEL.SETTINGS, {
    //     ...WINDOW_CONFIGS[WINDOW_LABEL.SETTINGS],
    //   });
    //   settingWindow.once("tauri://created", async function () {
    //     // do the initial action pass from current window
    //   });
    console.log("hello");
  });
  return true;
}
