import { ModerationResult } from '../moderate';

export class ModerationRejectedError extends Error {
  constructor(public data: ModerationResult) {
    super();
  }
}
