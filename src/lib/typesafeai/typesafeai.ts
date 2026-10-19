import { TypeSafeClient, choice } from '@typesafe-ai/sdk';
import { Resource } from 'sst';

export type FilterResult = {
  pass: true;
} | {
  pass: false;
  reason: string;
};

export const typesafeai = new TypeSafeClient({
  apiKey: Resource.TYPESAFE_API_KEY.value
});

export const filter  = async (userMessage: string): Promise<FilterResult> => {
  const response = await typesafeai.systemOne({
    state: {
      context: [
        'You are filtering out text input in a system where users send a message to an unknown recipient.',
        'Beyond the rules, there is a great deal of freedom in messages users may send',
      ],
      rules: [
        "The site is SFW & family friendly - reject offensive messages",
        "Spam or promotional only content is prohibited",
        "Gibberish or unreadable/nonsensical messages are prohibited, but spelling errors are acceptable when the text is still readable",
        "Direct web links are prohibited but references to websites are allowed",
        "Funny or humorous messages are encouraged, but not required at all",
      ],
      userMessage
    },
    questions: {
      reasons: choice("For what reasons (if any) do you reject this message?", {
        offensive: null,
        spam: null,
        gibberish: null,
        links: null,
        other: null,
        notRejected: null,
      }),
    },
  });

  const { reasons } = response.answers;
  const pass = reasons.choice === 'notRejected' || reasons.confidence < 0.75
  if (pass)
    return {
      pass: true,
    };
  return {
    pass: false,
    reason: reasons.choice,
  };
};

