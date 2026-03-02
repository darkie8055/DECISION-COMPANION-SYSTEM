'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import type { Decision, AnalysisResult } from '@/lib/decision-engine';
import { performSensitivityAnalysis } from '@/lib/decision-engine';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Info } from 'lucide-react';

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
      {/* Plain Language Explanation */}
      <Alert className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800">
        <Lightbulb className="h-5 w-5 text-purple-600" />
        <AlertTitle className="text-base font-bold mb-2">🔍 What is Sensitivity Analysis?</AlertTitle>
        <AlertDescription className="text-sm space-y-2">
          <p>
            This lets you test <strong>"What if?"</strong> scenarios. What if you cared MORE or LESS about a specific criterion? 
            Would your best choice change?
          </p>
          <p className="font-semibold">
            Use this to: Check if your winner is stable, or if a small change in priorities would flip the recommendation.
          </p>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>🎛️ Test Different Scenarios</CardTitle>
          <CardDescription>
            See how your winner changes when you adjust the importance of each criterion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Choose which criterion to test:</label>
            <Select value={selectedCriterion} onValueChange={setSelectedCriterion}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {decision.criteria.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} (Currently {c.weight}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-900 dark:text-blue-100">
            <p className="flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                <strong>How to read this:</strong> The chart below shows what happens to each option's score 
                when you change <strong>{criterion.name}</strong> from 0% (not important at all) to 100% (extremely important). 
                Lines crossing means the winner would change!
              </span>
            </p>
          </div>

          {/* Line chart */}
          <div>
            <h3 className="font-semibold mb-4">📈 How Scores Change</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="weight"
                  label={{ value: `${criterion.name} Importance (%)`, position: 'insideBottomRight', offset: -5 }}
                />
                <YAxis domain={[0, 10]} label={{ value: 'Score (0-10)', angle: -90, position: 'insideLeft' }} />
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
                    strokeWidth={2}
                    isAnimationActive={true}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Impact comparison */}
          <div>
            <h3 className="font-semibold mb-4">📊 Three Key Scenarios</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Compare scores when <strong>{criterion.name}</strong> has: No importance (0%), Medium importance (50%), and Maximum importance (100%)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <p className="font-semibold mb-1">✨ What This Means For You:</p>
            <p>
              Right now, <strong>{criterion.name}</strong> is set to {originalScore}% importance. 
              {Math.max(...baseResults.map((r) => r.totalScore)) - Math.min(...baseResults.map((r) => r.totalScore)) > 2
                ? ` If you change this weight significantly, your top choice could change. Consider if this percentage truly reflects how important this criterion is to you.`
                : ` Your top choice stays the same even if you adjust this weight - that's a good sign of a stable decision!`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
