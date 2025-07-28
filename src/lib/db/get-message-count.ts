import { valkey } from '@/lib/db/valkey';

export const getMessageCount = async (): Promise<number> => {
  const countResult = await valkey.get('MessageCount');
  if (!countResult) {
    await valkey.set('MessageCount', 0);
    return 0;
  }
  return parseInt(countResult);
};

