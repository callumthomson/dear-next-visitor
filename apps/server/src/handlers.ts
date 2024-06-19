import { NotFoundHandler, Context, ErrorHandler } from 'hono';
import { ModerationRejectedError } from './errors/moderation-rejected';
import { CurationRejectedError } from './errors/curation-rejected';
import OpenAI from 'openai';

export const notFoundHandler: NotFoundHandler = (c: Context): Response => {
  return c.json({ code: 'NOT_FOUND' }, { status: 404 });
};

export const errorHandler: ErrorHandler = (
  err: Error,
  c: Context,
): Response => {
  if (err instanceof ModerationRejectedError) {
    return c.json(
      {
        error: {
          name: 'ModerationRejected',
          categories: Object.keys(err.data.categories).filter(
            (category: string) =>
              err.data.categories[
                category as keyof OpenAI.Moderation['categories']
              ],
          ),
        },
      },
      { status: 400 },
    );
  } else if (err instanceof CurationRejectedError) {
    return c.json(
      {
        error: {
          name: 'CurationRejected',
          message: err.message,
        },
      },
      { status: 400 },
    );
  }
  console.error(err);
  return c.json(err, { status: 500 });
};
