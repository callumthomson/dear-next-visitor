import { openAi } from './openai';
import OpenAI from 'openai';

export const moderate = async (message: string): Promise<OpenAI.Moderation> => {
  const openAiClient = await openAi();
  const moderation = await openAiClient.moderations.create({
    input: message,
    model: 'omni-moderation-latest'
  });
  return moderation.results[0];
};
