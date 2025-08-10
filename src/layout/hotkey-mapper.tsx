import { ShortcutDefinition } from "@/constants/shortcuts";
import { useHotkeys } from "react-hotkeys-hook";

export function HotKeyMapper({ shortcut }: { shortcut: ShortcutDefinition }) {
  useHotkeys(shortcut.key, (e) => {
    if (shortcut.preventDefault) e.preventDefault();
    try {
      shortcut.action.action();
    } catch (error) {
      console.error(`Error executing shortcut ${shortcut.key}:`, error);
    }
  });
  return <></>;
}
