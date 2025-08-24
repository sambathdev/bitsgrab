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

export function VideoCard({
  video_id,
  title,
  play_count,
  size,
  progress_size,
  status,
  platform,
  is_init_request,
}: any) {
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
      <div className="flex flex-col">
        <span>Video ID: {video_id}</span>

        {/* <Tooltip>
          <TooltipTrigger className="text-left">
            <span className="line-clamp-1">Video Title: {title}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{title}</p>
          </TooltipContent>
        </Tooltip> */}
        <span className="line-clamp-1">Video Title: {title}</span>

        {/* <span>
          Video Size:{" "}
          {platform == "youtube"
            ? `${is_init_request ? "Initing Request" : "Unknown"}`
            : fileSizeProgress}
        </span> */}
      </div>
      <span className="flex flex-col justify-between min-w-[100px] items-end">
        <span
          className={`${
            status == VideoStatus.Completed ? "text-green-600" : ""
          }`}
        >
          {status}
        </span>
        <span>
          {numeral(play_count).format("0.00a").toUpperCase()}
        </span>
      </span>
    </div>
  );
}
