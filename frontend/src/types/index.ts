export interface ConnectionInfo {
  isConnected: boolean;
  databaseName: string | null;
  sessionExpiry?: number;
}

export interface QueryResult {
  success: boolean;
  queryPlan: string;
  data: any[];
  error?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  mongoQuery?: string;
  data?: any[];
  timestamp: number;
  explanation?: string;
}

export interface HistoryItem {
  id: string;
  question: string;
  timestamp: number;
}
interface SidebarProps {
  history: HistoryItem[];
  onHistoryClick: (item: HistoryItem, index: number) => void;
  onNewChat: () => void;
}
