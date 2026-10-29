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
			<div aria-hidden="true" className="halloween-decorations">
				<svg className="halloween-web" viewBox="0 0 140 140" focusable="false">
					<path d="M140 0 0 0M140 0 0 70M140 0 0 140M140 0 70 140M140 0 140 140" />
					<path d="M112 0Q112 28 140 28M84 0Q84 56 140 56M56 0Q56 84 140 84M28 0Q28 112 140 112" />
				</svg>
				<svg className="halloween-ghost" viewBox="0 0 100 112" focusable="false">
					<path d="M14 105V49C14 24 30 7 50 7s36 17 36 42v56L72 94l-13 11-12-11-14 11-11-11-8 11Z" />
					<ellipse cx="39" cy="49" rx="4" ry="6" />
					<ellipse cx="62" cy="49" rx="4" ry="6" />
					<path d="M45 67c3-5 8-5 11 0 0 5-2 8-6 8s-5-3-5-8Z" />
				</svg>
				<svg className="halloween-flight" viewBox="0 0 132 62" focusable="false">
					<path d="M2 14c9 1 15 5 19 12 0-7 3-12 7-16 5 4 7 9 7 16 4-7 10-11 19-12-2 6-2 11 0 16-6-2-11-1-15 3-2 3-5 5-8 7-4-2-6-4-8-7-4-4-9-5-15-3 2-5 2-10 0-16Zm73 5c7 1 12 4 15 9 0-5 2-9 5-12 4 3 6 7 6 12 3-5 8-8 15-9-2 5-2 9 0 13-5-1-9-1-12 3-2 2-4 4-7 5-3-1-5-3-7-5-3-4-7-4-12-3 2-4 2-8 0-13Z" />
				</svg>
			</div>
		</div>
	);
}
