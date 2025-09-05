import { valkey } from '@/lib/db/valkey';

export const exchangeMessage = async (message: string): Promise<{ previousMessage: string, messageCount: number }> => {
  const results = await valkey
    .multi()
    .incr('MessageCount')
    .get('LatestMessage')
    .set('LatestMessage', message)
    .exec();
  if (results && results[0] && results[1]) {
    const messageCountResult = results[0];
    const previousMessageResult = results[1];
    if (messageCountResult[0] || previousMessageResult[0]) {
      throw messageCountResult[0] || previousMessageResult[0];
    }
    const messageCount = parseInt(messageCountResult[1] as string);
    const previousMessage = previousMessageResult[1] as string;
    return { previousMessage, messageCount };
  } else {
    throw new Error('No results from data store.');
  }
};

