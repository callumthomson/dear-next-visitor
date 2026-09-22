import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import { nitro } from 'nitro/vite';

const config = defineConfig({
	plugins: [
		nitro(),
		viteTsConfigPaths({
			projects: ['./tsconfig.json'],
		}),
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
