'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import type { Decision, AnalysisResult } from '@/lib/decision-engine';
import { analyzeDecision } from '@/lib/decision-engine';
import { Download, Share2 } from 'lucide-react';

interface AnalysisResultsProps {
  decision: Decision;
  onExport: (decision: Decision, results: AnalysisResult[]) => void;
  onSensitivityAnalysis: () => void;
}

const COLORS = ['#2563eb', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'];

export function AnalysisResults({
  decision,
  onExport,
  onSensitivityAnalysis,
}: AnalysisResultsProps) {
  const results = useMemo(() => analyzeDecision(decision), [decision]);

  // Prepare data for bar chart
  const chartData = results.map((result) => ({
    name: result.optionName,
    score: parseFloat(result.totalScore.toFixed(2)),
    percentage: parseFloat(result.percentage.toFixed(1)),
  }));

  // Prepare data for radar chart
  const radarData = decision.criteria.map((criterion) => {
    const dataPoint: any = {
      criterion: criterion.name,
      weight: criterion.weight,
    };
    results.forEach((result, index) => {
      const score = result.scores.find((s) => s.criterionName === criterion.name);
      dataPoint[`Option ${String.fromCharCode(65 + index)}`] = score?.score || 0;
    });
    return dataPoint;
  });

  // Prepare detailed comparison
  const comparisonData = results.map((result) => ({
    ...result,
    scores: result.scores,
    weightedScores: result.weightedScores,
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Top Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{results[0]?.optionName}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Score: {results[0]?.totalScore.toFixed(2)}/10
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">
              {(results.reduce((sum, r) => sum + r.totalScore, 0) / results.length).toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">across all options</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Score Spread</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-3">
              {(Math.max(...results.map((r) => r.totalScore)) - Math.min(...results.map((r) => r.totalScore))).toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">between highest and lowest</p>
          </CardContent>
        </Card>
      </div>

      {/* Overall Score Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Score Comparison</CardTitle>
          <CardDescription>Weighted scores for all options</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 10]} />
              <Tooltip
                formatter={(value) => value.toFixed(2)}
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                }}
              />
              <Bar dataKey="score" fill="#2563eb" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Breakdown</CardTitle>
          <CardDescription>Score breakdown by criterion for each option</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 font-semibold">Option</th>
                  <th className="text-right py-2 px-4 font-semibold">Rank</th>
                  {decision.criteria.map((criterion) => (
                    <th key={criterion.id} className="text-right py-2 px-4 font-semibold">
                      <div>{criterion.name.substring(0, 15)}</div>
                      <div className="font-normal text-xs text-muted-foreground">{criterion.weight}%</div>
                    </th>
                  ))}
                  <th className="text-right py-2 px-4 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((result) => (
                  <tr key={result.optionId} className="border-b hover:bg-secondary/50">
                    <td className="py-3 px-4 font-medium">{result.optionName}</td>
                    <td className="py-3 px-4 text-right font-bold">{result.rank}</td>
                    {result.scores.map((score) => (
                      <td key={score.criterionName} className="py-3 px-4 text-right">
                        {score.score.toFixed(1)}
                      </td>
                    ))}
                    <td className="py-3 px-4 text-right font-bold bg-primary/5">
                      {result.totalScore.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          onClick={() => onExport(decision, results)}
          variant="outline"
          className="flex-1"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
        <Button
          onClick={onSensitivityAnalysis}
          variant="outline"
          className="flex-1"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Sensitivity Analysis
        </Button>
      </div>
    </div>
  );
}
