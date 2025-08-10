import { DEFAULT_MAX_TOKENS } from "@/constants/llm";
import { useAgentAiStore } from "@/stores/agent-ai";

import { agentAi } from "./client";

const PROMPT = `You are an AI writing assistant specialized in writing copy for resumes.
Do not return anything else except the text you improved. It should not begin with a newline. It should not have any prefix or suffix text.
Change the tone of the following paragraph to be {mood} and returns in the language of the text:

Text: """{input}"""

Revised Text: """`;

type Mood = "casual" | "professional" | "confident" | "friendly";

export const changeTone = async (text: string, mood: Mood) => {
  const prompt = PROMPT.replace("{mood}", mood).replace("{input}", text);

  const { model, maxTokens } = useAgentAiStore.getState();

  const result = await agentAi().create({
    input: prompt,
    model: model,
    max_output_tokens: maxTokens ?? DEFAULT_MAX_TOKENS,
    temperature: 0.5,
  });

  return result;
};
