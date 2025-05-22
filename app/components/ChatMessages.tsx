'use client';
import Image from 'next/image';

interface ChatMessagesProps {
  messages: any[];
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((msg, index) => (
        <div 
          key={index} 
          className={`flex justify-${msg.role === 'user' ? 'end' : 'start'} mb-4 items-start gap-2`}
        >
          {msg.role === 'user' ? (
            <>
              <div className="user-message">{msg.content}</div>
              <Image
                src="/globe.svg"
                alt="用户头像"
                width={32}
                height={32}
                className="rounded-full"
              />
            </>
          ) : (
            <>
              <Image
                src="/globe.svg"
                alt="AI头像"
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="ai-message">{msg.content}</div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}