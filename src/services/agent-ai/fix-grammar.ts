import { DEFAULT_MAX_TOKENS } from "@/constants/llm";
import { useAgentAiStore } from "@/stores/agent-ai";

import { agentAi } from "./client";

const PROMPT = `You are an AI writing assistant specialized in writing copy for resumes.
Do not return anything else except the text you improved. It should not begin with a newline. It should not have any prefix or suffix text.
Just fix the spelling and grammar of the following paragraph, do not change the meaning and returns in the language of the text:

Text: """{input}"""

Revised Text: """`;

export const fixGrammar = async (text: string) => {
  const prompt = PROMPT.replace("{input}", text);

  const { model, maxTokens } = useAgentAiStore.getState();

  const result = await agentAi().create({
    input: prompt,
    model: model,
    max_output_tokens: maxTokens ?? DEFAULT_MAX_TOKENS,
    temperature: 0,
  });

  return result;
};
