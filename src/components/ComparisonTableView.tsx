import React, { useState } from 'react';
import { 
  Sliders, 
  Trophy, 
  RotateCcw, 
  Plus, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  BarChart2
} from 'lucide-react';
import { DecisionAnalysisData, MatrixCriterion } from '../types/decision';
import { calculateWeightedScores } from '../utils/decisionCalculations';

interface ComparisonTableViewProps {
  analysis: DecisionAnalysisData;
  onAnalysisChange: (updated: DecisionAnalysisData) => void;
}

export const ComparisonTableView: React.FC<ComparisonTableViewProps> = ({
  analysis,
  onAnalysisChange,
}) => {
  const [customWeights, setCustomWeights] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    analysis.comparisonMatrix?.criteria?.forEach((crit) => {
      initial[crit.id] = crit.weight;
    });
    return initial;
  });

  const [expandedRationale, setExpandedRationale] = useState<string | null>(null);
  const [showAddCriterion, setShowAddCriterion] = useState(false);
  const [newCritName, setNewCritName] = useState('');
  const [newCritDesc, setNewCritDesc] = useState('');

  const weightedResults = calculateWeightedScores(analysis, customWeights);
  const topOption = weightedResults[0];

  const handleWeightChange = (criterionId: string, newWeight: number) => {
    setCustomWeights((prev) => ({
      ...prev,
      [criterionId]: newWeight,
    }));
  };

  const handleResetWeights = () => {
    const reset: Record<string, number> = {};
    analysis.comparisonMatrix?.criteria?.forEach((crit) => {
      reset[crit.id] = crit.weight;
    });
    setCustomWeights(reset);
  };

  const handleScoreChange = (criterionId: string, optionId: string, delta: number) => {
    const current = analysis.comparisonMatrix.scores?.[criterionId]?.[optionId]?.score ?? 5;
    const newScore = Math.max(1, Math.min(10, current + delta));

    const updatedScores = {
      ...analysis.comparisonMatrix.scores,
      [criterionId]: {
        ...analysis.comparisonMatrix.scores[criterionId],
        [optionId]: {
          score: newScore,
          rationale: analysis.comparisonMatrix.scores[criterionId]?.[optionId]?.rationale || 'User adjusted score',
        },
      },
    };

    onAnalysisChange({
      ...analysis,
      comparisonMatrix: {
        ...analysis.comparisonMatrix,
        scores: updatedScores,
      },
    });
  };

  const handleAddCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCritName.trim()) return;

    const newId = `crit-${Date.now()}`;
    const newCriterion: MatrixCriterion = {
      id: newId,
      name: newCritName.trim(),
      weight: 3,
      description: newCritDesc.trim() || 'Custom evaluation criterion',
    };

    const newScoresForCrit: Record<string, { score: number; rationale: string }> = {};
    analysis.options.forEach((opt) => {
      newScoresForCrit[opt.id] = {
        score: 5,
        rationale: 'Baseline neutral rating for custom criterion',
      };
    });

    onAnalysisChange({
      ...analysis,
      comparisonMatrix: {
        criteria: [...analysis.comparisonMatrix.criteria, newCriterion],
        scores: {
          ...analysis.comparisonMatrix.scores,
          [newId]: newScoresForCrit,
        },
      },
    });

    setCustomWeights((prev) => ({ ...prev, [newId]: 3 }));
    setNewCritName('');
    setNewCritDesc('');
    setShowAddCriterion(false);
  };

  return (
    <div className="space-y-6">
      {/* Weighted Score Leaderboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {weightedResults.map((result, idx) => {
          const isWinner = idx === 0 && weightedResults.length > 1;
          return (
            <div
              key={result.optionId}
              className={`p-4 rounded-2xl border transition-all relative overflow-hidden ${
                isWinner
                  ? 'bg-gradient-to-br from-indigo-950/40 via-slate-900 to-indigo-900/30 border-indigo-500/50 shadow-lg shadow-indigo-950/40'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              {isWinner && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Leader</span>
                </div>
              )}

              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-indigo-400">
                  {String.fromCharCode(65 + idx)}
                </span>
                <h4 className="font-bold text-white text-sm sm:text-base truncate">
                  {result.optionName}
                </h4>
              </div>

              <div className="mt-3">
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-2xl font-black text-white font-mono">
                    {result.scorePercentage}%
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {result.totalWeightedScore} / {result.maxPossibleScore} pts
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isWinner
                        ? 'bg-gradient-to-r from-indigo-500 to-amber-400'
                        : 'bg-slate-600'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, result.scorePercentage))}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Control Bar: Reset weights & Add criteria */}
      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-slate-300">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span className="font-medium">
            Adjust weights (1x - 5x) to customize criteria importance for your life.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetWeights}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            title="Reset weights to AI recommendations"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Weights</span>
          </button>
          <button
            onClick={() => setShowAddCriterion(!showAddCriterion)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Criterion</span>
          </button>
        </div>
      </div>

      {/* Add Criterion Form */}
      {showAddCriterion && (
        <form
          onSubmit={handleAddCriterion}
          className="p-4 rounded-xl bg-slate-900 border border-indigo-500/30 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              Add New Evaluation Criterion
            </span>
            <button
              type="button"
              onClick={() => setShowAddCriterion(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={newCritName}
              onChange={(e) => setNewCritName(e.target.value)}
              placeholder="Criterion name (e.g., Commute Distance, Equity Upside)..."
              className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-indigo-500"
            />
            <input
              type="text"
              value={newCritDesc}
              onChange={(e) => setNewCritDesc(e.target.value)}
              placeholder="Why this matters to this decision..."
              className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newCritName.trim()}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold disabled:opacity-50"
            >
              Add to Matrix
            </button>
          </div>
        </form>
      )}

      {/* Full Comparison Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80 text-xs font-bold text-slate-300">
              <th className="py-4 px-4 w-1/3">Criteria & Importance Weight</th>
              {analysis.options.map((opt, i) => (
                <th key={opt.id} className="py-4 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-[11px] font-bold text-indigo-400">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-sm">
            {analysis.comparisonMatrix?.criteria?.map((crit) => {
              const weight = customWeights[crit.id] ?? crit.weight ?? 3;
              return (
                <tr key={crit.id} className="hover:bg-slate-850/40 transition-colors">
                  {/* Criterion column with slider */}
                  <td className="py-4 px-4 align-top">
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <span>{crit.name}</span>
                        <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {weight}x weight
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-snug">
                        {crit.description}
                      </p>

                      {/* Weight Selector */}
                      <div className="mt-2.5 flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-500">Weight:</span>
                        {[1, 2, 3, 4, 5].map((w) => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => handleWeightChange(crit.id, w)}
                            className={`w-6 h-6 rounded text-[11px] font-bold transition-all ${
                              weight === w
                                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/40 scale-105'
                                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                            }`}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>
                  </td>

                  {/* Options score columns */}
                  {analysis.options.map((opt) => {
                    const scoreObj = analysis.comparisonMatrix.scores?.[crit.id]?.[opt.id];
                    const rawScore = scoreObj?.score ?? 5;
                    const rationale = scoreObj?.rationale ?? 'Evaluated factor';
                    const rationaleKey = `${crit.id}-${opt.id}`;
                    const isExpanded = expandedRationale === rationaleKey;

                    return (
                      <td key={opt.id} className="py-4 px-4 align-top">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {/* Score Pill */}
                            <div
                              className={`px-3 py-1 rounded-xl font-mono font-bold text-sm flex items-center gap-1 ${
                                rawScore >= 8
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : rawScore >= 5
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              }`}
                            >
                              <span>{rawScore}</span>
                              <span className="text-[10px] text-slate-400 font-normal">/10</span>
                            </div>

                            {/* Fine-tune score buttons */}
                            <div className="flex items-center rounded-lg bg-slate-800 p-0.5 border border-slate-700">
                              <button
                                type="button"
                                onClick={() => handleScoreChange(crit.id, opt.id, -1)}
                                disabled={rawScore <= 1}
                                className="w-5 h-5 flex items-center justify-center text-xs text-slate-400 hover:text-white disabled:opacity-30"
                              >
                                -
                              </button>
                              <button
                                type="button"
                                onClick={() => handleScoreChange(crit.id, opt.id, 1)}
                                disabled={rawScore >= 10}
                                className="w-5 h-5 flex items-center justify-center text-xs text-slate-400 hover:text-white disabled:opacity-30"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* AI Rationale Snippet */}
                          <div className="text-xs text-slate-400">
                            <p className="line-clamp-2">{rationale}</p>
                            {rationale.length > 80 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedRationale(isExpanded ? null : rationaleKey)
                                }
                                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium mt-0.5 flex items-center gap-0.5"
                              >
                                {isExpanded ? 'Less' : 'More rationale'}
                              </button>
                            )}
                            {isExpanded && (
                              <div className="mt-1 p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs">
                                {rationale}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
