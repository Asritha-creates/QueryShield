import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { useConnection } from '../context/ConnectionContext';
import { motion, AnimatePresence } from 'motion/react';

export const SessionTimer: React.FC = () => {
  const { connection, logout } = useConnection();
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!connection.sessionExpiry) return;
    const calculateTimeLeft = () => {
      const diff = connection.sessionExpiry - Date.now();
      return Math.max(0, diff);
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const newTime = calculateTimeLeft();
      setTimeLeft(newTime);
      
      if (newTime <= 0) {
        clearInterval(timer);
        logout();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [connection.sessionExpiry, logout]);

  if (!connection.isConnected || !connection.sessionExpiry) return null;

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const isUrgent = timeLeft < 5 * 60 * 1000; // Less than 5 minutes

  return (
    <div className="flex items-center gap-3">
      <AnimatePresence>
        {isUrgent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-700 rounded-lg border border-amber-200 text-[10px] font-bold uppercase tracking-wider"
          >
            <AlertTriangle size={12} />
            Expiring Soon
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
        isUrgent 
          ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' 
          : 'bg-slate-50 text-slate-600 border-slate-200'
      }`}>
        <Clock size={14} className={isUrgent ? 'text-rose-500' : 'text-slate-400'} />
        <span className="font-mono">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};
