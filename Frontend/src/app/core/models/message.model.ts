export interface MessageItem {
  messageId: number;
  senderId: number;
  receiverId: number;
  taskId?: number;
  messageText: string;
  sentAt: string;
  isRead: boolean;
}
