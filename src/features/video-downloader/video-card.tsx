import { VideoStatus } from "@/constants";
import { filesize } from "filesize";
import numeral from "numeral";
import { LoadingBar } from "./loading-bar";
import { useEffect, useState } from "react";
import { open } from "@tauri-apps/plugin-shell";
import { openPath } from "@tauri-apps/plugin-opener";
import { useSavePathStore } from "@/stores";
import {
  ArrowsClockwise,
  Checks,
  FolderOpen,
  PlayCircle,
} from "@phosphor-icons/react";
import { useLayoutSize } from "@/hooks";

interface VideoCardProps {
  video_id: any;
  title: any;
  play_count: any;
  size: any;
  progress_size: any;
  status: any;
  platform: any;
  cover: any;
  folderPath?: any;
}

export function VideoCard({
  video_id,
  title,
  play_count = 0,
  size = 0,
  progress_size = 0,
  status,
  platform,
  cover,
  folderPath,
}: VideoCardProps) {
  const { mainPath, setMainPath } = useSavePathStore();
  const { layoutSize } = useLayoutSize();
  const [progress, setProgress] = useState(0);

  const iconSize = layoutSize == 'compact' ? 15: 18;

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (status == VideoStatus.Downloading) {
      if (platform != "youtube") {
        intervalId = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              if (intervalId) clearInterval(intervalId);
              return 90;
            }
            if (prev >= 70) {
              return prev + 2;
            }
            return prev + 5;
          });
        }, 500);
      } else {
        intervalId = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              if (intervalId) clearInterval(intervalId);
              return 90;
            }
            if (prev >= 70) {
              return prev + 1;
            }
            return prev + 5;
          });
        }, 1000);
      }
    } else {
      if (intervalId) clearInterval(intervalId);
      setProgress(0);
    }
  }, [status, platform]);

  const fileSizeProgress = `${
    status == VideoStatus.Completed
      ? filesize(size)
      : progress_size
      ? filesize(progress_size)
      : "-"
  }/ ${filesize(size)}`;
  return (
    <div className="border border-border p-1 rounded-sm my-1 flex justify-between relative overflow-hidden">
      {status == VideoStatus.Downloading && <LoadingBar progress={progress} />}
      <div className="flex items-center justify-start">
        {cover ? (
          <img
            src={cover}
            alt=""
            className="object-cover w-[30px] max-h-[30px] max-w-[30px] mr-1"
          />
        ) : (
          <div className="w-[30px] max-h-[30px] max-w-[30px] bg-amber-100 mr-1" />
        )}
        <div className="flex flex-col">
          <span className="text-sm">ID: {video_id}</span>
          <span className="line-clamp-1 text-sm">Description: {title}</span>
        </div>
      </div>
      <span className="flex flex-col justify-between min-w-[150px] items-end">
        <div className="flex items-center gap-2">
          {folderPath && status == VideoStatus.Completed && (
            <>
              <button
                className="hover:bg-slate-200 dark:hover:bg-slate-800 rounded-sm p-0.5"
                onClick={async () => {
                  try {
                    console.log(`Attempting to open folder: ${folderPath}`);
                    if (folderPath) await openPath(folderPath);
                  } catch (e) {
                    console.error("Failed to open folder:", e);
                  }
                }}
              >
                <FolderOpen className="text-foreground" size={iconSize} />
              </button>
              <button
                className="hover:bg-slate-200 dark:hover:bg-slate-800 rounded-sm p-0.5"
                onClick={async () => {
                  try {
                    console.log(`Attempting to open folder: ${folderPath}`);
                    if (folderPath)
                      await openPath(`${folderPath}/${video_id}.mp4`);
                  } catch (e) {
                    console.error("Failed to open folder:", e);
                  }
                }}
              >
                <PlayCircle className="text-foreground" size={iconSize} />
              </button>
            </>
          )}
        </div>
        <div className="flex items-end gap-1">
          <span className="text-[10px] text-nowrap">
            {play_count
              ? `${numeral(play_count).format("0.00a").toUpperCase()} Views`
              : ""}
          </span>
          <span
            className={`${
              status == VideoStatus.Completed ? "text-green-600" : ""
            }`}
          >
            {status == VideoStatus.Completed && <Checks size={iconSize} />}
            {status == VideoStatus.Downloading && (
              <ArrowsClockwise
                className="animate-spin duration-1000"
                size={iconSize}
              />
            )}
          </span>
        </div>
      </span>
    </div>
  );
}
