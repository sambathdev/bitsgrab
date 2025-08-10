import { create } from "zustand";
import { persist } from "zustand/middleware";

import { AGENTS, DEFAULT_MAX_TOKENS, DEFAULT_MODELS } from "../constants/llm";
import { agentType, modelType } from "@/models/agent-ai";



type AgentAIStore = {
  agentName: agentType | null;
  setAgentName: (agentName: agentType) => void;
  baseURL: string | null;
  setBaseURL: (baseURL: string | null) => void;
  apiKey: string | null;
  setApiKey: (apiKey: string | null) => void;
  model: modelType;
  setModel: (model: modelType) => void;
  maxTokens: number | null;
  setMaxTokens: (maxTokens: number | null) => void;
};

export const useAgentAiStore = create<AgentAIStore>()(
  persist(
    (set) => ({
      agentName: null,
      setAgentName: (agentName: agentType) => {
        set({ agentName });
      },
      baseURL: null,
      setBaseURL: (baseURL: string | null) => {
        set({ baseURL });
      },
      apiKey: null,
      setApiKey: (apiKey: string | null) => {
        set({ apiKey });
      },
      model: DEFAULT_MODELS[AGENTS[1]],
      setModel: (model: modelType) => {
        set({ model });
      },
      maxTokens: DEFAULT_MAX_TOKENS,
      setMaxTokens: (maxTokens: number | null) => {
        set({ maxTokens });
      },
    }),
    { name: "agentai" },
  ),
);
