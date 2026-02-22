'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, LineChart, Line } from 'recharts';
import type { Decision, AnalysisResult } from '@/lib/decision-engine';
import { analyzeDecision } from '@/lib/decision-engine';
import { exportDecision } from '@/lib/export-utils';
import { Download, Share2, TrendingUp, Award, Zap, ChevronDown, FileText, Database, Table as TableIcon, Globe, BarChart3 } from 'lucide-react';

interface AnalysisResultsProps {
  decision: Decision;
  onSensitivityAnalysis: () => void;
}

const COLORS = ['#2563eb', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'];

export function AnalysisResults({
  decision,
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
        <Card className="border-green-200 dark:border-green-800/50 bg-gradient-to-br from-green-50 to-green-50/50 dark:from-green-950/20 dark:to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-green-600" />
              Top Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-400 mb-1">{results[0]?.optionName}</div>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold">{results[0]?.totalScore.toFixed(1)}</div>
              <div className="text-muted-foreground text-sm">/10</div>
            </div>
            <Progress value={(results[0]?.totalScore || 0) / 10 * 100} className="mt-3 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {results[0]?.percentage.toFixed(0)}% confidence score
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800/50 bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-950/20 dark:to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">
              {(results.reduce((sum, r) => sum + r.totalScore, 0) / results.length).toFixed(1)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">across {results.length} option{results.length !== 1 ? 's' : ''}</p>
            <div className="mt-2 text-xs space-y-1">
              <div className="flex justify-between">
                <span>Best:</span>
                <span className="font-semibold">{Math.max(...results.map(r => r.totalScore)).toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span>Worst:</span>
                <span className="font-semibold">{Math.min(...results.map(r => r.totalScore)).toFixed(1)}</span>
              </div>
            </div>
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
                formatter={(value) => typeof value === 'number' ? value.toFixed(2) : value}
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

      {/* Ranking with Progress Bars */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Rankings & Scores
          </CardTitle>
          <CardDescription>How each option compares</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {results.map((result, index) => (
            <div key={result.optionId} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={index === 0 ? "default" : index === 1 ? "secondary" : "outline"}
                    className="text-base px-3 py-1"
                  >
                    #{result.rank}
                  </Badge>
                  <div>
                    <p className="font-semibold">{result.optionName}</p>
                    <p className="text-xs text-muted-foreground">
                      {result.totalScore.toFixed(2)} / 10
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-primary">
                    {result.percentage.toFixed(0)}%
                  </div>
                </div>
              </div>
              <Progress value={result.totalScore / 10 * 100} className="h-3" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Detailed Results Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Detailed Breakdown
          </CardTitle>
          <CardDescription>Complete score breakdown by criterion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left py-3 px-4 font-semibold">Option</th>
                  <th className="text-center py-3 px-4 font-semibold">Rank</th>
                  {decision.criteria.map((criterion) => (
                    <th key={criterion.id} className="text-center py-3 px-4 font-semibold">
                      <div className="whitespace-nowrap text-xs">{criterion.name.substring(0, 12)}</div>
                      <div className="font-normal text-xs text-muted-foreground">{criterion.weight}% wt</div>
                    </th>
                  ))}
                  <th className="text-center py-3 px-4 font-semibold">Total Score</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((result, idx) => (
                  <tr key={result.optionId} className={idx !== comparisonData.length - 1 ? 'border-b' : ''}>
                    <td className="py-3 px-4 font-semibold">{result.optionName}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={idx === 0 ? "default" : "outline"}>
                        #{result.rank}
                      </Badge>
                    </td>
                    {result.scores.map((score) => (
                      <td key={score.criterionName} className="py-3 px-4 text-center">
                        <Badge 
                          variant="outline" 
                          className={score.score >= 7 ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50' : 'bg-secondary'}
                        >
                          {score.score.toFixed(1)}
                        </Badge>
                      </td>
                    ))}
                    <td className="py-3 px-4 text-center font-bold bg-primary/5 rounded border">
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
      <div className="grid grid-cols-2 gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export Report
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem onClick={() => exportDecision(decision, results, 'txt')} className="gap-2">
              <FileText className="w-4 h-4" />
              <div>
                <div className="font-medium">Text Report</div>
                <div className="text-xs text-muted-foreground">Detailed formatted report</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportDecision(decision, results, 'pdf')} className="gap-2">
              <Globe className="w-4 h-4" />
              <div>
                <div className="font-medium">PDF Ready (HTML)</div>
                <div className="text-xs text-muted-foreground">Professional formatted report</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => exportDecision(decision, results, 'excel')} className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <div>
                <div className="font-medium">Excel Format</div>
                <div className="text-xs text-muted-foreground">Spreadsheet with multiple sheets</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportDecision(decision, results, 'csv')} className="gap-2">
              <TableIcon className="w-4 h-4" />
              <div>
                <div className="font-medium">CSV Data</div>
                <div className="text-xs text-muted-foreground">Simple tabular format</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportDecision(decision, results, 'json')} className="gap-2">
              <Database className="w-4 h-4" />
              <div>
                <div className="font-medium">JSON Data</div>
                <div className="text-xs text-muted-foreground">Structured data format</div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          onClick={onSensitivityAnalysis}
          className="gap-2"
        >
          <Zap className="w-4 h-4" />
          Test Sensitivity
        </Button>
      </div>
    </div>
  );
}
