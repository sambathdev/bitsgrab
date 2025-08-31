import { toast } from "sonner";
import { t } from "@lingui/core/macro";
import { VideoStatus } from "@/constants";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { useSavePathStore } from "@/stores";
import { VideoCard } from "@/features/video-downloader/video-card";
import { PasteMetaDataButton } from "@/features/video-downloader/paste-metadata-button";
import { IVideo } from "./type";

const UrlStreamableDownloader = () => {
  const { mainPath, setMainPath } = useSavePathStore();
  const [videos, setVideos] = useState<IVideo[]>([]);

  useEffect(() => {
    const unlisten = listen<any>("download_progress", (event) => {
      if (event.payload == "End") {
        console.log(
          "All Video Proccessed, failed or completed, don't know but processed all video in the list"
        );
        return;
      }
      console.log(4, event.payload);
      const payload = event.payload;
      setVideos((prev) =>
        prev.map((video) => {
          if (video.video_id == payload.video_id) {
            return {
              ...video,
              status:
                payload.status != VideoStatus.Idle ? payload.status : null,
              progress_size: payload.progress_size,
            };
          }
          return video;
        })
      );
    });

    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  const handleTextDrop = (pastedText: string) => {
    try {
      const asJson = JSON.parse(pastedText);
      if (videos.find((v) => v.video_id == asJson.video_id)) {
        toast.error("Oops, the video already downloaded.", {
          description: "Please try another one!.",
        });
        return;
      }
      triggerDownload(asJson);
      setVideos((prevTexts) => [asJson, ...prevTexts]);
    } catch (err) {
      //
      toast.error("Oops, Invalid Video Data.", {
        description: 'Please click "Download" button floated from browser.',
      });
    }
  };

  const triggerDownload = async (video: IVideo) => {
    await invoke("start_download_one", {
      video: video,
      mainPath: mainPath,
    });
  };

  return (
    <div className="p-2">
      <PasteMetaDataButton onTextPaste={handleTextDrop} />
      {videos.length > 0 && (
        <div className="text-sm">
          {videos.map((video: IVideo, key: number) => {
            return (
              <VideoCard
                key={video.video_id}
                video_id={video.video_id}
                title={video.title}
                play_count={video.play_count}
                size={video.size}
                progress_size={video.progress_size}
                status={video.status}
                cover={video.cover}
                platform="tiktok"
                folderPath={`${mainPath}/${video.platform}/${video.username}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UrlStreamableDownloader;
