import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";

interface DownloadImageProps {}

const DownloadImage = ({}: DownloadImageProps) => {
  const [progress, setProgress] = useState(0);
  const imageUrl = "https://png.pngtree.com/background/20250203/original/pngtree-nice-nature-beautiful-background-image-picture-image_15708092.jpg";
  const savePath = "/Users/sambath/Desktop/kopkop/test-image.png";

  const startDownload = async () => {
    setProgress(0);
    try {
      await invoke("download_image", { url: imageUrl, savePath });
    } catch (e) {
      console.error("Download failed:", e);
    }
  };

  useEffect(() => {
    const unlisten = listen<number>("download-progress", (event) => {
      setProgress(event.payload);
    });

    return () => {
      unlisten.then((f) => f());
    };
  }, []);
  return (
    <div>
      <button onClick={startDownload}>Download Image</button>
      <div style={{ marginTop: 20 }}>
        <div style={{ width: 300, height: 20, border: "1px solid gray" }}>
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "green",
              transition: "width 0.3s",
            }}
          />
        </div>
        <p>{progress.toFixed(0)}%</p>
      </div>
    </div>
  );
};

export default DownloadImage;
