'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import type { Decision, AnalysisResult } from '@/lib/decision-engine';
import { performSensitivityAnalysis } from '@/lib/decision-engine';

interface SensitivityAnalysisProps {
  decision: Decision;
}

const COLORS = ['#2563eb', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'];

export function SensitivityAnalysis({ decision }: SensitivityAnalysisProps) {
  const [selectedCriterion, setSelectedCriterion] = useState(decision.criteria[0]?.id || '');

  if (!decision.criteria.length) {
    return (
      <Card>
        <CardContent className="pt-6">No criteria to analyze</CardContent>
      </Card>
    );
  }

  const criterion = decision.criteria.find((c) => c.id === selectedCriterion);
  if (!criterion) return null;

  // Generate weight ranges for sensitivity analysis
  const weights = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const analysisResults = performSensitivityAnalysis(decision, selectedCriterion, weights);

  // Prepare line chart data
  const chartData = weights.map((weight, index) => {
    const results = analysisResults[index].results;
    const data: any = { weight };
    results.forEach((result, idx) => {
      data[result.optionName] = parseFloat(result.totalScore.toFixed(2));
    });
    return data;
  });

  // Prepare impact analysis table
  const originalScore = decision.criteria.find((c) => c.id === selectedCriterion)?.weight || 0;
  const baseResults = analysisResults.find((r) => r.weight === originalScore)?.results || [];

  const impactData = [0, 50, 100].map((weight) => {
    const results = analysisResults.find((r) => r.weight === weight)?.results || [];
    return {
      weight,
      results,
    };
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sensitivity Analysis</CardTitle>
          <CardDescription>
            See how changes in criterion weights affect the overall ranking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Criterion to Analyze</label>
            <Select value={selectedCriterion} onValueChange={setSelectedCriterion}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {decision.criteria.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-900 dark:text-blue-100">
            <p>
              <strong>What this shows:</strong> See how each option{"'"}s score changes as you adjust the weight 
              of the {criterion.name} criterion from 0% to 100%. This helps identify how sensitive 
              your decision is to changes in this factor.
            </p>
          </div>

          {/* Line chart */}
          <div>
            <h3 className="font-semibold mb-4">Score Trajectory</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="weight"
                  label={{ value: `${criterion.name} Weight (%)`, position: 'insideBottomRight', offset: -5 }}
                />
                <YAxis domain={[0, 10]} label={{ value: 'Total Score', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  formatter={(value) => (typeof value === 'number' ? value.toFixed(2) : value)}
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                  }}
                />
                <Legend />
                {decision.options.map((option, idx) => (
                  <Line
                    key={option.id}
                    type="monotone"
                    dataKey={option.name}
                    stroke={COLORS[idx % COLORS.length]}
                    isAnimationActive={true}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Impact comparison */}
          <div>
            <h3 className="font-semibold mb-4">Impact Comparison</h3>
            <div className="grid grid-cols-3 gap-4">
              {impactData.map((item) => (
                <div key={item.weight} className="border rounded-lg p-4">
                  <h4 className="font-medium text-sm mb-3">
                    {criterion.name} @ {item.weight}%
                  </h4>
                  <div className="space-y-2 text-sm">
                    {item.results.map((result) => (
                      <div key={result.optionId} className="flex justify-between items-center">
                        <span className="truncate">{result.optionName}</span>
                        <span className="font-semibold">{result.totalScore.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key insights */}
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-sm text-green-900 dark:text-green-100">
            <p>
              <strong>Insight:</strong> {criterion.name} is currently weighted at {originalScore}%. 
              {Math.max(...baseResults.map((r) => r.totalScore)) - Math.min(...baseResults.map((r) => r.totalScore)) > 2
                ? ` The ranking would change significantly if you adjust this weight.`
                : ` The ranking is fairly stable with this criterion's current weight.`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
