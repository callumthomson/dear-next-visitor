import { postHogClient } from './posthog/posthog';
import { jetstreamClient } from '@/lib/nats/nats';

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

export const filterRejected = async (message: string, reason: string) => {
	await captureEvent('message-exchange.filter-rejected', {
		message,
		filter: {
			reason,
		},
	});
};
