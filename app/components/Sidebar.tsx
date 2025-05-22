'use client';
import Image from 'next/image';
import { Conversation } from '../../types/conversation'; 

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[]; 
  currentConversationId: string; 
  onSelectConversation: (id: string) => void; 
  onNewConversation: () => void; 
  onDeleteConversation: (id: string) => void; 
}

export default function Sidebar({ 
  isOpen, 
  onClose, 
  conversations, 
  currentConversationId, 
  onSelectConversation,
  onNewConversation,
  onDeleteConversation 
}: SidebarProps) {
  if (!isOpen) return null; 

  return (
    <div
      style={{ width: isOpen ? '260px' : '0' }}
      className="overflow-hidden transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
    >
      <button 
        style={{ width: '200px', height: '52px' }}
        onClick={onClose}
      >
        <Image
          src="/left.svg"
          alt="关闭侧边栏"
          width={24}
          height={24}
          style={{ marginLeft: '10px' }}
        />
      </button>

      <button className="new-chat-btn mb-4 ml-4" onClick={onNewConversation}>
        新建对话
      </button>

      {/* 动态渲染会话列表 */}
      <ul className="space-y-2 ml-4">
        {conversations.map(conv => (
          <li 
            key={conv.id} 
            className={`chat-item ${currentConversationId === conv.id ? 'bg-blue-100 dark:bg-blue-900' : ''} flex justify-between items-center`} // 新增 flex 布局
            onClick={() => onSelectConversation(conv.id)}
          >
            {/* 会话信息 */}
            <div>
              <h4>{conv.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(conv.timestamp).toLocaleString()}
              </p>
            </div>

            {/* 删除按钮 */}
            <button 
              className="delete-btn" 
              onClick={(e) => {
                e.stopPropagation(); // 阻止事件冒泡（避免触发会话切换）
                onDeleteConversation(conv.id); 
              }}
            >
              <Image 
                src="/trash.svg" 
                alt="删除会话" 
                width={26} 
                height={26} 
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}