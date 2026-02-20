'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Decision, Score } from '@/lib/decision-engine';
import { ChevronRight } from 'lucide-react';

interface ScoringMatrixProps {
  decision: Decision;
  onScoresChange: (scores: Score[]) => void;
  onAnalyze: () => void;
}

export function ScoringMatrix({ decision, onScoresChange, onAnalyze }: ScoringMatrixProps) {
  const handleScoreChange = (optionId: string, criterionId: string, value: string) => {
    const score = Number(value);
    if (score >= 0 && score <= 10) {
      const newScores = decision.scores.filter(
        (s) => !(s.optionId === optionId && s.criterionId === criterionId)
      );
      newScores.push({ optionId, criterionId, score });
      onScoresChange(newScores);
    }
  };

  const getScore = (optionId: string, criterionId: string) => {
    return (
      decision.scores.find((s) => s.optionId === optionId && s.criterionId === criterionId)
        ?.score || ''
    );
  };

  const isScoringComplete =
    decision.options.length > 0 &&
    decision.criteria.length > 0 &&
    decision.options.every((option) =>
      decision.criteria.every(
        (criterion) =>
          getScore(option.id, criterion.id) !== ''
      )
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Options</CardTitle>
        <CardDescription>Rate each option for every criterion (0-10 scale)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-2 px-4 font-semibold text-sm">Option</th>
                {decision.criteria.map((criterion) => (
                  <th key={criterion.id} className="text-left py-2 px-4 font-semibold text-sm">
                    <div>{criterion.name}</div>
                    <div className="text-xs font-normal text-muted-foreground">{criterion.weight}%</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {decision.options.map((option) => (
                <tr key={option.id} className="border-t">
                  <td className="py-4 px-4 font-medium">{option.name}</td>
                  {decision.criteria.map((criterion) => (
                    <td key={criterion.id} className="py-4 px-4">
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        placeholder="0-10"
                        value={getScore(option.id, criterion.id)}
                        onChange={(e) =>
                          handleScoreChange(option.id, criterion.id, e.target.value)
                        }
                        className="w-20 text-center"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-900 dark:text-blue-100">
          <p>
            <strong>Scoring tip:</strong> Rate each option 1-10 for how well it meets each criterion. 
            1 = poor, 10 = excellent. The system will calculate weighted scores automatically.
          </p>
        </div>

        <Button
          onClick={onAnalyze}
          disabled={!isScoringComplete}
          className="w-full"
        >
          Analyze Results
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
