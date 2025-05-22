"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import './chat-styles.css'; 
import { useRouter } from 'next/navigation'; 
import { v4 as uuidv4 } from 'uuid'; // 新增：安装 uuid 库（npm install uuid）
import { Conversation } from '../types/conversation'; // 导入会话类型
// 导入拆分的组件
import Sidebar from './components/Sidebar';
import UserAvatar from './components/UserAvatar';
import ChatMessages from './components/ChatMessages';
import MessageInput from './components/MessageInput';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // 会话状态管理
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false); 
  const router = useRouter(); 

  // 从本地存储加载会话
  useEffect(() => {
    const savedConversations = localStorage.getItem('chatConversations');
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    }
  }, []);

  // 将会话保存到本地存储
  useEffect(() => {
    localStorage.setItem('chatConversations', JSON.stringify(conversations));
  }, [conversations]);

  // 登录验证逻辑
  useEffect(() => {
    // const token = localStorage.getItem('token');
    // if (!token) router.push('/login');
  }, []);

  // 获取当前会话的消息
  const currentConversation = conversations.find(conv => conv.id === currentConversationId);
  const messages = currentConversation?.messages || [];

  // 新建对话逻辑
  const handleNewConversation = () => {
    const newId = uuidv4();
    const newConversation: Conversation = {
      id: newId,
      title: `对话 ${conversations.length + 1}`, // 自动生成标题
      messages: [],
      timestamp: Date.now()
    };
    setConversations(prev => [...prev, newConversation]);
    setCurrentConversationId(newId); // 自动切换到新会话
  };

  // 流式对话核心逻辑
  const handleSendMessage = async (userInput: string) => {
    console.log('发送消息:', {
      userInput,
      isStreaming,
      currentConversationId,
      conversationsLength: conversations.length
    });

    if (!userInput.trim()) {
      console.log('消息为空');
      return;
    }
    if (isStreaming) {
      console.log('正在流式传输中');
      return;
    }
    if (!currentConversationId) {
      console.log('没有选中的会话');
      // 创建一个新的会话
      const newId = uuidv4();
      const newConversation: Conversation = {
        id: newId,
        title: `对话 ${conversations.length + 1}`,
        messages: [],
        timestamp: Date.now()
      };
      setConversations(prev => [...prev, newConversation]);
      setCurrentConversationId(newId);
      // 直接处理消息，而不是递归调用
      const newUserMessage = { role: 'user', content: userInput };
      setConversations(prevConvs => 
        prevConvs.map(conv => 
          conv.id === newId 
            ? { ...conv, messages: [newUserMessage], timestamp: Date.now() } 
            : conv
        )
      );
      // 继续处理 AI 响应
      try {
        setIsStreaming(true);
        const tempAiMessage = { role: 'assistant', content: '' };
        setConversations(prevConvs => 
          prevConvs.map(conv => 
            conv.id === newId 
              ? { ...conv, messages: [newUserMessage, tempAiMessage] } 
              : conv
          )
        );

        console.log('准备发送API请求');
        // 调用 OpenAI 流式 API
        const response = await fetch(process.env.NEXT_PUBLIC_OPENAI_API_URL!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY!}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [newUserMessage],
            stream: true 
          })
        });

        console.log('API响应状态:', response.status);
        if (!response.ok) {
          throw new Error(`API 请求失败: ${response.status} ${response.statusText}`);
        }

        // 处理流式响应
        const reader = response.body?.getReader();
        const decoder = new TextDecoder('utf-8');
        if (!reader) throw new Error('无响应流');

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          chunk.split('\n\n').forEach((line) => {
            if (!line || line === 'data: [DONE]') return;
            try {
              const data = JSON.parse(line.replace('data: ', ''));
              const delta = data.choices[0]?.delta?.content;
              if (delta) {
                setConversations(prevConvs => {
                  const convIndex = prevConvs.findIndex(conv => conv.id === newId);
                  if (convIndex === -1) return prevConvs;
                  
                  const currentConv = prevConvs[convIndex];
                  const lastMessageIndex = currentConv.messages.length - 1;
                  const updatedMessages = [...currentConv.messages];
                  updatedMessages[lastMessageIndex] = {
                    ...updatedMessages[lastMessageIndex],
                    content: updatedMessages[lastMessageIndex].content + delta
                  };
                  
                  return prevConvs.map((conv, index) => 
                    index === convIndex ? { ...currentConv, messages: updatedMessages } : conv
                  );
                });
              }
            } catch (e) {
              console.error('流式解析错误:', e);
            }
          });
        }
      } catch (error) {
        console.error('对话请求失败:', error);
        // 移除失败的临时消息
        setConversations(prevConvs => {
          const convIndex = prevConvs.findIndex(conv => conv.id === newId);
          if (convIndex === -1) return prevConvs;
          const currentConv = prevConvs[convIndex];
          return prevConvs.map((conv, index) => 
            index === convIndex ? { ...currentConv, messages: currentConv.messages.slice(0, -1) } : conv
          );
        });
      } finally {
        setIsStreaming(false);
      }
      return;
    }

    // 创建用户消息
    const newUserMessage = { role: 'user', content: userInput };
    console.log('新用户消息:', newUserMessage);
    
    // 更新当前会话的消息
    setConversations(prevConvs => {
      console.log('更新前的会话:', prevConvs);
      const updated = prevConvs.map(conv => 
        conv.id === currentConversationId 
          ? { ...conv, messages: [...conv.messages, newUserMessage], timestamp: Date.now() } 
          : conv
      );
      console.log('更新后的会话:', updated);
      return updated;
    });

    try {
      setIsStreaming(true);
      // 创建流式响应的临时消息（初始为空）
      const tempAiMessage = { role: 'assistant', content: '' };
      
      // 更新当前会话的消息（添加临时消息）
      setConversations(prevConvs => {
        console.log('添加临时AI消息');
        return prevConvs.map(conv => 
          conv.id === currentConversationId 
            ? { ...conv, messages: [...conv.messages, tempAiMessage] } 
            : conv
        );
      });

      console.log('准备发送API请求');
      // 调用 OpenAI 流式 API
      const response = await fetch(process.env.NEXT_PUBLIC_OPENAI_API_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY!}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messages.concat(newUserMessage),
          stream: true 
        })
      });

      console.log('API响应状态:', response.status);
      if (!response.ok) {
        throw new Error(`API 请求失败: ${response.status} ${response.statusText}`);
      }

      // 处理流式响应（更新当前会话的临时消息）
      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      if (!reader) throw new Error('无响应流');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        chunk.split('\n\n').forEach((line) => {
          if (!line || line === 'data: [DONE]') return;
          try {
            const data = JSON.parse(line.replace('data: ', ''));
            const delta = data.choices[0]?.delta?.content;
            if (delta) {
              setConversations(prevConvs => {
                const convIndex = prevConvs.findIndex(conv => conv.id === currentConversationId);
                if (convIndex === -1) return prevConvs;
                
                const currentConv = prevConvs[convIndex];
                const lastMessageIndex = currentConv.messages.length - 1;
                const updatedMessages = [...currentConv.messages];
                updatedMessages[lastMessageIndex] = {
                  ...updatedMessages[lastMessageIndex],
                  content: updatedMessages[lastMessageIndex].content + delta
                };
                
                return prevConvs.map((conv, index) => 
                  index === convIndex ? { ...currentConv, messages: updatedMessages } : conv
                );
              });
            }
          } catch (e) {
            console.error('流式解析错误:', e);
          }
        });
      }
    } catch (error) {
      console.error('对话请求失败:', error);
      // 移除失败的临时消息
      setConversations(prevConvs => {
        const convIndex = prevConvs.findIndex(conv => conv.id === currentConversationId);
        if (convIndex === -1) return prevConvs;
        const currentConv = prevConvs[convIndex];
        return prevConvs.map((conv, index) => 
          index === convIndex ? { ...currentConv, messages: currentConv.messages.slice(0, -1) } : conv
        );
      });
    } finally {
      setIsStreaming(false);
    }
  };

  //删除会话
  const handleDeleteConversation = (id: string) => {
    // 过滤掉被删除的会话
    setConversations(prev => prev.filter(conv => conv.id !== id));
    
    // 如果删除的是当前选中的会话，自动切换到其他会话
    if (currentConversationId === id) {
      const remainingConvs = conversations.filter(conv => conv.id !== id);
      const newCurrentId = remainingConvs.length > 0 ? remainingConvs[0].id : '';
      setCurrentConversationId(newCurrentId);
    }
  };
  

  return (
    <div className="grid min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main 
            // 动态调整网格列：侧边栏隐藏时用单栏，显示时用双栏
            className={`grid ${isSidebarOpen ? 'sm:grid-cols-[auto_1fr]' : 'grid-cols-[1fr]'} gap-8 h-screen relative`}
          >
            {/* 侧边栏组件 */}
              <Sidebar 
               isOpen={isSidebarOpen} 
               onClose={() => setIsSidebarOpen(false)}
               conversations={conversations}
               currentConversationId={currentConversationId}
               onSelectConversation={setCurrentConversationId}
               onNewConversation={handleNewConversation}
               onDeleteConversation={handleDeleteConversation} // 传递删除回调
               />
      
            {/* 对话区域 */}
            <div className="flex flex-col">
              <div className="relative flex items-center justify-between h-25 px-4 w-full">
                <div></div>
                <h2 className="text-4xl text-center font-bold text-gray-900 dark:text-white">智能助手</h2>
                <UserAvatar className="absolute right-5" />
              </div>
      
              <ChatMessages messages={messages} />
              <MessageInput 
                onSend={handleSendMessage} 
                isLoading={isStreaming} 
              />
            </div>
      
            {/* 侧边栏开关按钮 */}
            {!isSidebarOpen && (
              <button
                className="fixed top-6 left-6 z-50 p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-lg transition-transform hover:scale-105"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Image src="/left.svg" alt="打开侧边栏" width={24} height={24} />
              </button>
            )}
          </main>
    </div>
  );
}