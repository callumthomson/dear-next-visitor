'use client';
import { useQuery } from '@tanstack/react-query';
import { handFont } from '@/fonts';
import { api } from '@/api-client';
import { ExchangeSection } from '@/components/exchange-section';

export default function Root() {
  const messageCountData = useQuery({
    queryKey: ['messageCount'],
    queryFn: () => api.messages.count.$get().then((result) => result.json()),
  });
  return (
    <div className={'flex flex-col items-center justify-between min-h-screen'}>
      <div
        className={`bg-zinc-800 w-full p-3 flex flex-col sm:flex-row justify-between text-3xl ${handFont.className}`}
      >
        <div>Dear Next Visitor</div>
        <div className={'text-right'}>
          {messageCountData.data ? (
            <>{messageCountData.data.count} Messages Delivered</>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className={'text-zinc-300 p-4 w-full max-w-screen-md'}>
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
