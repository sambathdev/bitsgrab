import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";

interface CurrentClipBoardProps {}

const CurrentClipBoard = ({}: CurrentClipBoardProps) => {
  const [currentClipBoard, setCurrentClipBoard] = useState<string | null>(null);
  useEffect(() => {
    const unlisten = listen<string>("current-clipboard", (event) => {
      setCurrentClipBoard(event.payload);
      console.log(4, event.payload);
    });

    return () => {
      unlisten.then((f) => f());
    };
  }, []);
  const startListen = async () => {
    try {
      await invoke("start_clipboard_listener");
    } catch (e) {
      console.error("Listen failed:", e);
    }
  };
  return <div>
    <button onClick={startListen}>Start Listen, </button>
    {currentClipBoard}
  </div>;
};

export default CurrentClipBoard;