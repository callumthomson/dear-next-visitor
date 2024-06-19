import { ClientResponse, hc } from 'hono/client';
import { AppRoutes } from 'server';
import { ZodError } from 'zod';

export const api = hc<AppRoutes>(process.env.NEXT_PUBLIC_API_URL!);

export const assertResponseOk = async <T extends ClientResponse<unknown>>(
  response: T,
): Promise<T> => {
  if (!response.ok) {
    const json: any = await response.json();
    if (json?.error?.name) {
      switch (json?.error.name) {
        case 'ZodError':
          throw new ZodError(json.error.issues);
        case 'ModerationRejected':
          throw new Error(`Moderation Rejected: ${json.error.categories.join(', ')}`);
        default:
          throw new Error(json.error.message || response.statusText);
      }
    }
  }
  return response;
};
