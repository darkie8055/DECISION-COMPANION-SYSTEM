'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { Decision, Score } from '@/lib/decision-engine';
import { ChevronRight, Zap, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface ScoringMatrixProps {
  decision: Decision;
  onScoresChange: (scores: Score[]) => void;
  onAnalyze: () => void;
}

export function ScoringMatrix({ decision, onScoresChange, onAnalyze }: ScoringMatrixProps) {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
  const handleScoreChange = (optionId: string, criterionId: string, value: number) => {
    const score = value;
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
        ?.score || 0
    );
  };

  const isScoringComplete =
    decision.options.length > 0 &&
    decision.criteria.length > 0 &&
    decision.options.every((option) =>
      decision.criteria.every(
        (criterion) =>
          getScore(option.id, criterion.id) !== 0
      )
    );

  const completionPercentage = Math.round(
    (decision.options.reduce((sum, option) => {
      return sum + decision.criteria.filter((c) => getScore(option.id, c.id) !== 0).length;
    }, 0) / (decision.options.length * decision.criteria.length)) * 100
  );

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Score Your Options
            </CardTitle>
            <CardDescription>Rate each option on every criterion (0-10 scale)</CardDescription>
          </div>
          <Badge variant="outline">{completionPercentage}% Complete</Badge>
        </div>
        <Progress value={completionPercentage} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2">
                <th className="text-left py-3 px-4 font-semibold">Option</th>
                {decision.criteria.map((criterion) => (
                  <th key={criterion.id} className="text-left py-3 px-4 font-semibold">
                    <div className="whitespace-nowrap">{criterion.name}</div>
                    <div className="text-xs font-normal text-muted-foreground mt-1">Weight: {criterion.weight}%</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {decision.options.map((option, idx) => (
                <tr key={option.id} className={idx !== decision.options.length - 1 ? 'border-b' : ''}>
                  <td className="py-4 px-4 font-semibold text-foreground whitespace-nowrap">{option.name}</td>
                  {decision.criteria.map((criterion) => {
                    const score = getScore(option.id, criterion.id);
                    return (
                      <td key={criterion.id} className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-xs">
                            <Slider
                              value={[score]}
                              onValueChange={(val) =>
                                handleScoreChange(option.id, criterion.id, val[0])
                              }
                              min={0}
                              max={10}
                              step={1}
                              className="w-full"
                            />
                          </div>
                          <div className="w-12 text-center">
                            <span className={`font-bold text-lg ${
                              score >= 8 ? 'text-green-600 dark:text-green-400' :
                              score >= 5 ? 'text-yellow-600 dark:text-yellow-400' :
                              score >= 1 ? 'text-orange-600 dark:text-orange-400' :
                              'text-muted-foreground'
                            }`}>
                              {score || '-'}
                            </span>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg text-sm">
          <div className="flex gap-2">
            <Zap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-primary mb-1">Smart Scoring Guide</p>
              <p className="text-muted-foreground text-xs">
                Use 1-3 for poor performance, 4-6 for average, 7-9 for good, and 10 for excellent. 
                The system calculates weighted scores based on your criteria weights.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={onAnalyze}
          disabled={!isScoringComplete}
          size="lg"
          className="w-full"
        >
          {isScoringComplete ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Analyze Results
            </>
          ) : (
            <>
              <ChevronRight className="w-4 h-4 mr-2" />
              Complete Scoring to Analyze
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
