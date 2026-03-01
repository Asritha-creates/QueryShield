import React from 'react';
import { Link } from 'react-router-dom';
import { Database, MessageSquare, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Hero Section */}
      <div className="relative pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold mb-8 border border-indigo-100"
          >
            <Zap size={16} />
            AI-Powered MongoDB Interface
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8"
          >
            Talk to your data in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-600">
              Plain English.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Connect your MongoDB database securely and query it using natural language. 
            No SQL or MQL knowledge required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/connect"
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center gap-2 group"
            >
              Connect Database
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all"
            >
              How it works
            </a>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-indigo-400/10 blur-3xl rounded-full" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-emerald-400/10 blur-3xl rounded-full" />
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Secure by Design</h3>
              <p className="text-slate-600 leading-relaxed">
                We use read-only connections and never store your passwords. 
                Your data stays in your database.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Natural Language</h3>
              <p className="text-slate-600 leading-relaxed">
                Ask questions like "Show me users from New York" and get 
                instant results and the generated query.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                <Database size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Schema Aware</h3>
              <p className="text-slate-600 leading-relaxed">
                Our AI automatically understands your collection structure 
                and relationships to provide accurate results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
