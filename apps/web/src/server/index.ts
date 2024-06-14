import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { errorHandler, notFoundHandler } from '@/server/handlers';

const app = new Hono().basePath('/api');

const appRoutes = app
  .get('/messageCount', (c) => {
    return c.json({ count: 4043 });
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
    (c) => {
      const { message } = c.req.valid('json');
      return c.json({
        message: `${message}+kek`,
      });
    },
  );
export type AppRoutes = typeof appRoutes;

// app.route('/subscribe-email', subscribeEmail);
app.onError(errorHandler);
app.notFound(notFoundHandler);

export const server = handle(app);
