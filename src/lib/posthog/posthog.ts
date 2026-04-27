import { PostHog } from 'posthog-node';

let posthog: PostHog | null = null;

export const postHogClient = () => {
	if (!import.meta.env.VITE_PUBLIC_POSTHOG_KEY) {
		return null;
	}
	if (!posthog) {
		posthog = new PostHog(import.meta.env.VITE_PUBLIC_POSTHOG_KEY);
	}
	return posthog;
};
