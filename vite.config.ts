import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';

const config = defineConfig({
	resolve: {
		tsconfigPaths: true,
	},
	plugins: [
		nitro(),
		tanstackStart(),
		viteReact(),
	],
	nitro: {
		preset: 'aws-lambda',
		awsLambda: {
			streaming: true,
		},
	},
});

export default config;
