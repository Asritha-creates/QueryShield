import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Loader2, Sparkles } from "lucide-react";

export const InsightsPage: React.FC = () => {

  const [insights, setInsights] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchInsights = async () => {
      try {
        const res = await api.post("/ai-insights");
        setInsights(res.data.insights);
      } catch (err) {
        setInsights("Failed to analyze database.");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();

  }, []);

  return (
    <div className="h-screen bg-slate-50 p-10">
      
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="text-indigo-600" />
          <h1 className="text-2xl font-bold text-slate-800">
            AI Database Analysis
          </h1>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-slate-500">
            <Loader2 className="animate-spin" />
            Analyzing database structure...
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg whitespace-pre-wrap leading-relaxed text-slate-700">
            {insights}
          </div>
        )}

      </div>
    </div>
  );
};