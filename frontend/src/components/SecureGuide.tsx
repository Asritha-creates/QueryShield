import React, { useState } from "react";
import {
  ShieldCheck,
  Database,
  Key,
  Globe,
  Copy,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  X,
  Maximize2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const SecureGuide: React.FC = () => {
  const [openStep, setOpenStep] = useState<number | null>(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const steps = [
    {
      icon: <Database className="w-5 h-5 text-emerald-500" />,
      title: "Open MongoDB Atlas",
      desc: "Go to https://cloud.mongodb.com and sign in to your MongoDB account.",
      image: "/step-1.png",
    },
    {
      icon: <Key className="w-5 h-5 text-emerald-500" />,
      title: "Create Database User (Read-Only)",
      desc: "Security → Database Access → Add New Database User → Choose Password authentication.",
      image: "/step-2.png",
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      title: "Set Correct Role",
      desc: "VERY IMPORTANT: Select role 'Read Only (readAnyDatabase)'. DO NOT choose Atlas Admin.",
      image: "/step-3.png",
    },
    {
      icon: <Globe className="w-5 h-5 text-emerald-500" />,
      title: "Allow Network Access",
      desc: "Security → Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0).",
      image: "/step-4.png",
    },
    {
      icon: <Copy className="w-5 h-5 text-emerald-500" />,
      title: "Copy Connection String",
      desc: "Clusters → Connect → Drivers → Node.js → Copy URI. Replace <password> and ADD your database name at the end.",
      image: "/step-5.png",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-4xl mx-auto relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-50 rounded-lg">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">
          Secure MongoDB Connection Guide
        </h2>
      </div>

      {/* Privacy Notice */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-5">
        <p className="text-sm text-emerald-800 leading-relaxed">
          <strong>Privacy First:</strong> We NEVER store your database password.
          The connection exists only during your session and is destroyed on logout.
        </p>
      </div>

      {/* Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-amber-800 leading-relaxed">
          <strong>Important:</strong> Do NOT use an Admin database user.
          Only a Read-Only user is allowed to prevent accidental data modification.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, idx) => {
          const isOpen = openStep === idx;

          return (
            <motion.div
              key={idx}
              layout
              className="border border-slate-200 rounded-xl overflow-hidden"
            >
              {/* Step Header */}
              <button
                onClick={() => setOpenStep(isOpen ? null : idx)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition text-left"
              >
                <div className="flex items-center gap-3">
                  {step.icon}
                  <h3 className="text-sm font-medium text-slate-900">
                    {idx + 1}. {step.title}
                  </h3>
                </div>

                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {/* Animated Content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 pb-5 pt-2"
                  >
                    <p className="text-sm text-slate-600 mb-4">
                      {step.desc}
                    </p>

                    {/* Screenshot with Preview Trigger */}
                    <div className="relative group cursor-zoom-in" onClick={() => setSelectedImage(step.image)}>
                      <img
                        src={step.image}
                        alt={step.title}
                        onError={(e) => {
                          e.currentTarget.src = "https://picsum.photos/seed/mongo/800/400?blur=10";
                        }}
                        className="w-full max-h-64 object-cover rounded-lg border border-slate-200 shadow-sm transition-transform duration-300 group-hover:scale-[1.01]"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-lg flex items-center justify-center">
                        <div className="bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <Maximize2 className="w-4 h-4 text-slate-600" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Security Checklist */}
      <div className="pt-6 mt-6 border-t border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          Security Checklist
        </h3>

        <ul className="text-xs text-slate-600 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500">•</span>
            Only Read-Only users are accepted
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500">•</span>
            Only find / aggregate / count queries are allowed
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500">•</span>
            No insert, update, or delete operations are possible
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500">•</span>
            Session expires automatically after 30 minutes
          </li>
        </ul>
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-md z-10 transition-colors"
              >
                <X className="w-5 h-5 text-slate-900" />
              </button>
              <img
                src={selectedImage}
                alt="Step Preview"
                className="w-full h-auto max-h-[85vh] object-contain"
                onError={(e) => {
                  e.currentTarget.src = "https://picsum.photos/seed/mongo/1200/800";
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
