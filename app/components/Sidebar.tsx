'use client';
import Image from 'next/image';
import { Conversation } from '../../types/conversation';
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";

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
      style={{ width: isOpen ? '280px' : '0' }}
      className="left-0 top-0 h-full overflow-hidden transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg z-40"
    >
      <div className="flex flex-col h-full">
        {/* 顶部关闭按钮 */}
        <div className="flex h-16 items-center  p-4 border-b border-gray-200 dark:border-gray-700">
          <Button variant="ghost" size="icon" onClick={onClose} className="ml-5" style={{ marginLeft: '30px' }}>
            <Image src="/left.svg" alt="关闭侧边栏" width={26} height={26} />
          </Button>
        </div>

        {/* 新建对话按钮 */}
        <div className="p-4 mt-6 mb-6 flex justify-center" style={{ marginTop: '10px' }}>
          <Button
            style={{ backgroundColor: '#623CEA', color: 'white' }}
            className="max-w-[200px] w-full h-12 rounded-full font-semibold text-base flex items-center justify-center gap-2 shadow-md border-0 hover:bg-[#5a33d6] transition"
            onClick={onNewConversation}
          >
            <span>新建对话</span>
          </Button>
        </div>

        <Separator />

        {/* 会话列表滚动区域 */}
        <ScrollArea className="flex-1 px-4 py-2" style={{ maxHeight: 'calc(100vh-10px)' }}>
          <ul>
            {conversations.map((conv, idx) => (
              <li key={conv.id} className={`mb-4 last:mb-0 flex items-center justify-center`} style={{ marginTop: '10px' }}>
                <Card
                  className={`relative w-full h-15 cursor-pointer transition-all duration-200 px-4 py-4 flex items-center justify-center gap-2 rounded-lg border bg-white dark:bg-gray-800 ${currentConversationId === conv.id ? 'border-[#623CEA]' : 'border-transparent'
                    } hover:bg-gray-100 dark:hover:bg-gray-700`}
                  onClick={() => onSelectConversation(conv.id)}
                >
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">{conv.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {new Date(conv.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-70 hover:opacity-100"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onDeleteConversation(conv.id);
                      }}
                    >
                      <Image src="/trash.svg" alt="删除会话" width={18} height={18} />
                    </Button>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
    </div>
  );
}