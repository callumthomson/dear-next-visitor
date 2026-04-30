import { createFileRoute } from '@tanstack/react-router';
import { ExchangeSection } from '@/components/exchange-section.tsx';
import { getMessageCountFunction } from '@/lib/server-functions.ts';
import { flex } from 'styled-system/patterns';
import { css } from 'styled-system/css';

export const Route = createFileRoute('/')({
	loader: () => getMessageCountFunction(),
	component: App,
});

function App() {
	const count = Route.useLoaderData();
	return (
		<div className={flex({
			direction: 'column',
			justify: 'space-between',
			align: 'center',
			minHeight: 'screen',
		})}>
			<div
				className={flex({
					direction: {
						base: 'column',
						sm: 'row',
					},
					justify: 'space-between',
					background: 'zinc.800',
					width: 'full',
					paddingY: '2',
					paddingX: '3',
					align: 'center',
					fontSize: '3xl',
					fontFamily: 'hand',
				})}
			>
				<div>Dear Next Visitor</div>
				<div className={css({ textAlign: 'right' })}>
					{count.toLocaleString()} Messages Delivered
				</div>
			</div>
			<div className={css({ color: 'zinc.300', padding: '4', width: 'full', maxWidth: 'breakpoint-md' })}>
				<ExchangeSection />
			</div>
			<div className={flex({
				padding: '3',
				width: 'full',
				background: 'zinc.800',
				justify: 'space-between',
			})}>
				<div>Copyright &copy; Every Year For Ever</div>
				<div>
					By{' '}
					<a href={'https://github.com/callumthomson'} target={'_blank'}>
						Callum Thomson
					</a>
				</div>
			</div>
		</div>
	);
}
