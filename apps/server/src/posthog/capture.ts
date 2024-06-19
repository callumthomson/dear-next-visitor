import { postHogClient } from './index';
import OpenAI from 'openai';
import { Curation } from '../openai/curate';

export const messageExchangeSuccessful = async () => {
  const postHog = postHogClient();
  postHog.capture({
    distinctId: 'anonymous',
    event: 'message-exchange.successful',
  });
  await postHog.shutdown();
}

export const moderationRejected = async (message: string, moderationResult: OpenAI.Moderation) => {
  const postHog = postHogClient();
  postHog.capture({
    distinctId: 'anonymous',
    event: 'message-exchange.moderation-rejected',
    properties: {
      message,
      moderator: {
        categories: moderationResult.categories,
        category_scores: moderationResult.category_scores,
      },
    },
  });
  await postHog.shutdown();
}

export const curationRejected = async (message: string, curation: Curation) => {
  const postHog = postHogClient();
  postHog.capture({
    distinctId: 'anonymous',
    event: 'message-exchange.curation-failed',
    properties: {
      message,
      curator: {
        reason: curation.reason,
      },
    },
  });
  await postHog.shutdown();
}
