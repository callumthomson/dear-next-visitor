import { useMutation } from '@tanstack/react-query';
import { api, assertResponseOk } from '@/api-client';
import { FormEvent, useState } from 'react';
import { ZodError } from 'zod';
import { MessageDisplay } from '@/components/message-display';

export const ExchangeSection = () => {
  const [message, setMessage] = useState('');
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const messageExchangeMutation = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await api.exchangeMessage.$post({
        json: {
          message,
        },
      });
      const okResponse = await assertResponseOk(response);
      setErrorMessages([]);
      return await okResponse.json();
    },
    onError: (error: Error) => {
      if (error instanceof ZodError) {
        setErrorMessages(error.issues.map((issue) => issue.message));
      }
    },
  });
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    messageExchangeMutation.mutate({ message });
  };
  return (
    <div className={'bg-zinc-800 p-5 my-3 rounded'}>
      {messageExchangeMutation.isSuccess ? (
        <MessageDisplay message={messageExchangeMutation.data.message} />
      ) : (
        <>
          <h2 className={'text-3xl mb-4 font-bold'}>Give One, Take One</h2>
          <p className={'italic my-4'}>
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
                disabled={messageExchangeMutation.isPending}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={'Dear Next Visitor...'}
                className={
                  'bg-zinc-400 w-full min-h-20 py-1 px-2 border-none focus:outline-none text-zinc-800 placeholder:text-zinc-600'
                }
              />
              <button
                className={'bg-orange-900 py-3 px-7'}
                disabled={messageExchangeMutation.isPending}
              >
                Submit
              </button>
            </div>
            <div>
              <ul className={'p-2'}>
                {errorMessages.map((msg, i) => (
                  <li key={i}>&bull; {msg}</li>
                ))}
              </ul>
            </div>
          </form>
        </>
      )}
    </div>
  );
};
