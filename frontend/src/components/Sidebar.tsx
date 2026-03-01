import React from 'react';
import { 
  Database, 
  History, 
  LogOut, 
  Download, 
  MessageSquarePlus,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useConnection } from '../context/ConnectionContext';
import { HistoryItem } from '../types';
import api from '../services/api';
import { Link } from 'react-router-dom';

interface SidebarProps {
  history: HistoryItem[];
  onHistoryClick: (item: HistoryItem,index: number) => void;
  onNewChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ history, onHistoryClick }) => {
  const { connection, setConnection } = useConnection();

  /* ---------------- CSV DOWNLOAD ---------------- */

  const downloadCSV = async () => {
    try {
      const res = await api.get('/download/csv', {
        responseType: 'blob'
      });

      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'NLDB_Query_Report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      alert("No query history found for this session.");
      console.error(err);
    }
  };

  /* ---------------- LOGOUT ---------------- */

  const handleLogout = async () => {
    try {
      await api.post('/logout');

      // Clear frontend connection state
      setConnection({
        isConnected: false,
        databaseName: null
      });

      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
      alert("Logout failed. Try again.");
    }
  };

  return (
    <aside className="w-80 bg-slate-900 text-white flex flex-col h-screen border-r border-slate-800">

      {/* HEADER */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">MongoAI</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              Natural Language DB
            </p>
          </div>
        </div>

        {/* ACTIVE DB */}
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">
            Active Database
          </p>
          <p className="text-sm font-medium text-slate-200 truncate">
            {connection.databaseName || 'Not Connected'}
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">

        {/* NEW QUERY */}
      { /* <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-900/20"
        >
          <MessageSquarePlus size={18} />
          New Query
        </button>*/}

        {/* HISTORY */}
        <Link to="/insights" className="sidebar-item">
  <Sparkles size={18} />
  Database Insights
</Link>
        <div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4 px-2">
            <History size={12} />
            Recent Queries
          </div>

          <div className="space-y-1">
            {history.length === 0 ? (
              <p className="text-xs text-slate-600 px-2 italic">No queries yet</p>
            ) : (
              history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onHistoryClick(item)}
                  className="w-full text-left p-3 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span className="truncate pr-2">{item.question}</span>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))
            )}
          </div>
        </div>

      </div>

      {/* FOOTER ACTIONS */}
      <div className="p-4 border-t border-slate-800 space-y-2">

        {/* DOWNLOAD */}
        <button 
          onClick={downloadCSV}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Download size={18} />
          Download Audit Report
        </button>

        {/* LOGOUT */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
        >
          <LogOut size={18} />
          Disconnect & Logout
        </button>

      </div>
    </aside>
  );
};