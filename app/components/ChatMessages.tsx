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
              <div
                className="user-message rounded-lg px-4 py-2 max-w-md "
                style={{ backgroundColor: '#e0dfff', color: '#67676f' }} // 自定义背景色
              >
                {msg.content}
              </div>
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
              <div className="ai-message bg-gray-100 rounded-lg px-4 py-2 max-w-md text-gray-800">
                {msg.content}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}