import { valkey } from '@/lib/db/valkey';

export const getMessageCount = async (): Promise<number> => {
  const countResult = await valkey.get('MessageCount');
  if (!countResult) {
    throw new Error('No message count found in data store.');
  }
  return parseInt(countResult);
};

