import React, { useState } from 'react';
import { 
  Plus, 
  Check, 
  Trash2, 
  EyeOff, 
  Eye, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  Sparkles,
  Info
} from 'lucide-react';
import { OptionModel, ProConItem, ProConCategory } from '../types/decision';
import { calculateNetProConScore } from '../utils/decisionCalculations';

interface ProsConsViewProps {
  options: OptionModel[];
  onOptionsChange: (updatedOptions: OptionModel[]) => void;
}

const CATEGORIES: ProConCategory[] = ['Financial', 'Career', 'Lifestyle', 'Psychological', 'Strategic'];

export const ProsConsView: React.FC<ProsConsViewProps> = ({ options, onOptionsChange }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(options[0]?.id || '');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [newType, setNewType] = useState<'pro' | 'con'>('pro');
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState<ProConCategory>('Strategic');
  const [newImpact, setNewImpact] = useState<number>(3);
  const [showAddForm, setShowAddForm] = useState(false);

  const activeOption = options.find((o) => o.id === selectedOptionId) || options[0];

  const handleToggleItem = (optionId: string, itemId: string, isPro: boolean) => {
    const updated = options.map((opt) => {
      if (opt.id !== optionId) return opt;
      if (isPro) {
        return {
          ...opt,
          pros: opt.pros.map((p) => (p.id === itemId ? { ...p, disabled: !p.disabled } : p)),
        };
      } else {
        return {
          ...opt,
          cons: opt.cons.map((c) => (c.id === itemId ? { ...c, disabled: !c.disabled } : c)),
        };
      }
    });
    onOptionsChange(updated);
  };

  const handleImpactChange = (optionId: string, itemId: string, isPro: boolean, impact: number) => {
    const updated = options.map((opt) => {
      if (opt.id !== optionId) return opt;
      if (isPro) {
        return {
          ...opt,
          pros: opt.pros.map((p) => (p.id === itemId ? { ...p, impact } : p)),
        };
      } else {
        return {
          ...opt,
          cons: opt.cons.map((c) => (c.id === itemId ? { ...c, impact } : c)),
        };
      }
    });
    onOptionsChange(updated);
  };

  const handleDeleteItem = (optionId: string, itemId: string, isPro: boolean) => {
    const updated = options.map((opt) => {
      if (opt.id !== optionId) return opt;
      if (isPro) {
        return {
          ...opt,
          pros: opt.pros.filter((p) => p.id !== itemId),
        };
      } else {
        return {
          ...opt,
          cons: opt.cons.filter((c) => c.id !== itemId),
        };
      }
    });
    onOptionsChange(updated);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || !activeOption) return;

    const newItem: ProConItem = {
      id: `custom-${Date.now()}`,
      text: newText.trim(),
      category: newCategory,
      impact: newImpact,
      explanation: 'User added item',
      isCustom: true,
      disabled: false,
    };

    const updated = options.map((opt) => {
      if (opt.id !== activeOption.id) return opt;
      if (newType === 'pro') {
        return { ...opt, pros: [...opt.pros, newItem] };
      } else {
        return { ...opt, cons: [...opt.cons, newItem] };
      }
    });

    onOptionsChange(updated);
    setNewText('');
    setShowAddForm(false);
  };

  const filteredPros = (activeOption?.pros || []).filter(
    (p) => filterCategory === 'All' || p.category === filterCategory
  );
  const filteredCons = (activeOption?.cons || []).filter(
    (c) => filterCategory === 'All' || c.category === filterCategory
  );

  const scores = activeOption ? calculateNetProConScore(activeOption) : { prosSum: 0, consSum: 0, netScore: 0, prosCount: 0, consCount: 0 };

  return (
    <div className="space-y-6">
      {/* Option Selection Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {options.map((opt, idx) => {
            const isSelected = opt.id === activeOption?.id;
            const optScore = calculateNetProConScore(opt);
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
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${
                    optScore.netScore >= 0
                      ? isSelected
                        ? 'bg-emerald-500/30 text-emerald-200'
                        : 'bg-emerald-500/10 text-emerald-400'
                      : isSelected
                      ? 'bg-rose-500/30 text-rose-200'
                      : 'bg-rose-500/10 text-rose-400'
                  }`}
                >
                  {optScore.netScore > 0 ? `+${optScore.netScore}` : optScore.netScore}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          {['All', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterCategory === cat
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Score Card */}
      {activeOption && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">{activeOption.name}</h3>
              <span className="text-xs text-slate-400 font-mono">Net Score:</span>
              <span
                className={`text-base font-extrabold px-2.5 py-0.5 rounded-lg ${
                  scores.netScore > 0
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : scores.netScore < 0
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                {scores.netScore > 0 ? `+${scores.netScore}` : scores.netScore}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">{activeOption.summary}</p>
          </div>

          <div className="flex items-center gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl text-emerald-300">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="font-bold text-white">{scores.prosSum}</span> pts ({scores.prosCount} Pros)
              </div>
            </div>
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl text-rose-300">
              <TrendingDown className="w-4 h-4 text-rose-400" />
              <div>
                <span className="font-bold text-white">{scores.consSum}</span> pts ({scores.consCount} Cons)
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Factor</span>
            </button>
          </div>
        </div>
      )}

      {/* Add Custom Item Modal / Inline Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddItem}
          className="p-4 rounded-xl bg-slate-900 border border-indigo-500/30 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              Add Custom Consideration to {activeOption?.name}
            </span>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-700">
              <button
                type="button"
                onClick={() => setNewType('pro')}
                className={`flex-1 py-1 rounded text-xs font-bold transition-colors ${
                  newType === 'pro' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                + Pro
              </button>
              <button
                type="button"
                onClick={() => setNewType('con')}
                className={`flex-1 py-1 rounded text-xs font-bold transition-colors ${
                  newType === 'con' ? 'bg-rose-600 text-white' : 'text-slate-400'
                }`}
              >
                - Con
              </button>
            </div>

            <div className="sm:col-span-2">
              <input
                type="text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Factor description..."
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as ProConCategory)}
                className="w-1/2 px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={newImpact}
                onChange={(e) => setNewImpact(parseInt(e.target.value))}
                className="w-1/2 px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
              >
                <option value={1}>Impact 1</option>
                <option value={2}>Impact 2</option>
                <option value={3}>Impact 3</option>
                <option value={4}>Impact 4</option>
                <option value={5}>Impact 5</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newText.trim()}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold disabled:opacity-50"
            >
              Save Factor
            </button>
          </div>
        </form>
      )}

      {/* Split Columns: Pros vs Cons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pros Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
              <TrendingUp className="w-5 h-5" />
              <span>Pros & Advantages ({filteredPros.length})</span>
            </div>
            <span className="text-xs text-slate-400">Impact: 1 (Minor) to 5 (Critical)</span>
          </div>

          {filteredPros.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-500 text-sm">
              No pros found for the selected filter.
            </div>
          ) : (
            filteredPros.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  item.disabled
                    ? 'bg-slate-900/30 border-slate-800/60 opacity-50'
                    : 'bg-emerald-950/10 hover:bg-emerald-950/20 border-emerald-500/20 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {item.category}
                      </span>
                      {item.isCustom && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300">
                          Custom
                        </span>
                      )}
                      <h4
                        className={`text-sm font-bold ${
                          item.disabled ? 'text-slate-500 line-through' : 'text-slate-100'
                        }`}
                      >
                        {item.text}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">{item.explanation}</p>
                  </div>

                  {/* Impact Slider & Controls */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400 font-mono">Impact:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() =>
                              handleImpactChange(activeOption.id, item.id, true, lvl)
                            }
                            className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center transition-colors ${
                              item.impact >= lvl
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            +{lvl}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleItem(activeOption.id, item.id, true)}
                        className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs"
                        title={item.disabled ? 'Include in calculation' : 'Exclude from calculation'}
                      >
                        {item.disabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(activeOption.id, item.id, true)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 text-xs"
                        title="Delete factor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cons Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-rose-500/20">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
              <TrendingDown className="w-5 h-5" />
              <span>Cons & Drawbacks ({filteredCons.length})</span>
            </div>
            <span className="text-xs text-slate-400">Severity: 1 (Minor) to 5 (Fatal)</span>
          </div>

          {filteredCons.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-500 text-sm">
              No cons found for the selected filter.
            </div>
          ) : (
            filteredCons.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  item.disabled
                    ? 'bg-slate-900/30 border-slate-800/60 opacity-50'
                    : 'bg-rose-950/10 hover:bg-rose-950/20 border-rose-500/20 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {item.category}
                      </span>
                      {item.isCustom && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300">
                          Custom
                        </span>
                      )}
                      <h4
                        className={`text-sm font-bold ${
                          item.disabled ? 'text-slate-500 line-through' : 'text-slate-100'
                        }`}
                      >
                        {item.text}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">{item.explanation}</p>
                  </div>

                  {/* Impact Slider & Controls */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400 font-mono">Severity:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() =>
                              handleImpactChange(activeOption.id, item.id, false, lvl)
                            }
                            className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center transition-colors ${
                              item.impact >= lvl
                                ? 'bg-rose-500 text-white'
                                : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            -{lvl}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleItem(activeOption.id, item.id, false)}
                        className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs"
                        title={item.disabled ? 'Include in calculation' : 'Exclude from calculation'}
                      >
                        {item.disabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(activeOption.id, item.id, false)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 text-xs"
                        title="Delete factor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
