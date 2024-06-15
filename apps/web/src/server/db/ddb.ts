import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const dynamoDBClient = new DynamoDBClient({ region: 'eu-west-2' });
export const ddb = DynamoDBDocumentClient.from(dynamoDBClient);

export const itemKeys = {
  messageCount: {
    PK: 'MessageCount#',
    SK: 'MessageCount#',
  },
  latestMessage: {
    PK: 'LatestMessage#',
    SK: 'LatestMessage#',
  },
} as const;
