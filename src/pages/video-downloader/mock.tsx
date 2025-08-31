import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

type Video = {
  video_id: string;
  title: string;
  play: string;
  progress: number; // 0-100
  downloading: boolean;
};

export default function VideoListMock() {
  const [videos, setVideos] = useState<Video[]>([
    {
      video_id: "1",
      title: "Video 1",
      play: "http://example.com/1.mp4",
      progress: 0,
      downloading: false,
    },
    {
      video_id: "2",
      title: "Video 2",
      play: "http://example.com/2.mp4",
      progress: 0,
      downloading: false,
    },
  ]);

  useEffect(() => {
    // Listen to download progress events
    const unlistenProgress = listen<[string, number]>(
      "download-progress",
      (event) => {
        const [id, progress] = event.payload;
        setVideos((prev) =>
          prev.map((v) => (v.video_id === id ? { ...v, progress } : v))
        );
      }
    );

    const unlistenComplete = listen<string>("download-complete", (event) => {
      const id = event.payload;
      setVideos((prev) =>
        prev.map((v) =>
          v.video_id === id ? { ...v, downloading: false, progress: 100 } : v
        )
      );
    });

    const unlistenCanceled = listen<string>("download-canceled", (event) => {
      const id = event.payload;
      setVideos((prev) =>
        prev.map((v) =>
          v.video_id === id ? { ...v, downloading: false, progress: 0 } : v
        )
      );
    });

    return () => {
      unlistenProgress.then((f) => f());
      unlistenComplete.then((f) => f());
      unlistenCanceled.then((f) => f());
    };
  }, []);

  const toggleDownload = async (video: Video) => {
    if (video.downloading) {
      // cancel
      await invoke("cancel_download_one", { id: video.video_id });
    } else {
      // start
      await invoke("start_download_one", { id: video.video_id, video: video });
      setVideos((prev) =>
        prev.map((v) =>
          v.video_id === video.video_id ? { ...v, downloading: true, progress: 0 } : v
        )
      );
    }
  };

  return (
    <div>
      {videos.map((video) => (
        <div key={video.video_id} style={{ marginBottom: "10px" }}>
          <span>{video.title}</span>
          <button
            onClick={() => toggleDownload(video)}
            style={{ marginLeft: "10px" }}
          >
            {video.downloading ? "Cancel" : "Download"}
          </button>
          {video.downloading && (
            <span style={{ marginLeft: "10px" }}>{video.progress}%</span>
          )}
        </div>
      ))}
    </div>
  );
}
