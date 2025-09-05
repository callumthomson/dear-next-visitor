import OpenAI from 'openai';
import { secret } from '@/lib/secret';

export const openAi = async () => {
  const apiKey = await secret('openai_api_key');
  return new OpenAI({ apiKey });
}
