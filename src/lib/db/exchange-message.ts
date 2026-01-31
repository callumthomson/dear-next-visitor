import { db } from '@/db/client';
import { data } from '@/db/schema';

export const exchangeMessage = async (message: string): Promise<{ previousMessage: string, messageCount: number }> => {
  return await db().transaction(async (tx) => {
    const currentData = await tx.query.data.findFirst();
    if (!currentData) {
      await tx.insert(data).values({
        messageCount: 0,
        latestMessage: '',
      });
      return { previousMessage: '', messageCount: 0 };
    }
    const messageCount = currentData.messageCount + 1;
    await tx.update(data).set({
      messageCount,
      latestMessage: message,
    });
    return { previousMessage: currentData.latestMessage, messageCount }
  })
};

