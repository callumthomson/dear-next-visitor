import { handFont } from '@/fonts';

export default function Root() {
  return (
    <div className={'flex flex-col items-center justify-between min-h-screen'}>
      <div className={`bg-zinc-800 w-full p-3 flex justify-between text-3xl ${handFont.className}`}>
        <div>
          Dear Next Visitor
        </div>
        <div>
          4 Messages Delivered
        </div>
      </div>
      <div className={'text-zinc-300 p-4 w-full max-w-screen-md'}>
        <h1 className={'text-4xl font-bold'}>Dear Next Visitor...</h1>
        <div className={'flex'}>
          <div className={'bg-zinc-800 p-5 my-3 rounded'}>
            <p>
              Welcome, traveller, to the land of transient messages. It is here you may read a message from the previous
              soul to walk this path, and also leave a note of wisdom to the next passer by who finds themself on this
              trail.
            </p>
          </div>
          <div className={'bg-zinc-800 p-5 my-3 rounded ml-5 text-5xl flex flex-col justify-center'}>
            📓
          </div>
        </div>
        <div className={'bg-zinc-800 p-5 my-3 rounded'}>
          <h2 className={'text-3xl mb-4 font-bold'}>Give One, Take One</h2>
          <p className={'italic my-4'}>
            There is a message waiting that has been written just for you...
          </p>
          <p className={'my-4'}>
            This message has been written <i className={'italic'}>for your eyes only</i> by the previous person who visited this page. You will be the only
            person to read this message. Before you read it, you must first leave a message of your own for the next
            visitor:
          </p>
          <div className={'flex flex-col sm:flex-row'}>
            <textarea placeholder={'Dear Next Visitor...'}
                      className={'bg-zinc-400 w-full min-h-20 p-1 border-none focus:outline-none text-zinc-800 placeholder:text-zinc-600'}/>
            <button className={'bg-orange-900 py-3 px-7'}>Continue</button>
          </div>
        </div>
      </div>
      <div className={'bg-zinc-800 w-full p-3 flex justify-between'}>
        <div>
          Copyright &copy; Every Year For Ever
        </div>
        <div>
          By <a href={'https://github.com/callumthomson'} target={'_blank'}>Callum Thomson</a>
        </div>
      </div>
    </div>
  );
}
