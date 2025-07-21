import { handFont } from '@/fonts';

import { ExchangeSection } from '@/components/exchange-section';
import { Suspense, use, FC } from 'react';
import { getMessageCount } from '@/lib/db/get-message-count';

const MessageCountDisplay: FC<{ countPromise: Promise<number> }> = ({ countPromise }) => {
  const count = use(countPromise)
  return (
    <>{count.toLocaleString()} Messages Delivered</>
  )
}

export default function Root() {
  const messageCountPromise = getMessageCount()
  return (
    <div className={'flex flex-col items-center justify-between min-h-screen'}>
      <div
        className={`bg-zinc-800 w-full p-3 flex flex-col sm:flex-row justify-between text-3xl ${handFont.className}`}
      >
        <div>Dear Next Visitor</div>
        <div className={'text-right'}>
          <Suspense>
            <MessageCountDisplay countPromise={messageCountPromise} />
          </Suspense>
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
