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
      name: 'Decision Clarity',
      level: stdDev > 3 ? 'high' : stdDev > 2 ? 'medium' : 'low',
      score: stdDev > 3 ? 75 : stdDev > 2 ? 40 : 15,
      description: stdDev > 3 
        ? 'High variation across criteria suggests unclear priorities' 
        : stdDev > 2 
        ? 'Some inconsistency in how the option performs'
        : 'Strong and consistent performance across criteria',
    },
    {
      name: 'Option Diversity',
      level: concentrationRisk > 60 ? 'high' : concentrationRisk > 30 ? 'medium' : 'low',
      score: Math.min(100, concentrationRisk),
      description: concentrationRisk > 60
        ? 'Limited alternatives with strong scores - consider reconsidering other options'
        : concentrationRisk > 30
        ? 'Moderate risk - few strong alternatives available'
        : 'Good diversity of strong options reduces risk',
    },
    {
      name: 'Weight Certainty',
      level: decision.criteria.some(c => c.weight < 10) ? 'medium' : 'low',
      score: decision.criteria.some(c => c.weight < 10) ? 35 : 10,
      description: decision.criteria.some(c => c.weight < 10)
        ? 'Some criteria have very low weights - consider their actual importance'
        : 'Weights are well-distributed across all criteria',
    },
    {
      name: 'Recommendation Confidence',
      level: topOption.totalScore > 8 ? 'low' : topOption.totalScore > 6 ? 'medium' : 'high',
      score: Math.max(0, 100 - (topOption.totalScore * 10)),
      description: topOption.totalScore > 8
        ? 'Highly confident in this recommendation'
        : topOption.totalScore > 6
        ? 'Moderate confidence - consider runner-up options'
        : 'Low confidence - results are close, review carefully',
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
      <div className="grid gap-4">
        {riskFactors.map((factor, index) => (
          <Card key={index} className={`border-l-4 ${
            factor.level === 'critical' ? 'border-l-red-500' :
            factor.level === 'high' ? 'border-l-orange-500' :
            factor.level === 'medium' ? 'border-l-yellow-500' :
            'border-l-green-500'
          }`}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{factor.name}</h4>
                      <Badge variant="outline" className={getRiskColor(factor.level)}>
                        {factor.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{factor.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">Risk Score</span>
                    <span>{Math.round(factor.score)}/100</span>
                  </div>
                  <Progress value={factor.score} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Uncertain Criteria */}
      {highVarianceCriteria.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              ⚡ Where Options Differ Most
            </CardTitle>
            <CardDescription>
              These criteria have the biggest differences between your options - they're important decision factors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {highVarianceCriteria.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{item.criterion.name}</p>
                    <Badge variant="secondary">{item.variance.toFixed(1)} σ</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Options score very differently on this criterion. This creates uncertainty about trade-offs.
                  </div>
                </div>
              ))}
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
