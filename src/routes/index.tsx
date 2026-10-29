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
		<div
			className={`halloween-page ${flex({
				direction: 'column',
				justify: 'space-between',
				align: 'center',
				minHeight: 'screen',
			})}`}
		>
			<div
				className={`halloween-header ${flex({
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
				})}`}
			>
				<div className="halloween-brand">
					<svg
						aria-hidden="true"
						className="halloween-bat"
						focusable="false"
						viewBox="0 0 64 44"
					>
						<path d="M2 7c10 2 17 7 21 15 0-8 3-15 9-20 6 5 9 12 9 20 5-8 12-13 21-15-3 8-3 15 0 22-8-2-14-1-19 4-3 4-6 7-11 9-5-2-8-5-11-9-5-5-11-6-19-4 3-7 3-14 0-22Z" />
					</svg>
					<span>Dear Next Visitor</span>
				</div>
				<div className={`${css({ textAlign: 'right' })} halloween-counter`}>
					{count.toLocaleString()} Messages Delivered
				</div>
			</div>
			<div
				className={css({
					color: 'zinc.300',
					padding: '4',
					width: 'full',
					maxWidth: 'breakpoint-md',
				})}
			>
				<ExchangeSection />
			</div>
			<div
				className={`halloween-footer ${flex({
					padding: '3',
					width: 'full',
					background: 'zinc.800',
					justify: 'space-between',
				})}`}
			>
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
