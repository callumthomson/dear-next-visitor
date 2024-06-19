import { openAi } from './openai';

export type Curation = {
  pass: boolean;
  reason: string | null;
};

const prompt =
  'Your job is to filter out text input in a system where users send a message to an unknown recipient.\n' +
  '\n' +
  'The rules for the text which you are judging:\n' +
  '- Spam is prohibited\n' +
  '- Gibberish or unreadable/nonsensical messages are prohibited\n' +
  '- Links are prohibited\n' +
  '- Funny or humorous messages are encouraged, but not required at all\n' +
  '\n' +
  "Moderation for offensive messages is performed separately so there is no need to reject offensive messages.  \n" +
  "Rate the provided text as pass or fail. Only provide JSON in your response. A single object with keys  'pass' (boolean) and 'reason' (string or null).\n" +
  "Reason should always be null if 'pass' is true.";

export const curate = async (message: string): Promise<Curation> => {
  const openAiClient = await openAi();
  try {
    const completion = await openAiClient.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        { role: 'user', content: message },
      ],
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
    });
    if (completion.choices[0].message.content) {
      return messageToCuration(completion.choices[0].message.content);
    }
    throw new Error(
      'Did not receive any message content from OpenAI when creating a curation',
    );
  } catch (e) {
    console.error(e);
    return {
      pass: true,
      reason: null,
    };
  }
};

const messageToCuration = (message: string): Curation => {
  const object = JSON.parse(message);
  if (
    typeof object.pass !== 'undefined' &&
    typeof object.reason !== 'undefined'
  ) {
    return object;
  }
  throw new Error(`OpenAI JSON could not be converted to Curation: ${message}`);
};
