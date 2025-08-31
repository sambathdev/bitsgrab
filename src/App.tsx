import "./index.css";
import AppRouter from "./router";
import { useHeartbeat } from "./hooks/use-heatbeat-online";

function App() {
  const isOnline = useHeartbeat("https://raw.githubusercontent.com/microsoft/vscode/refs/heads/main/.editorconfig", 10000);
  return (
    <>
      {!isOnline && (
        <div className="w-screen animate-pulse h-8 bg-red-400 fixed flex items-center justify-center top-[50%]" style={{zIndex: 9999}}>You are offline</div>
      )}
      <AppRouter />
    </>
  );
}

export default App;
