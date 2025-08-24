import { create } from "zustand";
import { persist } from "zustand/middleware";

import { AGENTS, DEFAULT_MAX_TOKENS, DEFAULT_MODELS } from "../constants/llm";
import { agentType, modelType } from "@/models/agent-ai";

type SavePathStore = {
  mainPath: string | null;
  setMainPath: (_mainPath: string) => void;
};

export const useSavePathStore = create<SavePathStore>()(
  persist(
    (set) => ({
      mainPath: null,
      setMainPath: (_mainPath: string) => {
        set({ mainPath: _mainPath });
      },
    }),
    { name: "savePath" }
  )
);
