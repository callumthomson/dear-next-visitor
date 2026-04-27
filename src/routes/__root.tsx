import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router';

import appCss from '../styles.css?url';
import { PostHogProvider } from 'posthog-js/react';

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				title: 'Dear Next Visitor...',
				description: 'Transient messages for strangers',
			},
		],
		links: [
			{
				rel: 'stylesheet',
				href: appCss,
			},
		],
	}),

	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<PostHogProvider
					apiKey={`${import.meta.env.VITE_PUBLIC_POSTHOG_KEY}`}
					options={{
						api_host: 'https://us.i.posthog.com',
						defaults: '2026-01-30',
						capture_exceptions: true
					}}
				>
					{children}
				</PostHogProvider>
				<Scripts />
			</body>
		</html>
	);
}
