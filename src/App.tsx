import "./index.css";
import { invoke } from "@tauri-apps/api/core";
import { useRef, useState } from "react";

import AppRouter from "./router";
import { useHeartbeat } from "./hooks/use-heatbeat-online";

function App() {
  const [isExpired, setIsExpired] = useState(false);
  const runOnce = useRef(false);
  if (runOnce.current == false) {
    const getaTime = async () => {
      const _apiTime: any = await invoke("get_api_time");
      const apiTime = new Date(_apiTime);
      const expireDate = new Date("10/01/2025");
      if (apiTime > expireDate) {
        console.log("Expired");
        setIsExpired(true);
        // console.log(apiTime, expireDate);
      } else {
        console.log("note expired");
        setIsExpired(false);
      }
    };
    getaTime();
  }
  const isOnline = useHeartbeat(
    "https://raw.githubusercontent.com/microsoft/vscode/refs/heads/main/.editorconfig",
    10000
  );

  if (isExpired) return <div className="h-screen w-screen bg-white">Expired </div>;

  return (
    <>
      {!isOnline && (
        <div
          className="w-screen animate-pulse h-8 bg-red-400 fixed flex items-center justify-center top-[50%]"
          style={{ zIndex: 9999 }}
        >
          You are offline
        </div>
      )}
      <AppRouter />
    </>
  );
}

export default App;
