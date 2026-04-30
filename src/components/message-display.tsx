import { css } from 'styled-system/css';

export const MessageDisplay = ({ message }: { message: string }) => {
	return (
		<>
			<h2 className={css({ fontSize: '3xl', mb: '4', fontWeight: 'bold' })}>Thank you for your message</h2>
			<p className={css({ my: '4' })}>
				Your message has been saved and will be revealed to the next visitor
				once they have written a message of their own.
				<br />
				<br />
				Now it is time for you to see what has been written for you. Once you
				leave this page, the message will disappear forever...
			</p>
			<div
				className={
					css({ bg: 'orange.900', py: '4', px: '6', borderStyle: 'dashed', borderColor: 'orange.700', borderWidth: '2' })
				}
			>
				{message}
			</div>
		</>
	);
};
