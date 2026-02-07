import { postHogClient } from './posthog/posthog';
import OpenAI from 'openai';
import { Curation } from './openai/curate';
import { jetstream } from '@/lib/nats/nats';

export const messageExchangeSuccessful = async (messageCount: number) => {
  const event = 'message-exchange.successful';
  const postHog = postHogClient();
  const nats = await jetstream()

  const properties = {
    messageCount,
  };

  postHog && postHog.capture({
    distinctId: 'anonymous',
    event,
    properties
  });
  await nats.publish(`dnv.${event}`, JSON.stringify(properties))
}

export const moderationRejected = async (message: string, moderationResult: OpenAI.Moderation) => {
  const event = 'message-exchange.moderation-rejected';
  const postHog = postHogClient();
  const nats = await jetstream();

  const properties = {
    message,
    moderator: {
      categories: moderationResult.categories,
      category_scores: moderationResult.category_scores,
    },
  };

  postHog && postHog.capture({
    distinctId: 'anonymous',
    event,
    properties,
  });
  await nats.publish(`dnv.${event}`, JSON.stringify(properties));
}

export const curationRejected = async (message: string, curation: Curation) => {
  const event = 'message-exchange.curation-failed';
  const postHog = postHogClient();
  const nats = await jetstream();

  const properties = {
    message,
    curator: {
      reason: curation.reason,
    },
  };

  postHog && postHog.capture({
    distinctId: 'anonymous',
    event,
    properties,
  });
  await nats.publish(`dnv.${event}`, JSON.stringify(properties));
}
