import { Button } from "@/components/ui/button";
import { VideoStatus } from "@/constants";
import { invoke } from "@tauri-apps/api/core";
import { Input } from "@/components/reactive-resume";
import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { MainPathSelector } from "@/features/video-downloader/main-path-selector";
import { useSavePathStore } from "@/stores";
import { VideoCard } from "@/features/video-downloader/video-card";
import { IVideo } from "./type";

const YoutubeDownloader = () => {
  const { mainPath, setMainPath } = useSavePathStore();
  const [username, setUsername] = useState("");
  const [videoList, setVideoList] = useState<IVideo[]>([]);
  const [videoListLoading, setVideoListLoading] = useState(false);
  useEffect(() => {
    if (videoListLoading) setVideoList([]);
  }, [videoListLoading]);

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
      setVideoList((prev) =>
        prev.map((video) => {
          if (video.video_id == payload.video_id) {
            return {
              ...video,
              status:
                payload.status != VideoStatus.Idle ? payload.status : null,
              progress_size: payload.progress_size,
              is_init_request: payload.is_init_request,
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

  const isDownloading = videoList.some(
    (v) => v.status == VideoStatus.Downloading
  );
  const isAllCompleted = videoList.every(
    (v) => v.status == VideoStatus.Completed
  );
  if (!mainPath) return <MainPathSelector />;

  return (
    <div className="p-2">
      <div className="flex gap-2 items-center">
        <Input
          disabled={isDownloading}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full"
          placeholder="Youtube channel username"
        />
        <Button
          disabled={videoListLoading || isDownloading}
          className="text-nowrap"
          onClick={async () => {
            if (!username) return;
            try {
              setVideoListLoading(true);
              const _videosList: any[] = await invoke("extract_youtube", {
                username,
              });
              setVideoList(_videosList);
              console.log(_videosList);
            } catch (err) {
            } finally {
              setVideoListLoading(false);
            }
          }}
        >
          Fetch Video List
        </Button>
      </div>
      <div>
        {videoListLoading && <div>Loading ...</div>}
        <div className="text-sm">
          {videoList.map((video: any, key: number) => {
            return (
              <VideoCard
                key={video.video_id}
                video_id={video.video_id}
                title={video.title}
                play_count={video.play_count}
                size={video.size}
                progress_size={video.progress_size}
                status={video.status}
                cover={
                  video.cover_youtube ? video.cover_youtube[0].url : undefined
                }
                platform="youtube"
              />
            );
          })}
        </div>
      </div>
      {videoList.length > 0 && (
        <div className="fixed bottom-2 right-2">
          {!isDownloading && (
            <Button
              className="text-nowrap"
              onClick={async () => {
                try {
                  await invoke("process_download", {
                    videoList: videoList,
                    username: username,
                    platform: "youtube",
                    mainPath: mainPath,
                  });
                } catch (err) {
                  console.log(err);
                } finally {
                  setVideoListLoading(false);
                }
              }}
              disabled={isAllCompleted}
            >
              {isAllCompleted ? "All Complete" : "Start Download"}
            </Button>
          )}
          {isDownloading && (
            <Button
              className="text-nowrap bg-red-600"
              onClick={async () => {
                try {
                  await invoke("cancel_download", {
                    username: username,
                  });
                  setVideoList((prev) =>
                    prev.map((video) => {
                      if (video.status == VideoStatus.Downloading) {
                        return {
                          ...video,
                          status: null,
                          is_init_request: false,
                        };
                      }
                      return video;
                    })
                  );
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              Stop Download
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default YoutubeDownloader;
