'use client';

import { type SubmitEvent, useState } from 'react';
import { MessageDisplay } from '@/components/message-display';
import { exchangeMessageFunction } from '@/lib/server-functions';
import { useRouter } from '@tanstack/react-router';
import { css } from 'styled-system/css';
import { flex } from 'styled-system/patterns';
import { messageExchangeSchema } from '@/schemas.ts';

export const ExchangeSection = () => {
	const [myMessage, setMyMessage] = useState('');
	const [receivedMessage, setReceivedMessage] = useState<undefined | string>();
	const [isPending, setIsPending] = useState<boolean>(false);
	const [errorMessages, setErrorMessages] = useState<string[]>([]);
	const router = useRouter();

	const onSubmit = (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const validationResult = messageExchangeSchema.safeParse({
			message: myMessage,
		});

		if (!validationResult.success) {
			setErrorMessages(
				validationResult.error.issues.map((issue) => issue.message),
			);
			return;
		}

		setIsPending(true);
		exchangeMessageFunction({ data: validationResult.data })
			.then((response) => {
				if (response.message) {
					setErrorMessages([]);
					setMyMessage('');
					setReceivedMessage(response.message);
					router.invalidate();
				}
				if (response.error) {
					setErrorMessages(response.error.messages);
				}
			})
			.catch(() => {
				setErrorMessages([
					'Sorry an unknown error occurred. Please try again later.',
				]);
			})
			.finally(() => {
				setIsPending(false);
			});
	};
	return (
		<div
			className={`${css({
				background: 'zinc.800',
				padding: '5',
				my: '3',
				rounded: 'md',
			})} halloween-card`}
		>
			<svg
				aria-hidden="true"
				className="halloween-pumpkin"
				focusable="false"
				viewBox="0 0 96 96"
			>
				<path d="M45 28c1-11 7-17 17-19-1 9-5 16-13 21" fill="#71834a" />
				<ellipse cx="48" cy="57" rx="37" ry="29" fill="#e67832" />
				<ellipse cx="32" cy="57" rx="19" ry="26" fill="#c9522a" opacity=".58" />
				<ellipse cx="64" cy="57" rx="19" ry="26" fill="#f28b3e" opacity=".52" />
				<path d="m29 48 12 4-10 10zm38 0-12 4 10 10zM31 67c10-2 24-2 34 0-4 12-11 17-17 17s-13-5-17-17Z" fill="#352039" />
				<path d="M38 70h5v5h-5zm10 0h5v5h-5zm10 0h5v5h-5z" fill="#e67832" />
			</svg>
			{receivedMessage ? (
				<MessageDisplay message={receivedMessage} />
			) : (
				<>
					<h2
						className={css({
							fontSize: '3xl',
							marginBottom: '4',
							fontWeight: 'bold',
						})}
					>
						Leave a Note for the Next Soul
					</h2>
					<p className={css({ fontStyle: 'italic' })}>
						There is a message waiting that has been written just for you...
					</p>
					<p className={css({ my: '4' })}>
						This message has been written{' '}
						<i className={css({ fontStyle: 'italic' })}>for your eyes only</i>{' '}
						by the last person who visited this page. You will be the only
						person to read this message. Before you read it, you must first
						leave a message of your own for the next visitor:
					</p>
					<form onSubmit={onSubmit}>
						<div className={flex({ direction: { base: 'column', sm: 'row' } })}>
							<textarea
								autoFocus={true}
								disabled={isPending}
								value={myMessage}
								onChange={(e) => setMyMessage(e.target.value)}
								placeholder={'Dear Next Visitor...'}
								className={`${css({
									width: 'full',
									minHeight: '20',
									py: '1',
									px: '2',
									border: 'none',
									outline: 'none',
									background: 'zinc.400',
									color: 'zinc.800',
									_focus: { outline: 'none' },
									_placeholder: { color: 'zinc.600' },
									_disabled: { opacity: '25' },
								})} halloween-textarea`}
							/>
							<button
								className={`${css({
									background: 'orange.900',
									py: '3',
									px: '7',
									cursor: 'pointer',
									_disabled: { opacity: '50' },
								})} halloween-submit`}
								disabled={isPending}
								type={'submit'}
							>
								{isPending ? 'Sending...' : 'Submit'}
							</button>
						</div>
						{!!errorMessages.length && (
							<div>
								<ul
									className={css({
										p: '2',
										color: 'red.500',
										listStyleType: 'disc',
										pl: '5',
									})}
								>
									{errorMessages.map((msg) => (
										<li key={msg}>{msg}</li>
									))}
								</ul>
							</div>
						)}
						<div
							className={css({ fontSize: 'xs', color: 'zinc.500', mt: '3' })}
						>
							Submitted messages are automatically moderated for abuse but
							abusive/obscene messages may still make it through. Please proceed
							at your own risk, as I do not take responsibility for messages
							submitted into the system. Thank you for understanding!
						</div>
					</form>
				</>
			)}
		</div>
	);
};
