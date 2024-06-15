import { ddb, itemKeys } from '@/server/db/ddb';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';

export const getMessageCount = async (): Promise<number> => {
  const response = await ddb.send(
    new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': itemKeys.messageCount.PK,
      },
      Limit: 1,
      ConsistentRead: true,
    }),
  );
  if (response?.Items?.length && response.Items[0].MessageCount) {
    return response.Items[0].MessageCount;
  }
  throw new Error('No item from DynamoDB when counting messages, or item does not have MessageCount property');
};
