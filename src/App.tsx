import "./index.css";
import MainLayout from "./layout/main-layout";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/home-dashboard";
import Settings from "./pages/child/app-settings/page";
import ClipboardApp from "./pages/child/clipboard-app";
import { Providers } from "./providers";
import ChildLayout from "./layout/child-layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Providers />}>
          <Route path="main" element={<MainLayout />}>
            <Route index element={<Home />} />
          </Route>
          <Route path="child" element={<ChildLayout />}>
            <Route path="settings" element={<Settings />} />
            <Route path="clipboard" element={<ClipboardApp />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
