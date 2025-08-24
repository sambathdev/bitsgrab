import "./index.css";
import MainLayout from "./layout/main-layout";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/home-dashboard";
import Settings from "./pages/app-settings/page";
import ClipboardApp from "./pages/child/clipboard-app/page";
import { Providers } from "./providers";
import ChildLayout from "./layout/child-layout";
import AppRouter from "./router";

function App() {
  return <AppRouter />;
}

export default App;
