import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Compass, 
  Clock, 
  Shield, 
  Lightbulb, 
  Check, 
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { DECISION_TEMPLATES, DecisionTemplate } from '../data/templates';

interface DecisionInputFormProps {
  onAnalyze: (payload: {
    decision: string;
    options: string[];
    context: string;
    priorities: string[];
    riskTolerance: 'low' | 'moderate' | 'high';
    timeHorizon: 'short' | 'medium' | 'long';
  }) => void;
  isLoading: boolean;
  initialTemplate?: DecisionTemplate | null;
}

const COMMON_PRIORITIES = [
  'Financial Upside',
  'Work-Life Balance',
  'Career Acceleration',
  'Peace of Mind',
  'Flexibility & Autonomy',
  'Family & Community',
  'Learning Curve',
  'Long-Term Equity',
];

export const DecisionInputForm: React.FC<DecisionInputFormProps> = ({
  onAnalyze,
  isLoading,
  initialTemplate,
}) => {
  const [decision, setDecision] = useState(initialTemplate?.title || '');
  const [options, setOptions] = useState<string[]>(
    initialTemplate?.options || ['Option A: ', 'Option B: ']
  );
  const [context, setContext] = useState(initialTemplate?.context || '');
  const [priorities, setPriorities] = useState<string[]>(
    initialTemplate?.priorities || ['Financial Upside', 'Work-Life Balance']
  );
  const [newPriorityInput, setNewPriorityInput] = useState('');
  const [riskTolerance, setRiskTolerance] = useState<'low' | 'moderate' | 'high'>(
    initialTemplate?.riskTolerance || 'moderate'
  );
  const [timeHorizon, setTimeHorizon] = useState<'short' | 'medium' | 'long'>(
    initialTemplate?.timeHorizon || 'medium'
  );
  const [error, setError] = useState<string | null>(null);

  // Sync if template changes from outside
  React.useEffect(() => {
    if (initialTemplate) {
      setDecision(initialTemplate.title);
      setOptions(initialTemplate.options);
      setContext(initialTemplate.context);
      setPriorities(initialTemplate.priorities);
      setRiskTolerance(initialTemplate.riskTolerance);
      setTimeHorizon(initialTemplate.timeHorizon);
    }
  }, [initialTemplate]);

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, `Option ${String.fromCharCode(65 + options.length)}: `]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const updated = options.filter((_, i) => i !== index);
      setOptions(updated);
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const togglePriority = (p: string) => {
    if (priorities.includes(p)) {
      setPriorities(priorities.filter((item) => item !== p));
    } else {
      setPriorities([...priorities, p]);
    }
  };

  const handleAddCustomPriority = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPriorityInput.trim() && !priorities.includes(newPriorityInput.trim())) {
      setPriorities([...priorities, newPriorityInput.trim()]);
      setNewPriorityInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!decision.trim()) {
      setError('Please state the decision or dilemma you are facing.');
      return;
    }

    const validOptions = options.map((o) => o.trim()).filter((o) => o.length > 0);
    if (validOptions.length < 2) {
      setError('Please provide at least 2 distinct options to compare.');
      return;
    }

    onAnalyze({
      decision: decision.trim(),
      options: validOptions,
      context: context.trim(),
      priorities,
      riskTolerance,
      timeHorizon,
    });
  };

  const loadPreset = (t: DecisionTemplate) => {
    setDecision(t.title);
    setOptions(t.options);
    setContext(t.context);
    setPriorities(t.priorities);
    setRiskTolerance(t.riskTolerance);
    setTimeHorizon(t.timeHorizon);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Hero Intro */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Multivariate AI Decision Frameworks</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Resolve Tough Dilemmas with{' '}
          <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400 bg-clip-text text-transparent">
            The Tiebreaker
          </span>
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
          Input your options and constraints. Receive comprehensive Pros & Cons, an MCDA Weighted Comparison Table, a SWOT Matrix, and a decisive AI verdict.
        </p>

        {/* Quick starter presets bar */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Quick examples:
          </span>
          {DECISION_TEMPLATES.slice(0, 3).map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => loadPreset(template)}
              className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-300 hover:text-white transition-all text-xs"
            >
              {template.title.length > 35 ? template.title.slice(0, 35) + '...' : template.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/20"
      >
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {/* 1. Dilemma Question */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-200 mb-2">
            What decision do you need to make? <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            placeholder="e.g., Should I join an early-stage startup or stay in my stable corporate role?"
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-base"
            disabled={isLoading}
          />
          <p className="mt-1.5 text-xs text-slate-400">
            Be as specific as you like; mention what is at stake.
          </p>
        </div>

        {/* 2. Options List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-slate-200">
              Competing Options <span className="text-rose-400">*</span>
            </label>
            <span className="text-xs text-slate-400 font-medium">
              {options.length}/5 options
            </span>
          </div>

          <div className="space-y-3">
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-indigo-400 flex-shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + idx)} title`}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  disabled={isLoading}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Remove option"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {options.length < 5 && (
            <button
              type="button"
              onClick={handleAddOption}
              disabled={isLoading}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Option</span>
            </button>
          )}
        </div>

        {/* 3. Context & Constraints */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-200 mb-2">
            Context, Numbers & Constraints <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            rows={3}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g., Financial details (current salary vs offer, savings cushion), family obligations, deadline (must decide by Friday), non-negotiable requirements..."
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none"
            disabled={isLoading}
          />
        </div>

        {/* 4. Priorities & Core Values */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-200 mb-2">
            What matters most to you? <span className="text-slate-400 font-normal">(Select or add priorities)</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {COMMON_PRIORITIES.map((p) => {
              const active = priorities.includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePriority(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                  disabled={isLoading}
                >
                  {active && <Check className="w-3 h-3 text-white" />}
                  <span>{p}</span>
                </button>
              );
            })}
          </div>

          {/* Add custom priority tag */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newPriorityInput}
              onChange={(e) => setNewPriorityInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomPriority(e);
                }
              }}
              placeholder="Add custom priority (e.g. Remote work, Prestige)..."
              className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleAddCustomPriority}
              disabled={isLoading || !newPriorityInput.trim()}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold disabled:opacity-50 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* 5. Strategy Parameters: Risk Tolerance & Time Horizon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 pt-4 border-t border-slate-800">
          <div>
            <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              Risk Tolerance
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'moderate', 'high'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setRiskTolerance(level)}
                  className={`py-2 px-1 text-center rounded-lg text-xs font-semibold capitalize transition-all ${
                    riskTolerance === level
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700'
                  }`}
                  disabled={isLoading}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Evaluation Time Horizon
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { key: 'short', label: '3-6 Mo' },
                  { key: 'medium', label: '1-3 Yr' },
                  { key: 'long', label: '5+ Yr' },
                ] as const
              ).map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTimeHorizon(key)}
                  className={`py-2 px-1 text-center rounded-lg text-xs font-semibold transition-all ${
                    timeHorizon === key
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700'
                  }`}
                  disabled={isLoading}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-xl font-bold text-white text-base sm:text-lg bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-400 hover:via-rose-400 hover:to-indigo-500 shadow-xl shadow-rose-950/40 hover:shadow-rose-900/60 transition-all flex items-center justify-center gap-2 group disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Synthesizing Decision Frameworks...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
              <span>Break The Tie With AI</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
