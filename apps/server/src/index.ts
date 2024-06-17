import * as dotenv from 'dotenv';
dotenv.config();

import { z } from 'zod';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { handle } from 'hono/aws-lambda';
import { zValidator } from '@hono/zod-validator';
import { errorHandler, notFoundHandler } from './handlers';
import { getMessageCount } from './db/get-message-count';
import { exchangeMessage } from './db/exchange-message';
import { postHogClient } from './posthog';
import { moderate } from './moderate';
import { ModerationRejectedError } from './errors/moderation-rejected';

const app = new Hono();

app.use(
  cors({
    origin: typeof process.env.AWS_EXECUTION_ENV == 'undefined' ? 'http://localhost:3000' : ['https://dearnextvisitor.com', 'https://www.dearnextvisitor.com'],
    allowHeaders: ['*'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
  }),
);

const appRoutes = app
  .get('/messages/count', async (c) => {
    return c.json({ count: await getMessageCount() });
  })
  .post(
    '/messages/exchange',
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
      const postHog = postHogClient();
      const moderationResult = await moderate(message);
      if (moderationResult.flagged) {
        postHog.capture({
          distinctId: 'anonymous',
          event: 'message-exchange.moderation-rejected',
          properties: {
            message,
            moderator: {
              categories: moderationResult.categories,
              category_scores: moderationResult.category_scores,
            },
          }
        });
        await postHog.shutdown();
        throw new ModerationRejectedError(moderationResult)
      }
      const savedMessage = await exchangeMessage(message);
      postHog.capture({
        distinctId: 'anonymous',
        event: 'message-exchange.successful',
      })
      await postHog.shutdown();
      return c.json({
        message: savedMessage,
      });
    },
  );
export type AppRoutes = typeof appRoutes;

app.onError(errorHandler);
app.notFound(notFoundHandler);

export const handler = handle(app);

if (typeof process.env.AWS_EXECUTION_ENV == 'undefined') {
  const port = 3001;
  console.log(`Server is running on port ${port}`);
  serve({
    fetch: app.fetch,
    port,
  });
}
