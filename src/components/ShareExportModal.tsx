import React, { useState } from 'react';
import { X, Copy, Check, Download, Share2, FileText } from 'lucide-react';
import { DecisionAnalysisData } from '../types/decision';
import { formatDecisionSummaryMarkdown } from '../utils/decisionCalculations';

interface ShareExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  decisionTitle: string;
  analysis: DecisionAnalysisData;
}

export const ShareExportModal: React.FC<ShareExportModalProps> = ({
  isOpen,
  onClose,
  decisionTitle,
  analysis,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const markdownContent = formatDecisionSummaryMarkdown(decisionTitle, analysis);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${decisionTitle.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_tiebreaker_report.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-400" />
            <h3 className="font-extrabold text-white text-lg">
              Export Decision Memo
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 my-3">
          Share your structured decision memo with team members, partners, or mentors formatted in clean Markdown.
        </p>

        {/* Preview Area */}
        <div className="flex-1 overflow-y-auto bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed max-h-72 my-2 select-all whitespace-pre-wrap">
          {markdownContent}
        </div>

        {/* Actions */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-end gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Download .md</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
