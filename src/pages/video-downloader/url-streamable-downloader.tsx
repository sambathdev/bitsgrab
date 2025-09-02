/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { toast } from "sonner";
import { invoke } from "@tauri-apps/api/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { listen } from "@tauri-apps/api/event";

import { IVideo } from "./type";

import { useSavePathStore } from "@/stores";
import { VideoStatus } from "@/constants";
import { VideoCard } from "@/features/video-downloader/video-card";
import { PasteMetaDataButton } from "@/features/video-downloader/paste-metadata-button";

const copyToClipboard = async (textToCopy: string) => {
  try {
    await navigator.clipboard.writeText(textToCopy);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};

const UrlStreamableDownloader = () => {
  const { mainPath } = useSavePathStore();
  const [videos, setVideos] = useState<IVideo[]>([]);
  const videosRef = useRef<IVideo[]>([]);

  useEffect(() => {
    videosRef.current = videos;
  }, [videos]);

  const triggerDownload = useCallback(
    async (video: IVideo) => {
      await invoke("start_download_one", {
        video: video,
        mainPath: mainPath,
      });
    },
    [mainPath]
  );

  const handleTextDrop = useCallback(
    (pastedText: string, alert?: boolean) => {
      try {
        const asJson = JSON.parse(pastedText);
        copyToClipboard("-");
        if (videosRef.current.find((v) => v.video_id == asJson.video_id)) {
          if (alert)
            toast.error("Oops, the video already downloaded.", {
              description: "Please try another one!.",
            });
          return;
        }
        triggerDownload(asJson);
        setVideos((prevTexts) => [asJson, ...prevTexts]);
      } catch (err: any) {
        if (alert)
          toast.error("Oops, Invalid Video Data.", {
            description: 'Please click "Download" button floated from browser.',
          });
      }
    },
    [triggerDownload]
  );

  useEffect(() => {
    const unlisten = listen<string>("current-clipboard", (event) => {
      const data = event.payload;
      try {
        const asJson = JSON.parse(data);
        if (asJson.title && asJson.video_id) handleTextDrop(data, true);
      } catch (_err: any) {
        //
      }
    });

    return () => {
      unlisten.then((f) => f());
    };
  }, [handleTextDrop]);

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

  return (
    <div className="p-2">
      <PasteMetaDataButton
        onTextPaste={(text) => {
          handleTextDrop(text, true);
        }}
      />
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
