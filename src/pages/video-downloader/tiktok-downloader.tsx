/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import _ from "lodash";
import { SortAscending, SortDescending } from "@phosphor-icons/react";

import { IVideo } from "./type";

import { Button } from "@/components/ui/button";
import { VideoStatus } from "@/constants";
import { Input } from "@/components/reactive-resume";
import { MainPathSelector } from "@/features/video-downloader/main-path-selector";
import { useSavePathStore } from "@/stores";
import { VideoCard } from "@/features/video-downloader/video-card";

const TiktokDownloader = () => {
  const { mainPath } = useSavePathStore();
  const [username, setUsername] = useState("");
  const [lastFetchUsername, setLastFectUsername] = useState("");
  const [videoList, setVideoList] = useState<IVideo[]>([]);
  const [videoListLoading, setVideoListLoading] = useState(false);
  useEffect(() => {
    if (videoListLoading) setVideoList([]);
  }, [videoListLoading]);

  const handleSortVideo = (direction: "up" | "down") => {
    if (direction == "up") {
      const sorted = _.sortBy(videoList, "play_count");
      setVideoList(sorted);
    }
    if (direction == "down") {
      const sorted = _.sortBy(videoList, "play_count").reverse();
      setVideoList(sorted);
    }
  };

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
  const handleFetchVideo = async () => {
    if (!username) return;
    setLastFectUsername(username);
    try {
      setVideoListLoading(true);
      const _videosList: any[] = await invoke("extract_tiktok", {
        username,
      });
      setVideoList(_videosList);
      console.log(_videosList);
    } catch (err: any) {
      //
    } finally {
      setVideoListLoading(false);
    }
  };
  const handleStartDownload = async () => {
    console.log(77, mainPath);
    try {
      await invoke("process_download", {
        videoList: videoList,
        username: lastFetchUsername,
        platform: "tiktok",
        mainPath: mainPath,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setVideoListLoading(false);
    }
  };
  const handleStopDownload = async () => {
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
            };
          }
          return video;
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemove = (_vid: String) => {
    setVideoList((prev) => prev.filter((v) => v.video_id != _vid));
  };

  const isDownloading = videoList.some(
    (v) => v.status == VideoStatus.Downloading
  );
  const isAllCompleted = videoList.every(
    (v) => v.status == VideoStatus.Completed
  );
  if (!mainPath) return <MainPathSelector />;
  window.dispatchEvent(
    new CustomEvent("downloading", {
      detail: {
        data: { isDownloading, handleStopDownload },
      },
    })
  );
  return (
    <div className="p-2 pb-12">
      <div className="flex gap-2 items-center">
        <Input
          disabled={videoListLoading || isDownloading}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full"
          placeholder="Tiktok profile username"
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              if (videoListLoading || isDownloading) return;
              console.log("Enter pressed!");
              handleFetchVideo();
            }
          }}
        />
        <Button
          disabled={videoListLoading || isDownloading}
          className="text-nowrap"
          onClick={handleFetchVideo}
        >
          Fetch Video List
        </Button>
      </div>
      <div>
        {videoListLoading && (
          <div className="animate-bounce mt-2">Loading ...</div>
        )}
        {!!videoList.length && (
          <div className="mt-2">
            <button
              onClick={() => {
                handleSortVideo("down");
              }}
              className="p-1 hover:bg-slate-300"
            >
              <SortAscending size={20} />
            </button>
            <button
              onClick={() => {
                handleSortVideo("up");
              }}
              className="p-1 hover:bg-slate-300"
            >
              <SortDescending size={20} />
            </button>
          </div>
        )}
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
                cover={video.cover}
                platform="tiktok"
                folderPath={`${mainPath}/tiktok/${username}`}
                onRemove={(_vid) => handleRemove(_vid)}
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
              onClick={handleStartDownload}
              disabled={isAllCompleted}
            >
              {isAllCompleted ? "All Complete" : "Start Download"}
            </Button>
          )}
          {isDownloading && (
            <Button
              className="text-nowrap bg-red-600"
              onClick={handleStopDownload}
            >
              Stop Download
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default TiktokDownloader;
