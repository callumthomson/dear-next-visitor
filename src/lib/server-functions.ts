import { messageExchangeSchema } from '@/schemas';
import { filter } from '@/lib/typesafeai/typesafeai.ts';
import * as capture from '@/lib/capture';
import { exchangeMessage } from '@/lib/db/exchange-message';
import { getMessageCount } from '@/lib/db/get-message-count';
import { createServerFn } from '@tanstack/react-start';

export const exchangeMessageFunction = createServerFn({ method: 'POST' })
	.validator(messageExchangeSchema)
	.handler(async ({ data: { message } }) => {
		const filterResult = await filter(message);
		if (!filterResult.pass) {
			await capture.filterRejected(message, filterResult.reason);
			return {
				error: {
					messages: [`Filter rejected: ${filterResult.reason}`],
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
