import OpenAI from 'openai';

export const openAi = async () => {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}
