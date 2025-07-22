'use client';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'always',
  });
}

export const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <PostHogProvider client={posthog}>
      {children}
    </PostHogProvider>
  );
};
