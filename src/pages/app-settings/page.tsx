import { ScrollArea, Separator } from "@/components/reactive-resume";
import { t } from "@lingui/core/macro";
import { OpenAISettings } from "./_sections/openai";
import { motion } from "framer-motion";
import { MainPathSelector } from "@/features/video-downloader/main-path-selector";
import { useUiStore } from "@/stores";

const Settings = () => {
  const { layoutSize, setLayoutSize } = useUiStore();
  return (
    <div className="p-2">
      <div className="max-w-2xl space-y-4">
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold tracking-tight"
        >
          {t`Settings`}
        </motion.h1>

        <ScrollArea hideScrollbar className="h-[calc(100vh-116px)]">
          <div className="">
            <h3 className="text-2xl font-bold leading-relaxed tracking-tight">
              Main Path Config
            </h3>
            <MainPathSelector />
          </div>
          <div className="">
            <h3 className="text-2xl font-bold leading-relaxed tracking-tight">
              UI Config
            </h3>
            <div
              onClick={() => {
                setLayoutSize(layoutSize == "normal" ? "compact" : "normal");
              }}
            >
              {layoutSize}
            </div>
          </div>
          <div className="space-y-6">
            <OpenAISettings />
            <Separator />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Settings;
