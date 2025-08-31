import { VideoStatus } from "@/constants";
import { filesize } from "filesize";
import numeral from "numeral";
import { LoadingBar } from "./loading-bar";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VideoCardProps {
  video_id: any;
  title: any;
  play_count: any;
  size: any;
  progress_size: any;
  status: any;
  platform: any;
  cover: any;
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
}: VideoCardProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (status == VideoStatus.Downloading) {
      if (platform == "tiktok") {
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
          <img src={cover} alt="" className="w-[50px] object-cover max-h-[60px] min-w-[50px] mr-1" />
        ) : (
          <div className="w-[50px] min-w-[50px] max-h-[60px] bg-amber-100 h-full mr-1" />
        )}
        <div className="flex flex-col">
          <span>Video ID: {video_id}</span>
          <span className="line-clamp-1">Video Title: {title}</span>

          {/* <span>
          Video Size:{" "}
          {platform == "youtube"
            ? `${is_init_request ? "Initing Request" : "Unknown"}`
            : fileSizeProgress}
        </span> */}
        </div>
      </div>
      <span className="flex flex-col justify-between min-w-[100px] items-end">
        <span
          className={`${
            status == VideoStatus.Completed ? "text-green-600" : ""
          }`}
        >
          {status}
        </span>
        <span className="text-xs text-nowrap">{numeral(play_count).format("0.00a").toUpperCase()} Views</span>
      </span>
    </div>
  );
}
