import * as ssm from '@aws-sdk/client-ssm';
import axios from 'axios';

export type ModerationResult = {
  flagged: boolean;
  categories: {
    sexual: boolean;
    hate: boolean;
    harassment: boolean;
    'self-harm': boolean;
    'sexual/minors': boolean;
    'hate/threatening': boolean;
    'violence/graphic': boolean;
    'self-harm/intent': boolean;
    'self-harm/instructions': boolean;
    'harassment/threatening': boolean;
    violence: boolean;
  };
  category_scores: {
    sexual: number;
    hate: number;
    harassment: number;
    'self-harm': number;
    'sexual/minors': number;
    'hate/threatening': number;
    'violence/graphic': number;
    'self-harm/intent': number;
    'self-harm/instructions': number;
    'harassment/threatening': number;
    violence: number;
  };
};

export type ModerateResponseData = {
  id: string;
  model: string;
  results: ModerationResult[];
};

export const moderate = async (message: string): Promise<ModerationResult> => {
  const apiKeyResult = await new ssm.SSMClient().send(new ssm.GetParameterCommand({
    Name: 'dnv.openai-key',
    WithDecryption: true,
  }));
  const result = await axios.post<ModerateResponseData>(
    'https://api.openai.com/v1/moderations',
    {
      input: message,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKeyResult.Parameter!.Value}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return result.data.results[0];
};
