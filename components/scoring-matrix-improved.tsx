'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { Decision, Score } from '@/lib/decision-engine';
import { ChevronRight, Zap, CheckCircle2, HelpCircle, Lightbulb, Target } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Help Section */}
      <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
            <Target className="w-5 h-5" />
            How to Score (It's Easy!)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-green-800 dark:text-green-200">
            <div>
              <strong>10/10:</strong> Perfect/Excellent
              <br />
              <span className="text-xs opacity-75">Best possible for this factor</span>
            </div>
            <div>
              <strong>7-8/10:</strong> Good/Very Good  
              <br />
              <span className="text-xs opacity-75">Meets your expectations well</span>
            </div>
            <div>
              <strong>4-6/10:</strong> Okay/Poor
              <br />
              <span className="text-xs opacity-75">Below expectations or concerns</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Score Your Options
              </CardTitle>
              <CardDescription>Rate each option on every criterion (0-10 scale)</CardDescription>
              <div className="mt-2 text-sm text-muted-foreground">
                💡 <strong>Tip:</strong> Compare each option to your ideal choice for that factor
              </div>
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
                      <div className="text-xs font-normal text-muted-foreground mt-1">
                        Weight: {criterion.weight}% 
                        {criterion.weight > 30 && <span className="text-orange-600"> (Very Important!)</span>}
                      </div>
                    </th>
                  ))}
                  <th className="text-center py-3 px-4 font-semibold">Progress</th>
                </tr>
              </thead>
              <tbody>
                {decision.options.map((option, optionIndex) => {
                  const optionCompletion = Math.round(
                    (decision.criteria.filter((c) => getScore(option.id, c.id) !== 0).length / 
                     decision.criteria.length) * 100
                  );
                  
                  return (
                    <tr key={option.id} className="border-b">
                      <td className="py-4 px-4 font-semibold align-top">
                        <div>{option.name}</div>
                        <Badge variant={optionCompletion === 100 ? "default" : "secondary"} className="mt-1">
                          {optionCompletion}% done
                        </Badge>
                      </td>
                      {decision.criteria.map((criterion) => {
                        const currentScore = getScore(option.id, criterion.id);
                        return (
                          <td key={criterion.id} className="py-4 px-4">
                            <div className="space-y-3">
                              <Slider
                                value={[currentScore]}
                                onValueChange={([value]) =>
                                  handleScoreChange(option.id, criterion.id, value)
                                }
                                max={10}
                                min={0}
                                step={1}
                                className="w-full"
                              />
                              <div className="flex justify-between items-center">
                                <Badge 
                                  variant={
                                    currentScore >= 8 ? "default" : 
                                    currentScore >= 6 ? "secondary" : 
                                    currentScore > 0 ? "outline" : "secondary"
                                  }
                                  className={
                                    currentScore >= 8 ? "bg-green-100 text-green-800 border-green-300" :
                                    currentScore >= 6 ? "bg-blue-100 text-blue-800 border-blue-300" :
                                    currentScore >= 3 ? "bg-orange-100 text-orange-800 border-orange-300" :
                                    currentScore > 0 ? "bg-red-100 text-red-800 border-red-300" : ""
                                  }
                                >
                                  {currentScore}/10
                                </Badge>
                                <div className="text-xs text-muted-foreground">
                                  {currentScore >= 8 && "Excellent"}
                                  {currentScore >= 6 && currentScore < 8 && "Good"}  
                                  {currentScore >= 3 && currentScore < 6 && "Poor"}
                                  {currentScore > 0 && currentScore < 3 && "Bad"}
                                  {currentScore === 0 && "Not rated"}
                                </div>
                              </div>
                              {criterion.weight > 25 && currentScore < 7 && currentScore > 0 && (
                                <div className="text-xs text-orange-600 flex items-center gap-1">
                                  <HelpCircle className="w-3 h-3" />
                                  This factor is very important ({criterion.weight}% weight)
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                      <td className="py-4 px-4 text-center">
                        <div className="w-16">
                          <Progress value={optionCompletion} className="h-2" />
                          <div className="text-xs mt-1">{optionCompletion}%</div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Completion status and tips */}
          {!isScoringComplete && (
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Keep Going! {completionPercentage}% Complete
                    </h4>
                    <p className="text-blue-800 dark:text-blue-200">
                      Score all combinations to see your recommendation. 
                      {completionPercentage > 50 ? " You're almost there!" : " Take your time to think about each factor."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isScoringComplete && (
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-green-900 dark:text-green-100">
                        Perfect! All Options Scored
                      </h4>
                      <p className="text-sm text-green-800 dark:text-green-200">
                        Ready to see which option works best for your priorities
                      </p>
                    </div>
                  </div>
                  <Button onClick={onAnalyze} size="lg" className="gap-2">
                    See My Recommendation
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}