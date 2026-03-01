import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '../components/Sidebar';
import { ChatMessage } from '../components/ChatMessage';
import { SessionTimer } from '../components/SessionTimer';
import { Send, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import { ChatMessage as ChatMessageType, HistoryItem } from '../types';
import api from '../services/api';
import { motion, AnimatePresence } from 'motion/react';

export const DashboardPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToQuery = (queryId: string) => {
  setTimeout(() => {
    const element = document.getElementById(`ai-${queryId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, 100);
};

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

useEffect(() => {
  loadChatFromHistory();
}, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/history');
      setHistory(response.data.history || []);
    } catch (error) {
      console.error('Failed to fetch history', error);
    }
  };
  const loadChatFromHistory = async () => {
  try {
    const response = await api.get('/history');
    const historyData = response.data.history || [];
    setHistory(historyData);

    const rebuiltMessages: ChatMessageType[] = [];

    for (const item of historyData) {
      const res = await api.get(`/query/${item.id}`);

      rebuiltMessages.push({
        id: `user-${item.id}`,
        role: 'user',
        content: res.data.question,
        timestamp: Date.now()
      });

      rebuiltMessages.push({
        id: `ai-${item.id}`,
        role: 'ai',
        content: "Here is the generated MongoDB query:",
        mongoQuery: res.data.mongoQuery,
        data: res.data.data,
        explanation: res.data.explanation,
        timestamp: Date.now()
      });
    }

    setMessages(rebuiltMessages);

  } catch (error) {
    console.error("Failed to load previous chat", error);
  }
};

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/ai-query', { question: input });

  const queryId = response.data.queryId;

  // user message (same id)
  const userMessage: ChatMessageType = {
    id: `user-${queryId}`,
    role: 'user',
    content: input,
    timestamp: Date.now(),
  };
  const aiMessage: ChatMessageType = {
    id: `ai-${queryId}`,
    role: 'ai',
    content: "Here is the generated MongoDB query:",
    mongoQuery: response.data.mongoQuery,
    data: response.data.data,
    timestamp: Date.now(),
    explanation: response.data.explanation,
  };

  setMessages(prev => [...prev, userMessage, aiMessage]);

  fetchHistory();
    } catch (error: any) {
  if (error.response?.status === 401) {
    alert("Session expired. Please reconnect database.");
    window.location.href = "/";
    return;
  }
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: `An error occurred: ${error.response?.data?.message || error.message}`,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryClick = (item: HistoryItem) => {
  scrollToQuery(item.id);
};

  /*const handleNewChat = () => {
    setMessages([]);
    setInput('');
  };*/

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar 
        history={history} 
        onHistoryClick={handleHistoryClick} 
      />

      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="text-indigo-600 w-5 h-5" />
            <h2 className="font-bold text-slate-800">AI Query Assistant</h2>
          </div>
          <div className="flex items-center gap-4">
            <SessionTimer />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Connected
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-4 scroll-smooth">
          <AnimatePresence mode="popLayout">
            {messages.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto"
              >
                <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-100">
                  <MessageSquare size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Ready to query your data?</h3>
                <p className="text-slate-500 leading-relaxed">
                  Try asking something like "Show me all active users" or "What is the average order value by category?"
                </p>
              </motion.div>
            ) : (
              messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))
            )}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 mb-6"
            >
              <div className="shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                <BotIcon size={20} />
              </div>
              <div className="bg-white border border-slate-200 px-5 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span className="text-sm text-slate-500 font-medium">AI is thinking...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-8 shrink-0">
          <div className="max-w-4xl mx-auto">
            <form 
              onSubmit={handleSend}
              className="relative group"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about your database..."
                className="w-full pl-6 pr-16 py-5 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-800"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-lg shadow-indigo-200"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={20} />}
              </button>
            </form>
            <p className="mt-3 text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              AI can make mistakes. Verify important queries.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

const BotIcon = ({ size }: { size: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);
