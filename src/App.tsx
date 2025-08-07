import "./index.css";
import CurrentClipBoard from "./features/clipboard/CurrentClipBoard";
import DownloadImage from "./features/download-image/DownloadImage";
import MainLayout from "./layout/MainLayout";

function App() {
  return (
    <MainLayout>
      <div>
        <CurrentClipBoard />
        <DownloadImage />
      </div>
    </MainLayout>
  );
}

export default App;
