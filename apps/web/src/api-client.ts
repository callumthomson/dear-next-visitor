import { ClientResponse, hc } from 'hono/client';
import { AppRoutes } from 'server';
import { ZodError } from 'zod';

export const api = hc<AppRoutes>('http://localhost:3001');

export const assertResponseOk = async <T extends ClientResponse<unknown>>(
  response: T,
): Promise<T> => {
  if (response.status === 400) {
    const json = await response.json();
    if ((json as any).error.name == 'ZodError') {
      throw new ZodError((json as any).error.issues);
    }
  }
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response;
};
