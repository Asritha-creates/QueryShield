import React, { useState } from 'react';
import { User, Bot, ChevronDown, ChevronUp, Code2, Table as TableIcon, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage as ChatMessageType } from '../types';
import { QueryTable } from './QueryTable';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [showQuery, setShowQuery] = useState(false);
  const isAi = message.role === 'ai';

  return (
    <div id={`${message.id}`} className={cn(
      "flex w-full gap-4 mb-6",
      !isAi && "flex-row-reverse"
    )}>
      {/* AVATAR */}
      <div className={cn(
        "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all",
        isAi ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"
      )}>
        {isAi ? <Bot size={20} /> : <User size={20} />}
      </div>

      <div className={cn(
        "flex flex-col max-w-[85%] space-y-2",
        !isAi && "items-end"
      )}>
        {/* MAIN BUBBLE (Content or Explanation) */}
        <div className={cn(
          "px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
          isAi
            ? "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
            : "bg-indigo-600 text-white rounded-tr-none"
        )}>
          {/* If AI has an explanation field, show that as the main text */}
          {isAi && message.explanation ? (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-[10px] uppercase tracking-widest mb-1">
                <Info size={12} /> AI Reasoning
              </div>
              <p>{message.explanation}</p>
            </div>
          ) : (
            message.content
          )}
        </div>

        {/* AI METADATA & RESULTS */}
        {isAi && message.mongoQuery && (
          <div className="mt-2 w-full space-y-3">
            
            {/* TOGGLE QUERY BUTTON */}
            <button
              onClick={() => setShowQuery(!showQuery)}
              className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest"
            >
              <Code2 size={12} />
              {showQuery ? 'Hide Query Plan' : 'View Query Plan'}
              {showQuery ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {/* QUERY CODE BLOCK */}
            <AnimatePresence>
              {showQuery && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-[11px] font-mono overflow-x-auto border border-slate-800 shadow-inner">
                    {/* Formatting the query nicely if it's an object */}
                    {typeof message.mongoQuery === 'object' 
                      ? JSON.stringify(message.mongoQuery, null, 2) 
                      : message.mongoQuery}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>

            {/* COUNT RESULT */}
            {typeof message.data === "number" && (
              <div className="px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-xl text-sm font-semibold text-indigo-700 flex justify-between items-center">
                <span>Total Matches Found:</span>
                <span className="bg-white px-3 py-1 rounded-lg border border-indigo-200 shadow-sm">{message.data}</span>
              </div>
            )}

            {/* TABLE RESULT */}
            {Array.isArray(message.data) && message.data?.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <TableIcon size={12} />
                  Previewing {message.data.length} Records
                </div>
                <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                   <QueryTable data={message.data} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};