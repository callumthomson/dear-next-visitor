export const MessageDisplay = ({ message }: { message: string }) => {
  return (
    <>
      <h2 className={'text-3xl mb-4 font-bold'}>Thank you for your message</h2>
      <p className={'my-4'}>
        Your message has been saved and will be revealed to the next visitor
        once they have written a message of their own.
        <br />
        <br />
        Now it is time for you to see what has been written for you. Once you
        leave this page, the message will disappear forever...
      </p>
      <div
        className={
          'bg-orange-900 py-4 px-6 border-dashed border-orange-700 border-2'
        }
      >
        {message}
      </div>
    </>
  );
};
