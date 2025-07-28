import OpenAI from 'openai';

export const openAi = async () => {
  const apiKey = await Bun.file(process.env.OPENAI_API_KEY_FILE!).text();
  return new OpenAI({ apiKey });
}
