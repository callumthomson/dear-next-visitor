'use server';

import { messageExchangeSchema } from '@/schemas';
import { moderate } from '@/lib/openai/moderate';
import * as capture from '@/lib/posthog/capture';
import { curate } from '@/lib/openai/curate';
import { exchangeMessage } from '@/lib/db/exchange-message';
import { revalidatePath } from 'next/cache';

type ExchangeMessageActionProps = {
  message: string;
}

export const exchangeMessageAction = async (props: ExchangeMessageActionProps) => {
  const valid = messageExchangeSchema.safeParse(props);
  if (valid.error) {
    return {
      error: {
        messages: valid.error.issues.map((issue) => issue.message),
      },
    };
  }
  const { message } = valid.data;
  const moderationResult = await moderate(message);
  if (moderationResult.flagged) {
    await capture.moderationRejected(message, moderationResult);
    return {
      error: {
        messages: ['Moderation rejected'],
      },
    }
  }
  const curation = await curate(message);
  if (!curation.pass) {
    await capture.curationRejected(message, curation);
    return {
      error: {
        messages: [`Curation rejected: ${curation.reason}`],
      },
    }
  }
  const { previousMessage } = await exchangeMessage(message);
  await capture.messageExchangeSuccessful();
  revalidatePath('/')
  return {
    message: previousMessage,
  };
}
