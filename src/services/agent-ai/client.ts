import { t } from "@lingui/macro";
import { OpenAI } from "openai";
import { GoogleGenAI } from "@google/genai";

import { useAgentAiStore } from "@/stores/agent-ai";
import { modelType } from "@/models/agent-ai";

interface ICredential {
  apiKey: string;
  baseURL?: string | null;
  dangerouslyAllowBrowser?: boolean;
}
export const agentAi = () => {
  const { agentName, apiKey, baseURL } = useAgentAiStore.getState();

  if (!agentName) {
    throw new Error(
      t`You haven't select agent yet. Please go to your account settings to select agent Integration.`
    );
  }
  if (!apiKey) {
    throw new Error(
      t`Your OpenAI API Key has not been set yet. Please go to your account settings to enable OpenAI Integration.`
    );
  }
  console.log(777, agentName);
  if (agentName == "openai")
    return new OpenAi({ apiKey, baseURL, dangerouslyAllowBrowser: true });
  if (agentName == "gemini") return new Gemini({ apiKey });

  // default use gemini
  return new Gemini({ apiKey });
};

interface IConfig {
  input: string;
  model: modelType;
  max_output_tokens: number | null;
  temperature: number;
}

abstract class Agent {
  abstract create(config: IConfig): Promise<string>;
  // abstract createStream(config: any): void;
}

class OpenAi extends Agent {
  agent: OpenAI | null = null;
  constructor(credential: ICredential) {
    super();
    if (!credential.baseURL) delete credential.baseURL;
    this.agent = new OpenAI(credential);
  }

  async create(config: IConfig) {
    if (!this.agent) return "";
    const result = await this.agent.responses.create({
      model: config.model,
      input: config.input,
      max_output_tokens: config.max_output_tokens,
      temperature: config.temperature,
    });
    return result.output_text;
  }
}

class Gemini extends Agent {
  agent: GoogleGenAI | null = null;
  constructor(credential: ICredential) {
    super();
    this.agent = new GoogleGenAI({
      apiKey: credential.apiKey,
    });
  }

  async create(config: IConfig) {
    if (!this.agent) return "";
    const result = await this.agent.models.generateContent({
      model: config.model,
      contents: config.input,
    });
    return result.text || "";
  }
}
