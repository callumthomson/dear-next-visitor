import { messageExchangeSchema } from '@/schemas';
import { moderate } from '@/lib/openai/moderate';
import * as capture from '@/lib/capture';
import { curate } from '@/lib/openai/curate';
import { exchangeMessage } from '@/lib/db/exchange-message';
import { getMessageCount } from '@/lib/db/get-message-count';
import { createServerFn } from '@tanstack/react-start';

export const exchangeMessageFunction = createServerFn({ method: 'POST' })
	.inputValidator(messageExchangeSchema)
	.handler(async ({ data: { message } }) => {
		const moderationResult = await moderate(message);
		if (moderationResult.flagged) {
			await capture.moderationRejected(message, moderationResult);
			return {
				error: {
					messages: ['Moderation rejected'],
				},
			};
		}
		const curation = await curate(message);
		if (!curation.pass) {
			await capture.curationRejected(message, curation);
			return {
				error: {
					messages: [`Curation rejected: ${curation.reason}`],
				},
			};
		}
		const { previousMessage, messageCount } = await exchangeMessage(message);
		await capture.messageExchangeSuccessful(messageCount);
		return {
			message: previousMessage,
		};
	});

export const getMessageCountFunction = createServerFn({
	method: 'GET',
}).handler(async () => {
	return getMessageCount();
});
