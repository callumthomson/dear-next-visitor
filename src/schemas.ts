import { z } from 'zod';

export const messageExchangeSchema = z.object({
  message: z
    .string()
    .min(20, { message: 'The message must be at least 20 characters' }),
});
