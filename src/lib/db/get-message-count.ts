import { db } from '@/db/client';
import { data } from '@/db/schema';

export const getMessageCount = async (): Promise<number> => {
  const currentData = await db.query.data.findFirst();
  if (!currentData) {
    await db.insert(data).values({
      messageCount: 0,
      latestMessage: '',
    })
    return 0;
  }
  return currentData.messageCount;
};

