export interface Criterion {
  id: string;
  name: string;
  weight: number; // 0-100
}

export interface Option {
  id: string;
  name: string;
}

export interface Score {
  optionId: string;
  criterionId: string;
  score: number; // 0-10
}

export interface Decision {
  id: string;
  name: string;
  description: string;
  criteria: Criterion[];
  options: Option[];
  scores: Score[];
  createdAt: Date;
  updatedAt?: Date;
  category?: string;
  tags?: string[];
  confidence?: number; // User's confidence in the decision
  completionTime?: number; // Time taken to complete (milliseconds)
  savedAt?: Date;
}

export interface AnalysisResult {
  optionId: string;
  optionName: string;
  scores: { criterionName: string; score: number; weight: number }[];
  weightedScores: { criterionName: string; weighted: number }[];
  totalScore: number;
  percentage: number;
  rank: number;
}

export function calculateWeightedScore(
  option: Option,
  criteria: Criterion[],
  scores: Score[]
): AnalysisResult {
  const optionScores = criteria.map((criterion) => {
    const score = scores.find(
      (s) => s.optionId === option.id && s.criterionId === criterion.id
    );
    return {
      criterionName: criterion.name,
      score: score?.score || 0,
      weight: criterion.weight,
    };
  });

  const weightedScores = optionScores.map((item) => ({
    criterionName: item.criterionName,
    weighted: (item.score * item.weight) / 100,
  }));

  const totalScore = weightedScores.reduce((sum, item) => sum + item.weighted, 0);

  return {
    optionId: option.id,
    optionName: option.name,
    scores: optionScores,
    weightedScores,
    totalScore,
    percentage: (totalScore / 10) * 100,
    rank: 0, // Will be set after sorting
  };
}

export function analyzeDecision(decision: Decision): AnalysisResult[] {
  const results = decision.options.map((option) =>
    calculateWeightedScore(option, decision.criteria, decision.scores)
  );

  // Sort by total score and assign ranks
  results.sort((a, b) => b.totalScore - a.totalScore);
  results.forEach((result, index) => {
    result.rank = index + 1;
  });

  return results;
}

export function performSensitivityAnalysis(
  decision: Decision,
  criterionId: string,
  weightChanges: number[] // Array of weight values to test
): { weight: number; results: AnalysisResult[] }[] {
  const originalWeight = decision.criteria.find((c) => c.id === criterionId)?.weight || 0;
  const results: { weight: number; results: AnalysisResult[] }[] = [];

  weightChanges.forEach((newWeight) => {
    const modifiedDecision = {
      ...decision,
      criteria: decision.criteria.map((c) =>
        c.id === criterionId ? { ...c, weight: newWeight } : c
      ),
    };
    results.push({
      weight: newWeight,
      results: analyzeDecision(modifiedDecision),
    });
  });

  return results;
}
