'use client';
import { useState } from 'react';
import { Button } from './ui/button'; // 根据你的文件结构调整路径
import { Textarea } from './ui/textarea'; // 同上
import { Form } from './ui/form'; // 如果需要更复杂的表单处理，可以使用Form组件

interface MessageInputProps {
  onSend: (input: string) => void;
  onCancel: () => void; // 新增 onCancel 回调函数用于中断请求
  isLoading: boolean;
}

export default function MessageInput({ onSend, onCancel, isLoading }: MessageInputProps) {
  const [input, setInput] = useState('');

  const handleSubmitOrCancel = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault(); // 确保表单不会提交刷新页面
    if (isLoading) {
      onCancel(); // 如果正在加载，则尝试中断当前请求
    } else if (input.trim()) {
      onSend(input.trim()); // 否则发送消息
      setInput(''); // 清空输入框
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitOrCancel(e as unknown as React.FormEvent); // 使用相同的逻辑处理按键事件
    }
  };

  return (
    <div className="w-full flex justify-center h-25">
      <form onSubmit={handleSubmitOrCancel} className="flex gap-5 items-end w-full max-w-2xl">
        <div className="flex-1 relative" style={{ marginBottom: '20px' }}>
          <Textarea
            placeholder={isLoading ? "AI正在思考中..." : "  输入消息..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="resize-none min-h-[48px] max-h-[200px] 
           transition duration-200
           focus:outline-none focus:ring-2 focus:ring-[#623CEA] 
           border border-gray-300 rounded-md"
          />
          <div className="absolute right-3 bottom-3 text-sm text-muted-foreground">
            {isLoading ? '思考中...' : ''}
          </div>
        </div>
        <Button
          type="submit"
          onClick={handleSubmitOrCancel}
          style={{ backgroundColor: '#623CEA', color: 'white', width: '50px', marginBottom: '24px' }}
          variant={isLoading ? 'secondary' : 'default'}
          size="lg"
          disabled={isLoading}
          className={`${isLoading ? 'bg-gray-400' : 'bg-[#623CEA]'}`}
        >
          {isLoading ? '取消' : '发送'}
        </Button>
      </form>
    </div>
  );
}