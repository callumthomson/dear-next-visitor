import { postHogClient } from './posthog/posthog';
import { jetstreamClient } from '@/lib/nats/nats';
import type OpenAI from 'openai';
import type { Curation } from './openai/curate';

const captureEvent = async (
	event: string,
	properties: Record<string, unknown>,
) => {
	const postHog = postHogClient();
	const nats = await jetstreamClient();
	postHog?.capture({
		distinctId: 'anonymous',
		event,
		properties,
	});
	await nats?.publish(`dnv.${event}`, JSON.stringify(properties));
};

export const messageExchangeSuccessful = async (messageCount: number) => {
	await captureEvent('message-exchange.successful', {
		messageCount,
	});
};

export const moderationRejected = async (
	message: string,
	moderationResult: OpenAI.Moderation,
) => {
	await captureEvent('message-exchange.moderation-rejected', {
		message,
		moderator: {
			categories: moderationResult.categories,
			category_scores: moderationResult.category_scores,
		},
	});
};

export const curationRejected = async (message: string, curation: Curation) => {
	await captureEvent('message-exchange.curation-failed', {
		message,
		curator: {
			reason: curation.reason,
		},
	});
};
