import { PostHog } from 'posthog-node';

export const postHogClient = () => new PostHog(process.env.POSTHOG_KEY!, {
  host: 'https://us.i.posthog.com',
});
