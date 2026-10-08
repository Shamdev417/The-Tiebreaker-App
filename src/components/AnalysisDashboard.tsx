import React, { useState } from 'react';
import { 
  Scale, 
  Table2, 
  Compass, 
  Zap, 
  Share2, 
  Sparkles, 
  ArrowLeft,
  Sliders,
  HelpCircle
} from 'lucide-react';
import { DecisionAnalysisData } from '../types/decision';
import { ProsConsView } from './ProsConsView';
import { ComparisonTableView } from './ComparisonTableView';
import { SwotAnalysisView } from './SwotAnalysisView';
import { VerdictView } from './VerdictView';

type FrameworkTab = 'proscons' | 'matrix' | 'swot' | 'verdict';

interface AnalysisDashboardProps {
  decisionTitle: string;
  analysis: DecisionAnalysisData;
  onAnalysisUpdate: (updated: DecisionAnalysisData) => void;
  onBackToInput: () => void;
  onOpenDeepDive: () => void;
  onOpenExport: () => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  decisionTitle,
  analysis,
  onAnalysisUpdate,
  onBackToInput,
  onOpenDeepDive,
  onOpenExport,
}) => {
  const [activeTab, setActiveTab] = useState<FrameworkTab>('verdict');

  const tabs = [
    {
      id: 'verdict' as FrameworkTab,
      label: 'The Tiebreaker Verdict',
      icon: Zap,
      badge: `${analysis.tiebreakerVerdict?.confidencePercent || 80}%`,
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
    {
      id: 'proscons' as FrameworkTab,
      label: 'Pros & Cons',
      icon: Scale,
      badge: `${analysis.options?.length || 2} paths`,
      badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    },
    {
      id: 'matrix' as FrameworkTab,
      label: 'Comparison Table',
      icon: Table2,
      badge: 'Weighted MCDA',
      badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    },
    {
      id: 'swot' as FrameworkTab,
      label: 'SWOT Analysis',
      icon: Compass,
      badge: '4 Quadrants',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToInput}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Modify Inputs</span>
            </button>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-indigo-400 font-mono">
              {analysis.options.length} Options Evaluated
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
            {decisionTitle}
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 max-w-3xl">
            {analysis.summary}
          </p>
        </div>

        {/* Global Utilities */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            onClick={onOpenDeepDive}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>What-If Deep Dive</span>
          </button>

          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export Memo</span>
          </button>
        </div>
      </div>

      {/* Framework Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/60">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-white shadow-md border border-slate-700 ring-1 ring-indigo-500/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? 'text-indigo-400' : 'text-slate-500'
                }`}
              />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-semibold border ${tab.badgeColor}`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="pt-2">
        {activeTab === 'verdict' && (
          <VerdictView
            analysis={analysis}
            onOpenDeepDive={onOpenDeepDive}
          />
        )}

        {activeTab === 'proscons' && (
          <ProsConsView
            options={analysis.options}
            onOptionsChange={(updated) =>
              onAnalysisUpdate({ ...analysis, options: updated })
            }
          />
        )}

        {activeTab === 'matrix' && (
          <ComparisonTableView
            analysis={analysis}
            onAnalysisChange={onAnalysisUpdate}
          />
        )}

        {activeTab === 'swot' && (
          <SwotAnalysisView
            options={analysis.options}
            crossAnalysis={analysis.swotCrossAnalysis}
          />
        )}
      </div>
    </div>
  );
};
