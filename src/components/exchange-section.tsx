'use client'

import { FormEvent, useState } from 'react';
import { MessageDisplay } from '@/components/message-display';
import { exchangeMessageAction } from '@/actions/exchange-message.action';

export const ExchangeSection = () => {
  const [myMessage, setMyMessage] = useState('');
  const [receivedMessage, setReceivedMessage] = useState<undefined | string>();
  const [isPending, setIsPending] = useState<boolean>(false)
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    exchangeMessageAction({ message: myMessage }).then((response) => {
      if (response.message) {
        setErrorMessages([])
        setMyMessage('')
        setReceivedMessage(response.message)
      }
      if (response.error) {
        setErrorMessages(response.error.messages)
      }
    }).catch((err) => {
      setErrorMessages(['Sorry an unknown error occurred. Please try again later.'])
    }).finally(() => {
      setIsPending(false)
    });
  };
  return (
    <div className={'bg-zinc-800 p-5 my-3 rounded'}>
      {receivedMessage ? (
        <MessageDisplay message={receivedMessage} />
      ) : (
        <>
          <h2 className={'text-3xl mb-4 font-bold'}>Give One, Take One</h2>
          <p className={'italic'}>
            There is a message waiting that has been written just for you...
          </p>
          <p className={'my-4'}>
            This message has been written{' '}
            <i className={'italic'}>for your eyes only</i> by the last person
            who visited this page. You will be the only person to read this
            message. Before you read it, you must first leave a message of your
            own for the next visitor:
          </p>
          <form onSubmit={onSubmit}>
            <div className={'flex flex-col sm:flex-row'}>
              <textarea
                autoFocus={true}
                disabled={isPending}
                value={myMessage}
                onChange={(e) => setMyMessage(e.target.value)}
                placeholder={'Dear Next Visitor...'}
                className={
                  'bg-zinc-400 w-full min-h-20 py-1 px-2 border-none focus:outline-none text-zinc-800 placeholder:text-zinc-600 disabled:opacity-25'
                }
              />
              <button
                className={'bg-orange-900 py-3 px-7 disabled:opacity-50'}
                disabled={isPending}
                type={'submit'}
              >
                {isPending ? 'Sending...' : 'Submit'}
              </button>
            </div>
            {!!errorMessages.length && (
              <div>
                <ul className={'p-2 text-red-500 list-disc pl-5'}>
                  {errorMessages.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className={'text-xs text-zinc-500 mt-3'}>
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
