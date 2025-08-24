import { useLogin } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { customToast } from "@/components/ui/toast";
import { toast } from "sonner";
import { t } from "@lingui/core/macro";
import { VideoStatus, WINDOW_CONFIGS, WINDOW_LABEL } from "@/constants";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { fixGrammar } from "@/services/agent-ai";
import { filesize } from "filesize";
import { invoke } from "@tauri-apps/api/core";
import { Input } from "@/components/reactive-resume";
import { useCallback, useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { MainPathSelector } from "@/features/video-downloader/main-path-selector";
import { useSavePathStore } from "@/stores";
import numeral from "numeral";
import { VideoCard } from "@/features/video-downloader/video-card";
import { DropZone } from "@/features/video-downloader/drop-zone";

const UrlStreamableDownloader = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [texts, setTexts] = useState<string[]>([]);

  const handleFilesDrop = useCallback((droppedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  }, []);

  const handleTextDrop = useCallback((droppedText: string) => {
    setTexts((prevTexts) => [...prevTexts, droppedText]);
  }, []);

  return (
    <div className="p-2">
      <DropZone onFilesDrop={handleFilesDrop} onTextDrop={handleTextDrop} />
      {(files.length > 0 || texts.length > 0) && (
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            File List
          </div>
          <div>
            text List
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlStreamableDownloader;
