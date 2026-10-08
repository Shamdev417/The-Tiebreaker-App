import React, { useState } from 'react';
import { 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  AlertOctagon, 
  Clock, 
  HelpCircle, 
  Coins, 
  ArrowRight,
  ShieldCheck,
  Check,
  RefreshCw,
  Lightbulb
} from 'lucide-react';
import { DecisionAnalysisData, TiebreakerVerdict } from '../types/decision';

interface VerdictViewProps {
  analysis: DecisionAnalysisData;
  onOpenDeepDive: () => void;
}

export const VerdictView: React.FC<VerdictViewProps> = ({ analysis, onOpenDeepDive }) => {
  const verdict = analysis.tiebreakerVerdict;
  const recommendedOpt = analysis.options.find((o) => o.id === verdict.recommendedOptionId) || analysis.options[0];

  // Checklist state
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // Coin toss interactive state
  const [isFlipping, setIsFlipping] = useState(false);
  const [coinResult, setCoinResult] = useState<string | null>(null);
  const [flipCount, setFlipCount] = useState(0);

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleCoinFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setCoinResult(null);

    setTimeout(() => {
      // Pick random option among first 2 options
      const optA = analysis.options[0]?.name || 'Heads';
      const optB = analysis.options[1]?.name || 'Tails';
      const chosen = Math.random() < 0.5 ? optA : optB;
      setCoinResult(chosen);
      setIsFlipping(false);
      setFlipCount((c) => c + 1);
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* 1. Master Tiebreaker Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-rose-950/60 border-2 border-indigo-500/40 p-6 sm:p-10 shadow-2xl shadow-indigo-950/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>The Tiebreaker Recommendation</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono">
              <span className="text-slate-400">Confidence:</span>
              <span className="text-emerald-400 font-bold">{verdict.confidencePercent}%</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-3">
            {verdict.headline}
          </h2>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 mb-6">
            <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-sm sm:text-base mb-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
              <span>Recommended Path: {recommendedOpt.name}</span>
            </div>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {verdict.coreReasoning}
            </p>
          </div>

          {/* Quick CTA to Ask Followup */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <span className="text-xs text-slate-400">
              Need to test a curveball or counter-argument?
            </span>
            <button
              onClick={onOpenDeepDive}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Deep Dive & What-If Inquiry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Conditional Decision Rules */}
      {verdict.conditionalRules?.length > 0 && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-white font-extrabold text-base mb-1">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <span>Conditional Verdicts (If-Then Decision Rules)</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            If your circumstances tilt strongly in one dimension, here is how the recommendation pivots:
          </p>

          <div className="space-y-3">
            {verdict.conditionalRules.map((rule, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-slate-200">
                    {rule.condition}
                  </div>
                  <div className="text-xs text-slate-400">{rule.rationale}</div>
                </div>
                <div className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold text-xs">
                  ➔ Choose: {rule.chooseOption}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Two Column: Devil's Advocate & The 10/10/10 Rule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Devil's Advocate */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-950/20 to-slate-900 border border-rose-500/30">
          <div className="flex items-center gap-2 text-rose-400 font-extrabold text-base mb-2">
            <AlertOctagon className="w-5 h-5" />
            <span>Devil's Advocate & Blindspot Check</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            The hidden psychological trap, optimistic bias, or critical risk you might be glossing over:
          </p>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-rose-500/20 text-rose-100 text-sm leading-relaxed">
            {verdict.devilsAdvocate}
          </div>
        </div>

        {/* 10 / 10 / 10 Rule */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/20 to-slate-900 border border-indigo-500/30">
          <div className="flex items-center gap-2 text-indigo-300 font-extrabold text-base mb-2">
            <Clock className="w-5 h-5" />
            <span>The 10 / 10 / 10 Rule (Suzy Welch Framework)</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            How will you feel about this decision across different time horizons?
          </p>
          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="font-bold text-amber-400 block mb-0.5">In 10 Minutes:</span>
              <span className="text-slate-300">{verdict.tenTenTen?.tenMinutes}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="font-bold text-sky-400 block mb-0.5">In 10 Months:</span>
              <span className="text-slate-300">{verdict.tenTenTen?.tenMonths}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="font-bold text-emerald-400 block mb-0.5">In 10 Years:</span>
              <span className="text-slate-300">{verdict.tenTenTen?.tenYears}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Actionable De-Risking Checklist */}
      {verdict.deRiskingSteps?.length > 0 && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-white font-extrabold text-base mb-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Reversible Experiments & De-risking Checklist</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Actions to take before locking in 100% commitment:
          </p>
          <div className="space-y-2.5">
            {verdict.deRiskingSteps.map((step, idx) => {
              const isDone = completedSteps[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    isDone
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-950/50 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950'
                        : 'border border-slate-600 bg-slate-900 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className={`text-sm ${isDone ? 'line-through text-slate-400' : ''}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. The 51/49 Coin Flip Gut Check */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/20 via-slate-900 to-indigo-950/20 border border-amber-500/30 text-center">
        <div className="max-w-md mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>The Subconscious Gut Check</span>
          </div>
          <h3 className="text-xl font-extrabold text-white mb-2">
            Still Hesitating? Flip The Tiebreaker Coin
          </h3>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Psychology fact: When you flip a coin to decide, your subconscious will secretly hope it lands on one particular side while it's in the air. That hope is your true gut answer.
          </p>

          {/* Interactive Coin Button */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div
              className={`w-28 h-28 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 text-slate-950 font-black text-xs uppercase flex flex-col items-center justify-center shadow-xl shadow-amber-500/20 border-4 border-amber-300 transition-all cursor-pointer ${
                isFlipping ? 'animate-bounce scale-110 rotate-180' : 'hover:scale-105 active:scale-95'
              }`}
              onClick={handleCoinFlip}
            >
              <Coins className="w-7 h-7 mb-1 text-amber-900" />
              <span>{isFlipping ? 'Spinning...' : 'Flip Coin'}</span>
            </div>

            {coinResult && !isFlipping && (
              <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-amber-500/40 animate-fade-in">
                <span className="text-xs text-slate-400 block">The coin landed on:</span>
                <span className="text-lg font-black text-amber-300 block mt-0.5">
                  {coinResult}
                </span>
                <p className="text-xs text-slate-300 mt-2 font-medium">
                  <strong>The Gut Question:</strong> Did you feel relieved or slightly disappointed when you saw that result? If you felt disappointed, pick the other option!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
