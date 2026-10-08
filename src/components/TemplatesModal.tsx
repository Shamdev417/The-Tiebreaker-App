import React from 'react';
import { X, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { DECISION_TEMPLATES, DecisionTemplate } from '../data/templates';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: DecisionTemplate) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-white text-lg">
              Decision Dilemma Library
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 my-4">
          Select a high-stakes scenario below to load real-world context, constraints, and competing paths directly into The Tiebreaker.
        </p>

        <div className="space-y-3">
          {DECISION_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => {
                onSelectTemplate(tpl);
                onClose();
              }}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-950 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {tpl.category}
                </span>
                <span className="text-xs text-indigo-400 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity font-semibold">
                  <span>Load Dilemma</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                {tpl.title}
              </h4>

              <p className="text-xs text-slate-400 mt-1">{tpl.description}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {tpl.options.map((opt, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
