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
import { PasteMetaDataButton } from "@/features/video-downloader/paste-metadata-button";
import VideoListMock from "./mock";

const UrlStreamableDownloader = () => {
  const [texts, setTexts] = useState<string[]>([]);

  const handleTextDrop = useCallback((pastedText: string) => {
    try {
      const asJson = JSON.parse(pastedText);
      console.log(asJson);
      setTexts((prevTexts) => [...prevTexts, pastedText]);
    } catch (err) {
      //
      toast.error("Oops, Invalid Video Data.", {
        description: 'Please click "Download" button floated from browser.',
      });
    }
  }, []);

  return (
    <div className="p-2">
      <PasteMetaDataButton onTextPaste={handleTextDrop} />
      {texts.length > 0 && (
        <div className="mt-12">
          <h1 className="font-bold">text List</h1>
          <div className="flex flex-col w-full">
            {texts.map((text, i) => (
              <span
                key={i}
                className="border-b border-border py-1 line-clamp-2"
              >
                {text}
              </span>
            ))}
          </div>
        </div>
      )}
      <VideoListMock />
    </div>
  );
};

export default UrlStreamableDownloader;
