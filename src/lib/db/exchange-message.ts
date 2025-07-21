import { ddb, itemKeys } from './ddb';
import { QueryCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';

const getLatestMessage = async (): Promise<string> => {
  const response = await ddb.send(
    new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': itemKeys.latestMessage.PK,
      },
      Limit: 1,
      ConsistentRead: true,
    }),
  );
  if (response?.Items?.length && response.Items[0].MessageText) {
    return response.Items[0].MessageText;
  }
  throw new Error('No latest message found in DynamoDB');
};

export const exchangeMessage = async (message: string): Promise<string> => {
  const latestMessage = await getLatestMessage();
  await ddb.send(
    new TransactWriteCommand({
      TransactItems: [
        {
          Update: {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: { PK: itemKeys.messageCount.PK, SK: itemKeys.messageCount.SK },
            UpdateExpression: 'ADD MessageCount :incBy',
            ExpressionAttributeValues: { ':incBy': 1 },
          },
        },
        {
          Update: {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: {
              PK: itemKeys.latestMessage.PK,
              SK: itemKeys.latestMessage.SK,
            },
            UpdateExpression: 'SET MessageText = :newMessage',
            ConditionExpression: 'MessageText = :oldMessage',
            ExpressionAttributeValues: {
              ':oldMessage': latestMessage,
              ':newMessage': message,
            },
          },
        },
      ],
    }),
  );
  return latestMessage;
};
