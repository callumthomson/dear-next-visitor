import * as ssm from '@aws-sdk/client-ssm';
import OpenAI from 'openai';

export const openAi = async () => {
  const apiKeyResult = await new ssm.SSMClient().send(new ssm.GetParameterCommand({
    Name: 'dnv.openai-key',
    WithDecryption: true,
  }));
  if (!apiKeyResult.Parameter) {
    throw new Error('Could not get OpenAI API token secret from SSM Parameter Store.');
  }
  return new OpenAI({ apiKey: apiKeyResult.Parameter.Value });
}
