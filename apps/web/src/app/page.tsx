'use client';
import { useQuery } from '@tanstack/react-query';
import { handFont } from '@/fonts';
import { api } from '@/api-client';
import { ExchangeSection } from '@/components/exchange-section';

export default function Root() {
  const messageCountData = useQuery({
    queryKey: ['messageCountData'],
    queryFn: () => api.messageCount.$get().then((result) => result.json()),
  });
  return (
    <div className={'flex flex-col items-center justify-between min-h-screen'}>
      <div
        className={`bg-zinc-800 w-full p-3 flex justify-between text-3xl ${handFont.className}`}
      >
        <div>Dear Next Visitor</div>
        <div>
          {messageCountData.data ? (
            <>{messageCountData.data.count} Messages Delivered</>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className={'text-zinc-300 p-4 w-full max-w-screen-md'}>
        <h1 className={'text-4xl font-bold'}>Dear Next Visitor...</h1>
        <div className={'flex'}>
          <div className={'bg-zinc-800 p-5 my-3 rounded'}>
            <p>
              Welcome, traveller, to the land of transient messages. It is here
              you may read a message dedicated to you from the previous soul to
              walk this path, and also commit a note of your own wisdom to the
              next passer by who finds themself on this trail.
            </p>
          </div>
          <div
            className={
              'bg-zinc-800 p-5 my-3 rounded ml-5 text-5xl flex flex-col justify-center'
            }
          >
            📓
          </div>
        </div>
        <ExchangeSection />
      </div>
      <div className={'bg-zinc-800 w-full p-3 flex justify-between'}>
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
