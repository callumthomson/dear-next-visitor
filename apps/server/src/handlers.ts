import { NotFoundHandler, Context, ErrorHandler } from 'hono';
import { ModerationRejectedError } from './errors/moderation-rejected';
import { ModerationResult } from './moderate';

export const notFoundHandler: NotFoundHandler = (c: Context): Response => {
  return c.json({ code: 'NOT_FOUND' }, { status: 404 });
};

export const errorHandler: ErrorHandler = (
  err: Error,
  c: Context,
): Response => {
  console.error(err);
  if (err instanceof ModerationRejectedError) {
    return c.json(
      {
        error: {
          name: 'ModerationRejected',
          categories: Object.keys(err.data.categories).filter(
            (category: string) =>
              err.data.categories[
                category as keyof ModerationResult['categories']
              ],
          ),
        },
      },
      { status: 400 },
    );
  }
  return c.json(err, { status: 500 });
};
