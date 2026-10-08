export type ProConCategory = 'Financial' | 'Career' | 'Lifestyle' | 'Psychological' | 'Strategic';

export interface ProConItem {
  id: string;
  text: string;
  category: ProConCategory;
  impact: number; // 1 to 5
  explanation: string;
  isCustom?: boolean;
  disabled?: boolean;
}

export interface SwotData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface OptionModel {
  id: string;
  name: string;
  summary: string;
  pros: ProConItem[];
  cons: ProConItem[];
  swot: SwotData;
}

export interface CriterionScore {
  score: number; // 1 to 10
  rationale: string;
}

export interface MatrixCriterion {
  id: string;
  name: string;
  weight: number; // 1 to 5
  description: string;
}

export interface ComparisonMatrix {
  criteria: MatrixCriterion[];
  scores: Record<string, Record<string, CriterionScore>>; // criterionId -> optionId -> CriterionScore
}

export interface ConditionalRule {
  condition: string;
  chooseOption: string;
  rationale: string;
}

export interface SwotCrossAnalysis {
  soStrategies: string[];
  woStrategies: string[];
  stStrategies: string[];
  wtStrategies: string[];
}

export interface TiebreakerVerdict {
  recommendedOptionId: string;
  confidencePercent: number;
  headline: string;
  coreReasoning: string;
  conditionalRules: ConditionalRule[];
  devilsAdvocate: string;
  tenTenTen: {
    tenMinutes: string;
    tenMonths: string;
    tenYears: string;
  };
  deRiskingSteps: string[];
}

export interface DecisionAnalysisData {
  summary: string;
  options: OptionModel[];
  comparisonMatrix: ComparisonMatrix;
  swotCrossAnalysis: SwotCrossAnalysis;
  tiebreakerVerdict: TiebreakerVerdict;
}

export interface DecisionRecord {
  id: string;
  title: string;
  options: string[];
  context?: string;
  priorities?: string[];
  riskTolerance: 'low' | 'moderate' | 'high';
  timeHorizon: 'short' | 'medium' | 'long';
  createdAt: string;
  analysis: DecisionAnalysisData;
}

export interface DeepDiveResult {
  insight: string;
  riskMitigation: string[];
  tacticalMoves: string[];
  verdictImpact: string;
}
