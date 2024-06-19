import OpenAI from 'openai';

export class ModerationRejectedError extends Error {
  constructor(public data: OpenAI.Moderation) {
    super();
  }
}
