import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { errorHandler, notFoundHandler } from '@/server/handlers';
import { getMessageCount } from '@/server/db/get-message-count';
import { exchangeMessage } from '@/server/db/exchange-message';

const app = new Hono().basePath('/api');

const appRoutes = app
  .get('/messageCount', async (c) => {
    return c.json({ count: await getMessageCount() });
  })
  .post(
    '/exchangeMessage',
    zValidator(
      'json',
      z.object({
        message: z
          .string()
          .min(20, { message: 'The message must be at least 20 characters' }),
      }),
    ),
    async (c) => {
      const { message } = c.req.valid('json');
      const savedMessage = await exchangeMessage(message);
      return c.json({
        message: savedMessage,
      });
    },
  );
export type AppRoutes = typeof appRoutes;

app.onError(errorHandler);
app.notFound(notFoundHandler);

export const server = handle(app);
