import OpenAI from 'openai';

declare global {
  var __pullupOpenAI: OpenAI | undefined;
}

export const openai =
  globalThis.__pullupOpenAI ??
  new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__pullupOpenAI = openai;
}

export function requireOpenAIKey() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is missing');
  }
}
