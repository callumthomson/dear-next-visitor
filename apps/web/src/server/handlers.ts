import { NotFoundHandler, Context, ErrorHandler } from 'hono';

export const notFoundHandler: NotFoundHandler = (c: Context): Response => {
  return c.json({ code: 'NOT_FOUND' }, { status: 404 });
};

export const errorHandler: ErrorHandler = (
  err: Error,
  c: Context,
): Response => {
  console.error(err);
  return c.json(JSON.parse(JSON.stringify(err)), { status: 500 });
};
