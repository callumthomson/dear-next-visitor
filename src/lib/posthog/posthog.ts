import { PostHog } from 'posthog-node';

let posthog: PostHog | null = null;

export const postHogClient = () => {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return null;
  }
  if (!posthog) {
    posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY);
  }
  return posthog;
};
