'use client';
import { useState } from 'react';

interface MessageInputProps {
  onSend: (input: string) => void;
  isLoading: boolean;
}

export default function MessageInput({ onSend, isLoading }: MessageInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <form onSubmit={handleSubmit} className="flex gap-4 items-end w-full max-w-2xl">
        <div className="flex-1 relative">
          <textarea
            className="w-full border border-gray-200 dark:border-gray-700 rounded-2xl p-4 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
            placeholder={isLoading ? "AI正在思考中..." : "  输入消息..."}
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
            style={{ 
              minHeight: '48px',
              maxHeight: '200px',
              lineHeight: '1.5'
            }}
          />
          <div className="absolute right-3 bottom-3 text-sm text-gray-400">
            {isLoading ? '思考中...' : '按 Enter 发送，Shift + Enter 换行'}
          </div>
        </div>
        <button 
          type="submit" 
          className={`px-6 py-3 rounded-xl bg-blue-500 text-white font-medium transition-all duration-200 ${
            isLoading 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-blue-600 active:bg-blue-700'
          }`}
          disabled={isLoading}
        >
          {isLoading ? '发送中...' : '发送'}
        </button>
      </form>
    </div>
  );
}