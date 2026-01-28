
export type MessageRole = 'user' | 'model';

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isAdultMode: boolean;
  isLoading: boolean;
}
