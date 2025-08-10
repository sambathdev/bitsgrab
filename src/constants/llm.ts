export const DEFAULT_MAX_TOKENS = 1024;
export const AGENTS: readonly ['openai', 'gemini'] = ['openai', 'gemini'];
export const AGENT_MODELS: readonly ['gpt-3.5-turbo', 'gemini-2.0-flash'] = ['gpt-3.5-turbo', 'gemini-2.0-flash'];
export const DEFAULT_MODELS = {
  [AGENTS[0]]: AGENT_MODELS[0],
  [AGENTS[1]]: AGENT_MODELS[1],
}
