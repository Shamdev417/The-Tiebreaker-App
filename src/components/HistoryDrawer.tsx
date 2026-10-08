import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Calendar, 
  ArrowRight, 
  Scale, 
  Download, 
  Search, 
  Clock,
  Sparkles
} from 'lucide-react';
import { DecisionRecord } from '../types/decision';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: DecisionRecord[];
  onSelectDecision: (record: DecisionRecord) => void;
  onDeleteDecision: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  onSelectDecision,
  onDeleteDecision,
  onClearAll,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = savedDecisions.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-400" />
            <h3 className="font-extrabold text-white text-base">Decision History</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {savedDecisions.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search previous decisions..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedDecisions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm space-y-2">
              <Clock className="w-8 h-8 mx-auto text-slate-600" />
              <p>No saved decisions yet.</p>
              <p className="text-xs text-slate-600">
                Any decision you analyze is automatically preserved here.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              No decisions match "{search}"
            </div>
          ) : (
            filtered.map((record) => {
              const dateStr = new Date(record.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              const recOpt = record.analysis.options.find(
                (o) => o.id === record.analysis.tiebreakerVerdict?.recommendedOptionId
              );

              return (
                <div
                  key={record.id}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 transition-all group relative"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {dateStr}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDecision(record.id);
                      }}
                      className="text-slate-600 hover:text-rose-400 p-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete decision"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="font-bold text-white text-sm line-clamp-2 mb-2">
                    {record.title}
                  </h4>

                  {recOpt && (
                    <div className="mb-3 text-[11px] px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-semibold truncate">
                      Verdict: {recOpt.name}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-900">
                    <span>{record.options.length} options</span>
                    <button
                      onClick={() => {
                        onSelectDecision(record);
                        onClose();
                      }}
                      className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {savedDecisions.length > 0 && (
          <div className="p-4 border-t border-slate-800 flex justify-between items-center text-xs">
            <button
              onClick={onClearAll}
              className="text-slate-500 hover:text-rose-400 transition-colors"
            >
              Clear All History
            </button>
            <span className="text-slate-600">Saved in browser</span>
          </div>
        )}
      </div>
    </div>
  );
};
