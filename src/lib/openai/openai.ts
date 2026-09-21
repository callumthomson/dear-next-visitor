import OpenAI from 'openai';
import { Resource } from 'sst';

export const openAi = async () => {
	return new OpenAI({ apiKey: Resource.OPENAI_API_KEY.value });
};
