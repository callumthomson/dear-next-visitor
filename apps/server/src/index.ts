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
import { moderate } from './openai/moderate';
import { ModerationRejectedError } from './errors/moderation-rejected';
import { curate } from './openai/curate';
import { CurationRejectedError } from './errors/curation-rejected';
import * as capture from './posthog/capture';

const app = new Hono();

app.use(
  cors({
    origin:
      typeof process.env.AWS_EXECUTION_ENV == 'undefined'
        ? 'http://localhost:3000'
        : ['https://dearnextvisitor.com', 'https://www.dearnextvisitor.com'],
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
      const moderationResult = await moderate(message);
      if (moderationResult.flagged) {
        await capture.moderationRejected(message, moderationResult);
        throw new ModerationRejectedError(moderationResult);
      }
      const curation = await curate(message);
      if (!curation.pass) {
        await capture.curationRejected(message, curation);
        throw new CurationRejectedError(curation.reason || 'Curation rejected');
      }
      const savedMessage = await exchangeMessage(message);
      await capture.messageExchangeSuccessful();
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
