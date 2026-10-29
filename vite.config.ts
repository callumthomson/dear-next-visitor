import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';

const config = defineConfig(({ command }) => ({
	resolve: {
		tsconfigPaths: true,
		alias:
			command === 'serve'
				? [
					{
						find: /^drizzle-orm\/libsql\/web$/,
						replacement: 'drizzle-orm/libsql/node',
					},
				]
				: [],
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
}));

export default config;
