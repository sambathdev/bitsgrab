import { ScrollArea, Separator } from "@/components/reactive-resume";
import { t } from "@lingui/core/macro";
import { OpenAISettings } from "./_sections/openai";
import { motion } from "framer-motion";

const Settings = () => {
  return (
    <div className="p-4">
      <div className="max-w-2xl space-y-4">
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold tracking-tight"
        >
          {t`Settings`}
        </motion.h1>

        <ScrollArea
          hideScrollbar
          className="h-[calc(100vh-88px)]"
        >
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
