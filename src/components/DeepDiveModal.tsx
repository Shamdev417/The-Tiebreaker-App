import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  ShieldCheck, 
  ArrowRight, 
  HelpCircle,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { DeepDiveResult, DecisionAnalysisData } from '../types/decision';

interface DeepDiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  decisionTitle: string;
  analysis: DecisionAnalysisData;
}

export const DeepDiveModal: React.FC<DeepDiveModalProps> = ({
  isOpen,
  onClose,
  decisionTitle,
  analysis,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>('all');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DeepDiveResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const targetOpt = analysis.options.find((o) => o.id === selectedOptionId);

    try {
      const res = await fetch('/api/deep-dive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision: decisionTitle,
          optionName: targetOpt ? targetOpt.name : undefined,
          question: question.trim(),
          currentAnalysis: {
            recommended: analysis.tiebreakerVerdict?.recommendedOptionId,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || 'Failed to analyze what-if scenario.');
      }
    } catch (err: any) {
      setError(err?.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    'What is the worst-case scenario and how can I survive it?',
    'How should I counter-offer to negotiate away the main disadvantage?',
    'What if I make this choice and regret it after 6 months?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-extrabold text-lg">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>Deep Dive & What-If Analyzer</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAsk} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Focus on a specific option or entire decision:
            </label>
            <select
              value={selectedOptionId}
              onChange={(e) => setSelectedOptionId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">Entire Decision Overall</option>
              {analysis.options.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              What specific doubt, objection or "what-if" scenario do you have?
            </label>
            <textarea
              rows={2}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., What happens if the market crashes next year? How should I negotiate the compensation?"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Sample quick questions */}
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <HelpCircle className="w-3 h-3" /> Quick suggestions:
            </span>
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQuestion(q)}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Simulate Scenario with AI</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-6 space-y-4 pt-4 border-t border-slate-800 animate-fade-in">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                Strategic Insight
              </span>
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {result.insight}
              </p>
            </div>

            {/* Risk mitigations */}
            {result.riskMitigation?.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  Worst-Case Risk Mitigations
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {result.riskMitigation.map((m, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tactical moves */}
            {result.tacticalMoves?.length > 0 && (
              <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/30">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  Tactical Counter-Moves & Experiments
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {result.tacticalMoves.map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-sky-400 font-bold">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Verdict Impact */}
            {result.verdictImpact && (
              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200">
                <span className="font-bold text-white block mb-0.5">Tiebreaker Shift:</span>
                {result.verdictImpact}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
