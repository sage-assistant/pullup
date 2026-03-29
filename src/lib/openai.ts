import OpenAI from 'openai';

declare global {
  // eslint-disable-next-line no-var
  var __pullupOpenAI: OpenAI | undefined;
}

export function getOpenAI(): OpenAI {
  if (!globalThis.__pullupOpenAI) {
    globalThis.__pullupOpenAI = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return globalThis.__pullupOpenAI;
}

// Keep backward compat — lazy getter
export const openai = new Proxy({} as OpenAI, {
  get(_target, prop) {
    return (getOpenAI() as Record<string | symbol, unknown>)[prop];
  },
});

export function requireOpenAIKey() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is missing');
  }
}
