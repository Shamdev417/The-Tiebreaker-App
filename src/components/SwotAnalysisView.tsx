import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  Zap, 
  Layers, 
  ArrowRight,
  Target
} from 'lucide-react';
import { OptionModel, SwotCrossAnalysis } from '../types/decision';

interface SwotAnalysisViewProps {
  options: OptionModel[];
  crossAnalysis?: SwotCrossAnalysis;
}

export const SwotAnalysisView: React.FC<SwotAnalysisViewProps> = ({
  options,
  crossAnalysis,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(options[0]?.id || '');
  const activeOption = options.find((o) => o.id === selectedOptionId) || options[0];

  const swot = activeOption?.swot || {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
  };

  return (
    <div className="space-y-8">
      {/* Option Selector */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        {options.map((opt, idx) => {
          const isSelected = opt.id === activeOption?.id;
          return (
            <button
              key={opt.id}
              onClick={() => setSelectedOptionId(opt.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/80'
              }`}
            >
              <span className="w-5 h-5 rounded-md bg-white/20 text-xs flex items-center justify-center font-bold">
                {String.fromCharCode(65 + idx)}
              </span>
              <span>{opt.name}</span>
            </button>
          );
        })}
      </div>

      {/* 2x2 SWOT Grid */}
      <div>
        <div className="mb-4">
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span>SWOT Strategic Matrix for</span>
            <span className="text-indigo-400">{activeOption.name}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Internal factors (Strengths & Weaknesses) versus external dynamics (Opportunities & Threats).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/20 to-slate-900 border border-emerald-500/30 shadow-lg shadow-emerald-950/10">
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-base mb-3 pb-2 border-b border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
              <span>Strengths (Internal Advantages)</span>
            </div>
            <ul className="space-y-2.5 text-sm">
              {swot.strengths.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/20 to-slate-900 border border-amber-500/30 shadow-lg shadow-amber-950/10">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-base mb-3 pb-2 border-b border-amber-500/20">
              <AlertTriangle className="w-5 h-5" />
              <span>Weaknesses (Internal Vulnerabilities)</span>
            </div>
            <ul className="space-y-2.5 text-sm">
              {swot.weaknesses.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    !
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-950/20 to-slate-900 border border-sky-500/30 shadow-lg shadow-sky-950/10">
            <div className="flex items-center gap-2 text-sky-400 font-extrabold text-base mb-3 pb-2 border-b border-sky-500/20">
              <TrendingUp className="w-5 h-5" />
              <span>Opportunities (External Tailwinds)</span>
            </div>
            <ul className="space-y-2.5 text-sm">
              {swot.opportunities.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    ↗
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Threats */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/20 to-slate-900 border border-rose-500/30 shadow-lg shadow-rose-950/10">
            <div className="flex items-center gap-2 text-rose-400 font-extrabold text-base mb-3 pb-2 border-b border-rose-500/20">
              <Zap className="w-5 h-5" />
              <span>Threats (External Headwinds & Risks)</span>
            </div>
            <ul className="space-y-2.5 text-sm">
              {swot.threats.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    ✕
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* TOWS Strategic Synthesis */}
      {crossAnalysis && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-lg">
            <Layers className="w-5 h-5" />
            <span>Cross-SWOT Tactical Playbook (TOWS Synthesis)</span>
          </div>
          <p className="text-xs text-slate-400">
            Actionable strategies synthesized by interconnecting strengths, vulnerabilities, opportunities, and risks.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                SO Strategies (Offensive Growth)
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {crossAnalysis.soStrategies.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h5 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                WO Strategies (Pivot & Upgrade)
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {crossAnalysis.woStrategies.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-sky-500 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                ST Strategies (Shield With Strengths)
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {crossAnalysis.stStrategies.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h5 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                WT Strategies (Risk Minimization)
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {crossAnalysis.wtStrategies.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
