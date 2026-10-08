import { DecisionAnalysisData, OptionModel } from '../types/decision';

export function calculateNetProConScore(option: OptionModel): {
  prosSum: number;
  consSum: number;
  netScore: number;
  prosCount: number;
  consCount: number;
} {
  const activePros = option.pros.filter((p) => !p.disabled);
  const activeCons = option.cons.filter((c) => !c.disabled);

  const prosSum = activePros.reduce((acc, curr) => acc + (curr.impact || 1), 0);
  const consSum = activeCons.reduce((acc, curr) => acc + (curr.impact || 1), 0);

  return {
    prosSum,
    consSum,
    netScore: prosSum - consSum,
    prosCount: activePros.length,
    consCount: activeCons.length,
  };
}

export interface OptionWeightedResult {
  optionId: string;
  optionName: string;
  totalWeightedScore: number;
  maxPossibleScore: number;
  scorePercentage: number;
}

export function calculateWeightedScores(
  analysis: DecisionAnalysisData,
  customWeights?: Record<string, number>
): OptionWeightedResult[] {
  const { options, comparisonMatrix } = analysis;
  if (!comparisonMatrix?.criteria || !comparisonMatrix?.scores) return [];

  const weights = customWeights || {};
  let totalWeightsSum = 0;

  comparisonMatrix.criteria.forEach((crit) => {
    const weight = weights[crit.id] ?? crit.weight ?? 3;
    totalWeightsSum += weight;
  });

  const maxPossible = totalWeightsSum * 10; // since max score per criterion is 10

  return options.map((option) => {
    let totalScore = 0;
    comparisonMatrix.criteria.forEach((crit) => {
      const weight = weights[crit.id] ?? crit.weight ?? 3;
      const cell = comparisonMatrix.scores?.[crit.id]?.[option.id];
      const rawScore = cell?.score ?? 5;
      totalScore += rawScore * weight;
    });

    const percentage = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;

    return {
      optionId: option.id,
      optionName: option.name,
      totalWeightedScore: totalScore,
      maxPossibleScore: maxPossible,
      scorePercentage: percentage,
    };
  }).sort((a, b) => b.totalWeightedScore - a.totalWeightedScore);
}

export function formatDecisionSummaryMarkdown(title: string, analysis: DecisionAnalysisData): string {
  let md = `# The Tiebreaker Decision Report: ${title}\n\n`;
  md += `> **Executive Summary:** ${analysis.summary}\n\n`;
  
  if (analysis.tiebreakerVerdict) {
    const v = analysis.tiebreakerVerdict;
    const recOpt = analysis.options.find(o => o.id === v.recommendedOptionId);
    md += `## ⚡ The Tiebreaker Verdict: ${v.headline}\n`;
    md += `**Recommended Path:** ${recOpt ? recOpt.name : v.recommendedOptionId} (${v.confidencePercent}% confidence)\n\n`;
    md += `${v.coreReasoning}\n\n`;
    
    if (v.conditionalRules?.length) {
      md += `### Conditional Logic\n`;
      v.conditionalRules.forEach(r => {
        md += `- **${r.condition}** ➔ **${r.chooseOption}** (${r.rationale})\n`;
      });
      md += `\n`;
    }

    if (v.devilsAdvocate) {
      md += `### ⚠️ Blindspot / Devil's Advocate\n${v.devilsAdvocate}\n\n`;
    }

    if (v.tenTenTen) {
      md += `### The 10/10/10 Rule\n`;
      md += `- **In 10 Minutes:** ${v.tenTenTen.tenMinutes}\n`;
      md += `- **In 10 Months:** ${v.tenTenTen.tenMonths}\n`;
      md += `- **In 10 Years:** ${v.tenTenTen.tenYears}\n\n`;
    }
  }

  md += `## ⚖️ Options Breakdown\n\n`;
  analysis.options.forEach((opt) => {
    md += `### ${opt.name}\n_${opt.summary}_\n\n`;
    md += `**Pros:**\n`;
    opt.pros.forEach(p => {
      md += `- [Impact: ${p.impact}/5] **${p.text}** (${p.category}): ${p.explanation}\n`;
    });
    md += `\n**Cons:**\n`;
    opt.cons.forEach(c => {
      md += `- [Severity: ${c.impact}/5] **${c.text}** (${c.category}): ${c.explanation}\n`;
    });
    md += `\n`;
  });

  return md;
}
