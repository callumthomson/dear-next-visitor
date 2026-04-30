'use client';

import { type SubmitEvent, useState } from 'react';
import { MessageDisplay } from '@/components/message-display';
import { exchangeMessageFunction } from '@/lib/server-functions';
import { useRouter } from '@tanstack/react-router';
import { css } from 'styled-system/css';
import { flex } from 'styled-system/patterns';

export const ExchangeSection = () => {
	const [myMessage, setMyMessage] = useState('');
	const [receivedMessage, setReceivedMessage] = useState<undefined | string>();
	const [isPending, setIsPending] = useState<boolean>(false);
	const [errorMessages, setErrorMessages] = useState<string[]>([]);
	const router = useRouter();

	const onSubmit = (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsPending(true);
		exchangeMessageFunction({ data: { message: myMessage } })
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
		<div className={css({ background: 'zinc.800', padding: '5', my: '3', rounded: 'md' })}>
			{receivedMessage ? (
				<MessageDisplay message={receivedMessage} />
			) : (
				<>
					<h2 className={css({ fontSize: '3xl', marginBottom: '4', fontWeight: 'bold' })}>Give One, Take One</h2>
					<p className={css({ fontStyle: 'italic' })}>
						There is a message waiting that has been written just for you...
					</p>
					<p className={css({ my: '4' })}>
						This message has been written{' '}
						<i className={css({ fontStyle: 'italic' })}>for your eyes only</i> by the last person
						who visited this page. You will be the only person to read this
						message. Before you read it, you must first leave a message of your
						own for the next visitor:
					</p>
					<form onSubmit={onSubmit}>
						<div className={flex({ direction: { base: 'column', sm: 'row' } })}>
							<textarea
								autoFocus={true}
								disabled={isPending}
								value={myMessage}
								onChange={(e) => setMyMessage(e.target.value)}
								placeholder={'Dear Next Visitor...'}
								className={css({
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
								})}
							/>
							<button
								className={css({
									background: 'orange.900',
									py: '3',
									px: '7',
									_disabled: { opacity: '50' },
								})}
								disabled={isPending}
								type={'submit'}
							>
								{isPending ? 'Sending...' : 'Submit'}
							</button>
						</div>
						{!!errorMessages.length && (
							<div>
								<ul className={css({ p: '2', color: 'red.500', listStyleType: 'disc', pl: '5' })}>
									{errorMessages.map((msg) => (
										<li key={msg}>{msg}</li>
									))}
								</ul>
							</div>
						)}
						<div className={css({ fontSize: 'xs', color: 'zinc.500', mt: '3'})}>
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
