export const MessageDisplay = ({ message }: { message: string }) => {
  return (
    <>
      <h2 className={'text-3xl mb-4 font-bold'}>Thank you for your message</h2>
      <p className={'my-4'}>
        Your message has been saved and will be revealed to the next visitor
        once they have written a message of their own. Now it is time for you to
        see what has been written for you. Once you leave this page, the message
        will disappear forever...
      </p>
      <div className={'bg-zinc-500 py-2 px-3'}>{message}</div>
    </>
  );
};
