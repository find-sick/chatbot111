export interface Conversation {
  id: string; // 唯一标识（用 uuid 生成）
  title: string; // 会话标题（如 "对话1"）
  messages: any[]; // 消息列表（格式与 OpenAI 消息兼容）
  timestamp: number; // 创建/更新时间戳（毫秒）
}