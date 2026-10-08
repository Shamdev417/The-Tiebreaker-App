import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DecisionInputForm } from './components/DecisionInputForm';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { HistoryDrawer } from './components/HistoryDrawer';
import { TemplatesModal } from './components/TemplatesModal';
import { DeepDiveModal } from './components/DeepDiveModal';
import { ShareExportModal } from './components/ShareExportModal';
import { DecisionRecord, DecisionAnalysisData } from './types/decision';
import { DecisionTemplate } from './data/templates';
import { AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'the_tiebreaker_saved_decisions_v1';

export default function App() {
  const [currentDecisionTitle, setCurrentDecisionTitle] = useState<string>('');
  const [currentAnalysis, setCurrentAnalysis] = useState<DecisionAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Modals & Drawers
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DecisionTemplate | null>(null);

  // Persistent History
  const [savedDecisions, setSavedDecisions] = useState<DecisionRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDecisions));
    } catch (e) {
      console.error('Failed to persist history to localStorage', e);
    }
  }, [savedDecisions]);

  const handleAnalyze = async (payload: {
    decision: string;
    options: string[];
    context: string;
    priorities: string[];
    riskTolerance: 'low' | 'moderate' | 'high';
    timeHorizon: 'short' | 'medium' | 'long';
  }) => {
    setIsLoading(true);
    setAnalysisError(null);
    setCurrentDecisionTitle(payload.decision);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.success && json.data) {
        const analysisData: DecisionAnalysisData = json.data;
        setCurrentAnalysis(analysisData);

        // Save to persistent history
        const newRecord: DecisionRecord = {
          id: `dec-${Date.now()}`,
          title: payload.decision,
          options: payload.options,
          context: payload.context,
          priorities: payload.priorities,
          riskTolerance: payload.riskTolerance,
          timeHorizon: payload.timeHorizon,
          createdAt: new Date().toISOString(),
          analysis: analysisData,
        };

        setSavedDecisions((prev) => [newRecord, ...prev]);
      } else {
        throw new Error(json.error || 'Failed to synthesize decision analysis.');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setAnalysisError(
        err.message || 'An error occurred during analysis. Please check your inputs and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewDecision = () => {
    setCurrentAnalysis(null);
    setCurrentDecisionTitle('');
    setSelectedTemplate(null);
    setAnalysisError(null);
  };

  const handleSelectSaved = (record: DecisionRecord) => {
    setCurrentDecisionTitle(record.title);
    setCurrentAnalysis(record.analysis);
  };

  const handleDeleteDecision = (id: string) => {
    setSavedDecisions((prev) => prev.filter((d) => d.id !== id));
  };

  const handleClearAllHistory = () => {
    if (confirm('Clear all saved decisions?')) {
      setSavedDecisions([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Top Navigation */}
      <Header
        onNewDecision={handleNewDecision}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        savedCount={savedDecisions.length}
        hasActiveDecision={Boolean(currentAnalysis)}
      />

      {/* Main Body */}
      <main className="flex-1">
        {analysisError && !currentAnalysis && (
          <div className="max-w-4xl mx-auto px-4 mt-6">
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-300 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
              <span>{analysisError}</span>
            </div>
          </div>
        )}

        {!currentAnalysis ? (
          <DecisionInputForm
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            initialTemplate={selectedTemplate}
          />
        ) : (
          <AnalysisDashboard
            decisionTitle={currentDecisionTitle}
            analysis={currentAnalysis}
            onAnalysisUpdate={setCurrentAnalysis}
            onBackToInput={() => setCurrentAnalysis(null)}
            onOpenDeepDive={() => setIsDeepDiveOpen(true)}
            onOpenExport={() => setIsExportOpen(true)}
          />
        )}
      </main>

      {/* Modals & Overlays */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedDecisions={savedDecisions}
        onSelectDecision={handleSelectSaved}
        onDeleteDecision={handleDeleteDecision}
        onClearAll={handleClearAllHistory}
      />

      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={(tpl) => {
          setSelectedTemplate(tpl);
          setCurrentAnalysis(null);
        }}
      />

      {currentAnalysis && (
        <>
          <DeepDiveModal
            isOpen={isDeepDiveOpen}
            onClose={() => setIsDeepDiveOpen(false)}
            decisionTitle={currentDecisionTitle}
            analysis={currentAnalysis}
          />

          <ShareExportModal
            isOpen={isExportOpen}
            onClose={() => setIsExportOpen(false)}
            decisionTitle={currentDecisionTitle}
            analysis={currentAnalysis}
          />
        </>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>The Tiebreaker — Decision Intelligence Platform</span>
          <span>Pros & Cons • Weighted Comparison • SWOT Analysis • AI Verdict</span>
        </div>
      </footer>
    </div>
  );
}
