import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Database, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { SecureGuide } from '../components/SecureGuide';
import { useConnection } from '../context/ConnectionContext';
import api from '../services/api';
import { motion } from 'motion/react';

export const ConnectionPage: React.FC = () => {
  const [connectionString, setConnectionString] = useState('');
  const [dbName, setDbName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { setConnection } = useConnection();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setError(null);

    try {
      const response = await api.post('/create-connection', { connectionString, dbName });
      if (response.data.success) {
        setConnection({ isConnected: true, databaseName: dbName });
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Failed to connect to database');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during connection');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex-col lg:flex-row">
      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full"
        >
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Connect Database</h1>
            <p className="text-slate-500">Enter your MongoDB credentials to get started.</p>
          </div>

          <form onSubmit={handleConnect} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                Connection String
                <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded uppercase tracking-wider">Required</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={connectionString}
                  onChange={(e) => setConnectionString(e.target.value)}
                  placeholder="mongodb+srv://user:pass@cluster.mongodb.net/..."
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400">Example: mongodb+srv://readonly:password@cluster0.mongodb.net</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Database Name</label>
              <div className="relative">
                <Database className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                  placeholder="e.g. production_db"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-rose-700 text-sm"
              >
                <AlertCircle className="shrink-0 mt-0.5" size={18} />
                <p>{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isConnecting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Connecting...
                </>
              ) : (
                'Test & Connect'
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 text-xs">
            <ShieldCheck size={14} />
            Your connection is encrypted and password is never stored.
          </div>
        </motion.div>
      </div>

      {/* Guide Section */}
      <div className=" bg-white border-l border-slate-200 p-6 lg:p-12 overflow-y-auto">
        <SecureGuide />
      </div>
    </div>
  );
};
