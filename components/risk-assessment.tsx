'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingDown, Zap, Shield, Info } from 'lucide-react';
import type { Decision } from '@/lib/decision-engine';
import { analyzeDecision } from '@/lib/decision-engine';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface RiskAssessmentProps {
  decision: Decision;
}

interface RiskFactor {
  name: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  description: string;
}

export function RiskAssessment({ decision }: RiskAssessmentProps) {
  const results = analyzeDecision(decision);
  const topOption = results[0];
  
  // Calculate variance to understand consistency
  const scores = topOption.scores.map(s => s.score);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);
  
  // Calculate concentration risk (if too few options score well)
  const wellScoredOptions = results.filter(r => r.totalScore >= 7).length;
  const concentrationRisk = (results.length - wellScoredOptions) / results.length * 100;
  
  // Find criteria with highest variance
  const criteriaVariance = decision.criteria.map((criterion) => {
    const scores = decision.options.map((option) => {
      const score = decision.scores.find(
        (s) => s.optionId === option.id && s.criterionId === criterion.id
      );
      return score?.score || 0;
    });
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / scores.length;
    return {
      criterion,
      variance: Math.sqrt(variance),
    };
  });
  
  const highVarianceCriteria = criteriaVariance
    .sort((a, b) => b.variance - a.variance)
    .slice(0, 3);

  const riskFactors: RiskFactor[] = [
    {
      name: '📊 How Consistent is Your Winner?',
      level: stdDev > 3 ? 'high' : stdDev > 2 ? 'medium' : 'low',
      score: stdDev > 3 ? 75 : stdDev > 2 ? 40 : 15,
      description: stdDev > 3 
        ? 'Your winner scores very differently across criteria (some high, some low). This suggests you might be unsure what really matters to you.' 
        : stdDev > 2 
        ? 'Your winner has mixed scores - good in some areas, weaker in others. Consider if this balance works for you.'
        : 'Your winner performs consistently well across all criteria - this is a solid, balanced choice.',
    },
    {
      name: '🎯 Do You Have Good Backup Options?',
      level: concentrationRisk > 60 ? 'high' : concentrationRisk > 30 ? 'medium' : 'low',
      score: Math.min(100, concentrationRisk),
      description: concentrationRisk > 60
        ? 'Only one option scored well. If circumstances change, you might not have good alternatives. Consider adding or re-evaluating other options.'
        : concentrationRisk > 30
        ? 'You have a few decent options, but not many strong backups. Worth keeping other choices in mind.'
        : 'Multiple options scored well - if your first choice doesn\'t work out, you have solid alternatives.',
    },
    {
      name: '⚖️ Are Your Priorities Clear?',
      level: decision.criteria.some(c => c.weight < 10) ? 'medium' : 'low',
      score: decision.criteria.some(c => c.weight < 10) ? 35 : 10,
      description: decision.criteria.some(c => c.weight < 10)
        ? 'Some criteria have very low importance (under 10%). If they truly don\'t matter, consider removing them. If they do matter, increase their weight.'
        : 'Your importance ratings are well-distributed - you have a clear sense of what matters.',
    },
    {
      name: '✅ How Sure Are We About This Winner?',
      level: topOption.totalScore > 8 ? 'low' : topOption.totalScore > 6 ? 'medium' : 'high',
      score: Math.max(0, 100 - (topOption.totalScore * 10)),
      description: topOption.totalScore > 8
        ? 'Very confident! Your winner scored over 8/10 - that\'s a strong recommendation.'
        : topOption.totalScore > 6
        ? 'Moderately confident. Your winner is decent (6-8/10) but not outstanding. Check if runner-up options might work better.'
        : 'Low confidence. Your winner scored below 6/10. This suggests none of your options are great - you might need better choices or different criteria.',
    },
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 dark:text-red-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-muted-foreground';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-50 dark:bg-red-950';
      case 'high': return 'bg-orange-50 dark:bg-orange-950';
      case 'medium': return 'bg-yellow-50 dark:bg-yellow-950';
      case 'low': return 'bg-green-50 dark:bg-green-950';
      default: return 'bg-secondary';
    }
  };

  const overallRiskLevel = riskFactors.reduce((sum, f) => sum + (f.level === 'critical' ? 4 : f.level === 'high' ? 3 : f.level === 'medium' ? 2 : 1), 0) / riskFactors.length;
  const overallRisk: 'low' | 'medium' | 'high' | 'critical' = overallRiskLevel > 3 ? 'high' : overallRiskLevel > 2 ? 'medium' : 'low';

  return (
    <div className="space-y-6">
      {/* Simple Explanation */}
      <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <Info className="h-5 w-5 text-blue-600" />
        <AlertTitle className="text-base font-bold mb-2">🛡️ What is Risk Assessment?</AlertTitle>
        <AlertDescription className="text-sm space-y-2">
          <p>
            This section helps you understand potential problems or uncertainties with your choice. 
            Think of it as a "safety check" before you make your final decision.
          </p>
          <p className="font-semibold">
            Lower risk = More confident in the decision | Higher risk = Need to be more careful
          </p>
        </AlertDescription>
      </Alert>

      {/* Overall Risk Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            🎯 Your Decision Safety Score
          </CardTitle>
          <CardDescription>
            How confident should you feel about this decision?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={`p-6 rounded-lg border-2 ${getRiskBgColor(overallRisk)}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Risk Level</p>
                <h3 className={`text-2xl font-bold ${getRiskColor(overallRisk)} capitalize`}>
                  {overallRisk}
                </h3>
              </div>
              <AlertTriangle className={`w-12 h-12 ${getRiskColor(overallRisk)}`} />
            </div>
            <p className="text-sm">
              {overallRisk === 'low' && 'Your decision appears well-founded with limited risk factors.'}
              {overallRisk === 'medium' && 'Moderate risk factors exist. Review recommended mitigation strategies below.'}
              {overallRisk === 'high' && 'Significant risk factors identified. Consider alternatives or implement mitigation strategies.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Individual Risk Factors */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">🔍 Four Safety Checks</h3>
          <p className="text-xs text-muted-foreground">
            Lower scores = lower risk
          </p>
        </div>
        
        <div className="grid gap-4">
          {riskFactors.map((factor, index) => (
            <Card key={index} className={`border-l-4 transition-all hover:shadow-md ${
              factor.level === 'critical' ? 'border-l-red-500 bg-red-50/30 dark:bg-red-950/10' :
              factor.level === 'high' ? 'border-l-orange-500 bg-orange-50/30 dark:bg-orange-950/10' :
              factor.level === 'medium' ? 'border-l-yellow-500 bg-yellow-50/30 dark:bg-yellow-950/10' :
              'border-l-green-500 bg-green-50/30 dark:bg-green-950/10'
            }`}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h4 className="font-semibold text-base">{factor.name}</h4>
                        <Badge 
                          variant={factor.level === 'low' ? 'default' : 'outline'} 
                          className={`${getRiskColor(factor.level)} ${
                            factor.level === 'low' ? 'bg-green-100 dark:bg-green-950 border-green-300' : ''
                          }`}
                        >
                          {factor.level === 'low' ? '✓ Good' : factor.level === 'medium' ? '⚠ Caution' : '⚠ Warning'}
                        </Badge>
                      </div>
                      <p className="text-sm leading-relaxed">{factor.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">Risk Level</span>
                      <span className={`font-semibold ${getRiskColor(factor.level)}`}>
                        {Math.round(factor.score)}/100
                      </span>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={factor.score} 
                        className={`h-2.5 ${
                          factor.level === 'low' ? '[&>div]:bg-green-500' :
                          factor.level === 'medium' ? '[&>div]:bg-yellow-500' :
                          '[&>div]:bg-orange-500'
                        }`}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground italic">
                      {factor.level === 'low' && '✓ This looks good - no concerns here'}
                      {factor.level === 'medium' && '⚠ Worth reviewing - minor concern'}
                      {factor.level === 'high' && '⚠ Needs attention - consider addressing this'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Uncertain Criteria */}
      {highVarianceCriteria.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              ⚡ The Biggest Decision Factors
            </CardTitle>
            <CardDescription>
              These criteria show the biggest differences between your options - they're what's really driving your choice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 rounded-lg mb-5 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-1">💡 Why this matters:</p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    When options score very differently on a criterion, that criterion becomes super important to your decision. 
                    Make sure you're comfortable with how you weighted these!
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {highVarianceCriteria.map((item, index) => {
                const impactLevel = item.variance < 2 ? 'Small' : item.variance < 3 ? 'Medium' : 'Large';
                const impactColor = item.variance < 2 
                  ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
                  : item.variance < 3
                  ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                  : 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800';
                
                return (
                  <Card key={index} className="border-l-4 border-l-primary bg-gradient-to-r from-muted/30 to-transparent">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h4 className="font-semibold text-base">{item.criterion.name}</h4>
                              <Badge variant="outline" className={`${impactColor} font-medium`}>
                                {impactLevel} Impact
                              </Badge>
                            </div>
                            <p className="text-sm leading-relaxed">
                              {item.variance < 2 
                                ? 'Your options have somewhat different scores here - this criterion has moderate influence on your choice.'
                                : item.variance < 3
                                ? 'Your options score quite differently here - this is a key factor separating your choices.'
                                : 'Your options score VERY differently here - this is a major driver of your decision. Double-check its importance!'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">Current Importance:</span>
                            <Badge variant="secondary" className="text-sm font-semibold">
                              {item.criterion.weight}%
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">Score Spread:</span>
                            <span className="text-xs font-mono font-semibold">
                              {item.variance.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        
                        {item.variance >= 3 && (
                          <div className="bg-orange-50 dark:bg-orange-950/30 p-3 rounded-md border border-orange-200 dark:border-orange-800">
                            <p className="text-xs text-orange-800 dark:text-orange-200 flex items-center gap-2">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>
                                <strong>High variance detected:</strong> Consider using sensitivity analysis to test how changing this criterion's weight affects your winner.
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5" />
            💡 Tips to Reduce Risk
          </CardTitle>
          <CardDescription>Actions you can take to make a more confident decision</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            {stdDev > 2.5 && (
              <li className="flex gap-3">
                <span className="text-primary font-bold">1.</span>
                <span>Clarify your priorities - scores vary significantly across criteria. Ensure weights truly reflect importance.</span>
              </li>
            )}
            {concentrationRisk > 50 && (
              <li className="flex gap-3">
                <span className="text-primary font-bold">2.</span>
                <span>Limited alternatives available. Consider exploring more options before finalizing the decision.</span>
              </li>
            )}
            {topOption.totalScore < 7 && (
              <li className="flex gap-3">
                <span className="text-primary font-bold">3.</span>
                <span>Even the top option scores below 7/10. Re-evaluate criteria or options - a perfect choice may be possible.</span>
              </li>
            )}
            {highVarianceCriteria.length > 0 && (
              <li className="flex gap-3">
                <span className="text-primary font-bold">4.</span>
                <span>Investigate the high-variance criteria further. These drive much of the risk in your decision.</span>
              </li>
            )}
            <li className="flex gap-3">
              <span className="text-primary font-bold">5.</span>
              <span>Use sensitivity analysis to test how changes in criteria weights affect your final recommendation.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
